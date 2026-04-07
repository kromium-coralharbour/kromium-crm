import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/Sidebar'
import type { Profile } from '@/lib/types'

export default async function CRMLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  // Use getUser for security (verifies with Supabase server)
  // Fall back to getSession if getUser fails (handles cookie timing edge cases)
  let userId: string | null = null
  try {
    const { data: { user } } = await supabase.auth.getUser()
    userId = user?.id ?? null
  } catch {
    const { data: { session } } = await supabase.auth.getSession()
    userId = session?.user?.id ?? null
  }

  if (!userId) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  // If profile doesn't exist yet (race condition on first login), redirect back briefly
  if (!profile) redirect('/login')

  // Badge counts — wrapped in try/catch so a DB error doesn't break the whole layout
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
  } catch { /* non-fatal */ }

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
