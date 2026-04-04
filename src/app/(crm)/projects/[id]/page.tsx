import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Topbar from '@/components/Topbar'
import { Card, CardHead, StatCard, StatusBadge, ProgressBar, NoteItem } from '@/components/ui'
import { fmtFull$, fmtDate, fmtRelative } from '@/lib/utils'
import ProjectTaskBoard from './ProjectTaskBoard'

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const [{ data: project }, { data: notes }, { data: profiles }] = await Promise.all([
    supabase.from('projects').select('*,clients(id,company_name,email,contact_name),project_tasks(*,profiles(full_name))').eq('id', params.id).single(),
    supabase.from('notes').select('*,profiles(full_name)').eq('project_id', params.id).order('created_at', { ascending: false }),
    supabase.from('profiles').select('*'),
  ])

  if (!project) notFound()

  const tasks    = (project.project_tasks ?? []).sort((a: any, b: any) => a.order_index - b.order_index)
  const done     = tasks.filter((t: any) => t.status === 'done').length
  const total    = tasks.length
  const progress = total > 0 ? Math.round((done / total) * 100) : project.progress ?? 0

  const accentMap: Record<string, string> = {
    crm:'#F26419', website:'#3B82F6', brand:'#A855F7',
    marketing:'#22C55E', retainer:'#F59E0B', other:'#6B7794',
  }
  const accent = accentMap[project.type] ?? '#F26419'

  return (
    <>
      <Topbar title={project.name} />
      <div style={{ flex:1, overflowY:'auto', padding:24 }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:16 }}>

          {/* Left */}
          <div>
            {/* Summary */}
            <Card style={{ marginBottom:12, padding:'20px 24px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
                <div>
                  <h1 style={{ fontFamily:'Outfit,sans-serif', fontSize:'1.4rem', fontWeight:800, color:'#fff', marginBottom:4 }}>{project.name}</h1>
                  <Link href={`/clients/${project.clients?.id}`} style={{ textDecoration:'none', fontSize:'.82rem', color:'#F26419' }}>
                    {project.clients?.company_name}
                  </Link>
                  <span style={{ color:'#6B7794', fontSize:'.82rem' }}> &middot; <span style={{ textTransform:'capitalize' }}>{project.type}</span></span>
                </div>
                <StatusBadge status={project.status} />
              </div>
              <div style={{ marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.78rem', color:'#6B7794', marginBottom:6 }}>
                  <span>Overall progress</span>
                  <span style={{ color: accent, fontWeight:700 }}>{progress}%</span>
                </div>
                <div style={{ height:6, background:'rgba(255,255,255,0.08)', borderRadius:3 }}>
                  <div style={{ height:6, borderRadius:3, background: accent, width:`${progress}%`, transition:'width .3s' }} />
                </div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <span style={{ fontSize:'.78rem', color:'#6B7794' }}>{done} of {total} tasks complete</span>
                <span style={{ color:'#6B7794' }}>&middot;</span>
                <span style={{ fontSize:'.78rem', fontWeight:700, color:'#22C55E' }}>{fmtFull$(project.value)}</span>
                {project.due_date && <><span style={{ color:'#6B7794' }}>&middot;</span><span style={{ fontSize:'.78rem', color:'#6B7794' }}>Due {fmtDate(project.due_date)}</span></>}
              </div>
            </Card>

            {/* Task board */}
            <Card style={{ marginBottom:12 }}>
              <CardHead title="Task Timeline" action="+ Add Task" />
              <ProjectTaskBoard tasks={tasks} projectId={project.id} profiles={profiles ?? []} />
            </Card>

            {/* Notes */}
            <Card>
              <CardHead title="Notes" />
              <div style={{ padding:'12px 16px' }}>
                <textarea placeholder="Add a project note..." style={{ width:'100%', background:'#192035', border:'1px solid rgba(255,255,255,0.07)', color:'#EEF0F5', fontFamily:'Inter,sans-serif', fontSize:'.82rem', padding:'9px 12px', outline:'none', resize:'vertical', minHeight:64, marginBottom:6 }} />
                <button style={{ padding:'6px 14px', background:'#F26419', color:'#fff', border:'none', fontFamily:'Outfit,sans-serif', fontSize:'.78rem', fontWeight:700, letterSpacing:'.04em', textTransform:'uppercase', cursor:'pointer', clipPath:'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)' }}>Add Note</button>
                <div style={{ marginTop:12 }}>
                  {(notes ?? []).map((n: any) => (
                    <NoteItem key={n.id} content={n.content} author={n.profiles?.full_name ?? '—'} date={fmtRelative(n.created_at)} />
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Right */}
          <div>
            <Card style={{ marginBottom:12 }}>
              <CardHead title="Project Details" />
              <div style={{ padding:'16px 18px' }}>
                {[
                  { label:'Client',     value: project.clients?.company_name },
                  { label:'Type',       value: project.type },
                  { label:'Status',     value: project.status },
                  { label:'Value',      value: fmtFull$(project.value) },
                  { label:'Start Date', value: fmtDate(project.start_date) },
                  { label:'Due Date',   value: fmtDate(project.due_date) },
                ].map(item => (
                  <div key={item.label} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.07)', fontSize:'.82rem' }}>
                    <span style={{ color:'#6B7794' }}>{item.label}</span>
                    <span style={{ color:'#EEF0F5', fontWeight:500, textTransform:'capitalize' }}>{item.value || '—'}</span>
                  </div>
                ))}
              </div>
            </Card>

            {project.description && (
              <Card>
                <CardHead title="Description" />
                <div style={{ padding:'14px 18px', fontSize:'.85rem', color:'#9AA0B8', lineHeight:1.7 }}>{project.description}</div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
