import re

with open('app/pages/admin/event/[slug]/tiket.vue', 'r') as f:
    content = f.read()

# Replace for formBaru
old_form_baru = """          <label style="display:flex; align-items:center; gap:8px; font-size:13px; cursor:pointer; font-weight:600; color:#4a5a6e;">
            <input type="checkbox" v-model="formBaru.is_active" style="width:16px; height:16px; accent-color:#10b981;" />
            Tiket Aktif
          </label>"""

new_form_baru = """          <label style="display:flex; align-items:center; gap:8px; font-size:13px; cursor:pointer; font-weight:600; color:#4a5a6e;">
            <div class="switch-admin" style="margin:0; width:34px;">
              <input type="checkbox" v-model="formBaru.is_active" />
              <span class="slider-admin round-admin"></span>
            </div>
            {{ formBaru.is_active !== false ? 'Aktifkan Tiket' : 'Nonaktifkan Tiket' }}
          </label>"""
content = content.replace(old_form_baru, new_form_baru)

# Replace for formEdit
old_form_edit = """        <label style="display:flex; align-items:center; gap:8px; font-size:13px; cursor:pointer; font-weight:600; color:#4a5a6e; margin-top:8px;">
          <input type="checkbox" v-model="formEdit.is_active" style="width:16px; height:16px; accent-color:#10b981;" />
          Tiket Aktif
        </label>"""

new_form_edit = """        <label style="display:flex; align-items:center; gap:8px; font-size:13px; cursor:pointer; font-weight:600; color:#4a5a6e; margin-top:8px;">
          <div class="switch-admin" style="margin:0; width:34px;">
            <input type="checkbox" v-model="formEdit.is_active" />
            <span class="slider-admin round-admin"></span>
          </div>
          {{ formEdit.is_active !== false ? 'Aktifkan Tiket' : 'Nonaktifkan Tiket' }}
        </label>"""
content = content.replace(old_form_edit, new_form_edit)

with open('app/pages/admin/event/[slug]/tiket.vue', 'w') as f:
    f.write(content)
