import re

# 1. admin/index.vue - domisili undeletable -> false
file1 = 'app/pages/admin/index.vue'
with open(file1, 'r') as f:
    content = f.read()
content = content.replace(
    "{ id: 'ff_default_domisili', type: 'domisili_api', label: 'Kota Domisili', field_key: 'domisili', x: 0, y: 4, width: 12, height: 2, required: true, undeletable: true }",
    "{ id: 'ff_default_domisili', type: 'domisili_api', label: 'Kota Domisili', field_key: 'domisili', x: 0, y: 4, width: 12, height: 2, required: true, undeletable: false }"
)
with open(file1, 'w') as f:
    f.write(content)

# 2. admin/event/[slug]/edit.vue - domisili undeletable -> false
file2 = 'app/pages/admin/event/[slug]/edit.vue'
with open(file2, 'r') as f:
    content = f.read()
content = content.replace(
    "{ id: 'ff_default_domisili', type: 'domisili_api', label: 'Kota Domisili', field_key: 'domisili', x: 0, y: 4, width: 12, height: 2, required: true, undeletable: true }",
    "{ id: 'ff_default_domisili', type: 'domisili_api', label: 'Kota Domisili', field_key: 'domisili', x: 0, y: 4, width: 12, height: 2, required: true, undeletable: false }"
)
with open(file2, 'w') as f:
    f.write(content)

# 3. AdminWizard.vue - copy button in step 4
file3 = 'app/components/admin/AdminWizard.vue'
with open(file3, 'r') as f:
    content = f.read()

copy_btn = """<div style="background:#e4edf8; padding:12px 18px; border-radius:12px; font-size:13px; font-family:monospace; color:#1a4a7a; border:1px dashed #b8c8d8; display:flex; justify-content:space-between; align-items:center;">
                <span>{{ baseUrl }}/<strong style="color:#0a1929;">{{ formEvent.slug || 'slug-event' }}</strong></span>
                <button @click="copyText(`${baseUrl}/${formEvent.slug || 'slug-event'}`)" class="btn-icon" style="background:white; padding:4px 8px; border-radius:6px; border:1px solid #cbd5e1; font-size:12px; cursor:pointer;"><Icon name="lucide:copy" style="margin-right:4px;"/> Copy</button>
              </div>"""

content = re.sub(
    r'<div style="background:#e4edf8; padding:12px 18px; border-radius:12px; font-size:13px; font-family:monospace; color:#1a4a7a; border:1px dashed #b8c8d8;">.*?</div>',
    copy_btn,
    content,
    flags=re.DOTALL
)

# add copyText logic if not there
if 'const copyText =' not in content:
    content = content.replace(
        'const baseUrl = ref(',
        "const copyText = (text) => { navigator.clipboard.writeText(text); showToast('Link berhasil disalin!', 'success') }\nconst baseUrl = ref("
    )
with open(file3, 'w') as f:
    f.write(content)

# 6. admin/event/[slug]/tiket.vue - bukaEditTiket is_no_time_limit
file6 = 'app/pages/admin/event/[slug]/tiket.vue'
with open(file6, 'r') as f:
    content = f.read()

content = content.replace(
    "buka: t.tanggal_mulai_penjualan ? t.tanggal_mulai_penjualan.substring(0, 16) : '',\n    tutup: t.tanggal_selesai_penjualan ? t.tanggal_selesai_penjualan.substring(0, 16) : ''\n  }",
    "buka: t.tanggal_mulai_penjualan ? t.tanggal_mulai_penjualan.substring(0, 16) : '',\n    tutup: t.tanggal_selesai_penjualan ? t.tanggal_selesai_penjualan.substring(0, 16) : '',\n    is_no_time_limit: !t.tanggal_mulai_penjualan && !t.tanggal_selesai_penjualan\n  }"
)
with open(file6, 'w') as f:
    f.write(content)

# 7. TicketList.vue - Sold Out
file7 = 'app/components/event/TicketList.vue'
with open(file7, 'r') as f:
    content = f.read()

sold_out_html = """          <span class="ticket-quota" v-if="tiket.sisa_kuota > 0 || tiket.is_unlimited">
            Sisa: {{ tiket.is_unlimited ? '~' : tiket.sisa_kuota }}
          </span>
          <span class="ticket-quota" v-else style="color: #dc2626; font-weight: bold;">
            Sold Out
          </span>"""

content = re.sub(
    r'<span class="ticket-quota">.*?</span>',
    sold_out_html,
    content,
    flags=re.DOTALL
)
with open(file7, 'w') as f:
    f.write(content)

print("Patching done!")
