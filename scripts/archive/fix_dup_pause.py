file = 'app/pages/[slug].vue'
with open(file, 'r') as f:
    content = f.read()

content = content.replace(
    "      if (printAudio.value) printAudio.value.pause()\n      if (printAudio.value) printAudio.value.pause()",
    "      if (printAudio.value) printAudio.value.pause()"
)

with open(file, 'w') as f:
    f.write(content)
