import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://supabase.e-tiket.web.id'
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  const hariIni = new Date()
  hariIni.setHours(0,0,0,0)
  
  console.log("hariIni.toISOString():", hariIni.toISOString())

  const { data, error } = await supabase
    .from('event')
    .select('id, slug, nama_event, tanggal_mulai, lokasi, poster_url, status, is_archived')
    .neq('is_archived', true)
    .neq('status', 'finished')
    .gte('tanggal_mulai', hariIni.toISOString())

  console.log('Data:', JSON.stringify(data, null, 2))
  if (error) console.error('Error:', error)
}

test()
