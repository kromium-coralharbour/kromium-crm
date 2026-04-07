'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { fmtDate, fmtRelative } from '@/lib/utils'
import Link from 'next/link'

// ── Sequence templates ────────────────────────────────────────────────────────
const SEQUENCES: Record<string, { label: string; steps: { action: string; days: number }[] }> = {
  '30-day-cold': {
    label: '30-Day Cold',
    steps: [
      { action: 'Send intro email with case studies',          days: 0  },
      { action: 'Follow-up email — ask if they had a chance to review', days: 7  },
      { action: 'Send relevant industry insight or blog post', days: 14 },
      { action: 'Personal check-in call or voice note',        days: 21 },
      { action: 'Final re-engagement email — offer a no-obligation call', days: 30 },
    ],
  },
  '60-day-cold': {
    label: '60-Day Cold',
    steps: [
      { action: 'Send intro email with case studies',          days: 0  },
      { action: 'Follow-up email — softer ask',                days: 10 },
      { action: 'Share relevant industry content',             days: 21 },
      { action: 'Check-in call attempt',                       days: 35 },
      { action: 'Email with new case study or result',         days: 45 },
      { action: 'Final re-engagement — invite to a free strategy call', days: 60 },
    ],
  },
  'warm-follow-up': {
    label: 'Warm Follow-Up',
    steps: [
      { action: 'Send tailored proposal or deck',              days: 0  },
      { action: 'Follow-up call — check if they reviewed it',  days: 3  },
      { action: 'Address objections via email',                days: 7  },
      { action: 'Final call — decision or next step',          days: 14 },
    ],
  },
  'post-discovery': {
    label: 'Post-Discovery No-Decision',
    steps: [
      { action: 'Send meeting summary and next steps email',   days: 0  },
      { action: 'Check-in — any questions on the proposal?',   days: 5  },
      { action: 'Share a relevant case study',                 days: 14 },
      { action: 'Personal follow-up call',                     days: 21 },
      { action: 'Re-engage or archive',                        days: 30 },
    ],
  },
}

// ── Style helpers ─────────────────────────────────────────────────────────────
const inp: React.CSSProperties = { width:'100%', background:'#192035', border:'1px solid rgba(255,255,255,0.1)', color:'#EEF0F5', fontFamily:'Inter,sans-serif', fontSize:'.85rem', padding:'9px 12px', outline:'none' }
const sel: React.CSSProperties = { ...inp, cursor:'pointer', appearance:'none' } as React.CSSProperties
const lbl: React.CSSProperties = { display:'block', fontSize:'.68rem', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'#9AA0B8', marginBottom:6 }
const mb14: React.CSSProperties = { marginBottom:14 }

function Modal({ title, open, onClose, children }: { title:string; open:boolean; onClose:()=>void; children:React.ReactNode }) {
  if (!open) return null
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.65)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background:'#141929', border:'1px solid rgba(255,255,255,0.1)', width:'100%', maxWidth:540, maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ padding:'18px 24px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, background:'#141929', zIndex:1 }}>
          <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'1rem', fontWeight:700, color:'#fff' }}>{title}</div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#9AA0B8', cursor:'pointer', fontSize:20 }}>✕</button>
        </div>
        <div style={{ padding:'20px 24px' }}>{children}</div>
      </div>
    </div>
  )
}

