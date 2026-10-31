import { serverSupabaseServiceRole } from '#supabase/server'

// Rate limiting untuk mencegah brute force PIN (max 5 percobaan salah per event)
const pinAttemptMap = new Map<string, { count: number; lockedUntil: number }>()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body || !body.event_id || !body.pin) {
    throw createError({ statusCode: 400, statusMessage: 'Event ID dan PIN wajib diisi.' })
  }

  const rateLimitKey = `pin_${body.event_id}`
  const now = Date.now()
  const attempt = pinAttemptMap.get(rateLimitKey)

  // Cek apakah sedang dalam masa lockout akibat salah 5x berturut-turut
  if (attempt && attempt.lockedUntil > now) {
    const sisa = Math.ceil((attempt.lockedUntil - now) / 1000)
    throw createError({ 
      statusCode: 429, 
      statusMessage: `Terlalu banyak percobaan PIN salah. Akses scanner dikunci sementara (${sisa} detik lagi).` 
    })
  }

  const supabase = await serverSupabaseServiceRole(event)

  // 1. Ambil data event
  const { data: eventData, error: eventErr } = await supabase
    .from('event')
    .select('id, organizer_id')
    .eq('id', body.event_id)
    .single()

  if (eventErr || !eventData) {
    throw createError({ statusCode: 404, statusMessage: 'Event tidak ditemukan.' })
  }

  // 2. Ambil PIN resmi dari profil organizer (Bypass RLS dengan Service Role)
  const { data: orgData, error: orgErr } = await supabase
    .from('organizer_profile')
    .select('pin_scanner')
    .eq('id', eventData.organizer_id)
    .single()

  if (orgErr || !orgData) {
    throw createError({ statusCode: 404, statusMessage: 'Profil penyelenggara tidak ditemukan.' })
  }

  const correctPin = orgData.pin_scanner

  // 3. Validasi ketat: Tolak jika PIN belum diset atau masih menggunakan default '123456'
  if (!correctPin || correctPin === '123456') {
    throw createError({ 
      statusCode: 403, 
      statusMessage: 'Penyelenggara belum mengatur PIN Scanner kustom. Silakan atur PIN 6 digit di Pengaturan Dashboard Admin.' 
    })
  }

  if (body.pin !== correctPin) {
    const currentCount = (attempt && attempt.lockedUntil <= now ? 0 : (attempt?.count || 0)) + 1
    if (currentCount >= 5) {
      pinAttemptMap.set(rateLimitKey, { count: currentCount, lockedUntil: now + 120_000 }) // lock 2 menit
      throw createError({ 
        statusCode: 429, 
        statusMessage: 'Terlalu banyak percobaan PIN salah. Akses scanner dikunci sementara selama 2 menit.' 
      })
    } else {
      pinAttemptMap.set(rateLimitKey, { count: currentCount, lockedUntil: 0 })
      throw createError({ statusCode: 403, statusMessage: `PIN Scanner tidak valid. (Sisa percobaan: ${5 - currentCount})` })
    }
  }

  // Jika PIN benar, bersihkan counter percobaan
  pinAttemptMap.delete(rateLimitKey)

  return { valid: true }
})
