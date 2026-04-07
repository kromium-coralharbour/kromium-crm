import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DebugPage() {
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  
  // Try the exact same query the layout does
  let profileResult: any = null
  let profileError: any = null
  if (session?.user?.id) {
    const res = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
    profileResult = res.data
    profileError  = res.error
  }

  // Try listing all profiles
  const { data: allProfiles, error: listError } = await supabase.from('profiles').select('*')

  return (
    <div style={{ background:'#0B0E1A', minHeight:'100vh', padding:32, fontFamily:'monospace', color:'#EEF0F5' }}>
      <h1 style={{ color:'#F26419', marginBottom:24 }}>Debug — Server State</h1>

      <h2 style={{ color:'#9AA0B8', marginBottom:8, fontSize:14 }}>Session:</h2>
      <pre style={{ background:'#141929', padding:16, marginBottom:24, fontSize:12, whiteSpace:'pre-wrap' }}>
        {JSON.stringify({ hasSession: !!session, userId: session?.user?.id, email: session?.user?.email }, null, 2)}
      </pre>

      <h2 style={{ color:'#9AA0B8', marginBottom:8, fontSize:14 }}>Profile lookup (by session user id):</h2>
      <pre style={{ background:'#141929', padding:16, marginBottom:24, fontSize:12, whiteSpace:'pre-wrap' }}>
        {JSON.stringify({ profile: profileResult, error: profileError }, null, 2)}
      </pre>

      <h2 style={{ color:'#9AA0B8', marginBottom:8, fontSize:14 }}>All rows in profiles table:</h2>
      <pre style={{ background:'#141929', padding:16, marginBottom:24, fontSize:12, whiteSpace:'pre-wrap' }}>
        {JSON.stringify({ rows: allProfiles, error: listError }, null, 2)}
      </pre>

      <h2 style={{ color:'#9AA0B8', marginBottom:8, fontSize:14 }}>Cookies ({allCookies.length}):</h2>
      <pre style={{ background:'#141929', padding:16, fontSize:12, whiteSpace:'pre-wrap' }}>
        {JSON.stringify(allCookies.map(c => ({ name: c.name, len: c.value.length })), null, 2)}
      </pre>
    </div>
  )
}
