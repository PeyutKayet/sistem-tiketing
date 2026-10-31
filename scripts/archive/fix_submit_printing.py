file = 'app/pages/[slug].vue'
with open(file, 'r') as f:
    content = f.read()

content = content.replace("  isSubmitting.value = true\n  ", "  isSubmitting.value = true\n  isPrinting.value = true\n  ")

with open(file, 'w') as f:
    f.write(content)
