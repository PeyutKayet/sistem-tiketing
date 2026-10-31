<template>
  <div class="b2b-survey-container">
    <div class="survey-header-card">
      <div class="survey-badge">SURVEI RISET MINAT</div>
      <h2 class="survey-title">Survei Program CALM — Khazilmu</h2>
      <p class="survey-desc">
        Khazilmu sedang mengembangkan program pembelajaran psikologi diri berbasis Al-Qur’an dan Sunnah. Agar program ini sesuai dengan kebutuhan Anda, kami ingin mendengar pendapat Anda melalui survei singkat ini (1–2 menit).
      </p>
    </div>

    <!-- BAGIAN 1: PROFIL & DEMOGRAFI -->
    <div class="survey-card">
      <h3 class="section-heading">Profil Responden</h3>

      <!-- 1. Jenis Kelamin -->
      <div class="question-group">
        <label class="q-label">1. Jenis kelamin <span class="req">*</span></label>
        <div class="radio-options">
          <label v-for="item in ['Perempuan', 'Laki-laki']" :key="item" class="radio-card" :class="{ selected: surveyData.jenis_kelamin === item }">
            <input type="radio" v-model="surveyData.jenis_kelamin" :value="item" />
            <span class="radio-text">{{ item }}</span>
          </label>
        </div>
      </div>

      <!-- 2. Usia -->
      <div class="question-group mt-4">
        <label class="q-label">2. Usia <span class="req">*</span></label>
        <div class="radio-options grid-2">
          <label v-for="item in ['Di bawah 18 tahun', '18–25 tahun', '26–35 tahun', '36–45 tahun', 'Di atas 45 tahun']" :key="item" class="radio-card" :class="{ selected: surveyData.usia === item }">
            <input type="radio" v-model="surveyData.usia" :value="item" />
            <span class="radio-text">{{ item }}</span>
          </label>
        </div>
      </div>

      <!-- 3. Profesi / Aktivitas -->
      <div class="question-group mt-4">
        <label class="q-label">3. Profesi / aktivitas saat ini <span class="req">*</span></label>
        <div class="radio-options grid-2">
          <label v-for="item in ['Pelajar/mahasiswa', 'Ibu rumah tangga', 'Karyawan/profesional', 'Pengusaha/freelancer', 'Guru/dosen', 'Lainnya']" :key="item" class="radio-card" :class="{ selected: surveyData.profesi_pilihan === item }">
            <input type="radio" v-model="surveyData.profesi_pilihan" :value="item" />
            <span class="radio-text">{{ item === 'Lainnya' ? 'Lainnya...' : item }}</span>
          </label>
        </div>
        <div v-if="surveyData.profesi_pilihan === 'Lainnya'" class="custom-input-box mt-2">
          <input 
            type="text" 
            v-model="surveyData.profesi_lainnya" 
            placeholder="Tuliskan profesi/aktivitas Anda saat ini..." 
            class="survey-input" 
          />
        </div>
      </div>
    </div>

    <!-- TENTANG PROGRAM CALM (INFORMASI EDUKASI) -->
    <div class="info-highlight-card">
      <div class="info-badge">Tentang Program CALM</div>
      <h3 class="info-title">Cognitive Awareness & Learning to Manage Emotions</h3>
      <p class="info-p">
        Program kelola emosi dari Khazilmu, terutama bagi Muslimah. Membantu Anda mengenali pemicu emosi, mengelola amarah dan <i>overthinking</i>, serta menyampaikan perasaan dengan lebih baik melalui pendekatan psikologi ilmiah dan nilai sunnah.
      </p>
      
      <div class="info-features">
        <div class="feat-item">
          <Icon name="lucide:calendar" class="feat-icon" />
          <span><b>Durasi:</b> 2 bulan, online</span>
        </div>
        <div class="feat-item">
          <Icon name="lucide:book-open" class="feat-icon" />
          <span><b>Total materi:</b> 32 video pembelajaran, 8 live session, 8 worksheet</span>
        </div>
        <div class="feat-item">
          <Icon name="lucide:clock" class="feat-icon" />
          <span><b>Ritme belajar:</b> 4 video + 1 live session + 1 worksheet per pekan</span>
        </div>
        <div class="feat-item">
          <Icon name="lucide:award" class="feat-icon" />
          <span><b>Fasilitas:</b> Rekaman live session & Sertifikat resmi kelulusan</span>
        </div>
        <div class="feat-item">
          <Icon name="lucide:users" class="feat-icon" />
          <span><b>Pengajar:</b> Psikolog, Ustadz, dan Dosen International Open University (IOU)</span>
        </div>
      </div>

      <div class="info-target-box">
        <span class="target-title">Program ini sangat cocok untuk Anda yang:</span>
        <ul class="target-list">
          <li>Sering emosi “meledak”, lalu menyesal</li>
          <li>Mudah cemas atau terus memikirkan hal yang belum terjadi</li>
          <li>Lelah menjalani banyak peran sekaligus</li>
          <li>Ingin mengelola emosi secara ilmiah sekaligus sesuai syariat & sunnah</li>
          <li>Ingin merasakan format belajar kuliah psikologi, tanpa harus kuliah bertahun-tahun</li>
        </ul>
        <small class="disclaimer-note">* Program ini bersifat edukasi, bukan pengganti konseling atau terapi medis.</small>
      </div>
    </div>

    <!-- 4. TINGKAT KETERTARIKAN (FILTER PERCABANGAN) -->
    <div class="survey-card">
      <div class="question-group">
        <label class="q-label">4. Seberapa tertarik Anda mengikuti program CALM? <span class="req">*</span></label>
        <div class="radio-options vertical">
          <label 
            v-for="item in [
              { val: 'Sangat tertarik', desc: 'Sangat relevan dan ingin sekali bergabung' },
              { val: 'Tertarik', desc: 'Berminat dan ingin tahu lebih banyak' },
              { val: 'Masih ragu', desc: 'Belum yakin atau perlu waktu mempertimbangkan' },
              { val: 'Tidak tertarik', desc: 'Saat ini belum membutuhkan program ini' }
            ]" 
            :key="item.val" 
            class="radio-card block"
            :class="{ selected: surveyData.minat_calm === item.val }"
          >
            <input type="radio" v-model="surveyData.minat_calm" :value="item.val" />
            <div class="radio-content-wrap">
              <span class="radio-text font-bold">{{ item.val }}</span>
              <span class="radio-subtext">{{ item.desc }}</span>
            </div>
          </label>
        </div>
      </div>
    </div>

    <!-- PERCABANGAN: HANYA TAMPIL JIKA "SANGAT TERTARIK" ATAU "TERTARIK" -->
    <transition name="fade">
      <div v-if="isInterested" class="survey-branch-section">
        
        <!-- 5. Permasalahan & Harapan -->
        <div class="survey-card">
          <div class="question-group">
            <label class="q-label">
              5. Permasalahan apa yang ingin Anda atasi, dan perubahan apa yang Anda harapkan setelah mengikuti CALM? <span class="req">*</span>
            </label>
            <p class="q-hint">Ceritakan secukupnya tanpa perlu membagikan pengalaman pribadi yang sensitif.</p>
            <textarea 
              v-model="surveyData.harapan_calm" 
              rows="3" 
              class="survey-textarea" 
              placeholder="Contoh: Saya ingin lebih sabar saat merespons anak, dan mengurangi rasa cemas yang berlebihan..."
            ></textarea>
          </div>
        </div>

        <!-- INFO PILIHAN KELAS CALM -->
        <div class="class-choice-info-card">
          <h3 class="class-info-title">Pilihan Kelas CALM</h3>
          <div class="class-cards-grid">
            <div class="class-subcard">
              <span class="class-badge blue">Kelas Reguler — Format Kuliah Umum</span>
              <ul class="class-list">
                <li>Live session dalam kelas besar bersama seluruh peserta batch</li>
                <li>8 sesi live via Zoom + rekaman</li>
                <li>32 video pembelajaran</li>
                <li>Worksheet dan latihan setiap pekan</li>
                <li>Sesi tanya jawab di akhir setiap live session</li>
                <li>Dibuka per batch sesuai jadwal Khazilmu</li>
              </ul>
            </div>

            <div class="class-subcard gold">
              <span class="class-badge gold-bg">Kelas Eksklusif — Semi-Private (Maks. 8 Peserta)</span>
              <ul class="class-list">
                <li>Live session dalam kelompok kecil, maksimal 8 peserta</li>
                <li>Materi, video, dan worksheet sama dengan Kelas Reguler</li>
                <li>Diskusi dua arah, setiap peserta mendapat ruang bertanya dan berbagi</li>
                <li>Pendampingan lebih personal dari pengajar</li>
                <li>Jadwal mulai fleksibel, tanpa menunggu batch reguler</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 6. Pilihan Kelas Paling Mungkin -->
        <div class="survey-card">
          <div class="question-group">
            <label class="q-label">6. Jika kedua kelas tersebut dibuka, mana yang paling mungkin Anda pilih? <span class="req">*</span></label>
            <div class="radio-options grid-2">
              <label 
                v-for="item in ['Kelas Reguler', 'Kelas Eksklusif']" 
                :key="item" 
                class="radio-card" 
                :class="{ selected: surveyData.pilihan_kelas === item }"
              >
                <input type="radio" v-model="surveyData.pilihan_kelas" :value="item" />
                <span class="radio-text font-bold">{{ item }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- PERCABANGAN: Q7, Q8, Q9 HANYA TAMPIL SETELAH Q6 DIJAWAB -->
        <transition name="fade">
          <div v-if="surveyData.pilihan_kelas" class="survey-after-q6-section">
            
            <!-- 7. Evaluasi Harga Kelas Reguler (Dynamic Round-Robin) -->
            <div class="survey-card">
              <div class="question-group">
                <label class="q-label">
                  7. Jika biaya total <b>Kelas Reguler CALM</b> selama 2 bulan adalah 
                  <span class="price-pill-tag">{{ assignedTier?.harga_reguler || 'Rp299.000' }}</span>, 
                  bagaimana kemungkinan Anda mendaftar? <span class="req">*</span>
                </label>
                <div class="radio-options vertical">
                  <label 
                    v-for="opt in willingnessOptions" 
                    :key="opt" 
                    class="radio-card" 
                    :class="{ selected: surveyData.respon_harga_reguler === opt }"
                  >
                    <input type="radio" v-model="surveyData.respon_harga_reguler" :value="opt" />
                    <span class="radio-text">{{ opt }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- 8. Evaluasi Harga Kelas Eksklusif (Dynamic Round-Robin) -->
            <div class="survey-card">
              <div class="question-group">
                <label class="q-label">
                  8. Jika biaya total <b>Kelas Eksklusif CALM</b> selama 2 bulan adalah 
                  <span class="price-pill-tag gold">{{ assignedTier?.harga_eksklusif || 'Rp2.500.000' }}</span>, 
                  bagaimana kemungkinan Anda mendaftar? <span class="req">*</span>
                </label>
                <div class="radio-options vertical">
                  <label 
                    v-for="opt in willingnessOptions" 
                    :key="opt" 
                    class="radio-card" 
                    :class="{ selected: surveyData.respon_harga_eksklusif === opt }"
                  >
                    <input type="radio" v-model="surveyData.respon_harga_eksklusif" :value="opt" />
                    <span class="radio-text">{{ opt }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- 9. WhatsApp Info Promo & Consent -->
            <div class="survey-card">
              <div class="question-group">
                <label class="q-label">9. Apakah Anda ingin mendapatkan informasi program dan penawaran promo CALM melalui WhatsApp? <span class="req">*</span></label>
                <div class="radio-options grid-2">
                  <label v-for="item in ['Ya', 'Tidak']" :key="item" class="radio-card" :class="{ selected: surveyData.mau_info_wa === item }">
                    <input type="radio" v-model="surveyData.mau_info_wa" :value="item" />
                    <span class="radio-text font-bold">{{ item }}</span>
                  </label>
                </div>

                <!-- JIKA YA: TAMPILKAN PREVIEW NOMOR WA & CHECKBOX -->
                <div v-if="surveyData.mau_info_wa === 'Ya'" class="wa-consent-box mt-3">
                  <label class="sub-label">Nomor WhatsApp Aktif untuk Info CALM:</label>
                  <div class="wa-preview-row">
                    <input 
                      type="tel" 
                      v-model="surveyData.no_wa_calm" 
                      class="survey-input" 
                      placeholder="081234567890" 
                    />
                  </div>
                  <small class="wa-hint">Nomor di atas terisi otomatis dari data pendaftaran tiket Anda (bisa disesuaikan jika berbeda).</small>

                  <label class="consent-checkbox-row mt-3">
                    <input type="checkbox" v-model="surveyData.setuju_dihubungi_wa" class="custom-chk" />
                    <span class="consent-text">
                      Saya bersedia dihubungi Khazilmu melalui WhatsApp untuk informasi dan promo program CALM. Saya dapat meminta berhenti menerima pesan kapan saja.
                    </span>
                  </label>
                </div>
              </div>
            </div>

          </div>
        </transition>

      </div>
    </transition>

    <!-- TOMBOL AKSI SELESAIKAN SURVEI & DAFTAR -->
    <div class="action-buttons-wrap mt-4">
      <button type="button" @click="$emit('back')" class="btn-prev">
        &larr; KEMBALI KE DATA DIRI
      </button>

      <button 
        type="button" 
        @click="handleCompleteSurvey" 
        class="btn-finish"
        :class="{ 'btn-loading': isSubmitting }"
        :disabled="isSubmitting"
      >
        <span v-if="isSubmitting">MEMPROSES PENDAFTARAN...</span>
        <span v-else>
          {{ isTrulyFree ? 'SELESAIKAN PENDAFTARAN &rarr;' : 'LANJUT KE PEMBAYARAN &rarr;' }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  eventData: { type: Object, default: () => ({}) },
  primaryParticipant: { type: Object, default: () => ({}) },
  isTrulyFree: { type: Boolean, default: true },
  isSubmitting: { type: Boolean, default: false }
})

const emit = defineEmits(['back', 'complete', 'toast'])

// State Data Kuesioner
const surveyData = ref({
  jenis_kelamin: '',
  usia: '',
  profesi_pilihan: '',
  profesi_lainnya: '',
  profesi_final: '',
  minat_calm: '',
  harapan_calm: '',
  pilihan_kelas: '',
  respon_harga_reguler: '',
  respon_harga_eksklusif: '',
  mau_info_wa: '',
  no_wa_calm: '',
  setuju_dihubungi_wa: false,
  // Metadata Pengujian Harga
  calm_tahap: 1,
  calm_harga_reguler_diuji: 'Rp500.000',
  calm_harga_eksklusif_diuji: 'Rp1.700.000'
})

const willingnessOptions = [
  'Sangat mungkin mendaftar',
  'Mungkin, tetapi perlu informasi lebih lanjut',
  'Tertarik, tetapi harga di luar anggaran',
  'Tidak berminat mendaftar pada harga tersebut'
]

const assignedTier = ref(null)

// Apakah responden lanjut mengisi survei? (Hanya "Tidak tertarik" yang melewati pertanyaan No. 5 s/d 9)
const isInterested = computed(() => {
  return !!surveyData.value.minat_calm && surveyData.value.minat_calm !== 'Tidak tertarik'
})

// Auto-fill Nomor WhatsApp dari identitas peserta langkah sebelumnya
watch(() => props.primaryParticipant, (newVal) => {
  if (newVal && newVal.phone && !surveyData.value.no_wa_calm) {
    surveyData.value.no_wa_calm = newVal.phone
  }
}, { immediate: true, deep: true })

// Ambil Tier Harga Round-Robin dari API
onMounted(async () => {
  try {
    const slug = props.eventData?.slug || ''
    const eventId = props.eventData?.id || ''
    const res = await $fetch(`/api/survey/pricing-tier?event_id=${eventId}&slug=${slug}`)
    if (res && res.assigned_tier) {
      assignedTier.value = res.assigned_tier
      surveyData.value.calm_tahap = res.tier_number || 1
      surveyData.value.calm_harga_reguler_diuji = res.assigned_tier.harga_reguler
      surveyData.value.calm_harga_eksklusif_diuji = res.assigned_tier.harga_eksklusif
    }
  } catch (err) {
    console.warn('[B2B Survey] Gagal load dynamic pricing tier, fallback ke Tahap 1:', err)
    assignedTier.value = {
      tier: 1,
      harga_reguler: 'Rp500.000',
      harga_eksklusif: 'Rp1.700.000'
    }
  }
})

// Validasi & Submit Kuesioner
const handleCompleteSurvey = () => {
  // 1. Validasi Profil Wajib (Q1, Q2, Q3)
  if (!surveyData.value.jenis_kelamin) {
    emit('toast', 'Mohon pilih jenis kelamin Anda', 'warning')
    return
  }
  if (!surveyData.value.usia) {
    emit('toast', 'Mohon pilih rentang usia Anda', 'warning')
    return
  }
  if (!surveyData.value.profesi_pilihan) {
    emit('toast', 'Mohon pilih profesi Anda saat ini', 'warning')
    return
  }
  if (surveyData.value.profesi_pilihan === 'Lainnya' && !surveyData.value.profesi_lainnya.trim()) {
    emit('toast', 'Mohon tuliskan profesi Anda pada kolom yang tersedia', 'warning')
    return
  }

  // Tentukan profesi final
  surveyData.value.profesi_final = surveyData.value.profesi_pilihan === 'Lainnya'
    ? surveyData.value.profesi_lainnya.trim()
    : surveyData.value.profesi_pilihan

  // 2. Validasi Minat (Q4)
  if (!surveyData.value.minat_calm) {
    emit('toast', 'Mohon pilih seberapa tertarik Anda mengikuti program CALM', 'warning')
    return
  }

  // 3. Jika Tertarik -> Wajib Validasi Q5 s/d Q9
  if (isInterested.value) {
    if (!surveyData.value.harapan_calm.trim()) {
      emit('toast', 'Mohon ceritakan singkat harapan Anda pada pertanyaan No. 5', 'warning')
      return
    }
    if (!surveyData.value.pilihan_kelas) {
      emit('toast', 'Mohon pilih preferensi kelas pada pertanyaan No. 6', 'warning')
      return
    }
    if (!surveyData.value.respon_harga_reguler) {
      emit('toast', 'Mohon jawab kemungkinan mendaftar Kelas Reguler pada pertanyaan No. 7', 'warning')
      return
    }
    if (!surveyData.value.respon_harga_eksklusif) {
      emit('toast', 'Mohon jawab kemungkinan mendaftar Kelas Eksklusif pada pertanyaan No. 8', 'warning')
      return
    }
    if (!surveyData.value.mau_info_wa) {
      emit('toast', 'Mohon pilih apakah Anda ingin mendapat info promo via WA pada pertanyaan No. 9', 'warning')
      return
    }
    if (surveyData.value.mau_info_wa === 'Ya') {
      if (!surveyData.value.no_wa_calm.trim()) {
        emit('toast', 'Mohon periksa nomor WhatsApp Anda untuk info promo', 'warning')
        return
      }
      if (!surveyData.value.setuju_dihubungi_wa) {
        emit('toast', 'Mohon centang persetujuan penerimaan pesan promo via WhatsApp', 'warning')
        return
      }
    }
  }

  // Format data yang akan disimpan ke peserta.data_tambahan
  const finalPayload = {
    calm_survey_completed: true,
    calm_jenis_kelamin: surveyData.value.jenis_kelamin,
    calm_usia: surveyData.value.usia,
    calm_profesi: surveyData.value.profesi_final,
    calm_minat: surveyData.value.minat_calm,
    calm_harapan: isInterested.value ? surveyData.value.harapan_calm.trim() : null,
    calm_pilihan_kelas: isInterested.value ? surveyData.value.pilihan_kelas : null,
    calm_tahap_pricing: isInterested.value ? surveyData.value.calm_tahap : null,
    calm_harga_reguler_diuji: isInterested.value ? surveyData.value.calm_harga_reguler_diuji : null,
    calm_respon_harga_reguler: isInterested.value ? surveyData.value.respon_harga_reguler : null,
    calm_harga_eksklusif_diuji: isInterested.value ? surveyData.value.calm_harga_eksklusif_diuji : null,
    calm_respon_harga_eksklusif: isInterested.value ? surveyData.value.respon_harga_eksklusif : null,
    calm_mau_info_wa: isInterested.value ? surveyData.value.mau_info_wa : 'Tidak',
    calm_no_wa_info: (isInterested.value && surveyData.value.mau_info_wa === 'Ya') ? surveyData.value.no_wa_calm.trim() : null,
    calm_consent_wa: isInterested.value ? surveyData.value.setuju_dihubungi_wa : false
  }

  emit('complete', finalPayload)
}
</script>

<style scoped>
.b2b-survey-container {
  max-width: 680px;
  margin: 0 auto;
  font-family: inherit;
}

.survey-header-card {
  background: linear-gradient(135deg, #0C387A 0%, #1e40af 100%);
  color: #ffffff;
  padding: 22px 20px;
  border-radius: 16px;
  margin-bottom: 18px;
  box-shadow: 0 4px 14px rgba(12, 56, 122, 0.15);
}

.survey-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 3px 10px;
  border-radius: 99px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.survey-title {
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0 0 6px 0;
  line-height: 1.3;
}

.survey-desc {
  font-size: 0.85rem;
  opacity: 0.92;
  margin: 0;
  line-height: 1.5;
}

.survey-card {
  background: #ffffff;
  border: 1px solid var(--border-soft, #e2e8f0);
  border-radius: 14px;
  padding: 18px 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
}

.section-heading {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 14px 0;
  border-bottom: 1px dashed #e2e8f0;
  padding-bottom: 8px;
}

.q-label {
  display: block;
  font-size: 0.92rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 10px;
  line-height: 1.45;
}

.req {
  color: #ef4444;
  font-weight: 700;
}

.q-hint {
  font-size: 0.78rem;
  color: #64748b;
  margin: -4px 0 10px 0;
}

.radio-options {
  display: flex;
  gap: 8px;
}

.radio-options.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.radio-options.vertical {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radio-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  background: #ffffff;
  transition: all 0.2s ease;
  user-select: none;
}

.radio-card:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.radio-card.selected {
  border-color: #0C387A;
  background: #eff6ff;
  box-shadow: 0 0 0 1px #0C387A;
}

.radio-card.block {
  padding: 12px 14px;
}

.radio-card input[type="radio"] {
  accent-color: #0C387A;
  width: 16px;
  height: 16px;
  margin: 0;
  flex-shrink: 0;
}

.radio-content-wrap {
  display: flex;
  flex-direction: column;
}

.radio-text {
  font-size: 0.86rem;
  color: #1e293b;
}

.radio-subtext {
  font-size: 0.74rem;
  color: #64748b;
  margin-top: 2px;
}

.survey-input {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.88rem;
  color: #0f172a;
  outline: none;
  box-sizing: border-box;
}

.survey-input:focus {
  border-color: #0C387A;
  box-shadow: 0 0 0 3px rgba(12, 56, 122, 0.12);
}

.survey-textarea {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.88rem;
  color: #0f172a;
  outline: none;
  box-sizing: border-box;
  resize: vertical;
}

.survey-textarea:focus {
  border-color: #0C387A;
  box-shadow: 0 0 0 3px rgba(12, 56, 122, 0.12);
}

/* Info Program CALM Box */
.info-highlight-card {
  background: #f8fafc;
  border: 1.5px solid #cbd5e1;
  border-left: 5px solid #0C387A;
  border-radius: 12px;
  padding: 18px 16px;
  margin-bottom: 16px;
}

.info-badge {
  font-size: 0.7rem;
  font-weight: 700;
  color: #0C387A;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.info-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 8px 0;
}

.info-p {
  font-size: 0.84rem;
  color: #334155;
  line-height: 1.55;
  margin: 0 0 12px 0;
}

.info-features {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  margin-bottom: 14px;
}

.feat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: #1e293b;
}

.feat-icon {
  font-size: 15px;
  color: #0C387A;
  flex-shrink: 0;
}

.info-target-box {
  background: #ffffff;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.target-title {
  display: block;
  font-size: 0.82rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 6px;
}

.target-list {
  margin: 0;
  padding-left: 18px;
  font-size: 0.8rem;
  color: #475569;
  line-height: 1.5;
}

.disclaimer-note {
  display: block;
  font-size: 0.72rem;
  color: #64748b;
  font-style: italic;
  margin-top: 8px;
}

/* Class Choice Card */
.class-choice-info-card {
  background: #f1f5f9;
  border-radius: 12px;
  padding: 16px 14px;
  margin-bottom: 16px;
}

.class-info-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 12px 0;
}

.class-cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.class-subcard {
  background: #ffffff;
  padding: 12px 10px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
}

.class-subcard.gold {
  border-color: #d97706;
  background: #fffbeb;
}

.class-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.72rem;
  font-weight: 800;
  margin-bottom: 8px;
}

.class-badge.blue {
  background: #dbeafe;
  color: #1e40af;
}

.class-badge.gold-bg {
  background: #fef3c7;
  color: #92400e;
}

.class-list {
  margin: 0;
  padding-left: 14px;
  font-size: 0.76rem;
  color: #334155;
  line-height: 1.45;
}

.price-pill-tag {
  display: inline-block;
  background: #dbeafe;
  color: #1e3a8a;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 6px;
  margin: 0 2px;
}

.price-pill-tag.gold {
  background: #fef3c7;
  color: #92400e;
}

.wa-consent-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 14px;
}

