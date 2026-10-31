import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
async function main() {
  const event_id = 73 // Let's try to find an event ID or just query all peserta to see what's in there
  const { data: all } = await supabase.from('peserta').select('id, email, no_wa, event_id, status_bayar').order('id', {ascending: false}).limit(5)
  console.log("Recent peserta:", all)
  
  if (all && all.length > 0) {
    const p = all[0]
    const emails = [p.email]
    const was = [p.no_wa]
    const { data: checkEmail } = await supabase.from('peserta').select('email').eq('event_id', p.event_id).neq('status_bayar', 'cancelled').in('email', emails)
    console.log("Check email result:", checkEmail)
  }
  process.exit(0)
}
main()
