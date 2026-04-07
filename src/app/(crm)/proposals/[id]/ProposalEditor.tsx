'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { fmtFull$ } from '@/lib/utils'

interface PricingItem { description: string; amount: number; type: string }

export default function ProposalEditor({ proposal }: { proposal: any }) {
  const [title,         setTitle]         = useState(proposal.title ?? '')
  const [scope,         setScope]         = useState(proposal.scope ?? '')
  const [deliverables,  setDeliverables]  = useState(proposal.deliverables ?? '')
  const [timeline,      setTimeline]      = useState(proposal.timeline ?? '')
  const [terms,         setTerms]         = useState(proposal.terms ?? '')
  const [pricing,       setPricing]       = useState<PricingItem[]>(proposal.pricing_breakdown ?? [])
  const [status,        setStatus]        = useState(proposal.status ?? 'draft')
  const [validUntil,    setValidUntil]    = useState(proposal.valid_until ?? '')
  const [saving,        setSaving]        = useState(false)
  const [generating,    setGenerating]    = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const totalValue = pricing.reduce((s, p) => s + (p.amount ?? 0), 0)

  async function save() {
    setSaving(true)
    await supabase.from('proposals').update({
      title, scope, deliverables, timeline, terms,
      pricing_breakdown: pricing, status, valid_until: validUntil || null,
      value: totalValue,
    }).eq('id', proposal.id)
    setSaving(false)
    router.refresh()
  }

  function addPricingRow() {
    setPricing(prev => [...prev, { description: '', amount: 0, type: 'one_off' }])
  }

  function updatePricingRow(i: number, field: string, value: string | number) {
    setPricing(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p))
  }

  function removePricingRow(i: number) {
    setPricing(prev => prev.filter((_, idx) => idx !== i))
  }

  async function generatePDF() {
    setGenerating(true)
    try {
      const res = await fetch(`/api/proposals/${proposal.id}/pdf`)
      if (res.ok) {
        const blob = await res.blob()
        const url  = URL.createObjectURL(blob)
        const a    = document.createElement('a')
        a.href     = url
        a.download = `${title.replace(/\s+/g,'-')}.pdf`
        a.click()
        URL.revokeObjectURL(url)
      }
    } finally {
      setGenerating(false)
    }
  }

  const TA = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea {...props} style={{ width:'100%', background:'#192035', border:'1px solid rgba(255,255,255,0.07)', color:'#EEF0F5', fontFamily:'Inter,sans-serif', fontSize:'.85rem', padding:'9px 12px', outline:'none', resize:'vertical', minHeight:props.rows ? undefined : 80, borderRadius:0 }} />
  )
  const fieldLabel = (t: string) => (
    <label style={{ display:'block', fontSize:'.68rem', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'#9AA0B8', marginBottom:6 }}>{t}</label>
  )

  return (
    <div>
      {/* Actions */}
      <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
        <button onClick={save} disabled={saving} style={{ padding:'8px 18px', background: saving ? '#333' : '#F26419', color:'#fff', border:'none', fontFamily:'Outfit,sans-serif', fontSize:'.8rem', fontWeight:700, letterSpacing:'.04em', textTransform:'uppercase' as 'uppercase', cursor: saving ? 'not-allowed':'pointer', clipPath:'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)' }}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <button onClick={generatePDF} disabled={generating} style={{ padding:'8px 18px', background: generating ? '#333' : '#22C55E', color:'#fff', border:'none', fontFamily:'Outfit,sans-serif', fontSize:'.8rem', fontWeight:700, letterSpacing:'.04em', textTransform:'uppercase', cursor: generating ? 'not-allowed':'pointer', clipPath:'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)' }}>
          {generating ? 'Generating...' : 'Download PDF'}
        </button>
        <select value={status} onChange={e => setStatus(e.target.value)} style={{ background:'#192035', border:'1px solid rgba(255,255,255,0.12)', color:'#EEF0F5', fontSize:'.82rem', padding:'8px 12px', cursor:'pointer', outline:'none', fontFamily:'Inter,sans-serif' }}>
          {['draft','sent','negotiating','won','lost'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Title */}
      <div style={{ background:'#141929', border:'1px solid rgba(255,255,255,0.07)', padding:'20px 24px', marginBottom:12 }}>
        <div style={{ position:'relative', top:0, left:0, right:0, height:2, background:'#F26419', marginBottom:12 }} />
        <div style={{ marginBottom:14 }}>
          {fieldLabel('Proposal Title')}
          <input value={title} onChange={e => setTitle(e.target.value)} style={{ width:'100%', background:'#192035', border:'1px solid rgba(255,255,255,0.07)', color:'#EEF0F5', fontFamily:'Outfit,sans-serif', fontSize:'1rem', fontWeight:700, padding:'9px 12px', outline:'none' }} />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div>
            {fieldLabel('Valid Until')}
            <input type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} style={{ width:'100%', background:'#192035', border:'1px solid rgba(255,255,255,0.07)', color:'#EEF0F5', fontFamily:'Inter,sans-serif', fontSize:'.85rem', padding:'9px 12px', outline:'none' }} />
          </div>
        </div>
      </div>

      {/* Scope */}
      <div style={{ background:'#141929', border:'1px solid rgba(255,255,255,0.07)', padding:'20px 24px', marginBottom:12 }}>
        <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'1rem', fontWeight:700, color:'#fff', marginBottom:12, paddingBottom:8, borderBottom:'1px solid rgba(255,255,255,0.07)' }}>Scope of Work</div>
        {fieldLabel('Scope Summary')}
        <TA value={scope} onChange={e => setScope(e.target.value)} rows={5} placeholder="Describe the overall scope and objectives of this engagement..." />
      </div>

      {/* Deliverables */}
      <div style={{ background:'#141929', border:'1px solid rgba(255,255,255,0.07)', padding:'20px 24px', marginBottom:12 }}>
        <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'1rem', fontWeight:700, color:'#fff', marginBottom:12, paddingBottom:8, borderBottom:'1px solid rgba(255,255,255,0.07)' }}>Deliverables</div>
        {fieldLabel('What the client receives')}
        <TA value={deliverables} onChange={e => setDeliverables(e.target.value)} rows={6} placeholder="List all deliverables, milestones, and what is included in this proposal..." />
      </div>

      {/* Timeline */}
      <div style={{ background:'#141929', border:'1px solid rgba(255,255,255,0.07)', padding:'20px 24px', marginBottom:12 }}>
        <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'1rem', fontWeight:700, color:'#fff', marginBottom:12, paddingBottom:8, borderBottom:'1px solid rgba(255,255,255,0.07)' }}>Timeline</div>
        {fieldLabel('Project timeline and key milestones')}
        <TA value={timeline} onChange={e => setTimeline(e.target.value)} rows={4} placeholder="e.g. Week 1-2: Discovery and brief. Week 3-4: Design concepts..." />
      </div>

      {/* Pricing */}
      <div style={{ background:'#141929', border:'1px solid rgba(255,255,255,0.07)', padding:'20px 24px', marginBottom:12 }}>
        <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'1rem', fontWeight:700, color:'#fff', marginBottom:12, paddingBottom:8, borderBottom:'1px solid rgba(255,255,255,0.07)' }}>Investment</div>
        {pricing.map((item, i) => (
          <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 120px 120px 32px', gap:8, marginBottom:8, alignItems:'center' }}>
            <input value={item.description} onChange={e => updatePricingRow(i,'description',e.target.value)} placeholder="Description" style={{ background:'#192035', border:'1px solid rgba(255,255,255,0.07)', color:'#EEF0F5', fontFamily:'Inter,sans-serif', fontSize:'.82rem', padding:'8px 10px', outline:'none' }} />
            <input type="number" value={item.amount} onChange={e => updatePricingRow(i,'amount',Number(e.target.value))} style={{ background:'#192035', border:'1px solid rgba(255,255,255,0.07)', color:'#EEF0F5', fontFamily:'Inter,sans-serif', fontSize:'.82rem', padding:'8px 10px', outline:'none' }} />
            <select value={item.type} onChange={e => updatePricingRow(i,'type',e.target.value)} style={{ background:'#192035', border:'1px solid rgba(255,255,255,0.07)', color:'#EEF0F5', fontSize:'.78rem', padding:'8px 8px', outline:'none', cursor:'pointer' }}>
              <option value="one_off">One-off</option>
              <option value="monthly">Monthly</option>
              <option value="retainer">Retainer</option>
            </select>
            <button onClick={() => removePricingRow(i)} style={{ background:'rgba(239,68,68,0.1)', border:'none', color:'#EF4444', cursor:'pointer', padding:'8px', fontSize:'.82rem' }}>✕</button>
          </div>
        ))}
        <button onClick={addPricingRow} style={{ padding:'7px 14px', background:'transparent', border:'1px dashed rgba(255,255,255,0.15)', color:'#6B7794', fontSize:'.78rem', cursor:'pointer', marginTop:4 }}>+ Add line item</button>
        <div style={{ display:'flex', justifyContent:'flex-end', marginTop:12, paddingTop:12, borderTop:'1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ fontFamily:'Outfit,sans-serif', fontSize:'1.1rem', fontWeight:700, color:'#22C55E' }}>Total: {fmtFull$(totalValue)}</span>
        </div>
      </div>

      {/* Terms */}
      <div style={{ background:'#141929', border:'1px solid rgba(255,255,255,0.07)', padding:'20px 24px' }}>
        <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'1rem', fontWeight:700, color:'#fff', marginBottom:12, paddingBottom:8, borderBottom:'1px solid rgba(255,255,255,0.07)' }}>Terms and Conditions</div>
        <TA value={terms} onChange={e => setTerms(e.target.value)} rows={5} placeholder="Payment terms, intellectual property, revisions policy, etc..." />
      </div>
    </div>
  )
}
