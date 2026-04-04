import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Topbar from '@/components/Topbar'
import { TierBadge, StatusBadge, Card, CardHead, DetailSection, InfoGrid, TaskItem, NoteItem, PrimaryBtn, GhostBtn } from '@/components/ui'
import { fmtDate, fmtRelative } from '@/lib/utils'
import LeadActions from './LeadActions'

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const [{ data: lead }, { data: tasks }, { data: notes }] = await Promise.all([
    supabase.from('leads').select('*').eq('id', params.id).single(),
    supabase.from('tasks').select('*,profiles(full_name)').eq('lead_id', params.id).order('due_date'),
    supabase.from('notes').select('*,profiles(full_name)').eq('lead_id', params.id).order('created_at', { ascending: false }),
  ])

  if (!lead) notFound()

  const scoreBreakdown = lead.score_breakdown as Record<string, number>
  const formData = lead.form_data as Record<string, unknown>

  return (
    <>
      <Topbar title={`${lead.first_name} ${lead.last_name}`} />
      <div style={{ flex:1, overflowY:'auto', padding:24 }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:16 }}>

          {/* Left column */}
          <div>
            {/* Header card */}
            <Card style={{ marginBottom:12, padding:'20px 24px' }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
                <div>
                  <h1 style={{ fontFamily:'Outfit,sans-serif', fontSize:'1.4rem', fontWeight:800, color:'#fff', marginBottom:4 }}>
                    {lead.first_name} {lead.last_name}
                  </h1>
                  <div style={{ fontSize:'.82rem', color:'#9AA0B8' }}>
                    {lead.form_type?.replace(/-/g,' ')} &middot; {lead.company ?? '—'} &middot; {lead.country ?? '—'}
                  </div>
                </div>
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <TierBadge tier={lead.lead_tier} />
                  <StatusBadge status={lead.status} />
                </div>
              </div>
              <LeadActions lead={lead} />
            </Card>

            {/* Contact info */}
            <Card style={{ marginBottom:12 }}>
              <CardHead title="Contact Information" />
              <div style={{ padding:'16px 18px' }}>
                <InfoGrid items={[
                  { label:'Email',    value: lead.email },
                  { label:'Phone',    value: lead.phone },
                  { label:'Company',  value: lead.company },
                  { label:'Country',  value: lead.country },
                  { label:'Industry', value: lead.industry?.replace(/_/g,' ') },
                  { label:'Website',  value: lead.website },
                  { label:'Instagram',value: lead.social_instagram },
                  { label:'LinkedIn', value: lead.social_linkedin },
                  { label:'Facebook', value: lead.social_facebook },
                  { label:'Other',    value: lead.social_other },
                  { label:'Source',   value: lead.referral_source?.replace(/_/g,' ') },
                  { label:'Received', value: fmtDate(lead.created_at) },
                ]} />
              </div>
            </Card>

            {/* Form responses */}
            <Card style={{ marginBottom:12 }}>
              <CardHead title="Form Responses" />
              <div style={{ padding:'16px 18px' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  {Object.entries(formData).filter(([k]) => !['name','email','phone','company','website','country','social_instagram','social_facebook','social_linkedin','social_other','referral_source'].includes(k)).map(([key, val]) => (
                    <div key={key} style={{ gridColumn: Array.isArray(val) || String(val).length > 40 ? '1/-1' : undefined }}>
                      <div style={{ fontSize:'.65rem', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'#6B7794', marginBottom:3 }}>
                        {key.replace(/_/g,' ')}
                      </div>
                      <div style={{ fontSize:'.82rem', color:'#EEF0F5' }}>
                        {Array.isArray(val) ? val.join(', ') : String(val ?? '—')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Tasks */}
            <Card style={{ marginBottom:12 }}>
              <CardHead title={`Tasks (${(tasks ?? []).length})`} />
              <div style={{ padding:'12px 16px' }}>
                {(tasks ?? []).length === 0 && <div style={{ color:'#6B7794', fontSize:'.82rem', padding:'8px 0' }}>No tasks yet</div>}
                {(tasks ?? []).map((t: any) => {
                  const overdue = t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done'
                  return (
                    <TaskItem
                      key={t.id}
                      title={t.title}
                      meta={`${t.priority} priority · ${t.profiles?.full_name ?? 'Unassigned'}`}
                      due={overdue ? 'Overdue' : t.due_date ? fmtDate(t.due_date) : undefined}
                      done={t.status === 'done'}
                    />
                  )
                })}
              </div>
            </Card>

            {/* Notes */}
            <Card>
              <CardHead title="Notes" />
              <div style={{ padding:'12px 16px' }}>
                <AddNoteSection leadId={lead.id} />
                {(notes ?? []).map((n: any) => (
                  <NoteItem key={n.id} content={n.content} author={n.profiles?.full_name ?? '—'} date={fmtRelative(n.created_at)} />
                ))}
              </div>
            </Card>
          </div>

          {/* Right column — Score */}
          <div>
            <Card style={{ marginBottom:12 }}>
              <CardHead title="Lead Score Breakdown" />
              <div style={{ padding:'16px 18px' }}>
                <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'2.4rem', fontWeight:800, color:'#F26419', marginBottom:4 }}>
                  {lead.lead_score}<span style={{ fontSize:'1rem', color:'#6B7794', fontWeight:500 }}> / 100</span>
                </div>
                <TierBadge tier={lead.lead_tier} />
                <div style={{ marginTop:16, display:'flex', flexDirection:'column', gap:0 }}>
                  {Object.entries(scoreBreakdown).map(([label, pts]) => (
                    <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.07)', fontSize:'.8rem' }}>
                      <span style={{ color:'#9AA0B8' }}>{label}</span>
                      <span style={{ fontWeight:700, color:'#F26419' }}>+{pts}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card>
              <CardHead title="Timeline" />
              <div style={{ padding:'12px 16px' }}>
                <div style={{ fontSize:'.8rem', color:'#9AA0B8', padding:'6px 0', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                  <span style={{ color:'#6B7794', fontSize:'.68rem', display:'block', marginBottom:2 }}>Form submitted</span>
                  {fmtDate(lead.created_at)}
                </div>
                <div style={{ fontSize:'.8rem', color:'#9AA0B8', padding:'6px 0' }}>
                  <span style={{ color:'#6B7794', fontSize:'.68rem', display:'block', marginBottom:2 }}>Current status</span>
                  <StatusBadge status={lead.status} />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

// Client component placeholder for actions
function AddNoteSection({ leadId }: { leadId: string }) {
  return (
    <div style={{ marginBottom:12 }}>
      <textarea
        placeholder="Add a note..."
        style={{ width:'100%', background:'#192035', border:'1px solid rgba(255,255,255,0.07)', color:'#EEF0F5', fontFamily:'Inter,sans-serif', fontSize:'.82rem', padding:'9px 12px', outline:'none', resize:'vertical', minHeight:64, marginBottom:6 }}
      />
      <button style={{ padding:'6px 14px', background:'#F26419', color:'#fff', border:'none', fontFamily:'Outfit,sans-serif', fontSize:'.78rem', fontWeight:700, letterSpacing:'.04em', textTransform:'uppercase', cursor:'pointer', clipPath:'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)' }}>
        Add Note
      </button>
    </div>
  )
}
