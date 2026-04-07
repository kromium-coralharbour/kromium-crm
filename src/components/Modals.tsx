'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const inp: React.CSSProperties = { width:'100%', background:'#192035', border:'1px solid rgba(255,255,255,0.1)', color:'#EEF0F5', fontFamily:'Inter,sans-serif', fontSize:'.85rem', padding:'9px 12px', outline:'none' }
const lbl: React.CSSProperties = { display:'block', fontSize:'.68rem', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'#9AA0B8', marginBottom:6 }
const row: React.CSSProperties = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }
const f14: React.CSSProperties = { marginBottom:14 }

function ModalShell({ title, open, onClose, children }: { title:string; open:boolean; onClose:()=>void; children:React.ReactNode }) {
  if (!open) return null
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ background:'#141929', border:'1px solid rgba(255,255,255,0.1)', width:'100%', maxWidth:520, maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ position:'sticky', top:0, background:'#141929', padding:'20px 24px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'1.1rem', fontWeight:700, color:'#fff' }}>{title}</div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#9AA0B8', cursor:'pointer', fontSize:18 }}>✕</button>
        </div>
        <div style={{ padding:'20px 24px' }}>{children}</div>
      </div>
    </div>
  )
}

function SaveBtn({ saving, label='Save' }: { saving:boolean; label?:string }) {
  return <button type="submit" disabled={saving} style={{ padding:'9px 24px', background:saving?'#333':'#F26419', color:'#fff', border:'none', cursor:saving?'not-allowed':'pointer', fontFamily:'Outfit,sans-serif', fontSize:'.85rem', fontWeight:700, clipPath:'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)' }}>{saving ? 'Saving...' : label}</button>
}
function CancelBtn({ onClose }: { onClose:()=>void }) {
  return <button type="button" onClick={onClose} style={{ padding:'9px 20px', background:'transparent', border:'1px solid rgba(255,255,255,0.12)', color:'#9AA0B8', cursor:'pointer', fontFamily:'Outfit,sans-serif', fontSize:'.82rem' }}>Cancel</button>
}
function ErrMsg({ e }: { e:string }) {
  if (!e) return null
  return <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'#EF4444', padding:'10px 14px', fontSize:'.82rem', marginBottom:16 }}>{e}</div>
}

const COUNTRIES = ['Barbados','Jamaica','Cayman Islands','Bahamas','Trinidad and Tobago','British Virgin Islands','Antigua and Barbuda','Saint Lucia','Grenada','Dominica','Saint Kitts and Nevis','Turks and Caicos','US Virgin Islands','Haiti','Other']
const INDUSTRIES = ['Real Estate','Construction and Development','Hospitality and Tourism','Professional Services','Retail','Healthcare or Wellness','Other']

// ── NEW CLIENT ────────────────────────────────────────────────────────────────
export function NewClientModal({ open, onClose }: { open:boolean; onClose:()=>void }) {
  const [form, setForm] = useState({ company_name:'', contact_name:'', email:'', phone:'', country:'', industry:'', website:'', notes:'' })
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')
  const router = useRouter()
  function set(k:string,v:string) { setForm(p=>({...p,[k]:v})) }

  async function submit(e:React.FormEvent) {
    e.preventDefault(); setSaving(true); setError('')
    try {
      const sb = createClient()
      const { data, error:err } = await sb.from('clients').insert({ ...form, lifetime_value:0, active:true }).select().single()
      if (err) throw new Error(err.message)
      onClose(); router.push(`/clients/${data.id}`); router.refresh()
    } catch(err:any) { setError(err.message); setSaving(false) }
  }

  return (
    <ModalShell title="New Client" open={open} onClose={onClose}>
      <form onSubmit={submit}>
        <div style={row}>
          <div style={f14}><label style={lbl}>Company Name *</label><input required style={inp} value={form.company_name} onChange={e=>set('company_name',e.target.value)} placeholder="Company name" /></div>
          <div style={f14}><label style={lbl}>Contact Name *</label><input required style={inp} value={form.contact_name} onChange={e=>set('contact_name',e.target.value)} placeholder="Primary contact" /></div>
        </div>
        <div style={f14}><label style={lbl}>Email *</label><input required type="email" style={inp} value={form.email} onChange={e=>set('email',e.target.value)} placeholder="email@company.com" /></div>
        <div style={row}>
          <div style={f14}><label style={lbl}>Phone</label><input style={inp} value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="+1 246 000 0000" /></div>
          <div style={f14}><label style={lbl}>Website</label><input style={inp} value={form.website} onChange={e=>set('website',e.target.value)} placeholder="https://" /></div>
        </div>
        <div style={row}>
          <div style={f14}>
            <label style={lbl}>Country</label>
            <select style={{...inp,cursor:'pointer',appearance:'none'}} value={form.country} onChange={e=>set('country',e.target.value)}>
              <option value="">Select</option>{COUNTRIES.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={f14}>
            <label style={lbl}>Industry</label>
            <select style={{...inp,cursor:'pointer',appearance:'none'}} value={form.industry} onChange={e=>set('industry',e.target.value)}>
              <option value="">Select</option>{INDUSTRIES.map(i=><option key={i}>{i}</option>)}
            </select>
          </div>
        </div>
        <div style={{marginBottom:20}}><label style={lbl}>Notes</label><textarea style={{...inp,resize:'vertical',minHeight:60}} value={form.notes} onChange={e=>set('notes',e.target.value)} placeholder="Any initial notes..." /></div>
        <ErrMsg e={error} />
        <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}><CancelBtn onClose={onClose} /><SaveBtn saving={saving} label="Create Client" /></div>
      </form>
    </ModalShell>
  )
}

