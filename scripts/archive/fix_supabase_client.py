with open('server/api/checkout.post.ts', 'r') as f:
    content = f.read()

content = content.replace("import { serverSupabaseClient } from '#supabase/server'", "import { serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server'")
content = content.replace("const supabase = await serverSupabaseClient(event)", "const supabase = await serverSupabaseServiceRole(event) // Gunakan service role agar bisa bypass RLS saat ngecek data sensitif (anti calo)")

with open('server/api/checkout.post.ts', 'w') as f:
    f.write(content)
