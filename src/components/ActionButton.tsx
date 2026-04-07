'use client'
import { useState } from 'react'
import NewLeadModal from '@/components/NewLeadModal'
import NewProjectModal from '@/components/NewProjectModal'
import { NewClientModal, NewTaskModal, NewProposalModal, AddRevenueModal, AddNoteModal } from '@/components/Modals'

type ModalType = 'lead' | 'client' | 'project' | 'proposal' | 'revenue' | 'task' | 'note' | null

interface Props {
  type: ModalType
  label: string
  clientId?: string
  leadId?: string
  projectId?: string
}

export default function ActionButton({ type, label, clientId, leadId, projectId }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display:'inline-flex', alignItems:'center', gap:6,
          padding:'7px 16px', background:'#F26419', color:'#fff',
          border:'none', fontFamily:'Outfit,sans-serif', fontSize:'.8rem',
          fontWeight:700, letterSpacing:'.04em', textTransform:'uppercase',
          cursor:'pointer',
          clipPath:'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)',
          transition:'background .15s',
        }}
      >
        {label}
      </button>

      {type === 'lead'     && <NewLeadModal     open={open} onClose={() => setOpen(false)} />}
      {type === 'client'   && <NewClientModal   open={open} onClose={() => setOpen(false)} />}
      {type === 'project'  && <NewProjectModal  open={open} onClose={() => setOpen(false)} clientId={clientId} />}
      {type === 'proposal' && <NewProposalModal open={open} onClose={() => setOpen(false)} leadId={leadId} clientId={clientId} />}
      {type === 'revenue'  && <AddRevenueModal  open={open} onClose={() => setOpen(false)} clientId={clientId} />}
      {type === 'task'     && <NewTaskModal     open={open} onClose={() => setOpen(false)} leadId={leadId} />}
      {type === 'note'     && <AddNoteModal     open={open} onClose={() => setOpen(false)} leadId={leadId} clientId={clientId} projectId={projectId} />}
    </>
  )
}
