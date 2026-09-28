import re

with open('app/pages/[slug].vue', 'r') as f:
    content = f.read()

# 1. Update the Donasi HTML UI
old_donasi_ui = """      <!-- Bagian Donasi di Bawah Form -->
      <div v-if="eventData?.settings?.is_donasi_active" class="donasi-container">
        <div class="donasi-header">
          <svg fill="currentColor" viewBox="0 0 24 24" class="donasi-icon"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
          <span class="donasi-title">{{ eventData.settings.donasi_header || 'Donasi' }}</span>
        </div>
        
        <div class="donasi-options">
          <button 
            v-for="(opt, idx) in parsedDonasiOptions" 
            :key="idx"
            @click="selectDonasi(opt)"
            class="donasi-btn"
            :class="{ 'active': selectedDonasiOpt === opt }"
          >
            {{ opt === 'custom' ? 'Lainnya' : formatPrice(Number(opt)) }}
          </button>
        </div>

        <div v-if="selectedDonasiOpt === 'custom'" class="donasi-custom-input">
          <span class="currency-label">Rp</span>
          <input 
            type="number" 
            v-model.number="customDonasiValue"
            @input="updateCustomDonasi"
            class="custom-input-field" 
            placeholder="Masukkan nominal" 
            min="0"
          />
        </div>
      </div>"""

new_donasi_ui = """      <!-- Bagian Donasi di Bawah Form -->
      <div v-if="eventData?.settings?.is_donasi_active" class="donasi-container" :class="{ 'donasi-off': !isInfaqOn }">
        <div class="donasi-header-row">
          <div class="donasi-header-title">
            <svg fill="currentColor" viewBox="0 0 24 24" class="donasi-icon"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
            <span class="donasi-title">{{ eventData.settings.donasi_header || 'Ikut Berinfaq' }}</span>
          </div>
          
          <!-- Saklar Toggle -->
          <label class="donasi-toggle">
            <input type="checkbox" v-model="isInfaqOn" @change="handleToggleInfaq">
            <span class="slider round"></span>
          </label>
        </div>
        
        <div class="donasi-body" v-show="isInfaqOn">
          <div class="donasi-options">
            <button 
              v-for="(opt, idx) in parsedDonasiOptions" 
              :key="idx"
              @click="selectDonasi(opt)"
              class="donasi-btn"
              :class="{ 'active': selectedDonasiOpt === opt }"
            >
              {{ opt === 'custom' ? 'Nominal Lain' : formatPrice(Number(opt)) }}
            </button>
          </div>

          <div v-if="selectedDonasiOpt === 'custom'" class="donasi-custom-input">
            <span class="currency-label">Rp</span>
            <input 
              type="number" 
              v-model.number="customDonasiValue"
              @input="updateCustomDonasi"
              class="custom-input-field" 
              placeholder="Masukkan nominal seikhlasnya" 
              min="0"
            />
          </div>
        </div>
      </div>"""

content = content.replace(old_donasi_ui, new_donasi_ui)

# 2. Update Script Logic
old_script = """const selectedDonasiOpt = ref('')
const customDonasiValue = ref(0)

const parsedDonasiOptions = computed(() => {
  if (!eventData.value?.settings?.donasi_options) return []
  return eventData.value.settings.donasi_options.split(',').map(s => s.trim()).filter(s => s)
})

const selectDonasi = (opt) => {
  if (selectedDonasiOpt.value === opt) {
    selectedDonasiOpt.value = ''
    donasiAmount.value = 0
    return
  }
  
  selectedDonasiOpt.value = opt
  if (opt !== 'custom') {
    donasiAmount.value = Number(opt)
  } else {
    donasiAmount.value = customDonasiValue.value || 0
  }
}

const updateCustomDonasi = () => {
  if (selectedDonasiOpt.value === 'custom') {
    donasiAmount.value = customDonasiValue.value || 0
  }
}"""

new_script = """const isInfaqOn = ref(true) // Otomatis menyala di awal
const selectedDonasiOpt = ref('')
const customDonasiValue = ref(0)

const parsedDonasiOptions = computed(() => {
  if (!eventData.value?.settings?.donasi_options) return []
  return eventData.value.settings.donasi_options.split(',').map(s => s.trim()).filter(s => s)
})

// Fungsi untuk memilih otomatis nominal saat form dirender pertama kali
const initDefaultDonasi = () => {
  if (!eventData.value?.settings?.is_donasi_active) return
  const opts = parsedDonasiOptions.value
  if (opts.length > 0) {
    const firstOpt = opts[0]
    selectedDonasiOpt.value = firstOpt
    if (firstOpt !== 'custom') {
      donasiAmount.value = Number(firstOpt)
    } else {
      donasiAmount.value = 0 // Jika cuma ada opsi custom, kita set 0 agar mereka ngetik
    }
  }
}

// Panggil inisialisasi setiap kali pindah ke step 'form' (bisa via watch, atau saat tombol lanjut ditekan)
import { watch } from 'vue'
watch(currentStep, (newVal) => {
  if (newVal === 'form' && donasiAmount.value === 0 && isInfaqOn.value) {
    initDefaultDonasi()
  }
})

const handleToggleInfaq = () => {
  if (isInfaqOn.value) {
    // Jika dihidupkan lagi, pilih opsi pertama atau opsi yang tersimpan
    initDefaultDonasi()
  } else {
    // Jika dimatikan, paksa donasi jadi 0
    donasiAmount.value = 0
  }
}

const selectDonasi = (opt) => {
  selectedDonasiOpt.value = opt
  if (opt !== 'custom') {
    donasiAmount.value = Number(opt)
  } else {
    donasiAmount.value = customDonasiValue.value || 0
  }
}

const updateCustomDonasi = () => {
  if (selectedDonasiOpt.value === 'custom') {
    donasiAmount.value = customDonasiValue.value || 0
  }
}"""

content = content.replace(old_script, new_script)

# 3. Update CSS for toggle and donasi-off state
old_css = """.donasi-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e11d48;
  margin-bottom: 10px;
}"""

new_css = """.donasi-off {
  background: #f8fafc !important;
  border-color: #e2e8f0 !important;
  opacity: 0.7;
}
.donasi-off .donasi-header-title {
  color: #64748b;
}
.donasi-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.donasi-header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e11d48;
  transition: 0.3s;
}
.donasi-body {
  margin-top: 12px;
  border-top: 1px dashed #fecdd3;
  padding-top: 12px;
}

/* CSS untuk Switch Toggle ala iOS */
.donasi-toggle {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}
.donasi-toggle input { 
  opacity: 0;
  width: 0;
  height: 0;
}
.donasi-toggle .slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #cbd5e1;
  transition: .3s;
}
.donasi-toggle .slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .3s;
}
.donasi-toggle input:checked + .slider {
  background-color: #e11d48;
}
.donasi-toggle input:checked + .slider:before {
  transform: translateX(20px);
}
.donasi-toggle .slider.round {
  border-radius: 24px;
}
.donasi-toggle .slider.round:before {
  border-radius: 50%;
}
"""

content = content.replace(old_css, new_css)

with open('app/pages/[slug].vue', 'w') as f:
    f.write(content)
