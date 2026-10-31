<template>
  <div>
    <!-- 1. KONFIRMASI DATA E-TICKET (Hanya tampil saat sebelum kode bayar di-generate) -->
    <div v-if="primaryParticipant && !paymentResult" class="buyer-review-card">
      <div class="buyer-review-header">
        <div class="buyer-header-title">
          <svg class="buyer-header-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span>Konfirmasi Data E-Ticket</span>
        </div>
        <button type="button" @click="$emit('back')" class="btn-review-change" title="Ubah data pemesan">
          Ubah Data
        </button>
      </div>

      <div class="buyer-review-body">
        <div class="buyer-field-row">
          <div class="buyer-field">
            <span class="buyer-field-label">Nama Pemesan</span>
            <span class="buyer-field-val font-semibold">{{ primaryParticipant.nama }}</span>
          </div>
          <div class="buyer-field">
            <span class="buyer-field-label">No. WhatsApp</span>
            <span class="buyer-field-val">{{ primaryParticipant.phone }}</span>
          </div>
        </div>

        <div class="buyer-field-row single">
          <div class="buyer-field">
            <span class="buyer-field-label">Email Pengiriman E-Ticket</span>
            <span class="buyer-field-val email-highlight">{{ primaryParticipant.email }}</span>
          </div>
        </div>

        <!-- Jika beli tiket lebih dari 1 orang -->
        <div v-if="allParticipants.length > 1" class="buyer-participants-section">
          <span class="buyer-field-label">Daftar Peserta Tiket ({{ allParticipants.length }})</span>
          <div class="buyer-chips-wrap">
            <span v-for="p in allParticipants" :key="p.index" class="buyer-chip">
              #{{ p.index }} {{ p.nama }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Total Tagihan dengan Rincian -->
    <div class="billing-card">
      <small class="billing-header">Total Tagihan</small>
      
      <div class="billing-total-row">
        <h2 class="billing-total-amount">{{ formatPrice(displayGrandTotal) }}</h2>
        <button @click="copyNominal(displayGrandTotal)" class="btn-copy" title="Salin Nominal">
          <svg class="icon-copy" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        </button>
      </div>

      <div class="billing-details">
        <div class="billing-detail-item">
          <span>Tiket ({{ displayTotalQty }}x)</span>
          <span>{{ formatPrice(displayTotalPrice) }}</span>
        </div>
        <div v-if="displayDonasiAmount > 0" class="billing-detail-subitem" style="color: var(--text-main); font-weight: 600; opacity: 1;">
          <span>Infaq / Donasi</span>
          <span>+{{ formatPrice(displayDonasiAmount) }}</span>
        </div>
        <div v-if="isEspayActive" class="billing-detail-subitem">
          <span>Biaya Admin Pembayaran (Gateway + PPN)</span>
          <span>+{{ formatPrice(platformFee + currentGatewayFee) }}</span>
        </div>
        <div v-else-if="manualPlatformFee > 0" class="billing-detail-subitem">
          <span>Biaya Layanan</span>
          <span>+{{ formatPrice(manualPlatformFee) }}</span>
        </div>
      </div>
    </div>

    <!-- Master Emergency Failover Notice Banner -->
    <div v-if="isEmergencyBackup" class="emergency-alert-banner">
      <div class="emergency-banner-icon">
        <svg class="icon-emergency-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
      </div>
      <div class="emergency-banner-content">
        <span class="emergency-badge-text">MODE CADANGAN / DARURAT AKTIF</span>
        <p class="emergency-message-text">{{ emergencyMessage || 'Sistem pembayaran otomatis sedang dialihkan ke Transfer Bank Manual.' }}</p>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- MODE 1: ESPAY PAYMENT GATEWAY (DIRECT API)               -->
    <!-- ======================================================== -->
    <div v-if="isEspayActive" class="espay-container">
      <!-- 1. Pilihan Metode Pembayaran (Jika belum generate) -->
      <div v-if="!paymentResult" class="method-selection-card">
        <p class="section-title">Pilih Metode Pembayaran</p>

        <div class="payment-method-groups">
          
          <!-- 1. GROUP / BARIS QRIS -->
          <div 
            v-if="availableMethods.qris" 
            class="method-group-item" 
            :class="{ active: selectedMethod === 'qris' }"
            @click="selectedMethod = 'qris'; isBankExpanded = false"
          >
            <div class="group-header-row">
              <div class="group-header-left">
                <div class="method-icon-box qris-icon-bg">
                  <svg class="method-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                </div>
                <div class="method-info">
                  <div class="method-name-row">
                    <span class="method-name">QRIS</span>
                    <span v-if="isQrisCheaper" class="badge-cheapest">Rekomendasi</span>
                  </div>
                  <span class="method-desc">BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana, ShopeePay</span>
                </div>
              </div>

              <div class="method-radio" :class="{ checked: selectedMethod === 'qris' }">
                <svg v-if="selectedMethod === 'qris'" class="radio-check-svg" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
          </div>

          <!-- 2. GROUP VIRTUAL ACCOUNT (BANK TRANSFER) ACCORDION -->
          <div 
            v-if="availableMethods.va_bca || availableMethods.va_mandiri || availableMethods.va_bri || availableMethods.va_bni" 
            class="method-group-item bank-group-item"
            :class="{ active: selectedMethod.startsWith('va'), expanded: isBankExpanded }"
          >
            <!-- Header Bar Bank -->
            <div 
              class="group-header-row bank-header-clickable"
              @click="toggleBankAccordion"
            >
              <div class="group-header-left">
                <div class="method-icon-box bank-icon-bg">
                  <svg class="method-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 3l9 7H3z"/>
                  </svg>
                </div>
                <div class="method-info">
                  <div class="method-name-row">
                    <span class="method-name">Transfer Bank (Virtual Account)</span>
                    <span v-if="!isQrisCheaper" class="badge-cheapest">Rekomendasi</span>
                  </div>
                </div>
              </div>

              <div class="bank-accordion-indicator">
                <span v-if="selectedMethod.startsWith('va') && !isBankExpanded" class="active-bank-pill">
                  {{ selectedBankShortName }}
                </span>
                <svg 
                  class="chevron-icon-svg" 
                  :class="{ rotate: isBankExpanded }" 
                  fill="none" 
                  stroke="currentColor" 
                  stroke-width="2.5" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>

            <!-- Konten Dropdown Bank (GRID 2 KOLOM RAPI & MODERN) -->
            <div v-show="isBankExpanded" class="bank-grid-dropdown">
              <!-- BCA VA -->
              <button 
                v-if="availableMethods.va_bca" 
                type="button" 
                class="bank-grid-card" 
                :class="{ selected: selectedMethod === 'va_bca' }"
                @click.stop="selectedMethod = 'va_bca'"
              >
                <div class="bank-card-top">
                  <span class="bank-badge bca">BCA</span>
                  <div class="bank-radio" :class="{ checked: selectedMethod === 'va_bca' }">
                    <svg v-if="selectedMethod === 'va_bca'" class="radio-check-svg" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                </div>
                <span class="bank-card-title">Bank BCA</span>
              </button>

              <!-- Mandiri VA -->
              <button 
                v-if="availableMethods.va_mandiri" 
                type="button" 
                class="bank-grid-card" 
                :class="{ selected: selectedMethod === 'va_mandiri' }"
                @click.stop="selectedMethod = 'va_mandiri'"
              >
                <div class="bank-card-top">
                  <span class="bank-badge mandiri">mandiri</span>
                  <div class="bank-radio" :class="{ checked: selectedMethod === 'va_mandiri' }">
                    <svg v-if="selectedMethod === 'va_mandiri'" class="radio-check-svg" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                </div>
                <span class="bank-card-title">Bank Mandiri</span>
              </button>

              <!-- BRI VA -->
              <button 
                v-if="availableMethods.va_bri" 
                type="button" 
                class="bank-grid-card" 
                :class="{ selected: selectedMethod === 'va_bri' }"
                @click.stop="selectedMethod = 'va_bri'"
              >
                <div class="bank-card-top">
                  <span class="bank-badge bri">BRI</span>
                  <div class="bank-radio" :class="{ checked: selectedMethod === 'va_bri' }">
                    <svg v-if="selectedMethod === 'va_bri'" class="radio-check-svg" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                </div>
                <span class="bank-card-title">Bank BRI</span>
              </button>

              <!-- BNI VA -->
              <button 
                v-if="availableMethods.va_bni" 
                type="button" 
                class="bank-grid-card" 
                :class="{ selected: selectedMethod === 'va_bni' }"
                @click.stop="selectedMethod = 'va_bni'"
              >
                <div class="bank-card-top">
                  <span class="bank-badge bni">BNI</span>
                  <div class="bank-radio" :class="{ checked: selectedMethod === 'va_bni' }">
                    <svg v-if="selectedMethod === 'va_bni'" class="radio-check-svg" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                </div>
                <span class="bank-card-title">Bank BNI</span>
              </button>
            </div>
          </div>

        </div>

        <!-- 3. INDIKATOR SINGKAT PENDAFTARAN BELUM SELESAI -->
        <div class="checkout-final-notice">
          <span class="notice-pulse-badge">
            <span class="pulse-dot"></span>
            LANGKAH TERAKHIR
          </span>
          <p class="notice-desc">
            Pendaftaran belum selesai. Klik <strong>BAYAR SEKARANG</strong> di bawah untuk mendapatkan kode pembayaran.
          </p>
        </div>

        <div class="action-buttons mt-3">
          <button type="button" @click="$emit('back')" class="btn btn-secondary">KEMBALI</button>
          <button 
            type="button"
            @click="handleRequestPayment" 
            :disabled="isGenerating || isSubmitting" 
            class="btn btn-primary"
            :class="{ 'btn-loading': isGenerating || isSubmitting }"
          >
            <span v-if="isGenerating || isSubmitting">MEMPROSES KODE BAYAR...</span>
            <span v-else class="btn-text-icon">
              BAYAR SEKARANG
              <svg class="btn-arrow-svg" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </span>
          </button>
        </div>
      </div>

      <!-- 2. Tampilan Hasil Pembayaran (QRIS / VA) -->
      <div v-else class="payment-result-wrapper">

        <!-- JIKA EXPIRED (WAKTU HABIS) -->
        <div v-if="isExpired" class="expired-card">
          <div class="expired-icon">
            <svg class="icon-expired-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <h4 class="expired-title">Batas Waktu Pembayaran Telah Habis</h4>
          <p class="expired-desc">Kode pembayaran ini sudah kedaluwarsa (melewati batas 15 menit). Kuota tiket telah dikembalikan.</p>
          <button @click="handleExpiredReset" class="btn btn-primary mt-3">
            <span class="btn-text-icon">
              Buat Pesanan Baru
              <svg class="btn-arrow-svg" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </span>
          </button>
        </div>

        <template v-else>
          <!-- STAY ON PAGE BANNER -->
          <div class="stay-page-banner">
            <div class="stay-pulse-icon">
              <span class="stay-ring"></span>
              <svg class="stay-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <div class="stay-content">
              <span class="stay-title">MOHON JANGAN TUTUP HALAMAN INI</span>
              <p class="stay-desc">Setelah pembayaran Anda selesai, E-Ticket resmi akan <strong>otomatis terbit di layar ini</strong>.</p>
            </div>
          </div>

          <!-- TIMER HITUNG MUNDUR 15 MENIT -->
          <div class="payment-timer-box" :class="{ 'timer-urgent': expirySeconds <= 180 }">
            <svg class="timer-icon-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span class="timer-label">Selesaikan pembayaran dalam</span>
            <span class="timer-countdown">{{ formatTimeRemaining(expirySeconds) }}</span>
          </div>

          <!-- JIKA TIPE QRIS -->
          <div v-if="paymentResult.payment_type === 'qris'" class="qris-card">
            <div class="qris-header-badge">
              <span class="qris-label">QRIS STANDAR NASIONAL</span>
              <span class="qris-sublabel">Bisa di-scan semua Mobile Banking & E-Wallet</span>
            </div>

            <div class="qris-qr-box">
              <img 
                :src="paymentResult.qr_image" 
                alt="QRIS Pembayaran" 
                class="qris-dynamic-image" 
              />
            </div>

            <button type="button" @click="downloadQrisImage" class="btn-download-qris">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="icon-download"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Unduh Gambar QRIS
            </button>

            <div class="realtime-status-box">
              <div class="pulse-indicator"></div>
              <div>
                <p class="realtime-status-text">Menunggu Pembayaran...</p>
                <small class="realtime-subtext">Halaman otomatis ter-update setelah Anda membayar.</small>
              </div>
            </div>

            <button 
              type="button" 
              @click="manualCheckPayment" 
              :disabled="isCheckingStatus || cooldownSeconds > 0" 
              class="btn-refresh-status"
            >
              <span v-if="isCheckingStatus" class="spinner-small"></span>
              <span v-else-if="cooldownSeconds > 0" class="btn-text-icon">
                <svg class="btn-svg-inline" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                Cek Lagi dalam {{ cooldownSeconds }}s
              </span>
              <span v-else class="btn-text-icon">
                <svg class="btn-svg-inline" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                Cek Status Pembayaran
              </span>
            </button>

          </div>

          <!-- JIKA TIPE VIRTUAL ACCOUNT -->
          <div v-else-if="paymentResult.payment_type === 'va'" class="va-card">
            <div class="va-header">
              <span class="va-bank-badge">{{ paymentResult.bank_name || 'Virtual Account' }}</span>
              <span class="va-instan-badge">Otomatis Terverifikasi</span>
            </div>

            <div class="va-number-box">
              <small class="va-number-label">Nomor Virtual Account</small>
              <div class="va-number-row">
                <span class="va-digits">{{ paymentResult.va_number }}</span>
                <button @click="copyText(paymentResult.va_number, 'Nomor Virtual Account')" class="btn-copy-va" title="Salin Nomor VA">
                  <span>Salin</span>
                  <svg class="icon-copy-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                </button>
              </div>
            </div>

            <div class="va-amount-box">
              <small class="va-amount-label">Total yang Harus Ditransfer</small>
              <div class="va-amount-row">
                <span class="va-amount-digits">{{ formatPrice(paymentResult.total_amount) }}</span>
                <button @click="copyNominal(paymentResult.total_amount)" class="btn-copy-va" title="Salin Nominal">
                  <span>Salin</span>
                  <svg class="icon-copy-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                </button>
              </div>
              <small class="va-exact-warn">
                <svg class="icon-warn-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                Transfer nominal tepat hingga digit terakhir agar otomatis terdeteksi.
              </small>
            </div>

            <!-- Petunjuk Transfer Singkat -->
            <div class="va-guide-card">
              <p class="guide-title">
                <svg class="icon-info-svg-blue" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                Cara Bayar via Mobile Banking / ATM:
              </p>
              <ol class="guide-steps">
                <li>Buka aplikasi Mobile Banking / ATM bank Anda.</li>
                <li>Pilih menu <strong>Transfer / Bayar</strong> &rarr; <strong>Virtual Account</strong>.</li>
                <li>Masukkan nomor VA: <strong>{{ paymentResult.va_number }}</strong>.</li>
                <li>Pastikan nama tagihan sesuai, lalu konfirmasi pembayaran.</li>
              </ol>
            </div>

            <div class="realtime-status-box">
              <div class="pulse-indicator"></div>
              <div>
                <p class="realtime-status-text">Menunggu Transfer...</p>
                <small class="realtime-subtext">Begitu transfer selesai, tiket Anda langsung terbit otomatis!</small>
              </div>
            </div>

            <button 
              type="button" 
              @click="manualCheckPayment" 
              :disabled="isCheckingStatus || cooldownSeconds > 0" 
              class="btn-refresh-status"
            >
              <span v-if="isCheckingStatus" class="spinner-small"></span>
              <span v-else-if="cooldownSeconds > 0" class="btn-text-icon">
                <svg class="btn-svg-inline" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                Cek Lagi dalam {{ cooldownSeconds }}s
              </span>
              <span v-else class="btn-text-icon">
                <svg class="btn-svg-inline" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                Cek Status Pembayaran
              </span>
            </button>

          </div>

          <!-- TOMBOL BATALKAN PESANAN RESMI (ORDER LOCKED) -->
          <div class="action-buttons mt-3">
            <button 
              type="button" 
              @click="handleCancelOrder" 
              :disabled="isCancelling" 
              class="btn-cancel-order"
            >
              <span v-if="isCancelling" class="spinner-small danger-spinner"></span>
              <span v-else class="btn-text-icon">
                <svg class="icon-cancel-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                Batalkan Pesanan Ini
              </span>
            </button>
          </div>
        </template>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- MODE 2: PEMBAYARAN MANUAL (FALLBACK JIKA ESPAY OFF)      -->
    <!-- ======================================================== -->
    <div v-else class="manual-container">
      <!-- Kotak QRIS Manual -->
      <div class="qris-card">
        <div class="qris-header-badge">
          <span class="qris-label">SCAN QRIS UNTUK MEMBAYAR</span>
          <span class="qris-sublabel">Bisa di-scan semua Mobile Banking & E-Wallet</span>
        </div>
        <div class="qris-qr-box">
          <img 
            src="/qris.webp" 
            alt="QRIS Pembayaran" 
            class="qris-static-image" 
            fetchpriority="high" 
            decoding="async"
            width="175"
            height="175"
          />
        </div>
        <a href="/qris.webp" download="QRIS_Pembayaran.webp" class="btn-download-qris">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="icon-download"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Download QRIS
        </a>
        <!-- Kotak Salin Nominal Presisi -->
        <div class="va-amount-box precision-box mt-3">
          <small class="va-amount-label">Total yang Wajib Ditransfer (Termasuk Kode Unik)</small>
          <div class="va-amount-row">
            <span class="va-amount-digits highlight-price">{{ formatPrice(displayGrandTotal) }}</span>
            <button type="button" @click="copyNominal(displayGrandTotal)" class="btn-copy-va" title="Salin Nominal Tepat">
              <span>Salin Nominal</span>
              <svg class="icon-copy-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
          </div>
          <small class="va-exact-warn">
            <svg class="icon-warn-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            Wajib transfer tepat hingga 3 digit terakhir agar pembayaran dapat diverifikasi cepat oleh Admin Tyket.
          </small>
        </div>
      </div>

      <!-- Upload Bukti -->
      <div class="upload-section">
        <label class="upload-label">Upload Bukti Pembayaran <span class="required-mark">*</span></label>
        <div class="upload-box" :class="{ 'error-shake': uploadError }">
          <div v-if="!buktiBayarPreview" class="upload-placeholder">
            <p class="upload-placeholder-title">Klik untuk pilih foto struk</p>
            <p class="upload-placeholder-desc">Format JPG/PNG • Maks. 5MB</p>
          </div>
          <img v-else :src="buktiBayarPreview" alt="Preview Bukti" class="upload-preview-image">
          <input type="file" accept="image/*" @change="$emit('file-upload', $event)" class="upload-input">
        </div>
      </div>

      <div class="action-buttons">
        <button @click="$emit('back')" class="btn btn-secondary">KEMBALI</button>
        <button @click="$emit('submit')" :disabled="isSubmitting" class="btn btn-primary" :class="{ 'btn-loading': isSubmitting }">
          <span v-if="isSubmitting">MEMPROSES...</span>
          <span v-else class="btn-text-icon">
            DAFTAR SEKARANG
            <svg class="icon-check-svg" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  grandTotal: { type: Number, required: true },
  totalQty: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  adminFee: { type: Number, required: true },
  kodeUnik: { type: Number, required: true },
  donasiAmount: { type: Number, default: 0 },
  buktiBayarPreview: { type: String, default: '' },
  uploadError: { type: Boolean, default: false },
  isSubmitting: { type: Boolean, default: false },
  daftarPeserta: { type: Array, default: () => [] },
  // ESPay Specific Props
  isEspayActive: { type: Boolean, default: false },
  espayMethods: { type: Object, default: () => ({ qris: true, va_bca: true, va_mandiri: true, va_bri: true, va_bni: false }) },
  eventData: { type: Object, default: () => ({}) },
  initialPaymentResult: { type: Object, default: null },
  isEmergencyBackup: { type: Boolean, default: false },
  emergencyMessage: { type: String, default: '' }
})

