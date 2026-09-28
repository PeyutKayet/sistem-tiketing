import re

with open('app/pages/[slug].vue', 'r') as f:
    content = f.read()

# 1. Update HTML
old_ui = """      <!-- Bagian Donasi di Bawah Form -->
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

new_ui = """      <!-- Bagian Donasi Minimalis di Bawah Form -->
      <div v-if="eventData?.settings?.is_donasi_active" class="donasi-minimal-container">
        <label class="donasi-minimal-label">
          <input type="checkbox" v-model="isInfaqOn" class="donasi-checkbox" @change="handleToggleInfaq">
          <span class="donasi-minimal-title">{{ eventData.settings.donasi_header || 'Sertakan Infaq' }}</span>
        </label>
        
        <div v-if="isInfaqOn" class="donasi-minimal-body">
          <div v-if="hasFixedOptions" class="donasi-options-small">
            <button 
              v-for="(opt, idx) in fixedOptionsOnly" 
              :key="idx"
              @click="selectDonasi(opt)"
              class="donasi-btn-small"
              :class="{ 'active': selectedDonasiOpt === opt }"
            >
              {{ formatPrice(Number(opt)) }}
            </button>
            <button 
              v-if="hasCustomOption"
              @click="selectDonasi('custom')"
              class="donasi-btn-small"
              :class="{ 'active': selectedDonasiOpt === 'custom' }"
            >
              Lainnya
            </button>
          </div>

          <!-- Jika memilih 'custom' atau custom adalah satu-satunya opsi -->
          <div v-if="selectedDonasiOpt === 'custom' || (!hasFixedOptions && hasCustomOption)" class="donasi-input-small">
            <span class="currency-label-small">Rp</span>
            <input 
              type="number" 
              v-model.number="customDonasiValue"
              @input="updateCustomDonasi"
              class="custom-input-field-small" 
              placeholder="0" 
              min="0"
            />
          </div>
        </div>
      </div>"""
content = content.replace(old_ui, new_ui)


# 2. Update Script
old_script = """const parsedDonasiOptions = computed(() => {
  if (!eventData.value?.settings?.donasi_options) return []
  return eventData.value.settings.donasi_options.split(',').map(s => s.trim()).filter(s => s)
})

// Fungsi untuk memilih otomatis nominal saat form dirender pertama kali"""

new_script = """const parsedDonasiOptions = computed(() => {
  if (!eventData.value?.settings?.donasi_options) return []
  return eventData.value.settings.donasi_options.split(',').map(s => s.trim()).filter(s => s)
})

const fixedOptionsOnly = computed(() => {
  return parsedDonasiOptions.value.filter(opt => opt !== 'custom')
})

const hasFixedOptions = computed(() => {
  return fixedOptionsOnly.value.length > 0
})

const hasCustomOption = computed(() => {
  return parsedDonasiOptions.value.includes('custom')
})

// Fungsi untuk memilih otomatis nominal saat form dirender pertama kali"""
content = content.replace(old_script, new_script)

old_init = """const initDefaultDonasi = () => {
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
}"""

new_init = """const initDefaultDonasi = () => {
  if (!eventData.value?.settings?.is_donasi_active) return
  const opts = parsedDonasiOptions.value
  if (opts.length > 0) {
    // Selalu prioritaskan opsi fixed pertama, kalau tidak ada baru 'custom'
    const firstOpt = hasFixedOptions.value ? fixedOptionsOnly.value[0] : 'custom'
    selectedDonasiOpt.value = firstOpt
    if (firstOpt !== 'custom') {
      donasiAmount.value = Number(firstOpt)
    } else {
      donasiAmount.value = customDonasiValue.value || 0
    }
  }
}"""
content = content.replace(old_init, new_init)

# 3. Update CSS
css_to_remove = """.donasi-container {
  margin-top: 15px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  margin-bottom: 15px;
}
.donasi-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-main);
  margin-bottom: 10px;
}
.donasi-icon {
  width: 18px;
  height: 18px;
  color: var(--primary);
}
.donasi-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-main);
}
.donasi-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.donasi-btn {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}
.donasi-btn.active {
  background: #eff6ff;
  color: var(--primary);
  border-color: var(--primary);
}
.donasi-custom-input {
  margin-top: 10px;
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  overflow: hidden;
}
.currency-label {
  background: #e2e8f0;
  color: #475569;
  font-weight: 700;
  font-size: 0.8rem;
  padding: 8px 12px;
  border-right: 1px solid #cbd5e1;
}
.custom-input-field {
  flex: 1;
  border: none;
  padding: 8px 12px;
  font-size: 0.85rem;
  font-weight: 600;
  outline: none;
  background: transparent;
  color: var(--text-main);
}
.donasi-off {
  background: #f8fafc !important;
  opacity: 0.6;
}
.donasi-off .donasi-header-title {
  color: #94a3b8;
}
.donasi-off .donasi-icon {
  color: #94a3b8;
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
  transition: 0.3s;
}
.donasi-body {
  margin-top: 15px;
  border-top: 1px dashed #e2e8f0;
  padding-top: 15px;
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
  background-color: var(--primary);
}
.donasi-toggle input:checked + .slider:before {
  transform: translateX(20px);
}
.donasi-toggle .slider.round {
  border-radius: 24px;
}
.donasi-toggle .slider.round:before {
  border-radius: 50%;
}"""

css_new = """.donasi-minimal-container {
  margin: 15px 0 25px;
  padding: 0 5px;
}
.donasi-minimal-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}
.donasi-checkbox {
  width: 18px;
  height: 18px;
  accent-color: var(--primary);
  cursor: pointer;
}
.donasi-minimal-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-main);
}
.donasi-minimal-body {
  margin-top: 12px;
  padding-left: 28px; /* sejajar dengan teks checkbox */
}
.donasi-options-small {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}
.donasi-btn-small {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}
.donasi-btn-small.active {
  background: #eff6ff;
  color: var(--primary);
  border-color: var(--primary);
}
.donasi-input-small {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  overflow: hidden;
  max-width: 250px;
}
.currency-label-small {
  background: #f8fafc;
  color: #475569;
  font-weight: 700;
  font-size: 0.8rem;
  padding: 8px 12px;
  border-right: 1px solid #cbd5e1;
}
.custom-input-field-small {
  flex: 1;
  border: none;
  padding: 8px 10px;
  font-size: 0.85rem;
  font-weight: 600;
  outline: none;
  background: transparent;
  color: var(--text-main);
}"""

content = content.replace(css_to_remove, css_new)

with open('app/pages/[slug].vue', 'w') as f:
    f.write(content)
