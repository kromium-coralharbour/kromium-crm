'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { fmtDate } from '@/lib/utils'
import Link from 'next/link'

// ── Sequence templates ────────────────────────────────────────────────────────
const SEQUENCES: Record<string, { label: string; steps: { action: string; days: number }[] }> = {
  '30-day-cold': {
    label: '30-Day Cold',
    steps: [
      { action: 'Send intro email with case studies',                       days: 0  },
      { action: 'Follow-up email — ask if they had a chance to review',     days: 7  },
      { action: 'Send relevant industry insight or blog post',              days: 14 },
      { action: 'Personal check-in call or voice note',                    days: 21 },
      { action: 'Final re-engagement email — offer a no-obligation call',   days: 30 },
    ],
  },
  '60-day-cold': {
    label: '60-Day Cold',
    steps: [
      { action: 'Send intro email with case studies',                       days: 0  },
      { action: 'Follow-up email — softer ask',                             days: 10 },
      { action: 'Share relevant industry content',                          days: 21 },
      { action: 'Check-in call attempt',                                    days: 35 },
      { action: 'Email with new case study or result',                      days: 45 },
      { action: 'Final re-engagement — invite to a free strategy call',     days: 60 },
    ],
  },
  'warm-follow-up': {
    label: 'Warm Follow-Up',
    steps: [
      { action: 'Send tailored proposal or deck',                          days: 0  },
      { action: 'Follow-up call — check if they reviewed it',              days: 3  },
      { action: 'Address objections via email',                            days: 7  },
      { action: 'Final call — decision or next step',                      days: 14 },
    ],
  },
  'post-discovery': {
    label: 'Post-Discovery No-Decision',
    steps: [
      { action: 'Send meeting summary and next steps email',               days: 0  },
      { action: 'Check-in — any questions on the proposal?',               days: 5  },
      { action: 'Share a relevant case study',                             days: 14 },
      { action: 'Personal follow-up call',                                 days: 21 },
      { action: 'Re-engage or archive',                                    days: 30 },
    ],
  },
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const inp: React.CSSProperties = { width:'100%', background:'#192035', border:'1px solid rgba(255,255,255,0.1)', color:'#EEF0F5', fontFamily:'Inter,sans-serif', fontSize:'.85rem', padding:'9px 12px', outline:'none' }
const sel: React.CSSProperties = { ...inp, cursor:'pointer', appearance:'none' } as React.CSSProperties
const lbl: React.CSSProperties = { display:'block', fontSize:'.68rem', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'#9AA0B8', marginBottom:6 }
const mb14: React.CSSProperties = { marginBottom:14 }

// ── Modal shell ───────────────────────────────────────────────────────────────
function Modal({ title, open, onClose, children }: { title:string; open:boolean; onClose:()=>void; children:React.ReactNode }) {
  if (!open) return null
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.65)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background:'#141929', border:'1px solid rgba(255,255,255,0.1)', width:'100%', maxWidth:560, maxHeight:'92vh', overflowY:'auto' }}>
        <div style={{ padding:'16px 22px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, background:'#141929', zIndex:1 }}>
          <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'.98rem', fontWeight:700, color:'#fff' }}>{title}</div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#9AA0B8', cursor:'pointer', fontSize:18 }}>x</button>
        </div>
        <div style={{ padding:'18px 22px' }}>{children}</div>
      </div>
    </div>
  )
}

function OrangeBtn({ children, onClick, disabled }: { children:React.ReactNode; onClick?:()=>void; disabled?:boolean }) {
  return <button onClick={onClick} disabled={disabled} style={{ padding:'8px 20px', background:disabled?'#333':'#F26419', color:'#fff', border:'none', fontFamily:'Outfit,sans-serif', fontSize:'.8rem', fontWeight:700, letterSpacing:'.04em', textTransform:'uppercase', cursor:disabled?'not-allowed':'pointer', clipPath:'polygon(7px 0%,100% 0%,calc(100% - 7px) 100%,0% 100%)' }}>{children}</button>
}
function GhostBtn({ children, onClick }: { children:React.ReactNode; onClick?:()=>void }) {
  return <button onClick={onClick} style={{ padding:'8px 14px', background:'transparent', border:'1px solid rgba(255,255,255,0.12)', color:'#9AA0B8', cursor:'pointer', fontFamily:'Inter,sans-serif', fontSize:'.8rem' }}>{children}</button>
}

