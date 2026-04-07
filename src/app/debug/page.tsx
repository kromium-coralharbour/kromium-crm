import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export default async function DebugPage() {
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()

  const supabase = await createClient()
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  const { data: { user }, error: userError } = await supabase.auth.getUser().catch(() => ({ data: { user: null }, error: 'threw' }))

  return (
    <div style={{ background:'#0B0E1A', minHeight:'100vh', padding:32, fontFamily:'monospace', color:'#EEF0F5' }}>
      <h1 style={{ color:'#F26419', marginBottom:24 }}>Debug — Server State</h1>

      <h2 style={{ color:'#9AA0B8', marginBottom:8, fontSize:14 }}>Cookies visible to server ({allCookies.length} total):</h2>
      <pre style={{ background:'#141929', padding:16, marginBottom:24, fontSize:12, overflow:'auto', whiteSpace:'pre-wrap' }}>
        {JSON.stringify(allCookies.map(c => ({ name: c.name, valueLength: c.value.length, preview: c.value.slice(0, 60) + '...' })), null, 2)}
      </pre>

      <h2 style={{ color:'#9AA0B8', marginBottom:8, fontSize:14 }}>getSession() result:</h2>
      <pre style={{ background:'#141929', padding:16, marginBottom:24, fontSize:12, overflow:'auto', whiteSpace:'pre-wrap' }}>
        {JSON.stringify({
          hasSession: !!session,
          userId: session?.user?.id ?? null,
          email: session?.user?.email ?? null,
          expiresAt: session?.expires_at ?? null,
          error: sessionError?.message ?? null,
        }, null, 2)}
      </pre>

      <h2 style={{ color:'#9AA0B8', marginBottom:8, fontSize:14 }}>getUser() result:</h2>
      <pre style={{ background:'#141929', padding:16, marginBottom:24, fontSize:12, overflow:'auto', whiteSpace:'pre-wrap' }}>
        {JSON.stringify({
          hasUser: !!user,
          email: user?.email ?? null,
          error: typeof userError === 'string' ? userError : userError?.message ?? null,
        }, null, 2)}
      </pre>
    </div>
  )
}
