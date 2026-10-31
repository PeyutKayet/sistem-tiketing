import { createClient } from '@supabase/supabase-js'

const supabase = createClient('https://supabase.e-tiket.web.id', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q')

async function test() {
  const { data, error } = await supabase.from('organizer_profile').select('*')
  console.log('data', data)
  console.log('error', error)
}
test()
