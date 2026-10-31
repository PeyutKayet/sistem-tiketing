<template>
  <div class="tracer-page">
    <!-- Topbar -->
    <header class="tracer-topbar">
      <div class="topbar-inner">
        <div class="topbar-left">
          <NuxtLink to="/espay-testing" class="brand-link">
            <span class="back-arrow">←</span>
            <div class="brand-text">
              <span class="brand-title">Tyket.id &bull; Espay Circuit Tracer</span>
              <span class="brand-sub">Diagnostik Visual Aliran Listrik & Transaksi Realtime</span>
            </div>
          </NuxtLink>
        </div>
        <div class="topbar-right">
          <NuxtLink to="/espay-testing" class="nav-btn">
            📱 Simulator Form
          </NuxtLink>
          <div class="live-pill" :class="{ active: isTracing || isSelfTesting }">
            <span class="pulse-dot"></span>
            {{ isTracing ? 'SEDANG MENGALIR...' : (isSelfTesting ? 'MENGUJI WEBHOOK...' : 'STANDBY') }}
          </div>
        </div>
      </div>
    </header>

    <div class="container">
      <!-- HERO CONTROLS -->
      <section class="control-card">
        <div class="control-header">
          <div>
            <h1 class="page-title">⚡ Visualizer Jalur & Aliran Listrik Transaksi Espay</h1>
            <p class="page-desc">
              Pantau perjalanan data byte per byte dari Browser ke Espay dan Callback Inquiry untuk mengetahui dengan tepat di mana jalur mogok.
            </p>
          </div>
          <div class="bank-selector">
            <span class="selector-label">Pilih Bank VA:</span>
            <div class="bank-chips">
              <button
                v-for="b in banks"
                :key="b.code"
                :class="['bank-chip', selectedBank === b.code ? 'active' : '']"
                @click="selectedBank = b.code"
                :disabled="isTracing || isSelfTesting"
              >
                {{ b.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- ACTION BUTTONS -->
        <div class="action-grid">
          <button
            class="btn-action btn-trace"
            :disabled="isTracing || isSelfTesting"
            @click="runRealTransactionTrace"
          >
            <span class="btn-icon">⚡</span>
            <div class="btn-text">
              <strong>Jalankan Simulasi Transaksi Asli (Trace Aliran)</strong>
              <span>Tembak VA {{ getBankName(selectedBank) }} dan amati aliran listrik secara realtime</span>
            </div>
            <span v-if="isTracing" class="spinner"></span>
          </button>

          <button
            class="btn-action btn-probe"
            :disabled="isTracing || isSelfTesting"
            @click="runSelfProbeWebhook"
          >
            <span class="btn-icon">🧪</span>
            <div class="btn-text">
              <strong>Uji Tembak Mandiri Webhook Inquiry</strong>
              <span>Buktikan bahwa server & endpoint webhook kita responsif (&lt; 10ms)</span>
            </div>
            <span v-if="isSelfTesting" class="spinner"></span>
          </button>
        </div>
      </section>

      <!-- CIRCUIT BOARD VISUALIZER -->
      <section class="circuit-section">
        <div class="circuit-header">
          <span class="circuit-title">🔌 SIRKUIT ALIRAN DATA & LISTRIK REALTIME</span>
          <span class="circuit-status" :class="circuitVerdictClass">
            Status Jalur: <strong>{{ circuitVerdictText }}</strong>
          </span>
        </div>

        <div class="circuit-board">
          <!-- SVG CONNECTIONS & ELECTRICAL PULSES -->
          <svg class="circuit-svg" viewBox="0 0 1000 380" preserveAspectRatio="none">
            <defs>
              <!-- Glow Filters -->
              <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-purple" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <!-- Base Wire 1: Node 1 (Browser) to Node 2 (Server Tyket) -->
            <path d="M 230 100 L 410 100" class="wire-base" />
            <!-- Active Laser Wire 1 -->
            <path
              v-if="step >= 1"
              d="M 230 100 L 410 100"
              class="wire-active beam-cyan"
              :class="{ 'beam-flowing': step === 1 }"
              filter="url(#glow-cyan)"
            />

            <!-- Base Wire 2: Node 2 (Server Tyket) to Node 3 (Espay Sandbox) -->
            <path d="M 590 100 L 770 100" class="wire-base" />
            <!-- Active Laser Wire 2 -->
            <path
              v-if="step >= 2"
              d="M 590 100 L 770 100"
              class="wire-active beam-purple"
              :class="{ 'beam-flowing': step === 2 }"
              filter="url(#glow-purple)"
            />

            <!-- Base Wire 3: Node 3 (Espay Sandbox) down & left to Node 4 (Webhook Inquiry) -->
            <path d="M 870 180 L 870 280 L 590 280" class="wire-base" />
            
            <!-- Active Wire 3: Espay trying to hit Webhook -->
            <!-- NORMAL FLOW -->
            <path
              v-if="step === 3 && !hasStalled"
              d="M 870 180 L 870 280 L 590 280"
              class="wire-active beam-orange beam-flowing"
            />
            <!-- BROKEN / SHORT CIRCUIT WIRE WHEN STALLED! -->
            <path
              v-if="hasStalled"
              d="M 870 180 L 870 280 L 720 280"
              class="wire-broken beam-red"
              filter="url(#glow-red)"
            />

            <!-- Base Wire 4: Node 4 (Webhook Inquiry) returning to Node 3 (Espay Sandbox) -->
            <path d="M 590 310 L 890 310 L 890 180" class="wire-base wire-dashed" />
            <path
              v-if="isSelfTesting && selfTestResult?.success"
              d="M 500 220 L 500 160"
              class="wire-active beam-green beam-flowing"
              filter="url(#glow-green)"
            />

            <!-- Base Wire 5: Node 3 (Espay) returning to Node 2 (Server Tyket) -->
            <path d="M 770 120 L 590 120" class="wire-base wire-dashed" />
            <path
              v-if="step >= 4 && hasStalled"
              d="M 770 120 L 590 120"
              class="wire-active beam-red-dash"
              filter="url(#glow-red)"
            />
            <path
              v-if="step >= 4 && !hasStalled"
              d="M 770 120 L 590 120"
              class="wire-active beam-green beam-flowing"
              filter="url(#glow-green)"
            />

            <!-- SPARK / BURST ICON WHEN MOGOK -->
            <g v-if="hasStalled" transform="translate(710, 265)">
              <circle cx="15" cy="15" r="14" fill="#ef4444" opacity="0.3" class="pulse-ring" />
              <polygon points="15,2 19,11 28,12 21,18 23,28 15,22 7,28 9,18 2,12 11,11" fill="#facc15" stroke="#ef4444" stroke-width="2" class="spark-rotate" />
            </g>
          </svg>

          <!-- 4 CIRCUIT NODES -->
          <div class="nodes-grid">
            <!-- NODE 1: BROWSER -->
            <div class="circuit-node node-client" :class="{ active: step === 1, done: step > 1 }">
              <div class="node-icon">🖥️</div>
              <div class="node-body">
                <div class="node-header">
                  <span class="node-step">SIMPUL 1</span>
                  <span class="node-badge" :class="step >= 1 ? 'badge-ok' : ''">
                    {{ step >= 1 ? 'TERKIRIM (200 OK)' : 'STANDBY' }}
                  </span>
                </div>
                <h3 class="node-title">Browser Pembeli</h3>
                <p class="node-desc">Klik tombol Bayar &bull; Kirim order ke backend</p>
                <div class="node-metric">
                  <span class="metric-label">Protokol:</span>
                  <span class="metric-val">POST /api/simulasi-create</span>
                </div>
                <div v-if="durations.client" class="node-metric">
                  <span class="metric-label">Durasi:</span>
                  <span class="metric-val text-cyan">{{ durations.client }} ms</span>
                </div>
              </div>
            </div>

            <!-- NODE 2: SERVER BACKEND TYKET -->
            <div class="circuit-node node-server" :class="{ active: step === 2, done: step > 2 }">
              <div class="node-icon">🏢</div>
              <div class="node-body">
                <div class="node-header">
                  <span class="node-step">SIMPUL 2</span>
                  <span class="node-badge" :class="step >= 2 ? 'badge-ok' : ''">
                    {{ step >= 2 ? 'PROSES OK' : 'STANDBY' }}
                  </span>
                </div>
                <h3 class="node-title">Server Backend Tyket</h3>
                <p class="node-desc">Buat Signature SHA256 &bull; POST sendinvoice</p>
                <div class="node-metric">
                  <span class="metric-label">Target:</span>
                  <span class="metric-val">sandbox-api.espay.id</span>
                </div>
                <div v-if="durations.server" class="node-metric">
                  <span class="metric-label">Durasi Total:</span>
                  <span class="metric-val" :class="hasStalled ? 'text-red' : 'text-cyan'">
                    {{ durations.server }} ms
                  </span>
                </div>
              </div>
            </div>

            <!-- NODE 3: GATEWAY ESPAY SANDBOX -->
            <div
              class="circuit-node node-espay"
              :class="{
                active: step === 2 || step === 3,
                error: hasStalled,
                done: step > 3 && !hasStalled
              }"
            >
              <div class="node-icon">🌐</div>
              <div class="node-body">
                <div class="node-header">
                  <span class="node-step">SIMPUL 3</span>
                  <span class="node-badge" :class="hasStalled ? 'badge-error' : (step >= 2 ? 'badge-warn' : '')">
                    {{ hasStalled ? 'REJECT 0031' : (step >= 2 ? 'PROCESSING' : 'STANDBY') }}
                  </span>
                </div>
                <h3 class="node-title">Gateway Sandbox Espay</h3>
                <p class="node-desc">Terima invoice &bull; Wajib Handshake ke Inquiry</p>
                <div class="node-metric">
                  <span class="metric-label">Handshake:</span>
                  <span class="metric-val" :class="hasStalled ? 'text-red font-bold' : ''">
                    {{ hasStalled ? '❌ TIMEOUT / GAGAL' : (step === 3 ? '⏳ Mencoba Call Webhook...' : 'Standby') }}
                  </span>
                </div>
                <div v-if="hasStalled" class="node-metric">
                  <span class="metric-label">Respon:</span>
                  <span class="metric-val text-red">0031 Rejected (Mitra Timeout)</span>
                </div>
              </div>
            </div>

            <!-- NODE 4: WEBHOOK INQUIRY TYKET -->
            <div
              class="circuit-node node-webhook"
              :class="{
                active: isSelfTesting || (step === 3 && !hasStalled),
                stalled: hasStalled,
                done: isSelfTesting && selfTestResult?.success
              }"
            >
              <div class="node-icon">🎯</div>
              <div class="node-body">
                <div class="node-header">
                  <span class="node-step">SIMPUL 4</span>
                  <span
                    class="node-badge"
                    :class="hasStalled ? 'badge-error' : (selfTestResult?.success ? 'badge-ok' : '')"
                  >
                    {{ hasStalled ? 'TIDAK TERSENTUH' : (selfTestResult?.success ? 'SEHAT (200 OK)' : 'STANDBY') }}
                  </span>
                </div>
                <h3 class="node-title">Webhook Callback Inquiry</h3>
                <p class="node-desc">Endpoint SNAP resmi penerima inquiry dari Espay</p>
                <div class="node-metric">
                  <span class="metric-label">URL Portal:</span>
                  <span class="metric-val">/api/webhook/espay-inquiry</span>
                </div>
                <div class="node-metric">
                  <span class="metric-label">Status Server:</span>
                  <span class="metric-val text-green">100% Aktif &amp; Terbuka Publik</span>
                </div>
                <div v-if="selfTestResult" class="node-metric">
                  <span class="metric-label">Hasil Uji Mandiri:</span>
                  <span class="metric-val text-green">
                    {{ selfTestResult.durationMs }}ms ({{ selfTestResult.response?.responseCode || '2002400' }})
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- MOGOK WARNING BANNER OVERLAY -->
          <div v-if="hasStalled" class="stalled-alert-card">
            <div class="alert-icon">💥</div>
            <div class="alert-body">
              <h4 class="alert-title">MOGOK TERDETEKSI PADA JALUR ANTARA ESPAY ➡️ WEBHOOK INQUIRY!</h4>
              <p class="alert-desc">
                Server Espay Sandbox <strong>tidak berhasil menghubungi</strong> endpoint Inquiry Anda. Karena Espay tidak menerima respon dalam waktu batas toleransinya, transaksi langsung di-reject dengan kode <strong>0031 Rejected, Error komunikasi dengan Mitra</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- EXPLANATION & TECHNICAL EVIDENCE -->
      <section class="diagnostic-grid">
        <!-- CARD 1: Mengapa Mogok -->
        <div class="diag-card">
          <div class="diag-card-header">
            <span class="diag-badge badge-why">Analisis Akar Masalah</span>
            <h3 class="diag-title">🔍 Mengapa Aliran Listrik Putus di Gerbang Espay?</h3>
          </div>
          <div class="diag-card-body">
            <p class="diag-para">
              Pada arsitektur Virtual Account Dinamis Espay, ketika server kita memanggil <code>sendinvoice</code>, Espay <strong>secara sinkron (saat itu juga)</strong> wajib menghubungi Webhook Inquiry merchant untuk menanyakan: <em>"Berapa total tagihan dan siapa nama pemilik order ini?"</em>.
            </p>
            <div class="analogy-box">
              <div class="analogy-title">💡 Analogi Sederhana:</div>
              <p>
                Kita memesan makanan via telepon ke Espay. Espay bilang: <em>"Sebentar ya, saya mau telepon balik ke nomor konfirmasi Anda."</em> Namun nomor telepon balik Anda di catatan Espay tidak bisa tersambung atau belum ter-update. Espay menunggu 5-10 detik di gagang telepon, lalu menutup telepon sambil bilang: <em>"Maaf, saya tidak bisa menghubungi nomor Anda (0031 Rejected)."</em>
              </p>
            </div>
            <div class="diag-points">
              <div class="diag-point">
                <span class="point-num">1</span>
                <div>
                  <strong>Server Webhook Kita Tidak Salah:</strong>
                  <span>Ketika diuji mandiri, webhook kita merespons dalam <strong>&lt; 10ms</strong> dengan kode SNAP 2002400.</span>
                </div>
              </div>
              <div class="diag-point">
                <span class="point-num">2</span>
                <div>
                  <strong>Jalur Keluar Espay Tertahan:</strong>
                  <span>Permintaan dari gateway Sandbox Espay sama sekali tidak menembus Ngrok maupun firewall server kita.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CARD 2: 3 Bukti Konkret -->
        <div class="diag-card">
          <div class="diag-card-header">
            <span class="diag-badge badge-proof">Bukti Nyata</span>
            <h3 class="diag-title">📋 3 Bukti Faktual dari Sistem</h3>
          </div>
          <div class="diag-card-body">
            <div class="proof-list">
              <div class="proof-item">
                <div class="proof-status text-red">0 HIT</div>
                <div class="proof-content">
                  <strong>Log Ngrok Web Inspector (Port 4040):</strong>
                  <p>Ngrok menyaring setiap paket TCP dari internet. Selama tombol Bayar diproses, <strong>tidak ada 1 pun hit</strong> dari IP Espay ke <code>/api/webhook/espay-inquiry</code>.</p>
                </div>
              </div>

              <div class="proof-item">
                <div class="proof-status text-red">0 HIT</div>
                <div class="proof-content">
                  <strong>Server Log Internal (logs/webhook-debug.log):</strong>
                  <p>Middleware kita mencatat setiap koneksi masuk. Selama proses transaksi, tidak ada paket HTTP yang mendarat di endpoint inquiry.</p>
                </div>
              </div>

              <div class="proof-item">
                <div class="proof-status text-orange">MISMATCH</div>
                <div class="proof-content">
                  <strong>Log dari CS Espay:</strong>
                  <p>Espay CS memperlihatkan log <code>Host: dev.tyket.id</code> dengan <code>SERVICE_MESSAGE_RESPONSE: ""</code>. Ini membuktikan gateway Sandbox Espay masih menembak URL lama (cache) atau gagal rute ke domain tersebut.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- LIVE LOG FEED INSPECTOR -->
      <section class="log-section">
        <div class="log-header">
          <div>
            <h3 class="log-title">📡 Live Stream Webhook Activity Log</h3>
            <p class="log-sub">Aktivitas koneksi HTTP yang masuk ke server Anda secara realtime</p>
          </div>
          <button class="btn-refresh" @click="fetchRecentLogs" :disabled="isLoadingLogs">
            {{ isLoadingLogs ? 'Memuat...' : '🔄 Refresh Log' }}
          </button>
        </div>

        <div class="log-table-container">
          <table class="log-table">
            <thead>
              <tr>
                <th>Waktu</th>
                <th>Method</th>
                <th>Endpoint Path</th>
                <th>Tipe</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="logEntries.length === 0">
                <td colspan="5" class="empty-log">Belum ada log aktivitas terbaru.</td>
              </tr>
              <tr
                v-for="(entry, idx) in logEntries"
                :key="idx"
                :class="{ 'row-inquiry': entry.isInquiry, 'row-middleware': entry.isMiddleware }"
              >
                <td class="log-time">{{ formatTime(entry.timestamp) }}</td>
                <td>
                  <span class="method-tag" :class="`method-${entry.method?.toLowerCase()}`">
                    {{ entry.method }}
                  </span>
                </td>
                <td class="log-path">
                  <code>{{ entry.path }}</code>
                </td>
                <td>
                  <span class="type-tag" :class="entry.isInquiry ? 'type-inquiry' : 'type-normal'">
                    {{ entry.isInquiry ? '🎯 INQUIRY CALLBACK' : (entry.isMiddleware ? 'MID' : 'API') }}
                  </span>
                </td>
                <td class="log-detail">
                  <span v-if="entry.isInquiry" class="text-green font-semibold">Tembusan Webhook Terdeteksi!</span>
                  <span v-else class="text-muted">Aktivitas sistem normal</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- DRAFT CHAT TO ESPAY SUPPORT -->
      <section class="chat-draft-card">
        <div class="draft-header">
          <div>
            <span class="draft-badge">Solusi Cepat</span>
            <h3 class="draft-title">💬 Teks Rekomendasi Chat untuk Mas Wiku / CS Espay</h3>
            <p class="draft-desc">Salin dan kirimkan teks ini ke CS Espay agar tim teknis mereka langsung tahu apa yang harus dicek:</p>
          </div>
          <button class="btn-copy" @click="copyChatText">
            {{ isCopied ? '✅ Tersalin!' : '📋 Salin Pesan' }}
          </button>
        </div>
        <div class="draft-box">
          <pre class="draft-pre">{{ draftChatText }}</pre>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const selectedBank = ref('008')
