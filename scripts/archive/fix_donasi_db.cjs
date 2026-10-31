const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  'https://supabase.e-tiket.web.id',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q'
);

async function main() {
  // Ambil semua peserta yang punya infaqNominal > 0
  const { data: pesertaList, error } = await supabase
    .from('peserta')
    .select('id, event_id, data_tambahan');
    
  if (error) {
    console.error("Error fetching peserta:", error);
    return;
  }
  
  // Ambil semua event untuk mengecek apakah donasinya aktif
  const { data: events, error: errEvents } = await supabase
    .from('event')
    .select('id, settings');
    
  let fixedCount = 0;
  
  for (const p of pesertaList) {
    if (!p.data_tambahan) continue;
    const infaq = p.data_tambahan.infaqNominal;
    
    if (infaq && infaq > 0) {
      const ev = events.find(e => e.id === p.event_id);
      const isDonasiActive = ev && ev.settings && ev.settings.is_donasi_active === true;
      
      // Jika donasi tidak aktif, ATAU nilai infaqNominal ini mencurigakan (sama dengan total_amount)
      // Mari kita reset ke 0.
      
      const totalAmount = p.data_tambahan.payment ? p.data_tambahan.payment.total_amount : 0;
      
      if (!isDonasiActive || infaq == totalAmount) {
        console.log(`Fixing peserta ${p.id} (infaq: ${infaq} -> 0)`);
        p.data_tambahan.infaqNominal = 0;
        
        await supabase
          .from('peserta')
          .update({ data_tambahan: p.data_tambahan })
          .eq('id', p.id);
          
        fixedCount++;
      }
    }
  }
  
  console.log(`Berhasil memperbaiki data donasi untuk ${fixedCount} peserta.`);
}

main();