// ── NEW TASK ──────────────────────────────────────────────────────────────────
export function NewTaskModal({ open, onClose, leadId, projectId }: { open:boolean; onClose:()=>void; leadId?:string; projectId?:string }) {
  const [form, setForm] = useState({ title:'', description:'', priority:'medium', due_date:'', assigned_to:'' })
  const [profiles, setProfiles] = useState<{id:string;full_name:string}[]>([])
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')
  const router = useRouter()
  function set(k:string,v:string) { setForm(p=>({...p,[k]:v})) }

  useEffect(() => {
    if (!open) return
    createClient().from('profiles').select('id,full_name').then(({data})=>setProfiles(data??[]))
  },[open])

  async function submit(e:React.FormEvent) {
    e.preventDefault(); setSaving(true); setError('')
    try {
      const { error:err } = await createClient().from('tasks').insert({
        title:       form.title,
        description: form.description || null,
        priority:    form.priority,
        due_date:    form.due_date || null,
        assigned_to: form.assigned_to || null,
        lead_id:     leadId    ?? null,
        project_id:  projectId ?? null,
        status:      'open',
        auto_generated: false,
      })
      if (err) throw new Error(err.message)
      onClose(); router.refresh()
    } catch(err:any) { setError(err.message); setSaving(false) }
  }

  return (
    <ModalShell title="New Task" open={open} onClose={onClose}>
      <form onSubmit={submit}>
        <div style={f14}><label style={lbl}>Task Title *</label><input required style={inp} value={form.title} onChange={e=>set('title',e.target.value)} placeholder="What needs to be done?" /></div>
        <div style={f14}><label style={lbl}>Description</label><textarea style={{...inp,resize:'vertical',minHeight:60}} value={form.description} onChange={e=>set('description',e.target.value)} placeholder="Additional context..." /></div>
        <div style={row}>
          <div style={f14}>
            <label style={lbl}>Priority</label>
            <select style={{...inp,cursor:'pointer',appearance:'none'}} value={form.priority} onChange={e=>set('priority',e.target.value)}>
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option>
            </select>
          </div>
          <div style={f14}><label style={lbl}>Due Date</label><input type="datetime-local" style={inp} value={form.due_date} onChange={e=>set('due_date',e.target.value)} /></div>
        </div>
        <div style={{marginBottom:20}}>
          <label style={lbl}>Assign To</label>
          <select style={{...inp,cursor:'pointer',appearance:'none'}} value={form.assigned_to} onChange={e=>set('assigned_to',e.target.value)}>
            <option value="">Unassigned</option>
            {profiles.map(p=><option key={p.id} value={p.id}>{p.full_name}</option>)}
          </select>
        </div>
        <ErrMsg e={error} />
        <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}><CancelBtn onClose={onClose} /><SaveBtn saving={saving} label="Create Task" /></div>
      </form>
    </ModalShell>
  )
}

