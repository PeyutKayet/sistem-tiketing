with open('server/api/checkout.post.ts', 'r') as f:
    content = f.read()

# Make emails lowercase
content = content.replace(
    "const emails = body.peserta.map((p: any) => p.email).filter(Boolean);",
    "const emails = body.peserta.map((p: any) => p.email ? p.email.toLowerCase() : null).filter(Boolean);"
)

# And use lowercase in the DB check?
# Supabase doesn't have an easy case-insensitive `in`. But we can map emails to lowercase. 
# Wait, if the DB stores them as mixed case, `in('email', emails)` will fail.
# So we shouldn't change the request emails to lowercase unless we also change the DB query to ilike, which is hard for arrays.
# Let's just leave it as is, but remove the replace.

