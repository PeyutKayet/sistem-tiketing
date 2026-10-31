import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const eventId = query.event_id as string
  const slug = query.slug as string

  const config = useRuntimeConfig()
  const supabase = createClient(config.supabaseUrl, config.supabaseServiceKey)

  // Default Khazilmu CALM Pricing Tiers
  const defaultTiers = [
    { tier: 1, label: 'Tahap 1', harga_reguler: 'Rp500.000', harga_eksklusif: 'Rp1.700.000', harga_reguler_num: 500000, harga_eksklusif_num: 1700000 },
    { tier: 2, label: 'Tahap 2', harga_reguler: 'Rp700.000', harga_eksklusif: 'Rp2.100.000', harga_reguler_num: 700000, harga_eksklusif_num: 2100000 },
    { tier: 3, label: 'Tahap 3', harga_reguler: 'Rp800.000', harga_eksklusif: 'Rp2.400.000', harga_reguler_num: 800000, harga_eksklusif_num: 2400000 },
    { tier: 4, label: 'Tahap 4', harga_reguler: 'Rp1.000.000', harga_eksklusif: 'Rp2.600.000', harga_reguler_num: 1000000, harga_eksklusif_num: 2600000 }
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
