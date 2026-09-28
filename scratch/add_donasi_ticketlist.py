import re

with open('app/components/event/TicketList.vue', 'r') as f:
    content = f.read()

donasi_ui = """      </div>
    </div>
    
    <!-- Bagian Donasi -->
    <div v-if="eventSettings?.is_donasi_active" class="donasi-container">
      <div class="donasi-header">
        <svg fill="currentColor" viewBox="0 0 24 24" class="donasi-icon"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
        <span class="donasi-title">{{ eventSettings?.donasi_header || 'Donasi' }}</span>
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
  </div>
</template>"""

content = content.replace('      </div>\n    </div>\n  </div>\n</template>', donasi_ui)

script_update = """<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  tickets: { type: Array, default: () => [] },
  keranjang: { type: Object, default: () => ({}) },
  eventSettings: { type: Object, default: () => ({}) },
  donasiAmount: { type: Number, default: 0 }
})

const emit = defineEmits(['update-keranjang', 'update:donasiAmount'])

const parsedDonasiOptions = computed(() => {
  if (!props.eventSettings?.donasi_options) return []
  return props.eventSettings.donasi_options.split(',').map(s => s.trim()).filter(s => s)
})

const selectedDonasiOpt = ref('')
const customDonasiValue = ref(0)

const selectDonasi = (opt) => {
  if (selectedDonasiOpt.value === opt) {
    selectedDonasiOpt.value = ''
    emit('update:donasiAmount', 0)
    return
  }
  
  selectedDonasiOpt.value = opt
  if (opt !== 'custom') {
    emit('update:donasiAmount', Number(opt))
  } else {
    emit('update:donasiAmount', customDonasiValue.value)
  }
}

const updateCustomDonasi = () => {
  if (selectedDonasiOpt.value === 'custom') {
    emit('update:donasiAmount', customDonasiValue.value || 0)
  }
}

const formatPrice = (price) => {
  if (price == null) return ''
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
}
</script>"""

content = re.sub(r'<script setup>.*?</script>', script_update, content, flags=re.DOTALL)

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

with open('app/components/event/TicketList.vue', 'w') as f:
    f.write(content)
