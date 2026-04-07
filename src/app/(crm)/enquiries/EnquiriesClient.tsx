'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Topbar from '@/components/Topbar'
import { TierBadge, StatusBadge, ScoreBar, Card } from '@/components/ui'
import { fmtRelative } from '@/lib/utils'
import NewLeadModal from '@/components/NewLeadModal'

const FORM_TYPES = [
  { value: '',                          label: 'All Forms' },
  { value: 'get-a-custom-crm-quote',    label: 'Custom CRM' },
  { value: 'start-a-website-project',   label: 'Website & SEO' },
  { value: 'start-a-brand-project',     label: 'Brand & Identity' },
  { value: 'get-a-marketing-proposal',  label: 'Marketing' },
  { value: 'discuss-a-retainer',        label: 'Retainer' },
  { value: 'book-a-discovery-call',     label: 'Discovery Call' },
  { value: 'get-a-proposal',            label: 'Get a Proposal' },
]

interface Lead {
  id: string; first_name: string; last_name: string; email: string
  company?: string; country?: string; industry?: string; form_type: string
  lead_score: number; lead_tier: string; status: string
  referral_source?: string; created_at: string
}

interface Props {
  leads: Lead[]; hotCount: number; warmCount: number; coldCount: number
  totalCount: number; tier: string; formType: string
}

export default function EnquiriesClient({ leads, hotCount, warmCount, coldCount, totalCount, tier, formType }: Props) {
  const [showNew, setShowNew] = useState(false)
  const router = useRouter()

  function buildHref(newTier?: string, newFormType?: string) {
    const t  = newTier     !== undefined ? newTier     : tier
    const ft = newFormType !== undefined ? newFormType : formType
    const params = new URLSearchParams()
    if (t)  params.set('tier',      t)
    if (ft) params.set('form_type', ft)
    const qs = params.toString()
    return `/enquiries${qs ? '?' + qs : ''}`
  }

  const tiers = [
    { label: `All (${totalCount})`, value: '' },
    { label: `HOT (${hotCount})`,   value: 'hot'  },
    { label: `WARM (${warmCount})`, value: 'warm' },
    { label: `COLD (${coldCount})`, value: 'cold' },
  ]

  const chip = (active: boolean): React.CSSProperties => ({
    padding: '5px 12px', fontSize: '.72rem', fontWeight: 600, cursor: 'pointer',
    background: active ? 'rgba(242,100,25,0.10)' : '#141929',
    border:     active ? '1px solid #F26419'      : '1px solid rgba(255,255,255,0.07)',
    color:      active ? '#F26419'                : '#9AA0B8',
  })

  return (
    <>
      <Topbar title="Enquiries" action={{ label: '+ New Lead', onClick: () => setShowNew(true) }} />
      <NewLeadModal open={showNew} onClose={() => setShowNew(false)} />
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>

        {/* Tier filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
          {tiers.map(t => (
            <Link key={t.value} href={buildHref(t.value, undefined)} style={{ textDecoration: 'none' }}>
              <div style={chip(tier === t.value || (!tier && !t.value))}>{t.label}</div>
            </Link>
          ))}
          <div style={{ width: 1, background: 'rgba(255,255,255,0.07)', margin: '0 4px' }} />
          {/* Form type filters */}
          {FORM_TYPES.map(ft => (
            <Link key={ft.value} href={buildHref(undefined, ft.value)} style={{ textDecoration: 'none' }}>
              <div style={chip(formType === ft.value || (!formType && !ft.value))}>{ft.label}</div>
            </Link>
          ))}
        </div>

        <Card>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Lead', 'Form Type', 'Industry', 'Country', 'Score', 'Tier', 'Status', 'Source', 'Received'].map(h => (
                    <th key={h} style={{ fontSize: '.65rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6B7794', padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', textAlign: 'left', background: '#141929', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 && (
                  <tr><td colSpan={9} style={{ padding: 48, textAlign: 'center', color: '#6B7794' }}>No leads found</td></tr>
                )}
                {leads.map(l => {
                  const ftLabel = FORM_TYPES.find(f => f.value === l.form_type)?.label ?? l.form_type?.replace(/-/g, ' ') ?? '—'
                  return (
                    <tr key={l.id} className="hover:bg-white/[0.02]" onClick={() => router.push(`/enquiries/${l.id}`)} style={{ cursor: 'pointer' }}>
                      <td style={{ padding: '11px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                          <div style={{ fontWeight: 600, color: '#EEF0F5' }}>{l.first_name} {l.last_name}</div>
                          <div style={{ fontSize: '.7rem', color: '#6B7794' }}>{l.email}</div>
                      </td>
                      <td style={{ padding: '11px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }} onClick={e => { e.stopPropagation(); router.push(buildHref(undefined, l.form_type)) }}>
                          <span style={{ fontSize: '.72rem', fontWeight: 600, color: '#F26419', background: 'rgba(242,100,25,0.08)', padding: '2px 7px', cursor: 'pointer' }}>
                            {ftLabel}
                          </span>
                      </td>
                      <td style={{ padding: '11px 16px', fontSize: '.82rem', color: '#9AA0B8', borderBottom: '1px solid rgba(255,255,255,0.07)', textTransform: 'capitalize' }}>{l.industry?.replace(/_/g, ' ') ?? '—'}</td>
                      <td style={{ padding: '11px 16px', fontSize: '.82rem', color: '#9AA0B8', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>{l.country ?? '—'}</td>
                      <td style={{ padding: '11px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)', minWidth: 100 }}>
                        <ScoreBar score={l.lead_score} tier={l.lead_tier} />
                      </td>
                      <td style={{ padding: '11px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}><TierBadge tier={l.lead_tier} /></td>
                      <td style={{ padding: '11px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}><StatusBadge status={l.status} /></td>
                      <td style={{ padding: '11px 16px', fontSize: '.78rem', color: '#9AA0B8', borderBottom: '1px solid rgba(255,255,255,0.07)', textTransform: 'capitalize' }}>{l.referral_source?.replace(/_/g, ' ') ?? '—'}</td>
                      <td style={{ padding: '11px 16px', fontSize: '.78rem', color: '#6B7794', borderBottom: '1px solid rgba(255,255,255,0.07)', whiteSpace: 'nowrap' }}>{fmtRelative(l.created_at)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  )
}
