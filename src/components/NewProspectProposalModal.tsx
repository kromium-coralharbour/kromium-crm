'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { FORM_TYPE_TO_SERVICE, SERVICE_LABELS, ServiceType } from '@/lib/proposal-sections'

// ── Style tokens ──────────────────────────────────────────────────────────────
const inp: React.CSSProperties = { width:'100%', background:'#192035', border:'1px solid rgba(255,255,255,0.1)', color:'#EEF0F5', fontFamily:'Inter,sans-serif', fontSize:'.85rem', padding:'9px 12px', outline:'none' }
const sel: React.CSSProperties = { ...inp, cursor:'pointer', appearance:'none' } as React.CSSProperties
const lbl: React.CSSProperties = { display:'block', fontSize:'.68rem', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'#9AA0B8', marginBottom:6 }
const g2: React.CSSProperties = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }
const mb: React.CSSProperties = { marginBottom:14 }

const COUNTRIES = ['Barbados','Jamaica','Cayman Islands','Bahamas','Trinidad and Tobago','British Virgin Islands','Antigua and Barbuda','Saint Lucia','Grenada','Dominica','Saint Kitts and Nevis','Turks and Caicos','US Virgin Islands','Haiti','Other / Outside Caribbean']
const INDUSTRIES = ['Real Estate','Construction and Development','Hospitality and Tourism','Professional Services','Retail or E-commerce','Healthcare or Wellness','Other']

const SERVICE_TYPES: { value: ServiceType; label: string }[] = [
  { value: 'marketing',        label: 'Social Media and Marketing' },
  { value: 'custom-crm',      label: 'Custom CRM and Business Intelligence' },
  { value: 'website',         label: 'Website and Digital Infrastructure' },
  { value: 'brand',           label: 'Brand and Identity' },
  { value: 'seo',             label: 'Search Engine Optimisation (SEO)' },
  { value: 'paid-advertising',label: 'Paid Advertising' },
  { value: 'retainer',        label: 'Business Optimisation Retainer' },
  { value: 'full-ecosystem',  label: 'Full Digital Ecosystem' },
]

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={mb}><label style={lbl}>{label}</label>{children}</div>
}

function CheckList({ label, name, value, onChange, options }: {
  label: string; name: string; value: string[]; onChange: (v: string[]) => void
  options: { value: string; label: string }[]
}) {
  function toggle(v: string) {
    onChange(value.includes(v) ? value.filter(x => x !== v) : [...value, v])
  }
  return (
    <div style={mb}>
      <label style={lbl}>{label}</label>
      <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
        {options.map(o => {
          const on = value.includes(o.value)
          return (
            <button type="button" key={o.value} onClick={() => toggle(o.value)} style={{
              padding:'5px 11px', fontSize:'.78rem', cursor:'pointer',
              background: on ? 'rgba(242,100,25,0.15)' : '#192035',
              border:     on ? '1px solid #F26419'      : '1px solid rgba(255,255,255,0.1)',
              color:      on ? '#F26419'                : '#9AA0B8',
            }}>{o.label}</button>
          )
        })}
      </div>
    </div>
  )
}

