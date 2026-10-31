import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
async function run() {
  const { data, error } = await supabase.from('penarikan_dana').select('*')
  console.log("DATA:", data)
  console.log("ERROR:", error)
}
run()
