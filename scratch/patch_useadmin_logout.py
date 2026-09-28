import re

with open('app/composables/useAdmin.ts', 'r') as f:
    content = f.read()

old_logout = """  const prosesLogout = async () => {
    if (confirm('Yakin ingin mengakhiri sesi dan keluar dari aplikasi?')) {
      await supabase.auth.signOut()
      router.push('/login')
    }
  }"""

new_logout = """  const prosesLogout = async () => {
    if (confirm('Yakin ingin mengakhiri sesi dan keluar dari aplikasi?')) {
      // Bersihkan state global sebelum logout agar data tidak bocor (cross-contamination)
      allEvents.value = []
      selectedEvent.value = null
      daftarPeserta.value = []
      organizerProfile.value = null
      totalPeserta.value = 0
      totalLunas.value = 0
      totalPending.value = 0
      totalHadir.value = 0
      pesertaPage.value = 1
      pesertaTotalData.value = 0
      
      await supabase.auth.signOut()
      router.push('/login')
    }
  }"""

content = content.replace(old_logout, new_logout)

with open('app/composables/useAdmin.ts', 'w') as f:
    f.write(content)

print("Berhasil")
