import re

with open('app/components/event/CheckoutPayment.vue', 'r') as f:
    content = f.read()

# I will insert the download button right below the QRIS image.
qris_button_html = """      <!-- Gambar QRIS Diperkecil -->
      <img loading="lazy" src="/qris.webp" alt="QRIS Pembayaran" class="qris-image" />
      
      <a href="/qris.webp" download="QRIS_Pembayaran.webp" class="btn-download-qris">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" class="icon-download"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
        Download QRIS
      </a>
"""

content = content.replace(
    '<!-- Gambar QRIS Diperkecil -->\n      <img loading="lazy" src="/qris.webp" alt="QRIS Pembayaran" class="qris-image" />',
    qris_button_html
)

# Add CSS for .btn-download-qris
css_addition = """
.btn-download-qris {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: var(--bg-light);
  border: 1px solid var(--border-soft);
  color: var(--text-main);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  text-decoration: none;
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.btn-download-qris:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}
.icon-download {
  width: 14px;
  height: 14px;
}
"""

content = content.replace('</style>', css_addition + '\n</style>')

with open('app/components/event/CheckoutPayment.vue', 'w') as f:
    f.write(content)
