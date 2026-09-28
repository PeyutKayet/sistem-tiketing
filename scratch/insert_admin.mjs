import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env file manually
const envPath = path.resolve('.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1]] = match[2].trim().replace(/['"]/g, '');
  }
});

const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const uid = '2452e4e7-6db3-449b-8d52-03f2a7ff5d22';
  
  // 1. Check if table exists by doing a simple select
  const { data, error: checkError } = await supabase.from('super_admins').select('*').limit(1);
  if (checkError) {
    console.log('TABLE_MISSING', checkError.message);
    process.exit(0);
  }

  // 2. Insert the UID
  const { error: insertError } = await supabase.from('super_admins').upsert({ user_id: uid });
  if (insertError) {
    console.log('INSERT_ERROR', insertError.message);
  } else {
    console.log('SUCCESS');
  }
}

run();