// ── Add to Sequence Modal ─────────────────────────────────────────────────────
function AddToSequenceModal({ open, onClose, onAdded }: { open:boolean; onClose:()=>void; onAdded:()=>void }) {
  const [leads, setLeads] = useState<any[]>([])
  const [leadId, setLeadId] = useState('')
  const [seqType, setSeqType] = useState('30-day-cold')
  const [touchpoint, setTouchpoint] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  useEffect(() => {
    if (!open) return
    supabase.from('leads').select('id,first_name,last_name,email,lead_tier,lead_score').in('lead_tier', ['cold','warm','unqualified']).in('status', ['new','contacted','nurturing']).order('created_at', { ascending:false }).limit(100).then(({ data }) => setLeads(data ?? []))
    setLeadId(''); setSeqType('30-day-cold'); setTouchpoint(''); setError('')
  }, [open])

  useEffect(() => {
    const seq = SEQUENCES[seqType]
    if (seq) setTouchpoint(seq.steps[0].action)
  }, [seqType])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!leadId) { setError('Please select a lead'); return }
    setSaving(true); setError('')
    try {
      const seq = SEQUENCES[seqType]
      const step2 = seq?.steps[1]
      await supabase.from('nurture_entries').insert({
        lead_id: leadId, sequence_type: seqType,
        touchpoint: touchpoint || seq?.steps[0].action,
        sent_at: new Date().toISOString(),
        next_action: step2?.action ?? null,
        next_due: step2 ? new Date(Date.now() + step2.days * 86400000).toISOString() : null,
      })
      await supabase.from('leads').update({ status: 'nurturing' }).eq('id', leadId)
      onAdded(); onClose()
    } catch(err: any) { setError(err.message); setSaving(false) }
  }

  const seq = SEQUENCES[seqType]
  return (
    <Modal title="Add Lead to Nurture Sequence" open={open} onClose={onClose}>
      <form onSubmit={submit}>
        <div style={mb14}><label style={lbl}>Lead *</label>
          <select style={sel} value={leadId} onChange={e => setLeadId(e.target.value)} required>
            <option value="">Select a lead</option>
            {leads.map(l => <option key={l.id} value={l.id}>{l.first_name} {l.last_name} — {l.lead_tier?.toUpperCase()} ({l.lead_score}) — {l.email}</option>)}
          </select>
        </div>
        <div style={mb14}><label style={lbl}>Sequence Type *</label>
          <select style={sel} value={seqType} onChange={e => setSeqType(e.target.value)}>
            {Object.entries(SEQUENCES).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
          </select>
        </div>
        {seq && (
          <div style={{ background:'#0F1422', border:'1px solid rgba(255,255,255,0.07)', padding:'12px 14px', marginBottom:14 }}>
            <div style={{ fontSize:'.65rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#F26419', marginBottom:8 }}>{seq.label} — {seq.steps.length} Steps</div>
            {seq.steps.map((step, i) => (
              <div key={i} style={{ display:'flex', gap:10, marginBottom:5 }}>
                <span style={{ fontSize:'.68rem', color:'#6B7794', minWidth:52 }}>{step.days === 0 ? 'Day 0' : `Day ${step.days}`}</span>
                <span style={{ fontSize:'.78rem', color: i === 0 ? '#EEF0F5' : '#9AA0B8' }}>{step.action}</span>
              </div>
            ))}
          </div>
        )}
        <div style={mb14}><label style={lbl}>First Touchpoint</label>
          <input style={inp} value={touchpoint} onChange={e => setTouchpoint(e.target.value)} />
        </div>
        {error && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'#EF4444', padding:'10px 14px', fontSize:'.82rem', marginBottom:14 }}>{error}</div>}
        <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
          <GhostBtn onClick={onClose}>Cancel</GhostBtn>
          <OrangeBtn disabled={saving}>{saving ? 'Adding...' : 'Add to Sequence'}</OrangeBtn>
        </div>
      </form>
    </Modal>
  )
}

