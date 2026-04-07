'use client'
import { useState } from 'react'
import GenerateProposalModal from '@/components/GenerateProposalModal'

interface Props { lead: any; notes: any[] }

export default function GenerateProposalSection({ lead, notes }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <GenerateProposalModal lead={lead} notes={notes} open={open} onClose={() => setOpen(false)} />
      <div style={{ background:'#141929', border:'1px solid rgba(255,255,255,0.07)', padding:'14px 18px', marginBottom:12, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'.88rem', fontWeight:700, color:'#fff', marginBottom:2 }}>Generate Proposal</div>
          <div style={{ fontSize:'.75rem', color:'#6B7794' }}>Pre-filled from this enquiry and all associated notes</div>
        </div>
        <button
          onClick={() => setOpen(true)}
          style={{ padding:'8px 20px', background:'#F26419', color:'#fff', border:'none', fontFamily:'Outfit,sans-serif', fontSize:'.78rem', fontWeight:700, letterSpacing:'.04em', textTransform:'uppercase', cursor:'pointer', clipPath:'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)', flexShrink:0 }}
        >
          + Generate Proposal
        </button>
      </div>
    </>
  )
}
