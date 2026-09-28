import re

with open('app/pages/login.vue', 'r') as f:
    content = f.read()

# 1. Replace the entire <section class="scene">...</section>
new_scene = """    <!-- SCENE: ABSTRACT DASHBOARD -->
    <section class="scene" id="scene">
      <div class="scene-bg">
          <div class="quote-box">
            <div class="quote-mark">"</div>
            <div class="quote-text">Create<br>Manage<br>Celebrate</div>
            <div class="quote-line"></div>
          </div>
          
          <div class="abstract-graphic t1">
            <div class="t-title">VIP Access</div>
            <div class="t-line"></div>
            <div class="t-row"><span>GUEST</span><span>John Doe</span></div>
            <div class="t-row"><span>DATE</span><span>24 Oct 2026</span></div>
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
    </section>"""
content = re.sub(r'<!-- SCENE: STUDIO KAMERA -->\s*<section class="scene".*?</section>', new_scene, content, flags=re.DOTALL)

# 2. Replace the CSS for camera with CSS for abstract
css_to_replace = r'\.pedestal \{.*\.looking-away \.beam \{ opacity: 0 !important; transition: opacity 0\.3s ease; \}'
new_css = """
.abstract-graphic { position: absolute; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); transition: transform 0.3s; }
.abstract-graphic:hover { transform: translateY(-5px) !important; }
.t1 { bottom: 12%; right: 15%; background: white; padding: 24px; width: 280px; transform: rotate(-6deg); z-index: 5; }
.t1 .t-title { font-weight: 800; font-size: 20px; color: #0f172a; margin-bottom: 8px; }
.t1 .t-line { height: 4px; width: 40px; background: #2563eb; border-radius: 4px; margin-bottom: 16px; }
.t1 .t-row { display:flex; justify-content:space-between; font-size:12px; color:#64748b; margin-bottom:8px; font-weight:600; }
.t1 .t-barcode { margin-top: 20px; height: 45px; background: repeating-linear-gradient(90deg, #0f172a, #0f172a 2px, transparent 2px, transparent 6px); width: 100%; opacity:0.8; }

.t2 { top: 25%; right: 25%; background: linear-gradient(135deg, #3b82f6, #2563eb); padding: 24px; width: 220px; transform: rotate(8deg); box-shadow: 0 15px 30px rgba(37,99,235,0.3); z-index: 4; }
.t2 .s-title { font-weight: 700; font-size: 14px; color: white; opacity: 0.9; }
.t2 .s-value { font-weight: 800; font-size: 36px; color: white; margin-top: 4px; }
.t2 .s-bars { display:flex; align-items:flex-end; gap:6px; margin-top: 20px; height:50px; }
.t2 .bar { flex: 1; border-radius: 4px; }
"""
content = re.sub(css_to_replace, new_css.strip(), content, flags=re.DOTALL)

# 3. Modify the Form block
old_form = """      <h1>Selamat Datang Kembali!</h1>
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
        </button>"""

new_form = """      <h1 v-if="!isRegister">Selamat Datang!</h1>
      <h1 v-else>Buat Akun Organizer</h1>
      
      <p class="subtitle" v-if="!isRegister">
        Masuk untuk melanjutkan pengelolaan event<br>bersama EventHub.
      </p>
      <p class="subtitle" v-else>
        Bergabunglah bersama ribuan penyelenggara event lainnya.
      </p>

      <form @submit.prevent="isRegister ? prosesRegister() : prosesLogin()">
        
        <div v-if="isRegister" class="field">
          <span class="icon">👤</span>
          <input type="text" v-model="fullName" placeholder="Nama Lengkap Organizer" required>
        </div>
        
        <div v-if="isRegister" class="field">
          <span class="icon">📱</span>
          <input type="tel" v-model="phone" placeholder="Nomor WhatsApp" required>
        </div>

        <div class="field">
          <span class="icon">✉</span>
          <input type="email" v-model="email" placeholder="Email" required>
        </div>

        <div class="field">
          <span class="icon">🔒</span>
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
            <input type="checkbox"> Ingat saya
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
        </button>"""

content = content.replace(old_form, new_form)

with open('app/pages/login.vue', 'w') as f:
    f.write(content)
