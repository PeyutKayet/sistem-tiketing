import fs from 'fs'
import path from 'path'
import { checkSuperAdmin } from '../utils/checkSuperAdmin'

export default defineEventHandler(async (event) => {
  // Hanya Super Admin yang berhak membaca log webhook mentah
  await checkSuperAdmin(event)

  const logPath = path.resolve(process.cwd(), 'logs/webhook-debug.log')

  if (!fs.existsSync(logPath)) {
    return {
      entries: [],
      hasInquiryInLast30s: false,
      message: 'Log file belum tersedia'
    }
  }

  try {
    const stats = fs.statSync(logPath)
    const readSize = Math.min(stats.size, 30000) // Ambil 30KB terakhir
    const buffer = Buffer.alloc(readSize)
    const fd = fs.openSync(logPath, 'r')
    fs.readSync(fd, buffer, 0, readSize, stats.size - readSize)
    fs.closeSync(fd)

    const raw = buffer.toString('utf-8')
    // Split by timestamp regex [YYYY-MM-DDTHH:mm:ss
    const chunks = raw.split(/\n(?=\[\d{4}-\d{2}-\d{2}T)/g)
    
    const entries = chunks
      .filter(c => c.trim().length > 0)
      .slice(-15)
      .reverse()
      .map(chunk => {
        const firstLine = chunk.trim().split('\n')[0] || ''
        const dateMatch = firstLine.match(/\[(.*?)\]/)
        const date = dateMatch ? dateMatch[1] : ''
        const isMiddleware = firstLine.includes('[MIDDLEWARE]')
        const methodMatch = firstLine.match(/(GET|POST|HEAD|PUT|DELETE)\s+([^\s]+)/)
        const method = methodMatch ? methodMatch[1] : 'UNKNOWN'
        const path = methodMatch ? methodMatch[2] : ''
        
        return {
          raw: chunk.trim(),
          timestamp: date,
          isMiddleware,
          method,
          path,
          isInquiry: path.includes('inquiry')
        }
      })

    const now = Date.now()
    const hasInquiryInLast30s = entries.some(e => {
      if (!e.isInquiry || !e.timestamp) return false
      const entryTime = new Date(e.timestamp).getTime()
      return !isNaN(entryTime) && (now - entryTime) < 30000
    })

    return {
      success: true,
      lastUpdated: new Date().toISOString(),
      hasInquiryInLast30s,
      totalRecent: entries.length,
      entries
    }
  } catch (err: any) {
    return {
      success: false,
      error: err.message,
      entries: []
    }
  }
})
