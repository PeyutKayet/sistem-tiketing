// Just a simple script to check DB directly exactly like the checkout logic
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
async function main() {
  const event_id = 73 // we need to know the actual event id
  // Let's just fetch the latest event
  const {data: ev} = await supabase.from('event').select('id, settings').order('id', {ascending: false}).limit(1)
  const eventData = ev[0]
  console.log("Event:", eventData.id, eventData.settings.is_anti_calo_email)
  
  // Now let's see the latest peserta for this event
  const {data: p} = await supabase.from('peserta').select('email, no_wa').eq('event_id', eventData.id).limit(2)
  console.log("Peserta in DB:", p)
  
  if (p && p.length > 0) {
    const emails = [p[0].email]
    const was = [p[0].no_wa]
    
    // Check against DB
    const { data } = await supabase.from('peserta').select('email').eq('event_id', eventData.id).neq('status_bayar', 'cancelled').in('email', emails)
    console.log("Match email:", data)
    
    const { data: datawa } = await supabase.from('peserta').select('no_wa').eq('event_id', eventData.id).neq('status_bayar', 'cancelled').in('no_wa', was)
    console.log("Match wa:", datawa)
  }
  process.exit(0)
}
main()
