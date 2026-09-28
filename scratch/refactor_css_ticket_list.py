new_content = """<template>
  <div class="ticket-list-container">
    <div v-for="tiket in tickets" :key="tiket.id" class="ticket-card" :style="{ opacity: tiket.sisa_kuota <= 0 ? '0.6' : '1' }">
      <div class="ticket-info">
        <div class="ticket-name">{{ tiket.nama_kategori }}</div>
        <div class="ticket-meta">
          <span class="ticket-price">
            {{ tiket.harga === 0 ? 'GRATIS' : formatPrice(tiket.harga) }}
          </span>
          <span class="ticket-quota">
            Sisa: {{ tiket.is_unlimited ? '~' : tiket.sisa_kuota }}
          </span>
        </div>
      </div>
      
      <div class="ticket-actions">
        <button class="action-btn btn-minus" @click="$emit('update-keranjang', tiket.id, -1, tiket.sisa_kuota)" :disabled="(keranjang[tiket.id] || 0) <= 0">-</button>
        <span class="ticket-qty">{{ keranjang[tiket.id] || 0 }}</span>
        <button class="action-btn btn-plus" @click="$emit('update-keranjang', tiket.id, 1, tiket.sisa_kuota)" :disabled="tiket.sisa_kuota <= 0">+</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  tickets: { type: Array, default: () => [] },
  keranjang: { type: Object, default: () => ({}) }
})

defineEmits(['update-keranjang'])

const formatPrice = (price) => {
  if (price == null) return ''
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price)
}
</script>

<style scoped>
.ticket-list-container {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ticket-card {
  background: var(--card-light);
  border: 1px solid var(--border-soft);
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: var(--transition);
}
.ticket-info {
  flex: 1;
  text-align: left;
}
.ticket-name {
  font-weight: 700;
  font-size: 0.85rem;
  color: var(--text-main);
}
.ticket-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
}
.ticket-price {
  font-size: 0.8rem;
  color: var(--accent-main);
  font-weight: 800;
}
.ticket-quota {
  font-size: 0.65rem;
  color: var(--text-muted);
  border-left: 1px solid var(--border-soft);
  padding-left: 6px;
}
.ticket-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-light);
  padding: 4px;
  border-radius: 8px;
  border: 1px solid var(--border-soft);
}
.action-btn {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: var(--shadow-sm);
}
.btn-minus {
  background: var(--card-light);
  color: var(--text-main);
}
.btn-plus {
  background: var(--text-main);
  color: var(--card-light);
}
.ticket-qty {
  font-weight: 800;
  width: 14px;
  text-align: center;
  color: var(--text-main);
  font-size: 0.85rem;
}
</style>
"""

with open('app/components/event/TicketList.vue', 'w') as f:
    f.write(new_content)
