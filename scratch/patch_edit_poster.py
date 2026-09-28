import re

with open('app/pages/admin/event/[slug]/edit.vue', 'r') as f:
    content = f.read()

old_poster_ui = """          <div class="mb-3">
            <label class="form-label"><Icon name="lucide:image" style="margin-right:4px;" /> Upload Poster Event</label>
            <div style="position:relative; width:100%; max-width: 250px; height:150px; background:#f8fafc; border:1px dashed #cbd5e1; border-radius:12px; display:flex; align-items:center; justify-content:center; overflow:hidden;">
              <input type="file" accept="image/*" @change="handlePosterUpload" style="position:absolute; inset:0; opacity:0; cursor:pointer; z-index: 10;" />
              <template v-if="posterPreviewUrl || (selectedEvent && selectedEvent.poster_url)">
                <img :src="posterPreviewUrl || selectedEvent.poster_url" style="width:100%; height:100%; object-fit:cover;" />
                <div style="position:absolute; inset:0; background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; opacity:0; transition:0.2s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0">
                  <Icon name="lucide:upload-cloud" style="color:white; font-size:28px;" />
                </div>
              </template>
              <template v-else>
                <div style="text-align: center;">
                  <Icon name="lucide:image-plus" style="font-size:28px; color:#94a3b8; margin-bottom:4px; display:block; margin: 0 auto;" />
                  <span style="font-size:12px; font-weight:600; color:#64748b;">Ganti Poster</span>
                </div>
              </template>
            </div>
            <small style="font-size:11px; color:#8a9aa8; display:block; margin-top:6px;">Format: JPG/PNG. Maks 2MB.</small>
          </div>"""

new_poster_ui = """          <div class="mb-3">
            <label class="form-label"><Icon name="lucide:image" style="margin-right:4px;" /> Upload Poster Event</label>
            <div style="position:relative; display:flex; align-items:center; justify-content:center; height:41px; border:1px dashed #cbd5e1; border-radius:12px; background:#f8fafc; cursor:pointer; overflow:hidden; transition:0.2s;" onmouseover="this.style.borderColor='var(--primary)'; this.style.background='#eff6ff'" onmouseout="this.style.borderColor='#cbd5e1'; this.style.background='#f8fafc'">
              <input type="file" accept="image/*" @change="handlePosterUpload" style="position:absolute; inset:0; opacity:0; cursor:pointer; z-index:10;" />
              <template v-if="posterPreviewUrl || (selectedEvent && selectedEvent.poster_url)">
                <Icon name="lucide:check-circle-2" style="color:#10b981; margin-right:6px; font-size:16px;" />
                <span style="font-size:12px; font-weight:600; color:#065f46;">Poster Terpasang (Klik untuk Ganti)</span>
              </template>
              <template v-else>
                <Icon name="lucide:upload-cloud" style="color:#64748b; margin-right:6px; font-size:16px;" />
                <span style="font-size:12px; font-weight:600; color:#64748b;">Pilih Poster</span>
              </template>
            </div>
            <small style="font-size:11px; color:#8a9aa8; display:block; margin-top:6px;">Format: JPG/PNG. Maks 2MB.</small>
          </div>"""

content = content.replace(old_poster_ui, new_poster_ui)

with open('app/pages/admin/event/[slug]/edit.vue', 'w') as f:
    f.write(content)
