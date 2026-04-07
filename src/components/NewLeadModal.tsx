'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props { open: boolean; onClose: () => void }

// ── Shared style tokens ───────────────────────────────────────────────────────
const S = {
  inp: { width:'100%', background:'#192035', border:'1px solid rgba(255,255,255,0.12)', color:'#EEF0F5', fontFamily:'Inter,sans-serif', fontSize:'.85rem', padding:'9px 12px', outline:'none' } as React.CSSProperties,
  sel: { width:'100%', background:'#192035', border:'1px solid rgba(255,255,255,0.12)', color:'#EEF0F5', fontFamily:'Inter,sans-serif', fontSize:'.85rem', padding:'9px 12px', outline:'none', cursor:'pointer', appearance:'none' } as React.CSSProperties,
  tea: { width:'100%', background:'#192035', border:'1px solid rgba(255,255,255,0.12)', color:'#EEF0F5', fontFamily:'Inter,sans-serif', fontSize:'.85rem', padding:'9px 12px', outline:'none', resize:'vertical', minHeight:72 } as React.CSSProperties,
  lbl: { display:'block', fontSize:'.68rem', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'#9AA0B8', marginBottom:5 } as React.CSSProperties,
  sec: { fontSize:'.68rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#F26419', margin:'18px 0 10px', paddingBottom:6, borderBottom:'1px solid rgba(242,100,25,0.2)' } as React.CSSProperties,
  row: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 } as React.CSSProperties,
  f:   { marginBottom:12 } as React.CSSProperties,
}

// ── Static data ───────────────────────────────────────────────────────────────
const COUNTRIES = [
  ['barbados','Barbados'],['jamaica','Jamaica'],['cayman_islands','Cayman Islands'],
  ['bahamas','Bahamas'],['trinidad','Trinidad and Tobago'],['bvi','British Virgin Islands'],
  ['antigua','Antigua and Barbuda'],['saint_lucia','Saint Lucia'],['grenada','Grenada'],
  ['dominica','Dominica'],['saint_kitts','Saint Kitts and Nevis'],['turks','Turks and Caicos'],
  ['usvi','US Virgin Islands'],['haiti','Haiti'],['other','Other'],
]
const INDUSTRIES = [
  ['real_estate','Real Estate'],['construction','Construction & Development'],
  ['hospitality','Hospitality & Tourism'],['professional','Professional Services'],
  ['retail','Retail'],['healthcare','Healthcare & Wellness'],['restaurant','Restaurant & F&B'],['other','Other'],
]
const REFERRAL = [
  ['instagram','Instagram'],['facebook','Facebook'],['google','Google Search'],
  ['linkedin','LinkedIn'],['friend','Friend / Colleague'],['existing_client','Existing Client Referral'],
  ['event','Event / Conference'],['press','Press / Media'],['other','Other'],
]
const FORM_TYPES = [
  { value:'get-a-custom-crm-quote',   label:'Custom CRM Quote' },
  { value:'start-a-website-project',  label:'Website & SEO' },
  { value:'start-a-brand-project',    label:'Brand & Identity' },
  { value:'get-a-marketing-proposal', label:'Marketing Proposal' },
  { value:'discuss-a-retainer',       label:'Business Optimisation' },
  { value:'book-a-discovery-call',    label:'Discovery Call' },
  { value:'get-a-proposal',           label:'Get a Proposal' },
]

