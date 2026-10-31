<template>
  <div class="simulation-page">
    <!-- Efek Suara Printer Tiket -->
    <audio ref="printAudio" src="/printer.mp3" preload="auto"></audio>

    <!-- Top Simulator Control Header -->
    <header class="simulator-topbar">
      <div class="topbar-inner">
        <div class="topbar-left">
          <NuxtLink to="/" class="brand-link">
            <div class="brand-logo">T</div>
            <div class="brand-text">
              <span class="brand-title">Tyket.id</span>
              <span class="brand-sub">Sandbox Environment</span>
            </div>
          </NuxtLink>
          <span class="topbar-separator"></span>
          <span class="sandbox-badge">
            <span class="pulse-dot"></span>
            Simulasi Gateway Espay
          </span>
        </div>

        <div class="topbar-right">
          <NuxtLink to="/espay-flow" class="btn-tracer-link" style="background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.4); color: #38bdf8; font-weight: 700; padding: 6px 14px; border-radius: 8px; font-size: 13px; text-decoration: none; display: flex; align-items: center; gap: 6px;">
            ⚡ Visualizer Listrik
          </NuxtLink>
          <NuxtLink to="/s1u2p3e4r5" class="btn-master-link">
            👑 Ruang Master
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Floating Toast Message -->
    <div v-if="toastMessage" class="toast-message" :class="toastType === 'success' ? 'toast-success' : 'toast-error'">
      {{ toastMessage }}
    </div>

    <!-- MAIN MOBILE CONTAINER (Persis dengan Layout [slug].vue) -->
    <div class="container">
      
      <!-- EVENT BANNER & POSTER MINI -->
      <div class="sim-event-banner">
        <div class="sim-event-media">
          <img 
            src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=80" 
            alt="Poster Festival Musik" 
            class="sim-poster-img"
          />
          <div class="sim-badge-overlay">UJI COBA RESMI</div>
        </div>
        <div class="sim-event-meta">
          <span class="sim-tag">Event Musik & Ekspo</span>
          <h1 class="sim-title">{{ dummyEventData.nama_event }}</h1>
          <p class="sim-loc">📍 {{ dummyEventData.lokasi }} • 19:00 WIB</p>
        </div>
      </div>

      <!-- KARTU INFO DATA OTOMATIS & PRESET HARGA -->
      <div v-if="currentStep === 'bayar' && !activePaymentResult" class="sim-config-card">
        <!-- Badge Data Pembeli Otomatis -->
        <div class="auto-user-box">
          <div class="auto-user-avatar">BP</div>
          <div class="auto-user-info">
            <div class="auto-user-name">
              <span>{{ dummyUser.name }}</span>
              <span class="auto-badge">Otomatis Terisi</span>
            </div>
            <div class="auto-user-meta">{{ dummyUser.email }} • {{ dummyUser.phone }}</div>
          </div>
        </div>

        <!-- Pilihan Cepat Nominal Uji Coba -->
        <div class="nominal-preset-section">
          <div class="preset-label">
            <span>Pilih Nominal Tiket Pengujian:</span>
            <strong>Rp {{ formatPrice(ticketAmount) }}</strong>
          </div>
          <div class="preset-buttons-grid">
            <button
              v-for="amt in [10000, 25000, 50000, 100000]"
              :key="amt"
              type="button"
              @click="ticketAmount = amt"
              :class="['preset-btn', ticketAmount === amt ? 'active' : '']"
            >
              Rp {{ (amt / 1000) }}rb
            </button>
          </div>
        </div>
      </div>

      <!-- TAMPILAN CHECKOUT (Menggunakan Komponen CheckoutPayment Asli!) -->
      <div v-if="currentStep === 'bayar'" class="step-content active step-padded">
        <CheckoutPayment
          :grandTotal="grandTotalCalculated"
          :totalQty="1"
          :totalPrice="ticketAmount"
          :adminFee="2000"
          :kodeUnik="0"
          :donasiAmount="0"
          :daftarPeserta="daftarPeserta"
          :isEspayActive="true"
          :espayMethods="{ qris: true, va_mandiri: true, va_bri: true, va_bni: true }"
          :eventData="dummyEventData"
          :initialPaymentResult="activePaymentResult"
          @request-espay="handleRequestEspay"
          @payment-success="handlePaymentSuccess"
          @reset-payment="handleResetPayment"
          @cancel-order="handleResetPayment"
          @toast="showToastMsg"
        />

        <!-- SIMULASI PEMBAYARAN SANDBOX (Hanya Tampil Saat QRIS/VA Sudah Muncul) -->
        <div v-if="activePaymentResult" class="sim-sandbox-pay-box">
          <div class="sim-pay-badge-row">
            <span class="badge-sandbox-mode">⚡ UJI COBA PEMBAYARAN</span>
            <span class="sim-order-id-tag">Order ID: <strong>{{ activePaymentResult.order_id }}</strong></span>
          </div>
          <h3 class="sim-pay-title">Simulasikan Pembeli Membayar</h3>
          <p class="sim-pay-desc">
            Di Sandbox, Anda tidak perlu transfer uang sungguhan. Klik tombol di bawah untuk menyimulasikan pembayaran lunas dan menguji alur otomatisasi tiket Tyket:
          </p>
          <div class="sim-pay-btn-row">
            <button 
              type="button" 
              @click="triggerSimulatePayment" 
              :disabled="isSimulatingPay"
              class="btn-trigger-pay"
            >
              <span v-if="isSimulatingPay" class="spinner-small"></span>
              <span v-else class="btn-text-icon">
                <svg class="btn-svg-inline" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>
                ⚡ Simulasikan Pembayaran Sukses (Terbitkan E-Ticket)
              </span>
            </button>
          </div>
          <div class="sim-pay-portal-note">
            <small>💡 <strong>Atau via Portal Resmi Espay:</strong> Login ke portal sandbox Espay &rarr; Masuk menu <strong>Collection / Temp Report</strong> &rarr; Pilih transaksi &rarr; Klik tombol <strong>"Update to Success with Notification"</strong>.</small>
          </div>
        </div>

        <!-- ======================================================== -->
        <!-- REALTIME LOG RESPON GATEWAY (Tepat di Bawah 'Bayar Sekarang') -->
        <!-- ======================================================== -->
        <div id="debug-log-card" class="debug-console-card" :class="`status-${logStatus}`">
          <!-- Header Bar -->
          <div class="console-header">
            <div class="console-title-wrap">
              <div class="console-pulse" :class="`pulse-${logStatus}`"></div>
              <div class="console-title-texts">
                <h3 class="console-title">Log Respon Gateway Espay</h3>
                <span class="console-subtitle">Pantau status respon asli & generator QRIS Sandbox</span>
              </div>
            </div>

            <!-- Status Badge -->
            <div class="console-status-badge" :class="`badge-${logStatus}`">
              <span v-if="logStatus === 'idle'">⚪ Menunggu Trigger</span>
              <span v-else-if="logStatus === 'loading'">🟡 Memproses...</span>
              <span v-else-if="logStatus === 'success'">🟢 200 OK (Berhasil)</span>
              <span v-else-if="logStatus === 'error'">🔴 GAGAL {{ logData?.responseCode || logData?.httpStatus || '' }}</span>
            </div>
          </div>

          <!-- Quick Action Bar -->
          <div class="console-actions-bar">
            <div class="actions-left">
              <span class="action-meta-tag">
                Metode: <strong>{{ logData?.method?.toUpperCase() || 'QRIS' }}</strong>
              </span>
              <span class="action-meta-tag">
                Merchant ID: <strong>{{ selectedMerchant }}</strong>
              </span>
              <span v-if="logData?.timestamp" class="action-time-tag">
                🕒 {{ logData.timestamp }}
              </span>
            </div>
            <div class="actions-right">
              <button
                v-if="logData"
                type="button"
                @click="copyLogJson"
                class="btn-console-tool"
                title="Salin Log JSON ke Clipboard"
              >
                <span v-if="copied">✓ Tersalin!</span>
                <span v-else>📋 Salin JSON</span>
              </button>
              <button
                v-if="logData"
                type="button"
                @click="clearLog"
                class="btn-console-tool btn-tool-clear"
                title="Bersihkan Log"
              >
                🗑️ Bersihkan
              </button>
            </div>
          </div>

          <!-- Merchant Switcher (Sample Sandbox vs Akun .env) -->
          <div class="merchant-switch-row">
            <span class="m-switch-label">Target Merchant Sandbox:</span>
            <div class="m-switch-buttons">
              <button
                type="button"
                :class="['btn-m-switch', selectedMerchant === 'SGWYESSISHOP' ? 'active' : '']"
                @click="selectedMerchant = 'SGWYESSISHOP'"
              >
                🏢 SGWYESSISHOP <small>(Sample Sandbox Docs)</small>
              </button>
              <button
                type="button"
                :class="['btn-m-switch', selectedMerchant === (envInfo?.commCode || 'SGWZULKARNAENALMUHAMMADY') ? 'active' : '']"
                @click="selectedMerchant = envInfo?.commCode || 'SGWZULKARNAENALMUHAMMADY'"
              >
                👤 {{ envInfo?.commCode || 'SGWZULKARNAENALMUHAMMADY' }} <small>(Akun .env)</small>
              </button>
            </div>
          </div>

          <!-- Banner Diagnosa Masalah (Tampil Jika Error) -->
          <div v-if="logStatus === 'error' && errorDiagnosis" class="diagnosis-banner">
            <div class="diagnosis-icon-wrap">
              <svg class="diag-svg" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <div class="diagnosis-body">
              <div class="diagnosis-title">{{ errorDiagnosis.title }}</div>
              <p class="diagnosis-desc">{{ errorDiagnosis.description }}</p>
              <div class="diagnosis-fix-box">
                <span class="fix-label">💡 Solusi & Rekomendasi:</span>
                <p class="fix-text">{{ errorDiagnosis.fix }}</p>
              </div>
            </div>
          </div>

          <!-- Tabs Navigation -->
          <div class="console-tabs-nav">
            <button
              type="button"
              @click="activeTab = 'summary'"
              :class="['console-tab-btn', activeTab === 'summary' ? 'active' : '']"
            >
              📊 Ringkasan
            </button>
            <button
              type="button"
              @click="activeTab = 'raw'"
              :class="['console-tab-btn', activeTab === 'raw' ? 'active' : '']"
            >
              📄 Raw JSON
            </button>
            <button
              type="button"
              @click="activeTab = 'signature'"
              :class="['console-tab-btn', activeTab === 'signature' ? 'active' : '']"
            >
              🔑 Headers & Signature Request
            </button>
            <button
              type="button"
              @click="activeTab = 'env'"
              :class="['console-tab-btn', activeTab === 'env' ? 'active' : '']"
            >
              ⚙️ Konfigurasi .env
            </button>
          </div>

          <!-- Tab 1: Ringkasan -->
          <div v-if="activeTab === 'summary'" class="console-panel">
            <div v-if="logStatus === 'idle'" class="console-empty-state">
              <div class="empty-icon">⚡</div>
              <div class="empty-title">Siap untuk Pengujian Gateway</div>
              <p class="empty-desc">
                Pilih metode pembayaran (misal <strong>QRIS</strong>) lalu klik tombol <strong>"BAYAR SEKARANG"</strong> di atas. Log respon asli, kode status, dan diagnosa kegagalan dari Espay Sandbox akan otomatis muncul di sini.
              </p>
              <button 
                type="button" 
                @click="triggerDirectTest('qris')" 
                class="btn-trigger-quick"
              >
                🚀 Test QRIS Langsung Sekarang
              </button>
            </div>

            <div v-else class="summary-grid">
              <div class="summary-item full-width">
                <span class="s-label">Pesan Respon</span>
                <span class="s-value font-bold" :class="logStatus === 'error' ? 'text-red' : 'text-green'">
                  {{ logData?.message || '-' }}
                </span>
              </div>

              <div class="summary-item">
                <span class="s-label">Kode Respon Espay</span>
                <span class="s-value code-pill" :class="logStatus === 'error' ? 'code-error' : 'code-success'">
                  {{ logData?.responseCode || '-' }}
                </span>
              </div>

              <div class="summary-item">
                <span class="s-label">HTTP Status</span>
                <span class="s-value font-mono">
                  {{ logData?.httpStatus || '-' }}
                </span>
              </div>

              <div class="summary-item">
                <span class="s-label">Order ID Simulasi</span>
                <span class="s-value font-mono">
                  {{ logData?.orderId || logData?.raw?.order_id || '-' }}
                </span>
              </div>

              <div class="summary-item">
                <span class="s-label">Metode Pembayaran</span>
                <span class="s-value font-mono uppercase">
                  {{ logData?.method || 'QRIS' }}
                </span>
              </div>

              <div v-if="logData?.raw?.referenceNo" class="summary-item full-width">
                <span class="s-label">Reference No Espay</span>
                <span class="s-value font-mono text-green">
                  {{ logData.raw.referenceNo }}
                </span>
              </div>

              <!-- Endpoint Callback Webhook Espay -->
              <div class="summary-item full-width highlight-callback">
                <div class="callback-header-row">
                  <span class="s-label">🔗 Target Callback Webhook Inquiry</span>
                  <button
                    type="button"
                    class="btn-copy-cb"
                    @click="copyText(`${currentOrigin}/api/webhook/espay-inquiry`)"
                    title="Salin URL Callback Inquiry"
                  >
                    📋 Salin
                  </button>
                </div>
                <span class="s-value font-mono text-amber">
                  {{ currentOrigin }}/api/webhook/espay-inquiry
                </span>
                <span class="s-subtext text-emerald-600">
                  💡 Pastikan URL ini dimasukkan ke kolom <strong>Inquiry URL</strong> di Portal Sandbox Espay lalu klik <strong>Submit/Save</strong>.
                </span>
              </div>
            </div>
          </div>

          <!-- Tab 2: Raw JSON -->
          <div v-if="activeTab === 'raw'" class="console-panel">
            <pre class="json-code-block">{{ formatJson(logData?.raw || logData || { status: 'idle', note: 'Belum ada request yang dijalankan' }) }}</pre>
          </div>

          <!-- Tab 3: Asymmetric Signature & Request -->
          <div v-if="activeTab === 'signature'" class="console-panel">
            <div v-if="!logData?.debug" class="no-step-data">
              Belum ada data eksekusi signature. Klik "BAYAR SEKARANG" untuk merekam StringToSign dan Header yang dikirim ke Espay.
            </div>
            <div v-else class="step-detail-box">
              <div class="step-meta-row">
                <span class="step-badge">POST</span>
                <span class="step-url">{{ logData.debug.url || '/api/v1.0/qr/qr-mpm-generate' }}</span>
              </div>
              <!-- 1. PERBANDINGAN HEADERS (SAMPLE DOCS vs ACTUAL SENT) -->
              <div class="step-subhead">1. Perbandingan Headers HTTP (Sample Docs vs Terkirim):</div>
              <div class="compare-grid">
                <div class="compare-col">
                  <span class="compare-title title-sample">📋 Sample Headers (Dokumentasi Espay)</span>
                  <pre class="json-code-block border-sample">{{ formatJson(logData.debug.sampleHeaders) }}</pre>
                </div>
                <div class="compare-col">
                  <span class="compare-title title-actual">🚀 Actual Headers Sent (Aplikasi Kita)</span>
                  <pre class="json-code-block border-actual">{{ formatJson(logData.debug.headersSent) }}</pre>
                </div>
              </div>

              <!-- 2. PERBANDINGAN PARAMETER REQUEST (SAMPLE DOCS vs ACTUAL SENT) -->
              <div class="step-subhead">2. Perbandingan Parameter Request (Sample Docs vs Terkirim):</div>
              <div class="compare-grid">
                <div class="compare-col">
                  <span class="compare-title title-sample">📋 Sample Request (Dokumentasi Espay)</span>
                  <pre class="json-code-block border-sample">{{ formatJson(logData.debug.sampleRequest) }}</pre>
                </div>
                <div class="compare-col">
                  <span class="compare-title title-actual">🚀 Actual Request Sent (Aplikasi Kita)</span>
                  <pre class="json-code-block border-actual">{{ formatJson(logData.debug.formDataSent || logData.debug.bodySent) }}</pre>
                </div>
              </div>

              <!-- 3. TARGET ENDPOINT CALLBACK WEBHOOK YANG DIPANGGIL ESPAY -->
              <div class="step-subhead">3. Target Endpoint Callback Webhook:</div>
              <div class="webhook-info-box">
                <div class="webhook-row">
                  <span class="webhook-k">Inquiry Callback URL (Dipanggil Espay saat Send Invoice):</span>
                  <div class="webhook-val-wrap">
                    <span class="webhook-v font-mono text-amber">{{ currentOrigin }}/api/webhook/espay-inquiry</span>
                    <button type="button" class="btn-copy-cb-sm" @click="copyText(`${currentOrigin}/api/webhook/espay-inquiry`)">Salin</button>
                  </div>
                </div>
                <div class="webhook-row">
                  <span class="webhook-k">Payment Notification URL (Dipanggil Espay saat Lunas):</span>
                  <div class="webhook-val-wrap">
                    <span class="webhook-v font-mono text-green">{{ currentOrigin }}/api/webhook/espay</span>
                    <button type="button" class="btn-copy-cb-sm" @click="copyText(`${currentOrigin}/api/webhook/espay`)">Salin</button>
                  </div>
                </div>
                <div class="webhook-note">
                  ℹ️ <strong>Catatan Penting:</strong> Server Espay Sandbox memanggil Callback Inquiry ke URL yang disimpan di <strong>Portal Merchant Sandbox Espay</strong> Anda. Pastikan kolom Inquiry URL di portal sudah diisi dengan link tunnel/domain publik Anda (misal Pinggy/Ngrok) dan sudah tersimpan.
                </div>
              </div>

              <!-- 4. DETAIL STRING TO SIGN & HASHING -->
              <div v-if="logData.debug.rawStringToSign" class="step-subhead">4. StringToSign Hash-Based (Send Invoice):</div>
              <pre v-if="logData.debug.rawStringToSign" class="json-code-block single-line">{{ logData.debug.rawStringToSign }}</pre>

              <div v-if="logData.debug.stringToSign" class="step-subhead">4. StringToSign Asymmetric (SNAP QRIS):</div>
              <pre v-if="logData.debug.stringToSign" class="json-code-block single-line">{{ logData.debug.stringToSign }}</pre>

              <div v-if="logData.debug.bodyHash" class="step-subhead">Body SHA-256 (Lowercase Hex):</div>
              <pre v-if="logData.debug.bodyHash" class="json-code-block single-line">{{ logData.debug.bodyHash }}</pre>

              <!-- 5. HASIL RESPON ESPAY SANDBOX -->
              <div class="step-subhead">5. Hasil Respon dari Server Espay Sandbox:</div>
              <pre class="json-code-block" :class="logData.httpStatus === 200 ? 'border-green' : 'border-red'">{{ formatJson(logData.debug.responseRaw || logData.raw) }}</pre>
            </div>
          </div>

          <!-- Tab 5: Konfigurasi .env -->
          <div v-if="activeTab === 'env'" class="console-panel">
            <div class="env-info-grid">
              <div class="env-row">
                <span class="env-k">ESPAY_API_URL:</span>
                <span class="env-v font-mono">{{ envInfo?.apiUrl || 'https://sandbox-api.espay.id' }}</span>
              </div>
              <div class="env-row">
                <span class="env-k">ESPAY_COMM_CODE:</span>
                <span class="env-v font-mono">{{ envInfo?.commCode || '-' }}</span>
              </div>
              <div class="env-row">
                <span class="env-k">Inquiry Callback URL (Wajib di Portal Espay):</span>
                <div class="webhook-val-wrap">
                  <span class="env-v font-mono text-amber">{{ currentOrigin }}/api/webhook/espay-inquiry</span>
                  <button type="button" class="btn-copy-cb-sm" @click="copyText(`${currentOrigin}/api/webhook/espay-inquiry`)">Salin</button>
                </div>
              </div>
              <div class="env-row">
                <span class="env-k">Payment Notification URL (Portal Espay):</span>
                <div class="webhook-val-wrap">
                  <span class="env-v font-mono text-green">{{ currentOrigin }}/api/webhook/espay</span>
                  <button type="button" class="btn-copy-cb-sm" @click="copyText(`${currentOrigin}/api/webhook/espay`)">Salin</button>
                </div>
              </div>
              <div class="env-row">
                <span class="env-k">Status Konfigurasi Portal:</span>
                <span class="env-v text-amber font-medium">Wajib disimpan di Portal Sandbox Espay</span>
              </div>
              <div class="env-row">
                <span class="env-k">SNAP CLIENT ID:</span>
                <span class="env-v font-mono">{{ envInfo?.clientId || '-' }}</span>
              </div>
              <div class="env-row">
                <span class="env-k">Status Private Key:</span>
                <span class="env-v" :class="envInfo?.hasPrivateKey ? 'text-green' : 'text-red'">
                  {{ envInfo?.hasPrivateKey ? `✅ Terpasang (${envInfo.privateKeyLength} bytes)` : '❌ Tidak ditemukan di server/certs/espay-private.pem' }}
                </span>
              </div>
              <div class="env-row">
                <span class="env-k">Status Public Key:</span>
                <span class="env-v" :class="envInfo?.hasPublicKey ? 'text-green' : 'text-muted'">
                  {{ envInfo?.hasPublicKey ? '✅ Terpasang (server/certs/espay-public.pub)' : '⚠️ Belum dipasang' }}
                </span>
              </div>
              <div class="env-row">
                <span class="env-k">Mode Simulator:</span>
                <span class="env-v text-blue">
                  {{ envInfo?.activeMode || 'Direct API Sandbox (disableFallback: true)' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAMPILAN E-TICKET RESMI SETELAH LUNAS (Identik dengan pages/tiket/[id].vue) -->
      <div v-else-if="currentStep === 'sukses'" class="step-content active step-padded success-view">
        <!-- Banner Sukses -->
        <div class="success-alert-badge">
          <div class="success-icon-circle">
            <svg class="check-svg" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <div>
            <h3>Pembayaran Berhasil Terverifikasi!</h3>
            <p>E-Ticket resmi Anda telah terbit dan siap digunakan di lokasi acara.</p>
          </div>
        </div>

        <!-- Kartu Boarding Pass Tiket Asli -->
        <div class="ticket-card-wrapper">
          <div class="ticket-card">
            <!-- Header Kartu -->
            <div class="ticket-header">
              <div class="ticket-category">REGULAR PRESALE</div>
              <div class="ticket-label">
                <svg class="label-check" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                LUNAS
              </div>
            </div>

            <!-- Sobekan Melengkung Tiket -->
            <div class="ticket-divider">
              <div class="dash"></div>
            </div>

            <!-- Body Utama Tiket -->
            <div class="ticket-body">
              <div class="ticket-details">
                <div class="detail-box">
                  <span class="detail-label">NAMA PESERTA</span>
                  <span class="detail-value nama">{{ dummyUser.name }}</span>
                </div>
                
                <div class="detail-row">
                  <div class="detail-box">
                    <span class="detail-label">EVENT</span>
                    <span class="detail-value event">{{ dummyEventData.nama_event }}</span>
                  </div>
                  <div class="detail-box text-right">
                    <span class="detail-label">TANGGAL</span>
                    <span class="detail-value date">{{ formattedToday }}</span>
                  </div>
                </div>

                <div class="detail-row mt-2">
                  <div class="detail-box">
                    <span class="detail-label">METODE BAYAR</span>
                    <span class="detail-value uppercase">{{ lastPaidData?.payment_type === 'qris' ? 'QRIS NASIONAL' : (lastPaidData?.bank_name || 'VIRTUAL ACCOUNT') }}</span>
                  </div>
                  <div class="detail-box text-right">
                    <span class="detail-label">TOTAL DIBAYAR</span>
                    <span class="detail-value text-green">Rp {{ formatPrice(lastPaidData?.total_amount || 0) }}</span>
                  </div>
                </div>
              </div>

              <!-- Barcode / QR Section -->
              <div class="ticket-qr-section">
                <div class="qr-box">
                  <img v-if="ticketQrUrl" :src="ticketQrUrl" alt="QR E-Ticket" />
                  <div v-else class="qr-loading">Membuat Barcode...</div>
                </div>
                <div class="ticket-id">{{ transactionIdGlobal }}</div>
                <small class="ticket-note">Tunjukkan kode QR ini ke petugas saat masuk</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Tombol Aksi Ulangi Pengujian -->
        <div class="action-buttons-box">
          <button @click="handleResetPayment" class="btn-repeat-test">
            <svg class="btn-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            <span>Uji Coba Transaksi Lain (Reset)</span>
          </button>
          <NuxtLink to="/s1u2p3e4r5" class="btn-back-master">
            Kembali ke Ruang Master
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- PRINTER OVERLAY & ANIMATION (Komponen Asli Tyket!) -->
    <TicketPrinterOverlay 
      :isSubmitting="false"
      :isPrinting="isPrinting"
      :eventData="dummyEventData"
      :daftarPeserta="daftarPeserta"
      :transactionId="transactionIdGlobal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import QRCode from 'qrcode'
import CheckoutPayment from '~/components/event/CheckoutPayment.vue'
import TicketPrinterOverlay from '~/components/event/TicketPrinterOverlay.vue'

// Data Peserta Otomatis (Tanpa Isi Form)
const dummyUser = {
  name: 'Budi Santoso',
  email: 'tester@tyket.id',
  phone: '081234567890'
}

// Konfigurasi Event Dummy Sandbox
const dummyEventData = {
  id: 999999,
  nama_event: 'Festival Musik Tyket 2026',
  tanggal_mulai: new Date().toISOString(),
  waktu_mulai: '19:00:00',
  lokasi: 'Jakarta Convention Center (JCC)',
  deskripsi: 'Simulasi alur transaksi tiket resmi Tyket.id dengan payment gateway Espay Sandbox.',
  poster_url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=80',
  settings: {
    is_espay_active: true,
    is_qr_active: true,
    espay_methods: {
      qris: true,
      va_mandiri: true,
      va_bri: true,
      va_bni: true
    }
  }
}

// Peserta Format Array untuk CheckoutPayment
const daftarPeserta = computed(() => [
  {
    namaAnak: dummyUser.name,
    nama_lengkap: dummyUser.name,
    email: dummyUser.email,
    hp: dummyUser.phone,
    no_wa: dummyUser.phone,
    namaTiket: 'Tiket Regular Presale',
    tiketId: 1,
    jawaban: {
      nama_lengkap: dummyUser.name,
      email: dummyUser.email,
      no_wa: dummyUser.phone
    }
  }
])

// State Alur
const currentStep = ref<'bayar' | 'sukses'>('bayar')
const ticketAmount = ref(10000)
const grandTotalCalculated = computed(() => ticketAmount.value + 2000)

const activePaymentResult = ref<any>(null)
const transactionIdGlobal = ref('')
const lastPaidData = ref<any>(null)
const ticketQrUrl = ref('')

// Audio & Printing State
const isPrinting = ref(false)
const printAudio = ref<HTMLAudioElement | null>(null)

// Toast State
const toastMessage = ref('')
const toastType = ref<'success' | 'error' | 'info'>('info')
let toastTimer: any = null

// State Debug Log Respon Gateway Espay
const logStatus = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const logData = ref<any>(null)
const activeTab = ref<'summary' | 'raw' | 'signature' | 'env'>('summary')
const selectedMerchant = ref('SGWZULKARNAENALMUHAMMADY')
const copied = ref(false)
const envInfo = ref<any>(null)

const currentOrigin = computed(() => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return 'http://localhost:3000'
})

function copyText(val: string) {
  if (!val) return
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(val)
    showToastMsg('URL Callback berhasil disalin ke clipboard!', 'success')
  }
}