// ── ADD NOTE ──────────────────────────────────────────────────────────────────
export function AddNoteModal({ open, onClose, leadId, clientId, projectId }: { open:boolean; onClose:()=>void; leadId?:string; clientId?:string; projectId?:string }) {
  const [content, setContent] = useState('')
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState('')
  const router = useRouter()

  async function submit(e:React.FormEvent) {
    e.preventDefault(); if (!content.trim()) return
    setSaving(true); setError('')
    try {
      const sb = createClient()
      const { data: { session } } = await sb.auth.getSession()
      if (!session) throw new Error('Not authenticated')
      const { error:err } = await sb.from('notes').insert({
        content: content.trim(),
        author_id:  session.user.id,
        lead_id:    leadId    ?? null,
        client_id:  clientId  ?? null,
        project_id: projectId ?? null,
      })
      if (err) throw new Error(err.message)
      setContent(''); onClose(); router.refresh()
    } catch(err:any) { setError(err.message); setSaving(false) }
  }

  return (
    <ModalShell title="Add Note" open={open} onClose={onClose}>
      <form onSubmit={submit}>
        <div style={{marginBottom:20}}><label style={lbl}>Note *</label><textarea required style={{...inp,resize:'vertical',minHeight:120}} value={content} onChange={e=>setContent(e.target.value)} placeholder="Enter your note..." /></div>
        <ErrMsg e={error} />
        <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}><CancelBtn onClose={onClose} /><SaveBtn saving={saving} label="Add Note" /></div>
      </form>
    </ModalShell>
  )
}

// ── ADD REVENUE ───────────────────────────────────────────────────────────────
export function AddRevenueModal({ open, onClose, clientId }: { open:boolean; onClose:()=>void; clientId?:string }) {
  const [clients,  setClients]  = useState<{id:string;company_name:string}[]>([])
  const [projects, setProjects] = useState<{id:string;name:string}[]>([])
  const [form, setForm] = useState({ client_id: clientId??'', project_id:'', amount:'', description:'', date: new Date().toISOString().split('T')[0], invoice_number:'', paid:'false' })
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')
  const router = useRouter()
  function set(k:string,v:string) { setForm(p=>({...p,[k]:v})) }

  useEffect(() => {
    if (!open) return
    const sb = createClient()
    sb.from('clients').select('id,company_name').then(({data})=>setClients(data??[]))
    if (clientId) sb.from('projects').select('id,name').eq('client_id',clientId).then(({data})=>setProjects(data??[]))
  },[open, clientId])

  useEffect(() => {
    if (!form.client_id) return
    createClient().from('projects').select('id,name').eq('client_id',form.client_id).then(({data})=>setProjects(data??[]))
  },[form.client_id])

  async function submit(e:React.FormEvent) {
    e.preventDefault(); setSaving(true); setError('')
    try {
      const { error:err } = await createClient().from('revenue_records').insert({
        client_id:      form.client_id,
        project_id:     form.project_id || null,
        amount:         parseFloat(form.amount),
        description:    form.description,
        date:           form.date,
        invoice_number: form.invoice_number || null,
        paid:           form.paid === 'true',
      })
      if (err) throw new Error(err.message)
      // Update client lifetime value
      const sb = createClient()
      const { data: allRev } = await sb.from('revenue_records').select('amount').eq('client_id',form.client_id).eq('paid',true)
      const total = (allRev??[]).reduce((s:number,r:any)=>s+(r.amount??0),0)
      await sb.from('clients').update({ lifetime_value: total }).eq('id',form.client_id)
      onClose(); router.refresh()
    } catch(err:any) { setError(err.message); setSaving(false) }
  }

  return (
    <ModalShell title="Add Revenue Record" open={open} onClose={onClose}>
      <form onSubmit={submit}>
        <div style={f14}>
          <label style={lbl}>Client *</label>
          <select required style={{...inp,cursor:'pointer',appearance:'none'}} value={form.client_id} onChange={e=>set('client_id',e.target.value)}>
            <option value="">Select client</option>{clients.map(c=><option key={c.id} value={c.id}>{c.company_name}</option>)}
          </select>
        </div>
        <div style={f14}>
          <label style={lbl}>Project (optional)</label>
          <select style={{...inp,cursor:'pointer',appearance:'none'}} value={form.project_id} onChange={e=>set('project_id',e.target.value)}>
            <option value="">No project</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div style={f14}><label style={lbl}>Description *</label><input required style={inp} value={form.description} onChange={e=>set('description',e.target.value)} placeholder="e.g. CRM Build — Invoice 1 of 3" /></div>
        <div style={row}>
          <div style={f14}><label style={lbl}>Amount (USD) *</label><input required type="number" step="0.01" style={inp} value={form.amount} onChange={e=>set('amount',e.target.value)} placeholder="0.00" /></div>
          <div style={f14}><label style={lbl}>Date *</label><input required type="date" style={inp} value={form.date} onChange={e=>set('date',e.target.value)} /></div>
        </div>
        <div style={row}>
          <div style={f14}><label style={lbl}>Invoice Number</label><input style={inp} value={form.invoice_number} onChange={e=>set('invoice_number',e.target.value)} placeholder="INV-001" /></div>
          <div style={f14}>
            <label style={lbl}>Status</label>
            <select style={{...inp,cursor:'pointer',appearance:'none'}} value={form.paid} onChange={e=>set('paid',e.target.value)}>
              <option value="false">Outstanding</option><option value="true">Paid</option>
            </select>
          </div>
        </div>
        <ErrMsg e={error} />
        <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}><CancelBtn onClose={onClose} /><SaveBtn saving={saving} label="Add Record" /></div>
      </form>
    </ModalShell>
  )
}

