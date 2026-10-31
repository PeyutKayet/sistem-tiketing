<template>
  <div class="page" id="page">

        <!-- SCENE: ABSTRACT DASHBOARD -->
    <section class="scene" id="scene">
      <div class="scene-bg">
          <div class="quote-box">
            <div class="quote-text">Create<br>Manage<br>Celebrate</div>
            <div class="quote-line"></div>
          </div>
          
          <div class="abstract-graphic t1">
            <div class="t-title">VIP Access</div>
            <div class="t-line"></div>
            <div class="t-row"><span>GUEST</span><span>Ahmad Muhsin</span></div>
            <ClientOnly>
              <div class="t-row"><span>DATE</span><span>{{ realTimeDate }}</span></div>
              <div class="t-row" style="margin-top:-6px;"><span>TIME</span><span>{{ realTimeClock }}</span></div>
              <template #fallback>
                <div class="t-row"><span>DATE</span><span>— — —</span></div>
                <div class="t-row" style="margin-top:-6px;"><span>TIME</span><span>--:--:--</span></div>
              </template>
            </ClientOnly>
            <div class="t-barcode"></div>
          </div>
          
          <div class="abstract-graphic t2">
            <div class="s-title">Tiket Terjual</div>
            <div class="s-value">1,248</div>
            <div class="s-bars">
              <div class="bar" style="height: 30%; background: rgba(255,255,255,0.4);"></div>
              <div class="bar" style="height: 60%; background: rgba(255,255,255,0.6);"></div>
              <div class="bar" style="height: 40%; background: rgba(255,255,255,0.8);"></div>
              <div class="bar" style="height: 80%; background: rgba(255,255,255,0.9);"></div>
              <div class="bar" style="height: 100%; background: white;"></div>
            </div>
          </div>
      </div> 
    </section>

    <!-- FORM LOGIN -->
    <section class="login-card">
      <div class="logo">
        <img src="/logo-tyket.svg" alt="tyket.id Logo" style="height: 80px; width: auto; object-fit: contain; display: block; margin: 0 auto 5px;" />
        <small>ORGANIZER CREATOR</small>
      </div>

      <h1 v-if="!isRegister">Selamat Datang!</h1>
      <h1 v-else>Buat Akun Organizer Creator</h1>
      
      <p class="subtitle" v-if="!isRegister">
        Masuk untuk mengelola event Anda di<br>dashboard Organizer Creator.
      </p>
      <p class="subtitle" v-else>
        Bergabunglah bersama ribuan penyelenggara event lainnya.
      </p>

      <form @submit.prevent="isRegister ? prosesRegister() : prosesLogin()">
        
        <div v-if="isRegister" class="field">
          <span class="icon"><Icon name="lucide:user" /></span>
          <input type="text" v-model="fullName" placeholder="Nama Lengkap / Panggilan" required>
        </div>
        
        <div v-if="isRegister" style="display:flex; gap:6px; margin-bottom:16px;">
          <div class="field" style="width: 75px; margin-bottom:0;">
            <span class="icon" style="left:12px;"><Icon name="lucide:plus" style="width:16px;" /></span>
            <input type="tel" v-model="countryCode" placeholder="62" style="padding: 0 5px 0 32px;" required>
          </div>
          <div class="field" style="flex:1; margin-bottom:0;">
            <span class="icon" style="left:12px;"><Icon name="lucide:phone" style="width:18px;" /></span>
            <input type="tel" v-model="phoneNumberDisplay" placeholder="81234567890" style="padding: 0 10px 0 42px;" required>
          </div>
        </div>

        <div class="field">
          <span class="icon"><Icon name="lucide:mail" /></span>
          <input type="email" v-model="email" placeholder="Email" required>
        </div>

        <div class="field">
          <span class="icon"><Icon name="lucide:lock" /></span>
          <input 
            :type="showPassword ? 'text' : 'password'" 
            v-model="password" 
            placeholder="Password" 
            required
          >
          <button type="button" class="toggle" @click="showPassword = !showPassword" aria-label="Tampilkan password">
            {{ showPassword ? '◉' : '◌' }}
          </button>
        </div>

        <div class="row" v-if="!isRegister">
          <label class="remember">
            <input type="checkbox" v-model="rememberMe"> Ingat saya
          </label>
          <a href="#">Lupa password?</a>
        </div>

        <button class="btn" type="submit" :disabled="isLoadingBtn">
          <template v-if="!isRegister">{{ isLoadingBtn === 'login' ? 'Memproses...' : 'Masuk ➔' }}</template>
          <template v-else>{{ isLoadingBtn === 'register' ? 'Mendaftarkan...' : 'Daftar Sekarang ➔' }}</template>
        </button>

        <div class="divider">atau</div>

        <button v-if="!isRegister" class="signup" type="button" @click="isRegister = true">
          <svg style="width:18px;height:18px;margin-right:4px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
          Buat Akun Baru
        </button>
        <button v-else class="signup" type="button" @click="isRegister = false">
          Kembali ke Login
        </button>
        
        <div style="text-align: center; margin-top: 16px; font-size: 12px; color: #64748b; font-weight: 500;">
          <svg style="width:12px;height:12px;display:inline;vertical-align:middle;margin-right:4px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg> Aman, nyaman, dan profesional.
        </div>

        <div id="msg" :style="{ color: msgColor }">{{ msg }}</div>
      </form>

      <div class="legal-disclaimer" style="text-align:center; font-size:11px; color:#94a3b8; margin-top:24px; line-height:1.5;">
        Dengan melanjutkan, Anda menyetujui <br>
        <NuxtLink to="/terms" target="_blank" style="color:var(--primary); text-decoration:none;">Syarat & Ketentuan</NuxtLink> dan <NuxtLink to="/privacy" target="_blank" style="color:var(--primary); text-decoration:none;">Kebijakan Privasi</NuxtLink> kami.
      </div>
      
      <div class="footer">
        © 2026 tyket.id. Semua hak dilindungi.
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

