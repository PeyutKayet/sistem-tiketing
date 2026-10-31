import { d as defineEventHandler, c as checkSuperAdmin, s as serverSupabaseServiceRole } from '../../nitro/nitro.mjs';
import 'node:crypto';
import '@supabase/supabase-js';
import '@supabase/ssr';
import 'crypto';
import 'fs';
import 'path';
import 'qrcode';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:url';
import '@iconify/utils';
import 'consola';
import 'ipx';

const masterData = defineEventHandler(async (event) => {
  await checkSuperAdmin(event);
  const supabase = await serverSupabaseServiceRole(event);
  const { data: pData } = await supabase.from("peserta").select(`id, nama_lengkap, nama_tiket, created_at, kategori_tiket (harga), event (nama_event)`).eq("status_bayar", "paid").eq("status_dana", "PENDING").order("created_at", { ascending: true }).limit(500);
  const { data: wData } = await supabase.from("penarikan_dana").select(`id, nominal, bank_tujuan, rekening_tujuan, atas_nama, created_at, status, organizer_profile (nama_organizer)`).in("status", ["REQUEST", "PENDING"]).order("created_at", { ascending: true }).limit(200);
  return { pendingTransactions: pData || [], withdrawalRequests: wData || [] };
});

export { masterData as default };
//# sourceMappingURL=master-data.mjs.map
