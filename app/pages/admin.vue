<template>
  <div class="admin-layout">
    <AdminSidebar />
    
    <div class="main">
      <AdminTopbar />

      <div class="content">
        <AdminHome v-if="activeTab === 'home'" />
        <AdminEventDetail v-else-if="activeTab === 'event' && selectedEvent" />
        <AdminPeserta v-else-if="activeTab === 'peserta' && selectedEvent" />
        <AdminEditEvent v-else-if="activeTab === 'edit' && selectedEvent" />
        <div v-else-if="activeTab !== 'home' && activeTab !== 'event' && activeTab !== 'peserta' && activeTab !== 'edit'" style="padding: 40px; text-align: center; color: #8a9aa8;">
          <h2>Halaman {{ activeTab }}</h2>
          <p>Fitur ini akan ditambahkan di tahap selanjutnya bray! 🚀</p>
        </div>
      </div>
    </div>

    <AdminWizard />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import AdminSidebar from '~/components/admin/AdminSidebar.vue'
import AdminTopbar from '~/components/admin/AdminTopbar.vue'
import AdminHome from '~/components/admin/AdminHome.vue'
import AdminEventDetail from '~/components/admin/AdminEventDetail.vue'
import AdminPeserta from '~/components/admin/AdminPeserta.vue'
import AdminEditEvent from '~/components/admin/AdminEditEvent.vue'
import AdminWizard from '~/components/admin/AdminWizard.vue'

definePageMeta({
  middleware: ['auth']
})

useHead({
  title: 'EventHub · Organizer',
  bodyAttrs: { style: 'margin: 0; background: #f8fafc; overflow: hidden; font-family: Inter, sans-serif;' }
})

const { activeTab, selectedEvent, currentUser, userEmail, muatDaftarEvent, supabase } = useAdmin()
const router = useRouter()

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    alert('Sesi telah berakhir. Mengalihkan ke halaman Login...')
    router.push('/login')
    return
  }
  
  currentUser.value = user
  userEmail.value = user.email
  await muatDaftarEvent(user.id)
})
</script>

<style>
/* CSS VARIABLES DI LEVEL GLOBAL UNTUK ADMIN */
:root {
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --primary-shadow: rgba(37, 99, 235, 0.35);
  --bg-body: #f8fafc;
  --text-main: #0f172a;
}

.admin-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  background: #f8fafc;
  color: #0f172a;
}

