import { d as defineEventHandler, r as readBody, a as createError, h as requestEspayQris, i as requestEspayVirtualAccount } from '../../nitro/nitro.mjs';
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

if (!globalThis._simulasiOrders) {
  globalThis._simulasiOrders = /* @__PURE__ */ new Map();
}
const simulasiCreate_post = defineEventHandler(async (event) => {
  const body = await readBody(event) || {};
  const method = body.method || "qris";
  const ticketAmount = Math.max(1e3, Number(body.amount || 1e4));
  const platformFee = 2e3;
  const netAmount = ticketAmount + platformFee;
  const customerName = body.customerName || "Budi Santoso";
  const customerEmail = body.customerEmail || "tester@tyket.id";
  const customerPhone = body.customerPhone || "081234567890";
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const orderId = `SIM${Date.now().toString().slice(-6)}${randomSuffix}`;
  let gatewayResult = null;
  let gatewayFee = 0;
  let totalAmount = 0;
  let paymentType = "qris";
  let bankCode = "008";
  if (method === "qris") {
    paymentType = "qris";
    gatewayFee = Math.round(netAmount * 63e-4);
    totalAmount = netAmount + gatewayFee;
  } else if (method.startsWith("va")) {
    paymentType = "va";
    if (method.includes("bni")) bankCode = "009";
    else if (method.includes("bri")) bankCode = "002";
    else if (method.includes("mandiri")) bankCode = "008";
    gatewayFee = bankCode === "009" ? 3330 : 2775;
    totalAmount = netAmount + gatewayFee;
  } else {
    throw createError({
      statusCode: 400,
      statusMessage: `Metode pembayaran ${method} tidak didukung.`
    });
  }
  const orderData = {
    order_id: orderId,
    status: "pending",
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    customer: {
      nama_lengkap: customerName,
      email: customerEmail,
      no_wa: customerPhone
    },
    ticket: {
      nama_event: "Festival Musik Tyket 2026 (Simulasi Sandbox)",
      nama_kategori: "Tiket Regular Presale (Simulasi)",
      ticket_id: `TKT-${orderId}`,
      ticket_price: ticketAmount,
      ticket_count: 1
    },
    payment: {
      gateway: "espay",
      channel: method,
      payment_type: paymentType,
      ticket_amount: ticketAmount,
      platform_fee: platformFee,
      gateway_fee: gatewayFee,
      total_amount: totalAmount,
      is_simulator: false,
      bank_code: bankCode,
      bank_name: bankCode === "009" ? "BNI Virtual Account" : bankCode === "002" ? "BRI Virtual Account (BRIVA)" : "Mandiri Virtual Account",
      va_number: null,
      expired: null,
      validity_period: "15"
    }
  };
  globalThis._simulasiOrders.set(orderId, orderData);
  if (method === "qris") {
    gatewayResult = await requestEspayQris({
      orderId,
      amount: netAmount,
      customerName,
      customerEmail,
      customerPhone,
      merchantId: body.merchantId,
      disableFallback: true
    });
    if (!gatewayResult.success) {
      globalThis._simulasiOrders.delete(orderId);
      return {
        status: "error",
        message: gatewayResult.errorMessage || "Gagal menerbitkan QRIS dari Espay",
        debug: gatewayResult.debug || null
      };
    }
    gatewayFee = gatewayResult.fee || gatewayFee;
    totalAmount = gatewayResult.totalAmount || totalAmount;
  } else if (method.startsWith("va")) {
    gatewayResult = await requestEspayVirtualAccount({
      orderId,
      amount: netAmount,
      bankCode,
      customerName,
      customerEmail,
      customerPhone,
      merchantId: body.merchantId,
      disableFallback: true
    });
    if (!gatewayResult.success) {
      globalThis._simulasiOrders.delete(orderId);
      return {
        status: "error",
        message: gatewayResult.errorMessage || "Gagal menerbitkan Virtual Account dari Espay",
        debug: gatewayResult.debug || null
      };
    }
    gatewayFee = gatewayResult.fee || gatewayFee;
    totalAmount = gatewayResult.totalAmount || totalAmount;
  }
  orderData.payment.is_simulator = gatewayResult.isSimulator || false;
  orderData.payment.gateway_fee = gatewayFee;
  orderData.payment.total_amount = totalAmount;
  orderData.payment.qr_image = gatewayResult.qrImage || null;
  orderData.payment.qr_url = gatewayResult.qrUrl || null;
  orderData.payment.qr_content = gatewayResult.qrContent || null;
  orderData.payment.va_number = gatewayResult.vaNumber || null;
  orderData.payment.bank_code = gatewayResult.bankCode || bankCode;
  orderData.payment.bank_name = gatewayResult.bankName || orderData.payment.bank_name;
  orderData.payment.expired = gatewayResult.expired || null;
  orderData.payment.validity_period = gatewayResult.validityPeriod || "15";
  globalThis._simulasiOrders.set(orderId, orderData);
  if (gatewayResult.vaNumber) {
    globalThis._simulasiOrders.set(gatewayResult.vaNumber, orderData);
  }
  if (gatewayResult.referenceNo) {
    globalThis._simulasiOrders.set(gatewayResult.referenceNo, orderData);
  }
  return {
    ...orderData,
    status: "success",
    order_status: orderData.status,
    order_id: orderId,
    payment_type: paymentType,
    total_amount: totalAmount,
    amount: ticketAmount,
    ticket_count: 1,
    admin_fee: platformFee,
    fee: gatewayFee,
    qr_image: gatewayResult.qrImage || null,
    qr_url: gatewayResult.qrUrl || null,
    qr_content: gatewayResult.qrContent || null,
    va_number: gatewayResult.vaNumber || null,
    bank_code: gatewayResult.bankCode || null,
    bank_name: gatewayResult.bankName || null,
    expired: gatewayResult.expired || null,
    validity_period: gatewayResult.validityPeriod || "15",
    debug: gatewayResult.debug || null,
    payment: {
      ...orderData.payment,
      order_id: orderId,
      amount: ticketAmount,
      debug: gatewayResult.debug || null
    }
  };
});

export { simulasiCreate_post as default };
//# sourceMappingURL=simulasi-create.post.mjs.map
