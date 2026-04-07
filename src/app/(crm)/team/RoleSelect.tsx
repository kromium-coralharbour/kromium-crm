'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function RoleSelect({ memberId, currentRole, isMe }: { memberId: string; currentRole: string; isMe: boolean }) {
  const [role,   setRole]   = useState(currentRole)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  if (isMe) return <span style={{ fontSize:'.78rem', color:'#6B7794' }}>—</span>

  async function change(newRole: string) {
    setSaving(true)
    await supabase.from('profiles').update({ role: newRole }).eq('id', memberId)
    setRole(newRole)
    setSaving(false)
  }

  return (
    <select
      value={role}
      onChange={e => change(e.target.value)}
      disabled={saving}
      style={{ background:'#192035', border:'1px solid rgba(255,255,255,0.07)', color:'#EEF0F5', fontSize:'.78rem', padding:'5px 8px', cursor:'pointer', outline:'none', opacity: saving ? 0.6 : 1 }}
    >
      <option value="admin">Admin</option>
      <option value="manager">Manager</option>
      <option value="executive">Executive</option>
    </select>
  )
}
