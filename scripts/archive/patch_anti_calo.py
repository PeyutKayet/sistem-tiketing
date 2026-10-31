import re

file = 'server/api/checkout.post.ts'
with open(file, 'r') as f:
    content = f.read()

anti_calo_logic = """
  // Anti-Calo Check
  if (eventData.settings?.is_anti_calo_email || eventData.settings?.is_anti_calo_wa) {
    const emails = body.peserta.map((p: any) => p.email).filter(Boolean);
    const was = body.peserta.map((p: any) => p.no_wa).filter(Boolean);
    
    // Check internal duplicates in the request first
    if (eventData.settings?.is_anti_calo_email && new Set(emails).size !== emails.length) {
      throw createError({ statusCode: 400, statusMessage: 'Sistem Anti-Calo: 1 Email hanya untuk 1 tiket dalam satu pesanan.' })
    }
    if (eventData.settings?.is_anti_calo_wa && new Set(was).size !== was.length) {
      throw createError({ statusCode: 400, statusMessage: 'Sistem Anti-Calo: 1 No WA hanya untuk 1 tiket dalam satu pesanan.' })
    }
    
    // Check against DB
    let query = supabase.from('peserta').select('id, email, no_wa').eq('event_id', body.event_id).neq('status_bayar', 'cancelled')
    
    if (eventData.settings?.is_anti_calo_email && eventData.settings?.is_anti_calo_wa) {
      query = query.or(`email.in.(${emails.map(e => `"${e}"`).join(',')}),no_wa.in.(${was.map(w => `"${w}"`).join(',')})`)
    } else if (eventData.settings?.is_anti_calo_email) {
      query = query.in('email', emails)
    } else if (eventData.settings?.is_anti_calo_wa) {
      query = query.in('no_wa', was)
    }
    
    const { data: existingPeserta } = await query
    
    if (existingPeserta && existingPeserta.length > 0) {
      if (eventData.settings?.is_anti_calo_email && existingPeserta.some(p => emails.includes(p.email))) {
        throw createError({ statusCode: 400, statusMessage: 'Sistem Anti-Calo: Email tersebut sudah terdaftar pada event ini.' })
      }
      if (eventData.settings?.is_anti_calo_wa && existingPeserta.some(p => was.includes(p.no_wa))) {
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

print("Anti calo patched")
