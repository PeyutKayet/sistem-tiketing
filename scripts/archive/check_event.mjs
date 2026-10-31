import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
async function main() {
  const { data } = await supabase.from('event').select('nama_event, settings').limit(1)
  console.log(JSON.stringify(data, null, 2))
  process.exit(0)
}
main()
