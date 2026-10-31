with open('server/api/checkout.post.ts', 'r') as f:
    content = f.read()

log_code = """
  // Anti-Calo Check
  console.log("Anti-calo config:", eventData.settings?.is_anti_calo_email, eventData.settings?.is_anti_calo_wa)
  if (eventData.settings?.is_anti_calo_email || eventData.settings?.is_anti_calo_wa) {
    const emails = body.peserta.map((p: any) => p.email).filter(Boolean);
    const was = body.peserta.map((p: any) => p.no_wa).filter(Boolean);
    console.log("Emails from req:", emails)
    console.log("WAs from req:", was)
"""

content = content.replace("  // Anti-Calo Check\n  if (eventData.settings?.is_anti_calo_email || eventData.settings?.is_anti_calo_wa) {\n    const emails = body.peserta.map((p: any) => p.email).filter(Boolean);\n    const was = body.peserta.map((p: any) => p.no_wa).filter(Boolean);", log_code)

with open('server/api/checkout.post.ts', 'w') as f:
    f.write(content)
