import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Topbar from '@/components/Topbar'
import { Card, CardHead, StatCard, StatusBadge, ProgressBar, InfoGrid, NoteItem } from '@/components/ui'
import { fmtFull$, fmt$, fmtDate, fmtRelative } from '@/lib/utils'

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const [{ data: client }, { data: projects }, { data: notes }, { data: revenue }, { data: proposals }] = await Promise.all([
    supabase.from('clients').select('*').eq('id', params.id).single(),
    supabase.from('projects').select('*,project_tasks(id,status)').eq('client_id', params.id).order('created_at', { ascending: false }),
    supabase.from('notes').select('*,profiles(full_name)').eq('client_id', params.id).order('created_at', { ascending: false }),
    supabase.from('revenue_records').select('*').eq('client_id', params.id).order('date', { ascending: false }),
    supabase.from('proposals').select('*').eq('client_id', params.id).order('created_at', { ascending: false }),
  ])

  if (!client) notFound()

  const totalRevenue = (revenue ?? []).reduce((s: number, r: any) => s + (r.amount ?? 0), 0)
  const outstanding  = (revenue ?? []).filter((r: any) => !r.paid).reduce((s: number, r: any) => s + (r.amount ?? 0), 0)

  const accentMap: Record<string, string> = {
    crm:'#F26419', website:'#3B82F6', brand:'#A855F7',
    marketing:'#22C55E', retainer:'#F59E0B', other:'#6B7794',
  }

  return (
    <>
      <Topbar title={client.company_name} action={{ label:'+ New Project' }} />
      <div style={{ flex:1, overflowY:'auto', padding:24 }}>

        {/* Header */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
          <StatCard label="Lifetime Value"  value={fmtFull$(client.lifetime_value ?? 0)} accent="#22C55E" />
          <StatCard label="Total Billed"    value={fmt$(totalRevenue)} accent="#F26419" />
          <StatCard label="Outstanding"     value={fmt$(outstanding)} accent={outstanding > 0 ? '#F59E0B' : '#22C55E'} />
          <StatCard label="Active Projects" value={(projects ?? []).filter((p: any) => p.status !== 'complete' && p.status !== 'paused').length} />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:16 }}>
          <div>
            {/* Projects */}
            <Card style={{ marginBottom:12 }}>
              <CardHead title="Projects" action="+ New Project" />
              <div style={{ padding:16 }}>
                {(projects ?? []).length === 0 && (
                  <div style={{ color:'#6B7794', fontSize:'.82rem', padding:'8px 0' }}>No projects yet</div>
                )}
                {(projects ?? []).map((p: any) => {
                  const total = (p.project_tasks ?? []).length
                  const done  = (p.project_tasks ?? []).filter((t: any) => t.status === 'done').length
                  const pct   = total > 0 ? Math.round((done / total) * 100) : p.progress ?? 0
                  return (
                    <Link key={p.id} href={`/projects/${p.id}`} style={{ textDecoration:'none' }}>
                      <div style={{
                        background:'#0F1422', border:'1px solid rgba(255,255,255,0.07)',
                        padding:'14px 16px', marginBottom:8, cursor:'pointer',
                        borderLeft:`3px solid ${accentMap[p.type] ?? '#F26419'}`,
                        transition:'border-color .15s',
                      }}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                          <div>
                            <div style={{ fontWeight:600, color:'#EEF0F5', fontSize:'.9rem' }}>{p.name}</div>
                            <div style={{ fontSize:'.72rem', color:'#6B7794', marginTop:2 }}>{p.type} &middot; {fmtFull$(p.value ?? 0)} &middot; Due {fmtDate(p.due_date)}</div>
                          </div>
                          <StatusBadge status={p.status} />
                        </div>
                        <ProgressBar value={pct} color={accentMap[p.type] ?? '#F26419'} />
                        <div style={{ fontSize:'.72rem', color:'#6B7794', marginTop:4 }}>{done} of {total} tasks done</div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </Card>

            {/* Revenue records */}
            <Card style={{ marginBottom:12 }}>
              <CardHead title="Revenue Records" action="+ Add Record" />
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr>
                      {['Date','Description','Amount','Invoice','Paid'].map(h => (
                        <th key={h} style={{ fontSize:'.65rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#6B7794', padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', textAlign:'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(revenue ?? []).length === 0 && (
                      <tr><td colSpan={5} style={{ padding:24, textAlign:'center', color:'#6B7794', fontSize:'.82rem' }}>No revenue records</td></tr>
                    )}
                    {(revenue ?? []).map((r: any) => (
                      <tr key={r.id}>
                        <td style={{ padding:'10px 16px', fontSize:'.82rem', color:'#9AA0B8', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>{fmtDate(r.date)}</td>
                        <td style={{ padding:'10px 16px', fontSize:'.82rem', color:'#EEF0F5', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>{r.description}</td>
                        <td style={{ padding:'10px 16px', fontSize:'.85rem', fontWeight:700, color:'#22C55E', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>{fmtFull$(r.amount)}</td>
                        <td style={{ padding:'10px 16px', fontSize:'.78rem', color:'#6B7794', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>{r.invoice_number ?? '—'}</td>
                        <td style={{ padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                          <span style={{ fontSize:'.63rem', fontWeight:700, textTransform:'uppercase', padding:'2px 6px', background: r.paid ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)', color: r.paid ? '#22C55E' : '#F59E0B' }}>
                            {r.paid ? 'Paid' : 'Outstanding'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Notes */}
            <Card>
              <CardHead title="Notes" />
              <div style={{ padding:'12px 16px' }}>
                <textarea placeholder="Add a note..." style={{ width:'100%', background:'#192035', border:'1px solid rgba(255,255,255,0.07)', color:'#EEF0F5', fontFamily:'Inter,sans-serif', fontSize:'.82rem', padding:'9px 12px', outline:'none', resize:'vertical', minHeight:64, marginBottom:6 }} />
                <button style={{ padding:'6px 14px', background:'#F26419', color:'#fff', border:'none', fontFamily:'Outfit,sans-serif', fontSize:'.78rem', fontWeight:700, letterSpacing:'.04em', textTransform:'uppercase', cursor:'pointer', clipPath:'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)' }}>Add Note</button>
                <div style={{ marginTop:12 }}>
                  {(notes ?? []).map((n: any) => (
                    <NoteItem key={n.id} content={n.content} author={n.profiles?.full_name ?? '—'} date={fmtRelative(n.created_at)} />
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Right column */}
          <div>
            <Card style={{ marginBottom:12 }}>
              <CardHead title="Contact Details" />
              <div style={{ padding:'16px 18px' }}>
                <InfoGrid items={[
                  { label:'Contact',   value: client.contact_name },
                  { label:'Email',     value: client.email },
                  { label:'Phone',     value: client.phone },
                  { label:'Country',   value: client.country },
                  { label:'Industry',  value: client.industry?.replace(/_/g,' ') },
                  { label:'Website',   value: client.website },
                  { label:'Instagram', value: client.social_instagram },
                  { label:'LinkedIn',  value: client.social_linkedin },
                  { label:'Client Since', value: fmtDate(client.created_at) },
                ]} />
              </div>
            </Card>

            {/* Proposals */}
            {(proposals ?? []).length > 0 && (
              <Card>
                <CardHead title="Proposals" />
                <div style={{ padding:12 }}>
                  {(proposals ?? []).map((p: any) => (
                    <Link key={p.id} href={`/proposals/${p.id}`} style={{ textDecoration:'none' }}>
                      <div style={{ padding:'10px 12px', background:'#0F1422', border:'1px solid rgba(255,255,255,0.07)', marginBottom:6, cursor:'pointer' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                          <div style={{ fontSize:'.82rem', fontWeight:600, color:'#EEF0F5' }}>{p.title}</div>
                          <StatusBadge status={p.status} />
                        </div>
                        <div style={{ fontSize:'.75rem', color:'#22C55E', fontWeight:700 }}>{fmtFull$(p.value)}</div>
                        <div style={{ fontSize:'.7rem', color:'#6B7794', marginTop:3 }}>{fmtDate(p.created_at)}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
