import re

file = 'server/api/checkout.post.ts'
with open(file, 'r') as f:
    content = f.read()

# Remove the old buggy anti-calo block
content = re.sub(r'// Anti-Calo Check.*?const isKaseraActive = eventData\.settings\?\.is_kasera_active === true', 
                 'const isKaseraActive = eventData.settings?.is_kasera_active === true', 
                 content, flags=re.DOTALL)

anti_calo_logic = """
  // Anti-Calo Check
  if (eventData.settings?.is_anti_calo_email || eventData.settings?.is_anti_calo_wa) {
    const emails = body.peserta.map((p: any) => p.email).filter(Boolean);
    const was = body.peserta.map((p: any) => p.no_wa).filter(Boolean);
    
    // Check internal duplicates in the request first
    if (eventData.settings?.is_anti_calo_email && new Set(emails).size !== emails.length) {
      throw createError({ statusCode: 400, statusMessage: 'Sistem Anti-Calo: 1 Email hanya untuk 1 tiket.' })
    }
    if (eventData.settings?.is_anti_calo_wa && new Set(was).size !== was.length) {
      throw createError({ statusCode: 400, statusMessage: 'Sistem Anti-Calo: 1 No WA hanya untuk 1 tiket.' })
    }
    
    // Check against DB
    if (eventData.settings?.is_anti_calo_email && emails.length > 0) {
      const { data } = await supabase.from('peserta').select('email').eq('event_id', body.event_id).neq('status_bayar', 'cancelled').in('email', emails)
      if (data && data.length > 0) {
        throw createError({ statusCode: 400, statusMessage: 'Sistem Anti-Calo: Email tersebut sudah terdaftar pada event ini.' })
      }
    }
    
    if (eventData.settings?.is_anti_calo_wa && was.length > 0) {
      const { data } = await supabase.from('peserta').select('no_wa').eq('event_id', body.event_id).neq('status_bayar', 'cancelled').in('no_wa', was)
      if (data && data.length > 0) {
        throw createError({ statusCode: 400, statusMessage: 'Sistem Anti-Calo: Nomor WhatsApp tersebut sudah terdaftar pada event ini.' })
      }
    }
  }
"""

content = content.replace(
    "const isKaseraActive = eventData.settings?.is_kasera_active === true",
    anti_calo_logic + "\n  const isKaseraActive = eventData.settings?.is_kasera_active === true"
)

with open(file, 'w') as f:
    f.write(content)

print("Anti calo safe patched")
