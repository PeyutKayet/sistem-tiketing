import { d as defineEventHandler, e as getQuery, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
import { createClient } from '@supabase/supabase-js';
import 'node:crypto';
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

const pricingTier_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  const query = getQuery(event);
  const eventId = query.event_id;
  const slug = query.slug;
  const config = useRuntimeConfig();
  const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);
  const defaultTiers = [
    { tier: 1, label: "Tahap 1", harga_reguler: "Rp299.000", harga_eksklusif: "Rp2.500.000", harga_reguler_num: 299e3, harga_eksklusif_num: 25e5 },
    { tier: 2, label: "Tahap 2", harga_reguler: "Rp499.000", harga_eksklusif: "Rp2.100.000", harga_reguler_num: 499e3, harga_eksklusif_num: 21e5 },
    { tier: 3, label: "Tahap 3", harga_reguler: "Rp599.000", harga_eksklusif: "Rp1.900.000", harga_reguler_num: 599e3, harga_eksklusif_num: 19e5 },
    { tier: 4, label: "Tahap 4", harga_reguler: "Rp799.000", harga_eksklusif: "Rp2.100.000", harga_reguler_num: 799e3, harga_eksklusif_num: 21e5 },
    { tier: 5, label: "Tahap 5", harga_reguler: "Rp999.000", harga_eksklusif: "Rp2.500.000", harga_reguler_num: 999e3, harga_eksklusif_num: 25e5 }
  ];
  let resolvedEventId = eventId;
  let customTiers = null;
  if (!resolvedEventId && slug) {
    const { data: ev } = await supabase.from("event").select("id, settings").eq("slug", slug).maybeSingle();
    if (ev) {
      resolvedEventId = ev.id;
      customTiers = ((_b = (_a = ev.settings) == null ? void 0 : _a.b2b_survey) == null ? void 0 : _b.pricing_tiers) || null;
    }
  } else if (resolvedEventId) {
    const { data: ev } = await supabase.from("event").select("settings").eq("id", resolvedEventId).maybeSingle();
    if (ev) {
      customTiers = ((_d = (_c = ev.settings) == null ? void 0 : _c.b2b_survey) == null ? void 0 : _d.pricing_tiers) || null;
    }
  }
  const activeTiers = customTiers && Array.isArray(customTiers) && customTiers.length > 0 ? customTiers : defaultTiers;
  let count = 0;
  if (resolvedEventId) {
    const { count: total, error } = await supabase.from("peserta").select("*", { count: "exact", head: true }).eq("event_id", resolvedEventId);
    if (!error && typeof total === "number") {
      count = total;
    }
  }
  const tierIndex = count % activeTiers.length;
  const assignedTier = activeTiers[tierIndex];
  return {
    success: true,
    total_respondents_so_far: count,
    assigned_tier: assignedTier,
    tier_number: assignedTier.tier || tierIndex + 1
  };
});

export { pricingTier_get as default };
//# sourceMappingURL=pricing-tier.get.mjs.map