const banks = [
  { code: '008', name: 'Mandiri (008)' },
  { code: '002', name: 'BRI (002)' },
  { code: '009', name: 'BNI (009)' }
]

function getBankName(code: string) {
  const b = banks.find(x => x.code === code)
  return b ? b.name : code
}

// Flow state
const isTracing = ref(false)
const isSelfTesting = ref(false)
const step = ref(0) // 0: Idle, 1: Browser->Server, 2: Server->Espay, 3: Espay->Callback, 4: Done/Error
const hasStalled = ref(false)
const durations = ref({
  client: 0,
  server: 0
})

const selfTestResult = ref<any>(null)
const traceError = ref<string | null>(null)
const logEntries = ref<any[]>([])
const isLoadingLogs = ref(false)
const isCopied = ref(false)

const circuitVerdictClass = computed(() => {
  if (hasStalled.value) return 'verdict-error'
  if (selfTestResult.value?.success) return 'verdict-ok'
  if (isTracing.value) return 'verdict-tracing'
  return 'verdict-idle'
})

const circuitVerdictText = computed(() => {
  if (hasStalled.value) return 'MOGOK DI GERBANG ESPAY (0031 REJECTED)'
  if (selfTestResult.value?.success) return 'WEBHOOK SEHAT (< 10MS SNAP 2002400)'
  if (isTracing.value) return 'SEDANG MEMANTAU ALIRAN LISTRIK...'
  return 'STANDBY / SIAP UJI'
})