function PrimaryBtn({ children, onClick, disabled, type = 'button' }: { children:React.ReactNode; onClick?:()=>void; disabled?:boolean; type?:'button'|'submit' }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{ padding:'9px 24px', background:disabled?'#333':'#F26419', color:'#fff', border:'none', fontFamily:'Outfit,sans-serif', fontSize:'.85rem', fontWeight:700, letterSpacing:'.04em', textTransform:'uppercase', cursor:disabled?'not-allowed':'pointer', clipPath:'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)' }}>
      {children}
    </button>
  )
}
function GhostBtn({ children, onClick }: { children:React.ReactNode; onClick?:()=>void }) {
  return (
    <button onClick={onClick} style={{ padding:'9px 16px', background:'transparent', border:'1px solid rgba(255,255,255,0.12)', color:'#9AA0B8', cursor:'pointer', fontFamily:'Inter,sans-serif', fontSize:'.82rem' }}>
      {children}
    </button>
  )
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
    // Fetch cold/warm leads not already in a sequence
    supabase.from('leads')
      .select('id,first_name,last_name,email,lead_tier,lead_score')
      .in('lead_tier', ['cold','warm','unqualified'])
      .in('status', ['new','contacted','nurturing'])
      .order('created_at', { ascending: false })
      .limit(100)
      .then(({ data }) => setLeads(data ?? []))
    setLeadId(''); setSeqType('30-day-cold'); setTouchpoint(''); setError('')
  }, [open])

  // Auto-fill touchpoint with first step of selected sequence
  useEffect(() => {
    const seq = SEQUENCES[seqType]
    if (seq) setTouchpoint(seq.steps[0].action)
  }, [seqType])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!leadId) { setError('Please select a lead'); return }
    setSaving(true); setError('')
    try {
      const seq     = SEQUENCES[seqType]
      const step1   = seq?.steps[0]
      const step2   = seq?.steps[1]
      const nextDue = step2 ? new Date(Date.now() + step2.days * 86400000).toISOString() : null

      const { error: err } = await supabase.from('nurture_entries').insert({
        lead_id:      leadId,
        sequence_type: seqType,
        touchpoint:   touchpoint || step1?.action || 'Initial contact',
        sent_at:      new Date().toISOString(),
        next_action:  step2?.action ?? null,
        next_due:     nextDue,
      })
      if (err) throw new Error(err.message)

      // Update lead status to nurturing
      await supabase.from('leads').update({ status: 'nurturing' }).eq('id', leadId)

      onAdded(); onClose()
    } catch(err: any) { setError(err.message); setSaving(false) }
  }

  const seq = SEQUENCES[seqType]

  return (
    <Modal title="Add Lead to Nurture Sequence" open={open} onClose={onClose}>
      <form onSubmit={submit}>
        <div style={mb14}>
          <label style={lbl}>Lead *</label>
          <select style={sel} value={leadId} onChange={e => setLeadId(e.target.value)} required>
            <option value="">Select a lead</option>
            {leads.map(l => (
              <option key={l.id} value={l.id}>
                {l.first_name} {l.last_name} — {l.lead_tier?.toUpperCase()} ({l.lead_score}) — {l.email}
              </option>
            ))}
          </select>
          {leads.length === 0 && <div style={{ fontSize:'.75rem', color:'#6B7794', marginTop:6 }}>No cold or warm leads available. All may already be in sequences.</div>}
        </div>

        <div style={mb14}>
          <label style={lbl}>Sequence Type *</label>
          <select style={sel} value={seqType} onChange={e => setSeqType(e.target.value)}>
            {Object.entries(SEQUENCES).map(([key, seq]) => (
              <option key={key} value={key}>{seq.label}</option>
            ))}
          </select>
        </div>

        {/* Sequence preview */}
        {seq && (
          <div style={{ background:'#0F1422', border:'1px solid rgba(255,255,255,0.07)', padding:'14px 16px', marginBottom:14 }}>
            <div style={{ fontSize:'.68rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#F26419', marginBottom:10 }}>
              {seq.label} — {seq.steps.length} Steps
            </div>
            {seq.steps.map((step, i) => (
              <div key={i} style={{ display:'flex', gap:10, marginBottom:6, alignItems:'flex-start' }}>
                <div style={{ fontSize:'.68rem', color:'#6B7794', minWidth:52, flexShrink:0, marginTop:1 }}>
                  {step.days === 0 ? 'Day 0' : `Day ${step.days}`}
                </div>
                <div style={{ fontSize:'.78rem', color: i === 0 ? '#EEF0F5' : '#9AA0B8' }}>{step.action}</div>
              </div>
            ))}
          </div>
        )}

        <div style={mb14}>
          <label style={lbl}>First Touchpoint (what you are doing now)</label>
          <input style={inp} value={touchpoint} onChange={e => setTouchpoint(e.target.value)} placeholder="e.g. Sent intro email with CRM case studies" />
        </div>

        {error && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'#EF4444', padding:'10px 14px', fontSize:'.82rem', marginBottom:14 }}>{error}</div>}

        <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
          <GhostBtn onClick={onClose}>Cancel</GhostBtn>
          <PrimaryBtn type="submit" disabled={saving}>{saving ? 'Adding...' : 'Add to Sequence'}</PrimaryBtn>
        </div>
      </form>
    </Modal>
  )
}

