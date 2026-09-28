import re

# 1. Edit.vue
with open('app/pages/admin/event/[slug]/edit.vue', 'r') as f:
    edit_content = f.read()

edit_old = """          <label class="checkbox-item mb-1">
            <input type="checkbox" v-model="formEditEvent.is_wa_konfirm" /> Wajib Verifikasi OTP WhatsApp
          </label>"""
edit_content = edit_content.replace(edit_old, "")

with open('app/pages/admin/event/[slug]/edit.vue', 'w') as f:
    f.write(edit_content)

# 2. AdminWizard.vue
with open('app/components/admin/AdminWizard.vue', 'r') as f:
    wizard_content = f.read()

wizard_old = """                        <label class="checkbox-item" style="font-size: 11px;"><input type="checkbox" v-model="formEvent.is_wa_konfirm" /> OTP WA</label>"""
wizard_content = wizard_content.replace(wizard_old, "")

with open('app/components/admin/AdminWizard.vue', 'w') as f:
    f.write(wizard_content)

print("Berhasil")