const emit = defineEmits(['file-upload', 'back', 'submit', 'toast', 'request-espay', 'payment-success', 'reset-payment', 'cancel-order'])

const isGenerating = ref(false)
const paymentResult = ref(null)
const selectedMethod = ref('qris')
const isCheckingStatus = ref(false)
const isCancelling = ref(false)
const cooldownSeconds = ref(0)
let cooldownTimer = null
let pollInterval = null

// Data Pemesan untuk Kotak Konfirmasi Review
const primaryParticipant = computed(() => {
  if (!props.daftarPeserta || props.daftarPeserta.length === 0) return null
  const p = props.daftarPeserta[0]
  const j = p.jawaban || {}
  return {
    nama: j.nama_lengkap || j.namaLengkap || p.namaAnak || p.nama_lengkap || 'Peserta',
    email: j.email || p.email || '-',
    phone: j.no_wa || j.whatsapp || p.hp || p.no_wa || '-'
  }
})

// Daftar Seluruh Peserta (jika beli lebih dari 1 tiket)
const allParticipants = computed(() => {
  if (!props.daftarPeserta || props.daftarPeserta.length === 0) return []
  return props.daftarPeserta.map((p, idx) => {
    const j = p.jawaban || {}
    return {
      index: idx + 1,
      nama: j.nama_lengkap || j.namaLengkap || p.namaAnak || p.nama_lengkap || `Peserta ${idx + 1}`
    }
  })
})

