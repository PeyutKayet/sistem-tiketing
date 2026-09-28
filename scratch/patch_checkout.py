import re

with open('server/api/checkout.post.ts', 'r') as f:
    content = f.read()

# Add import
content = "import type { CheckoutPayload, Peserta } from '~/types/index'\n" + content

# Replace `body.peserta.map((p: any) => {`
content = content.replace("body.peserta.map((p: any) => {", "body.peserta.map((p: Peserta) => {")

# Add type to body
content = content.replace("const body = await readBody(event)", "const body = await readBody<CheckoutPayload>(event)")

with open('server/api/checkout.post.ts', 'w') as f:
    f.write(content)
