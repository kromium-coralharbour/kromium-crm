'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { fmtDate } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────
interface Task {
  id: string; project_id: string; title: string; description?: string
  status: string; priority: string; section: string; assigned_to?: string
  due_date?: string; order_index: number; completed_at?: string; notes?: string
  profiles?: { full_name: string }
}
interface Profile { id: string; full_name: string }
interface Note { id: string; content: string; created_at: string; profiles?: { full_name: string } }
interface Props {
  project: any; tasks: Task[]; profiles: Profile[]; notes: Note[]
  accent: string
}

// ── Constants ─────────────────────────────────────────────────────────────────
const STATUSES = [
  { key: 'open',        label: 'To Do',       color: '#6B7794', bg: 'rgba(107,119,148,0.15)' },
  { key: 'in_progress', label: 'In Progress', color: '#F26419', bg: 'rgba(242,100,25,0.15)'  },
  { key: 'done',        label: 'Complete',    color: '#22C55E', bg: 'rgba(34,197,94,0.15)'   },
  { key: 'cancelled',   label: 'Cancelled',   color: '#EF4444', bg: 'rgba(239,68,68,0.15)'   },
]
const PRIORITIES = [
  { key: 'urgent', label: 'Urgent', color: '#EF4444' },
  { key: 'high',   label: 'High',   color: '#F59E0B' },
  { key: 'medium', label: 'Medium', color: '#3B82F6' },
  { key: 'low',    label: 'Low',    color: '#6B7794' },
]
const PRIORITY_DOT: Record<string,string> = {
  urgent: '#EF4444', high: '#F59E0B', medium: '#3B82F6', low: '#6B7794'
}
const STATUS_COLOR: Record<string,{color:string;bg:string}> = Object.fromEntries(
  STATUSES.map(s => [s.key, { color: s.color, bg: s.bg }])
)

// ── Style helpers ─────────────────────────────────────────────────────────────
const inp = (extra?: React.CSSProperties): React.CSSProperties => ({
  background: '#192035', border: '1px solid rgba(255,255,255,0.1)',
  color: '#EEF0F5', fontFamily: 'Inter,sans-serif', fontSize: '.82rem',
  padding: '7px 10px', outline: 'none', width: '100%', ...extra,
})
const btn = (color = '#F26419', extra?: React.CSSProperties): React.CSSProperties => ({
  padding: '6px 14px', background: color, color: '#fff', border: 'none',
  fontFamily: 'Outfit,sans-serif', fontSize: '.78rem', fontWeight: 700,
  cursor: 'pointer', letterSpacing: '.04em', textTransform: 'uppercase',
  clipPath: 'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)', ...extra,
})
const ghost = (extra?: React.CSSProperties): React.CSSProperties => ({
  padding: '6px 12px', background: 'transparent', color: '#9AA0B8',
  border: '1px solid rgba(255,255,255,0.12)', fontFamily: 'Inter,sans-serif',
  fontSize: '.78rem', cursor: 'pointer', ...extra,
})

