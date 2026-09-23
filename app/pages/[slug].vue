<template>
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
        
        <!-- Poster & Judul -->
        <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 0.75rem;">
          <img loading="lazy" :src="fixPosterUrl(eventData.poster_url) || 'https://placehold.co/900x300/F8FAFC/64748B?text=POSTER+EVENT'" alt="Poster Event" style="width: 100%; aspect-ratio: 3 / 1; object-fit: cover; border-radius: 10px; margin-bottom: 0.5rem; border: 1px solid var(--border-soft); box-shadow: var(--shadow-sm);" />
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
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--border-soft); padding-bottom: 10px; margin-bottom: 15px;">
          <h4 style="margin: 0; color: var(--primary); font-size: 0.95rem;">Data Peserta Ke-{{ index + 1 }}</h4>
          <span style="font-size: 0.65rem; font-weight: 800; color: var(--accent-main); background: #eff6ff; border: 1px solid #bfdbfe; padding: 4px 8px; border-radius: 4px; text-transform: uppercase;">{{ peserta.namaTiket }}</span>
        </div>
        
        <!-- Render Custom Fields (Termasuk Nama, Email, WA) -->
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
              <div v-else-if="field.type === 'file_upload'" style="margin-top: 4px;">
                <input type="file" @change="(e) => handleCustomUpload(e, peserta, field.field_key)" accept="image/*,.pdf" style="display: none;" :id="'file_' + index + '_' + field.field_key" />
                
                <label :for="'file_' + index + '_' + field.field_key" style="display: flex; align-items: center; gap: 10px; padding: 10px; background: var(--bg-light); border: 1px dashed var(--border-soft); border-radius: 8px; cursor: pointer; transition: 0.2s;">
                  
                  <!-- Icon File Terpilih -->
                  <div v-if="peserta.jawaban[field.field_key]" style="width: 36px; height: 36px; border-radius: 6px; background: #dcfce7; color: #16a34a; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <svg style="width: 18px; height: 18px;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </div>
                  <!-- Icon Belum Terpilih -->
                  <div v-else style="width: 36px; height: 36px; border-radius: 6px; background: #f1f5f9; color: var(--text-muted); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                    <svg style="width: 18px; height: 18px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  </div>
                  
                  <div style="flex: 1; min-width: 0;">
                    <div v-if="peserta.jawaban[field.field_key]" style="font-size: 0.75rem; font-weight: 700; color: #16a34a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ peserta.jawaban[field.field_key].name || 'File terpilih' }}</div>
                    <div v-else style="font-size: 0.75rem; font-weight: 600; color: var(--text-main);">Pilih File</div>
                    <div style="font-size: 0.65rem; color: var(--text-muted); margin-top: 2px;">Format JPG/PNG/PDF</div>
                  </div>
                </label>
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
      
      <!-- Total Tagihan dengan Rincian -->
      <div style="background: var(--bg-light); padding: 15px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        <small style="font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 1px; text-align: center; display: block;">Total Tagihan</small>
        
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin: 8px 0 15px;">
          <h2 style="color: var(--text-main); margin: 0; font-size: 1.8rem; font-weight: 900;">{{ formatPrice(grandTotal) }}</h2>
          <button @click="copyNominal" style="background: white; border: 1px solid var(--border-soft); border-radius: 6px; padding: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-muted); box-shadow: 0 1px 2px rgba(0,0,0,0.05);" title="Salin Nominal">
             <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          </button>
        </div>

        <div style="border-top: 1px dashed var(--border-soft); padding-top: 12px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.65rem; color: var(--text-muted); margin-bottom: 4px;">
            <span>Tiket ({{ totalQty }}x)</span>
            <span>{{ formatPrice(totalPrice) }}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.55rem; color: var(--text-muted); opacity: 0.8; margin-bottom: 3px;">
            <span>Biaya Layanan</span>
            <span>{{ formatPrice(adminFee) }}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.55rem; color: var(--text-muted); opacity: 0.8;">
            <span>Kode Unik</span>
            <span>+{{ kodeUnik }}</span>
          </div>
        </div>
      </div>

      <!-- Kotak QRIS -->
      <div style="background: var(--card-light); border: 1px solid var(--border-soft); border-radius: 12px; padding: 15px 20px; text-align: center; margin-bottom: 15px; box-shadow: var(--shadow-sm);">
        <p style="font-size: 0.75rem; font-weight: 700; color: var(--text-main); margin: 0 0 10px; letter-spacing: 0.5px;">SCAN QRIS UNTUK MEMBAYAR</p>
        
        <!-- Gambar QRIS Diperkecil -->
        <img loading="lazy" src="/qris.webp" alt="QRIS Pembayaran" style="width: 100%; max-width: 150px; border-radius: 12px; border: 1px solid var(--border-soft); margin-bottom: 10px; box-shadow: var(--shadow-sm);" />
        
        <div style="background: #FFFBEB; border: 1px dashed #FCD34D; padding: 10px; border-radius: 8px; display: inline-block;">
          <p style="font-size: 0.7rem; color: #D97706; margin: 0; font-weight: 800;">⚠️ PASTIKAN NOMINAL SESUAI</p>
          <p style="font-size: 0.65rem; color: var(--text-main); margin: 4px 0 0; font-weight: 600;">Termasuk 3 digit kode unik di belakang</p>
        </div>
      </div>

      <!-- Upload Bukti -->
      <div style="margin-bottom: 12px;">
        <label style="display: block; margin-bottom: 4px; font-size: 0.75rem; font-weight: 600; color: var(--text-muted);">Upload Bukti Pembayaran <span style="color: #ef4444;">*</span></label>
        
        <div style="border: 2px dashed var(--border-soft); border-radius: 12px; padding: 40px 20px; text-align: center; background: var(--bg-light); cursor: pointer; position: relative; overflow: hidden;" :class="{ 'error-shake': uploadError }">
          
          <div v-if="!buktiBayarPreview" style="pointer-events: none;">
            <p style="margin:0 0 6px 0; font-size:0.9rem; font-weight:700; color:var(--text-main);">Klik untuk pilih foto struk</p>
            <p style="margin:0; font-size:0.75rem; font-weight:500; color:var(--text-muted);">Format JPG/PNG • Maks. 5MB</p>
          </div>
          
          <img v-else :src="buktiBayarPreview" alt="Preview Bukti" style="width: 100%; max-height: 250px; object-fit: contain; border-radius: 8px; border: 1px solid var(--border-soft);">
          
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
    <div v-else-if="currentStep === 'sukses'" class="step-content active" style="text-align: center; padding: 40px 15px 20px;">
      
      <!-- Icon Sukses Animasi Sederhana -->
      <div style="width: 80px; height: 80px; background: #10B981; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; box-shadow: 0 0 0 8px #D1FAE5; animation: scaleIn 0.5s ease-out;">
        <svg style="width: 40px; height: 40px;" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
      
      <h2 style="margin:0 0 8px; font-weight: 900; font-size: 1.5rem; color: var(--text-main); letter-spacing: -0.5px;">Pendaftaran Berhasil!</h2>
      <p style="color: var(--text-muted); font-size: 0.85rem; margin: 0 auto 25px; line-height: 1.6; max-width: 280px;">
        Terima kasih, data dan bukti pembayaran Anda telah kami terima.
      </p>
      
      <!-- Kotak Langkah Wajib -->
      <div style="background: var(--bg-light); border: 1px dashed var(--border-soft); padding: 18px; border-radius: 16px; margin-bottom: 25px; position: relative;">
        <div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #F59E0B; color: white; font-size: 0.65rem; font-weight: 800; padding: 4px 12px; border-radius: 20px; letter-spacing: 0.5px;">LANGKAH TERAKHIR</div>
        
        <p style="font-size: 0.8rem; font-weight: 700; color: var(--text-main); margin: 10px 0 6px;">Kirim Pesan Konfirmasi</p>
        <p style="font-size: 0.75rem; color: var(--text-muted); margin: 0 0 15px; line-height: 1.5;">Ketuk tombol di bawah ini untuk mengirimkan tiket ke WhatsApp Admin agar segera diaktifkan.</p>
        
        <button @click="kirimWA" style="width: 100%; padding: 14px; border-radius: 12px; font-weight: 700; font-size: 0.85rem; background: #25D366; color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.25); transition: 0.2s;">
          <svg style="width: 18px; height: 18px;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          KONFIRMASI VIA WHATSAPP
        </button>
      </div>
      
      <button v-if="eventData?.settings?.link_grup_wa" @click="bukaGrupWa" style="width: 100%; padding: 14px; border-radius: 12px; font-weight: 700; font-size: 0.8rem; background: var(--card-light); color: var(--text-main); border: 1px solid var(--border-soft); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px;">
        MASUK GRUP INFO PESERTA
      </button>
    </div>

  </div>

  <!-- PRINTER ANIMATION OVERLAY -->
    <div class="api-loader" :class="{ active: isSubmitting }">
      <div class="printer-wrapper">
        <!-- Mesin Printer -->
        <div class="printer-slot">
          <div class="printer-slot-inner">
            <div class="printer-slot-light"></div>
          </div>
        </div>
        
        <!-- Kertas Keluar -->
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

