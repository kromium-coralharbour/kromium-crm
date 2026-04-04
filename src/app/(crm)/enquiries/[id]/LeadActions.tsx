'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Lead } from '@/lib/types'

const STATUSES = ['new','contacted','proposal_sent','negotiating','won','lost','nurturing']

export default function LeadActions({ lead }: { lead: Lead }) {
  const [status, setStatus] = useState(lead.status)
  const [saving, setSaving] = useState(false)
  const [converting, setConverting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function updateStatus(s: string) {
    setStatus(s as any)
    setSaving(true)
    await supabase.from('leads').update({ status: s }).eq('id', lead.id)
    setSaving(false)
    router.refresh()
  }

  async function convertToClient() {
    setConverting(true)
    const supabase = createClient()
    // Create client record
    const { data: client, error } = await supabase.from('clients').insert({
      lead_id:      lead.id,
      company_name: lead.company ?? `${lead.first_name} ${lead.last_name}`,
      contact_name: `${lead.first_name} ${lead.last_name}`,
      email:        lead.email,
      phone:        lead.phone,
      country:      lead.country,
      industry:     lead.industry,
      website:      lead.website,
      social_instagram: lead.social_instagram,
      social_linkedin:  lead.social_linkedin,
    }).select().single()

    if (!error && client) {
      // Mark lead as won
      await supabase.from('leads').update({ status: 'won' }).eq('id', lead.id)
      router.push(`/clients/${client.id}`)
    }
    setConverting(false)
  }

  return (
    <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
      <button
        onClick={convertToClient}
        disabled={converting || lead.status === 'won'}
        style={{
          display:'inline-flex', alignItems:'center', gap:6, padding:'8px 18px',
          background: lead.status === 'won' ? '#1a2a1a' : '#22C55E', color:'#fff',
          border: lead.status === 'won' ? '1px solid #22C55E' : 'none',
          fontFamily:'Outfit,sans-serif', fontSize:'.8rem', fontWeight:700,
          letterSpacing:'.04em', textTransform:'uppercase',
          cursor: lead.status === 'won' ? 'default' : 'pointer',
          clipPath:'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)',
        }}
      >
        {converting ? 'Converting...' : lead.status === 'won' ? '✓ Converted' : 'Convert to Client'}
      </button>

      <select
        value={status}
        onChange={e => updateStatus(e.target.value)}
        style={{ background:'#192035', border:'1px solid rgba(255,255,255,0.12)', color:'#EEF0F5', fontSize:'.8rem', padding:'8px 12px', cursor:'pointer', outline:'none', fontFamily:'Inter,sans-serif' }}
      >
        {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
      </select>

      <a href={`mailto:${lead.email}`} style={{
        display:'inline-flex', alignItems:'center', padding:'8px 16px',
        background:'transparent', color:'#9AA0B8', border:'1px solid rgba(255,255,255,0.12)',
        fontFamily:'Outfit,sans-serif', fontSize:'.8rem', fontWeight:600, letterSpacing:'.04em',
        textTransform:'uppercase', textDecoration:'none', cursor:'pointer',
      }}>
        Send Email
      </a>

      {lead.phone && (
        <a href={`tel:${lead.phone}`} style={{
          display:'inline-flex', alignItems:'center', padding:'8px 16px',
          background:'transparent', color:'#9AA0B8', border:'1px solid rgba(255,255,255,0.12)',
          fontFamily:'Outfit,sans-serif', fontSize:'.8rem', fontWeight:600, letterSpacing:'.04em',
          textTransform:'uppercase', textDecoration:'none',
        }}>
          Call
        </a>
      )}
      {saving && <span style={{ fontSize:'.75rem', color:'#6B7794' }}>Saving...</span>}
    </div>
  )
}