// ── Reusable field primitives ─────────────────────────────────────────────────
function F({ label, children }: { label:string; children:React.ReactNode }) {
  return <div style={S.f}><label style={S.lbl}>{label}</label>{children}</div>
}
function Row({ children }: { children:React.ReactNode }) {
  return <div style={S.row}>{children}</div>
}
function Sec({ children }: { children:React.ReactNode }) {
  return <div style={S.sec}>{children}</div>
}
function Sel({ name, value, onChange, options, placeholder='Select...' }: {
  name:string; value:string; onChange:(v:string)=>void;
  options:[string,string][]; placeholder?:string;
}) {
  return (
    <select style={S.sel} value={value} onChange={e=>onChange(e.target.value)}>
      <option value="">{placeholder}</option>
      {options.map(([v,l])=><option key={v} value={v}>{l}</option>)}
    </select>
  )
}
function Inp({ value, onChange, placeholder, type='text' }: {
  value:string; onChange:(v:string)=>void; placeholder?:string; type?:string;
}) {
  return <input type={type} style={S.inp} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} />
}
function Tea({ value, onChange, placeholder, rows=3 }: {
  value:string; onChange:(v:string)=>void; placeholder?:string; rows?:number;
}) {
  return <textarea style={{...S.tea, minHeight: rows*24}} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} />
}
function Checks({ values, onChange, options }: {
  values:string[]; onChange:(v:string[])=>void; options:[string,string][];
}) {
  function toggle(v:string) {
    onChange(values.includes(v) ? values.filter(x=>x!==v) : [...values,v])
  }
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:2 }}>
      {options.map(([v,l]) => {
        const on = values.includes(v)
        return (
          <button key={v} type="button" onClick={()=>toggle(v)} style={{
            padding:'5px 10px', fontSize:'.76rem', fontWeight:600, cursor:'pointer',
            background: on ? 'rgba(242,100,25,0.15)' : '#192035',
            border:     on ? '1px solid #F26419'      : '1px solid rgba(255,255,255,0.12)',
            color:      on ? '#F26419'                : '#9AA0B8',
            transition:'all .15s',
          }}>{l}</button>
        )
      })}
    </div>
  )
}
function Radios({ value, onChange, options }: {
  value:string; onChange:(v:string)=>void; options:[string,string][];
}) {
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:2 }}>
      {options.map(([v,l]) => {
        const on = value === v
        return (
          <button key={v} type="button" onClick={()=>onChange(v)} style={{
            padding:'5px 10px', fontSize:'.76rem', fontWeight:600, cursor:'pointer',
            background: on ? 'rgba(242,100,25,0.15)' : '#192035',
            border:     on ? '1px solid #F26419'      : '1px solid rgba(255,255,255,0.12)',
            color:      on ? '#F26419'                : '#9AA0B8',
            transition:'all .15s',
          }}>{l}</button>
        )
      })}
    </div>
  )
}
function Slider({ value, onChange, min, max, step=500, prefix='$' }: {
  value:number; onChange:(v:number)=>void; min:number; max:number; step?:number; prefix?:string;
}) {
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.78rem', color:'#EEF0F5', marginBottom:6 }}>
        <span style={{ fontWeight:700, color:'#F26419' }}>{prefix}{value.toLocaleString()}</span>
        <span style={{ color:'#6B7794' }}>{prefix}{min.toLocaleString()} – {prefix}{max.toLocaleString()}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e=>onChange(Number(e.target.value))}
        style={{ width:'100%', accentColor:'#F26419' }}
      />
    </div>
  )
}

// ── Form-type field blocks — exact mirror of website forms ────────────────────

function CRMFields({ d, set }: { d:any; set:(k:string,v:any)=>void }) {
  return (
    <>
      <Sec>About Your Business</Sec>
      <Row>
        <F label="Country">
          <Sel name="country" value={d.country??''} onChange={v=>set('country',v)} options={COUNTRIES as [string,string][]} />
        </F>
        <F label="Industry">
          <Sel name="industry" value={d.industry??''} onChange={v=>set('industry',v)}
            options={[['real_estate','Real Estate'],['construction','Construction'],['hospitality','Hospitality'],['professional','Professional Services'],['retail','Retail'],['other','Other']]}
          />
        </F>
      </Row>
      <F label="Business Context">
        <Tea value={d.business_context??''} onChange={v=>set('business_context',v)} placeholder="What you do, who you serve, how many clients or projects you typically manage" rows={3} />
      </F>

      <Sec>Pain Points</Sec>
      <F label="What's costing you the most right now?">
        <Checks values={d.pain??[]} onChange={v=>set('pain',v)} options={[
          ['leads','Missing or losing leads'],['pipeline','No pipeline visibility'],
          ['reporting','No reporting'],['tools','Too many disconnected tools'],
          ['followup','Inconsistent follow-up'],['automation','No automation'],
        ]} />
      </F>

      <Sec>Features Needed</Sec>
      <F label="What does your CRM need to do?">
        <Checks values={d.features??[]} onChange={v=>set('features',v)} options={[
          ['contacts','Contact management'],['pipeline','Pipeline / kanban'],
          ['automation','Automation'],['reporting','Reporting & dashboards'],
          ['website','Website lead capture'],['mobile','Mobile access'],
          ['invoicing','Invoicing'],['integrations','Third-party integrations'],
        ]} />
      </F>

      <Sec>Budget & Timeline</Sec>
      <Row>
        <F label="Team Size">
          <Sel name="team_size" value={d.team_size??''} onChange={v=>set('team_size',v)}
            options={[['1','Solo / 1'],['2-5','2–5'],['6-15','6–15'],['16+','16+']]}
          />
        </F>
        <F label="Existing Tools">
          <Sel name="existing" value={d.existing??''} onChange={v=>set('existing',v)}
            options={[['none','None'],['spreadsheets','Spreadsheets'],['generic','Generic CRM'],['custom','Custom system']]}
          />
        </F>
      </Row>
      <Row>
        <F label="Timeline">
          <Sel name="timeline" value={d.timeline??''} onChange={v=>set('timeline',v)}
            options={[['asap','ASAP'],['1-3','1–3 months'],['3-6','3–6 months'],['exploring','Still exploring']]}
          />
        </F>
        <F label="Budget Type">
          <Sel name="budget_type" value={d.budget_type??''} onChange={v=>set('budget_type',v)}
            options={[['total','Total project budget'],['phased','Phased payments'],['unsure','Not sure']]}
          />
        </F>
      </Row>
      <F label="Budget Range">
        <Sel name="budget_range" value={d.budget_range??''} onChange={v=>set('budget_range',v)}
          options={[['under5k','Under $5,000'],['5-15k','$5,000–$15,000'],['15-30k','$15,000–$30,000'],['30-60k','$30,000–$60,000'],['60k+','$60,000+'],['unsure','Not sure']]}
        />
      </F>
    </>
  )
}

