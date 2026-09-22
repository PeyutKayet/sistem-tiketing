<template>
  <div class="container" style="display: block; margin: 10px auto;">
    
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
        
        <!-- Poster & Judul -->
        <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem;">
          <NuxtImg :src="fixPosterUrl(eventData.poster_url) || 'https://placehold.co/400x100/F8FAFC/64748B?text=POSTER+EVENT'" alt="Poster Event" style="width: 100%; height: 100px; object-fit: cover; border-radius: 10px; margin-bottom: 0.5rem; border: 1px solid var(--border-soft); box-shadow: var(--shadow-sm);" />
          <p style="font-size: 0.65rem; font-weight: 700; letter-spacing: 0.05em; color: var(--accent-main); text-transform: uppercase; margin-bottom: 0.1rem;">
            {{ organizerProfile.nama_organizer || 'EventHub Organizer' }}
          </p>
          <h1 style="font-size: 1.2rem; font-weight: 800; color: var(--text-main); line-height: 1.2; margin: 0; letter-spacing: -0.5px;">
            {{ eventData.nama_event }}
          </h1>
        </div>

        <!-- Info Tanggal & Lokasi -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; margin-bottom: 0.75rem;">
          <div style="background: var(--bg-light); padding: 0.5rem; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.2rem; border: 1px solid var(--border-soft);">
            <span style="font-size: 0.7rem; font-weight: 600; color: var(--text-main); text-align: center;">{{ formatDate(eventData.tanggal_mulai) }}</span>
          </div>
          <div style="background: var(--bg-light); padding: 0.5rem; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.2rem; border: 1px solid var(--border-soft);">
            <span style="font-size: 0.7rem; font-weight: 600; color: var(--text-main); text-align: center;">{{ eventData.lokasi || 'Lokasi Menyusul' }}</span>
          </div>
        </div>

        <!-- Deskripsi & Progress Bar Kuota -->
        <div class="pricing-status-card" style="padding: 0.75rem; margin-bottom: 0.75rem; background: var(--card-light); border: 1px solid var(--border-soft); border-radius: 12px; text-align: left;">
          <span style="font-size: 0.65rem; font-weight: 700; color: var(--text-muted); letter-spacing: 1px;">DESKRIPSI EVENT</span>
          <p style="font-size: 0.7rem; color: var(--text-main); line-height: 1.3; margin-top: 2px;">
            {{ eventData.deskripsi || 'Deskripsi tidak tersedia.' }}
          </p>
          
          <div style="margin: 8px 0; height: 1px; background: var(--border-soft);"></div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-size: 0.7rem; font-weight: 700; color: var(--text-main);">SISA KUOTA</span>
            <span style="font-size:0.7rem; font-weight:600; color:var(--text-muted);"><b style="color:var(--text-main); font-size:0.9rem; font-weight:800;">{{ totalSisaKuota }}</b> / {{ totalMaksimalKuota }}</span>
          </div>
          <div style="width: 100%; height: 5px; background: var(--border-soft); border-radius: 10px; overflow: hidden;">
            <div :style="{ width: persentaseTerisi + '%', height: '100%', background: 'var(--accent-main)', transition: 'width 1.5s ease-in-out' }"></div>
          </div>
        </div>

        <!-- Daftar Tiket -->
        <div style="margin-bottom: 1rem; display: flex; flex-direction: column; gap: 8px;">
          <div v-for="tiket in tickets" :key="tiket.id" style="background: var(--card-light); border: 1px solid var(--border-soft); border-radius: 10px; padding: 10px 12px; display: flex; justify-content: space-between; align-items: center; transition: var(--transition);" :style="{ opacity: tiket.sisa_kuota <= 0 ? '0.6' : '1' }">
            <div style="flex: 1; text-align: left;">
              <div style="font-weight: 700; font-size: 0.85rem; color: var(--text-main);">{{ tiket.nama_kategori }}</div>
              <div style="display: flex; align-items: center; gap: 6px; margin-top: 2px;">
                <span style="font-size: 0.8rem; color: var(--accent-main); font-weight: 800;">
                  {{ tiket.harga === 0 ? 'GRATIS' : formatPrice(tiket.harga) }}
                </span>
                <span style="font-size: 0.65rem; color: var(--text-muted); border-left: 1px solid var(--border-soft); padding-left: 6px;">
                  Sisa: {{ tiket.sisa_kuota }}
                </span>
              </div>
            </div>
            
            <div style="display: flex; align-items: center; gap: 8px; background: var(--bg-light); padding: 4px; border-radius: 8px; border: 1px solid var(--border-soft);">
              <button @click="updateKeranjang(tiket.id, -1, tiket.sisa_kuota)" :disabled="tiket.sisa_kuota <= 0" style="width: 24px; height: 24px; border-radius: 4px; border: none; background: var(--card-light); color: var(--text-main); font-weight: bold; cursor: pointer; display: flex; justify-content: center; align-items: center; box-shadow: var(--shadow-sm);">-</button>
              <span style="font-weight: 800; width: 14px; text-align: center; color: var(--text-main); font-size: 0.85rem;">{{ keranjang[tiket.id] || 0 }}</span>
              <button @click="updateKeranjang(tiket.id, 1, tiket.sisa_kuota)" :disabled="tiket.sisa_kuota <= 0" style="width: 24px; height: 24px; border-radius: 4px; border: none; background: var(--text-main); color: var(--card-light); font-weight: bold; cursor: pointer; display: flex; justify-content: center; align-items: center; box-shadow: var(--shadow-sm);">+</button>
            </div>
          </div>
        </div>

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
      
      <!-- Loop per tiket yang dibeli -->
      <div v-for="(peserta, index) in daftarPeserta" :key="index" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
        <h4 style="margin: 0 0 12px; color: var(--primary); border-bottom: 1px dashed #e2e8f0; padding-bottom: 8px;">👤 Data Peserta Ke-{{ index + 1 }}</h4>
        
        <div style="margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 0.7rem; color: var(--text-muted); font-weight: 700;">🎟️ TIKET:</span>
          <span style="font-size: 0.75rem; font-weight: 800; color: var(--accent-main); background: #eff6ff; padding: 4px 10px; border-radius: 6px;">{{ peserta.namaTiket }}</span>
        </div>

        <!-- Render Custom Fields -->
        <div style="display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 10px;">
          <div v-for="field in customFields" :key="field.field_key" :style="{ gridColumn: `span ${field.width || 12}` }">
            
            <!-- Header Type -->
            <div v-if="field.type === 'header'" style="border-bottom: 2px solid var(--border-soft); padding-bottom: 6px; margin: 12px 0 6px;">
              <h3 style="margin: 0; color: var(--text-main); font-size: 1.1rem;">{{ field.label }}</h3>
            </div>

            <!-- Other Input Types -->
            <div v-else>
              <label style="display: block; margin-bottom: 6px; font-size: 0.75rem; font-weight: 600; color: var(--text-muted);">
                {{ field.label }} <span v-if="field.required" style="color: #ef4444;">*</span>
              </label>

              <!-- Phone Type (phone_wa) -->
              <div v-if="field.type === 'phone_wa'" style="display: flex; gap: 8px;">
                <input type="text" v-model="peserta['_cc_' + field.field_key]" placeholder="62" style="width: 55px; min-width: 0; padding: 10px; box-sizing: border-box; text-align: center; background: var(--bg-light); border: 1px solid var(--border-soft); border-radius: 8px; font-size: 0.85rem; font-weight: 600;" />
                <input type="tel" v-model="peserta.jawaban[field.field_key]" @input="handlePhoneInput(peserta, field.field_key)" placeholder="81234567890" style="flex: 1; min-width: 0; padding: 10px 12px; box-sizing: border-box; background: var(--bg-light); border: 1px solid var(--border-soft); border-radius: 8px; font-size: 0.85rem;" />
              </div>

              <!-- Paragraph (long_text) -->
              <textarea v-else-if="field.type === 'paragraph'" v-model="peserta.jawaban[field.field_key]" rows="3" style="width: 100%; padding: 10px 12px; box-sizing: border-box; background: var(--bg-light); border: 1px solid var(--border-soft); border-radius: 8px; font-family: inherit; font-size: 0.85rem; outline: none;" :placeholder="field.label"></textarea>

              <!-- Dropdown -->
              <select v-else-if="field.type === 'dropdown'" v-model="peserta.jawaban[field.field_key]" style="width: 100%; padding: 10px 12px; box-sizing: border-box; background: var(--bg-light); border: 1px solid var(--border-soft); border-radius: 8px; font-size: 0.85rem; appearance: none;">
                <option value="">Pilih Opsi...</option>
                <option v-for="(opt, i) in field.options" :key="i" :value="opt">{{ opt }}</option>
              </select>

              <!-- Multiple Choice (radio) -->
              <div v-else-if="field.type === 'multiple_choice'" style="display: flex; flex-direction: column; gap: 8px; margin-top: 4px;">
                <label v-for="(opt, i) in field.options" :key="i" style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; cursor: pointer;">
                  <input type="radio" :value="opt" v-model="peserta.jawaban[field.field_key]" style="width: 16px; height: 16px; flex-shrink: 0; accent-color: var(--primary);" /> {{ opt }}
                </label>
              </div>

              <!-- Checkboxes -->
              <div v-else-if="field.type === 'checkboxes'" style="display: flex; flex-direction: column; gap: 8px; margin-top: 4px;">
                <label v-for="(opt, i) in field.options" :key="i" style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; cursor: pointer;">
                  <input type="checkbox" :value="opt" v-model="peserta.jawaban[field.field_key]" style="width: 16px; height: 16px; flex-shrink: 0; accent-color: var(--primary);" /> {{ opt }}
                </label>
              </div>

              <!-- Linear Scale -->
              <div v-else-if="field.type === 'linear_scale'" style="margin-top: 10px; margin-bottom: 5px; padding: 15px 12px; background: var(--bg-light); border-radius: 8px; border: 1px solid var(--border-soft);">
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
                  <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">1</span>
                  
                  <div style="display: flex; flex: 1; justify-content: space-between; align-items: center;">
                    <label v-for="n in field.scaleCount || 5" :key="n" style="cursor: pointer; display: flex; flex-direction: column; align-items: center; position: relative; padding: 2px;">
                      <!-- Tooltip Angka Terpilih -->
                      <span v-if="peserta.jawaban[field.field_key] === n" style="position: absolute; top: -18px; font-size: 0.75rem; font-weight: 800; color: var(--primary);">{{ n }}</span>
                      
                      <input type="radio" :value="n" v-model="peserta.jawaban[field.field_key]" style="margin: 0; width: 18px; height: 18px; accent-color: var(--primary); cursor: pointer;" />
                    </label>
                  </div>
                  
                  <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">{{ field.scaleCount || 5 }}</span>
                </div>
              </div>

              <!-- File Upload -->
              <div v-else-if="field.type === 'file_upload'">
                <!-- Saat ini hanya placeholder text input, bisa dikembangkan integrasi Storage jika butuh -->
                <input type="file" @change="e => handleCustomUpload(e, peserta, field.field_key)" style="width: 100%; box-sizing: border-box; padding: 8px; background: var(--bg-light); border: 1px dashed var(--border-soft); border-radius: 8px; font-size: 0.8rem;" />
                <small v-if="peserta.jawaban[field.field_key]" style="color: #10b981; font-size: 0.7rem; display: block; margin-top: 4px;">✓ File dipilih</small>
              </div>

              <!-- Terms / Persetujuan -->
              <label v-else-if="field.type === 'terms'" style="display: flex; gap: 10px; font-size: 0.75rem; align-items: flex-start; padding: 12px; box-sizing: border-box; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer;">
                <input type="checkbox" v-model="peserta.jawaban[field.field_key]" style="margin-top: 3px; width: 16px; height: 16px; accent-color: var(--primary); flex-shrink: 0;" />
                <span style="line-height: 1.5; color: var(--text-muted);">{{ field.termsText || field.label }}</span>
              </label>
              
              <!-- Default / Short Text / Date / Time -->
              <input v-else :type="field.type === 'date' ? 'date' : (field.type === 'time' ? 'time' : 'text')" v-model="peserta.jawaban[field.field_key]" style="width: 100%; padding: 10px 12px; box-sizing: border-box; background: var(--bg-light); border: 1px solid var(--border-soft); border-radius: 8px; font-family: inherit; font-size: 0.85rem; outline: none; color: var(--text-main);" :placeholder="field.label">
            </div>

          </div>
        </div>
      </div>

      <div style="display: flex; gap: 8px; margin-top: 15px;">
        <button @click="kembaliKeSnkAtauHome" style="flex: 3; padding: 12px; border-radius: 10px; font-weight: 600; background: #e2e8f0; color: #475569; border: none; cursor: pointer;">KEMBALI</button>
        <button @click="lanjutBayar" style="flex: 7; padding: 12px; border-radius: 10px; font-weight: 600; background: var(--primary); color: white; border: none; cursor: pointer;">LANJUT BAYAR ➔</button>
      </div>
    </div>

    <!-- Tampilan Pembayaran (BAYAR) -->
    <div v-else-if="currentStep === 'bayar'" class="step-content active" style="padding: 12px 15px;">
      
      <!-- Total Tagihan -->
      <div style="background: var(--bg-light); padding: 15px; border-radius: 12px; text-align: center; margin-bottom: 20px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        <small style="font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 1px;">Total Tagihan</small>
        <h2 style="color: var(--text-main); margin: 5px 0 0; font-size: 1.8rem; font-weight: 900;">{{ formatPrice(totalPrice) }}</h2>
      </div>

      <!-- Kotak QRIS -->
      <div style="background: var(--card-light); border: 1px solid var(--border-soft); border-radius: 12px; padding: 15px 20px; text-align: center; margin-bottom: 15px; box-shadow: var(--shadow-md);">
        <p style="font-size: 0.8rem; font-weight: 700; color: var(--text-main); margin: 0 0 10px; letter-spacing: 0.5px;">SCAN QRIS UNTUK MEMBAYAR</p>
        
        <!-- Gambar QRIS sementara pakai placeholder internet -->
        <NuxtImg src="https://placehold.co/180x180/F8FAFC/1E293B?text=QRIS+BELUM+ADA" alt="QRIS Pembayaran" style="width: 100%; max-width: 180px; border-radius: 12px; border: 1px solid var(--border-soft); margin-bottom: 10px; box-shadow: var(--shadow-sm);" />
        
        <div style="background: #FFFBEB; border: 1px dashed #FCD34D; padding: 12px; border-radius: 8px; display: inline-block;">
          <p style="font-size: 0.75rem; color: #D97706; margin: 0; font-weight: 800;">⚠️ PENTING!</p>
          <p style="font-size: 0.7rem; color: var(--text-main); margin: 4px 0 0; font-weight: 600;">Pastikan nominal transfer Anda sesuai hingga digit terakhir</p>
        </div>
      </div>

      <!-- Upload Bukti -->
      <div style="margin-bottom: 12px;">
        <label style="display: block; margin-bottom: 4px; font-size: 0.75rem; font-weight: 600; color: var(--text-muted);">Upload Bukti Pembayaran <span style="color: #ef4444;">*</span></label>
        
        <div style="border: 2px dashed var(--border-soft); border-radius: 12px; padding: 40px 20px; text-align: center; background: var(--bg-light); cursor: pointer; position: relative; overflow: hidden;" :class="{ 'error-shake': uploadError }">
          
          <div v-if="!buktiBayarBase64" style="pointer-events: none;">
            <p style="margin:0 0 6px 0; font-size:0.9rem; font-weight:700; color:var(--text-main);">Klik untuk pilih foto struk</p>
            <p style="margin:0; font-size:0.75rem; font-weight:500; color:var(--text-muted);">Format JPG/PNG • Maks. 5MB</p>
          </div>
          
          <img v-else :src="buktiBayarBase64" alt="Preview Bukti" style="width: 100%; max-height: 250px; object-fit: contain; border-radius: 8px; border: 1px solid var(--border-soft);">
          
          <input type="file" accept="image/*" @change="handleFileUpload" style="position: absolute; inset: 0; opacity: 0; cursor: pointer; z-index: 10;">
        </div>
      </div>

      <div style="display: flex; gap: 8px; margin-top: 15px;">
        <button @click="currentStep = 'form'" style="flex: 3; padding: 12px; border-radius: 10px; font-weight: 600; background: #e2e8f0; color: #475569; border: none; cursor: pointer;">KEMBALI</button>
        <button @click="submitData" :disabled="isSubmitting" style="flex: 7; padding: 12px; border-radius: 10px; font-weight: 600; background: #10b981; color: white; border: none; cursor: pointer;">
          {{ isSubmitting ? 'MEMPROSES...' : 'DAFTAR SEKARANG ✔️' }}
        </button>
      </div>

    </div>

    <!-- Tampilan Sukses (SUKSES) -->
    <div v-else-if="currentStep === 'sukses'" class="step-content active" style="text-align: center; padding: 30px 15px;">
      <div style="width: 64px; height: 64px; background: #F0FDF4; color: #16A34A; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; box-shadow: 0 0 0 4px #DCFCE7; font-size: 32px;">
        ✓
      </div>
      <h2 style="margin:0; font-weight: 800; color: var(--text-main); letter-spacing: -0.5px;">Pendaftaran Sukses!</h2>
      <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 5px; line-height: 1.5;">Data & pembayaran Anda telah kami terima dan sedang diproses.</p>
      
      <div style="background: #fff0f2; padding: 15px; border-radius: 16px; margin: 20px 0; border: 1px solid #ffe4e6;">
        <p style="font-size: 0.85rem; font-weight: 800; margin:0 0 5px; color:#e11d48;">LANGKAH TERAKHIR (WAJIB)</p>
        <p style="font-size: 0.75rem; color: #4c0519; margin:0;">Kirim konfirmasi & screenshot bukti ke WA Admin.</p>
      </div>

      <button @click="kirimWA" style="width: 100%; padding: 12px; border-radius: 12px; font-weight: 600; background: #16A34A; color: white; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(22, 163, 74, 0.25);">
        KIRIM KONFIRMASI WA
      </button>
      
      <button v-if="eventData?.settings?.link_grup_wa" @click="bukaGrupWa" style="width: 100%; padding: 12px; border-radius: 12px; font-weight: 600; background: var(--card-light); color: var(--text-main); border: 1px solid var(--border-soft); cursor: pointer; margin-top: 10px;">
        MASUK GRUP INFO PESERTA
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const toastMessage = ref('')
const toastType = ref('')
const showToastMsg = (msg, type = 'error') => {
  toastMessage.value = msg
  toastType.value = type
  setTimeout(() => { toastMessage.value = '' }, 3000)
}

