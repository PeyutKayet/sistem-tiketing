import { ref, computed, type Ref } from 'vue'

export const useCart = (
  tickets: Ref<any[]>, 
  kodeUnik: Ref<number>, 
  adminFee: number = 2000,
  showToast: (msg: string, type?: string) => void
) => {
  const keranjang = ref<Record<string, number>>({})
  const donasiAmount = ref<number>(0)

  const totalQty = computed(() => {
    return Object.values(keranjang.value).reduce((sum, qty) => sum + qty, 0)
  })

  const totalPrice = computed(() => {
    let total = 0
    for (const id in keranjang.value) {
      const qty = keranjang.value[id]
      const tiket = tickets.value.find(t => String(t.id) === String(id))
      if (tiket && qty > 0) {
        total += (qty * tiket.harga)
      }
    }
    return total
  })

  const grandTotal = computed(() => {
    if (totalPrice.value === 0 && donasiAmount.value === 0) {
      return 0
    }
    // Jika ada total harga ATAU ada donasi, maka kenakan adminFee dan kodeUnik
    return totalPrice.value + donasiAmount.value + adminFee + kodeUnik.value
  })

  const updateKeranjang = (tiketId: string | number, change: number, sisaKuota: number) => {
    let currentQty = keranjang.value[String(tiketId)] || 0
    let newQty = currentQty + change

    if (newQty < 0) newQty = 0
    if (newQty > sisaKuota) {
      // @ts-ignore
      if (typeof window !== 'undefined' && window.Swal) {
        // @ts-ignore
        window.Swal.fire({ icon: 'warning', title: 'Kuota Terbatas', text: `Sisa tiket hanya ${sisaKuota}.`, confirmButtonColor: '#0C387A' })
      } else {
        showToast(`Sisa tiket hanya ${sisaKuota}.`, 'error')
      }
      newQty = sisaKuota
    }

    keranjang.value[String(tiketId)] = newQty
  }
  
  const resetKeranjang = () => {
    keranjang.value = {}
    donasiAmount.value = 0
  }

  return {
    keranjang,
    donasiAmount,
    totalQty,
    totalPrice,
    grandTotal,
    updateKeranjang,
    resetKeranjang
  }
}

