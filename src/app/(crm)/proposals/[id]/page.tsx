import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Topbar from '@/components/Topbar'
import ProposalEditor from './ProposalEditor'

export default async function ProposalDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: proposal } = await supabase
    .from('proposals')
    .select('*,leads(*),clients(company_name,contact_name,email)')
    .eq('id', params.id)
    .single()

  if (!proposal) notFound()

  // Fetch notes for the lead if one is linked
  const { data: notes } = proposal.lead_id
    ? await supabase
        .from('notes')
        .select('*,profiles(full_name)')
        .eq('lead_id', proposal.lead_id)
        .order('created_at', { ascending: false })
    : { data: [] }

  return (
    <>
      <Topbar title={proposal.title} />
      <div style={{ flex:1, overflowY:'auto', padding:24 }}>
        <ProposalEditor proposal={proposal} lead={proposal.leads} notes={notes ?? []} />
      </div>
    </>
  )
}
