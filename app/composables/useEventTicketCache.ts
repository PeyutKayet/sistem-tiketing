interface CachedTicketData {
  tickets: any[]
  timestamp: number
  secret?: string | null
}

// Map promise in-flight untuk mencegah request ganda pada event yang sama di saat bersamaan
const inFlightTicketPromises = new Map<string, Promise<any[]>>()

export const useEventTicketCache = () => {
  const supabase = useSupabaseClient()
  const ticketCache = useState<Record<string, CachedTicketData>>('global_ticket_cache', () => ({}))

  /**
   * Mengambil data tiket dan kuota penjualan dari Supabase
   */
  const fetchTicketsData = async (eventId: string, secret?: string | null): Promise<any[]> => {
    let tktQuery = supabase.from('kategori_tiket')
      .select('id, nama_kategori, harga, kuota_maksimal')
      .eq('event_id', eventId)
      .eq('is_active', true)

    if (secret && typeof secret === 'string') {
      tktQuery = tktQuery.or(`is_hidden.eq.false,secret_token.eq.${secret}`)
    } else {
      tktQuery = tktQuery.eq('is_hidden', false)
    }

    const [tktRes, salesRes] = await Promise.all([
      tktQuery,
      supabase.rpc('get_ticket_sales', { p_event_id: eventId })
    ])

    if (tktRes?.error) throw tktRes.error

    const tktData = tktRes.data || []
    const salesData = salesRes?.data || []

    const processedTickets = tktData.map((t: any) => {
      const sales = salesData.find((s: any) => s.kategori_id === t.id)
      const terjual = sales ? sales.terjual : 0
      const isUnlimited = t.kuota_maksimal == 0
      const sisa = isUnlimited ? 999999 : t.kuota_maksimal - terjual
      return { ...t, is_unlimited: isUnlimited, sisa_kuota: sisa < 0 ? 0 : sisa }
    })

    // Simpan ke cache memory client (TTL 60 detik)
    ticketCache.value[eventId] = {
      tickets: processedTickets,
      timestamp: Date.now(),
      secret: secret || null
    }

    return processedTickets
  }

  /**
   * Prefetch tiket saat kartu disentuh (touch) atau di-hover di halaman beranda
   */
  const prefetchTickets = (eventId: string) => {
    if (!eventId) return

    // Jika data di cache masih segar (< 60 detik), lewati
    const cached = ticketCache.value[eventId]
    if (cached && (Date.now() - cached.timestamp < 60000)) {
      return
    }

    // Jika sedang dalam proses fetch, lewati
    if (inFlightTicketPromises.has(eventId)) {
      return
    }

    const promise = fetchTicketsData(eventId)
      .catch(err => {
        console.warn('[Prefetch] Gagal prefetch tiket:', err)
        return []
      })
      .finally(() => {
        inFlightTicketPromises.delete(eventId)
      })

    inFlightTicketPromises.set(eventId, promise)
  }

  /**
   * Ambil data tiket: dari cache jika ada, dari prefetch in-flight jika sedang berjalan, atau query baru
   */
  const getTickets = async (eventId: string, secret?: string | null): Promise<any[]> => {
    if (!eventId) return []

    // 1. Cek cache (jika masih berlaku < 60 detik dan secret sesuai)
    const cached = ticketCache.value[eventId]
    const isSecretMatch = !secret || cached?.secret === secret
    if (cached && isSecretMatch && (Date.now() - cached.timestamp < 60000)) {
      return cached.tickets
    }

    // 2. Cek apakah ada in-flight promise (dari prefetch touch/hover)
    if (inFlightTicketPromises.has(eventId) && !secret) {
      return inFlightTicketPromises.get(eventId)!
    }

    // 3. Eksekusi query baru
    const promise = fetchTicketsData(eventId, secret)
      .finally(() => {
        inFlightTicketPromises.delete(eventId)
      })

    inFlightTicketPromises.set(eventId, promise)
    return promise
  }

  /**
   * Hapus cache tiket event tertentu jika kuota perlu disegarkan (misal setelah transaksi)
   */
  const invalidateTicketCache = (eventId?: string) => {
    if (eventId) {
      delete ticketCache.value[eventId]
    } else {
      ticketCache.value = {}
    }
  }

  return {
    ticketCache,
    prefetchTickets,
    getTickets,
    invalidateTicketCache
  }
}
