import re

file = 'app/pages/[slug].vue'
with open(file, 'r') as f:
    content = f.read()

declaration = """const route = useRoute()
const printAudio = ref(null)

onMounted(() => {
  if (typeof window !== 'undefined') {
    printAudio.value = new Audio('/printer.mp3')
  }
})"""

content = content.replace("const route = useRoute()", declaration)

with open(file, 'w') as f:
    f.write(content)

