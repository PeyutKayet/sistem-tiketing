import re

with open('app/pages/admin/event/[slug]/edit.vue', 'r') as f:
    content = f.read()

# 1. Format Acara & Absensi
content = content.replace(
    'Wajibkan Scan QR Code (Bagi Peserta Di Lokasi)',
    'Wajib Scan QR Code (Absensi)'
)
content = content.replace(
    '1x Scan Langsung Hangus (Event Biasa)',
    'Hanya bisa di-scan 1x (Hangus)'
)

# 2. Fitur Tambahan Pendaftaran
content = content.replace(
    'Arahkan Peserta ke Grup Komunitas (WA/Telegram)',
    'Sediakan Link Grup Komunitas'
)
content = content.replace(
    'Wajibkan Persetujuan Syarat & Ketentuan (S&K)',
    'Persetujuan Syarat & Ketentuan (S&K)'
)

# 3. Anti Calo
content = content.replace(
    'Anti Calo</h4>',
    'Sistem Anti-Calo</h4>'
)
content = content.replace(
    '<span class="text-muted" style="font-size:12px;margin-left:4px;">(Peserta tidak bisa daftar berulang dengan email yang sama)</span>',
    ''
)
content = content.replace(
    '1 WA = 1 Tiket',
    '1 No. WhatsApp = 1 Tiket'
)
content = content.replace(
    'Wajib Konfirmasi Nomor WA Aktif (Akan dikirim OTP)',
    'Wajib Verifikasi OTP WhatsApp'
)

# 4. Fitur Donasi / Infaq
content = content.replace(
    'Fitur Donasi / Infaq</h4>',
    'Donasi / Infaq</h4>'
)
content = content.replace(
    'Aktifkan Form Donasi Saat Pendaftaran',
    'Aktifkan Form Donasi'
)

# 5. REMOVE REDUNDANT "Grup Komunikasi" PANEL
redundant_panel = """        <div class="panel">
          <h4 style="margin-bottom:8px;font-weight:600;color:#0a1929;display:flex;align-items:center;gap:6px;"><Icon name="lucide:message-circle" style="font-size:16px;color:#15803d;" /> Grup Komunikasi</h4>
          <div class="mb-3">
            <label class="checkbox-item">
              <input type="checkbox" v-model="formEditEvent.is_grup_wa_active" /> Sediakan Link Grup WhatsApp Peserta
            </label>
          </div>
          <div v-if="formEditEvent.is_grup_wa_active" style="padding-top: 10px; border-top: 1px dashed #e6edf5;">
            <label class="form-label">Link Grup WA</label>
            <input type="url" v-model="formEditEvent.link_grup_wa" class="form-control" placeholder="https://chat.whatsapp.com/..." />
          </div>
        </div>"""

if redundant_panel in content:
    content = content.replace(redundant_panel, '')
else:
    print("WARNING: Redundant panel string exact match not found. It might have slight spacing differences.")

with open('app/pages/admin/event/[slug]/edit.vue', 'w') as f:
    f.write(content)
