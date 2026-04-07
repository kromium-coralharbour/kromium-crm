'use client'
import { useState } from 'react'
import { useEffect } from 'react'
import Link from 'next/link'
import Topbar from '@/components/Topbar'
import { Card, StatusBadge } from '@/components/ui'
import { fmtFull$, fmtDate } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import NewProspectProposalModal from '@/components/NewProspectProposalModal'

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<any[]>([])
  const [showNew,   setShowNew]   = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('proposals')
      .select('*,leads(first_name,last_name),clients(company_name)')
      .order('created_at', { ascending: false })
      .then(({ data }) => setProposals(data ?? []))
  }, [])

  const STATUS_COLORS: Record<string,string> = {
    draft:'#6B7794', sent:'#3B82F6', negotiating:'#F59E0B', won:'#22C55E', lost:'#EF4444',
  }

  return (
    <>
      <NewProspectProposalModal open={showNew} onClose={() => setShowNew(false)} />
      <Topbar title="Proposals" action={{ label:'+ New Proposal', onClick: () => setShowNew(true) }} />
      <div style={{ flex:1, overflowY:'auto', padding:24 }}>

        {/* Quick action */}
        <div style={{ background:'rgba(242,100,25,0.06)', border:'1px solid rgba(242,100,25,0.2)', padding:'14px 18px', marginBottom:20, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
          <div>
            <div style={{ fontFamily:'Outfit,sans-serif', fontWeight:700, color:'#fff', marginBottom:3 }}>Create a proposal for a new prospect</div>
            <div style={{ fontSize:'.82rem', color:'#9AA0B8' }}>For someone not yet in the CRM. Adds them as a lead and opens the proposal editor ready for AI generation.</div>
          </div>
          <button onClick={() => setShowNew(true)} style={{ padding:'9px 20px', background:'#F26419', color:'#fff', border:'none', fontFamily:'Outfit,sans-serif', fontSize:'.82rem', fontWeight:700, cursor:'pointer', clipPath:'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)', flexShrink:0 }}>
            Start New Proposal
          </button>
        </div>

        <Card>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr>
                  {['Proposal','Recipient','Status','Value','Created','Valid Until'].map(h => (
                    <th key={h} style={{ fontSize:'.65rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#6B7794', padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', textAlign:'left', background:'#141929', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {proposals.length === 0 && (
                  <tr><td colSpan={6} style={{ padding:48, textAlign:'center', color:'#6B7794' }}>No proposals yet. Click "+ New Proposal" to get started.</td></tr>
                )}
                {proposals.map((p: any) => {
                  const recipient = p.clients?.company_name ?? (p.leads ? `${p.leads.first_name} ${p.leads.last_name}` : '—')
                  return (
                    <tr key={p.id} onClick={() => window.location.href = `/proposals/${p.id}`} style={{ cursor:'pointer', borderBottom:'1px solid rgba(255,255,255,0.04)' }} className="hover:bg-white/[0.02]">
                      <td style={{ padding:'11px 16px' }}>
                        <div style={{ fontWeight:600, color:'#EEF0F5', fontSize:'.85rem' }}>{p.title}</div>
                        {p.services?.length > 0 && (
                          <div style={{ fontSize:'.7rem', color:'#6B7794', marginTop:2 }}>{p.services.slice(0,2).join(', ')}{p.services.length > 2 ? ` +${p.services.length-2} more` : ''}</div>
                        )}
                      </td>
                      <td style={{ padding:'11px 16px', fontSize:'.83rem', color:'#9AA0B8' }}>{recipient}</td>
                      <td style={{ padding:'11px 16px' }}>
                        <span style={{ fontSize:'.7rem', fontWeight:700, letterSpacing:'.06em', textTransform:'uppercase', padding:'3px 8px', background:`rgba(${STATUS_COLORS[p.status]?.slice(1).match(/.{2}/g)?.map((h:string)=>parseInt(h,16)).join(',')},0.12)`, color: STATUS_COLORS[p.status] || '#6B7794' }}>
                          {p.status}
                        </span>
                      </td>
                      <td style={{ padding:'11px 16px', fontSize:'.85rem', color:'#22C55E', fontWeight:700 }}>{fmtFull$(p.value)}</td>
                      <td style={{ padding:'11px 16px', fontSize:'.78rem', color:'#6B7794' }}>{fmtDate(p.created_at)}</td>
                      <td style={{ padding:'11px 16px', fontSize:'.78rem', color:'#6B7794' }}>{p.valid_until ? fmtDate(p.valid_until) : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  )
}