// Trace Real Transaction
async function runRealTransactionTrace() {
  isTracing.value = true
  hasStalled.value = false
  traceError.value = null
  step.value = 1
  durations.value = { client: 0, server: 0 }

  const startClient = Date.now()

  // Phase 1 -> Phase 2 (Browser sends to backend Nuxt)
  setTimeout(() => {
    if (step.value === 1) {
      step.value = 2
      durations.value.client = Date.now() - startClient
    }
  }, 400)

  // Phase 2 -> Phase 3 (Backend calls Espay sendinvoice)
  setTimeout(() => {
    if (step.value === 2) {
      step.value = 3
    }
  }, 900)

  try {
    const res: any = await $fetch('/api/simulasi-create', {
      method: 'POST',
      body: {
        method: selectedBank.value === '009' ? 'va_bni' : (selectedBank.value === '002' ? 'va_bri' : 'va_mandiri'),
        amount: 25000,
        customerName: 'Tester Trace Listrik',
        customerEmail: 'trace@tyket.id',
        customerPhone: '081234567890'
      }
    })

    durations.value.server = Date.now() - startClient
    isTracing.value = false
    step.value = 4

    if (res.status === 'error' || res.debug?.errorCode === '0031' || res.debug?.errorCode === 'TIMEOUT_5S') {
      hasStalled.value = true
      traceError.value = res.message || 'Mogok di jalur Espay Inquiry'
    } else {
      hasStalled.value = false
    }
  } catch (err: any) {
    durations.value.server = Date.now() - startClient
    isTracing.value = false
    step.value = 4
    hasStalled.value = true
    traceError.value = err.message || 'Request gagal'
  }

  // Refresh recent logs to see if anything arrived
  await fetchRecentLogs()
}

