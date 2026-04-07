import { createClient } from '@/lib/supabase/server'
import NurtureClient from './NurtureClient'

export default async function NurturePage() {
  const supabase = await createClient()

  const { data: entries } = await supabase
    .from('nurture_entries')
    .select('*,leads(id,first_name,last_name,email,lead_score,lead_tier,country,form_type)')
    .order('next_due', { ascending: true, nullsFirst: false })

  return <NurtureClient entries={entries ?? []} />
}
