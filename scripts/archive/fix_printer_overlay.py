import re

file = 'app/pages/[slug].vue'
with open(file, 'r') as f:
    content = f.read()

# 1. Add isPrinting state
content = content.replace("const isSubmitting = ref(false)", "const isSubmitting = ref(false)\nconst isPrinting = ref(false)")

# 2. Change api-loader class binding
content = content.replace("<div class=\"api-loader\" :class=\"{ active: isSubmitting }\">", "<div class=\"api-loader\" :class=\"{ active: isPrinting }\">")

# 3. Fix check-calo logic: we don't want isPrinting, we just use isSubmitting. (Already fixed, check-calo sets isSubmitting = true).
# Wait, when Kasera redirects, we might want a simple loading overlay so the user knows it's redirecting.
# Let's add a simple overlay.
generic_overlay = """
  <!-- GENERIC LOADING OVERLAY -->
  <div v-if="isSubmitting && !isPrinting" style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(4px); z-index: 99999; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white;">
    <Icon name="lucide:loader-2" style="font-size: 48px; animation: spin 1s linear infinite; margin-bottom: 16px; color: var(--primary);" />
    <h3 style="margin: 0; font-weight: 700;">Memproses...</h3>
    <p style="margin: 4px 0 0; font-size: 0.9rem; color: #cbd5e1;">Mohon tunggu sebentar</p>
  </div>
  
  <style>
    @keyframes spin { 100% { transform: rotate(360deg); } }
  </style>

  <!-- PRINTER ANIMATION OVERLAY -->
"""
content = content.replace("  <!-- PRINTER ANIMATION OVERLAY -->", generic_overlay)

# 4. In lanjutBayar, for free tickets:
content = content.replace("      // Tiket Gratis! Langsung eksekusi submit tanpa perlu langkah pembayaran\n      submitData()", "      // Tiket Gratis! Langsung eksekusi submit tanpa perlu langkah pembayaran\n      isPrinting.value = true\n      submitData()")

# 5. Remove manual DOM manipulations for api-loader just in case
content = content.replace("document.querySelector('.api-loader')?.classList.add('active')", "")
content = content.replace("document.querySelector('.api-loader')?.classList.remove('active')", "")

# 6. In finally block for submitData and submitDataKasera, reset isPrinting
content = content.replace("isSubmitting.value = false", "isSubmitting.value = false\n      isPrinting.value = false")

# Wait, `isSubmitting.value = false` might be in multiple places. It's fine.

with open(file, 'w') as f:
    f.write(content)
