'use client'
import { FORM_TYPE_TO_SERVICE } from '@/lib/proposal-sections'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Props {
  lead: any
  notes: any[]
  open: boolean
  onClose: () => void
}

// ── Form type -> service label map ────────────────────────────────────────────
const FORM_SERVICE_MAP: Record<string, string[]> = {
  'get-a-custom-crm-quote':    ['Custom CRM & Business Intelligence'],
  'start-a-website-project':   ['Website & Digital Infrastructure'],
  'start-a-brand-project':     ['Brand & Identity'],
  'get-a-marketing-proposal':  ['Marketing & Growth'],
  'discuss-a-retainer':        ['Business Optimisation Retainer'],
  'book-a-discovery-call':     ['Full Digital Ecosystem Review'],
  'get-a-proposal':            [],
}

// Derive services from form data
function deriveServices(lead: any): string[] {
  const ft   = lead.form_type ?? ''
  const base = FORM_SERVICE_MAP[ft] ?? []
  const fd   = (lead.form_data ?? {}) as Record<string, any>

  // For get-a-proposal, use the needs array
  if (ft === 'get-a-proposal' && Array.isArray(fd.needs)) {
    const map: Record<string, string> = {
      crm: 'Custom CRM & Business Intelligence', website: 'Website & Digital Infrastructure',
      leadgen: 'Lead Generation System', brand: 'Brand & Identity',
      marketing: 'Marketing & Growth', full: 'Full Digital Ecosystem',
    }
    return fd.needs.map((n: string) => map[n] ?? n).filter(Boolean)
  }
  // For marketing, add sub-services
  if (ft === 'get-a-marketing-proposal' && Array.isArray(fd.services)) {
    const map: Record<string, string> = {
      paid_ads: 'Paid Advertising', social: 'Social Media Management',
      email: 'Email Marketing', content: 'Content Creation', seo: 'SEO', full: 'Full Marketing Programme',
    }
    return fd.services.map((s: string) => map[s] ?? s).filter(Boolean)
  }
  return base
}

// Derive scope from form_data
function deriveScope(lead: any): string {
  const fd = (lead.form_data ?? {}) as Record<string, any>
  const ft = lead.form_type ?? ''
  const parts: string[] = []

  if (fd.business_context) parts.push(fd.business_context)
  if (fd.description)      parts.push(fd.description)
  if (fd.business_desc)    parts.push(fd.business_desc)
  if (fd.goal)             parts.push(`Primary goal: ${fd.goal}`)
  if (fd.challenge)        parts.push(fd.challenge)
  if (fd.pain && !Array.isArray(fd.pain)) parts.push(fd.pain)
  if (fd.notes)            parts.push(fd.notes)
  if (fd.success)          parts.push(`Success definition: ${fd.success}`)

  return parts.filter(Boolean).join('\n\n')
}

// Derive deliverables from form_data
function deriveDeliverables(lead: any): string {
  const fd = (lead.form_data ?? {}) as Record<string, any>
  const items: string[] = []

  if (Array.isArray(fd.pain))          items.push('Pain points to address: ' + fd.pain.join(', '))
  if (Array.isArray(fd.features))      items.push('CRM features: ' + fd.features.join(', '))
  if (Array.isArray(fd.deliverables))  items.push('Brand deliverables: ' + fd.deliverables.join(', '))
  if (Array.isArray(fd.needs))         items.push('Services needed: ' + fd.needs.join(', '))
  if (fd.page_count)                   items.push(`Website: ${fd.page_count} pages`)
  if (fd.brand_status)                 items.push(`Brand status: ${fd.brand_status}`)
  if (fd.team_size)                    items.push(`Team size: ${fd.team_size}`)
  if (fd.existing)                     items.push(`Existing tools: ${fd.existing}`)

  return items.filter(Boolean).join('\n')
}

// Derive timeline
function deriveTimeline(lead: any): string {
  const fd = (lead.form_data ?? {}) as Record<string, any>
  return fd.timeline ? `Client requested: ${fd.timeline}` : ''
}