const route = useRoute()
const slug = route.params.slug

const supabase = useSupabaseClient()

const loading = ref(true)
const error = ref(null)
const eventData = ref(null)
const organizerProfile = ref({})
const tickets = ref([])

const handlePhoneInput = (peserta, fieldKey) => {
  let val = peserta.jawaban[fieldKey] || ''
  // Hapus semua selain angka
  val = val.replace(/\D/g, '')
  // Hapus 0 atau 62 di depan karena sudah ada di kotak country code
  if (val.startsWith('0')) {
    val = val.substring(1)
  } else if (val.startsWith('62')) {
    val = val.substring(2)
  }
  peserta.jawaban[fieldKey] = val
}

const handleCustomUpload = (event, peserta, fieldKey) => {
  const file = event.target.files[0]
  if (file) {
    peserta.jawaban[fieldKey] = file.name // Simpan nama file sebagai penanda sudah diisi
    // Idealnya file di-upload ke Supabase Storage dan URL-nya yang disimpan.
  } else {
    peserta.jawaban[fieldKey] = ''
  }
}

// Fungsi untuk me-replace IP lokal ke URL https baru
const fixPosterUrl = (url) => {
  if (!url) return ''
  return url.replace('http://192.168.1.7:8000', 'https://supabase.e-tiket.web.id')
}

