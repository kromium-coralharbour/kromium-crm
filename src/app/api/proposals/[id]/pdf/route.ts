import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import React from 'react'
import ReactPDF, { renderToBuffer } from '@react-pdf/renderer'
import { ProposalPDFDocument } from '@/lib/proposal-pdf'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: proposal } = await supabase
    .from('proposals')
    .select('*,leads(first_name,last_name,email),clients(company_name,email)')
    .eq('id', params.id)
    .single()

  if (!proposal) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const element = React.createElement(ProposalPDFDocument, { proposal }) as any
  const pdfBuffer = await renderToBuffer(element)

  const filename = `${(proposal.title ?? 'proposal').replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-')}.pdf`

  return new NextResponse(pdfBuffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
