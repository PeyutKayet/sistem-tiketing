import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY belum terisi di .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Argumen: node scripts/setup-b2b-survey.mjs <slug>
const targetSlug = process.argv[2]

if (!targetSlug) {
  console.log('Penggunaan: node scripts/setup-b2b-survey.mjs <slug_event>')
  console.log('Contoh: node scripts/setup-b2b-survey.mjs seminar-iou')
  process.exit(0)
}

async function setupSurvey() {
  console.log(`[B2B Setup] Mencari event dengan slug: "${targetSlug}"...`)
  const { data: eventRow, error: fetchErr } = await supabase
    .from('event')
    .select('id, nama_event, slug, settings')
    .eq('slug', targetSlug)
    .maybeSingle()

  if (fetchErr) {
    console.error('Database error:', fetchErr)
    process.exit(1)
  }

  if (!eventRow) {
    console.warn(`[Peringatan] Event dengan slug "${targetSlug}" tidak ditemukan di database.`)
    console.log('Pastikan event sudah dibuat terlebih dahulu di dashboard.')
    process.exit(1)
  }

  const existingSettings = eventRow.settings || {}

  const updatedSettings = {
    ...existingSettings,
    b2b_survey: {
      active: true,
      program_code: 'CALM_KHAZILMU',
      title: 'Survei Minat Program CALM – Khazilmu',
      pricing_tiers: [
        { tier: 1, label: 'Tahap 1', harga_reguler: 'Rp299.000', harga_eksklusif: 'Rp2.500.000', harga_reguler_num: 299000, harga_eksklusif_num: 2500000 },
        { tier: 2, label: 'Tahap 2', harga_reguler: 'Rp499.000', harga_eksklusif: 'Rp2.100.000', harga_reguler_num: 499000, harga_eksklusif_num: 2100000 },
        { tier: 3, label: 'Tahap 3', harga_reguler: 'Rp599.000', harga_eksklusif: 'Rp1.900.000', harga_reguler_num: 599000, harga_eksklusif_num: 1900000 },
        { tier: 4, label: 'Tahap 4', harga_reguler: 'Rp799.000', harga_eksklusif: 'Rp2.100.000', harga_reguler_num: 799000, harga_eksklusif_num: 2100000 },
        { tier: 5, label: 'Tahap 5', harga_reguler: 'Rp999.000', harga_eksklusif: 'Rp2.500.000', harga_reguler_num: 999000, harga_eksklusif_num: 2500000 }
      ]
    }
  }

  const { error: updErr } = await supabase
    .from('event')
    .update({ settings: updatedSettings })
    .eq('id', eventRow.id)

  if (updErr) {
    console.error('Gagal memperbarui settings event:', updErr)
    process.exit(1)
  }

  console.log(`✅ Sukses! Kuesioner B2B CALM Khazilmu aktif pada event: "${eventRow.nama_event}" (${eventRow.slug})`)
}

setupSurvey()