// ── Service-specific form fields ──────────────────────────────────────────────
function ServiceFields({ serviceType, data, setData, arrays, setArrays }: {
  serviceType: ServiceType; data: Record<string,string>
  setData: (k: string, v: string) => void
  arrays: Record<string,string[]>
  setArrays: (k: string, v: string[]) => void
}) {
  const set = setData
  const sa  = setArrays

  if (serviceType === 'marketing') return (
    <>
      <CheckList label="Services Needed" name="services" value={arrays.services||[]} onChange={v=>sa('services',v)} options={[
        {value:'social',label:'Social media management'},{value:'paid_ads',label:'Paid advertising'},
        {value:'content',label:'Content creation'},{value:'email',label:'Email marketing'},
        {value:'seo',label:'SEO'},{value:'full',label:'Full programme'},
      ]} />
      <div style={g2}>
        <F label="Primary Goal"><select style={sel} value={data.goal||''} onChange={e=>set('goal',e.target.value)}>
          <option value="">Select</option>
          <option value="leads">Generate more leads</option><option value="awareness">Build brand awareness</option>
          <option value="retention">Retain and re-engage clients</option><option value="launch">Launch a product or service</option>
        </select></F>
        <F label="Current Monthly Spend"><select style={sel} value={data.current_spend||''} onChange={e=>set('current_spend',e.target.value)}>
          <option value="">Select</option><option value="none">Nothing currently</option>
          <option value="under1k">Under $1,000</option><option value="1k-3k">$1,000 to $3,000</option>
          <option value="3k-7k">$3,000 to $7,000</option><option value="7k+">$7,000 or more</option>
        </select></F>
      </div>
      <F label="Target Monthly Budget (USD)"><input style={inp} type="number" value={data.budget||''} onChange={e=>set('budget',e.target.value)} placeholder="e.g. 3000" /></F>
    </>
  )

  if (serviceType === 'custom-crm') return (
    <>
      <CheckList label="Pain Points" name="pain" value={arrays.pain||[]} onChange={v=>sa('pain',v)} options={[
        {value:'leads',label:'Missing or losing leads'},{value:'pipeline',label:'No pipeline visibility'},
        {value:'reporting',label:'No reporting'},{value:'tools',label:'Too many disconnected tools'},
        {value:'followup',label:'Inconsistent follow-up'},{value:'automation',label:'No automation'},
      ]} />
      <CheckList label="Features Needed" name="features" value={arrays.features||[]} onChange={v=>sa('features',v)} options={[
        {value:'contacts',label:'Contact management'},{value:'pipeline',label:'Pipeline / kanban'},
        {value:'automation',label:'Automation'},{value:'reporting',label:'Reporting'},
        {value:'website',label:'Website lead capture'},{value:'mobile',label:'Mobile access'},
        {value:'invoicing',label:'Invoicing'},{value:'integrations',label:'Integrations'},
      ]} />
      <div style={g2}>
        <F label="Team Size"><select style={sel} value={data.team_size||''} onChange={e=>set('team_size',e.target.value)}>
          <option value="">Select</option><option value="1">Just me</option><option value="2-5">2 to 5</option>
          <option value="6-15">6 to 15</option><option value="16+">16 or more</option>
        </select></F>
        <F label="Budget Range"><select style={sel} value={data.budget_range||''} onChange={e=>set('budget_range',e.target.value)}>
          <option value="">Select</option><option value="under5k">Under $5,000</option>
          <option value="5-15k">$5,000 to $15,000</option><option value="15-30k">$15,000 to $30,000</option>
          <option value="30-60k">$30,000 to $60,000</option><option value="60k+">$60,000 or more</option>
        </select></F>
      </div>
      <F label="Business Context"><textarea style={{...inp,resize:'vertical',minHeight:80}} value={data.business_context||''} onChange={e=>set('business_context',e.target.value)} placeholder="What does the business do, how does it operate, what are the main challenges?" /></F>
    </>
  )

  if (serviceType === 'website') return (
    <>
      <div style={g2}>
        <F label="Project Type"><select style={sel} value={data.project_type||''} onChange={e=>set('project_type',e.target.value)}>
          <option value="">Select</option><option value="new_site">New website</option>
          <option value="redesign">Redesign</option><option value="rebuild">Rebuild</option>
          <option value="seo_audit">SEO audit only</option>
        </select></F>
        <F label="Primary Goal"><select style={sel} value={data.goal||''} onChange={e=>set('goal',e.target.value)}>
          <option value="">Select</option><option value="leads">Generate enquiries and leads</option>
          <option value="bookings">Take direct bookings</option><option value="showcase">Showcase work</option>
          <option value="ecommerce">Sell products online</option><option value="crm">Feed leads into a CRM</option>
        </select></F>
      </div>
      <F label="Current Website URL (if any)"><input style={inp} value={data.current_url||''} onChange={e=>set('current_url',e.target.value)} placeholder="https://" /></F>
      <div style={g2}>
        <F label="Page Count"><select style={sel} value={data.page_count||''} onChange={e=>set('page_count',e.target.value)}>
          <option value="">Select</option><option value="1-5">1 to 5 pages</option>
          <option value="6-10">6 to 10</option><option value="11-20">11 to 20</option><option value="20+">20+</option>
        </select></F>
        <F label="Budget (USD)"><input style={inp} type="number" value={data.budget||''} onChange={e=>set('budget',e.target.value)} placeholder="e.g. 8000" /></F>
      </div>
      <F label="Project Description"><textarea style={{...inp,resize:'vertical',minHeight:80}} value={data.description||''} onChange={e=>set('description',e.target.value)} placeholder="What does the site need to achieve?" /></F>
    </>
  )

  if (serviceType === 'brand') return (
    <>
      <div style={g2}>
        <F label="Brand Stage">
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            {[{v:'new',l:'New brand'},{v:'refresh',l:'Refresh'},{v:'rebrand',l:'Full rebrand'},{v:'extend',l:'Extend system'}].map(o=>(
              <button type="button" key={o.v} onClick={()=>set('brand_stage',o.v)} style={{padding:'5px 11px',fontSize:'.78rem',cursor:'pointer',background:data.brand_stage===o.v?'rgba(242,100,25,0.15)':'#192035',border:data.brand_stage===o.v?'1px solid #F26419':'1px solid rgba(255,255,255,0.1)',color:data.brand_stage===o.v?'#F26419':'#9AA0B8'}}>{o.l}</button>
            ))}
          </div>
        </F>
        <F label="Budget (USD)"><input style={inp} type="number" value={data.budget||''} onChange={e=>set('budget',e.target.value)} placeholder="e.g. 8000" /></F>
      </div>
      <CheckList label="Deliverables Needed" name="deliverables" value={arrays.deliverables||[]} onChange={v=>sa('deliverables',v)} options={[
        {value:'logo',label:'Logo'},{value:'colours',label:'Colour palette'},{value:'typography',label:'Typography'},
        {value:'guidelines',label:'Brand guidelines'},{value:'stationery',label:'Stationery'},
        {value:'social',label:'Social templates'},{value:'signage',label:'Signage'},{value:'naming',label:'Naming / tagline'},
      ]} />
      <F label="Target Audience"><textarea style={{...inp,resize:'vertical',minHeight:64}} value={data.audience||''} onChange={e=>set('audience',e.target.value)} placeholder="Who is the brand targeting? What do they value?" /></F>
    </>
  )

  // Default / other service types
  return (
    <F label="Project Context and Goals"><textarea style={{...inp,resize:'vertical',minHeight:120}} value={data.business_context||''} onChange={e=>set('business_context',e.target.value)} placeholder="Describe what the client needs, their goals, any specific requirements, budget indications, and context from your conversation with them..." /></F>
  )
}

