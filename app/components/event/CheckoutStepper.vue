<template>
  <div class="checkout-stepper-container">
    <!-- Mode 4-Step (Dengan Kuesioner B2B) -->
    <template v-if="hasSurvey">
      <div class="stepper-item" :class="getStepClass(1)">
        <div class="step-icon-wrap">
          <Icon v-if="stepNumber > 1" name="lucide:check" class="step-check-icon" />
          <span v-else class="step-num">1</span>
        </div>
        <span class="step-label">Tiket</span>
      </div>

      <div class="stepper-connector" :class="{ filled: stepNumber >= 2 }"></div>

      <div class="stepper-item" :class="getStepClass(2)">
        <div class="step-icon-wrap">
          <Icon v-if="stepNumber > 2" name="lucide:check" class="step-check-icon" />
          <span v-else class="step-num">2</span>
        </div>
        <span class="step-label">Data Diri</span>
      </div>

      <div class="stepper-connector" :class="{ filled: stepNumber >= 3 }"></div>

      <div class="stepper-item" :class="getStepClass(3)">
        <div class="step-icon-wrap">
          <Icon v-if="stepNumber > 3" name="lucide:check" class="step-check-icon" />
          <span v-else class="step-num">3</span>
        </div>
        <span class="step-label">Kuesioner</span>
      </div>

      <div class="stepper-connector" :class="{ filled: stepNumber >= 4 }"></div>

      <div class="stepper-item" :class="getStepClass(4)">
        <div class="step-icon-wrap">
          <span class="step-num">4</span>
        </div>
        <span class="step-label">
          Selesai
          <span v-if="stepNumber === 4" class="final-step-pill">Akhir</span>
        </span>
      </div>
    </template>

    <!-- Mode Standar 3-Step (Tanpa Kuesioner) -->
    <template v-else>
      <div class="stepper-item" :class="getStepClass(1)">
        <div class="step-icon-wrap">
          <Icon v-if="stepNumber > 1" name="lucide:check" class="step-check-icon" />
          <span v-else class="step-num">1</span>
        </div>
        <span class="step-label">Tiket</span>
      </div>

      <div class="stepper-connector" :class="{ filled: stepNumber >= 2 }"></div>

      <div class="stepper-item" :class="getStepClass(2)">
        <div class="step-icon-wrap">
          <Icon v-if="stepNumber > 2" name="lucide:check" class="step-check-icon" />
          <span v-else class="step-num">2</span>
        </div>
        <span class="step-label">Data Diri</span>
      </div>

      <div class="stepper-connector" :class="{ filled: stepNumber >= 3 }"></div>

      <div class="stepper-item" :class="getStepClass(3)">
        <div class="step-icon-wrap">
          <span class="step-num">3</span>
        </div>
        <span class="step-label">
          Pembayaran
          <span v-if="stepNumber === 3" class="final-step-pill">Akhir</span>
        </span>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentStep: {
    type: String,
    required: true
  },
  hasSurvey: {
    type: Boolean,
    default: false
  }
})

const stepNumber = computed(() => {
  if (props.hasSurvey) {
    if (props.currentStep === 'snk' || props.currentStep === 'home') return 1
    if (props.currentStep === 'form') return 2
    if (props.currentStep === 'survei') return 3
    if (props.currentStep === 'bayar' || props.currentStep === 'sukses') return 4
    return 1
  }

  if (props.currentStep === 'snk' || props.currentStep === 'home') return 1
  if (props.currentStep === 'form') return 2
  if (props.currentStep === 'bayar' || props.currentStep === 'sukses') return 3
  return 1
})

const getStepClass = (step) => {
  if (stepNumber.value > step) return 'completed'
  if (stepNumber.value === step) return 'current'
  return 'pending'
}
</script>

<style scoped>
.checkout-stepper-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  padding: 10px 14px;
  background: #f8fafc;
  border-radius: 14px;
  border: 1px solid var(--border-soft, #e2e8f0);
}

.stepper-item {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.step-icon-wrap {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  transition: all 0.25s ease;
}

.stepper-item.completed .step-icon-wrap {
  background: #10b981;
  color: #ffffff;
}

.stepper-item.current .step-icon-wrap {
  background: var(--primary, #0C387A);
  color: #ffffff;
  box-shadow: 0 0 0 3px rgba(12, 56, 122, 0.18);
}

.stepper-item.pending .step-icon-wrap {
  background: #e2e8f0;
  color: #94a3b8;
}

.step-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stepper-item.current .step-label {
  color: var(--primary, #0C387A);
  font-weight: 700;
}

.stepper-item.completed .step-label {
  color: #10b981;
}

.final-step-pill {
  font-size: 0.52rem;
  font-weight: 800;
  background: #fef3c7;
  color: #b45309;
  padding: 1px 5px;
  border-radius: 6px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  animation: pulse-badge 2s infinite ease-in-out;
}

@keyframes pulse-badge {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(0.96); }
}

.stepper-connector {
  flex: 1;
  height: 2px;
  background: #e2e8f0;
  margin: 0 8px;
  transition: background 0.25s ease;
}

.stepper-connector.filled {
  background: #10b981;
}

.step-check-icon {
  font-size: 13px;
}
</style>
