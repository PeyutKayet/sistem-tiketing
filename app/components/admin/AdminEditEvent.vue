<template>
  <div v-if="selectedEvent">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
      <h2 style="font-size: 22px; font-weight: 600; margin: 0;">✏️ Edit Event</h2>
      <button class="btn-outline" @click="activeTab = 'event'">🔙 Batal</button>
    </div>

    <div style="background: #fff; border-radius: 18px; border: 1px solid #e6edf5; padding: 24px; max-width: 600px;">
      <div style="margin-bottom: 16px;">
        <label style="font-size: 12px; color: #8a9aa8; font-weight: 600; margin-bottom: 6px; display: block;">Nama Acara</label>
        <input type="text" v-model="formEditEvent.nama" class="form-control" />
      </div>
      
      <div style="display: flex; gap: 16px; margin-bottom: 16px;">
        <div style="flex: 1;">
          <label style="font-size: 12px; color: #8a9aa8; font-weight: 600; margin-bottom: 6px; display: block;">Slug URL</label>
          <input type="text" v-model="formEditEvent.slug" class="form-control" />
        </div>
        <div style="flex: 1;">
          <label style="font-size: 12px; color: #8a9aa8; font-weight: 600; margin-bottom: 6px; display: block;">Status</label>
          <select v-model="formEditEvent.status" class="form-control">
            <option value="published">Aktif (Published)</option>
            <option value="finished">Selesai (Finished)</option>
            <option value="archived">Arsip (Archived)</option>
          </select>
        </div>
      </div>

      <div style="display: flex; gap: 16px; margin-bottom: 16px;">
        <div style="flex: 1;">
          <label style="font-size: 12px; color: #8a9aa8; font-weight: 600; margin-bottom: 6px; display: block;">Tanggal</label>
          <input type="date" v-model="formEditEvent.tanggal" class="form-control" />
        </div>
        <div style="flex: 1;">
          <label style="font-size: 12px; color: #8a9aa8; font-weight: 600; margin-bottom: 6px; display: block;">Lokasi</label>
          <input type="text" v-model="formEditEvent.lokasi" class="form-control" />
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <label style="font-size: 12px; color: #8a9aa8; font-weight: 600; margin-bottom: 6px; display: block;">Deskripsi</label>
        <textarea v-model="formEditEvent.deskripsi" rows="3" class="form-control"></textarea>
      </div>

      <button class="btn-primary" style="width: 100%; padding: 12px; border: none; border-radius: 12px; font-weight: 600; background: var(--primary); color: white; cursor: pointer;" @click="simpanEditEvent" :disabled="isSavingEdit">
        {{ isSavingEdit ? '⏳ Menyimpan...' : '💾 Simpan Perubahan' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'

const { 
  selectedEvent, activeTab, formEditEvent, isSavingEdit, 
  supabase, currentUser, allEvents, muatDaftarEvent 
} = useAdmin()

watch(activeTab, (newTab) => {
  if (newTab === 'edit' && selectedEvent.value) {
    formEditEvent.value = {
      nama: selectedEvent.value.nama_event || '',
      slug: selectedEvent.value.slug || '',
      tanggal: selectedEvent.value.tanggal_mulai ? selectedEvent.value.tanggal_mulai.split('T')[0] : '',
      lokasi: selectedEvent.value.lokasi || '',
      deskripsi: selectedEvent.value.deskripsi || '',
      status: selectedEvent.value.status || 'published'
    }
  }
}, { immediate: true })

const simpanEditEvent = async () => {
  isSavingEdit.value = true
  try {
    const { error } = await supabase
      .from('event')
      .update({
        nama_event: formEditEvent.value.nama,
        slug: formEditEvent.value.slug,
        tanggal_mulai: formEditEvent.value.tanggal || null,
        lokasi: formEditEvent.value.lokasi,
        deskripsi: formEditEvent.value.deskripsi,
        status: formEditEvent.value.status
      })
      .eq('id', selectedEvent.value.id)

    if (error) throw error

    alert('✅ Event berhasil diperbarui!')
    await muatDaftarEvent(currentUser.value.id)
    
    const updatedEvent = allEvents.value.find(e => e.id === selectedEvent.value.id)
    if (updatedEvent) selectedEvent.value = updatedEvent
    
    activeTab.value = 'event'
  } catch (err) {
    alert('❌ Gagal mengupdate event: ' + err.message)
  } finally {
    isSavingEdit.value = false
  }
}
</script>
