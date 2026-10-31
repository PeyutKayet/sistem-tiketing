file = 'app/pages/[slug].vue'
with open(file, 'r') as f:
    content = f.read()

content = content.replace("style=\"font-size: 48px; animation: spin 1s linear infinite; margin-bottom: 16px; color: var(--primary);\"", "class=\"animate-spin\" style=\"font-size: 48px; margin-bottom: 16px; color: var(--primary);\"")
content = content.replace("  <style>\n    @keyframes spin { 100% { transform: rotate(360deg); } }\n  </style>\n\n", "")

with open(file, 'w') as f:
    f.write(content)
