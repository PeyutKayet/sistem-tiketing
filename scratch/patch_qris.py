import re

with open('app/components/event/CheckoutPayment.vue', 'r') as f:
    content = f.read()

# Make qris-card use flex column
qris_card_css = """
.qris-card {
  background: var(--card-light);
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  padding: 15px 20px;
  text-align: center;
  margin-bottom: 15px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
}"""

content = re.sub(r'\.qris-card\s*\{[^}]*\}', qris_card_css.strip(), content)

with open('app/components/event/CheckoutPayment.vue', 'w') as f:
    f.write(content)
