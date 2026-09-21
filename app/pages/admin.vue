<template>
  <div class="admin-layout">
    <AdminSidebar v-show="activeTab !== 'home'" />
    
    <div class="main">
      <AdminTopbar />

      <div class="content" id="pageContent" @click="showDropdown = false">
        <AdminHome v-if="activeTab === 'home'" />
        <AdminEventDetail v-else-if="activeTab === 'event' && selectedEvent" />
        <AdminTiket v-else-if="activeTab === 'tiket' && selectedEvent" />
        <AdminPeserta v-else-if="activeTab === 'peserta' && selectedEvent" />
        <AdminEditEvent v-else-if="activeTab === 'edit' && selectedEvent" />
        <AdminSettings v-else-if="activeTab === 'settings'" />
        <div v-else-if="activeTab !== 'home' && activeTab !== 'event' && activeTab !== 'peserta' && activeTab !== 'edit' && activeTab !== 'settings' && activeTab !== 'tiket'" style="padding: 40px; text-align: center; color: #8a9aa8;">
          <h2>Halaman {{ activeTab }}</h2>
          <p>Fitur ini akan ditambahkan di tahap selanjutnya bray! 🚀</p>
        </div>
      </div>
    </div>

    <AdminWizard />
    <AdminOnboarding />
    <AdminConfirm />
    <AdminToast />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import AdminSidebar from '~/components/admin/AdminSidebar.vue'
import AdminTopbar from '~/components/admin/AdminTopbar.vue'
import AdminHome from '~/components/admin/AdminHome.vue'
import AdminEventDetail from '~/components/admin/AdminEventDetail.vue'
import AdminTiket from '~/components/admin/AdminTiket.vue'
import AdminPeserta from '~/components/admin/AdminPeserta.vue'
import AdminEditEvent from '~/components/admin/AdminEditEvent.vue'
import AdminSettings from '~/components/admin/AdminSettings.vue'
import AdminWizard from '~/components/admin/AdminWizard.vue'
import AdminOnboarding from '~/components/admin/AdminOnboarding.vue'
import AdminConfirm from '~/components/admin/AdminConfirm.vue'
import AdminToast from '~/components/admin/AdminToast.vue'

definePageMeta({
  middleware: ['auth']
})

useHead({
  title: 'EventHub · Organizer',
  bodyAttrs: { style: 'margin: 0; background: #f8fafc; overflow: hidden; font-family: Inter, sans-serif;' }
})

const { activeTab, selectedEvent, currentUser, userEmail, muatDaftarEvent, supabase, showDropdown, isOnline, showToast, muatProfilOrganizer } = useAdmin()
const router = useRouter()

const setOnline = () => { isOnline.value = true; showToast('Koneksi internet kembali pulih!', 'success') }
const setOffline = () => { isOnline.value = false; showToast('Anda offline. Sistem tidak bisa menyimpan perubahan saat ini.', 'error') }

onMounted(async () => {
  window.addEventListener('online', setOnline)
  window.addEventListener('offline', setOffline)
  if (!navigator.onLine) setOffline()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    alert('Sesi telah berakhir. Mengalihkan ke halaman Login...')
    router.push('/login')
    return
  }
  
  currentUser.value = user
  userEmail.value = user.email
  await muatProfilOrganizer()
  await muatDaftarEvent(user.id)
})

onUnmounted(() => {
  window.removeEventListener('online', setOnline)
  window.removeEventListener('offline', setOffline)
})
</script>

<style>
/* ── CSS VARIABLES (PALET WARNA) ── */
:root {
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --primary-shadow: rgba(37, 99, 235, 0.35);
  --bg-body: #f8fafc;
  --text-main: #0f172a;
}

* { box-sizing: border-box; }
body { letter-spacing: -0.01em; }

::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: #e8edf4; border-radius: 20px; }
::-webkit-scrollbar-thumb { background: #bcc8d8; border-radius: 20px; }

.admin-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  background: #f8fafc;
  color: #0f172a;
}