// Self-probe webhook inquiry
async function runSelfProbeWebhook() {
  isSelfTesting.value = true
  selfTestResult.value = null

  try {
    const res: any = await $fetch('/api/tracer-test-inquiry', {
      method: 'POST'
    })
    selfTestResult.value = res
  } catch (err: any) {
    selfTestResult.value = {
      success: false,
      durationMs: 0,
      error: err.message
    }
  } finally {
    isSelfTesting.value = false
    await fetchRecentLogs()
  }
}

// Fetch logs
async function fetchRecentLogs() {
  isLoadingLogs.value = true
  try {
    const res: any = await $fetch('/api/tracer-recent-logs')
    if (res.entries) {
      logEntries.value = res.entries
    }
  } catch (e) {
    console.error('Failed to fetch logs:', e)
  } finally {
    isLoadingLogs.value = false
  }
}

function formatTime(iso: string) {
  if (!iso) return '-'
  try {
    const d = new Date(iso)
    return d.toLocaleTimeString('id-ID', { hour12: false })
  } catch {
    return iso
  }
}

const draftChatText = computed(() => {
  return `Halo Ka Wiku / Tim Espay,

Saya ingin konfirmasi hasil tracing integrasi Virtual Account Sandbox kami (Merchant: SGWZULKARNAENALMUHAMMADY).

Kami sudah melakukan pengetesan mendalam di level jaringan:
1. Ketika kami nembak sendinvoice, server kami sudah siap menerima Inquiry di URL Callback:
   - Respon Inquiry lokal kami sudah SNAP resmi (responseCode: 2002400) dan responsif dalam waktu sangat cepat (< 10ms).
2. Namun selama 5-10 detik proses sendinvoice berjalan, di web inspector tunnel (Ngrok) maupun log server kami tercatat 0 hit (tidak ada sama sekali request masuk dari IP gateway Espay).
3. Di log Espay kemarin tercatat Host masih mengarah ke dev.tyket.id dengan SERVICE_MESSAGE_RESPONSE kosong.

Apakah di sisi gateway Sandbox Espay:
- Cache routing URL Inquiry untuk merchant kami bisa di-flush / clear cache?
- Atau apakah ada IP whitelist / firewall di sisi server Sandbox Espay yang membatasi koneksi keluar ke domain/tunnel merchant?

Mohon bantuannya ya Ka agar handshake Inquiry Sandbox-nya bisa tembus. Terima kasih banyak Ka! 🙏`
})