function WebsiteFields({ d, set }: { d:any; set:(k:string,v:any)=>void }) {
  return (
    <>
      <Sec>Project Type</Sec>
      <F label="What type of project is this?">
        <Radios value={d.project_type??''} onChange={v=>set('project_type',v)} options={[
          ['new_site','New website'],['redesign','Redesign'],['rebuild','Full rebuild'],
          ['seo_audit','SEO audit'],['landing','Landing page'],['both','Website + SEO'],
        ]} />
      </F>
      <Row>
        <F label="Country">
          <Sel name="country" value={d.country??''} onChange={v=>set('country',v)} options={COUNTRIES as [string,string][]} />
        </F>
        <F label="Current URL">
          <Inp value={d.current_url??''} onChange={v=>set('current_url',v)} placeholder="https://current-site.com" type="url" />
        </F>
      </Row>

      <Sec>Goals & Business</Sec>
      <F label="Industry">
        <Sel name="industry" value={d.industry??''} onChange={v=>set('industry',v)}
          options={[['real_estate','Real Estate'],['construction','Construction'],['hospitality','Hospitality'],['professional','Professional Services'],['retail','Retail'],['restaurant','Restaurant'],['healthcare','Healthcare'],['other','Other']]}
        />
      </F>
      <F label="Primary Goal">
        <Radios value={d.goal??''} onChange={v=>set('goal',v)} options={[
          ['leads','Generate leads'],['bookings','Take bookings'],['showcase','Showcase work'],
          ['ecommerce','Sell products'],['seo_rank','Rank on Google'],['crm','Connect to CRM'],
        ]} />
      </F>
      <F label="Business Description">
        <Tea value={d.description??''} onChange={v=>set('description',v)} placeholder="e.g. Luxury villa rental company targeting high-net-worth visitors to Barbados" />
      </F>

      <Sec>Content & Scope</Sec>
      <Row>
        <F label="Brand Status">
          <Sel name="brand_status" value={d.brand_status??''} onChange={v=>set('brand_status',v)}
            options={[['full','Full brand in place'],['partial','Partial brand'],['none','No brand yet']]}
          />
        </F>
        <F label="Page Count">
          <Sel name="page_count" value={d.page_count??''} onChange={v=>set('page_count',v)}
            options={[['1-5','1–5 pages'],['6-10','6–10 pages'],['11-20','11–20 pages'],['20+','20+ pages']]}
          />
        </F>
      </Row>
      <Row>
        <F label="Copy / Content">
          <Sel name="copy_status" value={d.copy_status??''} onChange={v=>set('copy_status',v)}
            options={[['ready','Ready to go'],['draft','Draft exists'],['none','Needs writing']]}
          />
        </F>
        <F label="Search Market">
          <Sel name="search_market" value={d.search_market??''} onChange={v=>set('search_market',v)}
            options={[['barbados','Barbados'],['caribbean','Caribbean'],['north_america','North America'],['uk','UK'],['international','International']]}
          />
        </F>
      </Row>
      <F label="Target Keywords">
        <Tea value={d.keywords??''} onChange={v=>set('keywords',v)} placeholder="e.g. Luxury villa Barbados, construction company Cayman Islands" rows={2} />
      </F>

      <Sec>Timeline & Budget</Sec>
      <F label="Timeline">
        <Sel name="timeline" value={d.timeline??''} onChange={v=>set('timeline',v)}
          options={[['asap','ASAP'],['1-2months','1–2 months'],['3months','3 months'],['flexible','Flexible']]}
        />
      </F>
      <F label={`Budget: $${(d.budget??10000).toLocaleString()}`}>
        <Slider value={d.budget??10000} onChange={v=>set('budget',v)} min={2000} max={50000} step={500} />
      </F>
      <F label="Additional Notes">
        <Tea value={d.notes??''} onChange={v=>set('notes',v)} placeholder="Special requirements, integrations, or questions" rows={2} />
      </F>
    </>
  )
}