const handleCustomUpload = async (event, peserta, fieldKey) => {
  const file = event.target.files[0]
  if (!file) {
    peserta.jawaban[fieldKey] = null
    return
  }
  
  if (file.type.startsWith('image/')) {
    try {
      const compressedFile = await compressImageFile(file, 800, 0.6) // Maks 800px, kualitas 60% (~50-100KB)
      peserta.jawaban[fieldKey] = compressedFile
    } catch (e) {
      console.error('Compression error', e)
      showToastMsg('Gagal mengompres gambar')
    }
  } else {
    // Jika bukan gambar (misal PDF), batasi maksimal 3MB
    if (file.size > 3 * 1024 * 1024) {
      if (window.Swal) window.Swal.fire({ icon: 'error', title: 'Terlalu Besar', text: 'Ukuran PDF maksimal 3MB', confirmButtonColor: '#E85D5E' })
      else showToastMsg('Ukuran PDF maksimal 3MB')
      event.target.value = ''
      return
    }
    peserta.jawaban[fieldKey] = file
  }
}

// Fungsi kompresi gambar mengembalikan objek File
const compressImageFile = (file, maxWidth = 800, quality = 0.6) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = event => {
      const img = new Image()
      img.src = event.target.result
      img.onload = () => {
        let width = img.width
        let height = img.height
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error('Canvas to Blob failed'))
          const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", { type: 'image/jpeg' })
          resolve(newFile)
        }, 'image/jpeg', quality)
      }
      img.onerror = error => reject(error)
    }
    reader.onerror = error => reject(error)
  })
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
      { field_key: 'nama_lengkap', label: 'Nama Lengkap', required: true, width: 12, type: 'short_text' },
      { field_key: 'email', label: 'Email', required: true, width: 6, type: 'email' },
      { field_key: 'no_wa', label: 'No. WhatsApp', required: true, width: 6, type: 'phone_wa' }
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
    const tiket = tickets.value.find(t => String(t.id) === String(id))
    if (tiket && qty > 0) {
      total += (qty * tiket.harga)
    }
  }
  return total
})

