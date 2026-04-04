import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Topbar from '@/components/Topbar'
import { Card, CardHead, StatusBadge } from '@/components/ui'
import { fmtFull$, fmtDate } from '@/lib/utils'
import ProposalEditor from './ProposalEditor'

export default async function ProposalDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: proposal } = await supabase
    .from('proposals')
    .select('*,leads(first_name,last_name,email,company),clients(company_name,contact_name,email)')
    .eq('id', params.id)
    .single()

  if (!proposal) notFound()

  const recipient = proposal.clients?.company_name ?? (proposal.leads ? `${proposal.leads.first_name} ${proposal.leads.last_name}` : '—')
  const email     = proposal.clients?.email ?? proposal.leads?.email ?? ''

  return (
    <>
      <Topbar title={proposal.title} />
      <div style={{ flex:1, overflowY:'auto', padding:24 }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:16 }}>
          <div>
            <ProposalEditor proposal={proposal} />
          </div>
          <div>
            <Card style={{ marginBottom:12 }}>
              <CardHead title="Proposal Details" />
              <div style={{ padding:'16px 18px' }}>
                {[
                  { label:'Status',      value: <StatusBadge status={proposal.status} /> },
                  { label:'Recipient',   value: <span style={{ color:'#EEF0F5' }}>{recipient}</span> },
                  { label:'Email',       value: <span style={{ color:'#F26419' }}>{email}</span> },
                  { label:'Value',       value: <span style={{ color:'#22C55E', fontWeight:700 }}>{fmtFull$(proposal.value)}</span> },
                  { label:'Created',     value: <span style={{ color:'#9AA0B8' }}>{fmtDate(proposal.created_at)}</span> },
                  { label:'Valid Until', value: <span style={{ color:'#9AA0B8' }}>{fmtDate(proposal.valid_until)}</span> },
                  { label:'Sent',        value: <span style={{ color:'#9AA0B8' }}>{proposal.sent_at ? fmtDate(proposal.sent_at) : 'Not sent'}</span> },
                ].map(item => (
                  <div key={item.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.07)', fontSize:'.82rem' }}>
                    <span style={{ color:'#6B7794' }}>{item.label}</span>
                    {item.value}
                  </div>
                ))}
              </div>
            </Card>

            {/* Pricing breakdown */}
            <Card>
              <CardHead title="Pricing" />
              <div style={{ padding:'14px 18px' }}>
                {((proposal.pricing_breakdown as any[]) ?? []).map((item: any, i: number) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.07)', fontSize:'.82rem' }}>
                    <div>
                      <div style={{ color:'#EEF0F5' }}>{item.description}</div>
                      <div style={{ fontSize:'.7rem', color:'#6B7794', textTransform:'capitalize' }}>{item.type?.replace(/_/g,' ')}</div>
                    </div>
                    <div style={{ color:'#F26419', fontWeight:700 }}>{fmtFull$(item.amount)}</div>
                  </div>
                ))}
                <div style={{ display:'flex', justifyContent:'space-between', paddingTop:10, fontWeight:700 }}>
                  <span style={{ color:'#EEF0F5', fontFamily:'Outfit,sans-serif' }}>Total</span>
                  <span style={{ color:'#22C55E', fontFamily:'Outfit,sans-serif', fontSize:'1.1rem' }}>{fmtFull$(proposal.value)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