function BrandFields({ d, set }: { d:any; set:(k:string,v:any)=>void }) {
  return (
    <>
      <Sec>Brand Stage</Sec>
      <F label="Country">
        <Sel name="country" value={d.country??''} onChange={v=>set('country',v)} options={COUNTRIES as [string,string][]} />
      </F>
      <F label="Where are you in your brand journey?">
        <Radios value={d.brand_stage??''} onChange={v=>set('brand_stage',v)} options={[
          ['new','New brand (starting fresh)'],['refresh','Refresh existing'],
          ['rebrand','Full rebrand'],['extend','Extend brand system'],
        ]} />
      </F>
      <F label="Business Description">
        <Tea value={d.business_desc??''} onChange={v=>set('business_desc',v)} placeholder="What you do, who you serve, what makes you different" />
      </F>

      <Sec>Deliverables</Sec>
      <F label="What do you need?">
        <Checks values={d.deliverables??[]} onChange={v=>set('deliverables',v)} options={[
          ['logo','Logo'],['colours','Colour palette'],['typography','Typography system'],
          ['guidelines','Brand guidelines'],['stationery','Stationery / cards'],
          ['social','Social templates'],['signage','Signage'],['naming','Naming / tagline'],
        ]} />
      </F>

      <Sec>Personality & Audience</Sec>
      <F label="Brand Personality">
        <Checks values={Array.isArray(d.personality) ? d.personality : (d.personality ? [d.personality] : [])}
          onChange={v=>set('personality', v.length===1?v[0]:v)} options={[
          ['premium','Premium & refined'],['bold','Bold & confident'],['friendly','Warm & friendly'],
          ['technical','Technical & precise'],['creative','Creative & playful'],['traditional','Traditional & established'],
        ]} />
      </F>
      <F label="Target Audience">
        <Tea value={d.audience??''} onChange={v=>set('audience',v)} placeholder="Describe your ideal client, their profession, values, what they care about" />
      </F>
      <F label="Style References">
        <Inp value={d.references??''} onChange={v=>set('references',v)} placeholder="Company names or URLs for style reference" />
      </F>

      <Sec>Timeline & Budget</Sec>
      <F label="Timeline">
        <Sel name="timeline" value={d.timeline??''} onChange={v=>set('timeline',v)}
          options={[['asap','ASAP'],['1month','1 month'],['2-3months','2–3 months'],['flexible','Flexible']]}
        />
      </F>
      <F label={`Budget: $${(d.budget??5000).toLocaleString()}`}>
        <Slider value={d.budget??5000} onChange={v=>set('budget',v)} min={1500} max={20000} step={250} />
      </F>
    </>
  )
}

