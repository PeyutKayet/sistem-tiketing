import re

with open('app/components/event/CheckoutPayment.vue', 'r') as f:
    content = f.read()

donasi_row = """        <div class="billing-detail-item">
          <span>Tiket ({{ totalQty }}x)</span>
          <span>{{ formatPrice(totalPrice) }}</span>
        </div>
        <div v-if="donasiAmount > 0" class="billing-detail-subitem" style="color: #e11d48; opacity: 1;">
          <span>Infaq / Donasi</span>
          <span>+{{ formatPrice(donasiAmount) }}</span>
        </div>"""

content = content.replace("""        <div class="billing-detail-item">
          <span>Tiket ({{ totalQty }}x)</span>
          <span>{{ formatPrice(totalPrice) }}</span>
        </div>""", donasi_row)

script_props = """const props = defineProps({
  grandTotal: { type: Number, required: true },
  totalQty: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  adminFee: { type: Number, required: true },
  kodeUnik: { type: Number, required: true },
  donasiAmount: { type: Number, default: 0 },
  buktiBayarPreview: { type: String, default: '' },"""

content = re.sub(r'const props = defineProps\(\{(.*?)\buktiBayarPreview:', script_props, content, flags=re.DOTALL)

with open('app/components/event/CheckoutPayment.vue', 'w') as f:
    f.write(content)
