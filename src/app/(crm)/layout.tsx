import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/Sidebar'
import type { Profile } from '@/lib/types'

export default async function CRMLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  // Get counts for badges
  const [{ count: hotCount }, { count: taskCount }, { count: notifCount }] = await Promise.all([
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('lead_tier', 'hot').eq('status', 'new'),
    supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('status', 'open').lte('due_date', new Date(Date.now() + 86400000).toISOString()),
    supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('read', false),
  ])

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden' }}>
      <Sidebar
        profile={profile as Profile}
        hotCount={hotCount ?? 0}
        taskCount={taskCount ?? 0}
        notifCount={notifCount ?? 0}
      />
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {children}
      </div>
    </div>
  )
}
