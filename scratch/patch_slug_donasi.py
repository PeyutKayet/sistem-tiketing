import re

with open('app/pages/[slug].vue', 'r') as f:
    content = f.read()

# 1. TicketList
old_ticket_list = """        <TicketList 
          :tickets="tickets"
          :keranjang="keranjang"
          @update-keranjang="updateKeranjang"
        />"""

new_ticket_list = """        <TicketList 
          :tickets="tickets"
          :keranjang="keranjang"
          :eventSettings="eventData?.settings"
          v-model:donasiAmount="donasiAmount"
          @update-keranjang="updateKeranjang"
        />"""
content = content.replace(old_ticket_list, new_ticket_list)

# 2. CheckoutPayment
old_checkout = """      <CheckoutPayment 
        :grandTotal="grandTotal"
        :totalQty="totalQty"
        :totalPrice="totalPrice"
        :adminFee="adminFee"
        :kodeUnik="kodeUnik"
        :buktiBayarPreview="buktiBayarPreview\""""

new_checkout = """      <CheckoutPayment 
        :grandTotal="grandTotal"
        :totalQty="totalQty"
        :totalPrice="totalPrice"
        :adminFee="adminFee"
        :kodeUnik="kodeUnik"
        :donasiAmount="donasiAmount"
        :buktiBayarPreview="buktiBayarPreview\""""
content = content.replace(old_checkout, new_checkout)

# 3. useCart
content = content.replace('const { keranjang, totalQty, totalPrice, grandTotal, updateKeranjang, resetKeranjang } = useCart',
                          'const { keranjang, donasiAmount, totalQty, totalPrice, grandTotal, updateKeranjang, resetKeranjang } = useCart')


# 4. submitData
# We need to replace infaqNominal: grandTotal.value with infaqNominal: donasiAmount.value
content = content.replace('infaqNominal: grandTotal.value', 'infaqNominal: donasiAmount.value')

with open('app/pages/[slug].vue', 'w') as f:
    f.write(content)
