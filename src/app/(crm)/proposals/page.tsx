import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Topbar from '@/components/Topbar'
import { Card, StatusBadge } from '@/components/ui'
import { fmtFull$, fmtDate } from '@/lib/utils'

export default async function ProposalsPage() {
  const supabase = await createClient()
  const { data: proposals } = await supabase
    .from('proposals')
    .select('*,leads(first_name,last_name),clients(company_name)')
    .order('created_at', { ascending: false })

  return (
    <>
      <Topbar title="Proposals" action={{ label:'+ New Proposal' }} />
      <div style={{ flex:1, overflowY:'auto', padding:24 }}>
        <Card>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr>
                  {['Proposal','Client / Lead','Services','Value','Created','Status'].map(h => (
                    <th key={h} style={{ fontSize:'.65rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#6B7794', padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', textAlign:'left', background:'#141929', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(proposals ?? []).length === 0 && (
                  <tr><td colSpan={6} style={{ padding:48, textAlign:'center', color:'#6B7794' }}>No proposals yet. Create one from a lead or client record.</td></tr>
                )}
                {(proposals ?? []).map((p: any) => {
                  const recipient = p.clients?.company_name ?? (p.leads ? `${p.leads.first_name} ${p.leads.last_name}` : '—')
                  return (
                    <tr key={p.id} className="hover:bg-white/[0.02]" style={{ cursor:'pointer' }}>
                      <td style={{ padding:'11px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                        <Link href={`/proposals/${p.id}`} style={{ textDecoration:'none', fontWeight:600, color:'#EEF0F5', fontSize:'.82rem' }}>{p.title}</Link>
                      </td>
                      <td style={{ padding:'11px 16px', fontSize:'.82rem', color:'#9AA0B8', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>{recipient}</td>
                      <td style={{ padding:'11px 16px', fontSize:'.78rem', color:'#9AA0B8', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>{(p.services ?? []).join(', ') || '—'}</td>
                      <td style={{ padding:'11px 16px', fontSize:'.85rem', fontWeight:700, color:'#F26419', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>{fmtFull$(p.value)}</td>
                      <td style={{ padding:'11px 16px', fontSize:'.78rem', color:'#6B7794', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>{fmtDate(p.created_at)}</td>
                      <td style={{ padding:'11px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}><StatusBadge status={p.status} /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  )
}
