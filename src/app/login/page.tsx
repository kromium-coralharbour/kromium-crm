'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [debug,    setDebug]    = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setDebug('Attempting login...')

    try {
      const supabase = createClient()
      setDebug('Supabase client created. Calling signInWithPassword...')

      const result = await supabase.auth.signInWithPassword({ email, password })

      setDebug(`Result received. Error: ${result.error?.message ?? 'none'}. Session: ${result.data.session ? 'YES' : 'NO'}. User: ${result.data.user?.email ?? 'none'}`)

      if (result.error) {
        setError(result.error.message)
        setLoading(false)
        return
      }

      if (!result.data.session) {
        setError('No session returned — login may have failed silently')
        setLoading(false)
        return
      }

      setDebug('Login successful. Redirecting...')
      // Use window.location instead of router.push to force a full page reload
      window.location.href = '/dashboard'

    } catch (err: any) {
      setError(`Exception: ${err?.message ?? String(err)}`)
      setDebug(`Caught exception: ${JSON.stringify(err)}`)
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'#0B0E1A', position:'relative', overflow:'hidden'
    }}>
      <div style={{ width:'100%', maxWidth:'420px', padding:'0 24px', position:'relative', zIndex:2 }}>
        <div style={{ textAlign:'center', marginBottom:'40px' }}>
          <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'1.8rem', fontWeight:800, color:'#fff', letterSpacing:'-.02em' }}>
            KROMIUM<span style={{ color:'#F26419' }}>.</span>
          </div>
          <div style={{ fontSize:'.78rem', color:'#6B7794', letterSpacing:'.1em', textTransform:'uppercase', marginTop:'4px' }}>
            Agency CRM
          </div>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ background:'#141929', border:'1px solid rgba(255,255,255,0.07)', padding:'32px', position:'relative' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:'#F26419' }} />

            <div style={{ marginBottom:'20px' }}>
              <label style={{ display:'block', fontSize:'.72rem', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'#9AA0B8', marginBottom:'8px' }}>Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email"
                style={{ width:'100%', background:'#192035', border:'1px solid rgba(255,255,255,0.07)', color:'#EEF0F5', fontSize:'.9rem', padding:'10px 14px', outline:'none', fontFamily:'Inter,sans-serif' }}
                placeholder="you@kromiumdigital.com"
              />
            </div>

            <div style={{ marginBottom:'24px' }}>
              <label style={{ display:'block', fontSize:'.72rem', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'#9AA0B8', marginBottom:'8px' }}>Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password"
                style={{ width:'100%', background:'#192035', border:'1px solid rgba(255,255,255,0.07)', color:'#EEF0F5', fontSize:'.9rem', padding:'10px 14px', outline:'none', fontFamily:'Inter,sans-serif' }}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', color:'#EF4444', padding:'10px 14px', fontSize:'.82rem', marginBottom:'16px', lineHeight:1.5 }}>
                {error}
              </div>
            )}

            {debug && (
              <div style={{ background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.3)', color:'#93C5FD', padding:'10px 14px', fontSize:'.75rem', marginBottom:'16px', lineHeight:1.6, fontFamily:'monospace', wordBreak:'break-all' }}>
                {debug}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              style={{
                width:'100%', background: loading ? '#333' : '#F26419', color:'#fff',
                border:'none', padding:'13px', fontFamily:'Outfit,sans-serif',
                fontSize:'.9rem', fontWeight:700, letterSpacing:'.04em', textTransform:'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
                clipPath:'polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div style={{ textAlign:'center', marginTop:'20px', fontSize:'.75rem', color:'#6B7794' }}>
          Authorised personnel only &middot; Kromium Digital
        </div>
      </div>
    </div>
  )
}