// ── Task Edit Modal ───────────────────────────────────────────────────────────
function TaskModal({ task, profiles, onClose, onSave, onDelete }: {
  task: Task; profiles: Profile[]
  onClose: () => void; onSave: (t: Task) => void; onDelete: (id: string) => void
}) {
  const [t, setT] = useState({ ...task })
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  function set(k: string, v: string) { setT(p => ({ ...p, [k]: v })) }

  async function save() {
    setSaving(true)
    const { data } = await supabase.from('project_tasks').update({
      title: t.title, description: t.description, status: t.status,
      priority: t.priority, section: t.section, assigned_to: t.assigned_to || null,
      due_date: t.due_date || null, notes: t.notes,
      completed_at: t.status === 'done' ? (task.completed_at ?? new Date().toISOString()) : null,
    }).eq('id', t.id).select('*,profiles(full_name)').single()
    if (data) onSave(data as Task)
    setSaving(false)
    onClose()
  }

  async function remove() {
    if (!confirm('Delete this task?')) return
    await supabase.from('project_tasks').delete().eq('id', t.id)
    onDelete(t.id)
    onClose()
  }

  const lbl: React.CSSProperties = { fontSize: '.65rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#9AA0B8', marginBottom: 5, display: 'block' }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: '#141929', border: '1px solid rgba(255,255,255,0.1)', width: '100%', maxWidth: 580, maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: 'Outfit,sans-serif', fontSize: '1rem', fontWeight: 700, color: '#fff' }}>Edit Task</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9AA0B8', cursor: 'pointer', fontSize: 18 }}>✕</button>
        </div>
        <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Title */}
          <div>
            <label style={lbl}>Task Name</label>
            <input style={inp()} value={t.title} onChange={e => set('title', e.target.value)} />
          </div>
          {/* Status + Priority row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <div>
              <label style={lbl}>Status</label>
              <select style={{ ...inp(), cursor: 'pointer', appearance: 'none' }} value={t.status} onChange={e => set('status', e.target.value)}>
                {STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Priority</label>
              <select style={{ ...inp(), cursor: 'pointer', appearance: 'none' }} value={t.priority} onChange={e => set('priority', e.target.value)}>
                {PRIORITIES.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Assignee</label>
              <select style={{ ...inp(), cursor: 'pointer', appearance: 'none' }} value={t.assigned_to ?? ''} onChange={e => set('assigned_to', e.target.value)}>
                <option value="">Unassigned</option>
                {profiles.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
              </select>
            </div>
          </div>
          {/* Section + Due date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={lbl}>Section</label>
              <input style={inp()} value={t.section ?? 'Tasks'} onChange={e => set('section', e.target.value)} placeholder="e.g. Design, Development" />
            </div>
            <div>
              <label style={lbl}>Due Date</label>
              <input type="date" style={inp()} value={t.due_date ?? ''} onChange={e => set('due_date', e.target.value)} />
            </div>
          </div>
          {/* Description */}
          <div>
            <label style={lbl}>Description</label>
            <textarea style={{ ...inp(), resize: 'vertical', minHeight: 72 }} value={t.description ?? ''} onChange={e => set('description', e.target.value)} placeholder="What needs to happen?" />
          </div>
          {/* Notes */}
          <div>
            <label style={lbl}>Internal Notes</label>
            <textarea style={{ ...inp(), resize: 'vertical', minHeight: 56 }} value={t.notes ?? ''} onChange={e => set('notes', e.target.value)} placeholder="Any additional context for the team..." />
          </div>
          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4 }}>
            <button onClick={remove} style={{ ...ghost(), color: '#EF4444', borderColor: 'rgba(239,68,68,0.3)' }}>Delete task</button>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={onClose} style={ghost()}>Cancel</button>
              <button onClick={save} disabled={saving} style={btn(saving ? '#333' : '#F26419')}>{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Inline quick-add row ──────────────────────────────────────────────────────
function QuickAdd({ section, projectId, onAdd }: { section: string; projectId: string; onAdd: (t: Task) => void }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const supabase = createClient()

  async function add() {
    if (!title.trim()) return
    const { data } = await supabase.from('project_tasks').insert({
      project_id: projectId, title: title.trim(),
      status: 'open', priority: 'medium', section, order_index: 9999,
    }).select('*,profiles(full_name)').single()
    if (data) { onAdd(data as Task); setTitle(''); setOpen(false) }
  }

  if (!open) return (
    <button onClick={() => setOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: 'transparent', border: 'none', color: '#6B7794', cursor: 'pointer', fontSize: '.78rem', width: '100%' }}>
      <span style={{ fontSize: 14 }}>+</span> Add task
    </button>
  )

  return (
    <div style={{ display: 'flex', gap: 6, padding: '4px 8px' }}>
      <input autoFocus value={title} onChange={e => setTitle(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') add(); if (e.key === 'Escape') setOpen(false) }}
        style={{ ...inp({ flex: 1, fontSize: '.82rem' }) }} placeholder="Task name..." />
      <button onClick={add} style={btn('#F26419', { padding: '6px 12px', clipPath: 'none' })}>Add</button>
      <button onClick={() => setOpen(false)} style={ghost({ padding: '6px 10px' })}>✕</button>
    </div>
  )
}

// ── LIST VIEW ─────────────────────────────────────────────────────────────────
function ListView({ tasks, profiles, projectId, accent, onUpdate, onDelete, onAdd }: {
  tasks: Task[]; profiles: Profile[]; projectId: string; accent: string
  onUpdate: (t: Task) => void; onDelete: (id: string) => void; onAdd: (t: Task) => void
}) {
  const [editing, setEditing] = useState<Task | null>(null)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  // Group by section
  const sections: Record<string, Task[]> = {}
  for (const t of tasks) {
    const s = t.section ?? 'Tasks'
    if (!sections[s]) sections[s] = []
    sections[s].push(t)
  }
  if (Object.keys(sections).length === 0) sections['Tasks'] = []

  return (
    <>
      {editing && <TaskModal task={editing} profiles={profiles} onClose={() => setEditing(null)} onSave={t => { onUpdate(t); setEditing(null) }} onDelete={id => { onDelete(id); setEditing(null) }} />}

      <div style={{ overflowX: 'auto' }}>
        {/* Column headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 110px 110px 120px 90px', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '0 12px' }}>
          {['', 'Task Name', 'Assignee', 'Status', 'Priority', 'Due'].map(h => (
            <div key={h} style={{ fontSize: '.62rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6B7794', padding: '9px 8px' }}>{h}</div>
          ))}
        </div>

        {Object.entries(sections).map(([section, sectionTasks]) => (
          <div key={section}>
            {/* Section header */}
            <div
              onClick={() => setCollapsed(p => ({ ...p, [section]: !p[section] }))}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.07)', userSelect: 'none' }}
            >
              <span style={{ color: '#9AA0B8', fontSize: 10, transform: collapsed[section] ? 'rotate(-90deg)' : 'rotate(0)', transition: 'transform .15s', display: 'inline-block' }}>▼</span>
              <span style={{ fontFamily: 'Outfit,sans-serif', fontWeight: 700, fontSize: '.82rem', color: accent }}>{section}</span>
              <span style={{ fontSize: '.68rem', color: '#6B7794', background: 'rgba(255,255,255,0.06)', padding: '1px 6px', borderRadius: 10 }}>{sectionTasks.length}</span>
              <span style={{ marginLeft: 'auto', fontSize: '.68rem', color: '#6B7794' }}>
                {sectionTasks.filter(t => t.status === 'done').length}/{sectionTasks.length} done
              </span>
            </div>

            {!collapsed[section] && (
              <>
                {sectionTasks.map(task => {
                  const st = STATUS_COLOR[task.status] ?? STATUS_COLOR.open
                  const isDone = task.status === 'done'
                  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !isDone
                  const assignee = profiles.find(p => p.id === task.assigned_to)
                  return (
                    <div
                      key={task.id}
                      onClick={() => setEditing(task)}
                      style={{ display: 'grid', gridTemplateColumns: '32px 1fr 110px 110px 120px 90px', gap: 0, padding: '0 12px', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', transition: 'background .1s' }}
                      className="hover:bg-white/[0.03]"
                    >
                      {/* Priority dot */}
                      <div style={{ display: 'flex', alignItems: 'center', padding: '10px 8px' }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: PRIORITY_DOT[task.priority] ?? '#6B7794' }} />
                      </div>
                      {/* Title */}
                      <div style={{ padding: '10px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                          onClick={e => { e.stopPropagation(); /* toggle status inline */ }}
                          style={{ width: 15, height: 15, borderRadius: 3, flexShrink: 0, border: isDone ? 'none' : '1.5px solid rgba(255,255,255,0.2)', background: isDone ? '#22C55E' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          {isDone && <span style={{ color: '#fff', fontSize: 9 }}>✓</span>}
                        </div>
                        <span style={{ fontSize: '.83rem', color: isDone ? '#6B7794' : '#EEF0F5', textDecoration: isDone ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</span>
                        {task.description && <span style={{ fontSize: '.68rem', color: '#6B7794', flexShrink: 0 }}>💬</span>}
                      </div>
                      {/* Assignee */}
                      <div style={{ padding: '10px 8px', display: 'flex', alignItems: 'center' }}>
                        {assignee ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'linear-gradient(135deg,#F26419,#E85A0E)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.6rem', fontWeight: 800, color: '#fff' }}>
                              {assignee.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                            </div>
                            <span style={{ fontSize: '.75rem', color: '#9AA0B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{assignee.full_name.split(' ')[0]}</span>
                          </div>
                        ) : <span style={{ fontSize: '.75rem', color: '#6B7794' }}>—</span>}
                      </div>
                      {/* Status */}
                      <div style={{ padding: '10px 8px', display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', padding: '3px 7px', background: st.bg, color: st.color }}>
                          {STATUSES.find(s => s.key === task.status)?.label ?? task.status}
                        </span>
                      </div>
                      {/* Priority */}
                      <div style={{ padding: '10px 8px', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: PRIORITY_DOT[task.priority] ?? '#6B7794' }} />
                        <span style={{ fontSize: '.75rem', color: '#9AA0B8', textTransform: 'capitalize' }}>{task.priority}</span>
                      </div>
                      {/* Due */}
                      <div style={{ padding: '10px 8px', display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '.75rem', color: isOverdue ? '#EF4444' : '#9AA0B8' }}>
                          {task.due_date ? fmtDate(task.due_date) : '—'}
                        </span>
                      </div>
                    </div>
                  )
                })}
                <QuickAdd section={section} projectId={projectId} onAdd={onAdd} />
              </>
            )}
          </div>
        ))}

        {/* Add section */}
        <AddSectionRow projectId={projectId} onAdd={onAdd} existingSections={Object.keys(sections)} />
      </div>
    </>
  )
}

function AddSectionRow({ projectId, onAdd, existingSections }: { projectId: string; onAdd: (t: Task) => void; existingSections: string[] }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const supabase = createClient()

  async function addSection() {
    if (!name.trim() || existingSections.includes(name.trim())) return
    // Create a placeholder task in the new section
    const { data } = await supabase.from('project_tasks').insert({
      project_id: projectId, title: 'First task', status: 'open',
      priority: 'medium', section: name.trim(), order_index: 9999,
    }).select('*,profiles(full_name)').single()
    if (data) { onAdd(data as Task); setName(''); setOpen(false) }
  }

  if (!open) return (
    <div style={{ padding: '10px 12px' }}>
      <button onClick={() => setOpen(true)} style={{ background: 'transparent', border: 'none', color: '#6B7794', cursor: 'pointer', fontSize: '.78rem', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 14 }}>+</span> Add section
      </button>
    </div>
  )

  return (
    <div style={{ display: 'flex', gap: 6, padding: '8px 12px' }}>
      <input autoFocus value={name} onChange={e => setName(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') addSection(); if (e.key === 'Escape') setOpen(false) }}
        style={{ ...inp({ flex: 1 }) }} placeholder="Section name..." />
      <button onClick={addSection} style={btn('#F26419', { padding: '6px 12px', clipPath: 'none' })}>Add</button>
      <button onClick={() => setOpen(false)} style={ghost({ padding: '6px 10px' })}>✕</button>
    </div>
  )
}

// ── BOARD VIEW ────────────────────────────────────────────────────────────────
function BoardView({ tasks, profiles, projectId, onUpdate, onDelete, onAdd }: {
  tasks: Task[]; profiles: Profile[]; projectId: string
  onUpdate: (t: Task) => void; onDelete: (id: string) => void; onAdd: (t: Task) => void
}) {
  const [editing, setEditing] = useState<Task | null>(null)
  const supabase = createClient()

  async function moveTask(task: Task, newStatus: string) {
    const updated = { ...task, status: newStatus, completed_at: newStatus === 'done' ? new Date().toISOString() : undefined }
    await supabase.from('project_tasks').update({ status: newStatus, completed_at: updated.completed_at ?? null }).eq('id', task.id)
    onUpdate(updated)
  }

  const byStatus: Record<string, Task[]> = {}
  for (const s of STATUSES) byStatus[s.key] = tasks.filter(t => t.status === s.key)

  return (
    <>
      {editing && <TaskModal task={editing} profiles={profiles} onClose={() => setEditing(null)} onSave={t => { onUpdate(t); setEditing(null) }} onDelete={id => { onDelete(id); setEditing(null) }} />}
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '4px 0 16px', minHeight: 400 }}>
        {STATUSES.map(col => (
          <div key={col.key} style={{ flexShrink: 0, width: 240, display: 'flex', flexDirection: 'column' }}>
            {/* Column header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: col.bg, marginBottom: 8, borderRadius: 2 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: col.color }} />
              <span style={{ fontSize: '.78rem', fontWeight: 700, color: col.color, textTransform: 'uppercase', letterSpacing: '.06em' }}>{col.label}</span>
              <span style={{ marginLeft: 'auto', fontSize: '.68rem', color: col.color, opacity: .7 }}>{byStatus[col.key].length}</span>
            </div>
            {/* Cards */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {byStatus[col.key].map(task => {
                const assignee = profiles.find(p => p.id === task.assigned_to)
                const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done'
                return (
                  <div key={task.id} onClick={() => setEditing(task)} style={{
                    background: '#0F1422', border: '1px solid rgba(255,255,255,0.07)', padding: '12px',
                    cursor: 'pointer', transition: 'border-color .15s', borderRadius: 2,
                  }}
                  className="hover:border-orange-500/30"
                  >
                    <div style={{ fontSize: '.83rem', fontWeight: 600, color: '#EEF0F5', marginBottom: 8, lineHeight: 1.4 }}>{task.title}</div>
                    {task.description && (
                      <div style={{ fontSize: '.75rem', color: '#6B7794', marginBottom: 8, lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>{task.description}</div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: PRIORITY_DOT[task.priority] ?? '#6B7794' }} />
                        <span style={{ fontSize: '.68rem', color: '#9AA0B8', textTransform: 'capitalize' }}>{task.priority}</span>
                      </div>
                      {task.section && task.section !== 'Tasks' && (
                        <span style={{ fontSize: '.65rem', color: '#6B7794', background: 'rgba(255,255,255,0.05)', padding: '1px 6px', borderRadius: 10 }}>{task.section}</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {assignee ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'linear-gradient(135deg,#F26419,#E85A0E)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.58rem', fontWeight: 800, color: '#fff' }}>
                            {assignee.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                          </div>
                          <span style={{ fontSize: '.7rem', color: '#9AA0B8' }}>{assignee.full_name.split(' ')[0]}</span>
                        </div>
                      ) : <span />}
                      {task.due_date && (
                        <span style={{ fontSize: '.7rem', color: isOverdue ? '#EF4444' : '#6B7794' }}>{fmtDate(task.due_date)}</span>
                      )}
                    </div>
                    {/* Move buttons */}
                    <div style={{ display: 'flex', gap: 4, marginTop: 10, flexWrap: 'wrap' }}>
                      {STATUSES.filter(s => s.key !== col.key).map(s => (
                        <button key={s.key} onClick={e => { e.stopPropagation(); moveTask(task, s.key) }} style={{ padding: '3px 8px', background: s.bg, border: 'none', color: s.color, fontSize: '.62rem', cursor: 'pointer', fontWeight: 600 }}>
                          → {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
              <div style={{ marginTop: 4 }}>
                <QuickAdd section={byStatus[col.key][0]?.section ?? 'Tasks'} projectId={projectId} onAdd={t => { onAdd({ ...t, status: col.key }) }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

// ── TIMELINE VIEW ─────────────────────────────────────────────────────────────
function TimelineView({ tasks, profiles, accent }: { tasks: Task[]; profiles: Profile[]; accent: string }) {
  const withDates = tasks.filter(t => t.due_date).sort((a, b) => (a.due_date ?? '') < (b.due_date ?? '') ? -1 : 1)
  const noDates   = tasks.filter(t => !t.due_date)

  const statusIcon: Record<string,string> = { done: '✓', in_progress: '▶', open: '○', cancelled: '✕' }

  return (
    <div style={{ padding: '8px 0' }}>
      {withDates.length === 0 && noDates.length === 0 && (
        <div style={{ padding: 32, textAlign: 'center', color: '#6B7794' }}>No tasks yet</div>
      )}

      {withDates.length > 0 && (
        <>
          <div style={{ fontSize: '.65rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: accent, marginBottom: 12, paddingBottom: 6, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>Scheduled</div>
          {withDates.map((task, i) => {
            const isDone    = task.status === 'done'
            const isOverdue = task.due_date && new Date(task.due_date) < new Date() && !isDone
            const assignee  = profiles.find(p => p.id === task.assigned_to)
            const st        = STATUS_COLOR[task.status] ?? STATUS_COLOR.open
            return (
              <div key={task.id} style={{ display: 'flex', gap: 14, paddingBottom: 4 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: isDone ? '#22C55E' : st.bg, border: `2px solid ${st.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: st.color, fontWeight: 700, flexShrink: 0 }}>
                    {statusIcon[task.status] ?? '○'}
                  </div>
                  {i < withDates.length - 1 && (
                    <div style={{ width: 1, flex: 1, minHeight: 16, background: isDone ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.07)', margin: '3px 0' }} />
                  )}
                </div>
                <div style={{ flex: 1, paddingBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                    <div>
                      <div style={{ fontSize: '.85rem', fontWeight: 600, color: isDone ? '#6B7794' : '#EEF0F5', textDecoration: isDone ? 'line-through' : 'none' }}>{task.title}</div>
                      {task.description && <div style={{ fontSize: '.75rem', color: '#6B7794', marginTop: 2, lineHeight: 1.5 }}>{task.description}</div>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                      <span style={{ fontSize: '.72rem', color: isOverdue ? '#EF4444' : isDone ? '#22C55E' : '#9AA0B8', fontWeight: isOverdue ? 700 : 400 }}>
                        {isOverdue ? '⚠ ' : ''}{fmtDate(task.due_date)}
                      </span>
                      {assignee && <span style={{ fontSize: '.68rem', color: '#6B7794' }}>{assignee.full_name.split(' ')[0]}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                    <span style={{ fontSize: '.65rem', fontWeight: 700, padding: '2px 7px', background: st.bg, color: st.color, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                      {STATUSES.find(s => s.key === task.status)?.label}
                    </span>
                    <span style={{ fontSize: '.65rem', fontWeight: 700, padding: '2px 7px', background: 'rgba(255,255,255,0.05)', color: '#9AA0B8' }}>
                      {PRIORITIES.find(p => p.key === task.priority)?.label ?? task.priority}
                    </span>
                    {task.section && task.section !== 'Tasks' && (
                      <span style={{ fontSize: '.65rem', padding: '2px 7px', background: 'rgba(255,255,255,0.05)', color: '#9AA0B8' }}>{task.section}</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </>
      )}

      {noDates.length > 0 && (
        <>
          <div style={{ fontSize: '.65rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6B7794', marginTop: 20, marginBottom: 12, paddingBottom: 6, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>No Due Date</div>
          {noDates.map(task => {
            const st       = STATUS_COLOR[task.status] ?? STATUS_COLOR.open
            const assignee = profiles.find(p => p.id === task.assigned_to)
            return (
              <div key={task.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: st.color, flexShrink: 0, marginTop: 5 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '.83rem', color: '#EEF0F5' }}>{task.title}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                    <span style={{ fontSize: '.65rem', fontWeight: 700, padding: '2px 6px', background: st.bg, color: st.color, textTransform: 'uppercase' }}>{STATUSES.find(s => s.key === task.status)?.label}</span>
                    {assignee && <span style={{ fontSize: '.65rem', color: '#6B7794' }}>{assignee.full_name.split(' ')[0]}</span>}
                  </div>
                </div>
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}

// ── Notes panel ───────────────────────────────────────────────────────────────
function NotesPanel({ projectId, notes: initialNotes, profiles }: { projectId: string; notes: Note[]; profiles: Profile[] }) {
  const [notes, setNotes] = useState(initialNotes)
  const [text,  setText]  = useState('')
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  async function addNote() {
    if (!text.trim()) return
    setSaving(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { setSaving(false); return }
    const { data } = await supabase.from('notes').insert({
      content: text.trim(), author_id: session.user.id, project_id: projectId,
    }).select('*,profiles(full_name)').single()
    if (data) { setNotes(p => [data as Note, ...p]); setText('') }
    setSaving(false)
  }

  return (
    <div>
      <textarea value={text} onChange={e => setText(e.target.value)}
        style={{ ...inp({ resize: 'vertical', minHeight: 72, marginBottom: 8, display: 'block' }) }}
        placeholder="Add a note for the team..." />
      <button onClick={addNote} disabled={saving || !text.trim()} style={btn(saving || !text.trim() ? '#333' : '#F26419')}>
        {saving ? 'Adding...' : 'Add Note'}
      </button>
      <div style={{ marginTop: 16 }}>
        {notes.map(n => (
          <div key={n.id} style={{ padding: '10px 12px', background: '#0F1422', border: '1px solid rgba(255,255,255,0.07)', marginBottom: 8, borderRadius: 2 }}>
            <div style={{ fontSize: '.83rem', color: '#9AA0B8', lineHeight: 1.6 }}>{n.content}</div>
            <div style={{ fontSize: '.7rem', color: '#6B7794', marginTop: 6 }}>
              {n.profiles?.full_name ?? 'Unknown'} &middot; {fmtDate(n.created_at)}
            </div>
          </div>
        ))}
        {notes.length === 0 && <div style={{ color: '#6B7794', fontSize: '.82rem', padding: '8px 0' }}>No notes yet</div>}
      </div>
    </div>
  )
}

// ── Main Workspace ────────────────────────────────────────────────────────────
type View = 'list' | 'board' | 'timeline'

export default function ProjectWorkspace({ project, tasks: initialTasks, profiles, notes, accent }: Props) {
  const [tasks,   setTasks]   = useState(initialTasks)
  const [view,    setView]    = useState<View>('list')
  const [tab,     setTab]     = useState<'tasks' | 'notes'>('tasks')
  const router = useRouter()
  const supabase = createClient()

  const done     = tasks.filter(t => t.status === 'done').length
  const total    = tasks.length
  const progress = total > 0 ? Math.round((done / total) * 100) : 0

  function updateTask(updated: Task) {
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t))
    // sync progress
    const newDone = tasks.map(t => t.id === updated.id ? updated : t).filter(t => t.status === 'done').length
    const newPct  = total > 0 ? Math.round((newDone / total) * 100) : 0
    supabase.from('projects').update({ progress: newPct }).eq('id', project.id)
  }

  function deleteTask(id: string) {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  function addTask(t: Task) {
    setTasks(prev => [...prev, t])
  }

  const viewBtn = (v: View, label: string, icon: string) => (
    <button onClick={() => setView(v)} style={{
      display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px',
      background: view === v ? 'rgba(242,100,25,0.12)' : 'transparent',
      border: view === v ? '1px solid rgba(242,100,25,0.4)' : '1px solid transparent',
      color: view === v ? '#F26419' : '#9AA0B8', cursor: 'pointer',
      fontFamily: 'Inter,sans-serif', fontSize: '.78rem', fontWeight: 500, borderRadius: 2,
      transition: 'all .15s',
    }}>
      <span>{icon}</span>{label}
    </button>
  )

  const tabBtn = (t: 'tasks'|'notes', label: string) => (
    <button onClick={() => setTab(t)} style={{
      padding: '7px 16px', fontSize: '.8rem', fontWeight: 600,
      color: tab === t ? '#F26419' : '#9AA0B8',
      background: 'none', border: 'none',
      borderBottom: tab === t ? '2px solid #F26419' : '2px solid transparent',
      cursor: 'pointer', transition: 'all .15s',
    }}>{label}</button>
  )

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0B0E1A' }}>

      {/* Project header bar */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: '#141929' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: accent, flexShrink: 0 }} />
              <h1 style={{ fontFamily: 'Outfit,sans-serif', fontSize: '1.25rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{project.name}</h1>
            </div>
            <div style={{ fontSize: '.78rem', color: '#9AA0B8', marginTop: 4, marginLeft: 20 }}>
              {project.clients?.company_name} &middot; <span style={{ textTransform: 'capitalize' }}>{project.type}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: '.72rem', fontWeight: 700, padding: '4px 10px', background: 'rgba(34,197,94,0.12)', color: '#22C55E' }}>
              {done}/{total} tasks
            </span>
            <span style={{ fontSize: '.72rem', fontWeight: 700, color: accent }}>{progress}%</span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginBottom: 12 }}>
          <div style={{ height: 4, borderRadius: 2, background: accent, width: `${progress}%`, transition: 'width .4s ease' }} />
        </div>

        {/* Tab + view switcher row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', borderBottom: 'none', gap: 0 }}>
            {tabBtn('tasks', 'Tasks')}
            {tabBtn('notes', 'Notes')}
          </div>
          {tab === 'tasks' && (
            <div style={{ display: 'flex', gap: 4 }}>
              {viewBtn('list',     'List',     '☰')}
              {viewBtn('board',    'Board',    '⊞')}
              {viewBtn('timeline', 'Timeline', '↗')}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: view === 'board' ? 'auto' : 'hidden' }}>
        {tab === 'tasks' && (
          <div style={{ padding: view === 'board' ? '16px 24px' : '0' }}>
            {view === 'list'     && <ListView     tasks={tasks} profiles={profiles} projectId={project.id} accent={accent} onUpdate={updateTask} onDelete={deleteTask} onAdd={addTask} />}
            {view === 'board'    && <BoardView    tasks={tasks} profiles={profiles} projectId={project.id} onUpdate={updateTask} onDelete={deleteTask} onAdd={addTask} />}
            {view === 'timeline' && <div style={{ padding: '0 24px' }}><TimelineView tasks={tasks} profiles={profiles} accent={accent} /></div>}
          </div>
        )}
        {tab === 'notes' && (
          <div style={{ padding: '20px 24px' }}>
            <NotesPanel projectId={project.id} notes={notes} profiles={profiles} />
          </div>
        )}
      </div>
    </div>
  )
}
