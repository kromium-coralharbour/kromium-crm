import ActionButton from '@/components/ActionButton'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Topbar from '@/components/Topbar'
import { StatusBadge, ProgressBar } from '@/components/ui'
import { fmtFull$, fmtDate } from '@/lib/utils'

export default async function ProjectsPage({ searchParams }: { searchParams: { status?: string } }) {
  const supabase = await createClient()

  let query = supabase
    .from('projects')
    .select('*,clients(company_name),project_tasks(id,status)')
    .order('created_at', { ascending: false })

  if (searchParams.status) query = query.eq('status', searchParams.status)

  const { data: projects } = await query

  const accentMap: Record<string, string> = {
    crm:'#F26419', website:'#3B82F6', brand:'#A855F7',
    marketing:'#22C55E', retainer:'#F59E0B', other:'#6B7794',
  }

  const statuses = ['','scoping','active','review','complete','paused']

  return (
    <>
      <Topbar title="Projects" />
      <div style={{ flex:1, overflowY:'auto', padding:24 }}>
        {/* Filter */}
        <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:12 }}><ActionButton type="project" label="+ New Project" /></div>
        <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
          {statuses.map(s => (
            <Link key={s} href={s ? `/projects?status=${s}` : '/projects'} style={{ textDecoration:'none' }}>
              <div style={{
                padding:'5px 12px', fontSize:'.72rem', fontWeight:600,
                background: (searchParams.status ?? '') === s ? 'rgba(242,100,25,0.10)' : '#141929',
                border: (searchParams.status ?? '') === s ? '1px solid #F26419' : '1px solid rgba(255,255,255,0.07)',
                color: (searchParams.status ?? '') === s ? '#F26419' : '#9AA0B8', cursor:'pointer',
              }}>
                {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
              </div>
            </Link>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
          {(projects ?? []).length === 0 && (
            <div style={{ gridColumn:'1/-1', padding:48, textAlign:'center', color:'#6B7794' }}>No projects found</div>
          )}
          {(projects ?? []).map((p: any) => {
            const total = (p.project_tasks ?? []).length
            const done  = (p.project_tasks ?? []).filter((t: any) => t.status === 'done').length
            const pct   = total > 0 ? Math.round((done / total) * 100) : p.progress ?? 0
            const accent = accentMap[p.type] ?? '#F26419'

            return (
              <Link key={p.id} href={`/projects/${p.id}`} style={{ textDecoration:'none' }}>
                <div style={{
                  background:'#141929', border:'1px solid rgba(255,255,255,0.07)',
                  padding:18, cursor:'pointer', position:'relative',
                  transition:'border-color .15s',
                }}
                className="hover:border-orange-500/30"
                >
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background: accent }} />
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
                    <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'.95rem', fontWeight:700, color:'#fff', flex:1, marginRight:8 }}>{p.name}</div>
                    <StatusBadge status={p.status} />
                  </div>
                  <div style={{ fontSize:'.75rem', color:'#6B7794', marginBottom:12 }}>
                    {p.clients?.company_name ?? '—'} &middot; <span style={{ textTransform:'capitalize' }}>{p.type}</span>
                  </div>

                  <div style={{ marginBottom:10 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.68rem', color:'#6B7794', marginBottom:5 }}>
                      <span>Progress</span><span style={{ color: accent }}>{pct}%</span>
                    </div>
                    <ProgressBar value={pct} color={accent} />
                  </div>

                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div style={{ fontSize:'.72rem', color:'#6B7794' }}>{done} of {total} tasks done</div>
                    <div style={{ fontSize:'.78rem', fontWeight:700, color:'#22C55E' }}>{fmtFull$(p.value)}</div>
                  </div>

                  {p.due_date && (
                    <div style={{ fontSize:'.7rem', color:'#6B7794', marginTop:6 }}>Due {fmtDate(p.due_date)}</div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
