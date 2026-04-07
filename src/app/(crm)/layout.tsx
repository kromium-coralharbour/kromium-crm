import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/Sidebar'
import type { Profile } from '@/lib/types'

export default async function CRMLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  // getSession reads the cookie directly - works without middleware refreshing tokens
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (!profile) redirect('/login')

  let hotCount = 0, taskCount = 0, notifCount = 0
  try {
    const [h, t, n] = await Promise.all([
      supabase.from('leads').select('*', { count: 'exact', head: true }).eq('lead_tier', 'hot').eq('status', 'new'),
      supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'open').lte('due_date', new Date(Date.now() + 86400000).toISOString()),
      supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('read', false),
    ])
    hotCount   = h.count ?? 0
    taskCount  = t.count ?? 0
    notifCount = n.count ?? 0
  } catch {}

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden' }}>
      <Sidebar
        profile={profile as Profile}
        hotCount={hotCount}
        taskCount={taskCount}
        notifCount={notifCount}
      />
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {children}
      </div>
    </div>
  )
}