// ── Advance Modal ─────────────────────────────────────────────────────────────
function AdvanceModal({ entry, open, onClose, onAdvanced }: { entry:any; open:boolean; onClose:()=>void; onAdvanced:()=>void }) {
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const supabase = createClient()
  useEffect(() => { if (open) setNotes('') }, [open])
  if (!entry) return null

  const seq = SEQUENCES[entry.sequence_type]
  const steps = seq?.steps ?? []
  const currentIdx = entry.next_action ? steps.findIndex(s => s.action === entry.next_action) - 1 : steps.length - 1
  const nextStepIdx = currentIdx + 2
  const nextStep = steps[nextStepIdx] ?? null
  const isLastStep = !nextStep

  async function advance() {
    setSaving(true)
    await supabase.from('nurture_entries').update({
      touchpoint: entry.next_action ?? entry.touchpoint,
      sent_at: new Date().toISOString(),
      next_action: nextStep?.action ?? null,
      next_due: nextStep ? new Date(Date.now() + nextStep.days * 86400000).toISOString() : null,
    }).eq('id', entry.id)
    if (notes.trim()) {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) await supabase.from('notes').insert({ lead_id: entry.lead_id, author_id: session.user.id, content: `[Nurture] ${entry.next_action} — ${notes.trim()}` })
    }
    onAdvanced(); onClose(); setSaving(false)
  }

  return (
    <Modal title="Log Touchpoint and Advance" open={open} onClose={onClose}>
      <div style={{ marginBottom:14 }}>
        <div style={{ fontSize:'.68rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#6B7794', marginBottom:6 }}>Completing</div>
        <div style={{ background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.2)', padding:'11px 14px' }}>
          <div style={{ fontSize:'.85rem', fontWeight:600, color:'#22C55E' }}>{entry.next_action ?? entry.touchpoint}</div>
          <div style={{ fontSize:'.72rem', color:'#6B7794', marginTop:2 }}>{entry.leads?.first_name} {entry.leads?.last_name}</div>
        </div>
      </div>
      <div style={mb14}><label style={lbl}>Notes (optional — saved to lead record)</label>
        <textarea style={{ ...inp, resize:'vertical', minHeight:72 }} value={notes} onChange={e => setNotes(e.target.value)} placeholder="What happened on this touchpoint?" />
      </div>
      {!isLastStep && nextStep && (
        <div style={{ background:'#0F1422', border:'1px solid rgba(255,255,255,0.07)', padding:'11px 14px', marginBottom:14 }}>
          <div style={{ fontSize:'.65rem', color:'#6B7794', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:4 }}>Next Step</div>
          <div style={{ fontSize:'.85rem', color:'#EEF0F5' }}>{nextStep.action}</div>
        </div>
      )}
      {isLastStep && <div style={{ background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.25)', padding:'11px 14px', marginBottom:14, fontSize:'.82rem', color:'#F59E0B' }}>This is the final step. Consider re-engaging the lead or archiving after this.</div>}
      <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
        <GhostBtn onClick={onClose}>Cancel</GhostBtn>
        <OrangeBtn onClick={advance} disabled={saving}>{saving ? 'Saving...' : isLastStep ? 'Complete Sequence' : 'Mark Done and Advance'}</OrangeBtn>
      </div>
    </Modal>
  )
}

// ── Re-Engage Modal ───────────────────────────────────────────────────────────
function ReEngageModal({ entry, open, onClose, onReEngaged }: { entry:any; open:boolean; onClose:()=>void; onReEngaged:()=>void }) {
  const [saving, setSaving] = useState(false)
  const supabase = createClient()
  if (!entry) return null
  async function reEngage() {
    setSaving(true)
    await supabase.from('leads').update({ lead_tier: 'warm', status: 'contacted' }).eq('id', entry.lead_id)
    await supabase.from('nurture_entries').delete().eq('id', entry.id)
    const { data: { session } } = await supabase.auth.getSession()
    await supabase.from('tasks').insert({ title: `Re-engaged: ${entry.leads?.first_name} ${entry.leads?.last_name} — schedule discovery call`, description: 'Lead re-engaged from nurture. Move to pipeline.', priority: 'high', status: 'open', lead_id: entry.lead_id, due_date: new Date(Date.now() + 86400000).toISOString(), auto_generated: true })
    if (session) await supabase.from('notes').insert({ lead_id: entry.lead_id, author_id: session.user.id, content: `Lead re-engaged from ${entry.sequence_type} nurture sequence. Moved to WARM and added to pipeline.` })
    onReEngaged(); onClose(); setSaving(false)
  }
  return (
    <Modal title="Re-Engage Lead" open={open} onClose={onClose}>
      <div style={{ marginBottom:18 }}>
        <div style={{ fontSize:'.88rem', color:'#EEF0F5', marginBottom:12 }}>Re-engage <strong style={{ color:'#F26419' }}>{entry.leads?.first_name} {entry.leads?.last_name}</strong> and move to active pipeline?</div>
        {['Upgrade lead tier to WARM', 'Set status to Contacted', 'Remove from nurture sequence', 'Create a follow-up task due tomorrow', 'Log a note on the lead record'].map(item => (
          <div key={item} style={{ display:'flex', gap:8, alignItems:'center', fontSize:'.82rem', color:'#9AA0B8', marginBottom:5 }}>
            <span style={{ color:'#22C55E', fontWeight:700, flexShrink:0 }}>+</span> {item}
          </div>
        ))}
      </div>
      <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
        <GhostBtn onClick={onClose}>Cancel</GhostBtn>
        <button onClick={reEngage} disabled={saving} style={{ padding:'8px 20px', background:saving?'#333':'#22C55E', color:'#fff', border:'none', fontFamily:'Outfit,sans-serif', fontSize:'.8rem', fontWeight:700, cursor:saving?'not-allowed':'pointer', clipPath:'polygon(7px 0%,100% 0%,calc(100% - 7px) 100%,0% 100%)' }}>{saving ? 'Processing...' : 'Re-Engage Lead'}</button>
      </div>
    </Modal>
  )
}

// ── Archive Modal ─────────────────────────────────────────────────────────────
function RemoveModal({ entry, open, onClose, onRemoved }: { entry:any; open:boolean; onClose:()=>void; onRemoved:()=>void }) {
  const [saving, setSaving] = useState(false)
  const supabase = createClient()
  if (!entry) return null
  async function remove() {
    setSaving(true)
    await supabase.from('nurture_entries').delete().eq('id', entry.id)
    await supabase.from('leads').update({ status: 'lost' }).eq('id', entry.lead_id)
    onRemoved(); onClose(); setSaving(false)
  }
  return (
    <Modal title="Archive Lead" open={open} onClose={onClose}>
      <div style={{ fontSize:'.88rem', color:'#9AA0B8', lineHeight:1.7, marginBottom:20 }}>
        Remove <strong style={{ color:'#EEF0F5' }}>{entry.leads?.first_name} {entry.leads?.last_name}</strong> from the sequence and mark as lost? Use this for leads who have gone fully cold after the complete sequence.
      </div>
      <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
        <GhostBtn onClick={onClose}>Cancel</GhostBtn>
        <button onClick={remove} disabled={saving} style={{ padding:'8px 20px', background:saving?'#333':'#EF4444', color:'#fff', border:'none', fontFamily:'Outfit,sans-serif', fontSize:'.8rem', fontWeight:700, cursor:saving?'not-allowed':'pointer', clipPath:'polygon(7px 0%,100% 0%,calc(100% - 7px) 100%,0% 100%)' }}>{saving ? 'Archiving...' : 'Archive Lead'}</button>
      </div>
    </Modal>
  )
}

// ── Generate Proposal from nurture ───────────────────────────────────────────
function NurtureProposalModal({ entry, open, onClose }: { entry:any; open:boolean; onClose:()=>void }) {
  const router = useRouter()
  const supabase = createClient()
  const lead = entry?.leads ?? {}
  const [title, setTitle] = useState('')
  const [value, setValue] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open && entry) setTitle(`${lead.company ?? (lead.first_name + ' ' + lead.last_name)} — Digital Engagement Proposal`)
  }, [open, entry])

  if (!entry) return null

  async function create() {
    setSaving(true)
    const { data } = await supabase.from('proposals').insert({
      lead_id: entry.lead_id, title, status: 'draft', value: Number(value) || 0,
      services: [], scope: `Lead sourced via ${entry.sequence_type} nurture sequence. Re-engaged after sustained interest.`, deliverables: '', timeline: '', pricing_breakdown: [],
      terms: 'Payment terms: 35% deposit on signing, 35% on milestone, 30% on completion.',
    }).select().single()
    if (data) { onClose(); router.push(`/proposals/${data.id}`); router.refresh() }
    setSaving(false)
  }

  return (
    <Modal title="Create Proposal from Nurture" open={open} onClose={onClose}>
      <div style={{ background:'#0F1422', border:'1px solid rgba(255,255,255,0.07)', padding:'12px 14px', marginBottom:16 }}>
        <div style={{ fontSize:'.65rem', color:'#6B7794', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:6 }}>Lead</div>
        <div style={{ fontSize:'.88rem', fontWeight:600, color:'#EEF0F5' }}>{lead.first_name} {lead.last_name}</div>
        <div style={{ fontSize:'.75rem', color:'#6B7794', marginTop:2 }}>{lead.email} &middot; Sequence: {SEQUENCES[entry.sequence_type]?.label ?? entry.sequence_type}</div>
      </div>
      <div style={mb14}><label style={lbl}>Proposal Title</label><input style={inp} value={title} onChange={e => setTitle(e.target.value)} /></div>
      <div style={mb14}><label style={lbl}>Estimated Value (USD)</label><input style={inp} type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="0" /></div>
      <p style={{ fontSize:'.75rem', color:'#6B7794', marginBottom:16, lineHeight:1.6 }}>A draft proposal will be created and opened in the proposal editor where you can fill in full scope, deliverables, and pricing.</p>
      <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
        <GhostBtn onClick={onClose}>Cancel</GhostBtn>
        <OrangeBtn onClick={create} disabled={saving}>{saving ? 'Creating...' : 'Create Draft Proposal'}</OrangeBtn>
      </div>
    </Modal>
  )
}

