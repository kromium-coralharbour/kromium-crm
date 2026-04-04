import { createClient } from '@/lib/supabase/server'
import Topbar from '@/components/Topbar'
import { Card, StatCard } from '@/components/ui'

export default async function AttributionPage() {
  const supabase = await createClient()

  const { data: leads } = await supabase.from('leads').select('lead_tier,lead_score,referral_source,form_type,status,created_at')

  const total   = (leads ?? []).length
  const hot     = (leads ?? []).filter((l: any) => l.lead_tier === 'hot').length
  const converted = (leads ?? []).filter((l: any) => l.status === 'won').length
  const avgScore = total > 0 ? Math.round((leads ?? []).reduce((s: number, l: any) => s + (l.lead_score ?? 0), 0) / total) : 0

  // Group by source
  const bySource: Record<string, number> = {}
  const byForm: Record<string, number>   = {};
  (leads ?? []).forEach((l: any) => {
    const src  = l.referral_source ?? 'unknown'
    const form = l.form_type ?? 'unknown'
    bySource[src]  = (bySource[src]  ?? 0) + 1
    byForm[form]   = (byForm[form]   ?? 0) + 1
  })

  const topSources = Object.entries(bySource).sort(([,a],[,b]) => b - a).slice(0, 6)
  const topForms   = Object.entries(byForm).sort(([,a],[,b]) => b - a).slice(0, 6)
  const maxSrc     = topSources[0]?.[1] ?? 1
  const maxForm    = topForms[0]?.[1]   ?? 1

  const convRate = total > 0 ? Math.round((converted / total) * 100) : 0

  return (
    <>
      <Topbar title="Lead Attribution" />
      <div style={{ flex:1, overflowY:'auto', padding:24 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
          <StatCard label="Total Leads"     value={total}          accent="#F26419" />
          <StatCard label="HOT Leads"       value={hot}            accent="#EF4444" meta={`${total > 0 ? Math.round((hot/total)*100) : 0}% of total`} />
          <StatCard label="Avg Lead Score"  value={avgScore}       accent="#F59E0B" />
          <StatCard label="Conversion Rate" value={`${convRate}%`} accent="#22C55E" meta="Lead to client" />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <Card>
            <div style={{ padding:'14px 18px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'.95rem', fontWeight:700, color:'#fff' }}>Leads by Source</div>
            </div>
            <div style={{ padding:16 }}>
              {topSources.length === 0 && <div style={{ color:'#6B7794', fontSize:'.82rem' }}>No data yet</div>}
              {topSources.map(([src, count]) => (
                <div key={src} style={{ marginBottom:12 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.82rem', marginBottom:5 }}>
                    <span style={{ color:'#EEF0F5', textTransform:'capitalize' }}>{src.replace(/_/g,' ')}</span>
                    <span style={{ color:'#F26419', fontWeight:700 }}>{count} leads</span>
                  </div>
                  <div style={{ height:4, background:'rgba(255,255,255,0.08)', borderRadius:2 }}>
                    <div style={{ height:4, borderRadius:2, background:'#F26419', width:`${Math.round((count/maxSrc)*100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div style={{ padding:'14px 18px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'.95rem', fontWeight:700, color:'#fff' }}>Leads by Form</div>
            </div>
            <div style={{ padding:16 }}>
              {topForms.length === 0 && <div style={{ color:'#6B7794', fontSize:'.82rem' }}>No data yet</div>}
              {topForms.map(([form, count]) => (
                <div key={form} style={{ marginBottom:12 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.82rem', marginBottom:5 }}>
                    <span style={{ color:'#EEF0F5' }}>{form.replace(/-/g,' ').replace(/get a |start a |book a /gi, '')}</span>
                    <span style={{ color:'#F26419', fontWeight:700 }}>{count} leads</span>
                  </div>
                  <div style={{ height:4, background:'rgba(255,255,255,0.08)', borderRadius:2 }}>
                    <div style={{ height:4, borderRadius:2, background:'#3B82F6', width:`${Math.round((count/maxForm)*100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
