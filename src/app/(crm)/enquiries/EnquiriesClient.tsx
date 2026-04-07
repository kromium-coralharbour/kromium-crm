'use client'
import { useState } from 'react'
import Link from 'next/link'
import Topbar from '@/components/Topbar'
import { TierBadge, StatusBadge, ScoreBar, Card } from '@/components/ui'
import { fmtRelative } from '@/lib/utils'
import NewLeadModal from '@/components/NewLeadModal'

interface Lead {
  id:string; first_name:string; last_name:string; email:string; company?:string;
  country?:string; industry?:string; form_type:string; lead_score:number;
  lead_tier:string; status:string; referral_source?:string; created_at:string;
}

interface Props {
  leads: Lead[]; hotCount:number; warmCount:number; coldCount:number; totalCount:number; tier:string;
}

export default function EnquiriesClient({ leads, hotCount, warmCount, coldCount, totalCount, tier }: Props) {
  const [showNew, setShowNew] = useState(false)

  return (
    <>
      <Topbar title="Enquiries" action={{ label:'+ New Lead', onClick: () => setShowNew(true) }} />
      <NewLeadModal open={showNew} onClose={() => setShowNew(false)} />
      <div style={{ flex:1, overflowY:'auto', padding:24 }}>
        <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
          {[
            { label:`All (${totalCount})`, value:'' },
            { label:`HOT (${hotCount})`,   value:'hot' },
            { label:`WARM (${warmCount})`, value:'warm' },
            { label:`COLD (${coldCount})`, value:'cold' },
          ].map(t => (
            <Link key={t.value} href={t.value ? `/enquiries?tier=${t.value}` : '/enquiries'} style={{ textDecoration:'none' }}>
              <div style={{
                padding:'5px 12px', fontSize:'.72rem', fontWeight:600,
                background: tier === t.value || (!tier && !t.value) ? 'rgba(242,100,25,0.10)' : '#141929',
                border: tier === t.value || (!tier && !t.value) ? '1px solid #F26419' : '1px solid rgba(255,255,255,0.07)',
                color: tier === t.value || (!tier && !t.value) ? '#F26419' : '#9AA0B8', cursor:'pointer',
              }}>{t.label}</div>
            </Link>
          ))}
        </div>
        <Card>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead><tr>
                {['Lead','Form','Industry','Country','Score','Tier','Status','Source','Received'].map(h=>(
                  <th key={h} style={{ fontSize:'.65rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#6B7794', padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', textAlign:'left', background:'#141929', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {leads.length === 0 && <tr><td colSpan={9} style={{ padding:48, textAlign:'center', color:'#6B7794' }}>No leads found</td></tr>}
                {leads.map(l => (
                  <tr key={l.id} className="hover:bg-white/[0.02]">
                    <td style={{ padding:'11px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', verticalAlign:'middle' }}>
                      <Link href={`/enquiries/${l.id}`} style={{ textDecoration:'none' }}>
                        <div style={{ fontWeight:600, color:'#EEF0F5' }}>{l.first_name} {l.last_name}</div>
                        <div style={{ fontSize:'.7rem', color:'#6B7794' }}>{l.email}</div>
                      </Link>
                    </td>
                    <td style={{ padding:'11px 16px', fontSize:'.82rem', color:'#9AA0B8', borderBottom:'1px solid rgba(255,255,255,0.07)', whiteSpace:'nowrap' }}>
                      {l.form_type?.replace(/-/g,' ').replace(/get a |start a |book a /gi,'').trim() ?? '—'}
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
