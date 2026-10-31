file = 'app/pages/[slug].vue'
with open(file, 'r') as f:
    content = f.read()

content = content.replace(
    "const submitDataKasera = async () => {\n  isSubmitting.value = true\n  isPrinting.value = true",
    "const submitDataKasera = async () => {\n  isSubmitting.value = true"
)

# And remove audio play from submitDataKasera since there's no printer animation!
# Wait, if there's no printer animation, playing printer audio is weird.
content = content.replace(
    "  isSubmitting.value = true\n  \n  if (printAudio.value) { printAudio.value.currentTime = 0; printAudio.value.play().catch(e=>console.warn(e)); }\n  // Munculkan UI loading",
    "  isSubmitting.value = true\n  // Munculkan UI loading"
)

with open(file, 'w') as f:
    f.write(content)