.sub-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 6px;
}

.wa-hint {
  display: block;
  font-size: 0.72rem;
  color: #64748b;
  margin-top: 4px;
}

.consent-checkbox-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.custom-chk {
  margin-top: 3px;
  width: 16px;
  height: 16px;
  accent-color: #0C387A;
  flex-shrink: 0;
}

.consent-text {
  font-size: 0.78rem;
  color: #334155;
  line-height: 1.45;
}

/* Action Buttons */
.action-buttons-wrap {
  display: flex;
  gap: 10px;
}

.btn-prev {
  flex: 1;
  padding: 12px 14px;
  background: #f1f5f9;
  color: #334155;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-prev:hover {
  background: #e2e8f0;
}

.btn-finish {
  flex: 2;
  padding: 12px 16px;
  background: #0C387A;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(12, 56, 122, 0.25);
}

.btn-finish:hover:not(:disabled) {
  background: #082857;
  transform: translateY(-1px);
}

.btn-finish:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 640px) {
  .radio-options.grid-2 {
    grid-template-columns: 1fr;
  }
  .class-cards-grid {
    grid-template-columns: 1fr;
  }
  .action-buttons-wrap {
    flex-direction: column;
  }
  .btn-prev, .btn-finish {
    width: 100%;
    flex: none;
  }
}
</style>
