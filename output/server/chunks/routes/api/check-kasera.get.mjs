import { d as defineEventHandler, g as getQuery, c as createError, u as useRuntimeConfig } from '../../nitro/nitro.mjs';
import { createClient } from '@supabase/supabase-js';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@iconify/utils';
import 'consola';
import 'ipx';

const checkKasera_get = defineEventHandler(async (event) => {
  var _a, _b;
  const query = getQuery(event);
  const orderId = query.order_id;
  if (!orderId) {
    throw createError({ statusCode: 400, statusMessage: "Missing order_id" });
  }
  const config = useRuntimeConfig();
  const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);
  const { data: pesertas, error: findErr } = await supabase.from("peserta").select("id, status_bayar, data_tambahan").eq("data_tambahan->>order_id", orderId);
  if (findErr || !pesertas || pesertas.length === 0) {
    throw createError({ statusCode: 404, statusMessage: "Order not found" });
  }
  const perwakilan = pesertas[0];
  if (perwakilan.status_bayar === "paid") {
    return { status: "already_paid" };
  }
  if (((_b = (_a = perwakilan.data_tambahan) == null ? void 0 : _a.payment) == null ? void 0 : _b.gateway) !== "kasera") {
    return { status: "not_kasera_transaction" };
  }
  const ids = pesertas.map((p) => p.id);
  try {
    const kaseraRes = await $fetch(`https://pay.kasera.id/v1/transactions?external_id=${orderId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${config.kaseraApiKey}`
      }
    });
    const statusData = Array.isArray(kaseraRes) ? kaseraRes[0] : kaseraRes;
    if (statusData && statusData.status === "succeeded") {
      await supabase.from("peserta").update({ status_bayar: "paid" }).in("id", ids);
      return { status: "success", payment_status: "paid" };
    } else {
      return { status: "pending", payment_status: (statusData == null ? void 0 : statusData.status) || "pending" };
    }
  } catch (error) {
    console.error("Gagal sinkronisasi dengan Kasera:", error.message);
    throw createError({ statusCode: 500, statusMessage: "Gagal mengecek status" });
  }
});

export { checkKasera_get as default };
//# sourceMappingURL=check-kasera.get.mjs.map
