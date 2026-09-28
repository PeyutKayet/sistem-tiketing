import re

with open('app/pages/[slug].vue', 'r') as f:
    content = f.read()

# 1. HTML Update
old_ui = """      <!-- Bagian Donasi Premium di Bawah Form -->
      <div v-if="eventData?.settings?.is_donasi_active" class="premium-addon-card" :class="{ 'is-active': isInfaqOn }">
        <div class="addon-header">
          <div class="addon-icon-wrapper">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" class="addon-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          </div>
          <div class="addon-text">
            <div class="addon-title">{{ eventData.settings.donasi_header || 'Sertakan Infaq' }}</div>
            <div class="addon-subtitle">Bantu tebarkan manfaat untuk sesama</div>
          </div>
          <div class="addon-toggle">
            <label class="switch">
              <input type="checkbox" v-model="isInfaqOn" @change="handleToggleInfaq">
              <span class="slider round"></span>
            </label>
          </div>
        </div>

        <div v-if="isInfaqOn" class="addon-body">
          <div class="addon-divider"></div>
          
          <div v-if="hasFixedOptions" class="addon-options">
            <div 
              v-for="(opt, idx) in fixedOptionsOnly" 
              :key="idx"
              @click="selectDonasi(opt)"
              class="addon-chip"
              :class="{ 'active': selectedDonasiOpt === opt }"
            >
              {{ formatPrice(Number(opt)) }}
            </div>
            <div 
              v-if="hasCustomOption"
              @click="selectDonasi('custom')"
              class="addon-chip"
              :class="{ 'active': selectedDonasiOpt === 'custom' }"
            >
              Nominal Lain
            </div>
          </div>

          <div v-if="selectedDonasiOpt === 'custom' || (!hasFixedOptions && hasCustomOption)" class="addon-custom-field">
            <span class="currency-prefix">Rp</span>
            <input 
              type="number" 
              v-model.number="customDonasiValue"
              @input="updateCustomDonasi"
              class="addon-input" 
              placeholder="Masukkan nominal seikhlasnya" 
              min="0"
            />
          </div>
        </div>
      </div>"""

standard_ui = """      <!-- Bagian Donasi Standar (Sesuai Form Peserta) -->
      <div v-if="eventData?.settings?.is_donasi_active" class="participant-card donasi-form-card" :class="{'donasi-dim': !isInfaqOn}">
        <div class="donasi-header-flex">
          <div class="donasi-title-wrap">
            <svg class="donasi-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            <span class="form-section-title" style="margin: 0; font-size: 0.95rem;">{{ eventData.settings.donasi_header || 'Infaq / Donasi' }}</span>
          </div>
          <label class="switch-small">
            <input type="checkbox" v-model="isInfaqOn" @change="handleToggleInfaq">
            <span class="slider-small round-small"></span>
          </label>
        </div>
        
        <p class="donasi-subtitle">Bantu tebarkan manfaat untuk sesama</p>

        <div v-if="isInfaqOn" class="donasi-form-body">
          <div v-if="hasFixedOptions" class="donasi-chips">
            <button 
              v-for="(opt, idx) in fixedOptionsOnly" 
              :key="idx"
              @click="selectDonasi(opt)"
              class="form-chip"
              :class="{ 'form-chip-active': selectedDonasiOpt === opt }"
            >
              {{ formatPrice(Number(opt)) }}
            </button>
            <button 
              v-if="hasCustomOption"
              @click="selectDonasi('custom')"
              class="form-chip"
              :class="{ 'form-chip-active': selectedDonasiOpt === 'custom' }"
            >
              Lainnya
            </button>
          </div>

          <div v-if="selectedDonasiOpt === 'custom' || (!hasFixedOptions && hasCustomOption)" class="form-input-group">
            <span class="form-input-prefix">Rp</span>
            <input 
              type="number" 
              v-model.number="customDonasiValue"
              @input="updateCustomDonasi"
              class="form-input donasi-input" 
              placeholder="0" 
              min="0"
            />
          </div>
        </div>
      </div>"""

content = content.replace(old_ui, standard_ui)


# 2. CSS Update
# Delete all premium CSS
content = re.sub(r'/\* Premium Add-on Card CSS \*/[\s\S]*?\.addon-input::placeholder \{[^}]+\}', '', content)

# Add form-matching CSS
form_matching_css = """/* Donasi Form (Matching ParticipantForm) */
.donasi-form-card {
  margin-top: 15px;
  margin-bottom: 25px;
  transition: opacity 0.3s;
}
.donasi-dim {
  opacity: 0.6;
}
.donasi-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.donasi-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--primary);
}
.donasi-svg {
  width: 16px;
  height: 16px;
}
.donasi-subtitle {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 4px 0 12px 24px;
}
.donasi-form-body {
  margin-left: 24px;
  margin-top: 10px;
}
.donasi-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}
.form-chip {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid var(--border-soft);
  background: var(--bg-light);
  color: var(--text-main);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}
.form-chip:hover {
  background: #f1f5f9;
}
.form-chip-active {
  background: var(--primary);
  color: #ffffff;
  border-color: var(--primary);
}
.form-input-group {
  display: flex;
  align-items: center;
  background: var(--bg-light);
  border: 1px solid var(--border-soft);
  border-radius: 8px;
  overflow: hidden;
  max-width: 250px;
}
.form-input-prefix {
  padding: 10px 12px;
  background: #f1f5f9;
  color: #64748b;
  font-weight: 700;
  font-size: 0.85rem;
  border-right: 1px solid var(--border-soft);
}
.donasi-input {
  border: none !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}

/* Small Switch Toggle */
.switch-small {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
}
.switch-small input { 
  opacity: 0;
  width: 0;
  height: 0;
}
.switch-small .slider-small {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #cbd5e1;
  transition: .3s;
}
.switch-small .slider-small:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .3s;
}
.switch-small input:checked + .slider-small {
  background-color: var(--primary);
}
.switch-small input:checked + .slider-small:before {
  transform: translateX(16px);
}
.switch-small .slider-small.round-small {
  border-radius: 20px;
}
.switch-small .slider-small.round-small:before {
  border-radius: 50%;
}
"""

content = content.replace('</style>', form_matching_css + '\n</style>')

with open('app/pages/[slug].vue', 'w') as f:
    f.write(content)
