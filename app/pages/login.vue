<template>
  <div class="page" id="page">

    <!-- SCENE: STUDIO KAMERA -->
    <section class="scene" id="scene" :class="{ 'looking-away': isLookingAway }">
      <div class="scene-bg">
          <div class="quote-box">
            <div class="quote-mark">"</div>
            <div class="quote-text">Create<br>Manage<br>Celebrate</div>
            <div class="quote-line"></div>
          </div>
          
          <div class="pedestal p1"></div>
          <div class="pedestal p2"></div>
          <div class="pedestal p3"></div>
          <div class="pedestal p4"></div>
          
          <div class="sphere s1"></div>
          <div class="sphere s2"></div>

          <div class="plant left">
            <svg viewBox="0 0 100 100" fill="#94a3b8"><path d="M50 100 C50 100 0 80 0 40 C0 0 50 0 50 0 C50 0 100 80 100 40 C100 0 50 0 50 0 Z" opacity="0.5"/></svg>
          </div>
          <div class="plant right">
            <svg viewBox="0 0 100 100" fill="#cbd5e1"><path d="M50 100 C50 100 20 80 20 50 C20 20 50 20 50 20 C50 20 80 80 80 50 C80 20 50 20 50 20 Z" opacity="0.7"/></svg>
          </div>
      </div> 

      <!-- CAMERA 1-4 -->
      <div v-for="i in 4" :key="i" :class="'camera-rig c' + i">
        <div class="stand-pole"></div><div class="stand-base"></div>
        <div class="camera-body">
          <div class="lens">
            <div class="lens-inner" :class="{ 'success-glow': isSuccess }"></div>
            <div class="beam"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- FORM LOGIN -->
    <section class="login-card">
      <div class="logo">
        <span class="event">EVENT</span><span class="hub">HUB</span>
        <small>ORGANIZER</small>
      </div>

      <h1>Selamat Datang Kembali!</h1>
      <p class="subtitle">
        Masuk untuk melanjutkan pengelolaan event<br>
        bersama EventHub.
      </p>

      <form @submit.prevent="prosesLogin">
        <div class="field">
          <span class="icon">✉</span>
          <input type="email" v-model="email" placeholder="Email atau Username" required>
        </div>

        <div class="field">
          <span class="icon">🔒</span>
          <!-- Event focus/blur untuk memutar kamera -->
          <input 
            :type="showPassword ? 'text' : 'password'" 
            v-model="password" 
            placeholder="Password" 
            required
            @focus="isLookingAway = true"
            @blur="isLookingAway = false"
          >
          <button type="button" class="toggle" @click="showPassword = !showPassword" aria-label="Tampilkan password">
            {{ showPassword ? '◉' : '◌' }}
          </button>
        </div>

        <div class="row">
          <label class="remember">
            <input type="checkbox"> Ingat saya
          </label>
          <a href="#">Lupa password?</a>
        </div>

        <button class="btn" type="submit" :disabled="isLoadingBtn === 'login'">
          {{ isLoadingBtn === 'login' ? 'Memproses...' : 'Masuk ➔' }}
        </button>

        <div class="divider">atau</div>

        <button class="signup" type="button" @click="prosesRegister" :disabled="isLoadingBtn === 'register'">
          <svg style="width:18px;height:18px;margin-right:4px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
          {{ isLoadingBtn === 'register' ? 'Mendaftarkan...' : 'Buat Akun Baru' }}
        </button>
        
        <div style="text-align: center; margin-top: 16px; font-size: 12px; color: #64748b; font-weight: 500;">
          <svg style="width:12px;height:12px;display:inline;vertical-align:middle;margin-right:4px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg> Aman, nyaman, dan profesional.
        </div>

        <div id="msg" :style="{ color: msgColor }">{{ msg }}</div>
      </form>

      <div class="footer">
        © 2026 EventHub Project. Semua hak dilindungi.
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { createClient } from '@supabase/supabase-js'

useHead({
  title: 'EventHub — Login Organizer',
  bodyAttrs: { style: 'margin:0; background: #f1f5f9; overflow: hidden;' }
})

const router = useRouter()

// Init Supabase
const SUPABASE_URL = 'https://supabase.e-tiket.web.id'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// State
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoadingBtn = ref(null) // 'login' | 'register' | null
const msg = ref('')
const msgColor = ref('#d43f34')

const isLookingAway = ref(false)
const isSuccess = ref(false)

// Cek Sesi saat Mount
onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) router.push('/admin')

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

  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
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
  --blue: #2563eb; 
  --text: #0f172a;
  --muted: #64748b;
  --line: #e2e8f0;
}

