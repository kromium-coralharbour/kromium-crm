import { createClient } from '@/lib/supabase/server'
import Topbar from '@/components/Topbar'
import { Card } from '@/components/ui'
import { initials, fmtDate } from '@/lib/utils'

const ROLE_COLORS: Record<string, { bg: string; color: string }> = {
  admin:     { bg:'rgba(242,100,25,0.12)',  color:'#F26419' },
  manager:   { bg:'rgba(59,130,246,0.12)', color:'#3B82F6' },
  executive: { bg:'rgba(107,119,148,0.12)',color:'#9AA0B8' },
}

export default async function TeamPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: currentProfile } = await supabase.from('profiles').select('role').eq('id', user?.id ?? '').single()

  const { data: team } = await supabase.from('profiles').select('*').order('created_at')

  const isAdmin = currentProfile?.role === 'admin'

  return (
    <>
      <Topbar title="Team" action={isAdmin ? { label:'+ Invite Member' } : undefined} />
      <div style={{ flex:1, overflowY:'auto', padding:24 }}>
        {!isAdmin && (
          <div style={{ background:'rgba(107,119,148,0.1)', border:'1px solid rgba(107,119,148,0.2)', padding:'10px 16px', marginBottom:16, fontSize:'.82rem', color:'#9AA0B8' }}>
            Team management requires Admin access.
          </div>
        )}
        <Card>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr>
                  {['Member','Role','Email','Joined'].map(h => (
                    <th key={h} style={{ fontSize:'.65rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#6B7794', padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', textAlign:'left', background:'#141929' }}>{h}</th>
                  ))}
                  {isAdmin && <th style={{ fontSize:'.65rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#6B7794', padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', textAlign:'left', background:'#141929' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {(team ?? []).map((m: any) => {
                  const rc = ROLE_COLORS[m.role] ?? ROLE_COLORS.executive
                  const isMe = m.id === user?.id
                  return (
                    <tr key={m.id} className="hover:bg-white/[0.02]">
                      <td style={{ padding:'11px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#F26419,#E85A0E)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.72rem', fontWeight:800, color:'#fff', flexShrink:0 }}>
                            {initials(m.full_name)}
                          </div>
                          <div>
                            <div style={{ fontWeight:600, color:'#EEF0F5', fontSize:'.85rem' }}>{m.full_name}{isMe && <span style={{ fontSize:'.7rem', color:'#6B7794', marginLeft:6 }}>(you)</span>}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:'11px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                        <span style={{ fontSize:'.63rem', fontWeight:700, letterSpacing:'.06em', textTransform:'uppercase', padding:'3px 7px', background: rc.bg, color: rc.color }}>
                          {m.role}
                        </span>
                      </td>
                      <td style={{ padding:'11px 16px', fontSize:'.82rem', color:'#9AA0B8', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>{m.email}</td>
                      <td style={{ padding:'11px 16px', fontSize:'.78rem', color:'#6B7794', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>{fmtDate(m.created_at)}</td>
                      {isAdmin && (
                        <td style={{ padding:'11px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                          {!isMe && (
                            <select defaultValue={m.role} style={{ background:'#192035', border:'1px solid rgba(255,255,255,0.07)', color:'#EEF0F5', fontSize:'.78rem', padding:'5px 8px', cursor:'pointer', outline:'none' }}>
                              <option value="admin">Admin</option>
                              <option value="manager">Manager</option>
                              <option value="executive">Executive</option>
                            </select>
                          )}
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <div style={{ marginTop:24 }}>
          <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'.95rem', fontWeight:700, color:'#fff', marginBottom:12 }}>Role Permissions</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
            {[
              { role:'Admin', color:'#F26419', perms:['Full access to all modules','Manage team members and roles','Edit settings and templates','Delete records','View all data'] },
              { role:'Manager', color:'#3B82F6', perms:['View and edit leads, clients, projects','Create and send proposals','Log notes and tasks','View revenue records','No team or settings access'] },
              { role:'Executive', color:'#9AA0B8', perms:['Read-only dashboard','View client and project status','Cannot edit any records','Cannot see pipeline details','No team or settings access'] },
            ].map(r => (
              <div key={r.role} style={{ background:'#141929', border:`1px solid rgba(255,255,255,0.07)`, padding:'16px 18px', borderTop:`2px solid ${r.color}` }}>
                <div style={{ fontWeight:700, color:'#fff', marginBottom:10, fontSize:'.9rem' }}>{r.role}</div>
                {r.perms.map(p => (
                  <div key={p} style={{ fontSize:'.78rem', color:'#9AA0B8', display:'flex', gap:6, marginBottom:6 }}>
                    <span style={{ color: r.color, flexShrink:0 }}>›</span>{p}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
