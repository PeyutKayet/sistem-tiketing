<template>
  <div class="ticket-list-container">
    <!-- Skeleton jika tiket sedang dimuat -->
    <template v-if="isLoading">
      <div v-for="n in 2" :key="'tkt-skel-' + n" class="ticket-card ticket-skeleton">
        <div class="ticket-info">
          <div class="skeleton-shimmer skeleton-tkt-title"></div>
          <div class="skeleton-shimmer skeleton-tkt-meta"></div>
        </div>
        <div class="ticket-actions skeleton-actions-wrap">
          <div class="skeleton-shimmer skeleton-tkt-btn"></div>
        </div>
      </div>
    </template>

    <!-- State Kosong jika tiket selesai dimuat tapi tidak ada data -->
    <div v-else-if="tickets.length === 0" class="no-tickets-state">
      Belum ada tiket yang tersedia untuk event ini.
    </div>

    <!-- List tiket normal -->
    <template v-else>
      <div 
        v-for="tiket in tickets" 
        :key="tiket.id" 
        class="ticket-card" 
        :class="{ 'is-selected': (keranjang[tiket.id] || 0) > 0 }"
        :style="{ opacity: tiket.sisa_kuota <= 0 ? '0.6' : '1' }"
      >
        <div class="ticket-info">
          <div class="ticket-name">{{ tiket.nama_kategori }}</div>
          <div class="ticket-meta">
            <ClientOnly>
              <span class="ticket-price">
                {{ tiket.harga === 0 ? 'GRATIS' : formatPrice(tiket.harga) }}
              </span>
              <template #fallback>
                <span class="ticket-price">Rp ...</span>
              </template>
            </ClientOnly>
            <span class="ticket-quota" v-if="tiket.sisa_kuota > 0 || tiket.is_unlimited">
              Sisa: {{ tiket.is_unlimited ? '~' : tiket.sisa_kuota }}
            </span>
            <span class="ticket-quota sold-out" v-else>
              Sold Out
            </span>
          </div>
        </div>
        
        <div class="ticket-actions">
          <button 
            type="button"
            class="action-btn btn-minus" 
            @click="$emit('update-keranjang', tiket.id, -1, tiket.sisa_kuota)" 
            :disabled="(keranjang[tiket.id] || 0) <= 0"
            aria-label="Kurangi tiket"
          >
            -
          </button>
          <span class="ticket-qty">{{ keranjang[tiket.id] || 0 }}</span>
          <button 
            type="button"
            class="action-btn btn-plus" 
            @click="$emit('update-keranjang', tiket.id, 1, tiket.sisa_kuota)" 
            :disabled="tiket.sisa_kuota <= 0"
            aria-label="Tambah tiket"
          >
            +
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  tickets: { type: Array, default: () => [] },
  keranjang: { type: Object, default: () => ({}) },
  isLoading: { type: Boolean, default: false }
})

const emit = defineEmits(['update-keranjang'])

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
  gap: 10px;
}
.ticket-card {
  background: var(--card-light, #ffffff);
  border: 1.5px solid var(--border-soft, #e2e8f0);
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
}
.ticket-card.is-selected {
  border-color: var(--primary, #0C387A);
  background: #f0f7ff;
  box-shadow: 0 4px 12px rgba(12, 56, 122, 0.08);
}
.ticket-info {
  flex: 1;
  text-align: left;
  padding-right: 8px;
}
.ticket-name {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-main, #0f172a);
  line-height: 1.3;
}
.ticket-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}
.ticket-price {
  font-size: 0.85rem;
  color: var(--accent-main, #0C387A);
  font-weight: 800;
}
.ticket-quota {
  font-size: 0.68rem;
  color: var(--text-muted, #64748b);
  border-left: 1px solid var(--border-soft, #e2e8f0);
  padding-left: 8px;
}
.ticket-quota.sold-out {
  color: #dc2626;
  font-weight: bold;
}
.ticket-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-light, #f8fafc);
  padding: 4px;
  border-radius: 10px;
  border: 1px solid var(--border-soft, #e2e8f0);
}
.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  font-weight: 800;
  font-size: 1.15rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  transition: transform 0.1s ease, background 0.15s ease;
  touch-action: manipulation;
  user-select: none;
}
.action-btn:active:not(:disabled) {
  transform: scale(0.92);
}
.action-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  box-shadow: none;
}
.btn-minus {
  background: #ffffff;
  color: var(--text-main, #0f172a);
  border: 1px solid #e2e8f0;
}
.btn-plus {
  background: var(--primary, #0C387A);
  color: #ffffff;
}
.ticket-qty {
  font-weight: 800;
  min-width: 22px;
  text-align: center;
  color: var(--text-main, #0f172a);
  font-size: 0.95rem;
}

/* Skeleton Styles */
.ticket-skeleton {
  pointer-events: none;
  background: #f8fafc;
}
.skeleton-actions-wrap {
  background: transparent;
  border: none;
}
.skeleton-shimmer {
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: ticketShimmer 1.5s infinite linear;
  border-radius: 6px;
}
.skeleton-tkt-title {
  height: 16px;
  width: 65%;
  margin-bottom: 6px;
}
.skeleton-tkt-meta {
  height: 12px;
  width: 40%;
}
.skeleton-tkt-btn {
  width: 80px;
  height: 32px;
  border-radius: 8px;
}
.no-tickets-state {
  text-align: center;
  padding: 24px 16px;
  color: var(--text-muted, #64748b);
  font-size: 0.85rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px dashed #cbd5e1;
}
@keyframes ticketShimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>
