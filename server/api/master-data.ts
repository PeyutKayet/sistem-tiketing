import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  // Hanya Super Admin yang boleh akses
  await checkSuperAdmin(event)

  const supabase = await serverSupabaseServiceRole(event)
  
  // Ambil Data Peserta (Settlement)
  const { data: pData } = await supabase
    .from('peserta')
    .select(`id, nama_lengkap, nama_tiket, created_at, kategori_tiket (harga), event (nama_event)`)
    .eq('status_bayar', 'paid')
    .eq('status_dana', 'PENDING')
    .order('created_at', { ascending: true })
    .limit(500)

  // Ambil Data Penarikan Dana (Withdrawal)
  const { data: wData } = await supabase
    .from('penarikan_dana')
    .select(`id, nominal, bank_tujuan, rekening_tujuan, atas_nama, created_at, status, organizer_profile (nama_organizer)`)
    .in('status', ['REQUEST', 'PENDING'])
    .order('created_at', { ascending: true })
    .limit(200)

  return { pendingTransactions: pData || [], withdrawalRequests: wData || [] }
})
