import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Topbar from '@/components/Topbar'
import { Card, StatCard } from '@/components/ui'
import { fmtFull$, fmtDate } from '@/lib/utils'

export default async function ClientsPage() {
  const supabase = await createClient()

  const [{ data: clients }, { count: activeCount }, { data: topRevenue }] = await Promise.all([
    supabase.from('clients').select('id,company_name,contact_name,email,country,industry,lifetime_value,active,created_at').order('lifetime_value', { ascending:false }),
    supabase.from('clients').select('*',{count:'exact',head:true}).eq('active',true),
    supabase.from('clients').select('lifetime_value').eq('active',true),
  ])

  const totalLifetime = (topRevenue ?? []).reduce((s: number, c: any) => s + (c.lifetime_value ?? 0), 0)

  return (
    <>
      <Topbar title="Clients" action={{ label:'+ New Client' }} />
      <div style={{ flex:1, overflowY:'auto', padding:24 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:20 }}>
          <StatCard label="Total Clients" value={(clients ?? []).length} accent="#F26419" />
          <StatCard label="Active" value={activeCount ?? 0} accent="#22C55E" />
          <StatCard label="Lifetime Value" value={fmtFull$(totalLifetime)} accent="#3B82F6" />
        </div>

        <Card>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr>
                  {['Client','Contact','Industry','Country','Lifetime Value','Since','Status'].map(h => (
                    <th key={h} style={{ fontSize:'.65rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#6B7794', padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', textAlign:'left', background:'#141929', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(clients ?? []).length === 0 && (
                  <tr><td colSpan={7} style={{ padding:48, textAlign:'center', color:'#6B7794' }}>No clients yet. Convert leads to clients from the enquiry detail page.</td></tr>
                )}
                {(clients ?? []).map((c: any) => (
                  <tr key={c.id} className="hover:bg-white/[0.02]" style={{ cursor:'pointer' }}>
                    <td style={{ padding:'11px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                      <Link href={`/clients/${c.id}`} style={{ textDecoration:'none' }}>
                        <div style={{ fontWeight:600, color:'#EEF0F5' }}>{c.company_name}</div>
                      </Link>
                    </td>
                    <td style={{ padding:'11px 16px', fontSize:'.82rem', color:'#9AA0B8', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                      <div>{c.contact_name}</div>
                      <div style={{ fontSize:'.72rem', color:'#6B7794' }}>{c.email}</div>
                    </td>
                    <td style={{ padding:'11px 16px', fontSize:'.82rem', color:'#9AA0B8', borderBottom:'1px solid rgba(255,255,255,0.07)', textTransform:'capitalize' }}>{c.industry?.replace(/_/g,' ') ?? '—'}</td>
                    <td style={{ padding:'11px 16px', fontSize:'.82rem', color:'#9AA0B8', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>{c.country ?? '—'}</td>
                    <td style={{ padding:'11px 16px', fontSize:'.85rem', fontWeight:700, color:'#22C55E', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>{fmtFull$(c.lifetime_value ?? 0)}</td>
                    <td style={{ padding:'11px 16px', fontSize:'.78rem', color:'#6B7794', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>{fmtDate(c.created_at)}</td>
                    <td style={{ padding:'11px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                      <span style={{ display:'inline-flex', fontSize:'.63rem', fontWeight:700, letterSpacing:'.06em', textTransform:'uppercase', padding:'3px 7px', background: c.active ? 'rgba(34,197,94,0.12)' : 'rgba(107,119,148,0.12)', color: c.active ? '#22C55E' : '#9AA0B8' }}>
                        {c.active ? 'Active' : 'Inactive'}
                      </span>
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
