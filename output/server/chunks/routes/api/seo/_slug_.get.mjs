import { l as defineCachedEventHandler, o as getRouterParam } from '../../../nitro/nitro.mjs';
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

const _slug__get = defineCachedEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug");
  if (!slug) return null;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  const publicUrl = process.env.SUPABASE_URL || "https://supabase.e-tiket.web.id";
  const tryFetchEvent = async (baseUrl) => {
    try {
      const res = await fetch(`${baseUrl}/rest/v1/event?slug=eq.${slug}&select=id,nama_event,deskripsi,poster_url,tanggal_mulai,lokasi,organizer_id,settings`, {
        headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
        signal: AbortSignal.timeout(2500)
      });
      if (res.ok) {
        const json = await res.json();
        return json.length > 0 ? json[0] : null;
      }
    } catch (e) {
      return null;
    }
    return null;
  };
  const tryFetchOrganizer = async (baseUrl, orgId) => {
    try {
      const res = await fetch(`${baseUrl}/rest/v1/organizer_profile?id=eq.${orgId}&select=nama_organizer,no_wa,link_ig,link_web,logo_url`, {
        headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
        signal: AbortSignal.timeout(2500)
      });
      if (res.ok) {
        const json = await res.json();
        return json.length > 0 ? json[0] : null;
      }
    } catch (e) {
      return null;
    }
    return null;
  };
  try {
    const targetUrl = publicUrl || "https://supabase.e-tiket.web.id";
    const eventData = await tryFetchEvent(targetUrl);
    if (!eventData) return null;
    if (eventData.organizer_id) {
      eventData.organizer_profile = await tryFetchOrganizer(targetUrl, eventData.organizer_id);
    }
    return eventData;
  } catch (err) {
    console.error("SEO API Fatal Error:", err);
    return null;
  }
}, {
  maxAge: 60 * 5 ,
  // Dev: 1 detik, Prod: 5 menit
  name: "seo-data",
  getKey: (event) => getRouterParam(event, "slug") || "default"
});

export { _slug__get as default };
//# sourceMappingURL=_slug_.get.mjs.map
