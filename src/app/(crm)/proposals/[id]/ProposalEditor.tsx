'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { fmtFull$ } from '@/lib/utils'
import {
  ProposalSection, ServiceType, SERVICE_LABELS,
  getDefaultSections, ADDABLE_SECTIONS, ADDABLE_SECTION_DEFAULTS,
  FORM_TYPE_TO_SERVICE,
} from '@/lib/proposal-sections'

interface PricingItem { description: string; amount: number; type: string }

// ── Style tokens ──────────────────────────────────────────────────────────────
const inp: React.CSSProperties = { width:'100%', background:'#192035', border:'1px solid rgba(255,255,255,0.1)', color:'#EEF0F5', fontFamily:'Inter,sans-serif', fontSize:'.85rem', padding:'9px 12px', outline:'none', borderRadius:0 }
const ta:  React.CSSProperties = { ...inp, resize:'vertical', minHeight:80 }
const lbl: React.CSSProperties = { display:'block', fontSize:'.68rem', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'#9AA0B8', marginBottom:6 }

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ marginBottom:14 }}><label style={lbl}>{label}</label>{children}</div>
}

function SectionCard({
  section, index, total, onUpdate, onDelete, onMoveUp, onMoveDown, onToggle,
}: {
  section: ProposalSection; index: number; total: number
  onUpdate: (content: string) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onToggle: () => void
}) {
  const [collapsed, setCollapsed] = useState(false)
  const isInvestment = section.id === 'investment'

  return (
    <div style={{
      background: '#141929', border: `1px solid ${section.included ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)'}`,
      marginBottom: 8, opacity: section.included ? 1 : 0.45, position: 'relative',
    }}>
      {/* Top accent */}
      {section.included && (
        <div style={{ height: 2, background: isInvestment ? '#22C55E' : '#F26419' }} />
      )}

      {/* Card header */}
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 16px', borderBottom: collapsed ? 'none' : '1px solid rgba(255,255,255,0.07)', cursor:'pointer' }}
        onClick={() => setCollapsed(p => !p)}>
        {/* Drag handle / order */}
        <div style={{ fontSize:'.65rem', color:'#6B7794', minWidth:20, textAlign:'center', fontWeight:700, letterSpacing:'.06em' }}>
          {index + 1}
        </div>
        {/* Title */}
        <div style={{ flex:1, fontFamily:'Outfit,sans-serif', fontWeight:700, fontSize:'.88rem', color: section.included ? '#fff' : '#6B7794' }}>
          {section.title}
          {section.locked && <span style={{ marginLeft:8, fontSize:'.62rem', color:'#F26419', fontWeight:600, letterSpacing:'.08em' }}>REQUIRED</span>}
        </div>
        {/* Controls */}
        <div style={{ display:'flex', gap:4, alignItems:'center' }} onClick={e => e.stopPropagation()}>
          {/* Include toggle */}
          <button
            onClick={onToggle}
            title={section.included ? 'Exclude from proposal' : 'Include in proposal'}
            style={{ padding:'3px 8px', fontSize:'.65rem', fontWeight:700, letterSpacing:'.06em', cursor: section.locked ? 'not-allowed' : 'pointer', background: section.included ? 'rgba(34,197,94,0.12)' : 'rgba(107,119,148,0.1)', border: section.included ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(107,119,148,0.2)', color: section.included ? '#22C55E' : '#6B7794' }}
            disabled={section.locked}
          >
            {section.included ? 'IN' : 'OUT'}
          </button>
          {/* Move up/down */}
          <button onClick={onMoveUp} disabled={index === 0} style={{ padding:'3px 7px', fontSize:'.75rem', background:'transparent', border:'1px solid rgba(255,255,255,0.07)', color:'#9AA0B8', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.4 : 1 }}>^</button>
          <button onClick={onMoveDown} disabled={index === total - 1} style={{ padding:'3px 7px', fontSize:'.75rem', background:'transparent', border:'1px solid rgba(255,255,255,0.07)', color:'#9AA0B8', cursor: index === total - 1 ? 'not-allowed' : 'pointer', opacity: index === total - 1 ? 0.4 : 1 }}>v</button>
          {/* Delete */}
          {!section.locked && (
            <button onClick={onDelete} style={{ padding:'3px 8px', fontSize:'.72rem', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', color:'#EF4444', cursor:'pointer' }}>x</button>
          )}
          {/* Collapse */}
          <button onClick={() => setCollapsed(p => !p)} style={{ padding:'3px 8px', fontSize:'.72rem', background:'transparent', border:'1px solid rgba(255,255,255,0.07)', color:'#9AA0B8', cursor:'pointer' }}>
            {collapsed ? '+' : '-'}
          </button>
        </div>
      </div>

      {/* Content */}
      {!collapsed && (
        <div style={{ padding:'14px 16px' }}>
          {isInvestment ? (
            <div style={{ fontSize:'.82rem', color:'#6B7794', fontStyle:'italic' }}>
              The investment table is managed in the Pricing section below and auto-renders in the PDF.
              {section.content && (
                <div style={{ marginTop:8 }}>
                  <label style={lbl}>Additional investment notes</label>
                  <textarea style={ta} value={section.content} onChange={e => onUpdate(e.target.value)} rows={2} placeholder="Optional note about payment structure, ad spend separation, etc." />
                </div>
              )}
            </div>
          ) : (
            <textarea
              style={{ ...ta, minHeight: 120 }}
              value={section.content}
              onChange={e => onUpdate(e.target.value)}
              placeholder={`Write the ${section.title} content...`}
            />
          )}
        </div>
      )}
    </div>
  )
}

// ── Main Editor ───────────────────────────────────────────────────────────────
export default function ProposalEditor({ proposal }: { proposal: any }) {
  const router  = useRouter()
  const supabase = createClient()

  // Derive service type from lead's form_type or stored service_type
  const serviceType: ServiceType = (proposal.service_type
    ?? FORM_TYPE_TO_SERVICE[proposal.leads?.form_type ?? '']
    ?? 'full-ecosystem') as ServiceType

  // ── State ───────────────────────────────────────────────────────────────────
  const [title,       setTitle]       = useState(proposal.title ?? '')
  const [status,      setStatus]      = useState(proposal.status ?? 'draft')
  const [validUntil,  setValidUntil]  = useState(proposal.valid_until ?? '')
  const [clientName,  setClientName]  = useState(proposal.client_company ?? proposal.clients?.company_name ?? (proposal.leads ? `${proposal.leads.first_name} ${proposal.leads.last_name}` : ''))
  const [clientContact, setClientContact] = useState(proposal.client_contact ?? proposal.leads?.first_name ? `${proposal.leads.first_name} ${proposal.leads.last_name}` : '')
  const [services,    setServices]    = useState<string[]>(proposal.services ?? [])
  const [pricing,     setPricing]     = useState<PricingItem[]>(proposal.pricing_breakdown ?? [])
  const [saving,      setSaving]      = useState(false)
  const [generating,  setGenerating]  = useState(false)
  const [showAddSection, setShowAddSection] = useState(false)

  // ── Sections ────────────────────────────────────────────────────────────────
  const initSections = (): ProposalSection[] => {
    if (Array.isArray(proposal.sections) && proposal.sections.length > 0) {
      return proposal.sections as ProposalSection[]
    }
    // First time — generate from template, pre-fill scope from lead data
    const defaults = getDefaultSections(serviceType)
    // Pre-fill understanding-your-operation / executive summary with lead context
    const lead = proposal.leads
    if (lead) {
      const fd = (lead.form_data ?? {}) as Record<string, any>
      defaults.forEach(s => {
        if (s.id === 'understanding-your-operation' || s.id === 'current-foundation' || s.id === 'where-you-are-now') {
          const parts: string[] = []
          if (lead.company)          parts.push(`Client: ${lead.company}`)
          if (lead.industry)         parts.push(`Industry: ${lead.industry.replace(/_/g, ' ')}`)
          if (lead.country)          parts.push(`Market: ${lead.country}`)
          if (fd.business_context)   parts.push(`\n${fd.business_context}`)
          if (fd.business_desc)      parts.push(`\n${fd.business_desc}`)
          if (fd.challenge)          parts.push(`\nMain challenge: ${fd.challenge}`)
          if (fd.pain && !Array.isArray(fd.pain)) parts.push(`\n${fd.pain}`)
          if (fd.success)            parts.push(`\nSuccess definition: ${fd.success}`)
          if (Array.isArray(fd.pain)) parts.push(`\nPain points: ${fd.pain.join(', ')}`)
          if (parts.length > 0) s.content = parts.filter(Boolean).join('\n')
        }
        if (s.id === 'what-the-site-will-achieve' && fd.goal) {
          s.content = s.content.replace('[From enquiry — leads / bookings / credibility / e-commerce / CRM feed]', fd.goal)
        }
        if (s.id === 'executive-summary') {
          s.content = s.content.replace('[Client Name]', lead.company ?? `${lead.first_name} ${lead.last_name}`)
        }
      })
    }
    return defaults
  }

  const [sections, setSections] = useState<ProposalSection[]>(initSections)

  // ── Section operations ──────────────────────────────────────────────────────
  function updateSection(index: number, content: string) {
    setSections(prev => prev.map((s, i) => i === index ? { ...s, content } : s))
  }
  function deleteSection(index: number) {
    setSections(prev => prev.filter((_, i) => i !== index))
  }
  function moveUp(index: number) {
    if (index === 0) return
    setSections(prev => { const a = [...prev]; [a[index-1], a[index]] = [a[index], a[index-1]]; return a })
  }
  function moveDown(index: number) {
    setSections(prev => { if (index === prev.length - 1) return prev; const a = [...prev]; [a[index], a[index+1]] = [a[index+1], a[index]]; return a })
  }
  function toggleSection(index: number) {
    setSections(prev => prev.map((s, i) => i === index && !s.locked ? { ...s, included: !s.included } : s))
  }
  function addSection(id: string, title: string) {
    const content = ADDABLE_SECTION_DEFAULTS[id] ?? ''
    // Insert before next-steps
    const insertIdx = sections.findIndex(s => s.id === 'next-steps')
    const newSection: ProposalSection = { id: `${id}-${Date.now()}`, title, content, included: true }
    setSections(prev => {
      const a = [...prev]
      a.splice(insertIdx < 0 ? a.length : insertIdx, 0, newSection)
      return a
    })
    setShowAddSection(false)
  }

  // ── Pricing ─────────────────────────────────────────────────────────────────
  function addPricingRow() { setPricing(p => [...p, { description:'', amount:0, type:'one_off' }]) }
  function updatePricingRow(i: number, field: string, value: string | number) {
    setPricing(p => p.map((r, idx) => idx === i ? { ...r, [field]: value } : r))
  }
  function removePricingRow(i: number) { setPricing(p => p.filter((_, idx) => idx !== i)) }
  const totalValue = pricing.reduce((s, p) => s + (p.amount ?? 0), 0)

  // ── Save ─────────────────────────────────────────────────────────────────────
  async function save() {
    setSaving(true)
    await supabase.from('proposals').update({
      title, status, valid_until: validUntil || null,
      client_company: clientName, client_contact: clientContact,
      services, sections, pricing_breakdown: pricing,
      value: totalValue, service_type: serviceType,
    }).eq('id', proposal.id)
    setSaving(false)
    router.refresh()
  }

  // ── PDF ──────────────────────────────────────────────────────────────────────
  async function generatePDF() {
    await save()
    setGenerating(true)
    try {
      const res = await fetch(`/api/proposals/${proposal.id}/pdf`)
      if (res.ok) {
        const blob = await res.blob()
        const url  = URL.createObjectURL(blob)
        const a    = document.createElement('a')
        a.href     = url
        a.download = `${title.replace(/\s+/g, '-')}.pdf`
        a.click()
        URL.revokeObjectURL(url)
      }
    } finally { setGenerating(false) }
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:16, alignItems:'start' }}>

      {/* LEFT: Sections editor */}
      <div>
        {/* Action bar */}
        <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap', alignItems:'center' }}>
          <button onClick={save} disabled={saving} style={{ padding:'8px 18px', background: saving ? '#333':'#F26419', color:'#fff', border:'none', fontFamily:'Outfit,sans-serif', fontSize:'.8rem', fontWeight:700, letterSpacing:'.04em', textTransform:'uppercase', cursor: saving ? 'not-allowed':'pointer', clipPath:'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)' }}>
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button onClick={generatePDF} disabled={generating} style={{ padding:'8px 18px', background: generating ? '#333':'#22C55E', color:'#fff', border:'none', fontFamily:'Outfit,sans-serif', fontSize:'.8rem', fontWeight:700, letterSpacing:'.04em', textTransform:'uppercase', cursor: generating ? 'not-allowed':'pointer', clipPath:'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)' }}>
            {generating ? 'Generating...' : 'Download PDF'}
          </button>
          <select value={status} onChange={e => setStatus(e.target.value)} style={{ background:'#192035', border:'1px solid rgba(255,255,255,0.1)', color:'#EEF0F5', fontSize:'.82rem', padding:'8px 12px', cursor:'pointer', outline:'none' }}>
            {['draft','sent','negotiating','won','lost'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div style={{ flex:1 }} />
          <div style={{ fontSize:'.72rem', color:'#6B7794', padding:'4px 10px', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
            {SERVICE_LABELS[serviceType]}
          </div>
        </div>

        {/* Proposal title + client */}
        <div style={{ background:'#141929', border:'1px solid rgba(255,255,255,0.07)', padding:'20px 20px 16px', marginBottom:8 }}>
          <div style={{ height:2, background:'#F26419', marginBottom:16, marginLeft:-20, marginRight:-20, marginTop:-20 }} />
          <Field label="Proposal Title"><input style={{ ...inp, fontFamily:'Outfit,sans-serif', fontSize:'1rem', fontWeight:700 }} value={title} onChange={e => setTitle(e.target.value)} /></Field>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
            <Field label="Client / Company"><input style={inp} value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Company name" /></Field>
            <Field label="Prepared For"><input style={inp} value={clientContact} onChange={e => setClientContact(e.target.value)} placeholder="Contact name" /></Field>
            <Field label="Valid Until"><input type="date" style={inp} value={validUntil} onChange={e => setValidUntil(e.target.value)} /></Field>
          </div>
          <Field label="Services (comma-separated)">
            <input style={inp} value={services.join(', ')} onChange={e => setServices(e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder="e.g. Custom CRM, Lead Generation" />
          </Field>
        </div>

        {/* Section list */}
        {sections.map((section, i) => (
          <SectionCard
            key={section.id}
            section={section}
            index={i}
            total={sections.length}
            onUpdate={content => updateSection(i, content)}
            onDelete={() => deleteSection(i)}
            onMoveUp={() => moveUp(i)}
            onMoveDown={() => moveDown(i)}
            onToggle={() => toggleSection(i)}
          />
        ))}

        {/* Add section */}
        <div style={{ marginTop:4 }}>
          {!showAddSection ? (
            <button onClick={() => setShowAddSection(true)} style={{ padding:'8px 16px', background:'transparent', border:'1px dashed rgba(255,255,255,0.15)', color:'#6B7794', cursor:'pointer', fontSize:'.78rem', width:'100%' }}>
              + Add Section
            </button>
          ) : (
            <div style={{ background:'#141929', border:'1px solid rgba(255,255,255,0.07)', padding:14 }}>
              <div style={{ fontSize:'.72rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#F26419', marginBottom:10 }}>Add a Section</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:10 }}>
                {ADDABLE_SECTIONS.map(s => (
                  <button key={s.id} onClick={() => addSection(s.id, s.title)} style={{ padding:'6px 12px', background:'#192035', border:'1px solid rgba(255,255,255,0.1)', color:'#9AA0B8', cursor:'pointer', fontSize:'.78rem' }}>
                    {s.title}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowAddSection(false)} style={{ fontSize:'.75rem', color:'#6B7794', background:'none', border:'none', cursor:'pointer' }}>Cancel</button>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Pricing sidebar */}
      <div style={{ position:'sticky', top:16 }}>
        <div style={{ background:'#141929', border:'1px solid rgba(255,255,255,0.07)', padding:'18px 16px' }}>
          <div style={{ fontFamily:'Outfit,sans-serif', fontWeight:700, color:'#fff', marginBottom:12, paddingBottom:8, borderBottom:'1px solid rgba(255,255,255,0.07)' }}>Investment</div>

          {pricing.map((item, i) => (
            <div key={i} style={{ marginBottom:8 }}>
              <input value={item.description} onChange={e => updatePricingRow(i,'description',e.target.value)} placeholder="Description" style={{ ...inp, marginBottom:4 }} />
              <div style={{ display:'grid', gridTemplateColumns:'1fr 100px 28px', gap:4 }}>
                <input type="number" value={item.amount || ''} onChange={e => updatePricingRow(i,'amount',Number(e.target.value))} style={inp} placeholder="0" />
                <select value={item.type} onChange={e => updatePricingRow(i,'type',e.target.value)} style={{ ...inp, cursor:'pointer', appearance:'none', fontSize:'.75rem', padding:'7px 8px' }}>
                  <option value="one_off">One-off</option>
                  <option value="monthly">Monthly</option>
                  <option value="retainer">Retainer</option>
                  <option value="deposit">Deposit</option>
                  <option value="milestone">Milestone</option>
                </select>
                <button onClick={() => removePricingRow(i)} style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', color:'#EF4444', cursor:'pointer', fontSize:'.78rem' }}>x</button>
              </div>
            </div>
          ))}

          <button onClick={addPricingRow} style={{ width:'100%', padding:'7px', background:'transparent', border:'1px dashed rgba(255,255,255,0.12)', color:'#6B7794', cursor:'pointer', fontSize:'.75rem', marginBottom:12 }}>
            + Add line item
          </button>

          {pricing.length > 0 && (
            <div style={{ borderTop:'1px solid rgba(255,255,255,0.07)', paddingTop:10 }}>
              {pricing.map((item, i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', fontSize:'.78rem', marginBottom:4 }}>
                  <span style={{ color:'#9AA0B8', maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.description || `Line ${i+1}`}</span>
                  <span style={{ color:'#EEF0F5', fontWeight:600 }}>${(item.amount ?? 0).toLocaleString()} <span style={{ color:'#6B7794', fontSize:'.65rem', textTransform:'uppercase' }}>{item.type?.replace('_',' ')}</span></span>
                </div>
              ))}
              <div style={{ display:'flex', justifyContent:'space-between', paddingTop:8, borderTop:'1px solid rgba(255,255,255,0.07)', marginTop:6 }}>
                <span style={{ fontFamily:'Outfit,sans-serif', fontWeight:700, color:'#fff' }}>Total</span>
                <span style={{ fontFamily:'Outfit,sans-serif', fontWeight:800, fontSize:'1.1rem', color:'#22C55E' }}>{fmtFull$(totalValue)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Section visibility overview */}
        <div style={{ background:'#141929', border:'1px solid rgba(255,255,255,0.07)', padding:'14px 16px', marginTop:8 }}>
          <div style={{ fontFamily:'Outfit,sans-serif', fontWeight:700, color:'#fff', fontSize:'.82rem', marginBottom:10 }}>Sections ({sections.filter(s=>s.included).length} included)</div>
          {sections.map((s, i) => (
            <div key={s.id} style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4, cursor:'pointer' }} onClick={() => toggleSection(i)}>
              <div style={{ width:8, height:8, borderRadius:'50%', background: s.included ? '#22C55E' : 'rgba(107,119,148,0.3)', flexShrink:0 }} />
              <span style={{ fontSize:'.75rem', color: s.included ? '#9AA0B8' : '#6B7794', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1 }}>{s.title}</span>
              {s.locked && <span style={{ fontSize:'.6rem', color:'#F26419' }}>*</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
