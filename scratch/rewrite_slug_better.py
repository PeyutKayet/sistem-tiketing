import re

with open('scratch/slug_vue_backup.vue', 'r') as f:
    content = f.read()

# Extract script setup part
script_match = re.search(r'<script setup>(.*?)</script>', content, re.DOTALL)
script_content = script_match.group(1)

# Modify script
script_content = script_content.replace(
    "import { ref, onMounted, computed } from 'vue'",
    "import { ref, onMounted, computed } from 'vue'\nimport { useCart } from '~/composables/useCart'\nimport { useImageCompress } from '~/composables/useImageCompress'\nimport { formatPrice } from '~/utils/format'\nimport EventHeader from '~/components/event/EventHeader.vue'\nimport TicketList from '~/components/event/TicketList.vue'\nimport ParticipantForm from '~/components/event/ParticipantForm.vue'\nimport CheckoutPayment from '~/components/event/CheckoutPayment.vue'\nimport SuccessStep from '~/components/event/SuccessStep.vue'"
)

# Replace the whole block of functions up to cart logic
# From: `const handlePhoneInput`
# To: `// --- STATE KERANJANG TIKET & UI ---`
script_content = re.sub(
    r'const handlePhoneInput.*?// --- STATE KERANJANG TIKET & UI ---',
    'const { compressImageFile } = useImageCompress()\n\n// --- STATE KERANJANG TIKET & UI ---',
    script_content,
    flags=re.DOTALL
)


# Remove old keranjang state and methods, replace with useCart
cart_logic_pattern = r'// --- STATE KERANJANG TIKET & UI ---[\s\S]*?// --- KOMPUTASI PROGRESS BAR ---'
new_cart_logic = """// --- STATE KERANJANG TIKET & UI ---
const currentStep = ref('home')
const isSetujuSnk = ref(false)
const daftarPeserta = ref([])

const customFields = computed(() => {
  const fields = eventData.value?.settings?.pertanyaan_kustom
  if (!fields || fields.length === 0) {
    return [
      { field_key: 'nama_lengkap', label: 'Nama Lengkap', required: true, width: 12, type: 'short_text' },
      { field_key: 'email', label: 'Email', required: true, width: 6, type: 'email' },
      { field_key: 'no_wa', label: 'No. WhatsApp', required: true, width: 6, type: 'phone_wa' }
    ]
  }
  return fields
})

const kodeUnik = ref(0)
onMounted(() => {
  kodeUnik.value = Math.floor(Math.random() * 399) + 101
})

const adminFee = 2000

const { keranjang, totalQty, totalPrice, grandTotal, updateKeranjang } = useCart(tickets, kodeUnik, adminFee, showToastMsg)

// --- KOMPUTASI PROGRESS BAR ---"""
script_content = re.sub(cart_logic_pattern, new_cart_logic, script_content)

# Remove formatPrice function
script_content = re.sub(r'const formatPrice = \(price\) => \{[\s\S]*?\}\n', '', script_content)


