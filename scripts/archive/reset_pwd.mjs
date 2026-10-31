import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://supabase.e-tiket.web.id'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function resetPwd() {
  console.log('Mengubah password...')
  const { data, error } = await supabase.auth.admin.updateUserById(
    '2452e4e7-6db3-449b-8d52-03f2a7ff5d22',
    { password: 'PasswordBaru123!' }
  )
  if (error) {
    console.error('Error:', error.message)
  } else {
    console.log('Sukses mengubah password untuk:', data.user.email)
  }
}

resetPwd()
