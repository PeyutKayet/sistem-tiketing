import { promises as fs } from 'fs'

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  const path = url.pathname

  // Abaikan polling log internal agar file log tetap bersih
  if (path.startsWith('/_nuxt') || path.includes('favicon')) {
    return
  }

  const method = getMethod(event)
  const headers = getHeaders(event)
  const userAgent = headers['user-agent'] || ''

  // Log jika ini POST, atau menyangkut webhook, espay, inquiry, atau user agent dari Apache/Java/Curl/Espay
  if (
    method === 'POST' ||
    path.includes('webhook') ||
    path.includes('espay') ||
    path.includes('inquiry') ||
    userAgent.toLowerCase().includes('apache') ||
    userAgent.toLowerCase().includes('java') ||
    userAgent.toLowerCase().includes('espay')
  ) {
    const entry = `\n[${new Date().toISOString()}] [MIDDLEWARE] ${method} ${path}\nHeaders: ${JSON.stringify(headers)}\n`
    fs.appendFile('logs/webhook-debug.log', entry).catch(() => {})
  }
})