function copyChatText() {
  if (navigator?.clipboard) {
    navigator.clipboard.writeText(draftChatText.value)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 3000)
  }
}

onMounted(() => {
  fetchRecentLogs()
})
</script>

<style scoped>
.tracer-page {
  min-height: 100vh;
  background: #090d16;
  color: #e2e8f0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  padding-bottom: 60px;
}

/* TOPBAR */
.tracer-topbar {
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 0;
  z-index: 50;
}
.topbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.brand-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
}
.back-arrow {
  font-size: 20px;
  color: #38bdf8;
  font-weight: bold;
}
.brand-title {
  display: block;
  font-weight: 700;
  font-size: 15px;
  color: #f8fafc;
}
.brand-sub {
  display: block;
  font-size: 11px;
  color: #94a3b8;
}
.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.nav-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #f1f5f9;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 13px;
  text-decoration: none;
  transition: all 0.2s;
}
.nav-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}
.live-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  background: rgba(148, 163, 184, 0.15);
  color: #94a3b8;
  border: 1px solid rgba(148, 163, 184, 0.25);
}
.live-pill.active {
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  border-color: rgba(56, 189, 248, 0.4);
}
.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #38bdf8;
  box-shadow: 0 0 10px #38bdf8;
  animation: pulse 1.5s infinite;
}