.page { min-height: 100vh; display: grid; grid-template-columns: minmax(700px, 1.18fr) minmax(520px, .82fr); gap: 18px; padding: 24px 30px; font-family: Inter, sans-serif; color: var(--text); }
.scene { position: relative; min-height: calc(100vh - 48px); z-index: 50; }
.scene-bg { position: absolute; inset: 0; border-radius: 36px; overflow: hidden; background: radial-gradient(circle at 30% 30%, #ffffff 0%, #e2e8f0 100%); box-shadow: inset 0 0 20px rgba(255,255,255,0.5), 0 18px 55px rgba(0,0,0,.05); z-index: 1; }

.quote-box { position: absolute; top: 60px; left: 60px; z-index: 10; }
.quote-mark { font-size: 80px; font-family: serif; color: #cbd5e1; line-height: 0; position: absolute; top: 30px; left: -20px; opacity: 0.5; }
.quote-text { font-size: 18px; font-weight: 700; color: #334155; line-height: 1.6; letter-spacing: 0.5px; }
.quote-line { width: 40px; height: 3px; background: var(--blue); margin-top: 12px; border-radius: 2px; }

.pedestal { position: absolute; background: linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%); box-shadow: -10px 10px 20px rgba(0,0,0,0.05), inset 2px 2px 5px rgba(255,255,255,0.8); border-radius: 4px; z-index: 2; }
.p1 { width: 140px; height: 180px; bottom: 0; left: 10%; }
.p2 { width: 120px; height: 260px; bottom: 0; left: 35%; background: linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%); }
.p3 { width: 100px; height: 120px; bottom: 0; right: 25%; }
.p4 { width: 160px; height: 80px; bottom: 0; right: 5%; }

.sphere { position: absolute; border-radius: 50%; background: radial-gradient(circle at 30% 30%, #ffffff 0%, #94a3b8 100%); box-shadow: -5px 10px 15px rgba(0,0,0,0.1); z-index: 1; }
.s1 { width: 60px; height: 60px; bottom: 20px; left: 28%; }
.s2 { width: 40px; height: 40px; bottom: 100px; right: 40%; background: radial-gradient(circle at 30% 30%, #bfdbfe 0%, #3b82f6 100%); }

.plant { position: absolute; bottom: 0; z-index: 1; opacity: 0.6; filter: drop-shadow(-5px 5px 5px rgba(0,0,0,0.05)); }
.plant svg { width: 120px; height: auto; }
.plant.left { left: -20px; bottom: 40px; transform: rotate(15deg); }
.plant.right { right: 20%; bottom: 60px; }

.camera-rig { position: absolute; z-index: 100; }
.stand-pole { width: 14px; height: 60px; background: linear-gradient(to right, #1e293b, #0f172a, #1e293b); position: absolute; left: 50%; bottom: -50px; transform: translateX(-50%); border-radius: 4px; z-index: 4; }
.stand-base { width: 50px; height: 12px; background: #0f172a; position: absolute; left: 50%; bottom: -60px; transform: translateX(-50%); border-radius: 6px; z-index: 4; }

.camera-body { width: 90px; height: 55px; background: linear-gradient(135deg, #1e293b 0%, #020617 100%); border-radius: 8px; position: relative; box-shadow: 0 10px 25px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.1); transform-origin: center center; transition: transform 0.1s linear; z-index: 5; }
.camera-body::before { content: ''; position: absolute; top: -35px; right: 10px; width: 48px; height: 48px; background: radial-gradient(circle at 30% 30%, #475569, #020617); border-radius: 50%; box-shadow: inset -2px -2px 6px rgba(0,0,0,0.5), -15px 0 0 -5px #1e293b; }
.camera-body::after { content: ''; position: absolute; top: -15px; left: -5px; width: 30px; height: 25px; background: #0f172a; border-radius: 4px; box-shadow: inset 1px 1px 2px rgba(255,255,255,0.1); }

.lens { width: 50px; height: 40px; background: linear-gradient(to right, #0f172a, #000000); position: absolute; top: 50%; right: -45px; transform: translateY(-50%); border-radius: 4px 10px 10px 4px; box-shadow: 5px 0 15px rgba(0,0,0,0.5); z-index: 6; }
.lens-inner { width: 8px; height: 28px; background: #fde047; position: absolute; right: 2px; top: 50%; transform: translateY(-50%); border-radius: 50%; opacity: 0.9; box-shadow: 0 0 10px rgba(253, 224, 71, 0.5); transition: 0.3s; }
.lens-inner.success-glow { transform: translateY(-50%) scale(2); box-shadow: 0 0 50px #fde047; }

.beam { position: absolute; top: 50%; left: 100%; height: 0px; transform-origin: left center; pointer-events: none; z-index: 999; transition: opacity 0.3s ease; }
.beam::after { content: ''; position: absolute; top: -60px; left: 0; width: 100%; height: 120px; background: radial-gradient(ellipse at left, rgba(253, 224, 71, 0.45) 0%, transparent 80%); filter: blur(8px); mix-blend-mode: screen; }

.c1 { bottom: 250px; left: 10%; } .c2 { bottom: 330px; left: 35%; } .c3 { bottom: 190px; right: 28%; } .c4 { bottom: 150px; right: 10%; } 

.login-card { position: relative; min-height: calc(100vh - 48px); background: #ffffff; border-radius: 34px; padding: 58px clamp(38px,6vw,92px) 34px; display: flex; flex-direction: column; justify-content: center; box-shadow: 0 18px 55px rgba(0,0,0,.05); overflow: hidden; border: 1px solid var(--line); z-index: 10; }
.logo { text-align: center; font-size: 38px; font-weight: 1000; letter-spacing: -2px; line-height: .8; margin-bottom: 42px; }
.logo .event { color: var(--text) } .logo .hub { color: #2563eb }
.logo small { display: block; width: max-content; margin: 12px auto 0; padding: 4px 13px; border-radius: 8px; background: #0f172a; color: #fff; font-size: 10px; letter-spacing: 5px; }

h1 { margin: 0; text-align: center; font-size: 30px; letter-spacing: -1px; color: #0f172a; }
.subtitle { text-align: center; color: var(--muted); margin: 10px auto 30px; max-width: 430px; line-height: 1.55; font-size: 14px; }

form { width: 100%; max-width: 500px; margin: auto; }
.field { position: relative; margin-bottom: 16px; }
.field input { width: 100%; height: 60px; border: 1.5px solid var(--line); border-radius: 12px; padding: 0 54px 0 54px; font-size: 15px; outline: none; background: #fff; transition: .2s; color: var(--text); }
.field input:focus { border-color: #2563eb; box-shadow: 0 0 0 4px rgba(37,99,235,.15); }
.icon { position: absolute; left: 20px; top: 18px; color: #9ba1ab; font-size: 21px; z-index: 2; }
.toggle { position: absolute; right: 18px; top: 18px; border: 0; background: none; font-size: 20px; color: #9299a5; cursor: pointer; }

.row { display: flex; justify-content: space-between; align-items: center; margin: 8px 2px 24px; font-size: 14px; color: #64748b; }
.remember { display: flex; gap: 9px; align-items: center; }
.remember input { width: 17px; height: 17px; accent-color: #2563eb; cursor: pointer; }
a { color: #2563eb; text-decoration: none; font-weight: 600; }

.btn { width: 100%; height: 58px; border: 0; border-radius: 12px; background: #0f172a; color: #fff; font-size: 16px; font-weight: 700; cursor: pointer; box-shadow: 0 8px 20px rgba(15, 23, 42,.15); transition: .2s; display: flex; justify-content: center; align-items: center; gap: 10px; }
.btn:hover { transform: translateY(-2px); background: #1e293b; }
.btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

.divider { display: flex; align-items: center; gap: 15px; margin: 24px 0; color: #94a3b8; font-size: 13px; }
.divider:before, .divider:after { content: ""; height: 1px; background: #e2e8f0; flex: 1; }

.signup { width: 100%; height: 54px; border: 1.5px solid #e2e8f0; border-radius: 12px; background: #fff; color: #334155; font-size: 15px; font-weight: 700; cursor: pointer; transition: .2s; display: flex; justify-content: center; align-items: center; gap: 10px; }
.signup:hover { background: #f8fafc; border-color: #cbd5e1; color: #0f172a; }
.signup:disabled { opacity: 0.7; cursor: not-allowed; }

#msg { text-align: center; font-size: 13px; font-weight: 600; margin-top: 16px; min-height: 20px; }
.footer { text-align: center; color: #94a3b8; font-size: 12px; margin-top: 28px; }

/* EFEK MENGHINDAR SAAT KETIK PASSWORD */
.looking-away .camera-body { transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1); transform: rotate(195deg) scaleY(-1) !important; }
.looking-away .beam { opacity: 0 !important; transition: opacity 0.3s ease; }

@media(max-width: 1050px) {
  body { overflow: auto; }
  .page { grid-template-columns: 1fr; padding: 18px; }
  .scene { min-height: 380px; }
  .login-card { min-height: 700px; }
}
@media(max-width: 650px) {
  .page { gap: 18px; }
  .login-card { padding: 42px 24px 28px; }
  .quote-box { display: none; }
}
</style>