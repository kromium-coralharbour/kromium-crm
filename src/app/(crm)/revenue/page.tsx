import ActionButton from '@/components/ActionButton'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Topbar from '@/components/Topbar'
import { Card, StatCard } from '@/components/ui'
import { fmtFull$, fmtDate, fmt$ } from '@/lib/utils'
import { format, startOfMonth, subMonths } from 'date-fns'

export default async function RevenuePage() {
  const supabase = await createClient()

  const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd')

  const [{ data: allRevenue }, { data: clients }] = await Promise.all([
    supabase.from('revenue_records').select('*,clients(company_name),projects(name,type)').order('date', { ascending: false }),
    supabase.from('clients').select('id,company_name,lifetime_value').order('lifetime_value', { ascending: false }).limit(8),
  ])

  const paid        = (allRevenue ?? []).filter((r: any) => r.paid)
  const outstanding = (allRevenue ?? []).filter((r: any) => !r.paid)
  const monthPaid   = paid.filter((r: any) => r.date >= monthStart)

  const totalPaid     = paid.reduce((s: number, r: any)        => s + (r.amount ?? 0), 0)
  const totalOutstanding = outstanding.reduce((s: number, r: any) => s + (r.amount ?? 0), 0)
  const monthTotal    = monthPaid.reduce((s: number, r: any)   => s + (r.amount ?? 0), 0)

  return (
    <>
      <Topbar title="Revenue"  />
      <div style={{ flex:1, overflowY:'auto', padding:24 }}>
        <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:16 }}>
          <ActionButton type="revenue" label="+ Add Record" />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
          <StatCard label="This Month"    value={fmt$(monthTotal)}        accent="#22C55E" meta="Paid invoices" />
          <StatCard label="Total Billed"  value={fmtFull$(totalPaid)}     accent="#F26419" />
          <StatCard label="Outstanding"   value={fmtFull$(totalOutstanding)} accent={totalOutstanding > 0 ? '#F59E0B' : '#22C55E'} />
          <StatCard label="Total Clients" value={(clients ?? []).length}  accent="#3B82F6" />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:16, marginBottom:16 }}>
          {/* Revenue by client */}
          <Card>
            <div style={{ padding:'14px 18px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', justifyContent:'space-between' }}>
              <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'.95rem', fontWeight:700, color:'#fff' }}>Revenue by Client</div>
            </div>
            <div style={{ padding:16 }}>
              {(clients ?? []).map((c: any) => {
                const maxVal = (clients ?? [])[0]?.lifetime_value ?? 1
                const pct = Math.round(((c.lifetime_value ?? 0) / maxVal) * 100)
                return (
                  <div key={c.id} style={{ marginBottom:12 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.82rem', marginBottom:5 }}>
                      <Link href={`/clients/${c.id}`} style={{ color:'#EEF0F5', textDecoration:'none', fontWeight:500 }}>{c.company_name}</Link>
                      <span style={{ color:'#22C55E', fontWeight:700 }}>{fmtFull$(c.lifetime_value ?? 0)}</span>
                    </div>
                    <div style={{ height:4, background:'rgba(255,255,255,0.08)', borderRadius:2 }}>
                      <div style={{ height:4, borderRadius:2, background:'#F26419', width:`${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Outstanding */}
          <Card>
            <div style={{ padding:'14px 18px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'.95rem', fontWeight:700, color:'#fff' }}>Outstanding</div>
            </div>
            <div style={{ padding:12 }}>
              {outstanding.length === 0 && <div style={{ padding:'16px 0', textAlign:'center', color:'#22C55E', fontSize:'.82rem' }}>All clear</div>}
              {outstanding.slice(0,6).map((r: any) => (
                <div key={r.id} style={{ padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.82rem' }}>
                    <span style={{ color:'#EEF0F5', fontWeight:500 }}>{r.clients?.company_name}</span>
                    <span style={{ color:'#F59E0B', fontWeight:700 }}>{fmtFull$(r.amount)}</span>
                  </div>
                  <div style={{ fontSize:'.72rem', color:'#6B7794', marginTop:2 }}>{r.description} &middot; {fmtDate(r.date)}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* All records */}
        <Card>
          <div style={{ padding:'14px 18px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'.95rem', fontWeight:700, color:'#fff' }}>All Revenue Records</div>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr>
                  {['Date','Client','Project','Description','Amount','Invoice','Status'].map(h => (
                    <th key={h} style={{ fontSize:'.65rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#6B7794', padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', textAlign:'left', background:'#141929', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(allRevenue ?? []).length === 0 && (
                  <tr><td colSpan={7} style={{ padding:48, textAlign:'center', color:'#6B7794' }}>No revenue records yet</td></tr>
                )}
                {(allRevenue ?? []).map((r: any) => (
                  <tr key={r.id} className="hover:bg-white/[0.02]">
                    <td style={{ padding:'10px 16px', fontSize:'.82rem', color:'#9AA0B8', borderBottom:'1px solid rgba(255,255,255,0.07)', whiteSpace:'nowrap' }}>{fmtDate(r.date)}</td>
                    <td style={{ padding:'10px 16px', fontSize:'.82rem', fontWeight:600, color:'#EEF0F5', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                      <Link href={`/clients/${r.client_id}`} style={{ color:'#EEF0F5', textDecoration:'none' }}>{r.clients?.company_name ?? '—'}</Link>
                    </td>
                    <td style={{ padding:'10px 16px', fontSize:'.78rem', color:'#9AA0B8', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>{r.projects?.name ?? '—'}</td>
                    <td style={{ padding:'10px 16px', fontSize:'.82rem', color:'#9AA0B8', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>{r.description}</td>
                    <td style={{ padding:'10px 16px', fontSize:'.85rem', fontWeight:700, color:'#22C55E', borderBottom:'1px solid rgba(255,255,255,0.07)', whiteSpace:'nowrap' }}>{fmtFull$(r.amount)}</td>
                    <td style={{ padding:'10px 16px', fontSize:'.78rem', color:'#6B7794', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>{r.invoice_number ?? '—'}</td>
                    <td style={{ padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                      <span style={{ fontSize:'.63rem', fontWeight:700, textTransform:'uppercase', padding:'2px 7px', background: r.paid ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)', color: r.paid ? '#22C55E' : '#F59E0B' }}>
                        {r.paid ? 'Paid' : 'Outstanding'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  )
}
