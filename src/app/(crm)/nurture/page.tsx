// ── NURTURE PAGE ──────────────────────────────────────────────────────────────
import { createClient } from '@/lib/supabase/server'
import Topbar from '@/components/Topbar'
import { Card } from '@/components/ui'
import { fmtDate } from '@/lib/utils'

export default async function NurturePage() {
  const supabase = await createClient()
  const { data: entries } = await supabase
    .from('nurture_entries')
    .select('*,leads(first_name,last_name,email,lead_score,lead_tier,country)')
    .order('next_due', { nullsFirst: false })

  return (
    <>
      <Topbar title="Nurture Sequences" action={{ label:'+ Add to Sequence' }} />
      <div style={{ flex:1, overflowY:'auto', padding:24 }}>
        <Card>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr>
                  {['Lead','Score','Sequence','Last Touchpoint','Next Action','Due'].map(h => (
                    <th key={h} style={{ fontSize:'.65rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#6B7794', padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', textAlign:'left', background:'#141929', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(entries ?? []).length === 0 && (
                  <tr><td colSpan={6} style={{ padding:48, textAlign:'center', color:'#6B7794' }}>No leads in nurture sequences. Cold and warm leads can be added here.</td></tr>
                )}
                {(entries ?? []).map((e: any) => (
                  <tr key={e.id} className="hover:bg-white/[0.02]">
                    <td style={{ padding:'11px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                      <div style={{ fontWeight:600, color:'#EEF0F5', fontSize:'.82rem' }}>{e.leads?.first_name} {e.leads?.last_name}</div>
                      <div style={{ fontSize:'.7rem', color:'#6B7794' }}>{e.leads?.email}</div>
                    </td>
                    <td style={{ padding:'11px 16px', fontSize:'.82rem', color:'#9AA0B8', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>{e.leads?.lead_score ?? '—'}</td>
                    <td style={{ padding:'11px 16px', fontSize:'.82rem', color:'#9AA0B8', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>{e.sequence_type}</td>
                    <td style={{ padding:'11px 16px', fontSize:'.82rem', color:'#9AA0B8', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>{e.touchpoint}</td>
                    <td style={{ padding:'11px 16px', fontSize:'.82rem', color:'#EEF0F5', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>{e.next_action ?? '—'}</td>
                    <td style={{ padding:'11px 16px', fontSize:'.78rem', color: e.next_due && new Date(e.next_due) < new Date() ? '#EF4444' : '#F59E0B', borderBottom:'1px solid rgba(255,255,255,0.07)', whiteSpace:'nowrap' }}>
                      {e.next_due ? fmtDate(e.next_due) : '—'}
                    </td>
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
