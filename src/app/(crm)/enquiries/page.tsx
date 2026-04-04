import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Topbar from '@/components/Topbar'
import { TierBadge, StatusBadge, ScoreBar, Card } from '@/components/ui'
import { fmtRelative } from '@/lib/utils'

export default async function EnquiriesPage({ searchParams }: { searchParams: { tier?: string; status?: string } }) {
  const supabase = await createClient()
  let query = supabase
    .from('leads')
    .select('id,first_name,last_name,email,company,country,industry,form_type,lead_score,lead_tier,status,referral_source,created_at,assigned_to,profiles(full_name)')
    .order('created_at', { ascending: false })

  if (searchParams.tier)   query = query.eq('lead_tier', searchParams.tier)
  if (searchParams.status) query = query.eq('status', searchParams.status)

  const { data: leads } = await query.limit(100)

  const { count: hotCount  } = await supabase.from('leads').select('*',{count:'exact',head:true}).eq('lead_tier','hot').eq('status','new')
  const { count: warmCount } = await supabase.from('leads').select('*',{count:'exact',head:true}).eq('lead_tier','warm')
  const { count: coldCount } = await supabase.from('leads').select('*',{count:'exact',head:true}).eq('lead_tier','cold')
  const { count: totalCount} = await supabase.from('leads').select('*',{count:'exact',head:true})

  const tiers   = [
    { label:`All (${totalCount ?? 0})`,  value:'' },
    { label:`HOT (${hotCount ?? 0})`,   value:'hot'  },
    { label:`WARM (${warmCount ?? 0})`, value:'warm' },
    { label:`COLD (${coldCount ?? 0})`, value:'cold' },
  ]
  const statuses = ['','new','contacted','proposal_sent','negotiating','won','lost','nurturing']

  return (
    <>
      <Topbar title="Enquiries" action={{ label:'+ New Lead', onClick: undefined }} />
      <div style={{ flex:1, overflowY:'auto', padding:24 }}>

        {/* Filters */}
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16, flexWrap:'wrap' }}>
          {tiers.map(t => (
            <Link key={t.value} href={t.value ? `/enquiries?tier=${t.value}` : '/enquiries'} style={{ textDecoration:'none' }}>
              <div style={{
                padding:'5px 12px', fontSize:'.72rem', fontWeight:600,
                background: searchParams.tier === t.value || (!searchParams.tier && !t.value) ? 'rgba(242,100,25,0.10)' : '#141929',
                border: searchParams.tier === t.value || (!searchParams.tier && !t.value) ? '1px solid #F26419' : '1px solid rgba(255,255,255,0.07)',
                color: searchParams.tier === t.value || (!searchParams.tier && !t.value) ? '#F26419' : '#9AA0B8',
                cursor:'pointer',
              }}>
                {t.label}
              </div>
            </Link>
          ))}
        </div>

        <Card>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr>
                  {['Lead','Form','Industry','Country','Score','Tier','Status','Source','Received'].map(h => (
                    <th key={h} style={{ fontSize:'.65rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#6B7794', padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', textAlign:'left', background:'#141929', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(leads ?? []).length === 0 && (
                  <tr><td colSpan={9} style={{ padding:48, textAlign:'center', color:'#6B7794' }}>No leads found</td></tr>
                )}
                {(leads ?? []).map((l: any) => (
                  <tr key={l.id} style={{ cursor:'pointer' }} className="hover:bg-white/[0.02]">
                    <td style={{ padding:'11px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', verticalAlign:'middle' }}>
                      <Link href={`/enquiries/${l.id}`} style={{ textDecoration:'none' }}>
                        <div style={{ fontWeight:600, color:'#EEF0F5' }}>{l.first_name} {l.last_name}</div>
                        <div style={{ fontSize:'.7rem', color:'#6B7794' }}>{l.email}</div>
                      </Link>
                    </td>
                    <td style={{ padding:'11px 16px', fontSize:'.82rem', color:'#9AA0B8', borderBottom:'1px solid rgba(255,255,255,0.07)', whiteSpace:'nowrap' }}>
                      {l.form_type?.replace(/-/g,' ').replace(/get a |start a |book a /gi, '') ?? '—'}
                    </td>
                    <td style={{ padding:'11px 16px', fontSize:'.82rem', color:'#9AA0B8', borderBottom:'1px solid rgba(255,255,255,0.07)', textTransform:'capitalize' }}>{l.industry?.replace(/_/g,' ') ?? '—'}</td>
                    <td style={{ padding:'11px 16px', fontSize:'.82rem', color:'#9AA0B8', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>{l.country ?? '—'}</td>
                    <td style={{ padding:'11px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', minWidth:100 }}>
                      <ScoreBar score={l.lead_score} tier={l.lead_tier} />
                    </td>
                    <td style={{ padding:'11px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}><TierBadge tier={l.lead_tier} /></td>
                    <td style={{ padding:'11px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}><StatusBadge status={l.status} /></td>
                    <td style={{ padding:'11px 16px', fontSize:'.78rem', color:'#9AA0B8', borderBottom:'1px solid rgba(255,255,255,0.07)', textTransform:'capitalize' }}>
                      {l.referral_source?.replace(/_/g,' ') ?? '—'}
                    </td>
                    <td style={{ padding:'11px 16px', fontSize:'.78rem', color:'#6B7794', borderBottom:'1px solid rgba(255,255,255,0.07)', whiteSpace:'nowrap' }}>{fmtRelative(l.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  )
}