// ── Main Modal ────────────────────────────────────────────────────────────────
interface Props { open: boolean; onClose: () => void }

export default function NewProspectProposalModal({ open, onClose }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [serviceType, setServiceType] = useState<ServiceType>('marketing')
  const [step, setStep] = useState<'type' | 'prospect' | 'details'>('type')

  // Prospect info
  const [prospect, setProspect] = useState({
    first_name:'', last_name:'', email:'', phone:'', company:'',
    country:'', industry:'', website:'', referral_source:'',
  })

  // Service-specific fields
  const [data,   setDataState]   = useState<Record<string,string>>({})
  const [arrays, setArraysState] = useState<Record<string,string[]>>({})

  // Proposal meta
  const [proposalTitle, setProposalTitle] = useState('')
  const [saving,        setSaving]        = useState(false)
  const [error,         setError]         = useState('')

  function setP(k: string, v: string) { setProspect(p => ({...p, [k]: v})) }
  function setData(k: string, v: string) { setDataState(p => ({...p, [k]: v})) }
  function setArrays(k: string, v: string[]) { setArraysState(p => ({...p, [k]: v})) }

  // Auto-generate title when service type or company changes
  function autoTitle() {
    const co = prospect.company || `${prospect.first_name} ${prospect.last_name}`.trim()
    return co ? `${co} - ${SERVICE_LABELS[serviceType]}` : SERVICE_LABELS[serviceType]
  }

  async function create() {
    if (!prospect.email) { setError('Email is required'); return }
    setSaving(true); setError('')
    try {
      // 1. Create a lead record
      const formData = { ...data, ...arrays, industry: prospect.industry, country: prospect.country }
      const { data: lead, error: leadErr } = await supabase.from('leads').insert({
        first_name:      prospect.first_name,
        last_name:       prospect.last_name || '',
        email:           prospect.email,
        phone:           prospect.phone || null,
        company:         prospect.company || null,
        country:         prospect.country || null,
        industry:        prospect.industry || null,
        website:         prospect.website || null,
        referral_source: prospect.referral_source || null,
        form_type:       'get-a-proposal',
        lead_score:      50,
        lead_tier:       'warm',
        status:          'new',
        form_data:       formData,
        score_breakdown: {},
        email_sent:      false,
      }).select().single()

      if (leadErr || !lead) throw new Error(leadErr?.message ?? 'Failed to create lead')

      // 2. Create the proposal
      const title = proposalTitle || autoTitle()
      const { data: proposal, error: propErr } = await supabase.from('proposals').insert({
        lead_id:       lead.id,
        title,
        status:        'draft',
        services:      [],
        scope:         '',
        deliverables:  '',
        timeline:      '',
        value:         0,
        terms:         '',
        pricing_breakdown: [],
        service_type:  serviceType,
        client_company: prospect.company || null,
        client_contact: `${prospect.first_name} ${prospect.last_name}`.trim(),
        sections:      [],
      }).select().single()

      if (propErr || !proposal) throw new Error(propErr?.message ?? 'Failed to create proposal')

      onClose()
      router.push(`/proposals/${proposal.id}`)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background:'#141929', border:'1px solid rgba(255,255,255,0.1)', width:'100%', maxWidth:660, maxHeight:'94vh', overflowY:'auto' }}>

        {/* Header */}
        <div style={{ position:'sticky', top:0, background:'#141929', zIndex:1, padding:'18px 24px 14px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'1.05rem', fontWeight:700, color:'#fff' }}>New Proposal for a Prospect</div>
            <div style={{ fontSize:'.72rem', color:'#F26419', marginTop:2 }}>
              {step === 'type' ? 'Step 1: Select service type' : step === 'prospect' ? 'Step 2: Prospect details' : 'Step 3: Project details'}
            </div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#9AA0B8', cursor:'pointer', fontSize:20 }}>x</button>
        </div>

        <div style={{ padding:'20px 24px' }}>

          {/* Step 1: Service type */}
          {step === 'type' && (
            <>
              <div style={{ fontSize:'.82rem', color:'#9AA0B8', marginBottom:16 }}>
                What type of proposal is this? The section template and AI generation will be tailored to the selected service.
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:24 }}>
                {SERVICE_TYPES.map(st => (
                  <button type="button" key={st.value} onClick={() => setServiceType(st.value)} style={{
                    padding:'12px 14px', fontSize:'.82rem', fontWeight:600, cursor:'pointer', textAlign:'left',
                    background: serviceType === st.value ? 'rgba(242,100,25,0.15)' : '#192035',
                    border:     serviceType === st.value ? '1px solid #F26419'      : '1px solid rgba(255,255,255,0.1)',
                    color:      serviceType === st.value ? '#F26419'                : '#9AA0B8',
                  }}>
                    {st.label}
                  </button>
                ))}
              </div>
              <div style={{ display:'flex', justifyContent:'flex-end' }}>
                <button onClick={() => setStep('prospect')} style={{ padding:'9px 24px', background:'#F26419', color:'#fff', border:'none', fontFamily:'Outfit,sans-serif', fontSize:'.85rem', fontWeight:700, cursor:'pointer', clipPath:'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)' }}>
                  Next: Prospect Details
                </button>
              </div>
            </>
          )}

          {/* Step 2: Prospect info */}
          {step === 'prospect' && (
            <>
              <div style={{ background:'rgba(242,100,25,0.06)', border:'1px solid rgba(242,100,25,0.2)', padding:'10px 14px', marginBottom:20, fontSize:'.78rem', color:'#9AA0B8' }}>
                This prospect will be added as a lead in the CRM and linked to the proposal. You can find them in Enquiries after.
              </div>
              <div style={g2}>
                <F label="First Name *"><input style={inp} value={prospect.first_name} onChange={e=>setP('first_name',e.target.value)} placeholder="First name" /></F>
                <F label="Last Name"><input style={inp} value={prospect.last_name} onChange={e=>setP('last_name',e.target.value)} placeholder="Last name" /></F>
              </div>
              <F label="Email *"><input style={inp} type="email" value={prospect.email} onChange={e=>setP('email',e.target.value)} placeholder="email@company.com" /></F>
              <div style={g2}>
                <F label="Phone"><input style={inp} value={prospect.phone} onChange={e=>setP('phone',e.target.value)} placeholder="+1 246 000 0000" /></F>
                <F label="Company"><input style={inp} value={prospect.company} onChange={e=>setP('company',e.target.value)} placeholder="Company name" /></F>
              </div>
              <div style={g2}>
                <F label="Country"><select style={sel} value={prospect.country} onChange={e=>setP('country',e.target.value)}>
                  <option value="">Select country</option>
                  {COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select></F>
                <F label="Industry"><select style={sel} value={prospect.industry} onChange={e=>setP('industry',e.target.value)}>
                  <option value="">Select industry</option>
                  {INDUSTRIES.map(i=><option key={i} value={i}>{i}</option>)}
                </select></F>
              </div>
              <div style={g2}>
                <F label="Website"><input style={inp} value={prospect.website} onChange={e=>setP('website',e.target.value)} placeholder="https://" /></F>
                <F label="How did they find us?"><select style={sel} value={prospect.referral_source} onChange={e=>setP('referral_source',e.target.value)}>
                  <option value="">Select source</option>
                  <option value="instagram">Instagram</option><option value="linkedin">LinkedIn</option>
                  <option value="google">Google Search</option><option value="friend">Referral</option>
                  <option value="existing_client">Existing client</option><option value="event">Event</option>
                  <option value="other">Other</option>
                </select></F>
              </div>
              <div style={{ display:'flex', gap:8, justifyContent:'space-between', paddingTop:8 }}>
                <button onClick={() => setStep('type')} style={{ padding:'9px 18px', background:'transparent', border:'1px solid rgba(255,255,255,0.12)', color:'#9AA0B8', cursor:'pointer', fontFamily:'Inter,sans-serif', fontSize:'.82rem' }}>Back</button>
                <button onClick={() => { if (!prospect.email) { setError('Email is required'); return; } setError(''); setStep('details') }} style={{ padding:'9px 24px', background:'#F26419', color:'#fff', border:'none', fontFamily:'Outfit,sans-serif', fontSize:'.85rem', fontWeight:700, cursor:'pointer', clipPath:'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)' }}>
                  Next: Project Details
                </button>
              </div>
              {error && <div style={{ color:'#EF4444', fontSize:'.82rem', marginTop:8 }}>{error}</div>}
            </>
          )}

          {/* Step 3: Project details */}
          {step === 'details' && (
            <>
              <F label="Proposal Title">
                <input style={inp} value={proposalTitle} onChange={e=>setProposalTitle(e.target.value)} placeholder={autoTitle()} />
              </F>
              <div style={{ fontSize:'.68rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#F26419', marginBottom:12, marginTop:8, paddingBottom:6, borderBottom:'1px solid rgba(242,100,25,0.2)' }}>
                {SERVICE_LABELS[serviceType]} Details
              </div>
              <ServiceFields serviceType={serviceType} data={data} setData={setData} arrays={arrays} setArrays={setArrays} />

              {error && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'#EF4444', padding:'10px 14px', fontSize:'.82rem', marginBottom:14 }}>{error}</div>}

              <div style={{ display:'flex', gap:8, justifyContent:'space-between', paddingTop:8, borderTop:'1px solid rgba(255,255,255,0.07)', marginTop:8 }}>
                <button onClick={() => { setError(''); setStep('prospect') }} style={{ padding:'9px 18px', background:'transparent', border:'1px solid rgba(255,255,255,0.12)', color:'#9AA0B8', cursor:'pointer', fontFamily:'Inter,sans-serif', fontSize:'.82rem' }}>Back</button>
                <button onClick={create} disabled={saving} style={{ padding:'10px 28px', background:saving?'#333':'#F26419', color:'#fff', border:'none', fontFamily:'Outfit,sans-serif', fontSize:'.88rem', fontWeight:700, cursor:saving?'not-allowed':'pointer', clipPath:'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)' }}>
                  {saving ? 'Creating...' : 'Create Proposal Draft'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