// ── Advance Touchpoint Modal ──────────────────────────────────────────────────
function AdvanceModal({ entry, open, onClose, onAdvanced }: { entry:any; open:boolean; onClose:()=>void; onAdvanced:()=>void }) {
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => { if (open) setNotes('') }, [open])

  if (!entry) return null

  // Work out what step we are on and what comes next
  const seq       = SEQUENCES[entry.sequence_type]
  const steps     = seq?.steps ?? []
  // Find current step index by matching next_action to a step action
  const currentIdx = entry.next_action
    ? steps.findIndex(s => s.action === entry.next_action) - 1
    : steps.length - 1
  const nextStepIdx = currentIdx + 2 // the one after next
  const nextStep    = steps[nextStepIdx] ?? null
  const isLastStep  = !nextStep

  async function advance() {
    setSaving(true)
    try {
      const now     = new Date().toISOString()
      const nextDue = nextStep ? new Date(Date.now() + nextStep.days * 86400000).toISOString() : null

      await supabase.from('nurture_entries').update({
        touchpoint:  entry.next_action ?? entry.touchpoint,
        sent_at:     now,
        next_action: nextStep?.action ?? null,
        next_due:    nextDue,
      }).eq('id', entry.id)

      // Log a note on the lead if notes provided
      if (notes.trim()) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          await supabase.from('notes').insert({
            lead_id:   entry.lead_id,
            author_id: session.user.id,
            content:   `[Nurture] ${entry.next_action} — ${notes.trim()}`,
          })
        }
      }

      onAdvanced(); onClose()
    } catch { /* silent */ }
    setSaving(false)
  }

  return (
    <Modal title="Log Touchpoint & Advance" open={open} onClose={onClose}>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:'.68rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#6B7794', marginBottom:8 }}>Completing</div>
        <div style={{ background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.2)', padding:'12px 14px' }}>
          <div style={{ fontSize:'.85rem', fontWeight:600, color:'#22C55E' }}>{entry.next_action ?? entry.touchpoint}</div>
          <div style={{ fontSize:'.75rem', color:'#6B7794', marginTop:3 }}>{entry.leads?.first_name} {entry.leads?.last_name} &middot; {entry.sequence_type}</div>
        </div>
      </div>

      <div style={mb14}>
        <label style={lbl}>Notes on this touchpoint (optional)</label>
        <textarea
          style={{ ...inp, resize:'vertical', minHeight:72 }}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="e.g. Sent Azure Keys case study. They replied saying they are interested but busy this month..."
        />
        <div style={{ fontSize:'.72rem', color:'#6B7794', marginTop:4 }}>This will be saved as a note on the lead record.</div>
      </div>

      {!isLastStep && nextStep && (
        <div style={{ background:'#0F1422', border:'1px solid rgba(255,255,255,0.07)', padding:'12px 14px', marginBottom:16 }}>
          <div style={{ fontSize:'.68rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#6B7794', marginBottom:6 }}>Next Step Will Be</div>
          <div style={{ fontSize:'.85rem', color:'#EEF0F5', marginBottom:4 }}>{nextStep.action}</div>
          <div style={{ fontSize:'.72rem', color:'#F59E0B' }}>Due in {nextStep.days - (steps[currentIdx + 1]?.days ?? 0)} days</div>
        </div>
      )}

      {isLastStep && (
        <div style={{ background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.25)', padding:'12px 14px', marginBottom:16 }}>
          <div style={{ fontSize:'.82rem', color:'#F59E0B' }}>This is the final step in the sequence. After marking it done, consider re-engaging the lead or archiving.</div>
        </div>
      )}

      <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
        <GhostBtn onClick={onClose}>Cancel</GhostBtn>
        <PrimaryBtn onClick={advance} disabled={saving}>
          {saving ? 'Saving...' : isLastStep ? 'Complete Sequence' : 'Mark Done & Advance'}
        </PrimaryBtn>
      </div>
    </Modal>
  )
}

