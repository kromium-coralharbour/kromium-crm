import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Topbar from '@/components/Topbar'
import { StatCard, Card, CardHead, ScoreBar, TierBadge, StatusBadge, ProgressBar } from '@/components/ui'
import { fmt$, fmtRelative, fmtDate } from '@/lib/utils'
import { format, startOfMonth, addDays } from 'date-fns'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const today      = format(new Date(), 'yyyy-MM-dd')
  const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd')
  const todayEnd   = new Date(Date.now() + 86400000).toISOString()

  const [
    { count: hotCount },
    { count: taskCount },
    { data: recentLeads },
    { data: activeTasks },
    { data: activeProjects },
    { data: revMonth },
    { data: pipeline },
  ] = await Promise.all([
    supabase.from('leads').select('*', { count:'exact', head:true }).eq('lead_tier','hot').eq('status','new'),
    supabase.from('tasks').select('*', { count:'exact', head:true }).eq('status','open').lte('due_date', todayEnd),
    supabase.from('leads').select('id,first_name,last_name,lead_score,lead_tier,status,form_type,country,created_at').order('created_at', { ascending:false }).limit(5),
    supabase.from('tasks').select('id,title,status,priority,due_date,lead_id,project_id,leads(first_name,last_name),projects(name)').eq('status','open').lte('due_date', todayEnd).order('due_date').limit(6),
    supabase.from('projects').select('id,name,type,status,progress,due_date,value,clients(company_name)').in('status',['scoping','active','review']).limit(4),
    supabase.from('revenue_records').select('amount').gte('date', monthStart).eq('paid', true),
    supabase.from('leads').select('status,lead_tier').not('status','eq','won').not('status','eq','lost'),
  ])

  const monthRevenue = (revMonth ?? []).reduce((s: number, r: any) => s + (r.amount ?? 0), 0)

  // Simple 6-month revenue chart data (last 6 months)
  const chartMonths = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    return format(d, 'MMM')
  })

  const pipelineValue = (pipeline ?? []).reduce((s: number, l: any) => {
    // rough estimate based on tier
    return s
  }, 0)

  const accentMap: Record<string, string> = {
    crm:'#F26419', website:'#3B82F6', brand:'#A855F7',
    marketing:'#22C55E', retainer:'#F59E0B', other:'#6B7794',
  }

  return (
    <>
      <Topbar title="Dashboard" />
      <div style={{ flex:1, overflowY:'auto', padding:24 }}>

        {/* HOT LEAD ALERT */}
        {(hotCount ?? 0) > 0 && (
          <Link href="/enquiries?tier=hot" style={{ textDecoration:'none' }}>
            <div style={{
              display:'flex', alignItems:'center', gap:12,
              background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.3)',
              borderLeft:'3px solid #EF4444', padding:'10px 16px', marginBottom:16, cursor:'pointer',
            }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:'#EF4444', flexShrink:0, animation:'pulse 1.5s infinite' }} />
              <div>
                <div style={{ fontSize:'.82rem', color:'#EF4444', fontWeight:600 }}>
                  {hotCount} HOT {hotCount === 1 ? 'lead' : 'leads'} awaiting response — target 2 hours
                </div>
              </div>
              <div style={{ marginLeft:'auto', fontSize:'.75rem', color:'#9AA0B8' }}>View all &rarr;</div>
            </div>
          </Link>
        )}

        {/* KPI STATS */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
          <StatCard label="Hot Leads" value={hotCount ?? 0} meta="Respond within 2 hours" accent="#EF4444" />
          <StatCard label="Tasks Due Today" value={taskCount ?? 0} meta={`${taskCount ?? 0} open`} accent="#F59E0B" />
          <StatCard label="Revenue This Month" value={fmt$(monthRevenue)} meta="Paid invoices" accent="#22C55E" />
          <StatCard label="Active Projects" value={(activeProjects ?? []).length} meta="In scoping, active, or review" />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:12 }}>
          <div>
            {/* Revenue chart placeholder */}
            <Card style={{ marginBottom:12 }}>
              <CardHead title="Revenue — Last 6 Months" />
              <div style={{ padding:'16px 16px 8px' }}>
                <div style={{ display:'flex', alignItems:'flex-end', gap:6, height:130, padding:'0 4px' }}>
                  {chartMonths.map((m, i) => {
                    const heights = [55, 45, 78, 68, 85, 100]
                    const isLast  = i === 5
                    return (
                      <div key={m} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                        <div style={{
                          width:'100%', height:`${heights[i]}%`,
                          background: isLast ? 'rgba(242,100,25,0.25)' : 'rgba(242,100,25,0.08)',
                          borderTop: `2px solid ${isLast ? '#F26419' : 'rgba(242,100,25,0.4)'}`,
                          transition:'background .15s',
                        }} />
                        <div style={{ fontSize:'.6rem', color: isLast ? '#F26419' : '#6B7794' }}>{m}</div>
                      </div>
                    )
                  })}
                </div>
                <div style={{ fontSize:'.72rem', color:'#6B7794', marginTop:8, textAlign:'right' }}>
                  <Link href="/revenue" style={{ color:'#F26419' }}>View full revenue →</Link>
                </div>
              </div>
            </Card>

            {/* Active Projects */}
            <Card>
              <CardHead title="Active Projects" action="All projects" />
              <div style={{ padding:'0' }}>
                {(activeProjects ?? []).length === 0 ? (
                  <div style={{ padding:24, textAlign:'center', color:'#6B7794', fontSize:'.85rem' }}>No active projects</div>
                ) : (
                  <table style={{ width:'100%', borderCollapse:'collapse' }}>
                    <thead>
                      <tr>
                        {['Project','Client','Progress','Status','Due'].map(h => (
                          <th key={h} style={{ fontSize:'.65rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#6B7794', padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', textAlign:'left' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(activeProjects ?? []).map((p: any) => (
                        <tr key={p.id} style={{ cursor:'pointer' }}>
                          <td style={{ padding:'11px 16px', fontSize:'.82rem', fontWeight:600, color:'#EEF0F5', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                              <div style={{ width:8, height:8, borderRadius:'50%', background: accentMap[p.type] ?? '#F26419', flexShrink:0 }} />
                              {p.name}
                            </div>
                          </td>
                          <td style={{ padding:'11px 16px', fontSize:'.82rem', color:'#9AA0B8', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>{p.clients?.company_name ?? '—'}</td>
                          <td style={{ padding:'11px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', minWidth:120 }}>
                            <ProgressBar value={p.progress} color={accentMap[p.type] ?? '#F26419'} />
                          </td>
                          <td style={{ padding:'11px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}><StatusBadge status={p.status} /></td>
                          <td style={{ padding:'11px 16px', fontSize:'.78rem', color:'#6B7794', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>{fmtDate(p.due_date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </Card>
          </div>

          <div>
            {/* Tasks due today */}
            <Card style={{ marginBottom:12 }}>
              <CardHead title="Tasks Due Today" action="All tasks" />
              <div style={{ padding:12 }}>
                {(activeTasks ?? []).length === 0 ? (
                  <div style={{ padding:'16px 0', textAlign:'center', color:'#6B7794', fontSize:'.82rem' }}>No tasks due today</div>
                ) : (
                  (activeTasks ?? []).map((t: any) => {
                    const isOverdue = t.due_date && new Date(t.due_date) < new Date()
                    const related   = t.leads ? `${t.leads.first_name} ${t.leads.last_name}` : t.projects?.name ?? ''
                    return (
                      <div key={t.id} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'9px 0', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                        <div style={{ width:14, height:14, borderRadius:2, border:'1.5px solid rgba(255,255,255,0.2)', flexShrink:0, marginTop:2 }} />
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:'.8rem', color:'#EEF0F5', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.title}</div>
                          {related && <div style={{ fontSize:'.68rem', color:'#6B7794', marginTop:1 }}>{related}</div>}
                        </div>
                        <div style={{ fontSize:'.68rem', color: isOverdue ? '#EF4444' : '#F59E0B', flexShrink:0 }}>
                          {isOverdue ? 'Overdue' : 'Today'}
                        </div>
                      </div>
                    )
                  })
                )}
                <div style={{ paddingTop:10, textAlign:'center' }}>
                  <Link href="/tasks" style={{ fontSize:'.75rem', color:'#F26419', fontWeight:600 }}>All tasks →</Link>
                </div>
              </div>
            </Card>

            {/* Recent leads */}
            <Card>
              <CardHead title="Recent Enquiries" action="All leads" />
              <div style={{ padding:12 }}>
                {(recentLeads ?? []).map((l: any) => (
                  <Link key={l.id} href={`/enquiries/${l.id}`} style={{ textDecoration:'none' }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.07)', cursor:'pointer' }}>
                      <div>
                        <div style={{ fontSize:'.82rem', fontWeight:600, color:'#EEF0F5' }}>{l.first_name} {l.last_name}</div>
                        <div style={{ fontSize:'.7rem', color:'#6B7794' }}>{l.form_type?.replace(/-/g,' ')} &middot; {l.country ?? '—'}</div>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <TierBadge tier={l.lead_tier} />
                        <div style={{ fontSize:'.68rem', color:'#6B7794', marginTop:3 }}>{fmtRelative(l.created_at)}</div>
                      </div>
                    </div>
                  </Link>
                ))}
                <div style={{ paddingTop:10, textAlign:'center' }}>
                  <Link href="/enquiries" style={{ fontSize:'.75rem', color:'#F26419', fontWeight:600 }}>All enquiries →</Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
