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
content = content.replace(
    'Bebas Scan Berkali-kali (Akses Keluar-Masuk / Bazar)',
    'Scan Berkali-kali (Keluar-Masuk)'
)
content = content.replace(
    'Scan Dibatasi Kuota Hari (Training / Bootcamp)',
    'Batas Hari / Multi-day'
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
# Find the panel starting at <div class="panel"> containing "Grup Komunikasi"
pattern = r'<div class="panel">\s*<h4[^>]*>.*?Grup Komunikasi</h4>.*?</div>'
content = re.sub(pattern, '', content, flags=re.DOTALL)


with open('app/pages/admin/event/[slug]/edit.vue', 'w') as f:
    f.write(content)
