import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { scoreLeadFromForm, getAutoTasks } from '@/lib/scoring'

// Map form field names to standard lead fields
function extractContactFields(body: Record<string, any>) {
  return {
    first_name:       body.first_name ?? body.name?.split(' ')[0] ?? '',
    last_name:        body.last_name  ?? body.name?.split(' ').slice(1).join(' ') ?? '',
    email:            body.email      ?? '',
    phone:            body.phone      ?? null,
    company:          body.company    ?? null,
    country:          body.country    ?? null,
    industry:         body.industry   ?? null,
    website:          body.website    ?? null,
    social_instagram: body.social_instagram ?? null,
    social_facebook:  body.social_facebook  ?? null,
    social_linkedin:  body.social_linkedin  ?? null,
    social_other:     body.social_other     ?? null,
    referral_source:  body.referral_source  ?? null,
  }
}

// Extract the form-specific data (everything except contact fields)
function extractFormData(body: Record<string, any>) {
  const contactKeys = new Set([
    'name','first_name','last_name','email','phone','company',
    'website','social_instagram','social_facebook','social_linkedin',
    'social_other','referral_source','form_type','viewport','manual_entry',
  ])
  const formData: Record<string, any> = {}
  for (const [k, v] of Object.entries(body)) {
    if (!contactKeys.has(k) && v !== '' && v !== null && v !== undefined) {
      formData[k] = v
    }
  }
  return formData
}

// Human-readable label for each form type
const FORM_LABELS: Record<string, string> = {
  'get-a-custom-crm-quote':   'Custom CRM Quote',
  'start-a-website-project':  'Website & SEO',
  'start-a-brand-project':    'Brand & Identity',
  'get-a-marketing-proposal': 'Marketing Proposal',
  'discuss-a-retainer':       'Business Optimisation',
  'book-a-discovery-call':    'Discovery Call',
  'get-a-proposal':           'Get a Proposal',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const supabase = await createClient()

    const form_type = body.form_type ?? 'unknown'
    const contact   = extractContactFields(body)
    const formData  = extractFormData(body)

    if (!contact.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Score the lead
    const scoringInput = { ...formData, industry: contact.industry, country: contact.country, phone: contact.phone, website: contact.website, referral_source: contact.referral_source }
    const { total, tier, breakdown } = scoreLeadFromForm(form_type, scoringInput)

    // Insert lead
    const { data: lead, error: leadErr } = await supabase.from('leads').insert({
      ...contact,
      form_type,
      lead_score:      total,
      lead_tier:       tier,
      status:          'new',
      form_data:       formData,
      score_breakdown: breakdown,
      email_sent:      false,
    }).select().single()

    if (leadErr || !lead) {
      console.error('Lead insert error:', leadErr)
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
    }

    // Auto-generate follow-up tasks
    const name  = `${contact.first_name} ${contact.last_name}`.trim() || contact.email
    const tasks = getAutoTasks(tier, name)

    if (tasks.length > 0) {
      await supabase.from('tasks').insert(
        tasks.map(t => ({
          title:          t.title,
          description:    t.description,
          priority:       t.priority,
          status:         'open',
          lead_id:        lead.id,
          due_date:       new Date(Date.now() + t.dueHours * 3600000).toISOString(),
          auto_generated: true,
        }))
      )
    }

    // Dashboard notification for HOT leads
    if (tier === 'hot') {
      await supabase.from('notifications').insert({
        type:  'hot_lead',
        title: `HOT Lead: ${name}`,
        body:  `Score ${total}/100 — ${FORM_LABELS[form_type] ?? form_type} — ${contact.country ?? 'Unknown'} — Respond within 2 hours`,
        link:  `/enquiries/${lead.id}`,
        read:  false,
      })
    }

    return NextResponse.json({
      success:  true,
      lead_id:  lead.id,
      score:    total,
      tier,
      form_type,
    })

  } catch (err: any) {
    console.error('Lead submission error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