function MarketingFields({ d, set }: { d:any; set:(k:string,v:any)=>void }) {
  return (
    <>
      <Sec>Services & Channels</Sec>
      <F label="Services Interested In">
        <Checks values={d.services??[]} onChange={v=>set('services',v)} options={[
          ['paid_ads','Paid Ads'],['social','Social Media'],['email','Email Marketing'],
          ['content','Content Marketing'],['seo','SEO'],['full','Full Programme'],
        ]} />
      </F>
      <F label="Ad Platforms">
        <Checks values={d.ad_platforms??[]} onChange={v=>set('ad_platforms',v)} options={[
          ['meta','Meta (FB/IG)'],['google','Google Ads'],['linkedin','LinkedIn Ads'],
        ]} />
      </F>
      <F label="Ads History">
        <Sel name="ads_history" value={d.ads_history??''} onChange={v=>set('ads_history',v)}
          options={[['none','Never run ads'],['self','Run them myself'],['agency','Used an agency'],['paused','Had them, paused']]}
        />
      </F>
      <F label="Ads Challenge / What Went Wrong">
        <Tea value={d.ads_challenge??''} onChange={v=>set('ads_challenge',v)} placeholder="e.g. Leads not converting, too expensive, wrong audience" rows={2} />
      </F>
      <F label="Social Platforms Active On">
        <Checks values={d.social_platforms??[]} onChange={v=>set('social_platforms',v)} options={[
          ['instagram','Instagram'],['facebook','Facebook'],['linkedin','LinkedIn'],['tiktok','TikTok'],
        ]} />
      </F>
      <Row>
        <F label="Social Activity">
          <Sel name="social_current" value={d.social_current??''} onChange={v=>set('social_current',v)}
            options={[['none','Not active'],['sporadic','Sporadic posting'],['active','Consistently active'],['agency','Managed by agency']]}
          />
        </F>
        <F label="Email Platform">
          <Sel name="email_platform" value={d.email_platform??''} onChange={v=>set('email_platform',v)}
            options={[['none','None'],['mailchimp','Mailchimp'],['klaviyo','Klaviyo'],['activecampaign','ActiveCampaign'],['crm','Built into CRM'],['other','Other']]}
          />
        </F>
      </Row>
      <Row>
        <F label="Email List Size">
          <Sel name="list_size" value={d.list_size??''} onChange={v=>set('list_size',v)}
            options={[['none','No list'],['under500','Under 500'],['500-2000','500–2,000'],['2000+','2,000+']]}
          />
        </F>
        <F label="Content Frequency">
          <Sel name="content_freq" value={d.content_freq??''} onChange={v=>set('content_freq',v)}
            options={[['weekly','Weekly'],['biweekly','Bi-weekly'],['monthly','Monthly'],['one_off','One-off project']]}
          />
        </F>
      </Row>
      <F label="Content Types">
        <Checks values={d.content_types??[]} onChange={v=>set('content_types',v)} options={[
          ['blog','Blog / articles'],['linkedin_posts','LinkedIn posts'],
          ['web_copy','Website copy'],['case_studies','Case studies'],
        ]} />
      </F>

      <Sec>Market & Goals</Sec>
      <Row>
        <F label="Country">
          <Sel name="country" value={d.country??''} onChange={v=>set('country',v)} options={COUNTRIES as [string,string][]} />
        </F>
        <F label="Industry">
          <Sel name="industry" value={d.industry??''} onChange={v=>set('industry',v)}
            options={[['real_estate','Real Estate'],['construction','Construction'],['hospitality','Hospitality'],['professional','Professional Services'],['retail','Retail'],['other','Other']]}
          />
        </F>
      </Row>
      <F label="Primary Goal">
        <Sel name="goal" value={d.goal??''} onChange={v=>set('goal',v)}
          options={[['leads','Generate leads'],['awareness','Brand awareness'],['retention','Customer retention'],['launch','Product / service launch'],['all','All of the above']]}
        />
      </F>
      <F label="Current Monthly Spend">
        <Sel name="current_spend" value={d.current_spend??''} onChange={v=>set('current_spend',v)}
          options={[['none','Nothing'],['under1k','Under $1,000'],['1k-3k','$1,000–$3,000'],['3k-7k','$3,000–$7,000'],['7k+','$7,000+']]}
        />
      </F>
      <F label={`Full Retainer Budget: $${(d.full_budget??5000).toLocaleString()}/mo`}>
        <Slider value={d.full_budget??5000} onChange={v=>set('full_budget',v)} min={1000} max={25000} step={500} />
      </F>
      <F label={`Channel-Only Budget: $${(d.budget??3000).toLocaleString()}/mo`}>
        <Slider value={d.budget??3000} onChange={v=>set('budget',v)} min={500} max={20000} step={250} />
      </F>
    </>
  )
}