onMounted(async () => {
  try {
    envInfo.value = await $fetch('/api/simulasi-info')
    if (envInfo.value?.commCode) {
      selectedMerchant.value = envInfo.value.commCode
    }
  } catch (e) {
    console.warn('[Espay Testing] Gagal memuat info konfigurasi:', e)
  }
})

const formattedToday = computed(() => {
  return new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
})

function formatPrice(val: number): string {
  return (val || 0).toLocaleString('id-ID')
}

function formatJson(val: any): string {
  if (!val) return ''
  try {
    return JSON.stringify(val, null, 2)
  } catch (e) {
    return String(val)
  }
}

function showToastMsg(msg: string, type: 'success' | 'error' | 'info' = 'info') {
  toastMessage.value = msg
  toastType.value = type
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

function getErrorDiagnosis(log: any) {
  if (!log) return null
  const code = String(log?.responseCode || log?.httpStatus || '')
  const msg = String(log?.message || log?.debug?.responseMessage || '').toLowerCase()
  const raw = JSON.stringify(log?.debug || {}).toLowerCase()

  if (msg.includes('private key') || raw.includes('private key')) {
    return {
      title: 'Private Key RSA Tidak Ditemukan',
      description: 'Server gagal membaca private key untuk membuat signature SNAP BI.',
      fix: 'Pastikan file server/certs/espay-private.pem ada dan berformat RSA Private Key valid.'
    }
  }

  if (code.includes('0031') || msg.includes('komunikasi dengan mitra') || raw.includes('0031')) {
    return {
      title: 'Handshake Webhook Callback Inquiry Timeout (Error 0031)',
      description: 'Request Send Invoice & Signature Anda sudah 100% SUKSES dan DITERIMA oleh Espay! Namun server Espay gagal menghubungi Webhook Callback Inquiry merchant Anda dalam 10 detik.',
      fix: 'Espay mewajibkan URL Callback Inquiry yang terdaftar di portal merchant aktif dan dapat diakses dari internet publik. Pastikan URL Callback Inquiry di portal merchant Espay mengarah ke domain publik yang aktif (misal dev.tyket.id atau via tunnel ngrok).'
    }
  }

  if (code.includes('0004') || msg.includes('format input salah') || msg.includes('remark')) {
    return {
      title: 'Format Input Parameter Tidak Sesuai (Error 0004)',
      description: log?.message || 'Espay menolak format salah satu parameter input (misal Remark 2 / Nama).',
      fix: 'Sesuai aturan Espay: Remark 2 (Nama) WAJIB berupa karakter Alfanumerik dan Spasi saja (maksimal 30 karakter, tanpa tanda kurung atau simbol spesial). Order ID harus alfanumerik.'
    }
  }

  if (code.includes('IRF') || msg.includes('credential is not valid')) {
    return {
      title: 'Kredensial Tidak Cocok (Error IRF: Credential is not Valid)',
      description: `Target merchant "${log?.merchantId}" tidak cocok dengan Signature Key di .env.`,
      fix: 'Pastikan memilih tombol target merchant "👤 SGWZULKARNAENALMUHAMMADY (Akun .env)" di atas.'
    }
  }

  if (code.includes('401') || msg.includes('unauthorized') || (msg.includes('invalid') && msg.includes('signature'))) {
    return {
      title: 'Signature Asymmetric Ditolak (401 Unauthorized / Invalid Signature)',
      description: 'Signature SHA256withRSA ditolak oleh server Espay Sandbox.',
      fix: '1. Jika Anda menguji akun merchant pribadi, pastikan file server/certs/espay-public.pub sudah diunggah ke portal Sandbox Espay.\n2. Coba klik tombol "🏢 SGWYESSISHOP (Sample Sandbox Docs)" di atas: sample merchant ini sudah otomatis dihubungkan oleh Espay dengan sample private key di dokumentasi.'
    }
  }

  if (code.startsWith('4') || msg.includes('bad request') || msg.includes('invalid') || raw.includes('invalid')) {
    return {
      title: 'Format Parameter Tidak Sesuai (Bad Request)',
      description: 'Server Espay menolak salah satu parameter dalam payload body request.',
      fix: 'Buka tab "Asymmetric Signature & Request" atau "Raw JSON" di bawah untuk melihat request parameter.'
    }
  }

  return {
    title: 'Gagal Memproses Transaksi Espay',
    description: log?.message || 'Gateway Espay mengembalikan status error.',
    fix: 'Buka tab "Asymmetric Signature & Request" atau "Raw JSON" di bawah untuk melihat detail respon dan parameter request.'
  }
}

const errorDiagnosis = computed(() => getErrorDiagnosis(logData.value))

async function copyLogJson() {
  if (!logData.value) return
  try {
    const text = JSON.stringify(logData.value, null, 2)
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
    showToastMsg('Log JSON berhasil disalin ke clipboard!', 'success')
  } catch (e) {
    showToastMsg('Gagal menyalin log JSON ke clipboard.', 'error')
  }
}

function clearLog() {
  logStatus.value = 'idle'
  logData.value = null
  activeTab.value = 'summary'
}

function triggerDirectTest(method = 'qris') {
  handleRequestEspay({ paymentMethod: method })
}

// ─────────────────────────────────────────────
// REQUEST ESPAY DARI CHECKOUTPAYMENT / TOMBOL TRIGGER
// ─────────────────────────────────────────────
async function handleRequestEspay({ paymentMethod = 'qris', onSuccess, onError }: any = {}) {
  logStatus.value = 'loading'
  const isVa = paymentMethod.startsWith('va')
  const methodLabel = isVa ? 'Virtual Account' : 'QRIS'
  logData.value = {
    timestamp: new Date().toLocaleTimeString('id-ID'),
    method: paymentMethod,
    merchantId: selectedMerchant.value,
    message: `Mengirim request ${methodLabel} ke Espay Sandbox (${selectedMerchant.value})...`,
    debug: null
  }

  try {
    const res = await $fetch<any>('/api/simulasi-create', {
      method: 'POST',
      body: {
        method: paymentMethod,
        amount: ticketAmount.value,
        merchantId: selectedMerchant.value,
        customerName: dummyUser.name,
        customerEmail: dummyUser.email,
        customerPhone: dummyUser.phone
      }
    })

    const isSuccess = Boolean(
      res && (
        res.status === 'success' ||
        res.va_number ||
        res.debug?.errorCode === '0000' ||
        res.debug?.responseCode === '0000'
      )
    )

    if (isSuccess) {
      logStatus.value = 'success'
      logData.value = {
        timestamp: new Date().toLocaleTimeString('id-ID'),
        method: paymentMethod,
        merchantId: selectedMerchant.value,
        httpStatus: 200,
        responseCode: res.debug?.responseCode || res.debug?.errorCode || '0000',
        message: `${methodLabel} Berhasil Diterbitkan dari Espay Sandbox!`,
        orderId: res.order_id,
        raw: res,
        debug: res.debug
      }
      activePaymentResult.value = res
      transactionIdGlobal.value = res.order_id
      if (onSuccess) onSuccess(res)
      showToastMsg(`${methodLabel} berhasil diterbitkan dari Espay Sandbox!`, 'success')
    } else {
      logStatus.value = 'error'
      logData.value = {
        timestamp: new Date().toLocaleTimeString('id-ID'),
        method: paymentMethod,
        merchantId: selectedMerchant.value,
        httpStatus: res?.debug?.httpStatus || 400,
        responseCode: res?.debug?.responseCode || res?.debug?.errorCode || 'ERROR',
        message: res?.message || `Gagal menerbitkan ${methodLabel} dari Espay.`,
        raw: res,
        debug: res?.debug
      }
      if (onError) onError(res)
      showToastMsg(res?.message || `Gagal menerbitkan ${methodLabel} dari Espay.`, 'error')
    }
  } catch (err: any) {
    const errData = err?.data || {}
    logStatus.value = 'error'
    logData.value = {
      timestamp: new Date().toLocaleTimeString('id-ID'),
      method: paymentMethod,
      merchantId: selectedMerchant.value,
      httpStatus: err.statusCode || errData?.debug?.httpStatus || 500,
      responseCode: errData?.debug?.responseCode || 'CONN_ERROR',
      message: errData.message || err.message || 'Koneksi ke gateway Espay gagal.',
      raw: errData || err.message,
      debug: errData.debug || null
    }
    if (onError) onError(err)
    showToastMsg(errData.message || err.message || 'Terjadi kesalahan sistem saat menghubungi gateway.', 'error')
  } finally {
    if (typeof window !== 'undefined') {
      nextTick(() => {
        const el = document.getElementById('debug-log-card')
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
      })
    }
  }
}

// ─────────────────────────────────────────────
// SAAT PEMBAYARAN SUKSES / SIMULASI SELESAI
// ─────────────────────────────────────────────
async function handlePaymentSuccess(orderId: string) {
  transactionIdGlobal.value = orderId
  lastPaidData.value = { ...activePaymentResult.value }

  // Buat QR Code untuk E-Ticket
  try {
    ticketQrUrl.value = await QRCode.toDataURL(`TKT-${orderId}`, { width: 300, margin: 1 })
  } catch (e) {}

  // Mainkan efek suara printer tiket
  if (printAudio.value) {
    try {
      printAudio.value.currentTime = 0
      printAudio.value.play().catch(() => {})
    } catch (e) {}
  }

  // Aktifkan animasi TicketPrinterOverlay
  isPrinting.value = true
  await new Promise(resolve => setTimeout(resolve, 3500))
  isPrinting.value = false

  // Tampilkan layar sukses
  currentStep.value = 'sukses'
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const isSimulatingPay = ref(false)

async function triggerSimulatePayment() {
  const orderId = activePaymentResult.value?.order_id
  if (!orderId || isSimulatingPay.value) return
  isSimulatingPay.value = true
  try {
    showToastMsg('Memproses simulasi pembayaran berhasil...', 'info')
    const res: any = await $fetch(`/api/check-espay?order_id=${encodeURIComponent(orderId)}&simulate_pay=true`)
    if (res && res.status === 'paid') {
      showToastMsg('Pembayaran terverifikasi! Memproses tiket...', 'success')
      // Tunggu sebentar lalu panggil handlePaymentSuccess jika komponen checkout belum emit
      setTimeout(() => {
        if (currentStep.value !== 'sukses') {
          handlePaymentSuccess(orderId)
        }
      }, 600)
    }
  } catch (err: any) {
    showToastMsg('Gagal memproses simulasi: ' + (err.message || 'Error'), 'error')
  } finally {
    isSimulatingPay.value = false
  }
}

// ─────────────────────────────────────────────
// RESET PENGUJIAN
// ─────────────────────────────────────────────
function handleResetPayment() {
  activePaymentResult.value = null
  transactionIdGlobal.value = ''
  ticketQrUrl.value = ''
  isPrinting.value = false
  currentStep.value = 'bayar'
  showToastMsg('Simulator siap untuk pengujian baru.', 'success')
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<style scoped>
.simulation-page {
  min-height: 100vh;
  background: var(--bg-light, #F6F8FA);
  padding: 0 0 40px 0;
  color: var(--text-main, #123860);
  font-family: 'Poppins', sans-serif;
}

/* TOPBAR */
.simulator-topbar {
  background: white;
  border-bottom: 1px solid var(--border-soft, #DDE4EC);
  position: sticky;
  top: 0;
  z-index: 40;
  box-shadow: 0 2px 8px rgba(18, 56, 96, 0.04);
}
.topbar-inner {
  max-width: 600px;
  margin: 0 auto;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.topbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.brand-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}
.brand-logo {
  width: 32px;
  height: 32px;
  background: var(--primary, #123860);
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 14px;
}
.brand-text {
  display: flex;
  flex-direction: column;
}
.brand-title {
  font-size: 14px;
  font-weight: 800;
  color: var(--primary, #123860);
  line-height: 1.1;
}
.brand-sub {
  font-size: 10px;
  color: var(--text-muted, #5C738A);
  font-weight: 500;
}
.topbar-separator {
  width: 1px;
  height: 16px;
  background: var(--border-soft, #DDE4EC);
}
.sandbox-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
}
.pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 6px #10b981;
}
.btn-master-link {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted, #5C738A);
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid var(--border-soft, #DDE4EC);
  background: #ffffff;
  transition: 0.2s;
}
.btn-master-link:hover {
  background: #f1f5f9;
  color: var(--primary, #123860);
}

/* MOBILE FRAME CONTAINER (IDENTIK DENGAN [slug].vue) */
.container { 
  width: 100%; 
  max-width: 480px; 
  background: var(--card-light, #FFFFFF); 
  box-shadow: 0 20px 40px rgba(0,0,0,0.08); 
  border: 1px solid var(--border-soft, #DDE4EC); 
  border-radius: 24px; 
  overflow: hidden; 
  position: relative; 
  margin: 24px auto 40px auto;
  min-height: calc(100vh - 120px);
}
.step-padded { padding: 12px 15px; }

@media (max-width: 480px) {
  .container {
    margin: 0 auto;
    border-radius: 0;
    border: none;
    box-shadow: none;
    min-height: calc(100vh - 56px);
  }
}

/* EVENT BANNER */
.sim-event-banner {
  border-bottom: 1px solid var(--border-soft, #DDE4EC);
  background: #ffffff;
}
.sim-event-media {
  position: relative;
  width: 100%;
  height: 170px;
  overflow: hidden;
}
.sim-poster-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.sim-badge-overlay {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(18, 56, 96, 0.85);
  backdrop-filter: blur(4px);
  color: var(--accent-yellow, #FCEB9C);
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.5px;
}
.sim-event-meta {
  padding: 16px 18px 14px 18px;
}
.sim-tag {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--accent-main, #1C5490);
  background: #eff6ff;
  padding: 3px 8px;
  border-radius: 6px;
  letter-spacing: 0.5px;
}
.sim-title {
  margin: 6px 0 2px 0;
  font-size: 18px;
  font-weight: 800;
  color: var(--primary, #123860);
  line-height: 1.25;
}
.sim-loc {
  margin: 0;
  font-size: 12px;
  color: var(--text-muted, #5C738A);
}

/* KARTU PRESET & DATA OTOMATIS */
.sim-config-card {
  margin: 14px 15px 0 15px;
  padding: 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.auto-user-box {
  display: flex;
  align-items: center;
  gap: 10px;
}
.auto-user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--primary, #123860);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 12px;
  flex-shrink: 0;
}
.auto-user-info {
  flex: 1;
  min-width: 0;
}
.auto-user-name {
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 6px;
}
.auto-badge {
  font-size: 9px;
  font-weight: 800;
  background: #dcfce7;
  color: #15803d;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
}
.auto-user-meta {
  font-size: 11px;
  color: #64748b;
  margin-top: 1px;
}

.nominal-preset-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 10px;
  border-top: 1px dashed #cbd5e1;
}
.preset-label {
  display: flex;
  justify-content: space-between;
  font-size: 11.5px;
  color: #475569;
}
.preset-label strong {
  color: var(--primary, #123860);
  font-weight: 800;
}
.preset-buttons-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}
.preset-btn {
  padding: 7px 4px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  border: 1px solid #cbd5e1;
  background: white;
  color: #334155;
  cursor: pointer;
  transition: 0.15s;
}
.preset-btn.active {
  background: var(--primary, #123860);
  color: var(--accent-yellow, #FCEB9C);
  border-color: var(--primary, #123860);
  box-shadow: 0 2px 6px rgba(18, 56, 96, 0.2);
}

/* SUCCESS VIEW & TICKET CARD */
.success-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 20px;
}
.success-alert-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 16px;
  color: #065f46;
}
.success-icon-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #10b981;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
}
.check-svg { width: 20px; height: 20px; }
.success-alert-badge h3 { margin: 0 0 2px 0; font-size: 13.5px; font-weight: 800; }
.success-alert-badge p { margin: 0; font-size: 11px; color: #047857; line-height: 1.35; }

/* BOARDING PASS TICKET CARD (Persis dengan tiket/[id].vue) */
.ticket-card-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}
.ticket-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 380px;
  margin: 0 auto;
  position: relative;
  filter: drop-shadow(0 15px 35px rgba(0,0,0,0.08));
  box-sizing: border-box;
}
.ticket-header {
  background: linear-gradient(135deg, var(--primary, #123860), var(--primary-hover, #1C5490));
  color: white;
  padding: 18px 20px;
  border-radius: 20px 20px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.ticket-category {
  font-weight: 900;
  font-size: 1.25rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}
.ticket-label {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 1.5px;
  background: #10b981;
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.label-check { width: 12px; height: 12px; }

.ticket-divider {
  height: 0;
  background: white;
  position: relative;
}
.ticket-divider .dash {
  position: absolute;
  left: 20px;
  right: 20px;
  top: 0;
  border-top: 2px dashed #CBD5E1;
  z-index: 10;
}
.ticket-divider::before, .ticket-divider::after {
  content: '';
  position: absolute;
  top: -12px;
  width: 24px;
  height: 24px;
  background: var(--bg-light, #F6F8FA);
  border-radius: 50%;
  z-index: 5;
}
.ticket-divider::before { left: -12px; box-shadow: inset -3px 0 8px rgba(0,0,0,0.03); }
.ticket-divider::after { right: -12px; box-shadow: inset 3px 0 8px rgba(0,0,0,0.03); }

.ticket-body {
  background: white;
  padding: 20px 20px 24px;
  border-radius: 0 0 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.ticket-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.detail-box { display: flex; flex-direction: column; }
.detail-row { display: flex; justify-content: space-between; align-items: flex-start; }
.detail-label { font-size: 0.65rem; font-weight: 800; color: var(--text-muted, #5C738A); letter-spacing: 1px; margin-bottom: 2px; }
.detail-value { font-weight: 800; color: var(--text-main, #123860); font-size: 0.95rem; }
.detail-value.nama { font-size: 1.1rem; color: #0f172a; }
.detail-value.event { font-size: 0.9rem; }
.detail-value.date { font-size: 0.85rem; }
.text-right { text-align: right; }
.text-green { color: #16a34a; }
.uppercase { text-transform: uppercase; }
.mt-2 { margin-top: 8px; }

.ticket-qr-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding-top: 14px;
  border-top: 1px dashed #E2E8F0;
}
.qr-box {
  background: white;
  padding: 10px;
  border-radius: 14px;
  border: 1px solid #E2E8F0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}
.qr-box img {
  width: 150px;
  height: 150px;
  display: block;
}
.qr-loading {
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #94a3b8;
}
.ticket-id {
  font-family: monospace;
  font-weight: 800;
  font-size: 13px;
  letter-spacing: 1.5px;
  color: #334155;
}
.ticket-note {
  font-size: 10.5px;
  color: #94a3b8;
  text-align: center;
}

/* ACTION BUTTONS */
.action-buttons-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.btn-repeat-test {
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  background: var(--primary, #123860);
  color: var(--accent-yellow, #FCEB9C);
  border: none;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 14px rgba(18, 56, 96, 0.25);
  transition: 0.2s;
}
.btn-repeat-test:hover {
  background: var(--primary-hover, #1C5490);
  transform: translateY(-1px);
}
.btn-icon { width: 16px; height: 16px; }
.btn-back-master {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  background: white;
  color: #475569;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
  transition: 0.15s;
}
.btn-back-master:hover {
  background: #f8fafc;
  color: var(--primary, #123860);
}

/* TOAST */
.toast-message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  padding: 12px 24px;
  border-radius: 30px;
  font-weight: 600;
  font-size: 13px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  animation: slideDown 0.3s ease-out;
  color: #fff;
}
.toast-success { background: #16a34a; }
.toast-error { background: #dc2626; }
.toast-info { background: #1e3a8a; }

@keyframes slideDown {
  from { transform: translate(-50%, -20px); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
}

/* ======================================================== */
/* DEBUG CONSOLE LOG STYLES (Realtime Espay Sandbox)        */
/* ======================================================== */
.debug-console-card {
  margin-top: 20px;
  background: #0b132b;
  border-radius: 18px;
  border: 1.5px solid #1c2541;
  box-shadow: 0 10px 30px rgba(11, 19, 43, 0.18);
  padding: 16px;
  color: #f1f5f9;
  transition: all 0.3s ease;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.debug-console-card.status-loading {
  border-color: #f59e0b;
  box-shadow: 0 0 16px rgba(245, 158, 11, 0.2);
}
.debug-console-card.status-success {
  border-color: #10b981;
  box-shadow: 0 0 16px rgba(16, 185, 129, 0.2);
}
.debug-console-card.status-error {
  border-color: #ef4444;
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.25);
}

.console-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.console-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}
.console-pulse {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.pulse-idle { background: #64748b; }
.pulse-loading {
  background: #f59e0b;
  box-shadow: 0 0 8px #f59e0b;
  animation: pulse-anim 1s infinite alternate;
}
.pulse-success {
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
}
.pulse-error {
  background: #ef4444;
  box-shadow: 0 0 8px #ef4444;
}

@keyframes pulse-anim {
  from { opacity: 0.4; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1.2); }
}

.console-title-texts {
  display: flex;
  flex-direction: column;
}
.console-title {
  font-size: 13.5px;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  line-height: 1.2;
}
.console-subtitle {
  font-size: 10.5px;
  color: #94a3b8;
  margin-top: 2px;
}

.console-status-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  white-space: nowrap;
}
.badge-idle {
  background: #1c2541;
  color: #94a3b8;
  border: 1px solid #3a506b;
}
.badge-loading {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.4);
}
.badge-success {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.4);
}
.badge-error {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.4);
}

.console-actions-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin: 12px 0;
  gap: 8px;
}
.actions-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.action-meta-tag, .action-time-tag {
  font-size: 11px;
  color: #94a3b8;
}
.action-meta-tag strong {
  color: #38bdf8;
}
.actions-right {
  display: flex;
  align-items: center;
  gap: 6px;
}
.btn-console-tool {
  background: #1c2541;
  color: #e2e8f0;
  border: 1px solid #3a506b;
  font-size: 11px;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.15s;
}
.btn-console-tool:hover {
  background: #3a506b;
  color: white;
}
.btn-tool-clear {
  color: #f87171;
  border-color: rgba(239, 68, 68, 0.3);
}
.btn-tool-clear:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
}

/* MERCHANT SWITCHER */
.merchant-switch-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: rgba(28, 37, 65, 0.4);
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 12px;
}
.m-switch-label {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
}
.m-switch-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.btn-m-switch {
  flex: 1;
  min-width: 140px;
  padding: 8px 10px;
  border-radius: 8px;
  background: #1c2541;
  border: 1px solid #3a506b;
  color: #cbd5e1;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  text-align: left;
  transition: 0.15s;
}
.btn-m-switch small {
  display: block;
  font-size: 9.5px;
  font-weight: 400;
  color: #94a3b8;
  margin-top: 2px;
}
.btn-m-switch:hover {
  background: #253258;
  color: #fff;
}
.btn-m-switch.active {
  background: rgba(56, 189, 248, 0.15);
  border-color: #38bdf8;
  color: #38bdf8;
}
.btn-m-switch.active small {
  color: #7dd3fc;
}

/* DIAGNOSIS BANNER */
.diagnosis-banner {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.35);
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 14px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
}
.diagnosis-icon-wrap {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.diag-svg {
  width: 18px;
  height: 18px;
}
.diagnosis-body {
  flex: 1;
}
.diagnosis-title {
  font-size: 12.5px;
  font-weight: 800;
  color: #fca5a5;
  margin-bottom: 4px;
}
.diagnosis-desc {
  font-size: 11px;
  color: #fecaca;
  line-height: 1.4;
  margin: 0;
}
.diagnosis-fix-box {
  background: rgba(0, 0, 0, 0.35);
  border-radius: 8px;
  padding: 8px 10px;
  margin-top: 8px;
  border-left: 3px solid #f59e0b;
}
.fix-label {
  font-size: 10.5px;
  font-weight: 800;
  color: #fde047;
  display: block;
  margin-bottom: 3px;
}
.fix-text {
  font-size: 11px;
  color: #e2e8f0;
  line-height: 1.45;
  margin: 0;
  white-space: pre-line;
}

/* TABS NAVIGATION */
.console-tabs-nav {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 8px;
  scrollbar-width: none;
}
.console-tabs-nav::-webkit-scrollbar {
  display: none;
}
.console-tab-btn {
  background: #1c2541;
  color: #94a3b8;
  font-size: 11px;
  font-weight: 600;
  padding: 6px 11px;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: 0.15s;
}
.console-tab-btn:hover {
  color: #f1f5f9;
  background: #253258;
}
.console-tab-btn.active {
  background: #38bdf8;
  color: #020617;
  font-weight: 800;
  box-shadow: 0 2px 8px rgba(56, 189, 248, 0.3);
}

.console-panel {
  margin-top: 10px;
}

/* EMPTY STATE */
.console-empty-state {
  text-align: center;
  padding: 24px 12px;
  background: rgba(28, 37, 65, 0.4);
  border-radius: 12px;
  border: 1px dashed #3a506b;
}
.empty-icon {
  font-size: 28px;
  margin-bottom: 6px;
}
.empty-title {
  font-size: 13px;
  font-weight: 800;
  color: #e2e8f0;
  margin-bottom: 4px;
}
.empty-desc {
  font-size: 11px;
  color: #94a3b8;
  line-height: 1.5;
  max-width: 380px;
  margin: 0 auto 12px auto;
}
.btn-trigger-quick {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  border: none;
  padding: 9px 16px;
  border-radius: 10px;
  font-size: 11.5px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  transition: 0.2s;
}
.btn-trigger-quick:hover {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  transform: translateY(-1px);
}

/* SUMMARY GRID */
.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.summary-item {
  background: #1c2541;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.summary-item.full-width {
  grid-column: span 2;
}
.s-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #94a3b8;
}
.s-value {
  font-size: 12px;
  color: #f8fafc;
}
.text-red { color: #f87171 !important; }
.code-pill {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 11px;
  font-weight: 700;
  width: fit-content;
}
.code-error {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
}
.code-success {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

/* CODE & JSON BLOCKS */
.json-code-block {
  background: #020617;
  border: 1px solid #1c2541;
  border-radius: 10px;
  padding: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 11px;
  line-height: 1.5;
  color: #38bdf8;
  overflow-x: auto;
  max-height: 300px;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
}
.json-code-block.single-line {
  white-space: nowrap;
  max-height: none;
}
.json-code-block.border-green {
  border-color: #10b981;
}
.json-code-block.border-red {
  border-color: #ef4444;
}

.no-step-data {
  padding: 20px;
  text-align: center;
  font-size: 11px;
  color: #94a3b8;
  background: #1c2541;
  border-radius: 10px;
}

.step-detail-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.step-meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.step-badge {
  background: #16a34a;
  color: white;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}
.step-url {
  font-family: monospace;
  font-size: 11px;
  color: #cbd5e1;
  word-break: break-all;
}
.step-subhead {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  color: #94a3b8;
  margin-top: 6px;
}

/* ENV CONFIG INFO */
.env-info-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.env-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1c2541;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 11px;
}
.env-k {
  color: #94a3b8;
  font-weight: 600;
}
.env-v {
  color: #f8fafc;
  font-weight: 500;
  text-align: right;
  word-break: break-all;
}
.text-blue { color: #38bdf8; }

/* PERBANDINGAN SAMPLE DOCS VS ACTUAL SENT */
.compare-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 4px;
}
@media (max-width: 640px) {
  .compare-grid {
    grid-template-columns: 1fr;
  }
}
.compare-col {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.compare-title {
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 4px;
}
.compare-title.title-sample {
  color: #fbbf24;
}
.compare-title.title-actual {
  color: #38bdf8;
}
.border-sample {
  border-color: rgba(245, 158, 11, 0.45) !important;
  background: rgba(245, 158, 11, 0.03) !important;
}
.border-actual {
  border-color: rgba(56, 189, 248, 0.45) !important;
  background: rgba(56, 189, 248, 0.03) !important;
}

/* WEBHOOK INFO & CALLBACK STYLES */
.highlight-callback {
  background: rgba(245, 158, 11, 0.08) !important;
  border-color: rgba(245, 158, 11, 0.3) !important;
}
.callback-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.btn-copy-cb {
  background: rgba(245, 158, 11, 0.2);
  border: 1px solid rgba(245, 158, 11, 0.4);
  color: #fbbf24;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.15s;
}
.btn-copy-cb:hover {
  background: rgba(245, 158, 11, 0.35);
  color: #fff;
}
.btn-copy-cb-sm {
  background: rgba(56, 189, 248, 0.15);
  border: 1px solid rgba(56, 189, 248, 0.35);
  color: #38bdf8;
  font-size: 9.5px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  cursor: pointer;
}
.btn-copy-cb-sm:hover {
  background: rgba(56, 189, 248, 0.3);
  color: #fff;
}
.text-amber { color: #fbbf24 !important; }
.text-green { color: #34d399 !important; }
.text-muted { color: #94a3b8 !important; }
.s-subtext {
  font-size: 10px;
  color: #94a3b8;
  margin-top: 4px;
  line-height: 1.4;
}
.s-subtext code {
  color: #fbbf24;
  background: rgba(0, 0, 0, 0.3);
  padding: 1px 4px;
  border-radius: 3px;
}
.webhook-info-box {
  background: #020617;
  border: 1px solid #1c2541;
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.webhook-row {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.webhook-k {
  font-size: 10px;
  font-weight: 600;
  color: #94a3b8;
}
.webhook-val-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.webhook-v {
  font-size: 11px;
  word-break: break-all;
}
.webhook-note {
  font-size: 10.5px;
  color: #cbd5e1;
  background: rgba(245, 158, 11, 0.08);
  border-left: 3px solid #f59e0b;
  padding: 7px 10px;
  border-radius: 0 6px 6px 0;
  margin-top: 4px;
  line-height: 1.4;
}
.webhook-note code {
  color: #fbbf24;
  background: rgba(0, 0, 0, 0.4);
  padding: 1px 4px;
  border-radius: 3px;
}

/* SIMULATION SANDBOX PAY BOX */
.sim-sandbox-pay-box {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border: 1.5px solid #38bdf8;
  box-shadow: 0 10px 25px -5px rgba(56, 189, 248, 0.15), 0 8px 10px -6px rgba(56, 189, 248, 0.1);
  border-radius: 16px;
  padding: 18px 20px;
  margin: 16px 0 24px 0;
  color: #ffffff;
  position: relative;
  overflow: hidden;
}
.sim-pay-badge-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
}
.badge-sandbox-mode {
  background: rgba(56, 189, 248, 0.2);
  color: #38bdf8;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.5px;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid rgba(56, 189, 248, 0.4);
}
.sim-order-id-tag {
  font-size: 11px;
  color: #94a3b8;
  font-family: monospace;
}
.sim-order-id-tag strong {
  color: #e2e8f0;
}
.sim-pay-title {
  font-size: 16px;
  font-weight: 800;
  color: #f8fafc;
  margin: 0 0 4px 0;
}
.sim-pay-desc {
  font-size: 12.5px;
  color: #94a3b8;
  margin: 0 0 14px 0;
  line-height: 1.4;
}
.sim-pay-btn-row {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}
.btn-trigger-pay {
  width: 100%;
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 12px 18px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35);
}
.btn-trigger-pay:hover:not(:disabled) {
  background: linear-gradient(135deg, #0369a1 0%, #075985 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(2, 132, 199, 0.45);
}
.btn-trigger-pay:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.sim-pay-portal-note {
  font-size: 11.5px;
  color: #94a3b8;
  background: rgba(0, 0, 0, 0.25);
  padding: 8px 12px;
  border-radius: 8px;
  line-height: 1.45;
}
.sim-pay-portal-note strong {
  color: #38bdf8;
}
.sim-pay-portal-note a {
  color: #38bdf8;
  text-decoration: underline;
}
</style>