new_template = """<template>
  <div class="container">
    <!-- PUBLIC TOAST -->
    <div v-if="toastMessage" style="position:fixed; top:20px; left:50%; transform:translateX(-50%); z-index:9999; padding:12px 24px; border-radius:30px; font-weight:600; font-size:14px; box-shadow:0 8px 24px rgba(0,0,0,0.15); animation:slideDown 0.3s ease-out; color:#fff;" :style="{ background: toastType === 'success' ? '#1a6a4a' : '#d43f34' }">
      {{ toastMessage }}
    </div>

    <!-- State Loading -->
    <div v-if="loading" style="padding: 50px; text-align: center; color: var(--text-main);">
      Mempersiapkan ruang yang aman dan nyaman...
    </div>

    <!-- State Error -->
    <div v-else-if="error" style="padding: 50px; text-align: center; color: #ef4444;">
      {{ error }}
    </div>

    <!-- Tampilan Landing Page Event (HOME) -->
    <div v-else-if="currentStep === 'home'" class="step-content active" style="padding: 6px;">
      <div class="glass" style="margin-top: 0px; padding: 1rem 1rem 0.5rem 1rem;">
        
        <EventHeader 
          :eventData="eventData"
          :organizerProfile="organizerProfile"
          :totalMaksimalKuota="totalMaksimalKuota"
          :totalSisaKuota="totalSisaKuota"
          :persentaseTerisi="persentaseTerisi"
        />

        <TicketList 
          :tickets="tickets"
          :keranjang="keranjang"
          @update-keranjang="updateKeranjang"
        />

        <!-- Tombol Daftar -->
        <button @click="lanjutDaftar" style="margin-top: 0; padding: 0.75rem; border-radius: 10px; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 0.85rem; flex-direction: column; line-height: 1.2; width: 100%; background: var(--primary); color: white; border: none; cursor: pointer; transition: 0.2s;">
          <div style="display: flex; align-items: center; gap: 6px; font-weight: 600;">DAFTAR SEKARANG ➔</div>
          <small v-if="totalQty > 0" style="font-size: 0.65rem; font-weight: 600; opacity: 0.9;">
            {{ totalQty }} Tiket • {{ totalPrice === 0 ? 'GRATIS' : formatPrice(totalPrice) }}
          </small>
        </button>

        <!-- Tombol Sosial Media -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.4rem; margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #e2e8f0;">
          <a :href="organizerProfile.link_ig || '#'" target="_blank" style="background: #ffffff; padding: 0.5rem 0.25rem; border-radius: 8px; display: flex; flex-direction: column; align-items: center; gap: 0.25rem; text-decoration: none; border: 1px solid #e2e8f0; transition: 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
            <span style="font-size: 0.6rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Instagram</span>
          </a>
          <a :href="formatWaLink(organizerProfile.no_wa)" target="_blank" style="background: #ffffff; padding: 0.5rem 0.25rem; border-radius: 8px; display: flex; flex-direction: column; align-items: center; gap: 0.25rem; text-decoration: none; border: 1px solid #e2e8f0; transition: 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
            <span style="font-size: 0.6rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">WhatsApp</span>
          </a>
          <a :href="organizerProfile.link_web || '#'" target="_blank" style="background: #ffffff; padding: 0.5rem 0.25rem; border-radius: 8px; display: flex; flex-direction: column; align-items: center; gap: 0.25rem; text-decoration: none; border: 1px solid #e2e8f0; transition: 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
            <span style="font-size: 0.6rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Website</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Tampilan Syarat & Ketentuan (S&K) -->
    <div v-else-if="currentStep === 'snk'" class="step-content active" style="padding: 12px 15px;">
      <h3 style="margin-top:0; color:var(--primary); text-align:center;">Syarat & Ketentuan</h3>
      <p style="font-size: 0.8rem; text-align:center; color:var(--text-muted); margin-top:-5px;">Mohon baca dan setujui sebelum melanjutkan</p>
      
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; max-height: 250px; overflow-y: auto; font-size: 0.7rem; line-height: 1.5; color: var(--text-muted); margin-bottom: 10px; white-space: pre-wrap;">
        {{ eventData.settings?.snk_text || 'Syarat dan ketentuan berlaku mengikuti aturan panitia EventHub.' }}
      </div>
      
      <label style="display: flex; align-items: center; gap: 8px; font-size: 0.75rem; font-weight: 600; cursor: pointer; margin-bottom: 15px;">
        <input type="checkbox" v-model="isSetujuSnk" style="width: 20px; height: 20px; accent-color: var(--primary);">
        Saya menyetujui persyaratan di atas
      </label>

      <div style="display: flex; gap: 8px;">
        <button @click="currentStep = 'home'" style="flex: 3; padding: 12px; border-radius: 10px; font-weight: 600; background: #e2e8f0; color: #475569; border: none; cursor: pointer;">KEMBALI</button>
        <button @click="setujuDanLanjut" style="flex: 7; padding: 12px; border-radius: 10px; font-weight: 600; background: var(--primary); color: white; border: none; cursor: pointer;">LANJUTKAN ➔</button>
      </div>
    </div>

    <!-- Tampilan Form Data Diri (FORM) -->
    <div v-else-if="currentStep === 'form'" class="step-content active" style="padding: 12px 15px;">
      <h3 style="margin-top:0;">Data Diri Peserta</h3>
      
      <ParticipantForm 
        :daftarPeserta="daftarPeserta" 
        :customFields="customFields" 
        @toast="showToastMsg"
      />

      <div style="display: flex; gap: 8px; margin-top: 15px;">
        <button @click="kembaliKeSnkAtauHome" style="flex: 3; padding: 12px; border-radius: 10px; font-weight: 600; background: #e2e8f0; color: #475569; border: none; cursor: pointer;">KEMBALI</button>
        <button @click="lanjutBayar" style="flex: 7; padding: 12px; border-radius: 10px; font-weight: 600; background: var(--primary); color: white; border: none; cursor: pointer;">LANJUT BAYAR ➔</button>
      </div>
    </div>

    <!-- Tampilan Pembayaran (BAYAR) -->
    <div v-else-if="currentStep === 'bayar'" class="step-content active" style="padding: 12px 15px;">
      <CheckoutPayment 
        :grandTotal="grandTotal"
        :totalQty="totalQty"
        :totalPrice="totalPrice"
        :adminFee="adminFee"
        :kodeUnik="kodeUnik"
        :buktiBayarPreview="buktiBayarPreview"
        :uploadError="uploadError"
        :isSubmitting="isSubmitting"
        @file-upload="handleFileUpload"
        @back="currentStep = 'form'"
        @submit="submitData"
        @toast="showToastMsg"
      />
    </div>

    <!-- Tampilan Sukses (SUKSES) -->
    <div v-else-if="currentStep === 'sukses'" class="step-content active">
      <SuccessStep 
        :eventData="eventData"
        @kirim-wa="kirimWA"
        @buka-grup="bukaGrupWa"
      />
    </div>
  </div>

  <!-- PRINTER ANIMATION OVERLAY -->
  <div class="api-loader" :class="{ active: isSubmitting }">
    <div class="printer-wrapper">
      <div class="printer-slot"><div class="printer-slot-inner"><div class="printer-slot-light"></div></div></div>
      <div class="printer-mask">
        <div class="ticket-paper-output">
          <div style="font-size: 11px; font-weight: 900; letter-spacing: 2px; color: var(--primary); text-transform: uppercase; margin-bottom: 4px; text-align: center;">★ E-TICKET RESMI ★</div>
          <div style="font-size: 9px; font-weight: 800; color: var(--text-muted); margin-bottom: 16px; text-align: center; text-transform: uppercase;">{{ eventData?.nama_event || 'EVENT' }}</div>
          
          <div style="width: 100%; border-top: 2px dashed #cbd5e1; margin-bottom: 16px;"></div>
          
          <div style="width: 100%; text-align: center;">
            <span style="font-size: 11px; font-weight: 800; color: var(--text-muted); display: block; margin-bottom: 2px;">PESERTA</span>
            <span style="font-size: 14px; font-weight: 900; color: var(--text-main); text-transform: uppercase;">{{ daftarPeserta[0]?.jawaban?.nama_lengkap || 'PESERTA' }}</span>
          </div>

          <div style="display: flex; justify-content: center; align-items: center; width: 100%; margin-top: 10px; padding: 6px 0; border-top: 1px dashed #cbd5e1; border-bottom: 1px dashed #cbd5e1;">
             <span style="font-size: 13px; font-weight: 900; color: var(--text-main); font-family: monospace; letter-spacing: 2px;">{{ transactionIdGlobal || 'MEMPROSES...' }}</span>
          </div>

          <div style="display: flex; justify-content: space-between; width: 100%; margin-top: 10px; font-size: 10px; font-weight: 900; color: var(--text-muted); border-top: 1px dotted #cbd5e1; padding-top: 8px;">
             <span>{{ daftarPeserta.length }} TIKET</span>
             <span style="color: var(--primary);">LUNAS</span>
          </div>
          
          <div class="fake-barcode-area">
             <div style="width: 4px;"></div><div style="width: 8px;"></div>
             <div style="width: 4px;"></div><div style="width: 16px;"></div>
             <div style="width: 4px;"></div><div style="width: 4px;"></div>
             <div style="width: 8px;"></div><div style="width: 12px;"></div>
             <div style="width: 4px;"></div><div style="width: 16px;"></div>
             <div style="width: 4px;"></div><div style="width: 8px;"></div>
             <div style="width: 8px;"></div><div style="width: 4px;"></div>
             <div style="width: 16px;"></div><div style="width: 4px;"></div>
             <div style="width: 12px;"></div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="loading-badge">
      <div class="loading-dot"></div>
      MENCETAK TIKET...
    </div>
  </div>
</template>
"""

# Extract style part
style_match = re.search(r'<style scoped>.*?</style>', content, re.DOTALL)
style_content = style_match.group(0) if style_match else ""

final_content = f"{new_template}\n\n<script setup>\n{script_content}\n</script>\n\n{style_content}"

with open('app/pages/[slug].vue', 'w') as f:
    f.write(final_content)