/* ── SIDEBAR ── */
.sidebar { width: 248px; background: #ffffff; border-right: 1px solid #e6edf5; display: flex; flex-direction: column; flex-shrink: 0; padding: 28px 18px 24px 18px; height: 100vh; box-shadow: 2px 0 12px rgba(0, 0, 0, 0.02); }
.sidebar .logo { font-size: 22px; font-weight: 700; padding: 0 6px 32px 6px; display: flex; align-items: center; gap: 10px; color: #0a1929; letter-spacing: -0.5px; }
.sidebar .logo span { background: #1a3a5c; color: white; font-size: 11px; font-weight: 600; padding: 2px 12px; border-radius: 40px; }
.sidebar nav { flex: 1; }
.sidebar nav .menu-label { font-size: 11px; font-weight: 600; color: #8a9aa8; text-transform: uppercase; padding: 4px 6px 8px 6px; }
.sidebar nav a { display: flex; align-items: center; gap: 14px; padding: 10px 14px; margin: 2px 0; border-radius: 12px; font-size: 14px; font-weight: 500; color: #4a5a6e; cursor: pointer; transition: all 0.2s ease; }
.sidebar nav a:hover:not(.disabled) { background: #f0f4fa; color: #0a1929; }
.sidebar nav a.active { background: #2563eb; color: white; box-shadow: 0 4px 14px -4px rgba(37, 99, 235, 0.35); }
.sidebar nav a.disabled { opacity: 0.45; cursor: not-allowed; }
.sidebar .bottom { padding: 16px 6px 0 6px; border-top: 1px solid #e6edf5; margin-top: 8px; }
.sidebar .bottom a { display: flex; align-items: center; gap: 14px; padding: 8px 0; font-size: 14px; font-weight: 500; color: #4a5a6e; cursor: pointer; }

/* ── MAIN & TOPBAR ── */
.main { flex: 1; display: flex; flex-direction: column; min-width: 0; height: 100vh; overflow: hidden; background: #f0f4f9; }
.topbar { background: #ffffff; padding: 16px 36px; border-bottom: 1px solid #e6edf5; display: flex; justify-content: space-between; align-items: center; height: 72px; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02); }
.topbar .greeting { font-size: 17px; font-weight: 600; color: #0a1929; }
.topbar .greeting small { font-weight: 400; font-size: 14px; color: #8a9aa8; margin-left: 8px; }
.topbar .right { display: flex; align-items: center; gap: 20px; position: relative; }
.avatar { width: 42px; height: 42px; border-radius: 50%; background: #2563eb; display: flex; align-items: center; justify-content: center; font-weight: 600; color: white; cursor: pointer; border: 2px solid transparent; box-shadow: 0 2px 8px rgba(37, 99, 235, 0.35); }

/* DROPDOWN */
.user-dropdown { display: none; position: absolute; top: 54px; right: 0; background: #ffffff; min-width: 240px; border-radius: 16px; box-shadow: 0 16px 48px -8px rgba(0, 0, 0, 0.15); border: 1px solid #e6edf5; padding: 18px 20px; z-index: 100; }
.user-dropdown.show { display: block; }
.user-dropdown .name { font-weight: 600; font-size: 15px; color: #0a1929; }
.user-dropdown .email { font-size: 13px; color: #8a9aa8; margin-bottom: 12px; }
.user-dropdown hr { border: 0; border-top: 1px solid #e6edf5; margin: 10px 0; }
.btn-logout { width: 100%; padding: 10px; background: #d43f34; color: white; border: none; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer; }
.btn-outline { background: transparent; border: 1px solid #d6e0ea; color: #4a5a6e; padding: 8px 20px; border-radius: 40px; font-weight: 500; font-size: 13px; cursor: pointer; }
.btn-primary { width: 100%; padding: 12px; border: none; border-radius: 12px; font-weight: 600; background: var(--primary); color: white; cursor: pointer; }

/* Form Control */
.form-control { width: 100%; padding: 10px 14px; border: 1px solid #d6e0ea; border-radius: 12px; font-size: 14px; font-family: Inter, sans-serif; background: #fafcfe; color: #0a1929; transition: 0.2s; box-sizing: border-box; }
.form-control:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15); }
textarea.form-control { resize: vertical; min-height: 60px; }

/* ── CONTENT & CARDS ── */
.content { flex: 1; padding: 28px 36px 36px 36px; overflow-y: auto; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 32px; }
.stat-card { background: #ffffff; border-radius: 18px; padding: 20px 24px 22px 24px; border: 1px solid #e6edf5; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02); }
.stat-card .label { font-size: 13px; font-weight: 500; color: #8a9aa8; }
.stat-card .value { font-size: 32px; font-weight: 700; color: #0a1929; margin-top: 4px; }
.stat-card .sub { font-size: 13px; color: #8a9aa8; margin-top: 4px; }

.section-header { display: flex; justify-content: space-between; align-items: center; margin: 0 0 16px 0; }
.section-header h3 { font-size: 18px; font-weight: 600; color: #0a1929; }
.section-header .action { color: #1a3a5c; font-weight: 600; font-size: 14px; cursor: pointer; background: none; border: none; padding: 6px 14px; border-radius: 30px; transition: 0.2s; }
.section-header .action:hover { background: #eef3f9; }

.event-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 18px; margin-bottom: 28px; }
.event-card { background: #ffffff; border-radius: 18px; border: 1px solid #e6edf5; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02); cursor: pointer; position: relative; transition: all 0.25s ease; }
.event-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px -10px rgba(26, 58, 92, 0.12); border-color: #c8d6e8; }
.event-card .thumb { height: 110px; background: linear-gradient(145deg, #2563eb, #3b82f6); display: flex; align-items: center; justify-content: center; color: white; font-size: 32px; background-size: cover; background-position: center; position: relative;}
.event-card .thumb.gray { background: linear-gradient(145deg, #5a6a7a, #7a8a9a); }
.event-card .body { padding: 16px 18px 18px 18px; }
.event-card .body .title { font-weight: 600; font-size: 15px; color: #0a1929; }
.event-card .body .meta { font-size: 13px; color: #8a9aa8; margin-top: 4px; }
.status-badge { display: inline-block; font-size: 11px; font-weight: 600; padding: 2px 14px; border-radius: 40px; margin-top: 8px; }
.status-badge.active { background: #e4f0e8; color: #1a6a4a; }
.status-badge.off { background: #fde8e6; color: #b83228; }
.status-badge.archived { background: #eef3f9; color: #7a8a9a; }

.badge-selesai { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-12deg); background: rgba(255, 255, 255, 0.9); color: #b83228; border: 3px double #b83228; font-size: 15px; font-weight: 900; padding: 6px 18px; border-radius: 8px; letter-spacing: 1.5px; }
.event-card.finished, .event-card.archived { opacity: 0.7; }
.event-card.archived { border-style: dashed; }

.loader-container { display: flex; flex-direction: column; align-items: center; padding: 40px; color: #8a9aa8; }
.spinner { width: 32px; height: 32px; border: 3px solid #e6edf5; border-top-color: #2563eb; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 12px; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── WIZARD OVERLAY ── */
.wizard-overlay { display: none; position: fixed; inset: 0; background: rgba(10, 25, 41, 0.5); backdrop-filter: blur(6px); z-index: 999; justify-content: center; align-items: center; padding: 24px; }
.wizard-overlay.open { display: flex; }
.wizard { background: #ffffff; border-radius: 28px; max-width: 1220px; width: 100%; height: 92vh; padding: 32px 38px; box-shadow: 0 48px 96px -24px rgba(0, 0, 0, 0.3); position: relative; display: flex; flex-direction: column; }
.wizard .close { position: absolute; top: 20px; right: 28px; font-size: 24px; cursor: pointer; color: #8a9aa8; background: none; border: none; transition: 0.2s; }
.wizard .close:hover { color: #0a1929; }

.step-indicator { display: flex; gap: 20px; margin-bottom: 28px; font-size: 14px; font-weight: 500; color: #8a9aa8; }
.step-indicator span.active { color: #2563eb; font-weight: 600; }
.step-indicator span.completed { color: #1a6a4a; font-weight: 600; }
.step-indicator .num { background: #f0f4fa; padding: 2px 14px; border-radius: 40px; margin-right: 4px; }
.step-indicator span.active .num { background: #2563eb; color: white; }
.step-indicator span.completed .num { background: #e4f0e8; color: #1a6a4a; }

.wiz-step { display: flex; flex-direction: column; flex: 1; overflow-y: auto; }
.nav-buttons { display: flex; justify-content: space-between; margin-top: auto; padding-top: 18px; border-top: 1px solid #e6edf5; }
</style>