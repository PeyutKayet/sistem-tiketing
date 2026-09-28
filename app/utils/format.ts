export const formatPrice = (price: number | string | null | undefined): string => {
  if (price == null) return ''
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(numPrice)
}

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'TBA'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

export const formatWaLink = (noWa: string | null | undefined): string => {
  if (!noWa || noWa === '62800000000') return '#'
  let noWaBersih = String(noWa).replace(/\D/g, '')
  if (noWaBersih.startsWith('0')) noWaBersih = '62' + noWaBersih.substring(1)
  return `https://wa.me/${noWaBersih}`
}