function RetainerFields({ d, set }: { d:any; set:(k:string,v:any)=>void }) {
  return (
    <>
      <Sec>Current Digital Foundation</Sec>
      <F label="Country">
        <Sel name="country" value={d.country??''} onChange={v=>set('country',v)} options={COUNTRIES as [string,string][]} />
      </F>
      <F label="What do you already have in place?">
        <Checks values={d.foundation??[]} onChange={v=>set('foundation',v)} options={[
          ['crm','CRM'],['website','Website'],['brand','Brand identity'],
          ['marketing','Active marketing'],['team','Dedicated team'],['data','Business data / analytics'],
        ]} />
      </F>

      <Sec>Focus Areas</Sec>
      <F label="Where do you need the most support?">
        <Checks values={d.focus??[]} onChange={v=>set('focus',v)} options={[
          ['reporting','Reporting & dashboards'],['leads','Lead generation'],
          ['automation','Process automation'],['processes','SOPs & workflows'],
          ['growth','Growth strategy'],['revenue','Revenue optimisation'],
        ]} />
      </F>

      <Sec>Context</Sec>
      <F label="Team Size">
        <Sel name="team_size" value={d.team_size??''} onChange={v=>set('team_size',v)}
          options={[['solo','Solo'],['2-5','2–5'],['6-15','6–15'],['16-50','16–50'],['50+','50+']]}
        />
      </F>
      <F label="Main Pain Point">
        <Tea value={d.pain??''} onChange={v=>set('pain',v)} placeholder="Describe what is costing you the most time, money, or stress" />
      </F>
      <F label="What Does Success Look Like?">
        <Tea value={d.success??''} onChange={v=>set('success',v)} placeholder="Describe the outcome you are hoping for" />
      </F>
    </>
  )
}

function DiscoveryFields({ d, set }: { d:any; set:(k:string,v:any)=>void }) {
  return (
    <>
      <Sec>Business Profile</Sec>
      <Row>
        <F label="Country">
          <Sel name="country" value={d.country??''} onChange={v=>set('country',v)} options={COUNTRIES as [string,string][]} />
        </F>
        <F label="Industry">
          <Sel name="industry" value={d.industry??''} onChange={v=>set('industry',v)}
            options={[['real_estate','Real Estate'],['construction','Construction'],['hospitality','Hospitality'],['professional','Professional Services'],['retail','Retail'],['healthcare','Healthcare'],['other','Other']]}
          />
        </F>
      </Row>
      <Row>
        <F label="Company Name">
          <Inp value={d.company??''} onChange={v=>set('company',v)} placeholder="Company name" />
        </F>
        <F label="Business Tenure">
          <Sel name="tenure" value={d.tenure??''} onChange={v=>set('tenure',v)}
            options={[['under1','Under 1 year'],['1-3','1–3 years'],['3-10','3–10 years'],['10+','10+ years']]}
          />
        </F>
      </Row>

      <Sec>Priorities</Sec>
      <F label="Top Priorities">
        <Checks values={d.priorities??[]} onChange={v=>set('priorities',v)} options={[
          ['leads','Lead generation'],['crm','CRM / operations'],['website','Website'],
          ['marketing','Marketing'],['brand','Brand'],['reporting','Reporting'],
        ]} />
      </F>
      <F label="Main Challenge">
        <Tea value={d.challenge??''} onChange={v=>set('challenge',v)} placeholder="The more specific the better" />
      </F>
    </>
  )
}

