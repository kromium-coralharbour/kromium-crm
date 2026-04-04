import { createClient } from '@/lib/supabase/server'
import Topbar from '@/components/Topbar'
import { Card } from '@/components/ui'
import { fmtRelative } from '@/lib/utils'
import Link from 'next/link'

const ICONS: Record<string, string> = {
  hot_lead: '🔥', new_lead: '📧', task: '✅', payment: '💰', proposal: '📋', general: '🔔'
}

export default async function NotificationsPage() {
  const supabase = await createClient()
  const { data: notifs } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <>
      <Topbar title="Notifications" action={{ label:'Mark all read' }} />
      <div style={{ flex:1, overflowY:'auto', padding:24 }}>
        <Card>
          {(notifs ?? []).length === 0 && (
            <div style={{ padding:48, textAlign:'center', color:'#6B7794' }}>No notifications</div>
          )}
          {(notifs ?? []).map((n: any) => (
            <Link key={n.id} href={n.link ?? '#'} style={{ textDecoration:'none' }}>
              <div style={{
                padding:'14px 18px', borderBottom:'1px solid rgba(255,255,255,0.07)',
                cursor:'pointer', transition:'background .15s',
                borderLeft: !n.read ? `3px solid ${n.type === 'hot_lead' ? '#EF4444' : '#F26419'}` : '3px solid transparent',
                background: !n.read ? 'rgba(255,255,255,0.02)' : 'transparent',
              }}
              className="hover:bg-white/[0.03]"
              >
                <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  <span style={{ fontSize:'1.1rem', flexShrink:0 }}>{ICONS[n.type] ?? '🔔'}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:'.85rem', color:'#EEF0F5', fontWeight: n.read ? 400 : 600, lineHeight:1.5 }}>{n.title}</div>
                    <div style={{ fontSize:'.8rem', color:'#9AA0B8', lineHeight:1.5, marginTop:2 }}>{n.body}</div>
                    <div style={{ fontSize:'.72rem', color:'#6B7794', marginTop:4 }}>{fmtRelative(n.created_at)}</div>
                  </div>
                  {!n.read && <div style={{ width:7, height:7, borderRadius:'50%', background:'#F26419', flexShrink:0, marginTop:4 }} />}
                </div>
              </div>
            </Link>
          ))}
        </Card>
      </div>
    </>
  )
}
