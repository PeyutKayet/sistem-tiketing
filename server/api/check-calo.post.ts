import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  if (!body || !body.event_id || !body.peserta) {
    return { success: true }
  }

  const supabase = await serverSupabaseServiceRole(event)

  const { data: eventData } = await supabase
    .from('event')
    .select('settings')
    .eq('id', body.event_id)
    .single()

  if (!eventData || (!eventData.settings?.is_anti_calo_email && !eventData.settings?.is_anti_calo_wa)) {
    return { success: true }
  }

  const emails = body.peserta.map((p: any) => p.email).filter(Boolean);
  const was = body.peserta.map((p: any) => p.no_wa).filter(Boolean);

  if (eventData.settings?.is_anti_calo_email && new Set(emails).size !== emails.length) {
    throw createError({ statusCode: 400, statusMessage: 'Sistem Anti-Calo: 1 Email hanya untuk 1 tiket.' })
  }
  if (eventData.settings?.is_anti_calo_wa && new Set(was).size !== was.length) {
    throw createError({ statusCode: 400, statusMessage: 'Sistem Anti-Calo: 1 No WA hanya untuk 1 tiket.' })
  }

  const checks = [];

  if (eventData.settings?.is_anti_calo_email && emails.length > 0) {
    checks.push(
      supabase.from('peserta')
        .select('id, email, status_bayar, created_at')
        .eq('event_id', body.event_id)
        .neq('status_bayar', 'cancelled')
        .in('email', emails)
        .then(async ({ data }) => {
          if (data && data.length > 0) {
            const expiredIds: any[] = []
            let hasActiveViolation = false

            for (const row of data) {
              if (row.status_bayar === 'paid') {
                hasActiveViolation = true
                break
              }
              const isRecent = new Date(row.created_at).getTime() > (Date.now() - 15 * 60 * 1000)
              if (isRecent) {
                hasActiveViolation = true
                break
              } else {
                expiredIds.push(row.id)
              }
            }

            // Auto-cancel tagihan pending yang sudah lewat 15 menit
            if (expiredIds.length > 0) {
              supabase.from('peserta').update({ status_bayar: 'cancelled' }).in('id', expiredIds).then(() => {})
            }

            if (hasActiveViolation) {
              throw createError({ statusCode: 400, statusMessage: 'Sistem Anti-Calo: Email tersebut sudah terdaftar atau memiliki tagihan aktif.' })
            }
          }
        })
    )
  }

  if (eventData.settings?.is_anti_calo_wa && was.length > 0) {
    checks.push(
      supabase.from('peserta')
        .select('id, no_wa, status_bayar, created_at')
        .eq('event_id', body.event_id)
        .neq('status_bayar', 'cancelled')
        .in('no_wa', was)
        .then(async ({ data }) => {
          if (data && data.length > 0) {
            const expiredIds: any[] = []
            let hasActiveViolation = false

            for (const row of data) {
              if (row.status_bayar === 'paid') {
                hasActiveViolation = true
                break
              }
              const isRecent = new Date(row.created_at).getTime() > (Date.now() - 15 * 60 * 1000)
              if (isRecent) {
                hasActiveViolation = true
                break
              } else {
                expiredIds.push(row.id)
              }
            }

            // Auto-cancel tagihan pending yang sudah lewat 15 menit
            if (expiredIds.length > 0) {
              supabase.from('peserta').update({ status_bayar: 'cancelled' }).in('id', expiredIds).then(() => {})
            }

            if (hasActiveViolation) {
              throw createError({ statusCode: 400, statusMessage: 'Sistem Anti-Calo: Nomor WhatsApp tersebut sudah terdaftar atau memiliki tagihan aktif.' })
            }
          }
        })
    )
  }

  await Promise.all(checks);

  return { success: true }
})
