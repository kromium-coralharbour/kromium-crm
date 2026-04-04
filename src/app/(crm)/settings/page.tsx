import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Topbar from '@/components/Topbar'
import { Card, CardHead } from '@/components/ui'
import { PROJECT_TASK_TEMPLATES } from '@/lib/scoring'
import SettingsClient from './SettingsClient'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id ?? '').single()

  if (profile?.role !== 'admin') redirect('/dashboard')

  return (
    <>
      <Topbar title="Settings" />
      <div style={{ flex:1, overflowY:'auto', padding:24 }}>
        <SettingsClient templates={PROJECT_TASK_TEMPLATES} />
      </div>
    </>
  )
}
