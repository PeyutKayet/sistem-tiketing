import re

with open('app/pages/[slug].vue', 'r') as f:
    content = f.read()

# 1. Update HTML
old_ui = """      <!-- Bagian Donasi Minimalis di Bawah Form -->
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

premium_ui = """      <!-- Bagian Donasi Premium di Bawah Form -->
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

content = content.replace(old_ui, premium_ui)


# 2. CSS update
css_to_remove = """.donasi-minimal-container {
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
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-main);
}
.donasi-minimal-body {
  margin-top: 12px;
  padding-left: 28px;
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
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.8rem;
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

premium_css = """/* Premium Add-on Card CSS */
.premium-addon-card {
  margin: 20px 0;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}
.premium-addon-card.is-active {
  border-color: #bfdbfe;
  background: #f8fafc;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.05);
}
.addon-header {
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 14px;
}
.addon-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #eff6ff;
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.addon-icon {
  width: 22px;
  height: 22px;
}
.addon-text {
  flex: 1;
}
.addon-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.3;
}
.addon-subtitle {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 3px;
}
.addon-toggle {
  flex-shrink: 0;
}
.switch {
  position: relative;
  display: inline-block;
  width: 46px;
  height: 26px;
}
.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}
.switch .slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #cbd5e1;
  transition: .4s;
  border-radius: 26px;
}
.switch .slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
.switch input:checked + .slider {
  background-color: var(--primary);
}
.switch input:checked + .slider:before {
  transform: translateX(20px);
}
.addon-body {
  padding: 0 16px 20px 16px;
  animation: slideDown 0.3s ease-out;
}
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.addon-divider {
  height: 1px;
  background: #e2e8f0;
  margin-bottom: 16px;
}
.addon-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.addon-chip {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #475569;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}
.addon-chip:hover {
  background: #f1f5f9;
}
.addon-chip.active {
  background: var(--primary);
  color: #ffffff;
  border-color: var(--primary);
  box-shadow: 0 4px 10px rgba(12, 56, 122, 0.2);
}
.addon-custom-field {
  margin-top: 14px;
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 10px 14px;
  transition: 0.3s;
}
.addon-custom-field:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px #eff6ff;
}
.currency-prefix {
  font-weight: 700;
  color: #64748b;
  font-size: 0.9rem;
  margin-right: 8px;
}
.addon-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-main);
  background: transparent;
  width: 100%;
}
.addon-input::placeholder {
  color: #94a3b8;
  font-weight: 500;
}"""

content = content.replace(css_to_remove, premium_css)

with open('app/pages/[slug].vue', 'w') as f:
    f.write(content)