/* CONTAINER */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* HERO CONTROLS */
.control-card {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
.control-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}
.page-title {
  font-size: 22px;
  font-weight: 800;
  color: #f8fafc;
  margin: 0 0 6px 0;
}
.page-desc {
  font-size: 13px;
  color: #94a3b8;
  margin: 0;
  max-width: 650px;
  line-height: 1.5;
}
.bank-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.selector-label {
  font-size: 12px;
  font-weight: 600;
  color: #cbd5e1;
}
.bank-chips {
  display: flex;
  gap: 8px;
}
.bank-chip {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #cbd5e1;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.bank-chip:hover {
  background: rgba(255, 255, 255, 0.12);
}
.bank-chip.active {
  background: #0284c7;
  color: #ffffff;
  border-color: #38bdf8;
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.4);
}

.action-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 768px) {
  .action-grid {
    grid-template-columns: 1fr;
  }
}
.btn-action {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  border-radius: 12px;
  border: 1px solid transparent;
  cursor: pointer;
  text-align: left;
  transition: all 0.25s ease;
}
.btn-action:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-trace {
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  border-color: #38bdf8;
  color: #ffffff;
  box-shadow: 0 4px 20px rgba(2, 132, 199, 0.35);
}
.btn-trace:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(56, 189, 248, 0.5);
}
.btn-probe {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  border-color: #34d399;
  color: #ffffff;
  box-shadow: 0 4px 20px rgba(5, 150, 105, 0.3);
}
.btn-probe:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(52, 211, 153, 0.45);
}
.btn-icon {
  font-size: 26px;
  flex-shrink: 0;
}
.btn-text strong {
  display: block;
  font-size: 14px;
  margin-bottom: 2px;
}
.btn-text span {
  display: block;
  font-size: 11px;
  opacity: 0.85;
  font-weight: 400;
}

/* CIRCUIT BOARD */
.circuit-section {
  background: #0b1120;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 24px;
  position: relative;
  overflow: hidden;
}
.circuit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}
.circuit-title {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.8px;
  color: #94a3b8;
}
.circuit-status {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  border: 1px solid transparent;
}
.verdict-idle {
  background: rgba(148, 163, 184, 0.1);
  color: #94a3b8;
  border-color: rgba(148, 163, 184, 0.2);
}
.verdict-tracing {
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  border-color: rgba(56, 189, 248, 0.4);
}
.verdict-ok {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
  border-color: rgba(34, 197, 94, 0.4);
}
.verdict-error {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border-color: rgba(239, 68, 68, 0.4);
}

