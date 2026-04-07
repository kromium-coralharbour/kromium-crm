import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Topbar from '@/components/Topbar'
import { TierBadge } from '@/components/ui'
import { fmtRelative } from '@/lib/utils'

const STAGES = [
  { key: 'new',           label: 'New Enquiry',   color: '#F26419' },
  { key: 'contacted',     label: 'Contacted',      color: '#3B82F6' },
  { key: 'proposal_sent', label: 'Proposal Sent', color: '#A855F7' },
  { key: 'negotiating',   label: 'Negotiating',   color: '#F59E0B' },
  { key: 'won',           label: 'Won',            color: '#22C55E' },
  { key: 'lost',          label: 'Lost',           color: '#EF4444' },
]

const FORM_LABELS: Record<string, string> = {
  'get-a-custom-crm-quote':    'CRM',
  'start-a-website-project':   'Website',
  'start-a-brand-project':     'Brand',
  'get-a-marketing-proposal':  'Marketing',
  'discuss-a-retainer':        'Retainer',
  'book-a-discovery-call':     'Discovery',
  'get-a-proposal':            'Proposal',
}

export default async function PipelinePage({
  searchParams,
}: {
  searchParams: { form_type?: string }
}) {
  const supabase = await createClient()

  let query = supabase
    .from('leads')
    .select('id,first_name,last_name,company,country,form_type,lead_score,lead_tier,status,created_at')
    .order('created_at', { ascending: false })

  if (searchParams.form_type) query = query.eq('form_type', searchParams.form_type)

  const { data: leads } = await query

  const byStatus = (leads ?? []).reduce((acc: Record<string, any[]>, l: any) => {
    if (!acc[l.status]) acc[l.status] = []
    acc[l.status].push(l)
    return acc
  }, {})

  const FORM_TYPES = [
    { value: '',                          label: 'All' },
    { value: 'get-a-custom-crm-quote',    label: 'CRM' },
    { value: 'start-a-website-project',   label: 'Website' },
    { value: 'start-a-brand-project',     label: 'Brand' },
    { value: 'get-a-marketing-proposal',  label: 'Marketing' },
    { value: 'discuss-a-retainer',        label: 'Retainer' },
    { value: 'book-a-discovery-call',     label: 'Discovery' },
    { value: 'get-a-proposal',            label: 'Proposal' },
  ]

  return (
    <>
      <Topbar title="Pipeline" />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Form type filter */}
        <div style={{ padding: '12px 24px 0', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {FORM_TYPES.map(ft => (
            <Link key={ft.value} href={ft.value ? `/pipeline?form_type=${ft.value}` : '/pipeline'} style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '4px 10px', fontSize: '.7rem', fontWeight: 600, cursor: 'pointer',
                background: (searchParams.form_type ?? '') === ft.value ? 'rgba(242,100,25,0.10)' : '#141929',
                border:     (searchParams.form_type ?? '') === ft.value ? '1px solid #F26419'      : '1px solid rgba(255,255,255,0.07)',
                color:      (searchParams.form_type ?? '') === ft.value ? '#F26419'                : '#9AA0B8',
              }}>{ft.label}</div>
            </Link>
          ))}
        </div>

        <div style={{ flex: 1, overflowX: 'auto', padding: '12px 24px 24px', display: 'flex', gap: 10 }}>
          {STAGES.map(stage => {
            const cards = byStatus[stage.key] ?? []
            return (
              <div key={stage.key} style={{
                flexShrink: 0, width: 230,
                background: '#141929', border: '1px solid rgba(255,255,255,0.07)',
                display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 160px)',
              }}>
                <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: stage.color }} />
                    <span style={{ fontSize: '.82rem', fontWeight: 700, color: '#EEF0F5' }}>{stage.label}</span>
                  </div>
                  <span style={{ fontSize: '.65rem', fontWeight: 700, color: '#6B7794', background: '#0F1422', border: '1px solid rgba(255,255,255,0.07)', padding: '1px 6px', borderRadius: 10 }}>{cards.length}</span>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
                  {cards.length === 0 && <div style={{ padding: '16px 8px', textAlign: 'center', color: '#6B7794', fontSize: '.78rem' }}>Empty</div>}
                  {cards.map((l: any) => {
                    const ftLabel = FORM_LABELS[l.form_type] ?? l.form_type?.replace(/-/g, ' ') ?? '—'
                    return (
                      <Link key={l.id} href={`/enquiries/${l.id}`} style={{ textDecoration: 'none' }}>
                        <div className="hover:border-orange-500/40" style={{ background: '#0F1422', border: '1px solid rgba(255,255,255,0.07)', padding: 12, marginBottom: 6, cursor: 'pointer', transition: 'border-color .15s' }}>
                          <div style={{ fontSize: '.82rem', fontWeight: 600, color: '#EEF0F5', marginBottom: 2 }}>{l.first_name} {l.last_name}</div>
                          <div style={{ fontSize: '.7rem', background: 'rgba(242,100,25,0.08)', color: '#F26419', padding: '1px 6px', display: 'inline-block', marginBottom: 6 }}>{ftLabel}</div>
                          <div style={{ fontSize: '.7rem', color: '#6B7794', marginBottom: 8 }}>{l.country ?? '—'}</div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <TierBadge tier={l.lead_tier} />
                            <span style={{ fontSize: '.68rem', color: '#6B7794' }}>{fmtRelative(l.created_at)}</span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
