import { d as defineEventHandler, w as getMethod, r as readBody, e as getQuery, y as getHeaders, z as getHeader, x as getEspayDatetime, t as getEspayTimestamp, A as verifyPaymentReportSignature, B as generatePaymentReportResponseSignature, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
import { promises } from 'fs';
import { createClient } from '@supabase/supabase-js';
import 'node:crypto';
import '@supabase/ssr';
import 'crypto';
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

const espay = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
  const method = getMethod(event);
  if (method === "GET" || method === "HEAD") {
    return { status: "ok", service: "Espay Payment Webhook", timestamp: (/* @__PURE__ */ new Date()).toISOString() };
  }
  const config = useRuntimeConfig();
  const espaySignatureKey = config.espaySignatureKey || process.env.ESPAY_SIGNATURE_KEY || "hme6w1tnjl15bsme";
  const commCode = config.espayCommCode || process.env.ESPAY_COMM_CODE || "SGWZULKARNAENALMUHAMMADY";
  let body = {};
  try {
    body = await readBody(event) || {};
  } catch {
    body = {};
  }
  const query = getQuery(event) || {};
  const payload = { ...query, ...body };
  promises.appendFile(
    "logs/webhook-debug.log",
    `
[${(/* @__PURE__ */ new Date()).toISOString()}] POST /api/webhook/espay
Headers: ${JSON.stringify(getHeaders(event))}
Payload: ${JSON.stringify(payload, null, 2)}
`
  ).catch(() => {
  });
  const isSnap = Boolean(
    payload.virtualAccountNo || payload.paymentRequestId || payload.partnerServiceId || getHeader(event, "x-signature") || getHeader(event, "channel-id")
  );
  const rqUuid = payload.rq_uuid || payload.inquiryRequestId || payload.paymentRequestId || getHeader(event, "x-external-id") || "";
  const rqDatetime = payload.rq_datetime || payload.trxDateInit || payload.trxDateTime || getHeader(event, "x-timestamp") || "";
  const orderId = payload.order_id || payload.virtualAccountNo || payload.partnerReferenceNo || ((_a = payload.additionalInfo) == null ? void 0 : _a.partnerReferenceNo) || ((_b = payload.additionalInfo) == null ? void 0 : _b.userId) || payload.referenceNo || payload.va_number || "";
  payload.signature || getHeader(event, "x-signature") || "";
  const paymentRef = payload.payment_ref || payload.trxId || ((_c = payload.additionalInfo) == null ? void 0 : _c.paymentRef) || ((_d = payload.additionalInfo) == null ? void 0 : _d.approvalCode) || ((_e = payload.additionalInfo) == null ? void 0 : _e.rrn) || payload.referenceNo || ((_f = payload.additionalInfo) == null ? void 0 : _f.referenceNo) || (rqUuid ? `REF-${rqUuid}` : `REF-${Date.now()}`);
  const paymentDate = payload.payment_date || payload.trx_date || payload.trxDateTime || (/* @__PURE__ */ new Date()).toISOString();
  const now = /* @__PURE__ */ new Date();
  const rsDatetime = getEspayDatetime(now);
  const reconcileDatetime = getEspayTimestamp(now);
  function findSimulasiOrder(id) {
    var _a2, _b2, _c2;
    if (!globalThis._simulasiOrders || !id) return null;
    if (globalThis._simulasiOrders.has(id)) {
      return globalThis._simulasiOrders.get(id);
    }
    for (const ord of globalThis._simulasiOrders.values()) {
      if (ord.order_id === id || ((_a2 = ord.payment) == null ? void 0 : _a2.va_number) === id || ((_b2 = ord.payment) == null ? void 0 : _b2.referenceNo) === id || ((_c2 = ord.payment) == null ? void 0 : _c2.qr_url) === id) {
        return ord;
      }
    }
    return null;
  }
  const simOrder = findSimulasiOrder(orderId) || findSimulasiOrder(payload.virtualAccountNo) || findSimulasiOrder(payload.order_id) || findSimulasiOrder(payload.partnerReferenceNo) || findSimulasiOrder((_g = payload.additionalInfo) == null ? void 0 : _g.partnerReferenceNo) || findSimulasiOrder(payload.referenceNo) || findSimulasiOrder((_h = payload.additionalInfo) == null ? void 0 : _h.referenceNo) || findSimulasiOrder(payload.va_number);
  if (simOrder) {
    simOrder.status = "paid";
    if (simOrder.payment) simOrder.payment.status = "paid";
    globalThis._simulasiOrders.set(simOrder.order_id, simOrder);
    if ((_i = simOrder.payment) == null ? void 0 : _i.va_number) {
      globalThis._simulasiOrders.set(simOrder.payment.va_number, simOrder);
    }
    console.log(`[Espay Webhook] In-memory simulation order ${simOrder.order_id} marked as PAID!`);
  }
  if (!isSnap) {
    const isSignatureValid = verifyPaymentReportSignature({
      signatureKey: espaySignatureKey,
      rq_datetime: rqDatetime,
      order_id: orderId,
      receivedSignature: payload.signature || "",
      rq_uuid: rqUuid
    });
    if (!payload.signature || !isSignatureValid) {
      console.error(`[Espay Webhook] Invalid Legacy Signature for order ${orderId}. Received: ${payload.signature}`);
      const failSig = generatePaymentReportResponseSignature({
        signatureKey: espaySignatureKey,
        rq_uuid: rqUuid,
        rs_datetime: rsDatetime,
        error_code: "0001"
      });
      return {
        rq_uuid: rqUuid,
        rs_datetime: rsDatetime,
        error_code: "0001",
        error_message: "Invalid Signature",
        signature: failSig,
        order_id: orderId,
        reconcile_id: paymentRef,
        reconcile_datetime: reconcileDatetime
      };
    }
  } else {
    const incomingPartner = payload.customerNo || ((_j = payload.additionalInfo) == null ? void 0 : _j.memberCode) || getHeader(event, "x-partner-id") || "";
    if (incomingPartner && incomingPartner.trim() !== commCode.trim()) {
      console.warn(`[Espay Webhook] Warning: Partner ID mismatch (${incomingPartner} vs ${commCode})`);
    }
  }
  const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey);
  const nowIso = (/* @__PURE__ */ new Date()).toISOString();
  let orderFound = false;
  try {
    const { data: ord, error: ordCheckErr } = await supabase.from("orders").select("id, data_transaksi").eq("id", orderId).maybeSingle();
    if (ord) {
      orderFound = true;
      const updatedTx = {
        ...ord.data_transaksi || {},
        espay_payment_data: {
          payment_ref: paymentRef,
          payment_date: paymentDate,
          rq_uuid: rqUuid,
          rq_datetime: rqDatetime,
          paid_at: nowIso
        }
      };
      await supabase.from("orders").update({
        status_pembayaran: "paid",
        status_dana: "CAIR",
        paid_at: nowIso,
        payment_reference: paymentRef,
        data_transaksi: updatedTx,
        updated_at: nowIso
      }).eq("id", orderId);
      console.log(`[Espay Webhook] Tabel orders ${orderId} berhasil diupdate ke status: paid`);
    }
  } catch (ordErr) {
    console.warn("[Espay Webhook] Warning: Update tabel orders terkendala:", ordErr);
  }
  let { data: pesertas, error: findErr } = await supabase.from("peserta").select("id, data_tambahan").or(`order_id.eq.${orderId},data_tambahan->>order_id.eq.${orderId}`);
  if (!pesertas || pesertas.length === 0) {
    const { data: byVa } = await supabase.from("peserta").select("id, data_tambahan").or(`data_tambahan->payment->espay_data->>va_number.eq.${orderId},data_tambahan->payment->>va_number.eq.${orderId}`);
    if (byVa && byVa.length > 0) {
      pesertas = byVa;
    }
  }
  if (!orderFound && (!pesertas || pesertas.length === 0) && !simOrder) {
    console.warn(`[Espay Webhook] Order ID tidak ditemukan di database: ${orderId}`);
    if (isSnap) {
      return {
        responseCode: "4042500",
        responseMessage: "Order ID Not Found"
      };
    }
    const notFoundSig = generatePaymentReportResponseSignature({
      signatureKey: espaySignatureKey,
      rq_uuid: rqUuid,
      rs_datetime: rsDatetime,
      error_code: "0002"
    });
    return {
      rq_uuid: rqUuid,
      rs_datetime: rsDatetime,
      error_code: "0002",
      error_message: "Order ID Not Found",
      signature: notFoundSig,
      order_id: orderId,
      reconcile_id: paymentRef,
      reconcile_datetime: reconcileDatetime
    };
  }
  if (pesertas && pesertas.length > 0) {
    const ids = pesertas.map((p) => p.id);
    let hasUpdateError = false;
    try {
      for (const p of pesertas) {
        const updatedDt = {
          ...p.data_tambahan,
          payment: {
            ...(_k = p.data_tambahan) == null ? void 0 : _k.payment,
            status: "paid",
            paid_at: nowIso,
            espay_payment_data: {
              payment_ref: paymentRef,
              payment_date: paymentDate,
              rq_uuid: rqUuid,
              rq_datetime: rqDatetime
            }
          }
        };
        const { error: singleErr } = await supabase.from("peserta").update({
          status_bayar: "paid",
          status_dana: "CAIR",
          data_tambahan: updatedDt
        }).eq("id", p.id);
        if (singleErr) hasUpdateError = true;
      }
    } catch (err) {
      hasUpdateError = true;
    }
    if (hasUpdateError) {
      await supabase.from("peserta").update({
        status_bayar: "paid",
        status_dana: "CAIR"
      }).in("id", ids);
    }
    console.log(`[Espay Webhook] Sukses melunaskan ${ids.length} tiket peserta untuk order ${orderId} (Payment Ref: ${paymentRef})`);
  }
  if (isSnap) {
    return {
      responseCode: "2002500",
      responseMessage: "Success",
      virtualAccountData: {
        partnerServiceId: payload.partnerServiceId || " Espay",
        customerNo: payload.customerNo || commCode,
        virtualAccountNo: orderId,
        paymentRequestId: payload.paymentRequestId || rqUuid
      }
    };
  }
  const successSig = generatePaymentReportResponseSignature({
    signatureKey: espaySignatureKey,
    rq_uuid: rqUuid,
    rs_datetime: rsDatetime,
    error_code: "0000"
  });
  return {
    rq_uuid: rqUuid,
    rs_datetime: rsDatetime,
    error_code: "0000",
    error_message: "Success",
    signature: successSig,
    order_id: orderId,
    reconcile_id: paymentRef,
    reconcile_datetime: reconcileDatetime
  };
});

export { espay as default };
//# sourceMappingURL=espay.mjs.map