useHead({
  title: 'tyket.id — Login Organizer Creator',
  bodyAttrs: { class: 'login-body-style', style: 'margin:0; background: #f1f5f9;' }
})

const router = useRouter()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

// State
const isRegister = ref(false)
const fullName = ref('')
const countryCode = ref('62')

// Real-time Clock
const realTimeDate = ref('')
const realTimeClock = ref('')
let timerInterval = null

const updateClock = () => {
  const now = new Date()
  realTimeDate.value = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  realTimeClock.value = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

onMounted(() => {
  updateClock()
  timerInterval = setInterval(updateClock, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
const phoneNumberRaw = ref('')
const phoneNumberDisplay = computed({
  get: () => phoneNumberRaw.value,
  set: (val) => {
    let clean = val.replace(/\D/g, '') // Hanya angka
    if (clean.startsWith('0')) clean = clean.substring(1) // Hapus 0 di depan
    if (countryCode.value === '62' && clean.startsWith('62')) clean = clean.substring(2) // Hapus 62 jika tidak sengaja terketik lagi
    phoneNumberRaw.value = clean
  }
})
const phone = computed(() => `${countryCode.value}${phoneNumberRaw.value}`)

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoadingBtn = ref(null) // 'login' | 'register' | null
const msg = ref('')
const msgColor = ref('#d43f34')

const rememberMe = ref(true)
const isLookingAway = ref(false)
const isSuccess = ref(false)

// Redirect if already logged in
watchEffect(() => {
  if (user.value) {
    router.push('/admin')
  }
})

// Cek Sesi saat Mount
onMounted(() => {
  // Pasang listener mousemove buat kamera
  document.addEventListener("mousemove", handleMouseMove)
})

onUnmounted(() => {
  document.removeEventListener("mousemove", handleMouseMove)
})

// Logika Kamera Ngikutin Mouse
const handleMouseMove = (event) => {
  if (isLookingAway.value) return

  document.querySelectorAll(".camera-rig").forEach(rig => {
    const camBody = rig.querySelector(".camera-body")
    const beam = rig.querySelector(".beam")
    const lens = rig.querySelector(".lens")

    const rect = lens.getBoundingClientRect()
    const lensX = rect.left + rect.width / 2
    const lensY = rect.top + rect.height / 2

    const dx = event.clientX - lensX
    const dy = event.clientY - lensY
    const distance = Math.hypot(dx, dy)
    
    let angle = Math.atan2(dy, dx) * (180 / Math.PI)
    camBody.style.transform = `rotate(${angle}deg)`

    beam.style.width = `${distance}px`
    beam.style.opacity = '1'
  })
}

// Logika Supabase Login
const prosesLogin = async () => {
  isLoadingBtn.value = 'login'
  msg.value = ''
  msgColor.value = '#d43f34'

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (error) {
    msg.value = error.message
    isLoadingBtn.value = null
  } else {
    // Set status rememberMe di local storage
    if (rememberMe.value) {
      localStorage.setItem('ingat_saya', 'true')
    } else {
      localStorage.setItem('ingat_saya', 'false')
    }
    
    // Tandai sesi tab ini sebagai sesi aktif pertama
    sessionStorage.setItem('browser_session_active', 'true')

    msgColor.value = '#1a6a4a'
    msg.value = 'Login sukses! Mengalihkan...'
    isSuccess.value = true // Memicu CSS glow kuning pada kamera
    
    setTimeout(() => {
      router.push('/admin') // Redirect ke dashboard admin nanti
    }, 1200)
  }
}

// Logika Supabase Register
const prosesRegister = async () => {
  if (!email.value || !password.value) {
    msgColor.value = '#d43f34'
    msg.value = 'Email dan Password wajib diisi untuk mendaftar.'
    return
  }

  isLoadingBtn.value = 'register'
  msg.value = ''
  msgColor.value = '#d43f34'

  // VALIDASI NOMOR WA GANDA
  try {
    const waCheck = await $fetch('/api/check-wa', {
      method: 'POST',
      body: { no_wa: phone.value }
    })
    
    if (waCheck.used) {
      msgColor.value = '#d43f34'
      msg.value = 'Gagal: Nomor WhatsApp ini sudah digunakan oleh akun lain.'
      isLoadingBtn.value = null
      return
    }
  } catch (err) {
    console.error('Gagal mengecek nomor WA', err)
  }

  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: {
        full_name: fullName.value,
        phone: phone.value
      }
    }
  })

  if (error) {
    msg.value = error.message
    isLoadingBtn.value = null
  } else {
    msgColor.value = '#1a6a4a'
    msg.value = 'Registrasi sukses! Silakan klik "Masuk" untuk melanjutkan.'
    isLoadingBtn.value = null
    password.value = '' 
  }
}
</script>

<style scoped>
/* CSS bawaan dari login.html dengan penyesuaian scoped Nuxt */
:root {
  --blue: var(--accent-main); 
  --text: var(--primary);
  --muted: var(--text-muted);
  --line: var(--border-soft);
}

.page { min-height: 100vh; display: grid; grid-template-columns: minmax(700px, 1.18fr) minmax(520px, .82fr); gap: 18px; padding: 24px 30px; font-family: Inter, sans-serif; color: var(--text); }
.scene { position: relative; min-height: calc(100vh - 48px); z-index: 50; }
.scene-bg { position: absolute; inset: 0; border-radius: 36px; overflow: hidden; background: radial-gradient(circle at 30% 30%, #ffffff 0%, var(--bg-light) 100%); box-shadow: inset 0 0 20px rgba(255,255,255,0.5), 0 18px 55px rgba(0,0,0,.05); z-index: 1; }

.quote-box { position: absolute; top: 60px; left: 60px; z-index: 10; }
.quote-mark { font-size: 80px; font-family: serif; color: var(--line); line-height: 0; position: absolute; top: 30px; left: -20px; opacity: 0.5; }
.quote-text { font-size: 18px; font-weight: 700; color: var(--text); line-height: 1.6; letter-spacing: 0.5px; }
.quote-line { width: 40px; height: 3px; background: var(--accent-yellow); margin-top: 12px; border-radius: 2px; }

.abstract-graphic { position: absolute; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); transition: transform 0.3s; }
.abstract-graphic:hover { transform: translateY(-5px) !important; }
.t1 { bottom: 12%; right: 15%; background: white; padding: 24px; width: 280px; transform: rotate(-6deg); z-index: 5; }
.t1 .t-title { font-weight: 800; font-size: 20px; color: var(--text); margin-bottom: 8px; }
.t1 .t-line { height: 4px; width: 40px; background: var(--blue); border-radius: 4px; margin-bottom: 16px; }
.t1 .t-row { display:flex; justify-content:space-between; font-size:12px; color:var(--muted); margin-bottom:8px; font-weight:600; }
.t1 .t-barcode { margin-top: 20px; height: 45px; background: repeating-linear-gradient(90deg, var(--primary), var(--primary) 2px, transparent 2px, transparent 6px); width: 100%; opacity:0.8; }

.t2 { top: 25%; right: 25%; background: linear-gradient(135deg, var(--accent-main), var(--primary)); padding: 24px; width: 220px; transform: rotate(8deg); box-shadow: 0 15px 30px rgba(18,56,96,0.2); z-index: 4; }
.t2 .s-title { font-weight: 700; font-size: 14px; color: white; opacity: 0.9; }
.t2 .s-value { font-weight: 800; font-size: 36px; color: var(--accent-yellow); margin-top: 4px; }
.t2 .s-bars { display:flex; align-items:flex-end; gap:6px; margin-top: 20px; height:50px; }
.t2 .bar { flex: 1; border-radius: 4px; }


.login-card { position: relative; min-height: calc(100vh - 48px); background: #ffffff; border-radius: 34px; padding: 58px clamp(38px,6vw,92px) 34px; display: flex; flex-direction: column; justify-content: center; box-shadow: 0 18px 55px rgba(0,0,0,.05); overflow: hidden; border: 1px solid var(--line); z-index: 10; }
.logo { text-align: center; font-size: 38px; font-weight: 1000; letter-spacing: -2px; line-height: .8; margin-bottom: 42px; }
.logo .brand-1 { color: var(--text) } .logo .brand-2 { color: var(--blue) }
.logo small { display: block; width: max-content; margin: 12px auto 0; padding: 4px 13px; border-radius: 8px; background: var(--accent-yellow); color: var(--primary); font-size: 10px; font-weight: 800; letter-spacing: 5px; }

h1 { margin: 0; text-align: center; font-size: 30px; letter-spacing: -1px; color: var(--text); }
.subtitle { text-align: center; color: var(--muted); margin: 10px auto 30px; max-width: 430px; line-height: 1.55; font-size: 14px; }

form { width: 100%; max-width: 500px; margin: auto; }
.field { position: relative; margin-bottom: 16px; }
.field input { width: 100%; height: 60px; border: 1.5px solid var(--line); border-radius: 12px; padding: 0 54px 0 54px; font-size: 15px; outline: none; background: #fff; transition: .2s; color: var(--text); }
.field input:focus { border-color: var(--blue); box-shadow: 0 0 0 4px rgba(28, 84, 144,.15); }
.icon { position: absolute; left: 20px; top: 18px; color: #9ba1ab; font-size: 21px; z-index: 2; }
.toggle { position: absolute; right: 18px; top: 18px; border: 0; background: none; font-size: 20px; color: #9299a5; cursor: pointer; }

.row { display: flex; justify-content: space-between; align-items: center; margin: 8px 2px 24px; font-size: 14px; color: var(--muted); }
.remember { display: flex; gap: 9px; align-items: center; }
.remember input { width: 17px; height: 17px; accent-color: var(--blue); cursor: pointer; }
a { color: var(--blue); text-decoration: none; font-weight: 600; }

.btn { width: 100%; height: 58px; border: 0; border-radius: 12px; background: var(--primary); color: #fff; font-size: 16px; font-weight: 700; cursor: pointer; box-shadow: 0 8px 20px rgba(18, 56, 96,.15); transition: .2s; display: flex; justify-content: center; align-items: center; gap: 10px; }
.btn:hover { transform: translateY(-2px); background: var(--blue); }
.btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

.divider { display: flex; align-items: center; gap: 15px; margin: 24px 0; color: var(--muted); font-size: 13px; }
.divider:before, .divider:after { content: ""; height: 1px; background: var(--line); flex: 1; }

.signup { width: 100%; height: 54px; border: 1.5px solid var(--line); border-radius: 12px; background: #fff; color: var(--text); font-size: 15px; font-weight: 700; cursor: pointer; transition: .2s; display: flex; justify-content: center; align-items: center; gap: 10px; }
.signup:hover { background: var(--bg-light); border-color: var(--muted); }
.signup:disabled { opacity: 0.7; cursor: not-allowed; }

#msg { text-align: center; font-size: 13px; font-weight: 600; margin-top: 16px; min-height: 20px; }
.footer { text-align: center; color: #94a3b8; font-size: 12px; margin-top: 28px; }

@media(max-width: 1050px) {
  .page { grid-template-columns: 1fr; padding: 18px; }
  .scene { min-height: 380px; }
  .login-card { min-height: 700px; }
}
@media(max-width: 650px) {
  .page { gap: 18px; padding: 12px; }
  .scene { display: none; } /* Sembunyikan gambar grafis di HP */
  .login-card { padding: 42px 24px 28px; min-height: calc(100vh - 24px); border-radius: 24px; }
  .quote-box { display: none; }
}
</style>

<style>
.login-body-style {
  overflow: hidden;
}
@media(max-width: 1050px) {
  .login-body-style {
    overflow: auto !important;
  }
}
</style>