// --- STATE KERANJANG TIKET & UI ---
const keranjang = ref({})
const currentStep = ref('home')
const isSetujuSnk = ref(false)
const daftarPeserta = ref([])

const customFields = computed(() => {
  const fields = eventData.value?.settings?.pertanyaan_kustom
  if (!fields || fields.length === 0) {
    return [
      { field_key: 'nama_lengkap', label: 'Nama Lengkap', required: true, width: 12 },
      { field_key: 'email', label: 'Email', required: true, width: 6 },
      { field_key: 'no_wa', label: 'No. WhatsApp', required: true, width: 6 }
    ]
  }
  return fields
})

const totalQty = computed(() => {
  return Object.values(keranjang.value).reduce((sum, qty) => sum + qty, 0)
})

const totalPrice = computed(() => {
  let total = 0
  for (const id in keranjang.value) {
    const qty = keranjang.value[id]
    const tiket = tickets.value.find(t => t.id === id)
    if (tiket && qty > 0) {
      total += (qty * tiket.harga)
    }
  }
  return total
})

// --- KOMPUTASI PROGRESS BAR ---
const totalMaksimalKuota = computed(() => {
  return tickets.value.reduce((sum, t) => sum + (t.kuota_maksimal || 0), 0)
})

const totalSisaKuota = computed(() => {
  return tickets.value.reduce((sum, t) => sum + (t.sisa_kuota || 0), 0)
})

