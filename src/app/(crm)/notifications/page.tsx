import { createClient } from '@/lib/supabase/server'
import NotificationsClient from './NotificationsClient'

export default async function NotificationsPage() {
  const supabase = await createClient()
  const { data: notifs } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)
  return <NotificationsClient initialNotifs={notifs ?? []} />
}
