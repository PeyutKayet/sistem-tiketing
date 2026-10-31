import { d as defineEventHandler, e as getQuery, a as createError, u as useRuntimeConfig } from '../../nitro/nitro.mjs';
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

const checkEspay_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q;
  const query = getQuery(event);
  const orderId = query.order_id;
  if (!orderId) {
    throw createError({ statusCode: 400, statusMessage: "Missing order_id" });
  }
  let simOrder = (_a = globalThis._simulasiOrders) == null ? void 0 : _a.get(orderId);
  if (!simOrder && globalThis._simulasiOrders) {
    for (const ord of globalThis._simulasiOrders.values()) {
      if (ord.order_id === orderId || ((_b = ord.payment) == null ? void 0 : _b.va_number) === orderId) {
        simOrder = ord;
        break;
      }
    }
  }
  if (simOrder) {
    if (query.simulate_pay === "true") {
      simOrder.status = "paid";
      if (simOrder.payment) simOrder.payment.status = "paid";
      (_c = globalThis._simulasiOrders) == null ? void 0 : _c.set(simOrder.order_id, simOrder);
      if ((_d = simOrder.payment) == null ? void 0 : _d.va_number) {
        (_e = globalThis._simulasiOrders) == null ? void 0 : _e.set(simOrder.payment.va_number, simOrder);
      }
      return {
        status: "paid",
        order_id: simOrder.order_id,
        ticket_count: 1,
        simulated: true,
        payment: simOrder.payment,
        order: simOrder
      };
    }
    return {
      status: simOrder.status || "pending",
      order_id: simOrder.order_id,
      ticket_count: 1,
      payment: simOrder.payment,
      order: simOrder,
      created_at: simOrder.created_at
    };
  }
  const config = useRuntimeConfig();
  const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);
  try {
    const { data: orderRow } = await supabase.from("orders").select("id, status_pembayaran, status_dana, total_tagihan, data_transaksi, created_at, paid_at").eq("id", orderId).maybeSingle();
    if (orderRow) {
      if (orderRow.status_pembayaran === "paid") {
        return {
          status: "paid",
          order_id: orderId,
          payment: orderRow.data_transaksi || null,
          paid_at: orderRow.paid_at
        };
      }
      if (orderRow.status_pembayaran === "cancelled") {
        return {
          status: "cancelled",
          order_id: orderId,
          message: "Pesanan telah dibatalkan."
        };
      }
      const isManualBackup = ((_f = orderRow.data_transaksi) == null ? void 0 : _f.gateway) === "manual" || ((_g = orderRow.data_transaksi) == null ? void 0 : _g.tipe_gateway) === "manual_tyket" || ((_h = orderRow.data_transaksi) == null ? void 0 : _h.gateway) === "manual_tyket" || orderRow.metode_pembayaran === "qris_backup_tyket" || orderRow.metode_pembayaran === "manual";
      if (isManualBackup) {
        return {
          status: orderRow.status_pembayaran || "pending",
          order_id: orderId,
          is_manual: true,
          tipe_gateway: "manual_tyket",
          payment: orderRow.data_transaksi || null,
          created_at: orderRow.created_at
        };
      }
      const createdTime2 = orderRow.created_at ? new Date(orderRow.created_at).getTime() : Date.now();
      const expiresAt2 = createdTime2 + 15 * 60 * 1e3;
      const isExpired2 = Date.now() > expiresAt2;
      if (isExpired2) {
        await supabase.from("orders").update({ status_pembayaran: "cancelled" }).eq("id", orderId);
        await supabase.from("peserta").update({ status_bayar: "cancelled" }).or(`order_id.eq.${orderId},data_tambahan->>order_id.eq.${orderId}`);
        return {
          status: "expired",
          order_id: orderId,
          message: "Batas waktu pembayaran (15 menit) telah habis. Pesanan dibatalkan."
        };
      }
      const remainingSeconds2 = Math.max(0, Math.floor((expiresAt2 - Date.now()) / 1e3));
      return {
        status: "pending",
        order_id: orderId,
        payment: orderRow.data_transaksi || null,
        created_at: orderRow.created_at,
        remaining_seconds: remainingSeconds2
      };
    }
  } catch (ordCheckErr) {
    console.warn("Pengecekan tabel orders gagal, fallback ke tabel peserta:", ordCheckErr);
  }
  const { data: pesertas, error: findErr } = await supabase.from("peserta").select("id, status_bayar, data_tambahan, created_at").or(`order_id.eq.${orderId},data_tambahan->>order_id.eq.${orderId}`);
  if (findErr || !pesertas || pesertas.length === 0) {
    return { status: "not_found" };
  }
  const perwakilan = pesertas[0];
  if (perwakilan.status_bayar === "paid") {
    return {
      status: "paid",
      order_id: orderId,
      ticket_count: pesertas.length,
      payment: ((_i = perwakilan.data_tambahan) == null ? void 0 : _i.payment) || null
    };
  }
  if (perwakilan.status_bayar === "cancelled") {
    return {
      status: "cancelled",
      order_id: orderId,
      message: "Pesanan telah dibatalkan."
    };
  }
  const isPesertaManual = ((_k = (_j = perwakilan.data_tambahan) == null ? void 0 : _j.payment) == null ? void 0 : _k.gateway) === "manual" || ((_m = (_l = perwakilan.data_tambahan) == null ? void 0 : _l.payment) == null ? void 0 : _m.tipe_gateway) === "manual_tyket" || ((_o = (_n = perwakilan.data_tambahan) == null ? void 0 : _n.payment) == null ? void 0 : _o.channel) === "qris_backup_tyket";
  if (isPesertaManual) {
    return {
      status: perwakilan.status_bayar || "pending",
      order_id: orderId,
      is_manual: true,
      tipe_gateway: "manual_tyket",
      ticket_count: pesertas.length,
      payment: ((_p = perwakilan.data_tambahan) == null ? void 0 : _p.payment) || null,
      created_at: perwakilan.created_at
    };
  }
  const createdTime = perwakilan.created_at ? new Date(perwakilan.created_at).getTime() : Date.now();
  const expiresAt = createdTime + 15 * 60 * 1e3;
  const isExpired = Date.now() > expiresAt;
  if (isExpired) {
    const ids = pesertas.map((p) => p.id);
    await supabase.from("peserta").update({ status_bayar: "cancelled" }).in("id", ids);
    return {
      status: "expired",
      order_id: orderId,
      message: "Batas waktu pembayaran (15 menit) telah habis. Pesanan dibatalkan."
    };
  }
  const remainingSeconds = Math.max(0, Math.floor((expiresAt - Date.now()) / 1e3));
  return {
    status: "pending",
    order_id: orderId,
    ticket_count: pesertas.length,
    payment: ((_q = perwakilan.data_tambahan) == null ? void 0 : _q.payment) || null,
    created_at: perwakilan.created_at,
    remaining_seconds: remainingSeconds
  };
});

export { checkEspay_get as default };
//# sourceMappingURL=check-espay.get.mjs.map