const persentaseTerisi = computed(() => {
  if (totalMaksimalKuota.value === 0) return 0
  const terjual = totalMaksimalKuota.value - totalSisaKuota.value
  const persen = (terjual / totalMaksimalKuota.value) * 100
  return persen > 100 ? 100 : persen
})

// --- FORMAT LINK WA ---
const formatWaLink = (noWa) => {
  if (!noWa || noWa === '62800000000') return '#'
  let noWaBersih = String(noWa).replace(/\D/g, '')
  if (noWaBersih.startsWith('0')) noWaBersih = '62' + noWaBersih.substring(1)
  return `https://wa.me/${noWaBersih}`
}

const updateKeranjang = (tiketId, change, sisaKuota) => {
  let currentQty = keranjang.value[tiketId] || 0
  let newQty = currentQty + change

  if (newQty < 0) newQty = 0
  if (newQty > sisaKuota) {
    if (window.Swal) {
      window.Swal.fire({ icon: 'warning', title: 'Kuota Terbatas', text: `Sisa tiket hanya ${sisaKuota}.`, confirmButtonColor: '#0C387A' })
    } else {
      showToastMsg(`Sisa tiket hanya ${sisaKuota}.`)
    }
    newQty = sisaKuota
  }

  keranjang.value[tiketId] = newQty
}

