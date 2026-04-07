'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Props {
  open: boolean
  onClose: () => void
}

const COUNTRIES = [
  'Barbados','Jamaica','Cayman Islands','Bahamas','Trinidad and Tobago',
  'British Virgin Islands','Antigua and Barbuda','Saint Lucia','Grenada',
  'Dominica','Saint Kitts and Nevis','Turks and Caicos','US Virgin Islands',
  'Haiti','Other',
]

const INDUSTRIES = [
  'Real Estate','Construction and Development','Hospitality and Tourism',
  'Professional Services','Retail','Healthcare or Wellness','Other',
]

const FORMS = [
  'get-a-custom-crm-quote','start-a-website-project','start-a-brand-project',
  'get-a-marketing-proposal','discuss-a-retainer','book-a-discovery-call','get-a-proposal',
]

const inp: React.CSSProperties = {
  width:'100%', background:'#192035', border:'1px solid rgba(255,255,255,0.1)',
  color:'#EEF0F5', fontFamily:'Inter,sans-serif', fontSize:'.85rem',
  padding:'9px 12px', outline:'none',
}
const lbl: React.CSSProperties = {
  display:'block', fontSize:'.68rem', fontWeight:600, letterSpacing:'.08em',
  textTransform:'uppercase', color:'#9AA0B8', marginBottom:6,
}

export default function NewLeadModal({ open, onClose }: Props) {
  const [form, setForm] = useState({
    first_name:'', last_name:'', email:'', phone:'', company:'',
    country:'', industry:'', form_type:'get-a-custom-crm-quote',
  })
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')
  const router = useRouter()

  function set(k: string, v: string) { setForm(p => ({ ...p, [k]: v })) }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/leads', {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({ ...form, manual_entry: true }),
      })
      if (!res.ok) { const b = await res.json(); throw new Error(b.error ?? 'Failed') }
      const { lead_id } = await res.json()
      onClose()
      router.push(`/enquiries/${lead_id}`)
      router.refresh()
    } catch(err: any) { setError(err.message); setSaving(false) }
  }

  if (!open) return null

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ background:'#141929', border:'1px solid rgba(255,255,255,0.1)', width:'100%', maxWidth:520, maxHeight:'90vh', overflowY:'auto', position:'relative' }}>
        <div style={{ position:'sticky', top:0, background:'#141929', padding:'20px 24px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'1.1rem', fontWeight:700, color:'#fff' }}>New Lead</div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#9AA0B8', cursor:'pointer', fontSize:18 }}>✕</button>
        </div>
        <form onSubmit={submit} style={{ padding:'20px 24px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
            <div><label style={lbl}>First Name *</label><input required style={inp} value={form.first_name} onChange={e=>set('first_name',e.target.value)} placeholder="First name" /></div>
            <div><label style={lbl}>Last Name</label><input style={inp} value={form.last_name} onChange={e=>set('last_name',e.target.value)} placeholder="Last name" /></div>
          </div>
          <div style={{ marginBottom:14 }}><label style={lbl}>Email *</label><input required type="email" style={inp} value={form.email} onChange={e=>set('email',e.target.value)} placeholder="email@company.com" /></div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
            <div><label style={lbl}>Phone</label><input style={inp} value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="+1 246 000 0000" /></div>
            <div><label style={lbl}>Company</label><input style={inp} value={form.company} onChange={e=>set('company',e.target.value)} placeholder="Company name" /></div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
            <div>
              <label style={lbl}>Country</label>
              <select style={{ ...inp, cursor:'pointer', appearance:'none' }} value={form.country} onChange={e=>set('country',e.target.value)}>
                <option value="">Select country</option>
                {COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Industry</label>
              <select style={{ ...inp, cursor:'pointer', appearance:'none' }} value={form.industry} onChange={e=>set('industry',e.target.value)}>
                <option value="">Select industry</option>
                {INDUSTRIES.map(i=><option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={lbl}>Form / Enquiry Type</label>
            <select style={{ ...inp, cursor:'pointer', appearance:'none' }} value={form.form_type} onChange={e=>set('form_type',e.target.value)}>
              {FORMS.map(f=><option key={f} value={f}>{f.replace(/-/g,' ')}</option>)}
            </select>
          </div>
          {error && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'#EF4444', padding:'10px 14px', fontSize:'.82rem', marginBottom:16 }}>{error}</div>}
          <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding:'9px 20px', background:'transparent', border:'1px solid rgba(255,255,255,0.12)', color:'#9AA0B8', cursor:'pointer', fontFamily:'Outfit,sans-serif', fontSize:'.82rem' }}>Cancel</button>
            <button type="submit" disabled={saving} style={{ padding:'9px 24px', background: saving?'#333':'#F26419', color:'#fff', border:'none', cursor: saving?'not-allowed':'pointer', fontFamily:'Outfit,sans-serif', fontSize:'.85rem', fontWeight:700, clipPath:'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)' }}>
              {saving ? 'Creating...' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
