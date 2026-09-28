import re

with open('app/pages/[slug].vue', 'r') as f:
    content = f.read()

# 1. TicketList in template
old_ticket_list = """        <TicketList 
          :tickets="tickets"
          :keranjang="keranjang"
          :eventSettings="eventData?.settings"
          v-model:donasiAmount="donasiAmount"
          @update-keranjang="updateKeranjang"
        />"""

new_ticket_list = """        <TicketList 
          :tickets="tickets"
          :keranjang="keranjang"
          @update-keranjang="updateKeranjang"
        />"""
content = content.replace(old_ticket_list, new_ticket_list)

# 2. Add Donasi UI to the Form step
old_form_step = """      <ParticipantForm 
        :daftarPeserta="daftarPeserta" 
        :customFields="customFields" 
        @toast="showToastMsg"
      />

      <div class="action-row">"""

donasi_ui = """      <ParticipantForm 
        :daftarPeserta="daftarPeserta" 
        :customFields="customFields" 
        @toast="showToastMsg"
      />

      <!-- Bagian Donasi di Bawah Form -->
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
      </div>

      <div class="action-row">"""

content = content.replace(old_form_step, donasi_ui)

# 3. Add script variables for Donasi
script_vars = """
const selectedDonasiOpt = ref('')
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
}
"""
content = content.replace('const isSetujuSnk = ref(false)', 'const isSetujuSnk = ref(false)\n' + script_vars)

# 4. Add CSS for Donasi
css_update = """
.donasi-container {
  margin-top: 15px;
  background: #fff0f2;
  border: 1px solid #fecdd3;
  border-radius: 12px;
  padding: 12px;
}
.donasi-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e11d48;
  margin-bottom: 10px;
}
.donasi-icon {
  width: 18px;
  height: 18px;
}
.donasi-title {
  font-size: 0.85rem;
  font-weight: 800;
}
.donasi-options {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.donasi-btn {
  background: white;
  border: 1px solid #fecdd3;
  color: #e11d48;
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}
.donasi-btn.active {
  background: #e11d48;
  color: white;
  border-color: #e11d48;
}
.donasi-custom-input {
  margin-top: 10px;
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #fecdd3;
  border-radius: 8px;
  overflow: hidden;
}
.currency-label {
  background: #fff0f2;
  color: #e11d48;
  font-weight: 700;
  font-size: 0.8rem;
  padding: 8px 12px;
  border-right: 1px solid #fecdd3;
}
.custom-input-field {
  flex: 1;
  border: none;
  padding: 8px 12px;
  font-size: 0.85rem;
  font-weight: 600;
  outline: none;
  color: var(--text-main);
}
"""
content = content.replace('</style>', css_update + '\n</style>')

with open('app/pages/[slug].vue', 'w') as f:
    f.write(content)