const generateFormPeserta = () => {
  daftarPeserta.value = []
  for (const id in keranjang.value) {
    const qty = keranjang.value[id]
    if (qty > 0) {
      const tiket = tickets.value.find(t => String(t.id) === String(id))
      for (let i = 0; i < qty; i++) {
        // Siapkan objek jawaban kosong
        const jawabanKosong = {}
        const extraData = {} // untuk menampung country code dsb
        
        customFields.value.forEach(f => { 
          if (f.type === 'checkboxes') {
            jawabanKosong[f.field_key] = []
          } else {
            jawabanKosong[f.field_key] = '' 
          }
          if (f.type === 'phone_wa') {
            extraData['_cc_' + f.field_key] = '62'
          }
        })
        
        daftarPeserta.value.push({
          ...extraData,
          tiketId: tiket.id,
          namaTiket: tiket.nama_kategori,
          hargaTiket: tiket.harga,
          jawaban: jawabanKosong
        })
      }
    }
  }
  currentStep.value = 'form'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const lanjutDaftar = () => {
  if (totalQty.value === 0) {
    if (window.Swal) {
      window.Swal.fire({ icon: 'warning', title: 'Pilih Tiket', text: 'Silakan tentukan jumlah tiket yang ingin dibeli terlebih dahulu.', confirmButtonColor: '#0C387A' })
    } else {
      showToastMsg('Silakan pilih tiket terlebih dahulu.')
    }
    return
  }
  
  const isSnkActive = eventData.value.settings?.is_snk_active !== false 
  if (isSnkActive) {
    currentStep.value = 'snk'
  } else {
    generateFormPeserta()
  }
}

const setujuDanLanjut = () => {
  if (!isSetujuSnk.value) {
    if (window.Swal) {
      window.Swal.fire({ icon: 'warning', title: 'Belum Setuju', text: 'Mohon centang persetujuan terlebih dahulu.', confirmButtonColor: '#E85D5E' })
    } else {
      showToastMsg('Mohon centang persetujuan terlebih dahulu.')
    }
    return
  }
  generateFormPeserta()
}

const kembaliKeSnkAtauHome = () => {
  const isSnkActive = eventData.value?.settings?.is_snk_active !== false
  currentStep.value = isSnkActive ? 'snk' : 'home'
}

const lanjutBayar = () => {
  let isValid = true
  for (const [index, peserta] of daftarPeserta.value.entries()) {
    for (const field of customFields.value) {
      if (field.type === 'header') continue // Header tidak perlu divalidasi
      
      let answer = peserta.jawaban[field.field_key]
      let isEmpty = false
      
      if (field.type === 'checkboxes') {
        isEmpty = !answer || answer.length === 0
      } else if (field.type === 'terms') {
        isEmpty = answer !== true
      } else {
        isEmpty = !answer
      }

      if (field.required && isEmpty) {
        if (window.Swal) {
          window.Swal.fire({ icon: 'warning', title: 'Data Belum Lengkap', text: `Mohon lengkapi "${field.label}" untuk Peserta Ke-${index + 1}`, confirmButtonColor: '#0C387A' })
        } else {
          showToastMsg(`Mohon lengkapi "${field.label}" untuk Peserta Ke-${index + 1}`)
        }
        isValid = false
        return
      }
    }
  }
  
  if (isValid) {
    if (totalPrice.value === 0) {
      // Tiket Gratis! Langsung eksekusi submit tanpa perlu langkah pembayaran
      submitData()
    } else {
      currentStep.value = 'bayar'
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}

// --- LOGIKA UPLOAD & SUBMIT ---
const buktiBayarBase64 = ref(null)
const uploadError = ref(false)
const isSubmitting = ref(false)

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  if (file.size > 5 * 1024 * 1024) {
    if (window.Swal) window.Swal.fire({ icon: 'error', title: 'Ukuran Terlalu Besar', text: 'Maksimal 5 MB. Silakan kompres foto struk Anda.', confirmButtonColor: '#E85D5E' })
    else showToastMsg('Ukuran foto maksimal 5 MB!')
    event.target.value = '' 
    return
  }

  uploadError.value = false
  const reader = new FileReader()
  reader.onload = (e) => {
    // Untuk versi simple, kita langsung pakai base64 murni dari reader.
    // (Bisa ditambah kompresi canvas nanti jika butuh)
    buktiBayarBase64.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwhBYoY2kP7vAmtDwJHTboHmdsWoGsBnI4pOaaF17Px4HmIjvtKwpD1V7VGOn5U-ttD/exec"
const orderIdsGlobal = ref([])
const linkBuktiGlobal = ref('')

const submitData = async () => {
  if (totalPrice.value > 0 && !buktiBayarBase64.value) {
    uploadError.value = true
    if (window.Swal) window.Swal.fire({ icon: 'warning', title: 'Struk Belum Ada', text: 'Harap upload foto struk transfer terlebih dahulu.', confirmButtonColor: '#E85D5E' })
    else showToastMsg('Harap upload foto struk transfer!')
    return
  }

  isSubmitting.value = true
  
  try {
    // 0. Gabungkan kode negara (CC) dan nomor HP sebelum dikirim
    const processedPeserta = daftarPeserta.value.map(p => {
      let finalJawaban = { ...p.jawaban }
      for (const field of customFields.value) {
        if (field.type === 'phone_wa' && p['_cc_' + field.field_key]) {
          // Gabungkan +62 dan 812...
          finalJawaban[field.field_key] = p['_cc_' + field.field_key] + (finalJawaban[field.field_key] || '')
        }
      }
      return { ...p, jawaban: finalJawaban }
    })

    // 1. Siapkan payload untuk Google Script
    const arrPeserta = processedPeserta.map(p => {
      const { nama_lengkap, email, no_wa, domisili, ...dataTambahanJSON } = p.jawaban
      
      let emailVal = email
      let noWaVal = no_wa
      let namaLengkapVal = nama_lengkap
      
      for (const field of customFields.value) {
        if (field.type === 'email' && p.jawaban[field.field_key]) emailVal = p.jawaban[field.field_key]
        if (field.type === 'phone_wa' && p.jawaban[field.field_key]) noWaVal = p.jawaban[field.field_key]
        if (field.field_key === 'nama_lengkap' && p.jawaban[field.field_key]) namaLengkapVal = p.jawaban[field.field_key]
      }

      return {
        namaAnak: namaLengkapVal || "-",
        usia: "-",
        domisili: domisili || "-",
        followMunira: "Tidak",
        hp: noWaVal ? noWaVal.replace(/\D/g, '') : (no_wa ? no_wa.replace(/\D/g, '') : "-"),
        email: emailVal || "-",
        latitude: "",
        longitude: "",
        dataTambahanJSON: { ...dataTambahanJSON },
        kategori_id: p.tiketId,
        namaTiket: p.namaTiket
      }
    })

    const kodeUnik = Math.floor(Math.random() * 399) + 101 // Dummy kode unik
    const emailVal = arrPeserta[0]?.email || "-"
    
    const dataPayload = {
      peserta: arrPeserta,
      email: emailVal,
      infoDari: "-",
      buktiBayarBase64: buktiBayarBase64.value,
      kodeUnik: kodeUnik,
      infaqNominal: totalPrice.value, 
      kodePrefix: eventData.value?.settings?.Kode_Prefix || "EVT"
    }

    // 2. Tembak Upload Gambar ke Google Script
    const res = await fetch(SCRIPT_URL, { 
      method: 'POST', 
      body: JSON.stringify(dataPayload) 
    })
    const response = await res.json()

    if (response.status === 'success') {
      linkBuktiGlobal.value = response.linkBukti
      let finalOrderIds = response.orderIds

      // 3. Insert ke Supabase
      const prefixDynamic = eventData.value?.nama_event ? eventData.value.nama_event.replace(/[^A-Za-z]/g, '').substring(0, 3).toUpperCase() : 'EVT'
      const dNow = new Date()
      const dateStr = dNow.getFullYear().toString().slice(-2) + ("0" + (dNow.getMonth() + 1)).slice(-2) + ("0" + dNow.getDate()).slice(-2)
      const timeStr = ("0" + dNow.getHours()).slice(-2) + ("0" + dNow.getMinutes()).slice(-2)

      const payloadSupabase = arrPeserta.map(p => {
        let randomStr = Math.random().toString(36).substring(2, 5).toUpperCase()
        let ticketIdDynamic = `${prefixDynamic}-${dateStr}-${timeStr}-${randomStr}`
        
        p.dataTambahanJSON.ticket_id = ticketIdDynamic

        return {
          event_id: eventData.value.id,
          kategori_id: p.kategori_id,
          nama_lengkap: p.namaAnak,
          email: p.email,
          no_wa: p.hp,
          nama_tiket: p.namaTiket,
          bukti_bayar_url: linkBuktiGlobal.value,
          data_tambahan: p.dataTambahanJSON,
          status_bayar: 'pending',
          status_hadir: false
        }
      })

      const { data: sbData, error: sbError } = await supabase
        .from('peserta')
        .insert(payloadSupabase)
        .select()

      if (sbError) throw sbError

      if (sbData && sbData.length > 0) {
        orderIdsGlobal.value = sbData.map(row => `${row.data_tambahan.ticket_id}-${row.id}`)
      } else {
        orderIdsGlobal.value = finalOrderIds
      }

      // 4. Pindah ke halaman sukses
      currentStep.value = 'sukses'
      window.scrollTo({ top: 0, behavior: 'smooth' })
      
    } else {
      throw new Error(response.message || 'Gagal memproses pendaftaran')
    }
  } catch (err) {
    console.error(err)
    if (window.Swal) window.Swal.fire({ icon: 'error', title: 'Pendaftaran Gagal', text: err.message, confirmButtonColor: '#E85D5E' })
    else showToastMsg('Gagal: ' + err.message)
  } finally {
    isSubmitting.value = false
  }
}

const kirimWA = () => {
  const noAdmin = organizerProfile.value?.no_wa || "62800000000"
  let detailPesertaWA = ""
  
  daftarPeserta.value.forEach((p, idx) => {
    detailPesertaWA += `PESERTA (${idx + 1})\n▪️ Nama: ${p.jawaban.nama_lengkap || '-'}\n▪️ No. WA: ${p.jawaban.no_wa || '-'}\n▪️ Email: ${p.jawaban.email || '-'}\n\n`
  })

  const rawText = `✨ REGISTRASI KAJIAN\n━━━━━━━━━━━━━━\n${detailPesertaWA}━━━━━━━━━━━━━━\n🧾 Bukti Transfer: ${linkBuktiGlobal.value}\n\nMohon validasi pendaftaran saya. Terima kasih.`
  window.open(`https://api.whatsapp.com/send?phone=${noAdmin}&text=${encodeURIComponent(rawText)}`, "_blank")
}

const bukaGrupWa = () => {
  const link = eventData.value?.settings?.link_grup_wa
  if (link) window.open(link, "_blank")
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'Segera Hadir'
  return new Date(dateStr).toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'})
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
}

onMounted(async () => {
  try {
    const { data: evData, error: evErr } = await supabase.from('event').select('id, nama_event, poster_url, tanggal_mulai, lokasi, deskripsi, organizer_id, settings').eq('slug', slug).single()
    if (evErr) throw evErr
    eventData.value = evData

    if (evData.organizer_id) {
      const { data: orgData } = await supabase.from('organizer_profile').select('nama_organizer, no_wa, link_ig, link_web').eq('id', evData.organizer_id).single()
      if (orgData) organizerProfile.value = orgData
    }

    const { data: tktData, error: tktErr } = await supabase.from('kategori_tiket').select('id, nama_kategori, harga, kuota_maksimal').eq('event_id', evData.id)
    if (tktErr) throw tktErr

    const { data: pesertaData } = await supabase.from('peserta').select('kategori_id').eq('event_id', evData.id)

    if (tktData && pesertaData) {
      tickets.value = tktData.map(t => {
        const terjual = pesertaData.filter(p => p.kategori_id === t.id).length
        const sisa = t.kuota_maksimal - terjual
        return { ...t, sisa_kuota: sisa < 0 ? 0 : sisa }
      })
    } else {
      tickets.value = tktData
    }
  } catch (err) {
    error.value = "Gagal memuat event dari sistem. Silakan periksa URL Anda."
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.container { width: 100%; max-width: 480px; background: var(--card-light); box-shadow: var(--shadow-lg); border: 1px solid var(--border-soft); border-radius: 20px; overflow: hidden; position: relative; }
.step-content { opacity: 1; padding: 12px 15px; }
.glass { background: white; border-radius: 16px; padding: 2rem 1.5rem; text-align: center; position: relative; overflow: hidden; border: none; }
</style>