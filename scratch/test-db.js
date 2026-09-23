import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
const { data, error } = await supabase.from('kategori_tiket').select('*').limit(5)
console.log(JSON.stringify(error || data, null, 2))
