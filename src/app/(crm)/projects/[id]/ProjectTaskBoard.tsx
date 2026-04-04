'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { fmtDate } from '@/lib/utils'
import type { ProjectTask, Profile } from '@/lib/types'

interface Props {
  tasks: ProjectTask[]
  projectId: string
  profiles: Profile[]
}

export default function ProjectTaskBoard({ tasks: initialTasks, projectId, profiles }: Props) {
  const [tasks, setTasks] = useState(initialTasks)
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function toggleTask(task: ProjectTask) {
    const newStatus = task.status === 'done' ? 'open' : 'done'
    const completed_at = newStatus === 'done' ? new Date().toISOString() : null
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus as any, completed_at: completed_at ?? undefined } : t))
    await supabase.from('project_tasks').update({ status: newStatus, completed_at }).eq('id', task.id)
    // Update project progress
    const updatedTasks = tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t)
    const doneCount = updatedTasks.filter(t => t.status === 'done').length
    const progress  = Math.round((doneCount / updatedTasks.length) * 100)
    await supabase.from('projects').update({ progress }).eq('id', projectId)
    router.refresh()
  }

  async function addTask() {
    if (!newTitle.trim()) return
    const nextIndex = tasks.length
    const { data } = await supabase.from('project_tasks').insert({
      project_id: projectId,
      title: newTitle.trim(),
      status: 'open',
      order_index: nextIndex,
    }).select().single()
    if (data) {
      setTasks(prev => [...prev, data as ProjectTask])
      setNewTitle('')
      setAdding(false)
    }
  }

  const tlColor = (status: string) => {
    if (status === 'done')        return '#22C55E'
    if (status === 'in_progress') return '#F26419'
    return 'rgba(255,255,255,0.15)'
  }

  return (
    <div style={{ padding:'12px 18px' }}>
      {tasks.length === 0 && !adding && (
        <div style={{ color:'#6B7794', fontSize:'.82rem', padding:'8px 0', marginBottom:8 }}>No tasks yet — add the first one below.</div>
      )}

      {tasks.map((task, i) => {
        const isDone = task.status === 'done'
        const isActive = task.status === 'in_progress'
        return (
          <div key={task.id} style={{ display:'flex', gap:14, paddingBottom:4 }}>
            {/* Timeline connector */}
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
              <button
                onClick={() => toggleTask(task)}
                style={{
                  width:18, height:18, borderRadius:'50%',
                  background: tlColor(task.status),
                  border: isDone ? 'none' : isActive ? '2px solid #F26419' : '1.5px solid rgba(255,255,255,0.2)',
                  cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                  flexShrink:0, transition:'all .15s',
                }}
              >
                {isDone && <span style={{ color:'#fff', fontSize:9 }}>✓</span>}
              </button>
              {i < tasks.length - 1 && (
                <div style={{ width:1, flex:1, minHeight:20, background: isDone ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.07)', margin:'3px 0' }} />
              )}
            </div>

            {/* Content */}
            <div style={{ flex:1, paddingBottom:i < tasks.length - 1 ? 12 : 0 }}>
              <div style={{
                fontSize:'.85rem', fontWeight:500,
                color: isDone ? '#6B7794' : '#EEF0F5',
                textDecoration: isDone ? 'line-through' : 'none',
              }}>
                {task.title}
              </div>
              <div style={{ fontSize:'.7rem', color:'#6B7794', marginTop:2, display:'flex', gap:8 }}>
                {task.status === 'done' && task.completed_at && <span style={{ color:'#22C55E' }}>Done {fmtDate(task.completed_at)}</span>}
                {task.status === 'in_progress' && <span style={{ color:'#F26419' }}>In progress</span>}
                {task.status === 'open' && <span>Pending</span>}
                {task.due_date && <span>&middot; Due {fmtDate(task.due_date)}</span>}
                {(task as any).profiles?.full_name && <span>&middot; {(task as any).profiles.full_name}</span>}
              </div>
            </div>
          </div>
        )
      })}

      {/* Add task inline */}
      {adding ? (
        <div style={{ display:'flex', gap:8, marginTop:12 }}>
          <input
            autoFocus
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addTask(); if (e.key === 'Escape') setAdding(false) }}
            placeholder="Task title..."
            style={{ flex:1, background:'#192035', border:'1px solid rgba(242,100,25,0.5)', color:'#EEF0F5', fontFamily:'Inter,sans-serif', fontSize:'.85rem', padding:'8px 12px', outline:'none' }}
          />
          <button onClick={addTask} style={{ padding:'8px 14px', background:'#F26419', color:'#fff', border:'none', fontFamily:'Outfit,sans-serif', fontSize:'.78rem', fontWeight:700, cursor:'pointer', clipPath:'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)' }}>Add</button>
          <button onClick={() => setAdding(false)} style={{ padding:'8px 12px', background:'transparent', border:'1px solid rgba(255,255,255,0.12)', color:'#9AA0B8', cursor:'pointer', fontSize:'.78rem' }}>Cancel</button>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} style={{ marginTop:12, padding:'7px 14px', background:'transparent', border:'1px dashed rgba(255,255,255,0.15)', color:'#6B7794', fontSize:'.78rem', cursor:'pointer', width:'100%', textAlign:'left' }}>
          + Add task
        </button>
      )}
    </div>
  )
}
