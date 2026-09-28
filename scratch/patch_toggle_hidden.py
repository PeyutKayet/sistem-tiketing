import re

with open('app/pages/admin/event/[slug]/tiket.vue', 'r') as f:
    content = f.read()

old_hidden_baru = """          <label style="display:flex; align-items:center; gap:8px; font-size:13px; cursor:pointer; font-weight:600; color:#4a5a6e;">
            <input type="checkbox" v-model="formBaru.is_hidden" style="width:16px; height:16px;" />
            Tiket Privat (Hanya via link)
          </label>"""
new_hidden_baru = """          <label style="display:flex; align-items:center; gap:8px; font-size:13px; cursor:pointer; font-weight:600; color:#4a5a6e;">
            <div class="switch-admin" style="margin:0; width:34px;">
              <input type="checkbox" v-model="formBaru.is_hidden" />
              <span class="slider-admin round-admin"></span>
            </div>
            Tiket Privat (Hanya via link)
          </label>"""
content = content.replace(old_hidden_baru, new_hidden_baru)

old_hidden_edit = """        <label style="display:flex; align-items:center; gap:8px; font-size:13px; cursor:pointer; font-weight:600; color:#4a5a6e; margin-top:8px;">
          <input type="checkbox" v-model="formEdit.is_hidden" style="width:16px; height:16px;" />
          Tiket Privat (Hanya via link)
        </label>"""
new_hidden_edit = """        <label style="display:flex; align-items:center; gap:8px; font-size:13px; cursor:pointer; font-weight:600; color:#4a5a6e; margin-top:8px;">
          <div class="switch-admin" style="margin:0; width:34px;">
            <input type="checkbox" v-model="formEdit.is_hidden" />
            <span class="slider-admin round-admin"></span>
          </div>
          Tiket Privat (Hanya via link)
        </label>"""
content = content.replace(old_hidden_edit, new_hidden_edit)

with open('app/pages/admin/event/[slug]/tiket.vue', 'w') as f:
    f.write(content)