const kodeUnik = ref(0)
onMounted(() => {
  kodeUnik.value = Math.floor(Math.random() * 399) + 101
})

const adminFee = 2000

const grandTotal = computed(() => {
  if (totalPrice.value === 0) return 0
  return totalPrice.value + adminFee + kodeUnik.value
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

const copyNominal = async () => {
  try {
    await navigator.clipboard.writeText(grandTotal.value.toString())
    if (window.Swal) {
      window.Swal.fire({
        icon: 'success',
        title: 'Berhasil Disalin!',
        text: `Nominal Rp ${grandTotal.value.toLocaleString('id-ID')} telah disalin.`,
        timer: 1500,
        showConfirmButton: false
      })
    } else {
      showToastMsg('Nominal berhasil disalin!')
    }
  } catch (err) {
    showToastMsg('Gagal menyalin nominal')
  }
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
const buktiBayarFile = ref(null)
const buktiBayarPreview = ref('')
const uploadError = ref(false)
const isSubmitting = ref(false)

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  if (file.size > 5 * 1024 * 1024) {
    if (window.Swal) window.Swal.fire({ icon: 'error', title: 'Ukuran Terlalu Besar', text: 'Maksimal 5 MB. Silakan kompres foto struk Anda.', confirmButtonColor: '#E85D5E' })
    else showToastMsg('Ukuran foto maksimal 5 MB!')
    event.target.value = '' 
    return
  }

  uploadError.value = false
  
  if (file.type.startsWith('image/')) {
    try {
      buktiBayarFile.value = await compressImageFile(file, 800, 0.6)
      buktiBayarPreview.value = URL.createObjectURL(buktiBayarFile.value)
    } catch (e) {
      console.error(e)
      showToastMsg('Gagal memproses gambar struk')
    }
  } else {
    buktiBayarFile.value = file
    buktiBayarPreview.value = URL.createObjectURL(file)
  }
}

const orderIdsGlobal = ref([])
const linkBuktiGlobal = ref('')
const transactionIdGlobal = ref('')

const submitData = async () => {
  const startTime = Date.now()
  if (totalPrice.value > 0 && !buktiBayarFile.value) {
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
        dataTambahanJSON: { ...dataTambahanJSON, infaqNominal: grandTotal.value },
        kategori_id: p.tiketId,
        namaTiket: p.namaTiket
      }
    })

    const prefixDynamic = eventData.value?.nama_event ? eventData.value.nama_event.replace(/[^A-Za-z]/g, '').substring(0, 3).toUpperCase() : 'EVT'
    const transactionId = `TRX-${prefixDynamic}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
    transactionIdGlobal.value = transactionId
    
    const emailVal = arrPeserta[0]?.email || "-"
    
    // --- UPLOAD KE SUPABASE STORAGE ---
    let urlBukti = ""
    if (buktiBayarFile.value) {
      const ext = buktiBayarFile.value.name.split('.').pop()
      const pathBukti = `${eventData.value?.nama_event || 'Event'}/Bukti Transfer/${transactionId}.${ext}`
      const { error: err1 } = await supabase.storage.from('berkas').upload(pathBukti, buktiBayarFile.value)
      if (err1) throw new Error("Gagal mengupload Bukti Transfer: " + err1.message)
      urlBukti = supabase.storage.from('berkas').getPublicUrl(pathBukti).data.publicUrl
    }
    
    // Upload file custom dari form builder
    for (let p of arrPeserta) {
      for (let key in p.dataTambahanJSON) {
        if (p.dataTambahanJSON[key] instanceof File) {
          let file = p.dataTambahanJSON[key]
          let ext = file.name.split('.').pop()
          // Menggunakan 'key' (nama form) sebagai nama sub-folder
          let pathCustom = `${eventData.value?.nama_event || 'Event'}/${key}/${transactionId}_${p.namaAnak || 'Peserta'}.${ext}`
          const { error: err2 } = await supabase.storage.from('berkas').upload(pathCustom, file)
          if (err2) throw new Error("Gagal mengupload file: " + err2.message)
          // Timpa object File dengan URL public
          p.dataTambahanJSON[key] = supabase.storage.from('berkas').getPublicUrl(pathCustom).data.publicUrl
        }
      }
    }

    const dataPayload = {
      action: 'create_order',
      transactionId: transactionId,
      namaEvent: eventData.value?.nama_event || "Event Umum",
      peserta: arrPeserta,
      email: emailVal,
      infoDari: "-",
      kodeUnik: kodeUnik.value,
      infaqNominal: grandTotal.value, 
      kodePrefix: eventData.value?.settings?.Kode_Prefix || "EVT"
    }

    // 2. Tembak API Nuxt Backend (Kirim Notif WA Fonnte)
    const res = await fetch('/api/create-order', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataPayload) 
    })
    
    if (!res.ok) {
      throw new Error(`Pendaftaran tertunda (Error ${res.status}). Pastikan API tersedia.`)
    }
    
    const response = await res.json()

    // Lanjutkan walau notif WA gagal (atau bisa di-throw error jika wajib)
    if (response.status === 'success' || response.status === 'error') {
      linkBuktiGlobal.value = urlBukti // Gunakan URL dari Supabase
      
      // 3. Insert ke Supabase
      const prefixDynamic = eventData.value?.nama_event ? eventData.value.nama_event.replace(/[^A-Za-z]/g, '').substring(0, 3).toUpperCase() : 'EVT'
      const dNow = new Date()
      const dateStr = dNow.getFullYear().toString().slice(-2) + ("0" + (dNow.getMonth() + 1)).slice(-2) + ("0" + dNow.getDate()).slice(-2)
      const timeStr = ("0" + dNow.getHours()).slice(-2) + ("0" + dNow.getMinutes()).slice(-2)

      const payloadSupabase = arrPeserta.map((p, index) => {
        let randomStr = Math.random().toString(36).substring(2, 5).toUpperCase()
        let ticketIdDynamic = `${prefixDynamic}-${dateStr}-${timeStr}-${randomStr}`
        
        let finalDataTambahan = p.dataTambahanJSON
        
        finalDataTambahan.ticket_id = ticketIdDynamic
        finalDataTambahan.order_id = transactionId

        return {
          event_id: eventData.value.id,
          kategori_id: p.kategori_id,
          nama_lengkap: p.namaAnak,
          email: p.email,
          no_wa: p.hp,
          nama_tiket: p.namaTiket,
          bukti_bayar_url: linkBuktiGlobal.value,
          data_tambahan: finalDataTambahan,
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
      }

      // Pastikan animasi printer selesai (animasi butuh 3.5 detik)
      const elapsed = Date.now() - startTime
      if (elapsed < 3500) {
        await new Promise(r => setTimeout(r, 3500 - elapsed))
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
  const domain = window.location.origin
  
  const rawText = `Hai Admin,\nSaya sudah mendaftar dan mentransfer pembayaran untuk acara *${eventData.value?.nama_event || 'Event'}*.\n\nIni adalah link tiket saya:\n${domain}/tiket/${transactionIdGlobal.value}\n\nSaya akan cek link tersebut secara berkala sampai dikonfirmasi. Terima kasih! 🙏`
  
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
.container { 
  width: 100%; 
  max-width: 480px; 
  background: var(--card-light); 
  box-shadow: 0 20px 40px rgba(0,0,0,0.08); 
  border: 1px solid var(--border-soft); 
  border-radius: 24px; 
  overflow: hidden; 
  position: relative; 
  margin: 40px auto;
  min-height: 100vh;
}
.step-content { opacity: 1; padding: 24px 20px; }
.glass { background: white; border-radius: 16px; padding: 2rem 1.5rem; text-align: center; position: relative; overflow: hidden; border: none; }

@media (max-width: 480px) {
  .container {
    margin: 0 auto;
    border-radius: 0;
    border: none;
    box-shadow: none;
    min-height: 100vh;
  }
  .step-content { padding: 20px 16px; }
}

input:focus, select:focus, textarea:focus {
  border-color: var(--accent-main) !important;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1) !important;
  outline: none;
}


/* =========================================
   CSS ANIMASI PRINTER
   ========================================= */
.api-loader { 
  position: fixed; 
  inset: 0; 
  background: rgba(15, 23, 42, 0.95); 
  backdrop-filter: blur(8px); 
  z-index: 99999; 
  display: none; 
  flex-direction: column; 
  align-items: center; 
  justify-content: center; 
  overflow: hidden; 
}

.api-loader::before { 
  content: ''; 
  position: absolute; 
  inset: 0; 
  opacity: 0.1; 
  pointer-events: none; 
  background-image: radial-gradient(circle, #fff 1px, transparent 1px); 
  background-size: 40px 40px; 
}

.api-loader.active { display: flex; }

.printer-wrapper { 
  position: relative; 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  height: 330px; 
}

.printer-slot { width: 320px; height: 32px; background: #1E293B; border: 4px solid #0F172A; border-radius: 12px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); position: relative; z-index: 30; display: flex; justify-content: center; align-items: center; }
.printer-slot-inner { width: 85%; height: 100%; background: #020617; box-shadow: inset 0 2px 4px rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; border-radius: 4px; }
.printer-slot-light { width: 90%; height: 4px; background: var(--accent-main); box-shadow: 0 0 10px var(--accent-main); opacity: 0.8; border-radius: 2px; }

@keyframes viberateMotor { 0% { transform: translate(1px, 0); } 100% { transform: translate(-1px, 0.5px); } }
.api-loader.active .printer-slot { animation: viberateMotor 0.1s infinite alternate; }

@keyframes cetakKertas { 0% { height: 0px; } 100% { height: 280px; } }
.printer-mask { width: 250px; height: 0px; overflow: hidden; position: relative; top: -6px; z-index: 5; display: flex; justify-content: center; }
.api-loader.active .printer-mask { animation: cetakKertas 3.5s linear forwards; }

.ticket-paper-output { width: 100%; height: 280px; background: white; border-left: 4px solid var(--primary); border-right: 4px solid var(--primary); border-bottom: 4px solid var(--primary); padding: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); display: flex; flex-direction: column; align-items: center; position: relative; padding-bottom: 40px; }
.ticket-paper-output::after { content: ''; position: absolute; bottom: -12px; left: -4px; width: calc(100% + 8px); height: 16px; background-repeat: repeat-x; background-image: linear-gradient(135deg, white 25%, transparent 25%), linear-gradient(225deg, white 25%, transparent 25%); background-size: 16px 16px; z-index: 10; }

.fake-barcode-area { margin-top: 24px; width: 100%; height: 48px; background: white; display: flex; gap: 2px; align-items: flex-end; justify-content: center; }
.fake-barcode-area div { height: 100%; background: var(--primary); }

.loading-badge { position: absolute; bottom: 40px; background: var(--card-light); color: var(--text-main); padding: 12px 32px; border-radius: 9999px; font-weight: 900; display: flex; align-items: center; gap: 12px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3); font-size: 1rem; letter-spacing: 1px; z-index: 40; border: 3px solid var(--border-soft); }
.loading-dot { width: 12px; height: 12px; background: var(--accent-main); border-radius: 50%; animation: pulseIcon 1.5s infinite; }
@keyframes pulseIcon { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
@keyframes scaleIn { 0% { transform: scale(0); } 80% { transform: scale(1.1); } 100% { transform: scale(1); } }
</style>