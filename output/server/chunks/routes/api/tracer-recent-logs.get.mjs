import { d as defineEventHandler, c as checkSuperAdmin } from '../../nitro/nitro.mjs';
import fs from 'fs';
import path from 'path';
import 'node:crypto';
import '@supabase/supabase-js';
import '@supabase/ssr';
import 'crypto';
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

const tracerRecentLogs_get = defineEventHandler(async (event) => {
  await checkSuperAdmin(event);
  const logPath = path.resolve(process.cwd(), "logs/webhook-debug.log");
  if (!fs.existsSync(logPath)) {
    return {
      entries: [],
      hasInquiryInLast30s: false,
      message: "Log file belum tersedia"
    };
  }
  try {
    const stats = fs.statSync(logPath);
    const readSize = Math.min(stats.size, 3e4);
    const buffer = Buffer.alloc(readSize);
    const fd = fs.openSync(logPath, "r");
    fs.readSync(fd, buffer, 0, readSize, stats.size - readSize);
    fs.closeSync(fd);
    const raw = buffer.toString("utf-8");
    const chunks = raw.split(/\n(?=\[\d{4}-\d{2}-\d{2}T)/g);
    const entries = chunks.filter((c) => c.trim().length > 0).slice(-15).reverse().map((chunk) => {
      const firstLine = chunk.trim().split("\n")[0] || "";
      const dateMatch = firstLine.match(/\[(.*?)\]/);
      const date = dateMatch ? dateMatch[1] : "";
      const isMiddleware = firstLine.includes("[MIDDLEWARE]");
      const methodMatch = firstLine.match(/(GET|POST|HEAD|PUT|DELETE)\s+([^\s]+)/);
      const method = methodMatch ? methodMatch[1] : "UNKNOWN";
      const path2 = methodMatch ? methodMatch[2] : "";
      return {
        raw: chunk.trim(),
        timestamp: date,
        isMiddleware,
        method,
        path: path2,
        isInquiry: path2.includes("inquiry")
      };
    });
    const now = Date.now();
    const hasInquiryInLast30s = entries.some((e) => {
      if (!e.isInquiry || !e.timestamp) return false;
      const entryTime = new Date(e.timestamp).getTime();
      return !isNaN(entryTime) && now - entryTime < 3e4;
    });
    return {
      success: true,
      lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
      hasInquiryInLast30s,
      totalRecent: entries.length,
      entries
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
      entries: []
    };
  }
});

export { tracerRecentLogs_get as default };
//# sourceMappingURL=tracer-recent-logs.get.mjs.map