// Derive estimated value from budget fields
function deriveValue(lead: any): number {
  const fd = (lead.form_data ?? {}) as Record<string, any>
  if (fd.budget && !isNaN(Number(fd.budget))) return Number(fd.budget)
  const budgetRangeMap: Record<string, number> = {
    'under5k': 4500, '5-15k': 10000, '15-30k': 22000,
    '30-60k': 45000, '60k+': 65000, 'unsure': 0,
  }
  if (fd.budget_range && budgetRangeMap[fd.budget_range]) return budgetRangeMap[fd.budget_range]
  return 0
}

const inp: React.CSSProperties = { width:'100%', background:'#192035', border:'1px solid rgba(255,255,255,0.1)', color:'#EEF0F5', fontFamily:'Inter,sans-serif', fontSize:'.85rem', padding:'9px 12px', outline:'none' }
const sel: React.CSSProperties = { ...inp, cursor:'pointer', appearance:'none' } as React.CSSProperties
const lbl: React.CSSProperties = { display:'block', fontSize:'.68rem', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'#9AA0B8', marginBottom:6 }
const mb: React.CSSProperties = { marginBottom:14 }

export default function GenerateProposalModal({ lead, notes, open, onClose }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [form, setForm] = useState(() => ({
    title:       `${lead.company ?? lead.first_name + ' ' + lead.last_name} — ${(deriveServices(lead)[0] ?? 'Digital Project')}`,
    services:    deriveServices(lead),
    scope:       deriveScope(lead),
    deliverables: deriveDeliverables(lead),
    timeline:    deriveTimeline(lead),
    value:       deriveValue(lead),
    terms:       'Payment terms: 35% deposit on signing, 35% on mid-project milestone, 30% on completion. All work remains the intellectual property of Kromium Marketing and Development Inc. until full payment is received. Two rounds of revisions included per phase. Additional revisions billed at agreed hourly rate.',
    valid_until: (() => { const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split('T')[0] })(),
  }))

  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState('')

  function set(k: string, v: any) { setForm(p => ({ ...p, [k]: v })) }

  // Include notes as context (shown read-only for reference)
  const notesText = notes.map(n => `${n.profiles?.full_name ?? 'Team'}: ${n.content}`).join('\n\n')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      const { data: proposal, error: err } = await supabase.from('proposals').insert({
        lead_id:           lead.id,
        title:             form.title,
        status:            'draft',
        services:          form.services,
        scope:             form.scope,
        deliverables:      form.deliverables,
        timeline:          form.timeline,
        value:             form.value || 0,
        terms:             form.terms,
        valid_until:       form.valid_until || null,
        pricing_breakdown: [],
        service_type:      FORM_TYPE_TO_SERVICE[lead.form_type ?? ''] ?? 'full-ecosystem',
        client_company:    lead.company ?? null,
        client_contact:    `${lead.first_name} ${lead.last_name}`,
        sections:          [],
      }).select().single()

      if (err || !proposal) throw new Error(err?.message ?? 'Failed to create proposal')

      onClose()
      router.push(`/proposals/${proposal.id}`)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setSaving(false)
    }
  }

  if (!open) return null

  const fd = (lead.form_data ?? {}) as Record<string, any>

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background:'#141929', border:'1px solid rgba(255,255,255,0.1)', width:'100%', maxWidth:680, maxHeight:'94vh', overflowY:'auto' }}>
        {/* Header */}
        <div style={{ position:'sticky', top:0, background:'#141929', zIndex:1, padding:'18px 24px 14px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'1.05rem', fontWeight:700, color:'#fff' }}>Generate Proposal</div>
            <div style={{ fontSize:'.72rem', color:'#F26419', marginTop:2 }}>Pre-filled from enquiry data and notes</div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#9AA0B8', cursor:'pointer', fontSize:20 }}>x</button>
        </div>

        <form onSubmit={submit} style={{ padding:'20px 24px' }}>

          {/* Source context — read only */}
          <div style={{ background:'#0F1422', border:'1px solid rgba(255,255,255,0.07)', padding:'14px 16px', marginBottom:20 }}>
            <div style={{ fontSize:'.65rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#F26419', marginBottom:8 }}>Source Enquiry</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {[
                { label:'Lead', value: `${lead.first_name} ${lead.last_name}` },
                { label:'Form', value: lead.form_type?.replace(/-/g,' ') },
                { label:'Country', value: lead.country },
                { label:'Industry', value: lead.industry?.replace(/_/g,' ') },
                { label:'Score', value: `${lead.lead_score}/100 (${lead.lead_tier?.toUpperCase()})` },
                { label:'Budget indicated', value: fd.budget ? `$${fd.budget}` : fd.budget_range?.replace(/-/g,' ') ?? '—' },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontSize:'.65rem', color:'#6B7794', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:2 }}>{item.label}</div>
                  <div style={{ fontSize:'.82rem', color:'#EEF0F5', textTransform:'capitalize' }}>{item.value ?? '—'}</div>
                </div>
              ))}
            </div>
            {notesText && (
              <div style={{ marginTop:12, paddingTop:12, borderTop:'1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontSize:'.65rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#6B7794', marginBottom:6 }}>Notes on this Lead</div>
                <div style={{ fontSize:'.78rem', color:'#9AA0B8', lineHeight:1.7, whiteSpace:'pre-wrap' }}>{notesText}</div>
              </div>
            )}
          </div>

          {/* Proposal title */}
          <div style={mb}>
            <label style={lbl}>Proposal Title *</label>
            <input style={inp} value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>

          {/* Services */}
          <div style={mb}>
            <label style={lbl}>Services (comma-separated)</label>
            <input style={inp} value={form.services.join(', ')} onChange={e => set('services', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder="e.g. Custom CRM, Lead Generation" />
          </div>

          {/* Scope */}
          <div style={mb}>
            <label style={lbl}>Scope</label>
            <textarea style={{ ...inp, resize:'vertical', minHeight:100 }} value={form.scope} onChange={e => set('scope', e.target.value)} placeholder="What the engagement covers..." />
          </div>

          {/* Deliverables */}
          <div style={mb}>
            <label style={lbl}>Deliverables</label>
            <textarea style={{ ...inp, resize:'vertical', minHeight:80 }} value={form.deliverables} onChange={e => set('deliverables', e.target.value)} placeholder="What will be delivered..." />
          </div>

          {/* Timeline */}
          <div style={mb}>
            <label style={lbl}>Timeline</label>
            <input style={inp} value={form.timeline} onChange={e => set('timeline', e.target.value)} placeholder="e.g. 8-12 weeks from signed brief" />
          </div>

          {/* Value + Valid until */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
            <div>
              <label style={lbl}>Estimated Value (USD)</label>
              <input style={inp} type="number" value={form.value || ''} onChange={e => set('value', Number(e.target.value))} placeholder="0" />
            </div>
            <div>
              <label style={lbl}>Valid Until</label>
              <input style={{ ...inp, cursor:'pointer' }} type="date" value={form.valid_until} onChange={e => set('valid_until', e.target.value)} />
            </div>
          </div>

          {/* Terms */}
          <div style={mb}>
            <label style={lbl}>Payment Terms</label>
            <textarea style={{ ...inp, resize:'vertical', minHeight:64 }} value={form.terms} onChange={e => set('terms', e.target.value)} />
          </div>

          {error && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'#EF4444', padding:'10px 14px', fontSize:'.82rem', marginBottom:14 }}>{error}</div>}

          <div style={{ display:'flex', gap:8, justifyContent:'flex-end', paddingTop:8, borderTop:'1px solid rgba(255,255,255,0.07)', marginTop:8 }}>
            <button type="button" onClick={onClose} style={{ padding:'9px 20px', background:'transparent', border:'1px solid rgba(255,255,255,0.12)', color:'#9AA0B8', cursor:'pointer', fontFamily:'Inter,sans-serif', fontSize:'.82rem' }}>Cancel</button>
            <button type="submit" disabled={saving} style={{ padding:'10px 28px', background:saving?'#333':'#F26419', color:'#fff', border:'none', cursor:saving?'not-allowed':'pointer', fontFamily:'Outfit,sans-serif', fontSize:'.85rem', fontWeight:700, letterSpacing:'.04em', textTransform:'uppercase', clipPath:'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)' }}>
              {saving ? 'Creating...' : 'Create Draft Proposal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
