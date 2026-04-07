'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { PROJECT_TASK_TEMPLATES } from '@/lib/scoring'

interface Client { id: string; company_name: string }
interface Props { open: boolean; onClose: () => void; clientId?: string }

const inp: React.CSSProperties = { width:'100%', background:'#192035', border:'1px solid rgba(255,255,255,0.1)', color:'#EEF0F5', fontFamily:'Inter,sans-serif', fontSize:'.85rem', padding:'9px 12px', outline:'none' }
const lbl: React.CSSProperties = { display:'block', fontSize:'.68rem', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'#9AA0B8', marginBottom:6 }

const PROJECT_TYPES = ['crm','website','brand','marketing','retainer','other']

export default function NewProjectModal({ open, onClose, clientId }: Props) {
  const [clients, setClients]   = useState<Client[]>([])
  const [form, setForm]         = useState({ client_id: clientId??'', name:'', type:'crm', value:'', start_date:'', due_date:'', description:'' })
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (!open) return
    supabase.from('clients').select('id,company_name').order('company_name').then(({ data }) => setClients(data ?? []))
  }, [open])

  function set(k: string, v: string) { setForm(p => ({ ...p, [k]: v })) }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.client_id) { setError('Please select a client'); return }
    setSaving(true); setError('')
    try {
      const supabase = createClient()
      // Create project
      const { data: project, error: projErr } = await supabase.from('projects').insert({
        client_id:   form.client_id,
        name:        form.name,
        type:        form.type,
        value:       parseFloat(form.value) || 0,
        start_date:  form.start_date || null,
        due_date:    form.due_date   || null,
        description: form.description || null,
        status:      'scoping',
        progress:    0,
      }).select().single()

      if (projErr) throw new Error(projErr.message)

      // Auto-create task template
      const tasks = PROJECT_TASK_TEMPLATES[form.type] ?? PROJECT_TASK_TEMPLATES.other
      if (tasks.length > 0) {
        await supabase.from('project_tasks').insert(
          tasks.map((title, i) => ({ project_id: project.id, title, status:'open', order_index: i }))
        )
      }

      onClose()
      router.push(`/projects/${project.id}`)
      router.refresh()
    } catch(err: any) { setError(err.message); setSaving(false) }
  }

  if (!open) return null

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ background:'#141929', border:'1px solid rgba(255,255,255,0.1)', width:'100%', maxWidth:520, maxHeight:'90vh', overflowY:'auto', position:'relative' }}>
        <div style={{ position:'sticky', top:0, background:'#141929', padding:'20px 24px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'1.1rem', fontWeight:700, color:'#fff' }}>New Project</div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#9AA0B8', cursor:'pointer', fontSize:18 }}>✕</button>
        </div>
        <form onSubmit={submit} style={{ padding:'20px 24px' }}>
          <div style={{ marginBottom:14 }}>
            <label style={lbl}>Client *</label>
            <select required style={{ ...inp, cursor:'pointer', appearance:'none' }} value={form.client_id} onChange={e=>set('client_id',e.target.value)}>
              <option value="">Select client</option>
              {clients.map(c=><option key={c.id} value={c.id}>{c.company_name}</option>)}
            </select>
          </div>
          <div style={{ marginBottom:14 }}><label style={lbl}>Project Name *</label><input required style={inp} value={form.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Brand Identity Redesign" /></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
            <div>
              <label style={lbl}>Type *</label>
              <select style={{ ...inp, cursor:'pointer', appearance:'none' }} value={form.type} onChange={e=>set('type',e.target.value)}>
                {PROJECT_TYPES.map(t=><option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Value (USD)</label><input type="number" style={inp} value={form.value} onChange={e=>set('value',e.target.value)} placeholder="0" /></div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
            <div><label style={lbl}>Start Date</label><input type="date" style={inp} value={form.start_date} onChange={e=>set('start_date',e.target.value)} /></div>
            <div><label style={lbl}>Due Date</label><input type="date" style={inp} value={form.due_date} onChange={e=>set('due_date',e.target.value)} /></div>
          </div>
          <div style={{ marginBottom:8 }}>
            <label style={lbl}>Description</label>
            <textarea style={{ ...inp, resize:'vertical', minHeight:70 }} value={form.description} onChange={e=>set('description',e.target.value)} placeholder="Brief description of the project scope..." />
          </div>
          <div style={{ fontSize:'.75rem', color:'#6B7794', marginBottom:20 }}>
            Task checklist will be auto-generated from the {form.type} template ({PROJECT_TASK_TEMPLATES[form.type]?.length ?? 0} tasks)
          </div>
          {error && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'#EF4444', padding:'10px 14px', fontSize:'.82rem', marginBottom:16 }}>{error}</div>}
          <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding:'9px 20px', background:'transparent', border:'1px solid rgba(255,255,255,0.12)', color:'#9AA0B8', cursor:'pointer', fontFamily:'Outfit,sans-serif', fontSize:'.82rem' }}>Cancel</button>
            <button type="submit" disabled={saving} style={{ padding:'9px 24px', background: saving?'#333':'#F26419', color:'#fff', border:'none', cursor: saving?'not-allowed':'pointer', fontFamily:'Outfit,sans-serif', fontSize:'.85rem', fontWeight:700, clipPath:'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)' }}>
              {saving ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