function ProposalFields({ d, set }: { d:any; set:(k:string,v:any)=>void }) {
  return (
    <>
      <Sec>Context</Sec>
      <Row>
        <F label="Country">
          <Sel name="country" value={d.country??''} onChange={v=>set('country',v)} options={COUNTRIES as [string,string][]} />
        </F>
        <F label="Industry">
          <Sel name="industry" value={d.industry??''} onChange={v=>set('industry',v)}
            options={[['real_estate','Real Estate'],['construction','Construction'],['hospitality','Hospitality'],['professional','Professional Services'],['other','Other']]}
          />
        </F>
      </Row>
      <F label="Case Study That Resonated">
        <Sel name="case_study" value={d.case_study??''} onChange={v=>set('case_study',v)}
          options={[['azure_keys','Azure Keys (Real Estate CRM)'],['summitstone','SummitStone (Construction CRM)'],['coralea','Coraléa (Hospitality CRM)'],['all','All three'],['not_sure','Not sure yet']]}
        />
      </F>

      <Sec>What They Need</Sec>
      <F label="Primary Needs">
        <Checks values={d.needs??[]} onChange={v=>set('needs',v)} options={[
          ['crm','Custom CRM'],['website','Website & SEO'],['leadgen','Lead generation system'],
          ['brand','Brand & identity'],['marketing','Marketing'],['full','Full digital ecosystem'],
        ]} />
      </F>
      <F label="Context, Budget, Timeline, or Questions">
        <Tea value={d.notes??''} onChange={v=>set('notes',v)} placeholder="Context, budget, timeline, or questions" rows={4} />
      </F>
    </>
  )
}

const FIELD_BLOCKS: Record<string, React.FC<{d:any;set:(k:string,v:any)=>void}>> = {
  'get-a-custom-crm-quote':    CRMFields,
  'start-a-website-project':   WebsiteFields,
  'start-a-brand-project':     BrandFields,
  'get-a-marketing-proposal':  MarketingFields,
  'discuss-a-retainer':        RetainerFields,
  'book-a-discovery-call':     DiscoveryFields,
  'get-a-proposal':            ProposalFields,
}