/* ── SIDEBAR ── */
.sidebar { width: 248px; background: #ffffff; border-right: 1px solid #e6edf5; display: flex; flex-direction: column; flex-shrink: 0; padding: 28px 18px 24px 18px; height: 100vh; position: sticky; top: 0; overflow-y: auto; box-shadow: 2px 0 12px rgba(0, 0, 0, 0.02); }
.sidebar .logo { font-size: 22px; font-weight: 700; padding: 0 6px 32px 6px; display: flex; align-items: center; gap: 10px; color: #0a1929; letter-spacing: -0.5px; }
.sidebar .logo span { background: #1a3a5c; color: white; font-size: 11px; font-weight: 600; padding: 2px 12px; border-radius: 40px; letter-spacing: 0.3px; }
.sidebar nav { flex: 1; }
.sidebar nav .menu-label { font-size: 11px; font-weight: 600; color: #8a9aa8; text-transform: uppercase; letter-spacing: 0.6px; padding: 4px 6px 8px 6px; }
.sidebar nav a { display: flex; align-items: center; gap: 14px; padding: 10px 14px; margin: 2px 0; border-radius: 12px; font-size: 14px; font-weight: 500; color: #4a5a6e; text-decoration: none; transition: all 0.2s ease; cursor: pointer; }
.sidebar nav a:hover { background: #f0f4fa; color: #0a1929; }
.sidebar nav a.active { background: var(--primary); color: white; box-shadow: 0 4px 14px -4px var(--primary-shadow); }
.sidebar nav a.active .icon { filter: brightness(10); }
.sidebar nav a.disabled { opacity: 0.45; cursor: not-allowed; pointer-events: none; }
.sidebar .bottom { padding: 16px 6px 0 6px; border-top: 1px solid #e6edf5; margin-top: 8px; }
.sidebar .bottom a { display: flex; align-items: center; gap: 14px; padding: 8px 0; font-size: 14px; font-weight: 500; color: #4a5a6e; cursor: pointer; transition: 0.2s; }
.sidebar .bottom a:hover { color: #0a1929; }
.sidebar .icon { font-size: 18px; width: 24px; text-align: center; }

/* ── MAIN & TOPBAR ── */
.main { flex: 1; display: flex; flex-direction: column; min-width: 0; height: 100vh; overflow: hidden; background: #f0f4f9; }
.topbar { background: #ffffff; padding: 16px 36px; border-bottom: 1px solid #e6edf5; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; height: 72px; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02); }
.topbar .greeting { font-size: 17px; font-weight: 600; color: #0a1929; letter-spacing: -0.3px; }
.topbar .greeting small { font-weight: 400; font-size: 14px; color: #8a9aa8; margin-left: 8px; }
.topbar .right { display: flex; align-items: center; gap: 20px; position: relative; }
.avatar { width: 42px; height: 42px; border-radius: 50%; background: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 600; color: white; cursor: pointer; transition: 0.2s; font-size: 16px; border: 2px solid transparent; box-shadow: 0 2px 8px var(--primary-shadow); }
.avatar:hover { border-color: var(--primary); box-shadow: 0 4px 14px var(--primary-shadow); }

/* DROPDOWN */
.user-dropdown { display: none; position: absolute; top: 54px; right: 0; background: #ffffff; min-width: 240px; border-radius: 16px; box-shadow: 0 16px 48px -8px rgba(0, 0, 0, 0.15); border: 1px solid #e6edf5; padding: 18px 20px; z-index: 100; }
.user-dropdown.show { display: block; }
.user-dropdown .name { font-weight: 600; font-size: 15px; color: #0a1929; }
.user-dropdown .email { font-size: 13px; color: #8a9aa8; margin-bottom: 12px; }
.user-dropdown hr { border: 0; border-top: 1px solid #e6edf5; margin: 10px 0; }
.btn-logout { width: 100%; padding: 10px; background: #d43f34; color: white; border: none; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer; transition: 0.2s; font-family: 'Inter', sans-serif; }
.btn-logout:hover { background: #b83228; box-shadow: 0 4px 12px rgba(212, 63, 52, 0.3); }

/* ── BUTTONS & FORMS ── */
.btn-outline { background: transparent; border: 1px solid #d6e0ea; color: #4a5a6e; padding: 8px 20px; border-radius: 40px; font-weight: 500; font-size: 13px; cursor: pointer; transition: 0.2s; font-family: 'Inter', sans-serif; }
.btn-outline:hover { background: #f0f4fa; border-color: #b8c8d8; }
.btn-outline.danger { border-color: #f0c8c8; color: #b83228; }
.btn-outline.danger:hover { background: #fde8e6; border-color: #b83228; }
.btn-primary { background: var(--primary); color: white; border: none; padding: 8px 22px; border-radius: 40px; font-weight: 600; font-size: 13px; cursor: pointer; transition: 0.2s; font-family: 'Inter', sans-serif; letter-spacing: 0.2px; }
.btn-primary:hover { background: var(--primary-hover); box-shadow: 0 4px 14px -4px var(--primary-shadow); }
.btn-success { background: #1a6a4a; color: white; border: none; padding: 8px 20px; border-radius: 40px; font-weight: 600; font-size: 13px; cursor: pointer; transition: 0.2s; font-family: 'Inter', sans-serif; }
.btn-success:hover { background: #2a7a5a; box-shadow: 0 4px 14px -4px rgba(26, 106, 74, 0.3); }
.btn-sm { padding: 4px 14px !important; font-size: 11px !important; }
.btn-icon { background: none; border: none; cursor: pointer; font-size: 16px; padding: 4px 10px; border-radius: 8px; transition: 0.15s; color: #4a5a6e; }
.btn-icon:hover { background: #f0f4fa; color: #0a1929; }
.btn-icon.danger:hover { background: #fde8e6; color: #b83228; }

.form-control { width: 100%; padding: 10px 14px; border: 1px solid #d6e0ea; border-radius: 12px; font-size: 14px; font-family: 'Inter', sans-serif; background: #fafcfe; color: var(--text-main); transition: 0.2s; box-sizing: border-box; }
.form-control:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-shadow); }
textarea.form-control { resize: vertical; min-height: 60px; }
.filter-control { padding: 10px 18px; border: 1px solid #d6e0ea; border-radius: 40px; background: #fafcfe; font-family: 'Inter', sans-serif; font-size: 14px; color: var(--text-main); transition: 0.2s; }
.filter-control:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-shadow); }
.form-label { font-size: 12px; color: #8a9aa8; font-weight: 600; margin-bottom: 6px; display: block; text-transform: uppercase; letter-spacing: 0.3px; }
.form-file { width: 100%; padding: 6px 0; border: none; font-family: 'Inter', sans-serif; color: var(--text-main); }
.checkbox-item { display: flex; align-items: center; gap: 8px; font-weight: 400; font-size: 14px; cursor: pointer; }
.checkbox-item input[type="checkbox"] { width: 18px; height: 18px; accent-color: var(--primary); cursor: pointer; }

/* ── CONTENT & CARDS ── */
.content { flex: 1; padding: 28px 36px 36px 36px; overflow-y: auto; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 32px; }
.stat-card { background: #ffffff; border-radius: 18px; padding: 20px 24px 22px 24px; border: 1px solid #e6edf5; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02); transition: all 0.25s ease; }
.stat-card:hover { border-color: #c8d6e8; box-shadow: 0 6px 20px -6px rgba(26, 58, 92, 0.08); }
.stat-card .label { font-size: 13px; font-weight: 500; color: #8a9aa8; letter-spacing: 0.2px; }
.stat-card .value { font-size: 32px; font-weight: 700; color: #0a1929; margin-top: 4px; letter-spacing: -0.5px; }
.stat-card .sub { font-size: 13px; color: #8a9aa8; margin-top: 4px; font-weight: 400; }

.section-header { display: flex; justify-content: space-between; align-items: center; margin: 0 0 16px 0; }
.section-header h3 { font-size: 18px; font-weight: 600; color: #0a1929; letter-spacing: -0.3px; }
.section-header .action { color: #1a3a5c; font-weight: 600; font-size: 14px; cursor: pointer; background: none; border: none; font-family: 'Inter', sans-serif; padding: 6px 14px; border-radius: 30px; transition: 0.2s; }
.section-header .action:hover { background: #eef3f9; }

.event-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 18px; margin-bottom: 28px; }
.event-card { background: #ffffff; border-radius: 18px; border: 1px solid #e6edf5; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02); transition: all 0.25s ease; cursor: pointer; position: relative; }
.event-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px -10px rgba(26, 58, 92, 0.12); border-color: #c8d6e8; }
.event-card .thumb { height: 110px; background: linear-gradient(145deg, var(--primary), #3b82f6); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 32px; position: relative; }
.event-card .thumb.gray { background: linear-gradient(145deg, #5a6a7a, #7a8a9a); opacity: 0.8; }
.event-card .body { padding: 16px 18px 18px 18px; }
.event-card .body .title { font-weight: 600; font-size: 15px; color: #0a1929; letter-spacing: -0.2px; }
.event-card .body .meta { font-size: 13px; color: #8a9aa8; margin-top: 4px; display: flex; gap: 12px; flex-wrap: wrap; }
.status-badge { display: inline-block; font-size: 11px; font-weight: 600; padding: 2px 14px; border-radius: 40px; margin-top: 8px; letter-spacing: 0.2px; }
.status-badge.active { background: #e4f0e8; color: #1a6a4a; }
.status-badge.off { background: #fde8e6; color: #b83228; }
.status-badge.archived { background: #eef3f9; color: #7a8a9a; }
.badge-selesai { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-12deg); background: rgba(255, 255, 255, 0.9); color: #b83228; border: 3px double #b83228; font-size: 15px; font-weight: 900; padding: 6px 18px; border-radius: 8px; letter-spacing: 1.5px; text-transform: uppercase; box-shadow: 0 8px 16px rgba(0,0,0,0.15); backdrop-filter: blur(2px); z-index: 2; }
.event-card.finished { opacity: 0.85; cursor: default; }
.event-card.archived { opacity: 0.6; cursor: default; border-style: dashed; border-color: #d6e0ea; }
.event-card.finished:hover, .event-card.archived:hover { transform: none; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02); border-color: #d6e0ea; }

@keyframes pulseGlow {
  0% { box-shadow: 0 0 2px #1a6a4a, 0 0 4px #1a6a4a; opacity: 0.8; }
  100% { box-shadow: 0 0 8px #1a6a4a, 0 0 12px #2d8a6a; opacity: 1; }
}

.loader-container { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; color: #8a9aa8; grid-column: 1 / -1; }
.spinner { width: 32px; height: 32px; border: 3px solid #e6edf5; border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 12px; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── TABLE ── */
.table-wrap { background: #ffffff; border-radius: 18px; border: 1px solid #e6edf5; overflow: auto; margin-top: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02); }
table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 640px; }
th { text-align: left; padding: 14px 20px; background: #f7faff; font-weight: 600; color: #4a5a6e; border-bottom: 1px solid #e6edf5; font-size: 12px; text-transform: uppercase; letter-spacing: 0.4px; }
td { padding: 13px 20px; border-bottom: 1px solid #f0f4fa; color: #1a2332; }
tr:last-child td { border-bottom: none; }
.status-pill { display: inline-block; padding: 3px 16px; border-radius: 40px; font-size: 12px; font-weight: 600; letter-spacing: 0.2px; }
.status-pill.green { background: #e4f0e8; color: #1a6a4a; }
.status-pill.orange { background: #fdf0e4; color: #b8681a; }

/* ── PANEL ── */
.panel { background: #ffffff; border-radius: 18px; border: 1px solid #e6edf5; padding: 24px 28px; margin-top: 20px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02); }
.row { display: flex; gap: 28px; flex-wrap: wrap; }
.col { flex: 1; min-width: 180px; }
.panel label { font-weight: 500; font-size: 12px; color: #8a9aa8; text-transform: uppercase; letter-spacing: 0.4px; display: block; margin-bottom: 4px; }
.panel .value { font-size: 15px; font-weight: 500; color: #0a1929; margin-bottom: 14px; }
.panel .desc { color: #4a5a6e; font-size: 14px; line-height: 1.7; }

/* ── WIZARD OVERLAY ── */
.wizard-overlay { display: none; position: fixed; inset: 0; background: rgba(10, 25, 41, 0.5); backdrop-filter: blur(6px); z-index: 999; justify-content: center; align-items: center; padding: 24px; }
.wizard-overlay.open { display: flex; }
.wizard { background: #ffffff; border-radius: 28px; max-width: 1220px; width: 100%; max-height: 92vh; overflow: hidden; padding: 32px 38px; box-shadow: 0 48px 96px -24px rgba(0, 0, 0, 0.3); position: relative; display: flex; flex-direction: column; }
.wizard .close { position: absolute; top: 20px; right: 28px; font-size: 24px; cursor: pointer; color: #8a9aa8; background: none; border: none; transition: 0.2s; }
.wizard .close:hover { color: #0a1929; }
.step-indicator { display: flex; gap: 20px; margin-bottom: 28px; font-size: 14px; font-weight: 500; color: #8a9aa8; }
.step-indicator .active { color: var(--primary); font-weight: 600; }
.step-indicator .completed { color: #1a6a4a; font-weight: 600; }
.step-indicator .num { background: #f0f4fa; padding: 2px 14px; border-radius: 40px; margin-right: 4px; }
.step-indicator .active .num { background: var(--primary); color: white; }
.step-indicator .completed .num { background: #e4f0e8; color: #1a6a4a; }

.wiz-grid { display: flex; gap: 32px; flex-wrap: wrap; flex: 1; overflow: hidden; min-height: 0; }
.wiz-grid .left { flex: 1.2; min-width: 280px; overflow-y: auto; padding-right: 12px; height: 100%; }
.wiz-grid .right { flex: 0 0 290px; }
.wiz-step { display: none; }
.wiz-step.active { display: flex; flex-direction: column; flex: 1; overflow: hidden; min-height: 0; animation: stepFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes stepFadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
.nav-buttons { display: flex; justify-content: space-between; margin-top: auto; padding-top: 18px; border-top: 1px solid #e6edf5; }

/* ── UTILS ── */
.flex { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
.mt-1 { margin-top: 8px; }
.mb-1 { margin-bottom: 6px; }
.mb-3 { margin-bottom: 16px; }
.text-muted { color: #8a9aa8; font-size: 13px; }
.w-full { width: 100%; }
.fw-600 { font-weight: 600; }
.page-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 18px; }
.page-title { font-size: 22px; font-weight: 600; color: var(--text-main); letter-spacing: -0.3px; }
.preview-sticky { flex: 0 0 290px; position: sticky; top: 20px; align-self: flex-start; }

</style>