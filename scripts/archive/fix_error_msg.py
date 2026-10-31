with open('app/pages/[slug].vue', 'r') as f:
    content = f.read()

# Replace err.message with err.data?.statusMessage || err.data?.message || err.message
content = content.replace("text: err.message", "text: err.data?.statusMessage || err.data?.message || err.message")
content = content.replace("alert('Checkout Gagal: ' + err.message)", "alert('Checkout Gagal: ' + (err.data?.statusMessage || err.data?.message || err.message))")

with open('app/pages/[slug].vue', 'w') as f:
    f.write(content)