// Timer Batas Waktu Pembayaran 15 Menit
const expirySeconds = ref(15 * 60)
const isExpired = ref(false)
let expiryInterval = null

function formatTimeRemaining(totalSec) {
  if (totalSec <= 0) return '00:00'
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function startExpiryTimer(initialSeconds = 900) {
  if (expiryInterval) {
    clearInterval(expiryInterval)
    expiryInterval = null
  }
  expirySeconds.value = Math.max(0, initialSeconds)
  isExpired.value = expirySeconds.value <= 0

  if (isExpired.value) {
    stopPolling()
    return
  }

  expiryInterval = setInterval(() => {
    expirySeconds.value--
    if (expirySeconds.value <= 0) {
      clearInterval(expiryInterval)
      expiryInterval = null
      isExpired.value = true
      stopPolling()
    }
  }, 1000)
}

function startCooldown(seconds = 5) {
  if (cooldownTimer) clearInterval(cooldownTimer)
  cooldownSeconds.value = seconds
  cooldownTimer = setInterval(() => {
    cooldownSeconds.value--
    if (cooldownSeconds.value <= 0) {
      clearInterval(cooldownTimer)
      cooldownTimer = null
    }
  }, 1000)
}

let activeOrderIdForPolling = null

function stopPolling() {
  if (pollInterval) {
    clearInterval(pollInterval)
    pollInterval = null
  }
}

async function queryPaymentStatus(orderId) {
  if (!orderId) return
  try {
    const res = await $fetch(`/api/check-espay?order_id=${orderId}`)
    if (res && res.status === 'paid') {
      stopPolling()
      if (expiryInterval) {
        clearInterval(expiryInterval)
        expiryInterval = null
      }
      if (typeof window !== 'undefined' && window.Swal?.isVisible?.()) {
        window.Swal.close()
      }
      emit('payment-success', orderId)
    } else if (res && (res.status === 'expired' || res.status === 'cancelled')) {
      stopPolling()
      if (expiryInterval) {
        clearInterval(expiryInterval)
        expiryInterval = null
      }
      isExpired.value = true
    } else if (res && res.remaining_seconds !== undefined && expirySeconds.value > res.remaining_seconds) {
      expirySeconds.value = res.remaining_seconds
    }
  } catch (e) {
    // Ignore polling errors
  }
}

function handleVisibilityChange() {
  if (typeof document === 'undefined') return
  if (document.hidden) {
    // Tab browser sedang di-minimize/background, jeda polling untuk menghemat resource server
    stopPolling()
  } else if (activeOrderIdForPolling) {
    // User kembali ke tab, langsung cek status dan restart polling 5 detik
    queryPaymentStatus(activeOrderIdForPolling)
    startPollingPayment(activeOrderIdForPolling)
  }
}

function startPollingPayment(orderId) {
  if (!orderId) return
  activeOrderIdForPolling = orderId
  stopPolling()

  if (typeof document !== 'undefined') {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('visibilitychange', handleVisibilityChange)
  }

  // Interval polling diatur ke 5000ms (5 detik) untuk efisiensi CPU/RAM server
  pollInterval = setInterval(() => {
    queryPaymentStatus(orderId)
  }, 5000)
}

// Restore session jika ada initialPaymentResult
watch(() => props.initialPaymentResult, (val) => {
  if (val && val.order_id) {
    paymentResult.value = val
    if (val.created_at) {
      const createdTime = new Date(val.created_at).getTime()
      const elapsedSec = Math.floor((Date.now() - createdTime) / 1000)
      startExpiryTimer(Math.max(0, 15 * 60 - elapsedSec))
    } else {
      startExpiryTimer(15 * 60)
    }
    startPollingPayment(val.order_id)
  }
}, { immediate: true })

// Filter channel yang aktif dari pengaturan EO
const availableMethods = computed(() => {
  const m = props.espayMethods || {}
  return {
    qris: m.qris !== false,
    va_bca: m.va_bca !== false,
    va_mandiri: m.va_mandiri !== false,
    va_bri: m.va_bri !== false,
    va_bni: m.va_bni === true // BNI default false di sandbox karena belum aktif BIN-nya
  }
})

const displayTotalQty = computed(() => {
  if (props.totalQty > 0) return props.totalQty
  if (paymentResult.value?.ticket_count) return paymentResult.value.ticket_count
  return 1
})

const displayTotalPrice = computed(() => {
  if (props.totalPrice > 0) return props.totalPrice
  if (paymentResult.value?.amount !== undefined) return paymentResult.value.amount
  return 0
})

const displayDonasiAmount = computed(() => {
  if (props.donasiAmount > 0) return props.donasiAmount
  if (paymentResult.value?.donasi_amount !== undefined) return paymentResult.value.donasi_amount
  return 0
})

const platformFee = computed(() => {
  if (paymentResult.value?.admin_fee !== undefined) return paymentResult.value.admin_fee
  if (displayTotalPrice.value === 0 && displayDonasiAmount.value === 0) return 0
  const baseAdmin = props.adminFee || 2000
  const securityCode = props.kodeUnik || 0
  return baseAdmin + securityCode
})

const manualPlatformFee = computed(() => {
  if (displayTotalPrice.value === 0 && displayDonasiAmount.value === 0) return 0
  const baseAdmin = props.adminFee || 2000
  const securityCode = props.kodeUnik || 0
  return baseAdmin + securityCode
})

// Logika Rekomendasi Paling Hemat Berdasarkan Nilai Transaksi (Threshold Rp 390.000)
// Di bawah 390.000: Fee QRIS (0.7104%) < Fee VA Bank (Rp 2.775) -> QRIS lebih hemat
// Di atas 390.000: Fee VA Bank (Rp 2.775) < Fee QRIS -> Bank VA lebih hemat
const isQrisCheaper = computed(() => {
  const subtotal = displayTotalPrice.value + displayDonasiAmount.value + platformFee.value
  return subtotal < 390000
})

const recommendedMethod = computed(() => {
  if (isQrisCheaper.value && availableMethods.value.qris) {
    return 'qris'
  }
  if (availableMethods.value.va_bca) return 'va_bca'
  if (availableMethods.value.va_mandiri) return 'va_mandiri'
  if (availableMethods.value.va_bri) return 'va_bri'
  if (availableMethods.value.va_bni) return 'va_bni'
  if (availableMethods.value.qris) return 'qris'
  return 'qris'
})

const isBankExpanded = ref(false)

const selectedBankShortName = computed(() => {
  if (selectedMethod.value === 'va_bca') return 'BCA'
  if (selectedMethod.value === 'va_mandiri') return 'Mandiri'
  if (selectedMethod.value === 'va_bri') return 'BRI'
  if (selectedMethod.value === 'va_bni') return 'BNI'
  return ''
})

const toggleBankAccordion = () => {
  isBankExpanded.value = !isBankExpanded.value
  if (isBankExpanded.value && !selectedMethod.value.startsWith('va')) {
    if (availableMethods.value.va_bca) selectedMethod.value = 'va_bca'
    else if (availableMethods.value.va_mandiri) selectedMethod.value = 'va_mandiri'
    else if (availableMethods.value.va_bri) selectedMethod.value = 'va_bri'
    else if (availableMethods.value.va_bni) selectedMethod.value = 'va_bni'
  }
}

// Auto select rekomendasi paling hemat saat load atau saat metode berubah
onMounted(() => {
  if (recommendedMethod.value && availableMethods.value[recommendedMethod.value]) {
    selectedMethod.value = recommendedMethod.value
    if (selectedMethod.value.startsWith('va')) {
      isBankExpanded.value = true
    }
  }
})

watch(availableMethods, (m) => {
  if (!m[selectedMethod.value]) {
    selectedMethod.value = recommendedMethod.value
    if (selectedMethod.value.startsWith('va')) {
      isBankExpanded.value = true
    }
  }
})

// Estimasi biaya gateway berdasarkan metode terpilih (termasuk PPN 11%)
const currentGatewayFee = computed(() => {
  if (paymentResult.value?.fee !== undefined) return paymentResult.value.fee
  if (!props.isEspayActive || (displayTotalPrice.value === 0 && displayDonasiAmount.value === 0)) return 0

  const subtotal = displayTotalPrice.value + displayDonasiAmount.value + platformFee.value
  if (selectedMethod.value === 'qris') {
    // 0.64% + PPN 11% = 0.7104% (0.007104) gross calculation
    const gross = Math.ceil(subtotal / (1 - 0.007104))
    return gross - subtotal
  } else if (selectedMethod.value === 'va_bni') {
    return 3330 // Rp 3.000 + PPN 11% (330)
  } else if (selectedMethod.value.startsWith('va')) {
    return 2775 // Rp 2.500 + PPN 11% (275)
  }
  return 0
})

const displayGrandTotal = computed(() => {
  if (paymentResult.value?.total_amount && props.isEspayActive) return paymentResult.value.total_amount
  if (!props.isEspayActive) {
    if (displayTotalPrice.value === 0 && displayDonasiAmount.value === 0) return 0
    return displayTotalPrice.value + displayDonasiAmount.value + manualPlatformFee.value
  }
  return displayTotalPrice.value + displayDonasiAmount.value + platformFee.value + currentGatewayFee.value
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price || 0)
}

const copyNominal = async (val) => {
  await copyText(String(val || props.grandTotal), 'Nominal')
}

const copyText = async (val, label = 'Teks') => {
  try {
    await navigator.clipboard.writeText(String(val))
    if (typeof window !== 'undefined' && window.Swal) {
      window.Swal.fire({
        icon: 'success',
        title: 'Berhasil Disalin!',
        text: `${label} telah disalin ke clipboard.`,
        timer: 1500,
        showConfirmButton: false
      })
    } else {
      emit('toast', `${label} berhasil disalin!`, 'success')
    }
  } catch (err) {
    emit('toast', `Gagal menyalin ${label}`, 'error')
  }
}

// Unduh QRIS Image (Ramah Mobile / iOS / Android)
const downloadQrisImage = async () => {
  if (!paymentResult.value?.qr_image) return
  const qrSrc = paymentResult.value.qr_image
  const filename = `QRIS_${paymentResult.value.order_id || 'Pembayaran'}.png`

  try {
    const res = await fetch(qrSrc)
    const blob = await res.blob()
    const blobUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
    emit('toast', 'Gambar QRIS berhasil diunduh ke galeri!', 'success')
  } catch (err) {
    // Fallback direct link
    try {
      const link = document.createElement('a')
      link.href = qrSrc
      link.download = filename
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      emit('toast', 'Gambar QRIS dibuka, silakan simpan ke galeri.', 'success')
    } catch (e) {
      window.open(qrSrc, '_blank')
    }
  }
}

const selectedMethodLabel = computed(() => {
  if (selectedMethod.value === 'qris') return 'QRIS (Semua E-Wallet / Bank)'
  if (selectedMethod.value === 'va_mandiri') return 'Mandiri Virtual Account'
  if (selectedMethod.value === 'va_bri') return 'BRI Virtual Account (BRIVA)'
  if (selectedMethod.value === 'va_bni') return 'BNI Virtual Account'
  return selectedMethod.value
})

// Direct 1-Click Payment Execution
const openConfirmModal = () => {
  handleRequestPayment()
}

// Request eksekusi bayar ke parent
const handleRequestPayment = () => {
  isGenerating.value = true
  emit('request-espay', {
    paymentMethod: selectedMethod.value,
    onSuccess: (res) => {
      isGenerating.value = false
      paymentResult.value = res
      startExpiryTimer(15 * 60)
      startPollingPayment(res.order_id)
    },
    onError: (err) => {
      isGenerating.value = false
    }
  })
}

// Batalkan Pesanan Resmi (Order Locked Flow)
const handleCancelOrder = async () => {
  if (!paymentResult.value?.order_id || isCancelling.value) return

  const doCancel = async () => {
    isCancelling.value = true
    try {
      await $fetch('/api/cancel-order', {
        method: 'POST',
        body: {
          order_id: paymentResult.value.order_id,
          cancel_token: paymentResult.value.cancel_token
        }
      })
      stopPolling()
      if (expiryInterval) {
        clearInterval(expiryInterval)
        expiryInterval = null
      }
      const cancelledId = paymentResult.value.order_id
      paymentResult.value = null
      emit('cancel-order', cancelledId)
    } catch (err) {
      emit('toast', err?.data?.statusMessage || 'Gagal membatalkan pesanan', 'error')
    } finally {
      isCancelling.value = false
    }
  }

  if (typeof window !== 'undefined' && window.Swal) {
    const result = await window.Swal.fire({
      title: 'Batalkan Pesanan Ini?',
      text: 'Jika dibatalkan, kode pembayaran tidak berlaku lagi dan kuota tiket akan dikembalikan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Batalkan',
      cancelButtonText: 'Kembali Membayar'
    })
    if (result.isConfirmed) {
      await doCancel()
    }
  } else {
    if (confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
      await doCancel()
    }
  }
}

const handleExpiredReset = () => {
  stopPolling()
  if (expiryInterval) {
    clearInterval(expiryInterval)
    expiryInterval = null
  }
  const cancelledId = paymentResult.value?.order_id
  paymentResult.value = null
  emit('cancel-order', cancelledId)
}

// Cek status manual saat tombol ditekan
const manualCheckPayment = async () => {
  if (!paymentResult.value?.order_id || isCheckingStatus.value || cooldownSeconds.value > 0) return
  isCheckingStatus.value = true
  try {
    const res = await $fetch(`/api/check-espay?order_id=${paymentResult.value.order_id}`)
    if (res && res.status === 'paid') {
      stopPolling()
      if (expiryInterval) {
        clearInterval(expiryInterval)
        expiryInterval = null
      }
      if (typeof window !== 'undefined' && window.Swal?.isVisible?.()) {
        window.Swal.close()
      }
      emit('payment-success', paymentResult.value.order_id)
      return
    } else if (res && (res.status === 'expired' || res.status === 'cancelled')) {
      stopPolling()
      if (expiryInterval) {
        clearInterval(expiryInterval)
        expiryInterval = null
      }
      isExpired.value = true
    } else {
      startCooldown(5)
      if (typeof window !== 'undefined' && window.Swal) {
        window.Swal.fire({
          icon: 'info',
          title: 'Belum Terdeteksi',
          text: 'Pembayaran belum terdeteksi masuk. Jika Anda baru saja menyelesaikan transfer / scan QRIS, mohon tunggu 5 detik lalu coba lagi.',
          confirmButtonColor: '#0c387a',
          confirmButtonText: 'Oke, Mengerti'
        })
      } else {
        emit('toast', 'Pembayaran belum terdeteksi. Silakan coba 5 detik lagi.', 'info')
      }
    }
  } catch (err) {
    startCooldown(5)
    emit('toast', 'Gagal memeriksa status pembayaran. Coba lagi dalam 5 detik.', 'error')
  } finally {
    isCheckingStatus.value = false
  }
}

onUnmounted(() => {
  stopPolling()
  activeOrderIdForPolling = null
  if (typeof document !== 'undefined') {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }
  if (cooldownTimer) {
    clearInterval(cooldownTimer)
    cooldownTimer = null
  }
  if (expiryInterval) {
    clearInterval(expiryInterval)
    expiryInterval = null
  }
})
</script>

<style scoped>
/* ======================================================== */
/* 1. BUYER REVIEW CARD (REVIEW DATA LENGKAP & RAPI DI ATAS) */
/* ======================================================== */
.buyer-review-card {
  background: var(--bg-light, #f8fafc);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 14px;
  margin-bottom: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}
.buyer-review-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 8px;
  margin-bottom: 8px;
}
.buyer-header-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #0f172a;
}
.buyer-header-icon {
  width: 16px;
  height: 16px;
  color: #0c387a;
}
.btn-review-change {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #0c387a;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-review-change:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
}
.buyer-review-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.buyer-field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 12px;
}
.buyer-field-row.single {
  grid-template-columns: 1fr;
}
.buyer-field {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.buyer-field-label {
  font-size: 0.64rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  line-height: 1.2;
}
.buyer-field-val {
  font-size: 0.8rem;
  color: #1e293b;
  word-break: break-word;
  line-height: 1.3;
}
.buyer-field-val.font-semibold {
  font-weight: 700;
  color: #0f172a;
}
.email-highlight {
  display: inline-block;
  background: #eff6ff;
  color: #1d4ed8;
  padding: 2px 7px;
  border-radius: 5px;
  font-weight: 700;
  font-size: 0.78rem;
  width: fit-content;
}
.buyer-participants-section {
  padding-top: 6px;
  border-top: 1px dashed #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.buyer-chips-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.buyer-chip {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #334155;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 5px;
}

/* Billing Card */
.billing-card {
  background: var(--bg-light, #f8fafc);
  padding: 10px 14px;
  border-radius: 12px;
  margin-bottom: 10px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
}
.billing-header {
  font-weight: 700;
  font-size: 0.65rem;
  text-transform: uppercase;
  color: var(--text-muted, #64748b);
  letter-spacing: 0.5px;
  text-align: center;
  display: block;
}
.billing-total-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 4px 0 8px;
}
.billing-total-amount {
  color: var(--text-main, #0f172a);
  margin: 0;
  font-size: 1.45rem;
  font-weight: 900;
}
.btn-copy {
  background: white;
  border: 1px solid var(--border-soft, #e2e8f0);
  border-radius: 6px;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted, #64748b);
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.icon-copy {
  width: 14px;
  height: 14px;
}
.billing-details {
  border-top: 1px dashed var(--border-soft, #e2e8f0);
  padding-top: 6px;
  margin-top: 2px;
}
.billing-detail-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.58rem;
  color: var(--text-muted, #64748b);
  margin-bottom: 2px;
  line-height: 1.3;
}
.billing-detail-subitem {
  display: flex;
  justify-content: space-between;
  font-size: 0.55rem;
  color: var(--text-muted, #64748b);
  opacity: 0.85;
  margin-bottom: 2px;
  line-height: 1.3;
}

/* Espay Method Selection (Shopee Style Vertical List) */
.method-selection-card {
  background: white;
  border: 1px solid var(--border-soft, #e2e8f0);
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 14px;
}
.section-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px;
}
/* Method Groups: QRIS & Bank Accordion */
.payment-method-groups {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.method-group-item {
  width: 100%;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  transition: all 0.2s ease;
  box-sizing: border-box;
  overflow: hidden;
}
.method-group-item:hover {
  border-color: #cbd5e1;
}
.method-group-item.active {
  border-color: #0c387a;
}
.group-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  gap: 10px;
  cursor: pointer;
}
.bank-header-clickable {
  cursor: pointer;
}
.bank-header-clickable:hover {
  background: #fafbfc;
}
.group-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
}
.method-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #f1f5f9;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s ease;
}
.qris-icon-bg {
  background: #eef2ff;
  color: #3730a3;
}
.bank-icon-bg {
  background: #f0fdf4;
  color: #166534;
}
.method-group-item.active .qris-icon-bg {
  background: #e0edff;
  color: #0c387a;
}
.method-group-item.active .bank-icon-bg {
  background: #e0edff;
  color: #0c387a;
}
.method-icon {
  width: 20px;
  height: 20px;
}
.method-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.method-name-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.method-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
}
.method-group-item.active .method-name {
  color: #0c387a;
}
.badge-cheapest {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 4px;
  padding: 2px 7px;
  letter-spacing: 0.02em;
  line-height: 1.2;
}
.method-desc {
  font-size: 0.71rem;
  color: #64748b;
  line-height: 1.35;
}
.method-radio {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1.5px solid #cbd5e1;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s ease;
}
.method-radio.checked {
  border-color: #0c387a;
  background: #0c387a;
}
.radio-check-svg {
  width: 10px;
  height: 10px;
  color: #ffffff;
}

/* Bank Accordion Indicator */
.bank-accordion-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.active-bank-pill {
  background: #0c387a;
  color: white;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 10px;
  letter-spacing: 0.02em;
}
.chevron-icon-svg {
  width: 18px;
  height: 18px;
  color: #64748b;
  transition: transform 0.25s ease;
}
.chevron-icon-svg.rotate {
  transform: rotate(180deg);
  color: #0c387a;
}

/* QRIS Dynamic View */
.qris-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 8px 12px;
  text-align: center;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.qris-header-badge {
  margin-bottom: 4px;
}
.qris-label {
  display: block;
  font-size: 0.76rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: 0.5px;
}
.qris-sublabel {
  display: block;
  font-size: 0.62rem;
  color: #64748b;
  margin-top: 1px;
}
.qris-qr-box {
  background: white;
  padding: 6px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  margin-bottom: 6px;
}
.qris-dynamic-image {
  width: 175px;
  height: 175px;
  display: block;
}
.qris-static-image {
  width: 175px;
  height: 175px;
  object-fit: contain;
  display: block;
  border-radius: 4px;
}
.btn-download-qris {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #334155;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.68rem;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 6px;
  transition: all 0.2s;
}
.btn-download-qris:hover {
  background: #e2e8f0;
}
.icon-download {
  width: 12px;
  height: 12px;
}

/* Virtual Account View */
.va-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 18px;
  margin-bottom: 15px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}
.va-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #e2e8f0;
}
.va-bank-badge {
  font-size: 0.9rem;
  font-weight: 800;
  color: #0c387a;
}
.va-instan-badge {
  background: #dcfce7;
  color: #15803d;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 12px;
}
.va-number-box, .va-amount-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 10px;
}
.va-number-label, .va-amount-label {
  display: block;
  font-size: 0.7rem;
  color: #64748b;
  margin-bottom: 4px;
}
.va-number-row, .va-amount-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.va-digits {
  font-size: 1.3rem;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: 1.5px;
  font-family: monospace;
}
.va-amount-digits {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0f172a;
}
.btn-copy-va {
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #0c387a;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.va-exact-warn {
  display: block;
  margin-top: 6px;
  font-size: 0.68rem;
  color: #b45309;
  font-weight: 600;
}
.precision-box {
  width: 100%;
  text-align: left;
  box-sizing: border-box;
  margin-top: 14px;
}
.highlight-price {
  color: #E85D5E;
}

/* Guide Card */
.va-guide-card {
  background: #f1f5f9;
  border-radius: 8px;
  padding: 10px 12px;
  margin-top: 14px;
}
.guide-title {
  font-size: 0.72rem;
  font-weight: 700;
  color: #334155;
  margin: 0 0 6px;
}
.guide-steps {
  margin: 0;
  padding-left: 18px;
  font-size: 0.68rem;
  color: #475569;
  line-height: 1.4;
}

/* Realtime Pulsing Status */
.realtime-status-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 5px 10px;
  margin-top: 5px;
  text-align: left;
  width: 100%;
}
.pulse-indicator {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  animation: pulse-ring 1.8s infinite cubic-bezier(0.66, 0, 0, 1);
  flex-shrink: 0;
}
.realtime-status-text {
  font-size: 0.72rem;
  font-weight: 700;
  color: #166534;
  margin: 0;
}
.realtime-subtext {
  font-size: 0.62rem;
  color: #15803d;
}

