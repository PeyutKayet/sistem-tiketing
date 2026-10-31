<template>
  <div v-if="eventData?.settings?.is_donasi_active" class="participant-card donasi-form-card" :class="{'donasi-dim': !localIsInfaqOn}">
    <div class="donasi-header-flex">
      <div class="donasi-title-wrap">
        <svg class="donasi-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
        <span class="form-section-title" style="margin: 0; font-size: 0.95rem;">{{ eventData.settings.donasi_header || 'Infaq / Donasi' }}</span>
      </div>
      <label v-if="!eventData.settings.is_infaq_wajib" class="switch-small">
        <input type="checkbox" v-model="localIsInfaqOn" @change="handleToggleInfaq">
        <span class="slider-small round-small"></span>
      </label>
    </div>
    
    <div v-if="localIsInfaqOn" class="donasi-form-body">
      <div v-if="hasFixedOptions" class="donasi-chips">
        <button 
          type="button"
          v-for="(opt, idx) in fixedOptionsOnly" 
          :key="idx"
          @click="selectDonasi(opt)"
          class="form-chip"
          :class="{ 'form-chip-active': String(selectedDonasiOpt) === String(opt) }"
        >
          {{ formatPrice(Number(opt)) }}
        </button>
        <button 
          type="button"
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
          type="text" 
          inputmode="numeric"
          :value="customDonasiValueFormatted"
          @input="updateCustomDonasi"
          class="form-input donasi-input" 
          placeholder="0" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { formatPrice } from '~/utils/format'

const props = defineProps({
  eventData: Object,
  isInfaqOn: Boolean,
  donasiAmount: Number
})

const emit = defineEmits(['update:isInfaqOn', 'update:donasiAmount'])

const localIsInfaqOn = ref(props.isInfaqOn)
const selectedDonasiOpt = ref('')
const customDonasiValue = ref(0)
const customDonasiValueFormatted = ref('')

watch(() => props.isInfaqOn, (newVal) => {
  localIsInfaqOn.value = newVal
})

watch(localIsInfaqOn, (newVal) => {
  emit('update:isInfaqOn', newVal)
})

const parsedDonasiOptions = computed(() => {
  if (!props.eventData?.settings?.donasi_options) return []
  return props.eventData.settings.donasi_options.split(',').map(s => s.trim()).filter(s => s)
})

const fixedOptionsOnly = computed(() => {
  return parsedDonasiOptions.value.filter(opt => opt.toLowerCase() !== 'custom')
})

const hasFixedOptions = computed(() => {
  return fixedOptionsOnly.value.length > 0
})

const hasCustomOption = computed(() => {
  return props.eventData?.settings?.is_donasi_custom === true || parsedDonasiOptions.value.some(opt => opt.toLowerCase() === 'custom')
})

watch(() => props.donasiAmount, (val) => {
  if (val > 0) {
    const valStr = String(val)
    if (fixedOptionsOnly.value.includes(valStr)) {
      selectedDonasiOpt.value = valStr
    } else if (hasCustomOption.value) {
      selectedDonasiOpt.value = 'custom'
      customDonasiValue.value = val
      customDonasiValueFormatted.value = Number(val).toLocaleString('id-ID')
    }
  } else if (val === 0 && !localIsInfaqOn.value) {
    selectedDonasiOpt.value = ''
  }
}, { immediate: true })

const initDefaultDonasi = () => {
  if (!props.eventData?.settings?.is_donasi_active) return
  const opts = parsedDonasiOptions.value
  if (opts.length > 0) {
    const firstOpt = hasFixedOptions.value ? fixedOptionsOnly.value[0] : "custom"
    selectedDonasiOpt.value = firstOpt
    if (firstOpt !== "custom") {
      emit("update:donasiAmount", Number(firstOpt))
    } else {
      emit("update:donasiAmount", customDonasiValue.value || 0)
    }
  } else if (hasCustomOption.value) {
    selectedDonasiOpt.value = "custom"
    emit("update:donasiAmount", customDonasiValue.value || 0)
  }
}

const handleToggleInfaq = () => {
  if (localIsInfaqOn.value) {
    initDefaultDonasi()
  } else {
    emit('update:donasiAmount', 0)
  }
}

const selectDonasi = (opt) => {
  selectedDonasiOpt.value = opt
  if (opt !== 'custom') {
    emit('update:donasiAmount', Number(opt))
  } else {
    emit('update:donasiAmount', customDonasiValue.value || 0)
  }
}

const updateCustomDonasi = (e) => {
  let val = e.target.value.replace(/\D/g, '')
  if (val) {
    customDonasiValueFormatted.value = Number(val).toLocaleString('id-ID')
    customDonasiValue.value = Number(val)
  } else {
    customDonasiValueFormatted.value = ''
    customDonasiValue.value = 0
  }

  if (selectedDonasiOpt.value === 'custom' || (!hasFixedOptions.value && hasCustomOption.value)) {
    emit('update:donasiAmount', customDonasiValue.value)
  }
}

onMounted(() => {
  if (props.eventData?.settings?.is_donasi_active && localIsInfaqOn.value && props.donasiAmount === 0) {
    initDefaultDonasi()
  }
})
</script>

<style scoped>
.donasi-form-card {
  margin-top: 15px;
  margin-bottom: 25px;
  transition: opacity 0.3s;
  background: white;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid var(--border-soft);
}
.donasi-dim { opacity: 0.6; }
.donasi-header-flex { display: flex; justify-content: space-between; align-items: center; }
.donasi-title-wrap { display: flex; align-items: center; gap: 8px; color: var(--primary); }
.donasi-svg { width: 16px; height: 16px; }
.donasi-form-body { margin-left: 24px; margin-top: 10px; }
.donasi-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.form-chip {
  padding: 8px 14px;
  border-radius: 8px;
  border: 1.5px solid #cbd5e1;
  background: #ffffff;
  color: #1e293b;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  outline: none;
}
.form-chip:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
  color: #0f172a;
}
/* KETIKA TERPILIH / AKTIF: Navy Blue (#0C387A) yang solid dengan teks Putih (#ffffff) kontras */
.form-chip.form-chip-active,
.form-chip.form-chip-active:hover,
.form-chip.form-chip-active:focus {
  background: #0C387A !important;
  background-color: #0C387A !important;
  color: #ffffff !important;
  border-color: #0C387A !important;
  font-weight: 700 !important;
  box-shadow: 0 2px 8px rgba(12, 56, 122, 0.3) !important;
}
.form-input-group {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1.5px solid #0C387A;
  border-radius: 8px;
  overflow: hidden;
  max-width: 260px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.form-input-prefix {
  padding: 10px 12px;
  background: #f1f5f9;
  color: #0C387A;
  font-weight: 700;
  font-size: 0.85rem;
  border-right: 1.5px solid #0C387A;
}
.donasi-input {
  border: none !important;
  border-radius: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  padding: 10px 12px;
  width: 100%;
  outline: none;
  color: #0f172a !important;
  font-size: 0.95rem;
  font-weight: 600;
}
.switch-small { position: relative; display: inline-block; width: 36px; height: 20px; }
.switch-small input { opacity: 0; width: 0; height: 0; }
.switch-small .slider-small { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: .3s; }
.switch-small .slider-small:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: white; transition: .3s; }
.switch-small input:checked + .slider-small { background-color: var(--primary); }
.switch-small input:checked + .slider-small:before { transform: translateX(16px); }
.switch-small .slider-small.round-small { border-radius: 20px; }
.switch-small .slider-small.round-small:before { border-radius: 50%; }
</style>
