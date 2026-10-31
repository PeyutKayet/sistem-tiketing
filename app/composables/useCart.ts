import { ref, computed, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCartStore } from '~/stores/cart'

export const useCart = (
  tickets: Ref<any[]>, 
  kodeUnik: Ref<number>, 
  adminFee: number = 2000,
  showToast: (msg: string, type?: string) => void,
  maxTicketsLimit: Ref<number> = ref(0)
) => {
  const cartStore = useCartStore()
  const { keranjang, donasiAmount, totalQty } = storeToRefs(cartStore)

  const totalPrice = computed(() => {
    return cartStore.calculateTotalPrice(tickets.value)
  })

  const grandTotal = computed(() => {
    if (totalPrice.value === 0 && donasiAmount.value === 0) {
      return 0
    }
    // Jika ada total harga ATAU ada donasi, maka kenakan adminFee dan kodeUnik
    return totalPrice.value + donasiAmount.value + adminFee + (kodeUnik?.value || 0)
  })

  const updateKeranjang = (tiketId: string | number, change: number, sisaKuota: number) => {
    cartStore.updateKeranjang(tiketId, change, sisaKuota, {
      maxTicketsLimit: maxTicketsLimit?.value || 0,
      onWarning: (msg) => showToast(msg, 'error')
    })
  }
  
  const resetKeranjang = () => {
    cartStore.resetKeranjang()
  }

  const setEventSlug = (slug: string) => {
    cartStore.setEventSlug(slug)
  }

  const syncWithAvailableTickets = (activeTickets: any[]) => {
    cartStore.syncWithAvailableTickets(activeTickets)
  }

  return {
    cartStore,
    keranjang,
    donasiAmount,
    totalQty,
    totalPrice,
    grandTotal,
    updateKeranjang,
    resetKeranjang,
    setEventSlug,
    syncWithAvailableTickets
  }
}
