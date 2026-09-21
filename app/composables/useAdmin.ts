import { createClient } from '@supabase/supabase-js'

export const useAdmin = () => {
  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabaseUrl, config.public.supabaseKey)
  const router = useRouter()

  const currentUser = useState('admin_currentUser', () => null)
  const userEmail = useState('admin_userEmail', () => '')
  const showDropdown = useState('admin_showDropdown', () => false)
  const activeTab = useState('admin_activeTab', () => 'home')
  const isLoading = useState('admin_isLoading', () => true)
  
  const allEvents = useState('admin_allEvents', () => [])
  const selectedEvent = useState('admin_selectedEvent', () => null)
  const showArsip = useState('admin_showArsip', () => false)

  const daftarPeserta = useState('admin_daftarPeserta', () => [])
  const isLoadingPeserta = useState('admin_isLoadingPeserta', () => false)
  
  const formEditEvent = useState('admin_formEditEvent', () => ({ nama: '', slug: '', tanggal: '', lokasi: '', deskripsi: '', status: 'published' }))
  const isSavingEdit = useState('admin_isSavingEdit', () => false)

  const showWizard = useState('admin_showWizard', () => false)
  const wizardStepNow = useState('admin_wizardStepNow', () => 1)
  
  const formEvent = useState('admin_formEvent', () => ({ 
    nama: '', slug: '', tanggal: '', lokasi: '', deskripsi: '', link_maps: '',
    tipe_event: 'offline', sistem_checkin: 'scanner', target_absen: 0, link_online: '',
    is_snk_active: true, snk_text: 'Syarat dan ketentuan berlaku mengikuti aturan panitia EventHub.',
    is_anti_calo_email: false, is_anti_calo_wa: false, is_wa_konfirm: false,
    is_donasi_active: false, donasi_header: '', donasi_options: '',
    is_grup_wa_active: false, link_grup_wa: '',
    poster_file: null, poster_preview: null 
  }))
  const formTiketBaru = useState('admin_formTiketBaru', () => ({ nama: '', harga: '', kuota: '', buka: '', tutup: '' }))
  const wizardTiketList = useState('admin_wizardTiketList', () => [])
  const formForgeItems = useState('admin_formForgeItems', () => [])
  const isSavingEvent = useState('admin_isSavingEvent', () => false)
  
  const totalPeserta = computed(() => daftarPeserta.value.length)
  const totalLunas = computed(() => daftarPeserta.value.filter(p => p.status_bayar === 'lunas').length)
  const totalPending = computed(() => daftarPeserta.value.filter(p => p.status_bayar === 'pending').length)
  const totalHadir = computed(() => daftarPeserta.value.filter(p => p.status_hadir).length)
  const persenHadir = computed(() => totalLunas.value === 0 ? 0 : Math.round((totalHadir.value / totalLunas.value) * 100))

  const userName = computed(() => userEmail.value ? userEmail.value.split('@')[0] : 'Admin')
  const userInitials = computed(() => userName.value.substring(0, 2).toUpperCase())
  
  const eventAktif = computed(() => {
    const today = new Date()
    today.setHours(0,0,0,0)
    return allEvents.value.filter(ev => {
      const isArsip = ev.status === 'archived' || ev.is_archived === true
      const evDate = ev.tanggal_mulai ? new Date(ev.tanggal_mulai) : null
      if (evDate) evDate.setHours(0,0,0,0)
      return !isArsip && !(ev.status === 'finished' || (evDate && evDate < today))
    })
  })
  
  const eventSelesai = computed(() => {
    const today = new Date()
    today.setHours(0,0,0,0)
    return allEvents.value.filter(ev => {
      const isArsip = ev.status === 'archived' || ev.is_archived === true
      const evDate = ev.tanggal_mulai ? new Date(ev.tanggal_mulai) : null
      if (evDate) evDate.setHours(0,0,0,0)
      return !isArsip && (ev.status === 'finished' || (evDate && evDate < today))
    })
  })
  
  const eventArsip = computed(() => allEvents.value.filter(ev => ev.status === 'archived' || ev.is_archived === true))

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Tgl blm diset'
    return new Date(dateStr).toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'})
  }

  const muatDaftarEvent = async (userId) => {
    isLoading.value = true
    try {
      const { data, error } = await supabase.from('event').select('*').eq('organizer_id', userId).order('created_at', { ascending: false })
      if (error) throw error
      allEvents.value = data || []
    } catch (err) {
      showToast('Gagal memuat event: ' + err.message, 'error')
    } finally {
      isLoading.value = false
    }
  }

  const muatDaftarPeserta = async () => {
    if (!selectedEvent.value) return
    isLoadingPeserta.value = true
    try {
      const { data, error } = await supabase.from('peserta').select('*').eq('event_id', selectedEvent.value.id).order('created_at', { ascending: false })
      if (error) throw error
      daftarPeserta.value = data || []
    } catch (err) {
      showToast('Gagal memuat peserta: ' + err.message, 'error')
    } finally {
      isLoadingPeserta.value = false
    }
  }

  const prosesLogout = async () => {
    if (confirm('Yakin ingin mengakhiri sesi dan keluar dari aplikasi?')) {
      await supabase.auth.signOut()
      router.push('/login')
    }
  }

  // --- NEW UI STATES ---
  const toastList = useState('admin_toastList', () => [])
  const showToast = (message, type = 'success') => {
    const id = Date.now()
    toastList.value.push({ id, message, type, show: false })
    setTimeout(() => {
      const toast = toastList.value.find(t => t.id === id)
      if (toast) toast.show = true
    }, 10)
    setTimeout(() => {
      const toast = toastList.value.find(t => t.id === id)
      if (toast) toast.show = false
      setTimeout(() => {
        toastList.value = toastList.value.filter(t => t.id !== id)
      }, 400)
    }, 3000)
  }

  const confirmData = useState('admin_confirm', () => ({ show: false, title: '', message: '', actionText: '', type: 'success', callback: null }))
  const showConfirm = (title, message, actionText, type, callback) => {
    confirmData.value = { show: true, title, message, actionText, type, callback }
  }
  const closeConfirm = () => {
    confirmData.value.show = false
  }

  const isOnline = useState('admin_isOnline', () => true)
  const showOnboarding = useState('admin_showOnboarding', () => false)
  const organizerProfile = useState('admin_organizerProfile', () => null)

  const muatProfilOrganizer = async () => {
    try {
      if (!currentUser.value) return
      const { data, error } = await supabase.from('organizer_profile').select('*').eq('id', currentUser.value.id).single()
      if (data && !error) {
        organizerProfile.value = data
        if (!data.nama_organizer) showOnboarding.value = true
      } else {
        showOnboarding.value = true
      }
    } catch (e) {
      showOnboarding.value = true
    }
  }

  return {
    supabase,
    currentUser, userEmail, showDropdown, activeTab, isLoading,
    allEvents, selectedEvent, showArsip,
    daftarPeserta, isLoadingPeserta, formEditEvent, isSavingEdit,
    showWizard, wizardStepNow, formEvent, formTiketBaru, wizardTiketList, isSavingEvent, formForgeItems,
    totalPeserta, totalLunas, totalPending, totalHadir, persenHadir,
    userName, userInitials, eventAktif, eventSelesai, eventArsip,
    formatDate, muatDaftarEvent, muatDaftarPeserta, prosesLogout,
    toastList, showToast, confirmData, showConfirm, closeConfirm, isOnline, showOnboarding, organizerProfile, muatProfilOrganizer
  }
}
