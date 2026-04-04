'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { initials } from '@/lib/utils'
import type { Profile } from '@/lib/types'
import {
  LayoutDashboard, Bell, Inbox, GitBranch, CheckSquare, Mail,
  BarChart3, Users, Layers, FileText, DollarSign,
  UserCog, Settings, LogOut, ChevronDown
} from 'lucide-react'

const NAV = [
  { label: 'Overview', items: [
    { href: '/dashboard',      icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/notifications',  icon: Bell,            label: 'Notifications', badge: 'notif' },
  ]},
  { label: 'Leads', items: [
    { href: '/enquiries',  icon: Inbox,     label: 'Enquiries',    badge: 'hot' },
    { href: '/pipeline',   icon: GitBranch, label: 'Pipeline' },
    { href: '/tasks',      icon: CheckSquare, label: 'Tasks',      badge: 'tasks' },
    { href: '/nurture',    icon: Mail,      label: 'Nurture' },
    { href: '/attribution',icon: BarChart3, label: 'Attribution' },
  ]},
  { label: 'Clients', items: [
    { href: '/clients',   icon: Users,    label: 'Clients' },
    { href: '/projects',  icon: Layers,   label: 'Projects' },
    { href: '/proposals', icon: FileText, label: 'Proposals' },
  ]},
  { label: 'Finance', items: [
    { href: '/revenue', icon: DollarSign, label: 'Revenue' },
  ]},
  { label: 'Admin', items: [
    { href: '/team',     icon: UserCog, label: 'Team' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ]},
]

interface Props {
  profile: Profile
  hotCount?: number
  taskCount?: number
  notifCount?: number
}

export default function Sidebar({ profile, hotCount = 0, taskCount = 0, notifCount = 0 }: Props) {
  const pathname = usePathname()
  const router   = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  function getBadge(key: string) {
    if (key === 'hot'   && hotCount   > 0) return hotCount
    if (key === 'tasks' && taskCount  > 0) return taskCount
    if (key === 'notif' && notifCount > 0) return notifCount
    return null
  }

  const S = {
    sidebar: { width:220, flexShrink:0, background:'#141929', borderRight:'1px solid rgba(255,255,255,0.07)', display:'flex', flexDirection:'column', overflowY:'auto', overflowX:'hidden' } as React.CSSProperties,
    logo:    { padding:'20px 16px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)' },
    wm:      { fontFamily:'Outfit,sans-serif', fontSize:'1.2rem', fontWeight:800, letterSpacing:'-.01em', color:'#fff' },
    nav:     { flex:1, padding:'10px 0', overflowY:'auto' } as React.CSSProperties,
    grpLbl:  { fontSize:'.62rem', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'#6B7794', padding:'10px 16px 4px' } as React.CSSProperties,
    item:    (active: boolean): React.CSSProperties => ({
      display:'flex', alignItems:'center', gap:9, padding:'8px 16px',
      fontSize:'.82rem', fontWeight:500, cursor:'pointer',
      color: active ? '#F26419' : '#9AA0B8',
      background: active ? 'rgba(242,100,25,0.10)' : 'transparent',
      borderLeft: active ? '2px solid #F26419' : '2px solid transparent',
      textDecoration:'none', transition:'all .15s',
    }),
    badge:   (color: string): React.CSSProperties => ({
      marginLeft:'auto', background: color, color:'#fff',
      fontSize:'.6rem', fontWeight:700, padding:'1px 5px',
      borderRadius:10, minWidth:16, textAlign:'center',
    }),
    footer:  { padding:12, borderTop:'1px solid rgba(255,255,255,0.07)' },
    userRow: { display:'flex', alignItems:'center', gap:10, padding:'8px 6px', cursor:'pointer' },
    avatar:  { width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#F26419,#E85A0E)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.7rem', fontWeight:800, color:'#fff', flexShrink:0 },
  }

  return (
    <aside style={S.sidebar}>
      <div style={S.logo}>
        <div style={S.wm}>KROMIUM<span style={{ color:'#F26419' }}>.</span></div>
        <div style={{ fontSize:'.68rem', color:'#6B7794', letterSpacing:'.06em', textTransform:'uppercase', marginTop:2 }}>Agency CRM</div>
      </div>

      <nav style={S.nav}>
        {NAV.map(group => (
          <div key={group.label}>
            <div style={S.grpLbl}>{group.label}</div>
            {group.items.map(item => {
              const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
              const badge  = item.badge ? getBadge(item.badge) : null
              return (
                <Link key={item.href} href={item.href} style={S.item(active)}>
                  <item.icon size={15} />
                  <span>{item.label}</span>
                  {badge ? <span style={S.badge(item.badge === 'hot' ? '#EF4444' : item.badge === 'tasks' ? '#F26419' : '#6B7794')}>{badge}</span> : null}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div style={S.footer}>
        <div style={S.userRow}>
          <div style={S.avatar}>{initials(profile.full_name)}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:'.8rem', fontWeight:600, color:'#EEF0F5', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{profile.full_name}</div>
            <div style={{ fontSize:'.68rem', color:'#6B7794', textTransform:'capitalize' }}>{profile.role}</div>
          </div>
          <div style={{ width:7, height:7, borderRadius:'50%', background:'#22C55E', flexShrink:0, boxShadow:'0 0 0 2px rgba(34,197,94,0.2)' }} />
        </div>
        <button
          onClick={handleLogout}
          style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'7px 6px', background:'none', border:'none', color:'#6B7794', fontSize:'.78rem', cursor:'pointer', marginTop:4 }}
        >
          <LogOut size={13} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  )
}
