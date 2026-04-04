import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Topbar from '@/components/Topbar'
import { Card, StatusBadge } from '@/components/ui'
import { fmtDate } from '@/lib/utils'

const PRIORITY_COLOR: Record<string, string> = {
  urgent:'#EF4444', high:'#F59E0B', medium:'#3B82F6', low:'#6B7794'
}

export default async function TasksPage({ searchParams }: { searchParams: { filter?: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let query = supabase
    .from('tasks')
    .select('*,leads(first_name,last_name),projects(name),profiles(full_name)')
    .order('due_date', { nullsFirst: false })

  const filter = searchParams.filter ?? 'open'
  if (filter === 'open')     query = query.in('status', ['open','in_progress'])
  if (filter === 'overdue')  query = query.in('status', ['open','in_progress']).lt('due_date', new Date().toISOString())
  if (filter === 'today')    query = query.in('status', ['open','in_progress']).lte('due_date', new Date(Date.now()+86400000).toISOString())
  if (filter === 'done')     query = query.eq('status', 'done')
  if (filter === 'mine')     query = query.eq('assigned_to', user?.id ?? '')

  const { data: tasks } = await query.limit(100)

  const filters = [
    { key:'open',    label:'Open' },
    { key:'overdue', label:'Overdue' },
    { key:'today',   label:'Due Today' },
    { key:'mine',    label:'My Tasks' },
    { key:'done',    label:'Completed' },
  ]

  return (
    <>
      <Topbar title="Tasks" />
      <div style={{ flex:1, overflowY:'auto', padding:24 }}>
        <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
          {filters.map(f => (
            <Link key={f.key} href={`/tasks?filter=${f.key}`} style={{ textDecoration:'none' }}>
              <div style={{
                padding:'5px 12px', fontSize:'.72rem', fontWeight:600,
                background: filter === f.key ? 'rgba(242,100,25,0.10)' : '#141929',
                border: filter === f.key ? '1px solid #F26419' : '1px solid rgba(255,255,255,0.07)',
                color: filter === f.key ? '#F26419' : '#9AA0B8', cursor:'pointer',
              }}>{f.label}</div>
            </Link>
          ))}
        </div>

        <Card>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr>
                  {['','Task','Related To','Type','Assignee','Due','Priority','Status'].map(h => (
                    <th key={h} style={{ fontSize:'.65rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#6B7794', padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', textAlign:'left', background:'#141929', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(tasks ?? []).length === 0 && (
                  <tr><td colSpan={8} style={{ padding:48, textAlign:'center', color:'#6B7794' }}>No tasks</td></tr>
                )}
                {(tasks ?? []).map((t: any) => {
                  const isOverdue = t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done'
                  const isDone    = t.status === 'done'
                  const related   = t.leads  ? `${t.leads.first_name} ${t.leads.last_name}` : t.projects?.name ?? '—'
                  const type      = t.leads  ? 'Lead follow-up' : t.projects ? 'Project task' : 'General'

                  return (
                    <tr key={t.id} style={{ opacity: isDone ? .6 : 1 }}>
                      <td style={{ padding:'11px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', width:32 }}>
                        <div style={{ width:14, height:14, borderRadius:2, border: isDone ? 'none' : '1.5px solid rgba(255,255,255,0.2)', background: isDone ? '#22C55E' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center' }}>
                          {isDone && <span style={{ color:'#fff', fontSize:9 }}>✓</span>}
                        </div>
                      </td>
                      <td style={{ padding:'11px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                        <div style={{ fontWeight:600, color: isDone ? '#6B7794' : '#EEF0F5', textDecoration: isDone ? 'line-through' : 'none', fontSize:'.82rem' }}>{t.title}</div>
                        {t.description && <div style={{ fontSize:'.72rem', color:'#6B7794', marginTop:2 }}>{t.description}</div>}
                      </td>
                      <td style={{ padding:'11px 16px', fontSize:'.82rem', color:'#9AA0B8', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                        {t.leads ? <Link href={`/enquiries/${t.lead_id}`} style={{ color:'#F26419', textDecoration:'none' }}>{related}</Link>
                          : t.projects ? <Link href={`/projects/${t.project_id}`} style={{ color:'#22C55E', textDecoration:'none' }}>{related}</Link>
                          : related}
                      </td>
                      <td style={{ padding:'11px 16px', fontSize:'.78rem', color:'#6B7794', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>{t.auto_generated ? '⚡ Auto' : 'Manual'}</td>
                      <td style={{ padding:'11px 16px', fontSize:'.82rem', color:'#9AA0B8', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>{t.profiles?.full_name ?? '—'}</td>
                      <td style={{ padding:'11px 16px', fontSize:'.78rem', borderBottom:'1px solid rgba(255,255,255,0.07)', color: isOverdue ? '#EF4444' : '#9AA0B8', whiteSpace:'nowrap' }}>
                        {t.due_date ? (isOverdue ? `Overdue · ${fmtDate(t.due_date)}` : fmtDate(t.due_date)) : '—'}
                      </td>
                      <td style={{ padding:'11px 16px', fontSize:'.75rem', fontWeight:700, color: PRIORITY_COLOR[t.priority] ?? '#6B7794', borderBottom:'1px solid rgba(255,255,255,0.07)', textTransform:'uppercase' }}>{t.priority}</td>
                      <td style={{ padding:'11px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}><StatusBadge status={t.status} /></td>
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
