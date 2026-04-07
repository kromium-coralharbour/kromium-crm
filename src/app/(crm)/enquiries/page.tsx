import { createClient } from '@/lib/supabase/server'
import EnquiriesClient from './EnquiriesClient'

export default async function EnquiriesPage({ searchParams }: { searchParams: { tier?: string } }) {
  const supabase = await createClient()
  let query = supabase
    .from('leads')
    .select('id,first_name,last_name,email,company,country,industry,form_type,lead_score,lead_tier,status,referral_source,created_at')
    .order('created_at', { ascending: false })

  if (searchParams.tier) query = query.eq('lead_tier', searchParams.tier)

  const [{ data: leads }, { count: hotCount }, { count: warmCount }, { count: coldCount }, { count: totalCount }] = await Promise.all([
    query.limit(100),
    supabase.from('leads').select('*',{count:'exact',head:true}).eq('lead_tier','hot'),
    supabase.from('leads').select('*',{count:'exact',head:true}).eq('lead_tier','warm'),
    supabase.from('leads').select('*',{count:'exact',head:true}).eq('lead_tier','cold'),
    supabase.from('leads').select('*',{count:'exact',head:true}),
  ])

  return (
    <EnquiriesClient
      leads={leads ?? []}
      hotCount={hotCount ?? 0}
      warmCount={warmCount ?? 0}
      coldCount={coldCount ?? 0}
      totalCount={totalCount ?? 0}
      tier={searchParams.tier ?? ''}
    />
  )
}
