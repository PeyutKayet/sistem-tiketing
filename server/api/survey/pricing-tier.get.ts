import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const eventId = query.event_id as string
  const slug = query.slug as string

  const config = useRuntimeConfig()
  const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey)

  // Default Khazilmu CALM Pricing Tiers (5 Tahap Rotasi)
  const defaultTiers = [
    { tier: 1, label: 'Tahap 1', harga_reguler: 'Rp299.000', harga_eksklusif: 'Rp2.500.000', harga_reguler_num: 299000, harga_eksklusif_num: 2500000 },
    { tier: 2, label: 'Tahap 2', harga_reguler: 'Rp499.000', harga_eksklusif: 'Rp2.100.000', harga_reguler_num: 499000, harga_eksklusif_num: 2100000 },
    { tier: 3, label: 'Tahap 3', harga_reguler: 'Rp599.000', harga_eksklusif: 'Rp1.900.000', harga_reguler_num: 599000, harga_eksklusif_num: 1900000 },
    { tier: 4, label: 'Tahap 4', harga_reguler: 'Rp799.000', harga_eksklusif: 'Rp2.100.000', harga_reguler_num: 799000, harga_eksklusif_num: 2100000 },
    { tier: 5, label: 'Tahap 5', harga_reguler: 'Rp999.000', harga_eksklusif: 'Rp2.500.000', harga_reguler_num: 999000, harga_eksklusif_num: 2500000 }
  ]

  let resolvedEventId = eventId
  let customTiers = null

  if (!resolvedEventId && slug) {
    const { data: ev } = await supabase
      .from('event')
      .select('id, settings')
      .eq('slug', slug)
      .maybeSingle()
    if (ev) {
      resolvedEventId = ev.id
      customTiers = ev.settings?.b2b_survey?.pricing_tiers || null
    }
  } else if (resolvedEventId) {
    const { data: ev } = await supabase
      .from('event')
      .select('settings')
      .eq('id', resolvedEventId)
      .maybeSingle()
    if (ev) {
      customTiers = ev.settings?.b2b_survey?.pricing_tiers || null
    }
  }

  const activeTiers = (customTiers && Array.isArray(customTiers) && customTiers.length > 0) 
    ? customTiers 
    : defaultTiers

  let count = 0
  if (resolvedEventId) {
    const { count: total, error } = await supabase
      .from('peserta')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', resolvedEventId)

    if (!error && typeof total === 'number') {
      count = total
    }
  }

  const tierIndex = count % activeTiers.length
  const assignedTier = activeTiers[tierIndex]

  return {
    success: true,
    total_respondents_so_far: count,
    assigned_tier: assignedTier,
    tier_number: assignedTier.tier || (tierIndex + 1)
  }
})
