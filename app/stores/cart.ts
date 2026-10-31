import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // ── State ──────────────────────────────────────────
  const keranjang = ref<Record<string, number>>({})
  const donasiAmount = ref<number>(0)
  const currentEventSlug = ref<string>('')

  // ── Getters ────────────────────────────────────────
  const totalQty = computed(() => {
    return Object.values(keranjang.value).reduce((sum, qty) => sum + qty, 0)
  })

  // Menghitung total harga tiket berdasarkan list tiket yang aktif
  const calculateTotalPrice = (tickets: any[] = []) => {
    let total = 0
    for (const id in keranjang.value) {
      const qty = keranjang.value[id]
      const tiket = tickets.find(t => String(t.id) === String(id))
      if (tiket && qty > 0) {
        total += (qty * tiket.harga)
      }
    }
    return total
  }

  // ── Actions ────────────────────────────────────────
  const updateKeranjang = (
    tiketId: string | number, 
    change: number, 
    sisaKuota: number,
    options?: {
      maxTicketsLimit?: number
      onWarning?: (msg: string) => void
    }
  ) => {
    const idStr = String(tiketId)
    const currentQty = keranjang.value[idStr] || 0
    let newQty = currentQty + change

    if (newQty < 0) newQty = 0

    const notifyWarning = (msg: string) => {
      if (options?.onWarning) {
        options.onWarning(msg)
      } else if (typeof window !== 'undefined' && (window as any).Swal) {
        ;(window as any).Swal.fire({
          icon: 'warning',
          title: 'Perhatian',
          text: msg,
          confirmButtonColor: '#0C387A'
        })
      }
    }

    if (newQty > sisaKuota) {
      notifyWarning(`Sisa tiket hanya ${sisaKuota}.`)
      newQty = sisaKuota
    }

    const maxLimit = options?.maxTicketsLimit || 0
    if (maxLimit > 0) {
      let otherQty = 0
      for (const k in keranjang.value) {
        if (k !== idStr) otherQty += keranjang.value[k]
      }
      if (otherQty + newQty > maxLimit) {
        notifyWarning(`Anda hanya bisa membeli maksimal ${maxLimit} tiket per transaksi.`)
        newQty = maxLimit - otherQty
      }
    }

    keranjang.value[idStr] = newQty
  }

  const setDonasi = (amount: number) => {
    donasiAmount.value = amount >= 0 ? amount : 0
  }

  // Set event slug aktif; jika berpindah event, otomatis reset tiket sebelumnya
  const setEventSlug = (slug: string) => {
    if (currentEventSlug.value && currentEventSlug.value !== slug) {
      resetKeranjang()
    }
    currentEventSlug.value = slug
  }

  // Sinkronisasi dengan tiket yang benar-benar aktif/tersedia saat ini
  const syncWithAvailableTickets = (activeTickets: any[] = []) => {
    if (!activeTickets || activeTickets.length === 0) {
      keranjang.value = {}
      return
    }
    const validIds = new Set(activeTickets.map(t => String(t.id)))
    for (const id in keranjang.value) {
      if (!validIds.has(String(id))) {
        delete keranjang.value[id]
      }
    }
  }

  const resetKeranjang = () => {
    keranjang.value = {}
    donasiAmount.value = 0
  }

  return {
    keranjang,
    donasiAmount,
    currentEventSlug,
    totalQty,
    calculateTotalPrice,
    updateKeranjang,
    setDonasi,
    setEventSlug,
    syncWithAvailableTickets,
    resetKeranjang
  }
}, {
  // Simpan state di localStorage / client session secara otomatis
  persist: true
})