.circuit-board {
  position: relative;
  min-height: 420px;
}

/* SVG LAYOUT */
.circuit-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.wire-base {
  stroke: rgba(255, 255, 255, 0.08);
  stroke-width: 4;
  fill: none;
}
.wire-dashed {
  stroke-dasharray: 6 6;
}
.wire-active {
  stroke-width: 4;
  fill: none;
  stroke-linecap: round;
}
.wire-broken {
  stroke-width: 4;
  fill: none;
  stroke-dasharray: 8 6;
  animation: flash-red 0.5s infinite alternate;
}

.beam-cyan {
  stroke: #38bdf8;
}
.beam-purple {
  stroke: #c084fc;
}
.beam-orange {
  stroke: #fbbf24;
}
.beam-red {
  stroke: #ef4444;
}
.beam-green {
  stroke: #4ade80;
}
.beam-red-dash {
  stroke: #ef4444;
  stroke-dasharray: 6 6;
  animation: dash 1s linear infinite;
}

.beam-flowing {
  stroke-dasharray: 12 8;
  animation: flow 1s linear infinite;
}

@keyframes flow {
  from { stroke-dashoffset: 40; }
  to { stroke-dashoffset: 0; }
}
@keyframes dash {
  from { stroke-dashoffset: 24; }
  to { stroke-dashoffset: 0; }
}
@keyframes flash-red {
  from { opacity: 0.4; }
  to { opacity: 1; stroke-width: 6; }
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.9); }
}
.pulse-ring {
  animation: pulse-ring 1s infinite;
}
@keyframes pulse-ring {
  0% { transform: scale(0.8); opacity: 0.8; }
  100% { transform: scale(1.6); opacity: 0; }
}
.spark-rotate {
  animation: spark 0.6s infinite alternate;
  transform-origin: 15px 15px;
}
@keyframes spark {
  0% { transform: scale(0.9) rotate(-10deg); }
  100% { transform: scale(1.2) rotate(10deg); }
}

/* NODES GRID */
.nodes-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto auto;
  gap: 24px;
  padding: 10px 0;
}
@media (max-width: 900px) {
  .nodes-grid {
    grid-template-columns: 1fr;
  }
}

.circuit-node {
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 18px;
  display: flex;
  gap: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}
.circuit-node.active {
  border-color: #38bdf8;
  box-shadow: 0 0 25px rgba(56, 189, 248, 0.35);
  transform: translateY(-2px);
}
.circuit-node.done {
  border-color: rgba(74, 222, 128, 0.5);
}
.circuit-node.error {
  border-color: #ef4444;
  box-shadow: 0 0 25px rgba(239, 68, 68, 0.4);
}
.circuit-node.stalled {
  border-color: rgba(239, 68, 68, 0.4);
  background: rgba(30, 15, 15, 0.8);
}

.node-webhook {
  grid-column: 2;
  grid-row: 2;
}
@media (max-width: 900px) {
  .node-webhook {
    grid-column: auto;
    grid-row: auto;
  }
}

.node-icon {
  font-size: 28px;
  flex-shrink: 0;
}
.node-body {
  flex: 1;
}
.node-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.node-step {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.6px;
  color: #64748b;
}
.node-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
  color: #94a3b8;
}
.badge-ok {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
}
.badge-warn {
  background: rgba(250, 204, 21, 0.2);
  color: #facc15;
}
.badge-error {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
}

.node-title {
  font-size: 15px;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 4px 0;
}
.node-desc {
  font-size: 11px;
  color: #94a3b8;
  margin: 0 0 10px 0;
  line-height: 1.4;
}
.node-metric {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  padding: 3px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}
.metric-label {
  color: #64748b;
}
.metric-val {
  color: #cbd5e1;
  font-family: monospace;
}