// ── NEW PROPOSAL ──────────────────────────────────────────────────────────────
export function NewProposalModal({ open, onClose, leadId, clientId }: { open:boolean; onClose:()=>void; leadId?:string; clientId?:string }) {
  const [form, setForm] = useState({ title:'', lead_id: leadId??'', client_id: clientId??'', services:'', value:'', valid_until:'' })
  const [leads,   setLeads]   = useState<{id:string;first_name:string;last_name:string}[]>([])
  const [clients, setClients] = useState<{id:string;company_name:string}[]>([])
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')
  const router = useRouter()
  function set(k:string,v:string) { setForm(p=>({...p,[k]:v})) }

  useEffect(() => {
    if (!open) return
    const sb = createClient()
    sb.from('leads').select('id,first_name,last_name').order('created_at',{ascending:false}).limit(50).then(({data})=>setLeads(data??[]))
    sb.from('clients').select('id,company_name').order('company_name').then(({data})=>setClients(data??[]))
  },[open])

  async function submit(e:React.FormEvent) {
    e.preventDefault(); setSaving(true); setError('')
    try {
      const { data, error:err } = await createClient().from('proposals').insert({
        title:       form.title,
        lead_id:     form.lead_id   || null,
        client_id:   form.client_id || null,
        services:    form.services ? form.services.split(',').map(s=>s.trim()).filter(Boolean) : [],
        value:       parseFloat(form.value) || 0,
        valid_until: form.valid_until || null,
        status:      'draft',
        scope:'', deliverables:'', timeline:'', terms:'', pricing_breakdown:[],
      }).select().single()
      if (err) throw new Error(err.message)
      onClose(); router.push(`/proposals/${data.id}`); router.refresh()
    } catch(err:any) { setError(err.message); setSaving(false) }
  }

  return (
    <ModalShell title="New Proposal" open={open} onClose={onClose}>
      <form onSubmit={submit}>
        <div style={f14}><label style={lbl}>Proposal Title *</label><input required style={inp} value={form.title} onChange={e=>set('title',e.target.value)} placeholder="e.g. Custom CRM Proposal — Marchetti Properties" /></div>
        <div style={row}>
          <div style={f14}>
            <label style={lbl}>Lead (if not yet a client)</label>
            <select style={{...inp,cursor:'pointer',appearance:'none'}} value={form.lead_id} onChange={e=>set('lead_id',e.target.value)}>
              <option value="">None</option>{leads.map(l=><option key={l.id} value={l.id}>{l.first_name} {l.last_name}</option>)}
            </select>
          </div>
          <div style={f14}>
            <label style={lbl}>Client</label>
            <select style={{...inp,cursor:'pointer',appearance:'none'}} value={form.client_id} onChange={e=>set('client_id',e.target.value)}>
              <option value="">None</option>{clients.map(c=><option key={c.id} value={c.id}>{c.company_name}</option>)}
            </select>
          </div>
        </div>
        <div style={f14}><label style={lbl}>Services (comma separated)</label><input style={inp} value={form.services} onChange={e=>set('services',e.target.value)} placeholder="Custom CRM, Website, Brand" /></div>
        <div style={row}>
          <div style={f14}><label style={lbl}>Total Value (USD)</label><input type="number" step="0.01" style={inp} value={form.value} onChange={e=>set('value',e.target.value)} placeholder="0.00" /></div>
          <div style={f14}><label style={lbl}>Valid Until</label><input type="date" style={inp} value={form.valid_until} onChange={e=>set('valid_until',e.target.value)} /></div>
        </div>
        <div style={{fontSize:'.75rem',color:'#6B7794',marginBottom:20}}>You can fill in the full scope, deliverables, timeline, and pricing on the proposal detail page.</div>
        <ErrMsg e={error} />
        <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}><CancelBtn onClose={onClose} /><SaveBtn saving={saving} label="Create Proposal" /></div>
      </form>
    </ModalShell>
  )
}