// ── Expandable Row ────────────────────────────────────────────────────────────
function NurtureRow({ entry, onAdvance, onReEngage, onRemove, onProposal }: {
  entry: any
  onAdvance: (e: any) => void
  onReEngage: (e: any) => void
  onRemove: (e: any) => void
  onProposal: (e: any) => void
}) {
  const [expanded, setExpanded] = useState(false)

  const now      = new Date()
  const todayEnd = new Date(now); todayEnd.setHours(23,59,59,999)
  const seq      = SEQUENCES[entry.sequence_type]
  const steps    = seq?.steps ?? []
  const stepIdx  = entry.next_action ? steps.findIndex(s => s.action === entry.next_action) : steps.length
  const progress = steps.length > 0 ? Math.round((Math.max(0, stepIdx) / steps.length) * 100) : 0
  const isOverdue = entry.next_due && new Date(entry.next_due) < now
  const isToday   = entry.next_due && new Date(entry.next_due) >= now && new Date(entry.next_due) <= todayEnd
  const dueColor  = isOverdue ? '#EF4444' : isToday ? '#F59E0B' : '#9AA0B8'
  const seqLabel  = seq?.label ?? entry.sequence_type

  return (
    <>
      {/* Main row */}
      <tr onClick={() => setExpanded(p => !p)} style={{ cursor:'pointer', borderBottom: expanded ? 'none' : '1px solid rgba(255,255,255,0.04)' }} className="hover:bg-white/[0.02]">
        <td style={{ padding:'12px 16px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:'.65rem', color:'#6B7794', transition:'transform .15s', display:'inline-block', transform: expanded ? 'rotate(90deg)' : 'rotate(0)' }}>&#9654;</span>
            <div>
              <Link href={`/enquiries/${entry.lead_id}`} onClick={e => e.stopPropagation()} style={{ textDecoration:'none' }}>
                <div style={{ fontWeight:600, color:'#EEF0F5', fontSize:'.83rem' }}>{entry.leads?.first_name} {entry.leads?.last_name}</div>
                <div style={{ fontSize:'.7rem', color:'#6B7794', marginTop:1 }}>{entry.leads?.email}</div>
              </Link>
              <div style={{ fontSize:'.65rem', marginTop:3, display:'flex', gap:5 }}>
                <span style={{ padding:'1px 6px', background:'rgba(107,119,148,0.15)', color:'#9AA0B8', textTransform:'uppercase', fontWeight:700, letterSpacing:'.05em' }}>{entry.leads?.lead_tier}</span>
                <span style={{ color:'#6B7794' }}>Score {entry.leads?.lead_score}</span>
              </div>
            </div>
          </div>
        </td>
        <td style={{ padding:'12px 16px' }}>
          <div style={{ fontSize:'.8rem', fontWeight:600, color:'#EEF0F5' }}>{seqLabel}</div>
          <div style={{ fontSize:'.7rem', color:'#6B7794', marginTop:2 }}>
            {entry.touchpoint ? `Last: ${entry.touchpoint.slice(0,44)}${entry.touchpoint.length > 44 ? '...' : ''}` : '—'}
          </div>
        </td>
        <td style={{ padding:'12px 16px', whiteSpace:'nowrap' }}>
          <div style={{ fontSize:'.82rem', fontWeight: isOverdue ? 700 : 400, color: dueColor }}>
            {isOverdue ? '! ' : ''}{entry.next_due ? fmtDate(entry.next_due) : '—'}
          </div>
          {isToday   && <div style={{ fontSize:'.68rem', color:'#F59E0B', marginTop:1 }}>Due today</div>}
          {isOverdue && <div style={{ fontSize:'.68rem', color:'#EF4444', marginTop:1 }}>Overdue</div>}
        </td>
        <td style={{ padding:'12px 16px', maxWidth:200 }}>
          <div style={{ fontSize:'.82rem', color: entry.next_action ? '#EEF0F5' : '#6B7794', lineHeight:1.5 }}>
            {entry.next_action ?? <em style={{ fontStyle:'italic' }}>Sequence complete</em>}
          </div>
        </td>
        <td style={{ padding:'12px 16px', minWidth:100 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ flex:1, height:4, background:'rgba(255,255,255,0.08)', borderRadius:2 }}>
              <div style={{ height:4, borderRadius:2, background:'#F26419', width:`${progress}%` }} />
            </div>
            <span style={{ fontSize:'.7rem', color:'#6B7794', minWidth:28 }}>{progress}%</span>
          </div>
          <div style={{ fontSize:'.68rem', color:'#6B7794', marginTop:3 }}>Step {Math.max(1,stepIdx)} of {steps.length}</div>
        </td>
        <td style={{ padding:'12px 16px' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
            {entry.next_action && <button onClick={e => { e.stopPropagation(); onAdvance(entry) }} style={{ padding:'4px 9px', background:'rgba(242,100,25,0.1)', border:'1px solid rgba(242,100,25,0.3)', color:'#F26419', cursor:'pointer', fontSize:'.68rem', fontWeight:700 }}>Mark Done</button>}
            <button onClick={e => { e.stopPropagation(); onReEngage(entry) }} style={{ padding:'4px 9px', background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.3)', color:'#22C55E', cursor:'pointer', fontSize:'.68rem', fontWeight:700 }}>Re-Engage</button>
            <button onClick={e => { e.stopPropagation(); onRemove(entry) }} style={{ padding:'4px 9px', background:'rgba(107,119,148,0.08)', border:'1px solid rgba(107,119,148,0.2)', color:'#6B7794', cursor:'pointer', fontSize:'.68rem', fontWeight:700 }}>Archive</button>
          </div>
        </td>
      </tr>

      {/* Expanded panel */}
      {expanded && (
        <tr>
          <td colSpan={6} style={{ padding:0, borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ background:'#0B0E1A', borderTop:'1px solid rgba(242,100,25,0.15)', padding:'20px 24px 20px 56px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>

                {/* Sequence steps */}
                <div>
                  <div style={{ fontSize:'.68rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#F26419', marginBottom:12 }}>
                    {seqLabel} — Full Sequence
                  </div>
                  {steps.map((step, i) => {
                    const isCurrent  = step.action === entry.next_action
                    const isComplete = i < stepIdx
                    return (
                      <div key={i} style={{ display:'flex', gap:12, marginBottom:8, alignItems:'flex-start' }}>
                        <div style={{ width:18, height:18, borderRadius:'50%', flexShrink:0, border:`1.5px solid ${isComplete ? '#22C55E' : isCurrent ? '#F26419' : 'rgba(255,255,255,0.1)'}`, background: isComplete ? '#22C55E' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', marginTop:1 }}>
                          {isComplete && <span style={{ fontSize:8, fontWeight:800, color:'#fff' }}>OK</span>}
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:'.8rem', color: isComplete ? '#6B7794' : isCurrent ? '#EEF0F5' : '#9AA0B8', textDecoration: isComplete ? 'line-through' : 'none', fontWeight: isCurrent ? 600 : 400 }}>
                            {step.action}
                            {isCurrent && <span style={{ marginLeft:8, fontSize:'.65rem', fontWeight:700, letterSpacing:'.06em', textTransform:'uppercase', color:'#F26419', padding:'1px 6px', background:'rgba(242,100,25,0.12)' }}>NEXT</span>}
                          </div>
                          <div style={{ fontSize:'.68rem', color:'#6B7794', marginTop:1 }}>Day {step.days}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Quick actions */}
                <div>
                  <div style={{ fontSize:'.68rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#6B7794', marginBottom:12 }}>Quick Actions</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {entry.next_action && (
                      <button onClick={() => onAdvance(entry)} style={{ padding:'10px 14px', background:'rgba(242,100,25,0.1)', border:'1px solid rgba(242,100,25,0.3)', color:'#F26419', cursor:'pointer', fontSize:'.8rem', fontWeight:700, textAlign:'left', width:'100%' }}>
                        Mark current step done and advance
                      </button>
                    )}
                    <button onClick={() => onReEngage(entry)} style={{ padding:'10px 14px', background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.3)', color:'#22C55E', cursor:'pointer', fontSize:'.8rem', fontWeight:700, textAlign:'left', width:'100%' }}>
                      Re-engage — move to pipeline as WARM
                    </button>
                    <button onClick={() => onProposal(entry)} style={{ padding:'10px 14px', background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.3)', color:'#3B82F6', cursor:'pointer', fontSize:'.8rem', fontWeight:700, textAlign:'left', width:'100%' }}>
                      Generate proposal for this lead
                    </button>
                    <Link href={`/enquiries/${entry.lead_id}`} style={{ padding:'10px 14px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', color:'#9AA0B8', cursor:'pointer', fontSize:'.8rem', fontWeight:700, textDecoration:'none', display:'block', width:'100%', boxSizing:'border-box' }}>
                      View full lead record
                    </Link>
                    <button onClick={() => onRemove(entry)} style={{ padding:'10px 14px', background:'transparent', border:'1px solid rgba(239,68,68,0.2)', color:'#6B7794', cursor:'pointer', fontSize:'.8rem', fontWeight:700, textAlign:'left', width:'100%' }}>
                      Archive — sequence complete, no response
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
interface Props { entries: any[] }

export default function NurtureClient({ entries: initialEntries }: Props) {
  const [entries,    setEntries]    = useState(initialEntries)
  const [showAdd,    setShowAdd]    = useState(false)
  const [advancing,  setAdvancing]  = useState<any>(null)
  const [reEngaging, setReEngaging] = useState<any>(null)
  const [removing,   setRemoving]   = useState<any>(null)
  const [proposing,  setProposing]  = useState<any>(null)
  const [filter,     setFilter]     = useState<string>('all')
  const [seqFilter,  setSeqFilter]  = useState<string>('')
  const supabase = createClient()

  async function refresh() {
    const { data } = await supabase
      .from('nurture_entries')
      .select('*,leads(id,first_name,last_name,email,lead_score,lead_tier,country,form_type,company)')
      .order('next_due', { ascending: true, nullsFirst: false })
    setEntries(data ?? [])
  }

  const now      = new Date()
  const todayEnd = new Date(now); todayEnd.setHours(23,59,59,999)

  const overdueCt = entries.filter(e => e.next_due && new Date(e.next_due) < now).length
  const todayCt   = entries.filter(e => { if (!e.next_due) return false; const d = new Date(e.next_due); return d >= now && d <= todayEnd }).length

  const filtered = entries.filter(e => {
    const matchesSeq = !seqFilter || e.sequence_type === seqFilter
    if (!matchesSeq) return false
    if (filter === 'overdue')   return e.next_due && new Date(e.next_due) < now
    if (filter === 'due-today') return e.next_due && new Date(e.next_due) >= now && new Date(e.next_due) <= todayEnd
    if (filter === 'upcoming')  return !e.next_due || new Date(e.next_due) > todayEnd
    return true
  })

  const chip = (key: string, label: string, count?: number) => (
    <button key={key} onClick={() => setFilter(key)} style={{ padding:'5px 12px', fontSize:'.72rem', fontWeight:600, cursor:'pointer', background: filter === key ? 'rgba(242,100,25,0.1)' : '#141929', border: filter === key ? '1px solid #F26419' : '1px solid rgba(255,255,255,0.07)', color: filter === key ? '#F26419' : '#9AA0B8' }}>
      {label}{count !== undefined && count > 0 ? ` (${count})` : ''}
    </button>
  )

  return (
    <>
      <AddToSequenceModal open={showAdd}       onClose={() => setShowAdd(false)}    onAdded={refresh} />
      <AdvanceModal  entry={advancing}  open={!!advancing}  onClose={() => setAdvancing(null)}  onAdvanced={refresh} />
      <ReEngageModal entry={reEngaging} open={!!reEngaging} onClose={() => setReEngaging(null)} onReEngaged={refresh} />
      <RemoveModal   entry={removing}   open={!!removing}   onClose={() => setRemoving(null)}   onRemoved={refresh} />
      <NurtureProposalModal entry={proposing} open={!!proposing} onClose={() => setProposing(null)} />

      {/* Header */}
      <div style={{ height:52, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', borderBottom:'1px solid rgba(255,255,255,0.07)', background:'#0B0E1A' }}>
        <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'1.05rem', fontWeight:700, color:'#fff' }}>Nurture Sequences</div>
        <button onClick={() => setShowAdd(true)} style={{ padding:'7px 16px', background:'#F26419', color:'#fff', border:'none', fontFamily:'Outfit,sans-serif', fontSize:'.8rem', fontWeight:700, letterSpacing:'.04em', textTransform:'uppercase', cursor:'pointer', clipPath:'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)' }}>
          + Add to Sequence
        </button>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:24 }}>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
          {[
            { label:'In Sequences', value: entries.length,                accent:'#F26419' },
            { label:'Overdue',      value: overdueCt,                     accent:'#EF4444' },
            { label:'Due Today',    value: todayCt,                       accent:'#F59E0B' },
            { label:'Templates',    value: Object.keys(SEQUENCES).length, accent:'#3B82F6' },
          ].map(s => (
            <div key={s.label} style={{ background:'#141929', border:'1px solid rgba(255,255,255,0.07)', padding:'16px 18px', position:'relative' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:s.accent }} />
              <div style={{ fontSize:'.65rem', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'#6B7794', marginBottom:6 }}>{s.label}</div>
              <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'1.8rem', fontWeight:800, color:'#fff', lineHeight:1 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Status filters */}
        <div style={{ display:'flex', gap:8, marginBottom:10, flexWrap:'wrap' }}>
          {chip('all',       `All (${entries.length})`)}
          {chip('overdue',   'Overdue', overdueCt)}
          {chip('due-today', 'Due Today', todayCt)}
          {chip('upcoming',  'Upcoming')}
        </div>

        {/* Sequence type filters */}
        <div style={{ display:'flex', gap:6, marginBottom:16, flexWrap:'wrap', alignItems:'center' }}>
          <span style={{ fontSize:'.65rem', color:'#6B7794', textTransform:'uppercase', letterSpacing:'.1em', fontWeight:700, marginRight:2 }}>Sequence:</span>
          <button onClick={() => setSeqFilter('')} style={{ padding:'4px 10px', fontSize:'.68rem', fontWeight:600, cursor:'pointer', background: seqFilter === '' ? 'rgba(242,100,25,0.1)' : 'transparent', border: seqFilter === '' ? '1px solid #F26419' : '1px solid rgba(255,255,255,0.07)', color: seqFilter === '' ? '#F26419' : '#9AA0B8' }}>All</button>
          {Object.entries(SEQUENCES).map(([key, seq]) => {
            const count = entries.filter(e => e.sequence_type === key).length
            return (
              <button key={key} onClick={() => setSeqFilter(seqFilter === key ? '' : key)} style={{ padding:'4px 10px', fontSize:'.68rem', fontWeight:600, cursor:'pointer', background: seqFilter === key ? 'rgba(242,100,25,0.1)' : 'transparent', border: seqFilter === key ? '1px solid #F26419' : '1px solid rgba(255,255,255,0.07)', color: seqFilter === key ? '#F26419' : '#9AA0B8' }}>
                {seq.label} {count > 0 ? `(${count})` : ''}
              </button>
            )
          })}
        </div>

        {/* Table */}
        <div style={{ background:'#141929', border:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr>
                  {['Lead','Sequence','Due','Next Action','Progress','Actions'].map(h => (
                    <th key={h} style={{ fontSize:'.65rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#6B7794', padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', textAlign:'left', background:'#141929', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={6} style={{ padding:48, textAlign:'center', color:'#6B7794' }}>
                    {entries.length === 0 ? 'No leads in nurture sequences. Click "+ Add to Sequence" to enrol a cold or warm lead.' : 'No entries match this filter.'}
                  </td></tr>
                )}
                {filtered.map(e => (
                  <NurtureRow key={e.id} entry={e} onAdvance={setAdvancing} onReEngage={setReEngaging} onRemove={setRemoving} onProposal={setProposing} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sequence reference */}
        <div style={{ marginTop:24 }}>
          <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'.88rem', fontWeight:700, color:'#fff', marginBottom:12 }}>Sequence Templates</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12 }}>
            {Object.entries(SEQUENCES).map(([key, seq]) => (
              <div key={key} style={{ background:'#141929', border: seqFilter === key ? '1px solid rgba(242,100,25,0.4)' : '1px solid rgba(255,255,255,0.07)', padding:'14px 16px', cursor:'pointer' }} onClick={() => setSeqFilter(seqFilter === key ? '' : key)}>
                <div style={{ fontSize:'.78rem', fontWeight:700, color:'#F26419', marginBottom:8, display:'flex', justifyContent:'space-between' }}>
                  {seq.label}
                  <span style={{ fontSize:'.65rem', color:'#6B7794' }}>{entries.filter(e => e.sequence_type === key).length} active</span>
                </div>
                {seq.steps.map((step, i) => (
                  <div key={i} style={{ display:'flex', gap:10, marginBottom:4 }}>
                    <span style={{ fontSize:'.65rem', color:'#6B7794', minWidth:40 }}>Day {step.days}</span>
                    <span style={{ fontSize:'.75rem', color:'#9AA0B8' }}>{step.action}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