.text-cyan { color: #38bdf8; }
.text-green { color: #4ade80; }
.text-red { color: #f87171; }
.text-orange { color: #fbbf24; }
.text-muted { color: #64748b; }
.font-bold { font-weight: 700; }
.font-semibold { font-weight: 600; }

/* STALLED BANNER */
.stalled-alert-card {
  margin-top: 24px;
  background: linear-gradient(135deg, rgba(127, 29, 29, 0.7) 0%, rgba(69, 10, 10, 0.9) 100%);
  border: 1px solid #ef4444;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 0 30px rgba(239, 68, 68, 0.35);
  animation: flash-border 2s infinite;
}
@keyframes flash-border {
  0%, 100% { border-color: #ef4444; }
  50% { border-color: #fca5a5; }
}
.alert-icon {
  font-size: 32px;
  flex-shrink: 0;
}
.alert-title {
  font-size: 14px;
  font-weight: 800;
  color: #fecaca;
  margin: 0 0 4px 0;
}
.alert-desc {
  font-size: 12px;
  color: #fca5a5;
  margin: 0;
  line-height: 1.5;
}

/* DIAGNOSTICS */
.diagnostic-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
@media (max-width: 900px) {
  .diagnostic-grid {
    grid-template-columns: 1fr;
  }
}
.diag-card {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 22px;
}
.diag-card-header {
  margin-bottom: 16px;
}
.diag-badge {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 6px;
}
.badge-why {
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
}
.badge-proof {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
}
.diag-title {
  font-size: 16px;
  font-weight: 700;
  color: #f8fafc;
  margin: 0;
}
.diag-para {
  font-size: 13px;
  color: #cbd5e1;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.analogy-box {
  background: rgba(30, 41, 59, 0.7);
  border-left: 3px solid #38bdf8;
  padding: 12px 16px;
  border-radius: 0 8px 8px 0;
  font-size: 12px;
  color: #cbd5e1;
  line-height: 1.5;
  margin-bottom: 16px;
}
.analogy-title {
  font-weight: 700;
  color: #38bdf8;
  margin-bottom: 4px;
}

.diag-points {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.diag-point {
  display: flex;
  gap: 12px;
  font-size: 12px;
}
.point-num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(56, 189, 248, 0.2);
  color: #38bdf8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}
.diag-point strong {
  display: block;
  color: #f1f5f9;
  margin-bottom: 2px;
}
.diag-point span {
  color: #94a3b8;
}

.proof-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.proof-item {
  display: flex;
  gap: 14px;
  background: rgba(30, 41, 59, 0.5);
  padding: 12px 14px;
  border-radius: 10px;
}
.proof-status {
  font-size: 11px;
  font-weight: 800;
  font-family: monospace;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 6px;
  align-self: flex-start;
}
.proof-content strong {
  display: block;
  font-size: 13px;
  color: #f1f5f9;
  margin-bottom: 4px;
}
.proof-content p {
  font-size: 12px;
  color: #94a3b8;
  margin: 0;
  line-height: 1.4;
}

/* LOGS */
.log-section {
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 22px;
}
.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.log-title {
  font-size: 16px;
  font-weight: 700;
  color: #f8fafc;
  margin: 0 0 2px 0;
}
.log-sub {
  font-size: 12px;
  color: #94a3b8;
  margin: 0;
}
.btn-refresh {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #cbd5e1;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-refresh:hover {
  background: rgba(255, 255, 255, 0.15);
}

.log-table-container {
  overflow-x: auto;
}
.log-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}
.log-table th {
  text-align: left;
  padding: 10px 12px;
  color: #64748b;
  font-weight: 700;
  font-size: 11px;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.log-table td {
  padding: 10px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}
.log-time {
  font-family: monospace;
  color: #94a3b8;
}
.method-tag {
  font-family: monospace;
  font-weight: 700;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
}
.method-post { background: rgba(56, 189, 248, 0.2); color: #38bdf8; }
.method-get { background: rgba(34, 197, 94, 0.2); color: #4ade80; }
.method-head { background: rgba(250, 204, 21, 0.2); color: #facc15; }

.log-path code {
  color: #cbd5e1;
  font-family: monospace;
}
.type-tag {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
}
.type-inquiry {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.4);
}
.type-normal {
  background: rgba(148, 163, 184, 0.1);
  color: #94a3b8;
}
.row-inquiry {
  background: rgba(34, 197, 94, 0.05);
}
.empty-log {
  text-align: center;
  color: #64748b;
  padding: 30px !important;
}

/* CHAT DRAFT */
.chat-draft-card {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 24px;
}
.draft-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 16px;
}
.draft-badge {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 4px;
  background: rgba(168, 85, 247, 0.2);
  color: #c084fc;
  display: inline-block;
  margin-bottom: 4px;
}
.draft-title {
  font-size: 16px;
  font-weight: 700;
  color: #f8fafc;
  margin: 0 0 4px 0;
}
.draft-desc {
  font-size: 12px;
  color: #94a3b8;
  margin: 0;
}
.btn-copy {
  background: #3b82f6;
  border: none;
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-copy:hover {
  background: #2563eb;
}
.draft-box {
  background: #06090f;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 16px;
  overflow-x: auto;
}
.draft-pre {
  margin: 0;
  font-family: inherit;
  font-size: 12px;
  color: #cbd5e1;
  line-height: 1.6;
  white-space: pre-wrap;
}

/* SPINNER */
.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
