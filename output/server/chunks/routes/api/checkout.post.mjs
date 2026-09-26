import { s as setCookie, a as setHeader, u as useRuntimeConfig, b as getHeader, d as defineEventHandler, r as readBody, c as createError } from '../../nitro/nitro.mjs';
import { createServerClient, parseCookieHeader } from '@supabase/ssr';
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

async function fetchWithRetry(req, init) {
  const retries = 3;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fetch(req, init);
    } catch (error) {
      if (init?.signal?.aborted) {
        throw error;
      }
      if (attempt === retries) {
        const { headers: _headers, ...safeInit } = init ?? {};
        console.error(`Error fetching request ${req}`, error, safeInit);
        throw error;
      }
      console.warn(`Retrying fetch attempt ${attempt + 1} for request: ${req}`);
      await new Promise((resolve) => setTimeout(resolve, 100 * attempt));
    }
  }
  throw new Error("Unreachable code");
}

function setCookies(event, cookies, headers = {}) {
  const response = event.node.res;
  const headersWritable = () => !response.headersSent && !response.writableEnded;
  if (!headersWritable()) {
    return;
  }
  for (const { name, value, options } of cookies) {
    if (!headersWritable()) {
      break;
    }
    setCookie(event, name, value, options);
  }
  for (const [key, value] of Object.entries(headers)) {
    if (!headersWritable()) {
      break;
    }
    setHeader(event, key, value);
  }
}

const serverSupabaseClient = async (event) => {
  if (!event.context._supabaseClient) {
    const {
      url,
      key,
      cookiePrefix,
      cookieOptions,
      clientOptions: { auth = {}, global = {} }
    } = useRuntimeConfig(event).public.supabase;
    event.context._supabaseClient = createServerClient(url, key, {
      auth,
      cookies: {
        getAll: () => parseCookieHeader(getHeader(event, "Cookie") ?? ""),
        setAll: (cookies, headers) => setCookies(event, cookies, headers)
      },
      cookieOptions: {
        ...cookieOptions,
        name: cookiePrefix
      },
      global: {
        fetch: fetchWithRetry,
        ...global
      }
    });
  }
  return event.context._supabaseClient;
};

const checkout_post = defineEventHandler(async (event) => {
  var _a, _b;
  const body = await readBody(event);
  if (!body || !body.peserta || !body.peserta.length || !body.event_id || !body.kategori_id) {
    throw createError({ statusCode: 400, statusMessage: "Bad Request: Missing required data" });
  }
  const supabase = await serverSupabaseClient(event);
  const config = useRuntimeConfig();
  const { data: eventData, error: eventErr } = await supabase.from("event").select("settings, nama_event").eq("id", body.event_id).single();
  if (eventErr || !eventData) {
    throw createError({ statusCode: 404, statusMessage: "Event tidak ditemukan" });
  }
  const { data: kategori, error: katErr } = await supabase.from("kategori_tiket").select("harga, nama_kategori").eq("id", body.kategori_id).single();
  if (katErr || !kategori) {
    throw createError({ statusCode: 404, statusMessage: "Kategori tiket tidak ditemukan" });
  }
  const isKaseraActive = ((_a = eventData.settings) == null ? void 0 : _a.is_kasera_active) === true;
  const hargaTiketTotal = Number(kategori.harga) * body.peserta.length;
  const uniqueOrderId = `TRX-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  let finalResponse = {
    status: "success",
    order_id: uniqueOrderId,
    checkout_url: ""
  };
  let adminFee = 0;
  let gatewayFee = 0;
  let totalAmount = hargaTiketTotal;
  if (isKaseraActive) {
    adminFee = 2e3;
    const netAmount = hargaTiketTotal + adminFee;
    totalAmount = Math.ceil((netAmount + 250) / (1 - 7e-3));
    gatewayFee = totalAmount - netAmount;
    try {
      const kaseraPayload = {
        amount: totalAmount,
        description: `Tiket ${eventData.nama_event} (${body.peserta.length} Pax)`,
        external_id: uniqueOrderId,
        merchant_ref: uniqueOrderId,
        customer: {
          // Ambil nama dari peserta pertama sebagai perwakilan
          name: body.peserta[0].nama_lengkap,
          email: body.peserta[0].email && body.peserta[0].email.includes("@") ? body.peserta[0].email : "no-reply@e-tiket.web.id",
          phone: body.peserta[0].no_wa ? body.peserta[0].no_wa.startsWith("+") ? body.peserta[0].no_wa : "+" + body.peserta[0].no_wa : ""
        },
        return_url: `http://localhost:3000/tiket/${uniqueOrderId}`
      };
      const kaseraRes = await $fetch("https://pay.kasera.id/v1/transactions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${config.kaseraApiKey}`,
          "Idempotency-Key": uniqueOrderId
        },
        body: kaseraPayload
      });
      finalResponse.checkout_url = kaseraRes.checkout_url;
    } catch (error) {
      const kaseraData = (_b = error.response) == null ? void 0 : _b._data;
      console.error("Kasera Error Lengkap:", kaseraData || error.message);
      const detailError = kaseraData ? JSON.stringify(kaseraData) : error.message;
      throw createError({ statusCode: 500, statusMessage: `Gagal Kasera: ${detailError}` });
    }
  } else {
    const fonnteToken = config.fonnteToken || "JM3pexhRKQu9h5DHQ7Cg";
    const adminPhone = config.adminPhone || "6285156575710";
    const adminVerifyUrl = "https://saas.e-tiket.web.id/admin-verify";
    const pesanAdmin = `\u{1F6A8} *PESANAN BARU MASUK*
Event: ${eventData.nama_event}
Order ID: ${uniqueOrderId}
Total Transfer: *Rp ${hargaTiketTotal.toLocaleString("id-ID")}*

Cek & Verifikasi disini:
${adminVerifyUrl}?id=${uniqueOrderId}`;
    const formData = new FormData();
    formData.append("target", adminPhone);
    formData.append("message", pesanAdmin);
    $fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: { "Authorization": fonnteToken },
      body: formData
    }).catch((e) => console.error("Fonnte WA Error", e));
  }
  const payloadSupabase = body.peserta.map((p) => {
    let dataTambahan = {
      ...p.data_tambahan,
      // Custom form fields, etc.
      ticket_id: p.ticket_id,
      // e.g. KOP-260924-XXXX
      order_id: uniqueOrderId,
      // Grouping ID for Kasera
      payment: {
        gateway: isKaseraActive ? "kasera" : "manual",
        admin_fee: adminFee,
        gateway_fee: gatewayFee,
        total_amount: totalAmount
      }
    };
    if (isKaseraActive) {
      dataTambahan.payment.checkout_url = finalResponse.checkout_url;
    }
    return {
      event_id: body.event_id,
      kategori_id: body.kategori_id,
      nama_lengkap: p.nama_lengkap,
      email: p.email,
      no_wa: p.no_wa,
      nama_tiket: kategori.nama_kategori,
      status_bayar: "pending",
      bukti_bayar_url: body.bukti_bayar_url || null,
      // Untuk logika manual
      data_tambahan: dataTambahan
    };
  });
  const { error: insertErr } = await supabase.from("peserta").insert(payloadSupabase);
  if (insertErr) {
    console.error("Insert DB Error:", insertErr);
    throw createError({ statusCode: 500, statusMessage: "Gagal menyimpan pesanan ke database" });
  }
  return finalResponse;
});

export { checkout_post as default };
//# sourceMappingURL=checkout.post.mjs.map