// ── Re-engage Modal ───────────────────────────────────────────────────────────
function ReEngageModal({ entry, open, onClose, onReEngaged }: { entry:any; open:boolean; onClose:()=>void; onReEngaged:()=>void }) {
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  if (!entry) return null

  async function reEngage() {
    setSaving(true)
    try {
      // Update lead to warm + contacted
      await supabase.from('leads').update({ lead_tier: 'warm', status: 'contacted' }).eq('id', entry.lead_id)

      // Remove from nurture
      await supabase.from('nurture_entries').delete().eq('id', entry.id)

      // Create a follow-up task
      const { data: { session } } = await supabase.auth.getSession()
      await supabase.from('tasks').insert({
        title:          `Re-engaged: ${entry.leads?.first_name} ${entry.leads?.last_name} — schedule discovery call`,
        description:    'Lead re-engaged from nurture sequence. Move to pipeline.',
        priority:       'high',
        status:         'open',
        lead_id:        entry.lead_id,
        due_date:       new Date(Date.now() + 86400000).toISOString(),
        auto_generated: true,
      })

      // Log note
      if (session) {
        await supabase.from('notes').insert({
          lead_id:   entry.lead_id,
          author_id: session.user.id,
          content:   `Lead re-engaged from ${entry.sequence_type} nurture sequence. Moved to WARM and added to pipeline.`,
        })
      }

      onReEngaged(); onClose()
    } catch { /* silent */ }
    setSaving(false)
  }

  return (
    <Modal title="Re-Engage Lead" open={open} onClose={onClose}>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:'.9rem', color:'#EEF0F5', marginBottom:8 }}>
          Re-engage <strong style={{ color:'#F26419' }}>{entry.leads?.first_name} {entry.leads?.last_name}</strong> and move them to active pipeline?
        </div>
        <div style={{ fontSize:'.83rem', color:'#9AA0B8', lineHeight:1.7 }}>
          This will:
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:10 }}>
          {[
            'Upgrade lead tier to WARM',
            'Set status to Contacted',
            'Remove from nurture sequence',
            'Create a follow-up task due tomorrow',
            'Log a note on the lead record',
          ].map(item => (
            <div key={item} style={{ display:'flex', gap:8, alignItems:'center', fontSize:'.82rem', color:'#9AA0B8' }}>
              <span style={{ color:'#22C55E', fontWeight:700, flexShrink:0 }}>&#10003;</span> {item}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
        <GhostBtn onClick={onClose}>Cancel</GhostBtn>
        <button onClick={reEngage} disabled={saving} style={{ padding:'9px 24px', background:saving?'#333':'#22C55E', color:'#fff', border:'none', fontFamily:'Outfit,sans-serif', fontSize:'.85rem', fontWeight:700, cursor:saving?'not-allowed':'pointer', clipPath:'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)' }}>
          {saving ? 'Processing...' : 'Re-Engage Lead'}
        </button>
      </div>
    </Modal>
  )
}

// ── Archive / Remove Modal ─────────────────────────────────────────────────
function RemoveModal({ entry, open, onClose, onRemoved }: { entry:any; open:boolean; onClose:()=>void; onRemoved:()=>void }) {
  const [saving, setSaving] = useState(false)
  const supabase = createClient()
  if (!entry) return null

  async function remove() {
    setSaving(true)
    await supabase.from('nurture_entries').delete().eq('id', entry.id)
    await supabase.from('leads').update({ status: 'lost' }).eq('id', entry.lead_id)
    onRemoved(); onClose()
    setSaving(false)
  }

  return (
    <Modal title="Archive Lead" open={open} onClose={onClose}>
      <div style={{ fontSize:'.88rem', color:'#9AA0B8', lineHeight:1.7, marginBottom:20 }}>
        Remove <strong style={{ color:'#EEF0F5' }}>{entry.leads?.first_name} {entry.leads?.last_name}</strong> from the nurture sequence and mark them as lost? This is for leads who have gone cold after the full sequence with no response.
      </div>
      <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
        <GhostBtn onClick={onClose}>Cancel</GhostBtn>
        <button onClick={remove} disabled={saving} style={{ padding:'9px 24px', background:saving?'#333':'#EF4444', color:'#fff', border:'none', fontFamily:'Outfit,sans-serif', fontSize:'.85rem', fontWeight:700, cursor:saving?'not-allowed':'pointer', clipPath:'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)' }}>
          {saving ? 'Archiving...' : 'Archive Lead'}
        </button>
      </div>
    </Modal>
  )
}

// ── Main client component ─────────────────────────────────────────────────────
interface Props { entries: any[] }

export default function NurtureClient({ entries: initialEntries }: Props) {
  const [entries,    setEntries]    = useState(initialEntries)
  const [showAdd,    setShowAdd]    = useState(false)
  const [advancing,  setAdvancing]  = useState<any>(null)
  const [reEngaging, setReEngaging] = useState<any>(null)
  const [removing,   setRemoving]   = useState<any>(null)
  const [filter,     setFilter]     = useState<'all'|'overdue'|'due-today'|'upcoming'>('all')
  const supabase = createClient()
  const router   = useRouter()

  async function refresh() {
    const { data } = await supabase
      .from('nurture_entries')
      .select('*,leads(id,first_name,last_name,email,lead_score,lead_tier,country,form_type)')
      .order('next_due', { nullsFirst: false })
    setEntries(data ?? [])
  }

  const now      = new Date()
  const todayEnd = new Date(now); todayEnd.setHours(23,59,59,999)

  const filtered = entries.filter(e => {
    if (filter === 'all')       return true
    if (!e.next_due)            return filter === 'upcoming'
    const d = new Date(e.next_due)
    if (filter === 'overdue')   return d < now
    if (filter === 'due-today') return d >= now && d <= todayEnd
    if (filter === 'upcoming')  return d > todayEnd
    return true
  })

  const overdueCt   = entries.filter(e => e.next_due && new Date(e.next_due) < now).length
  const todayCt     = entries.filter(e => { if (!e.next_due) return false; const d = new Date(e.next_due); return d >= now && d <= todayEnd }).length

  const chip = (key: typeof filter, label: string, count?: number) => (
    <button onClick={() => setFilter(key)} style={{
      padding:'5px 12px', fontSize:'.72rem', fontWeight:600, cursor:'pointer',
      background: filter === key ? 'rgba(242,100,25,0.1)' : '#141929',
      border:     filter === key ? '1px solid #F26419'     : '1px solid rgba(255,255,255,0.07)',
      color:      filter === key ? '#F26419'               : '#9AA0B8',
    }}>
      {label}{count !== undefined && count > 0 ? ` (${count})` : ''}
    </button>
  )

  return (
    <>
      {/* Modals */}
      <AddToSequenceModal open={showAdd} onClose={() => setShowAdd(false)} onAdded={refresh} />
      <AdvanceModal  entry={advancing}  open={!!advancing}  onClose={() => setAdvancing(null)}  onAdvanced={refresh} />
      <ReEngageModal entry={reEngaging} open={!!reEngaging} onClose={() => setReEngaging(null)} onReEngaged={refresh} />
      <RemoveModal   entry={removing}   open={!!removing}   onClose={() => setRemoving(null)}   onRemoved={refresh} />

      {/* Header */}
      <div style={{ height:52, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', borderBottom:'1px solid rgba(255,255,255,0.07)', background:'#0B0E1A' }}>
        <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'1.05rem', fontWeight:700, color:'#fff' }}>Nurture Sequences</div>
        <button onClick={() => setShowAdd(true)} style={{ padding:'7px 16px', background:'#F26419', color:'#fff', border:'none', fontFamily:'Outfit,sans-serif', fontSize:'.8rem', fontWeight:700, letterSpacing:'.04em', textTransform:'uppercase', cursor:'pointer', clipPath:'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)' }}>
          + Add to Sequence
        </button>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:24 }}>

        {/* Stats row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
          {[
            { label:'In Sequences', value: entries.length,                           accent:'#F26419' },
            { label:'Overdue',      value: overdueCt,                                accent:'#EF4444' },
            { label:'Due Today',    value: todayCt,                                  accent:'#F59E0B' },
            { label:'Sequences',    value: Object.keys(SEQUENCES).length,            accent:'#3B82F6' },
          ].map(s => (
            <div key={s.label} style={{ background:'#141929', border:'1px solid rgba(255,255,255,0.07)', padding:'18px 20px', position:'relative' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:s.accent }} />
              <div style={{ fontSize:'.68rem', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'#6B7794', marginBottom:8 }}>{s.label}</div>
              <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'1.8rem', fontWeight:800, color:'#fff', lineHeight:1 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Sequence legend */}
        <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap', alignItems:'center' }}>
          <span style={{ fontSize:'.68rem', color:'#6B7794', textTransform:'uppercase', letterSpacing:'.1em', fontWeight:700, marginRight:4 }}>Sequences:</span>
          {Object.entries(SEQUENCES).map(([key, seq]) => (
            <span key={key} style={{ fontSize:'.68rem', fontWeight:600, padding:'3px 8px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.07)', color:'#9AA0B8' }}>{seq.label}</span>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
          {chip('all',       `All (${entries.length})`)}
          {chip('overdue',   'Overdue', overdueCt)}
          {chip('due-today', 'Due Today', todayCt)}
          {chip('upcoming',  'Upcoming')}
        </div>

        {/* Table */}
        <div style={{ background:'#141929', border:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr>
                  {['Lead','Sequence','Step Due','Next Action','Progress','Actions'].map(h => (
                    <th key={h} style={{ fontSize:'.65rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#6B7794', padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', textAlign:'left', background:'#141929', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={6} style={{ padding:48, textAlign:'center', color:'#6B7794' }}>
                    {entries.length === 0 ? 'No leads in nurture sequences yet. Click "+ Add to Sequence" to enrol a cold or warm lead.' : 'No entries match this filter.'}
                  </td></tr>
                )}
                {filtered.map((e: any) => {
                  const seq      = SEQUENCES[e.sequence_type]
                  const steps    = seq?.steps ?? []
                  const stepIdx  = e.next_action ? steps.findIndex(s => s.action === e.next_action) : steps.length
                  const progress = steps.length > 0 ? Math.round((Math.max(0, stepIdx) / steps.length) * 100) : 0
                  const isOverdue = e.next_due && new Date(e.next_due) < now
                  const isToday   = e.next_due && new Date(e.next_due) >= now && new Date(e.next_due) <= todayEnd
                  const dueColor  = isOverdue ? '#EF4444' : isToday ? '#F59E0B' : '#9AA0B8'
                  const seqLabel  = seq?.label ?? e.sequence_type

                  return (
                    <tr key={e.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }} className="hover:bg-white/[0.02]">
                      <td style={{ padding:'12px 16px' }}>
                        <Link href={`/enquiries/${e.lead_id}`} style={{ textDecoration:'none' }}>
                          <div style={{ fontWeight:600, color:'#EEF0F5', fontSize:'.83rem' }}>{e.leads?.first_name} {e.leads?.last_name}</div>
                          <div style={{ fontSize:'.7rem', color:'#6B7794', marginTop:2 }}>{e.leads?.email}</div>
                          <div style={{ fontSize:'.68rem', marginTop:3, display:'flex', gap:6 }}>
                            <span style={{ padding:'1px 6px', background:'rgba(107,119,148,0.15)', color:'#9AA0B8', textTransform:'uppercase', fontWeight:700, letterSpacing:'.05em' }}>{e.leads?.lead_tier}</span>
                            <span style={{ color:'#6B7794' }}>Score {e.leads?.lead_score}</span>
                          </div>
                        </Link>
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ fontSize:'.8rem', fontWeight:600, color:'#EEF0F5' }}>{seqLabel}</div>
                        <div style={{ fontSize:'.7rem', color:'#6B7794', marginTop:2 }}>
                          {e.touchpoint ? `Last: ${e.touchpoint.slice(0, 40)}${e.touchpoint.length > 40 ? '...' : ''}` : '—'}
                        </div>
                      </td>
                      <td style={{ padding:'12px 16px', whiteSpace:'nowrap' }}>
                        <div style={{ fontSize:'.82rem', fontWeight: isOverdue ? 700 : 400, color: dueColor }}>
                          {isOverdue ? '⚠ ' : ''}{e.next_due ? fmtDate(e.next_due) : '—'}
                        </div>
                        {isToday && <div style={{ fontSize:'.68rem', color:'#F59E0B', marginTop:2 }}>Due today</div>}
                        {isOverdue && <div style={{ fontSize:'.68rem', color:'#EF4444', marginTop:2 }}>Overdue</div>}
                      </td>
                      <td style={{ padding:'12px 16px', maxWidth:220 }}>
                        <div style={{ fontSize:'.82rem', color: e.next_action ? '#EEF0F5' : '#6B7794', lineHeight:1.5 }}>
                          {e.next_action ?? <span style={{ fontStyle:'italic' }}>Sequence complete</span>}
                        </div>
                      </td>
                      <td style={{ padding:'12px 16px', minWidth:100 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <div style={{ flex:1, height:4, background:'rgba(255,255,255,0.08)', borderRadius:2 }}>
                            <div style={{ height:4, borderRadius:2, background:'#F26419', width:`${progress}%` }} />
                          </div>
                          <span style={{ fontSize:'.7rem', color:'#6B7794', minWidth:28 }}>{progress}%</span>
                        </div>
                        <div style={{ fontSize:'.68rem', color:'#6B7794', marginTop:4 }}>
                          Step {Math.max(1, stepIdx)} of {steps.length}
                        </div>
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                          {e.next_action && (
                            <button onClick={() => setAdvancing(e)} style={{ padding:'5px 10px', background:'rgba(242,100,25,0.1)', border:'1px solid rgba(242,100,25,0.3)', color:'#F26419', cursor:'pointer', fontSize:'.72rem', fontWeight:600, whiteSpace:'nowrap' }}>
                              Mark Done
                            </button>
                          )}
                          <button onClick={() => setReEngaging(e)} style={{ padding:'5px 10px', background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.3)', color:'#22C55E', cursor:'pointer', fontSize:'.72rem', fontWeight:600, whiteSpace:'nowrap' }}>
                            Re-Engage
                          </button>
                          <button onClick={() => setRemoving(e)} style={{ padding:'5px 10px', background:'rgba(107,119,148,0.08)', border:'1px solid rgba(107,119,148,0.2)', color:'#6B7794', cursor:'pointer', fontSize:'.72rem', fontWeight:600, whiteSpace:'nowrap' }}>
                            Archive
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sequence reference */}
        <div style={{ marginTop:24 }}>
          <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'.9rem', fontWeight:700, color:'#fff', marginBottom:12 }}>Sequence Templates</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12 }}>
            {Object.entries(SEQUENCES).map(([key, seq]) => (
              <div key={key} style={{ background:'#141929', border:'1px solid rgba(255,255,255,0.07)', padding:'16px 18px' }}>
                <div style={{ fontSize:'.8rem', fontWeight:700, color:'#F26419', marginBottom:10 }}>{seq.label}</div>
                {seq.steps.map((step, i) => (
                  <div key={i} style={{ display:'flex', gap:10, marginBottom:5, alignItems:'flex-start' }}>
                    <span style={{ fontSize:'.68rem', color:'#6B7794', minWidth:42, flexShrink:0 }}>Day {step.days}</span>
                    <span style={{ fontSize:'.78rem', color:'#9AA0B8', lineHeight:1.5 }}>{step.action}</span>
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
