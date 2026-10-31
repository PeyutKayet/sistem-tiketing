file = 'app/pages/[slug].vue'
with open(file, 'r') as f:
    content = f.read()

content = content.replace(
    "  isSubmitting.value = true\n  if (printAudio.value) { printAudio.value.currentTime = 0; printAudio.value.play().catch(e=>console.warn(e)); }",
    "  isSubmitting.value = true\n  document.querySelector('.api-loader')?.classList.add('active')\n  if (printAudio.value) { printAudio.value.currentTime = 0; printAudio.value.play().catch(e=>console.warn(e)); }"
)

with open(file, 'w') as f:
    f.write(content)