// ── Main Modal ────────────────────────────────────────────────────────────────
export default function NewLeadModal({ open, onClose }: Props) {
  const router = useRouter()
  const [formType, setFormTypeState] = useState('get-a-custom-crm-quote')
  const [contact,  setContactState]  = useState({
    first_name:'', last_name:'', email:'', phone:'', company:'', website:'',
    social_instagram:'', social_facebook:'', social_linkedin:'', social_other:'',
    referral_source:'',
  })
  const [specific, setSpecificState] = useState<Record<string,any>>({})
  const [saving,   setSaving]  = useState(false)
  const [error,    setError]   = useState('')
  const [showSocial, setShowSocial] = useState(false)

  function setC(k:string, v:string) { setContactState(p=>({...p,[k]:v})) }
  function setS(k:string, v:any)    { setSpecificState(p=>({...p,[k]:v})) }

  function changeFormType(v:string) {
    setFormTypeState(v)
    // Keep country/industry if they exist in both forms
    const keep = { country: specific.country??'', industry: specific.industry??'' }
    setSpecificState(keep)
  }

  async function submit(e:React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      const payload = { ...contact, ...specific, form_type: formType, manual_entry: true }
      const res = await fetch('/api/leads', {
        method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload),
      })
      if (!res.ok) { const b = await res.json().catch(()=>({})); throw new Error(b.error??'Failed') }
      const { lead_id } = await res.json()
      onClose()
      router.push(`/enquiries/${lead_id}`)
      router.refresh()
    } catch(err:any) { setError(err.message); setSaving(false) }
  }

  if (!open) return null

  const SpecificFields = FIELD_BLOCKS[formType]
  const currentLabel = FORM_TYPES.find(f=>f.value===formType)?.label ?? formType

  return (
    <div onClick={e=>{if(e.target===e.currentTarget)onClose()}} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.65)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'16px' }}>
      <div style={{ background:'#141929', border:'1px solid rgba(255,255,255,0.1)', width:'100%', maxWidth:600, maxHeight:'94vh', overflowY:'auto', display:'flex', flexDirection:'column' }}>

        {/* Header */}
        <div style={{ position:'sticky', top:0, background:'#141929', padding:'18px 24px 14px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', justifyContent:'space-between', alignItems:'flex-start', zIndex:2 }}>
          <div>
            <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'1.1rem', fontWeight:700, color:'#fff' }}>New Lead</div>
            <div style={{ fontSize:'.72rem', color:'#F26419', marginTop:2 }}>{currentLabel}</div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#9AA0B8', cursor:'pointer', fontSize:20, lineHeight:1, padding:'2px 4px' }}>✕</button>
        </div>

        <form onSubmit={submit} style={{ padding:'20px 24px', flex:1 }}>

          {/* Enquiry type selector */}
          <div style={S.f}>
            <label style={S.lbl}>Enquiry Type *</label>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
              {FORM_TYPES.map(ft=>{
                const on = formType===ft.value
                return (
                  <button key={ft.value} type="button" onClick={()=>changeFormType(ft.value)} style={{
                    padding:'8px 10px', fontSize:'.78rem', fontWeight:600, cursor:'pointer', textAlign:'left',
                    background: on ? 'rgba(242,100,25,0.15)' : '#192035',
                    border:     on ? '1px solid #F26419'      : '1px solid rgba(255,255,255,0.1)',
                    color:      on ? '#F26419'                : '#9AA0B8',
                    transition:'all .15s',
                  }}>{ft.label}</button>
                )
              })}
            </div>
          </div>

          {/* Form-type-specific fields — these come FIRST matching website form order */}
          {SpecificFields && <SpecificFields d={specific} set={setS} />}

          {/* Contact info — mirrors the final step of every website form */}
          <Sec>Contact Information</Sec>
          <Row>
            <F label="First Name *"><input required style={S.inp} value={contact.first_name} onChange={e=>setC('first_name',e.target.value)} placeholder="First name" /></F>
            <F label="Last Name"><input style={S.inp} value={contact.last_name} onChange={e=>setC('last_name',e.target.value)} placeholder="Last name" /></F>
          </Row>
          <F label="Email *"><input required type="email" style={S.inp} value={contact.email} onChange={e=>setC('email',e.target.value)} placeholder="email@company.com" /></F>
          <Row>
            <F label="Phone"><input type="tel" style={S.inp} value={contact.phone} onChange={e=>setC('phone',e.target.value)} placeholder="+1 246 000 0000" /></F>
            <F label="Company"><input style={S.inp} value={contact.company} onChange={e=>setC('company',e.target.value)} placeholder="Company name" /></F>
          </Row>
          <F label="Website"><input type="url" style={S.inp} value={contact.website} onChange={e=>setC('website',e.target.value)} placeholder="https://" /></F>
          <F label="How Did They Find Us?">
            <Sel name="referral_source" value={contact.referral_source} onChange={v=>setC('referral_source',v)} options={REFERRAL as [string,string][]} />
          </F>

          {/* Social — collapsible like the website form */}
          <button type="button" onClick={()=>setShowSocial(p=>!p)} style={{ background:'none', border:'none', color:'#6B7794', fontSize:'.75rem', cursor:'pointer', padding:'4px 0', marginBottom:8, display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ color: showSocial ? '#F26419' : '#6B7794', fontWeight:700 }}>{showSocial ? '▾' : '▸'}</span>
            Social Media Handles (optional)
          </button>
          {showSocial && (
            <>
              <Row>
                <F label="Instagram"><input style={S.inp} value={contact.social_instagram} onChange={e=>setC('social_instagram',e.target.value)} placeholder="@handle" /></F>
                <F label="Facebook"><input style={S.inp} value={contact.social_facebook} onChange={e=>setC('social_facebook',e.target.value)} placeholder="Page or handle" /></F>
              </Row>
              <Row>
                <F label="LinkedIn"><input style={S.inp} value={contact.social_linkedin} onChange={e=>setC('social_linkedin',e.target.value)} placeholder="Profile URL" /></F>
                <F label="Other"><input style={S.inp} value={contact.social_other} onChange={e=>setC('social_other',e.target.value)} placeholder="TikTok, YouTube, etc." /></F>
              </Row>
            </>
          )}

          {/* Error */}
          {error && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'#EF4444', padding:'10px 14px', fontSize:'.82rem', margin:'8px 0 16px' }}>{error}</div>}

          {/* Actions */}
          <div style={{ display:'flex', gap:8, justifyContent:'flex-end', paddingTop:12, borderTop:'1px solid rgba(255,255,255,0.07)', marginTop:8 }}>
            <button type="button" onClick={onClose} style={{ padding:'9px 20px', background:'transparent', border:'1px solid rgba(255,255,255,0.12)', color:'#9AA0B8', cursor:'pointer', fontFamily:'Outfit,sans-serif', fontSize:'.82rem' }}>Cancel</button>
            <button type="submit" disabled={saving} style={{ padding:'9px 24px', background:saving?'#333':'#F26419', color:'#fff', border:'none', cursor:saving?'not-allowed':'pointer', fontFamily:'Outfit,sans-serif', fontSize:'.85rem', fontWeight:700, clipPath:'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)' }}>
              {saving ? 'Creating...' : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