/* Manual Section */
.upload-section { margin-bottom: 12px; }
.upload-label { display: block; margin-bottom: 4px; font-size: 0.75rem; font-weight: 600; color: var(--text-muted, #64748b); }
.required-mark { color: #ef4444; }
.upload-box {
  border: 2px dashed var(--border-soft, #e2e8f0);
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  background: var(--bg-light, #f8fafc);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.error-shake { border-color: #ef4444; background: #fef2f2; }
.upload-placeholder { pointer-events: none; }
.upload-placeholder-title { margin: 0 0 6px 0; font-size: 0.9rem; font-weight: 700; color: var(--text-main, #0f172a); }
.upload-placeholder-desc { margin: 0; font-size: 0.75rem; font-weight: 500; color: var(--text-muted, #64748b); }
.upload-preview-image { width: 100%; max-height: 250px; object-fit: contain; border-radius: 8px; border: 1px solid var(--border-soft, #e2e8f0); }
.upload-input { position: absolute; inset: 0; opacity: 0; cursor: pointer; z-index: 10; }

/* Buttons */
.action-buttons { display: flex; gap: 8px; margin-top: 10px; }
.mt-3 { margin-top: 8px; }
.btn { padding: 9px 12px; border-radius: 8px; font-weight: 600; border: none; cursor: pointer; font-size: 0.78rem; }
.btn-secondary { flex: 3; background: #e2e8f0; color: #475569; }
.btn-primary { flex: 7; background: #0c387a; color: white; }
.btn-loading { opacity: 0.7; cursor: not-allowed; }

.btn-simulate-pay {
  margin-top: 5px;
  width: 100%;
  padding: 6px 8px;
  border-radius: 6px;
  background: #fef3c7;
  border: 1px dashed #f59e0b;
  color: #b45309;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-simulate-pay:hover {
  background: #fde68a;
}

.btn-refresh-status {
  margin-top: 5px;
  width: 100%;
  padding: 7px 12px;
  border-radius: 6px;
  background: white;
  border: 1.5px solid #0c387a;
  color: #0c387a;
  font-size: 0.74rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(12, 56, 122, 0.06);
}
.btn-refresh-status:hover:not(:disabled) {
  background: #f0f7ff;
}
.btn-refresh-status:disabled {
  opacity: 0.85;
  cursor: not-allowed;
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #64748b;
}
.spinner-small {
  width: 14px;
  height: 14px;
  border: 2px solid #0c387a;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ======================================================== */
/* BANK GRID DROPDOWN (2-KOLOM RAPI & MODERN)               */
/* ======================================================== */
.bank-grid-dropdown {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding: 4px 12px 14px 12px;
  background: #ffffff;
  animation: fadeIn 0.2s ease-out;
}
.bank-grid-card {
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  box-sizing: border-box;
  width: 100%;
}
.bank-grid-card:hover {
  border-color: #94a3b8;
  background: #fafbfc;
}
.bank-grid-card.selected {
  border-color: #0c387a;
  background: #f0f7ff;
  box-shadow: 0 0 0 1px #0c387a;
}
.bank-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.bank-badge {
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  padding: 3px 8px;
  border-radius: 5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.bank-badge.bca {
  background: #0060af;
  color: #ffffff;
}
.bank-badge.mandiri {
  background: #003d79;
  color: #ffb800;
  font-style: italic;
}
.bank-badge.bri {
  background: #00529c;
  color: #ffffff;
}
.bank-badge.bni {
  background: #f15a22;
  color: #ffffff;
}
.bank-card-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.25;
}
.bank-grid-card.selected .bank-card-title {
  color: #0c387a;
}
.bank-radio {
  width: 17px;
  height: 17px;
  border-radius: 50%;
  border: 1.5px solid #cbd5e1;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s ease;
}
.bank-radio.checked {
  border-color: #0c387a;
  background: #0c387a;
}

/* ======================================================== */
/* CHECKOUT FINAL NOTICE (LANGKAH TERAKHIR)                 */
/* ======================================================== */
.checkout-final-notice {
  margin-top: 14px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-left: 4px solid #f59e0b;
  border-radius: 10px;
  padding: 9px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.notice-pulse-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.66rem;
  font-weight: 800;
  color: #b45309;
  letter-spacing: 0.05em;
}
.pulse-dot {
  width: 6px;
  height: 6px;
  background: #f59e0b;
  border-radius: 50%;
  animation: pingDot 1.5s infinite;
}
@keyframes pingDot {
  0% { transform: scale(0.9); opacity: 0.8; }
  50% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0.8; }
}
.notice-desc {
  font-size: 0.74rem;
  color: #78350f;
  line-height: 1.4;
  margin: 0;
}

/* ======================================================== */
/* STAY ON PAGE BANNER (HASIL PEMBAYARAN)                   */
/* ======================================================== */
.stay-page-banner {
  background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
  border: 1px solid #93C5FD;
  border-radius: 14px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.08);
}

.stay-pulse-icon {
  position: relative;
  width: 36px;
  height: 36px;
  background: #2563EB;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stay-ring {
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 2px solid #3B82F6;
  opacity: 0.6;
  animation: pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulseRing {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.15); opacity: 0.2; }
  100% { transform: scale(0.95); opacity: 0.8; }
}

.stay-svg {
  width: 20px;
  height: 20px;
}

.stay-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stay-title {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #1E40AF;
  text-transform: uppercase;
}

.stay-desc {
  font-size: 0.74rem;
  color: #1E3A8A;
  margin: 0;
  line-height: 1.4;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 15-Minute Expiry Timer Box */
.payment-timer-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 10px;
  font-size: 0.76rem;
  color: #92400e;
  font-weight: 600;
  transition: all 0.3s;
}
.payment-timer-box.timer-urgent {
  background: #fef2f2;
  border-color: #fecaca;
  color: #b91c1c;
  animation: pulse-urgent 1.5s infinite;
}
.timer-icon-svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
.timer-label {
  color: inherit;
}
.timer-countdown {
  font-family: monospace;
  font-size: 0.95rem;
  font-weight: 800;
  background: rgba(0,0,0,0.06);
  padding: 2px 6px;
  border-radius: 4px;
}
@keyframes pulse-urgent {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

/* Expired State Card */
.expired-card {
  background: #fef2f2;
  border: 1.5px dashed #ef4444;
  border-radius: 12px;
  padding: 24px 16px;
  text-align: center;
  margin-bottom: 12px;
}
.expired-icon {
  margin-bottom: 8px;
  display: flex;
  justify-content: center;
}
.icon-expired-svg {
  width: 42px;
  height: 42px;
  color: #ef4444;
}
.expired-title {
  color: #991b1b;
  font-size: 0.92rem;
  font-weight: 700;
  margin: 0 0 6px;
}
.expired-desc {
  font-size: 0.74rem;
  color: #7f1d1d;
  line-height: 1.4;
  margin: 0;
}

/* Tombol Batalkan Pesanan */
.btn-cancel-order {
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #fca5a5;
  color: #dc2626;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.btn-cancel-order:hover:not(:disabled) {
  background: #fef2f2;
  border-color: #ef4444;
}
.btn-cancel-order:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.danger-spinner {
  border-color: #dc2626;
  border-top-color: transparent;
}

/* Shared Vector SVG Icon Helper Classes */
.badge-icon-svg {
  width: 13px;
  height: 13px;
  display: inline-block;
  vertical-align: -2px;
  margin-right: 4px;
  color: #0c387a;
}
.icon-close-svg {
  width: 14px;
  height: 14px;
}
.icon-info-svg {
  width: 16px;
  height: 16px;
  color: #2563eb;
  flex-shrink: 0;
}
.icon-warn-svg {
  width: 14px;
  height: 14px;
  color: #f59e0b;
  display: inline-block;
  vertical-align: -2px;
  margin-right: 4px;
  flex-shrink: 0;
}
.icon-info-svg-blue {
  width: 14px;
  height: 14px;
  color: #0284c7;
  display: inline-block;
  vertical-align: -2px;
  margin-right: 4px;
  flex-shrink: 0;
}
.icon-copy-svg {
  width: 13px;
  height: 13px;
  display: inline-block;
  vertical-align: -2px;
  margin-left: 4px;
}
.icon-cancel-svg {
  width: 15px;
  height: 15px;
  display: inline-block;
  vertical-align: -2px;
  margin-right: 5px;
  flex-shrink: 0;
}
.btn-svg-inline {
  width: 14px;
  height: 14px;
  display: inline-block;
  vertical-align: -2px;
  margin-right: 5px;
  flex-shrink: 0;
}
.btn-arrow-svg {
  width: 14px;
  height: 14px;
  display: inline-block;
  vertical-align: -2px;
  margin-left: 6px;
  flex-shrink: 0;
}
.icon-check-svg {
  width: 15px;
  height: 15px;
  display: inline-block;
  vertical-align: -2px;
  margin-left: 6px;
  flex-shrink: 0;
}
.btn-text-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.text-amber {
  color: #d97706;
}
.emergency-alert-banner {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #FFFBEB;
  border: 1px solid #FDE68A;
  border-left: 4px solid #F59E0B;
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 20px;
}
.emergency-banner-icon {
  flex-shrink: 0;
  color: #D97706;
  margin-top: 2px;
}
.icon-emergency-svg {
  width: 22px;
  height: 22px;
}
.emergency-banner-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.emergency-badge-text {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  color: #B45309;
  text-transform: uppercase;
}
.emergency-message-text {
  font-size: 0.85rem;
  color: #78350F;
  margin: 0;
  line-height: 1.45;
}
</style>
