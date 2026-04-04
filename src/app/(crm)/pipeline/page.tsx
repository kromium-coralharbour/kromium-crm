import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Topbar from '@/components/Topbar'
import { TierBadge } from '@/components/ui'
import { fmtRelative } from '@/lib/utils'

const STAGES = [
  { key:'new',           label:'New Enquiry',    color:'#F26419' },
  { key:'contacted',     label:'Contacted',       color:'#3B82F6' },
  { key:'proposal_sent', label:'Proposal Sent',  color:'#A855F7' },
  { key:'negotiating',   label:'Negotiating',    color:'#F59E0B' },
  { key:'won',           label:'Won',             color:'#22C55E' },
  { key:'lost',          label:'Lost',            color:'#EF4444' },
]

export default async function PipelinePage() {
  const supabase = await createClient()
  const { data: leads } = await supabase
    .from('leads')
    .select('id,first_name,last_name,company,country,form_type,lead_score,lead_tier,status,created_at')
    .order('created_at', { ascending: false })

  const byStatus = (leads ?? []).reduce((acc: Record<string, any[]>, l: any) => {
    if (!acc[l.status]) acc[l.status] = []
    acc[l.status].push(l)
    return acc
  }, {})

  return (
    <>
      <Topbar title="Pipeline" />
      <div style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'16px 24px 0' }} />
        <div style={{ flex:1, overflowX:'auto', padding:'0 24px 24px', display:'flex', gap:10 }}>
          {STAGES.map(stage => {
            const cards = byStatus[stage.key] ?? []
            return (
              <div key={stage.key} style={{
                flexShrink:0, width:230,
                background:'#141929', border:'1px solid rgba(255,255,255,0.07)',
                display:'flex', flexDirection:'column', maxHeight:'calc(100vh - 140px)',
              }}>
                <div style={{
                  padding:'12px 14px', borderBottom:'1px solid rgba(255,255,255,0.07)',
                  display:'flex', alignItems:'center', justifyContent:'space-between',
                }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', background: stage.color }} />
                    <span style={{ fontSize:'.82rem', fontWeight:700, color:'#EEF0F5' }}>{stage.label}</span>
                  </div>
                  <span style={{ fontSize:'.65rem', fontWeight:700, color:'#6B7794', background:'#0F1422', border:'1px solid rgba(255,255,255,0.07)', padding:'1px 6px', borderRadius:10 }}>{cards.length}</span>
                </div>
                <div style={{ flex:1, overflowY:'auto', padding:8 }}>
                  {cards.length === 0 && (
                    <div style={{ padding:'16px 8px', textAlign:'center', color:'#6B7794', fontSize:'.78rem' }}>Empty</div>
                  )}
                  {cards.map((l: any) => (
                    <Link key={l.id} href={`/enquiries/${l.id}`} style={{ textDecoration:'none' }}>
                      <div style={{
                        background:'#0F1422', border:'1px solid rgba(255,255,255,0.07)',
                        padding:12, marginBottom:6, cursor:'pointer',
                        transition:'border-color .15s',
                      }}
                      className="hover:border-orange-500/40"
                      >
                        <div style={{ fontSize:'.82rem', fontWeight:600, color:'#EEF0F5', marginBottom:3 }}>{l.first_name} {l.last_name}</div>
                        <div style={{ fontSize:'.72rem', color:'#6B7794', marginBottom:8 }}>
                          {l.form_type?.replace(/-/g,' ').replace(/get a |start a /gi,'').trim() ?? '—'} &middot; {l.country ?? '—'}
                        </div>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                          <TierBadge tier={l.lead_tier} />
                          <span style={{ fontSize:'.68rem', color:'#6B7794' }}>{fmtRelative(l.created_at)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
