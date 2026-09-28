import re

with open('app/pages/admin/event/[slug]/peserta.vue', 'r') as f:
    content = f.read()

old_blob = """    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `Data_Peserta_${selectedEvent.value.nama_event.replace(/ /g, '_')}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)"""

new_blob = """    const blob = new Blob([csvContent.replace('data:text/csv;charset=utf-8,', '')], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `Data_Peserta_${selectedEvent.value.nama_event.replace(/ /g, '_')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)"""

if old_blob in content:
    content = content.replace(old_blob, new_blob)
    with open('app/pages/admin/event/[slug]/peserta.vue', 'w') as f:
        f.write(content)
    print("Berhasil patch Blob")
else:
    print("Gagal menemukan Blob block")
