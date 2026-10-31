import re

file = 'app/pages/[slug].vue'
with open(file, 'r') as f:
    content = f.read()

# Fix in lanjutBayar (check-calo payload)
lanjut_find = """      const payloadPeserta = daftarPeserta.value.map(p => ({
        email: p.jawaban['email'] || '',
        no_wa: p.jawaban['no_wa'] || ''
      }))"""

lanjut_replace = """      const payloadPeserta = daftarPeserta.value.map(p => {
        let rawWa = p.jawaban['no_wa'] || ''
        if (rawWa && !rawWa.startsWith('62')) {
          if (rawWa.startsWith('0')) rawWa = '62' + rawWa.substring(1)
          else rawWa = '62' + rawWa
        }
        return {
          email: p.jawaban['email'] || '',
          no_wa: rawWa
        }
      })"""

content = content.replace(lanjut_find, lanjut_replace)

# Fix in processedPeserta
processed_find = """        email: finalJawaban['email'] || '-',
        hp: finalJawaban['no_wa'] || '-',
        dataTambahanJSON: finalJawaban"""

processed_replace = """        email: finalJawaban['email'] || '-',
        hp: (function() {
          let rawWa = finalJawaban['no_wa'] || '-'
          if (rawWa !== '-' && !rawWa.startsWith('62')) {
            if (rawWa.startsWith('0')) rawWa = '62' + rawWa.substring(1)
            else rawWa = '62' + rawWa
          }
          return rawWa
        })(),
        dataTambahanJSON: finalJawaban"""

content = content.replace(processed_find, processed_replace)

with open(file, 'w') as f:
    f.write(content)
