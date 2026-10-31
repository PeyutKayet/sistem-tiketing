import re

file = 'app/pages/[slug].vue'
with open(file, 'r') as f:
    content = f.read()

# Add audio init
content = content.replace("const router = useRouter()", "const router = useRouter()\nconst printAudio = ref(null)\n\nonMounted(() => {\n  if (typeof window !== 'undefined') {\n    printAudio.value = new Audio('/printer.mp3')\n  }\n})")

# Add play to submitDataKasera
kasera_submit = """const submitDataKasera = async () => {
  isSubmitting.value = true
  if (printAudio.value) { printAudio.value.currentTime = 0; printAudio.value.play().catch(e=>console.warn(e)); }
  // Munculkan UI loading"""

content = content.replace(
    "const submitDataKasera = async () => {\n  isSubmitting.value = true\n  // Munculkan UI loading",
    kasera_submit
)

# Add play to submitData
manual_submit = """  isSubmitting.value = true
  if (printAudio.value) { printAudio.value.currentTime = 0; printAudio.value.play().catch(e=>console.warn(e)); }"""

content = content.replace(
    "  isSubmitting.value = true\n  \n  try {",
    manual_submit + "\n  \n  try {"
)

# Add stop to finally of submitDataKasera
content = content.replace(
    "      isSubmitting.value = false\n      document.querySelector('.api-loader')?.classList.remove('active')",
    "      isSubmitting.value = false\n      document.querySelector('.api-loader')?.classList.remove('active')\n      if (printAudio.value) printAudio.value.pause()"
)

# Add stop to finally of submitData
content = content.replace(
    "    if (typeof isRedirecting === 'undefined' || !isRedirecting) {\n      isSubmitting.value = false\n      document.querySelector('.api-loader')?.classList.remove('active')",
    "    if (typeof isRedirecting === 'undefined' || !isRedirecting) {\n      isSubmitting.value = false\n      document.querySelector('.api-loader')?.classList.remove('active')\n      if (printAudio.value) printAudio.value.pause()"
)

with open(file, 'w') as f:
    f.write(content)

print("Audio patched")
