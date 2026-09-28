new_content = """<template>
  <div>
    <div v-for="(peserta, index) in daftarPeserta" :key="index" class="participant-card">
      <div class="participant-header">
        <h4 class="participant-title">Data Peserta Ke-{{ index + 1 }}</h4>
        <span class="participant-badge">{{ peserta.namaTiket }}</span>
      </div>
      
      <div class="form-grid">
        <div v-for="field in customFields" :key="field.field_key" :style="{ gridColumn: `span ${field.width || 12}` }">
          
          <div v-if="field.type === 'header'" class="form-section-header">
            <h3 class="form-section-title">{{ field.label }}</h3>
          </div>

          <div v-else>
            <label class="form-label">
              {{ field.label }} <span v-if="field.required" class="required-mark">*</span>
            </label>

            <!-- Phone Type (phone_wa) -->
            <div v-if="field.type === 'phone_wa'" class="phone-input-group">
              <input type="text" v-model="peserta['_cc_' + field.field_key]" placeholder="62" class="form-input cc-input" />
              <input type="tel" v-model="peserta.jawaban[field.field_key]" @input="handlePhoneInput(peserta, field.field_key)" placeholder="81234567890" class="form-input phone-input" />
            </div>

            <!-- Paragraph (long_text) -->
            <textarea v-else-if="field.type === 'paragraph'" v-model="peserta.jawaban[field.field_key]" rows="3" class="form-input form-textarea" :placeholder="field.label"></textarea>

            <!-- Dropdown -->
            <select v-else-if="field.type === 'dropdown'" v-model="peserta.jawaban[field.field_key]" class="form-input form-select">
              <option value="">Pilih Opsi...</option>
              <option v-for="(opt, i) in field.options" :key="i" :value="opt">{{ opt }}</option>
            </select>

            <!-- Multiple Choice (radio) -->
            <div v-else-if="field.type === 'multiple_choice'" class="choice-group">
              <label v-for="(opt, i) in field.options" :key="i" class="choice-label">
                <input type="radio" :value="opt" v-model="peserta.jawaban[field.field_key]" class="choice-input" /> {{ opt }}
              </label>
            </div>

            <!-- Checkboxes -->
            <div v-else-if="field.type === 'checkboxes'" class="choice-group">
              <label v-for="(opt, i) in field.options" :key="i" class="choice-label">
                <input type="checkbox" :value="opt" v-model="peserta.jawaban[field.field_key]" class="choice-input" /> {{ opt }}
              </label>
            </div>

            <!-- Linear Scale -->
            <div v-else-if="field.type === 'linear_scale'" class="linear-scale-container">
              <div class="linear-scale-wrapper">
                <span class="scale-limit">1</span>
                
                <div class="scale-options">
                  <label v-for="n in field.scaleCount || 5" :key="n" class="scale-option">
                    <span v-if="peserta.jawaban[field.field_key] === n" class="scale-tooltip">{{ n }}</span>
                    <input type="radio" :value="n" v-model="peserta.jawaban[field.field_key]" class="scale-input" />
                  </label>
                </div>
                
                <span class="scale-limit">{{ field.scaleCount || 5 }}</span>
              </div>
            </div>

            <!-- File Upload -->
            <div v-else-if="field.type === 'file_upload'" class="file-upload-wrapper">
              <input type="file" @change="(e) => handleCustomUpload(e, peserta, field.field_key)" accept="image/*,.pdf" style="display: none;" :id="'file_' + index + '_' + field.field_key" />
              
              <label :for="'file_' + index + '_' + field.field_key" class="file-upload-label">
                <div v-if="peserta.jawaban[field.field_key]" class="file-icon file-icon-selected">
                  <svg style="width: 18px; height: 18px;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <div v-else class="file-icon file-icon-empty">
                  <svg style="width: 18px; height: 18px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                </div>
                
                <div class="file-info">
                  <div v-if="peserta.jawaban[field.field_key]" class="file-name">{{ peserta.jawaban[field.field_key].name || 'File terpilih' }}</div>
                  <div v-else class="file-placeholder">Pilih File</div>
                  <div class="file-hint">Format JPG/PNG/PDF</div>
                </div>
              </label>
            </div>

            <!-- Terms / Persetujuan -->
            <label v-else-if="field.type === 'terms'" class="terms-label">
              <input type="checkbox" v-model="peserta.jawaban[field.field_key]" class="terms-input" />
              <span class="terms-text">{{ field.termsText || field.label }}</span>
            </label>
            
            <!-- Default / Short Text / Date / Time -->
            <input v-else :type="field.type === 'date' ? 'date' : (field.type === 'time' ? 'time' : 'text')" v-model="peserta.jawaban[field.field_key]" class="form-input" :placeholder="field.label">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useImageCompress } from '~/composables/useImageCompress'

const props = defineProps({
  daftarPeserta: { type: Array, required: true },
  customFields: { type: Array, required: true }
})

const emit = defineEmits(['toast'])
const { compressImageFile } = useImageCompress()

const handlePhoneInput = (peserta, fieldKey) => {
  let val = peserta.jawaban[fieldKey] || ''
  val = val.replace(/\D/g, '')
  if (val.startsWith('0')) {
    val = val.substring(1)
  } else if (val.startsWith('62')) {
    val = val.substring(2)
  }
  peserta.jawaban[fieldKey] = val
}

const handleCustomUpload = async (event, peserta, fieldKey) => {
  const file = event.target.files[0]
  if (!file) {
    peserta.jawaban[fieldKey] = null
    return
  }
  
  if (file.type.startsWith('image/')) {
    try {
      const compressedFile = await compressImageFile(file, 800, 0.6)
      peserta.jawaban[fieldKey] = compressedFile
    } catch (e) {
      console.error('Compression error', e)
      emit('toast', 'Gagal mengompres gambar', 'error')
    }
  } else {
    if (file.size > 3 * 1024 * 1024) {
      // @ts-ignore
      if (typeof window !== 'undefined' && window.Swal) {
        // @ts-ignore
        window.Swal.fire({ icon: 'error', title: 'Terlalu Besar', text: 'Ukuran PDF maksimal 3MB', confirmButtonColor: '#E85D5E' })
      } else {
        emit('toast', 'Ukuran PDF maksimal 3MB', 'error')
      }
      event.target.value = ''
      return
    }
    peserta.jawaban[fieldKey] = file
  }
}
</script>

<style scoped>
.participant-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}
.participant-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dashed var(--border-soft);
  padding-bottom: 10px;
  margin-bottom: 15px;
}
.participant-title {
  margin: 0;
  color: var(--primary);
  font-size: 0.95rem;
}
.participant-badge {
  font-size: 0.65rem;
  font-weight: 800;
  color: var(--accent-main);
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 4px 8px;
  border-radius: 4px;
  text-transform: uppercase;
}
.form-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 10px;
}
.form-section-header {
  border-bottom: 2px solid var(--border-soft);
  padding-bottom: 6px;
  margin: 12px 0 6px;
}
.form-section-title {
  margin: 0;
  color: var(--text-main);
  font-size: 1.1rem;
}
.form-label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
}
.required-mark {
  color: #ef4444;
}
.form-input {
  width: 100%;
  padding: 10px 12px;
  box-sizing: border-box;
  background: var(--bg-light);
  border: 1px solid var(--border-soft);
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.85rem;
  outline: none;
  color: var(--text-main);
}
.phone-input-group {
  display: flex;
  gap: 8px;
}
.cc-input {
  width: 55px;
  min-width: 0;
  text-align: center;
  font-weight: 600;
}
.phone-input {
  flex: 1;
  min-width: 0;
}
.form-textarea {
  resize: vertical;
}
.form-select {
  appearance: none;
}
.choice-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
}
.choice-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  cursor: pointer;
}
.choice-input {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  accent-color: var(--primary);
}
.linear-scale-container {
  margin-top: 10px;
  margin-bottom: 5px;
  padding: 15px 12px;
  background: var(--bg-light);
  border-radius: 8px;
  border: 1px solid var(--border-soft);
}
.linear-scale-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.scale-limit {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-muted);
}
.scale-options {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
}
.scale-option {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 2px;
}
.scale-tooltip {
  position: absolute;
  top: -18px;
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--primary);
}
.scale-input {
  margin: 0;
  width: 18px;
  height: 18px;
  accent-color: var(--primary);
  cursor: pointer;
}
.file-upload-wrapper {
  margin-top: 4px;
}
.file-upload-label {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: var(--bg-light);
  border: 1px dashed var(--border-soft);
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}
.file-icon {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.file-icon-selected {
  background: #dcfce7;
  color: #16a34a;
}
.file-icon-empty {
  background: #f1f5f9;
  color: var(--text-muted);
}
.file-info {
  flex: 1;
  min-width: 0;
}
.file-name {
  font-size: 0.75rem;
  font-weight: 700;
  color: #16a34a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.file-placeholder {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-main);
}
.file-hint {
  font-size: 0.65rem;
  color: var(--text-muted);
  margin-top: 2px;
}
.terms-label {
  display: flex;
  gap: 10px;
  font-size: 0.75rem;
  align-items: flex-start;
  padding: 12px;
  box-sizing: border-box;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
}
.terms-input {
  margin-top: 3px;
  width: 16px;
  height: 16px;
  accent-color: var(--primary);
  flex-shrink: 0;
}
.terms-text {
  line-height: 1.5;
  color: var(--text-muted);
}
</style>
"""

with open('app/components/event/ParticipantForm.vue', 'w') as f:
    f.write(new_content)
