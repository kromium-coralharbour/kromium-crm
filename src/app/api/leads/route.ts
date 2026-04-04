import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { scoreLeadFromForm, getAutoTasks } from '@/lib/scoring'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const NOTIFY_EMAIL = process.env.NOTIFICATION_EMAIL ?? 'hello@kromiumdigital.com'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const supabase = await createClient()

    const {
      first_name, last_name, email, phone, company, country, industry,
      website, social_instagram, social_facebook, social_linkedin, social_other,
      referral_source, form_type,
      ...formData
    } = body

    if (!email || !form_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Score the lead
    const allData = { ...formData, industry, country, phone, website, referral_source }
    const { total, tier, breakdown } = scoreLeadFromForm(form_type, allData)

    // Insert lead
    const { data: lead, error: leadErr } = await supabase.from('leads').insert({
      first_name: first_name ?? email.split('@')[0],
      last_name:  last_name ?? '',
      email, phone, company, country, industry,
      website, social_instagram, social_facebook, social_linkedin, social_other,
      referral_source, form_type,
      lead_score:     total,
      lead_tier:      tier,
      status:         'new',
      form_data:      formData,
      score_breakdown: breakdown,
    }).select().single()

    if (leadErr || !lead) {
      console.error('Lead insert error:', leadErr)
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
    }

    // Auto-generate tasks
    const name  = `${first_name ?? ''} ${last_name ?? ''}`.trim() || email
    const auto  = getAutoTasks(tier, name)
    const now   = Date.now()

    if (auto.length > 0) {
      await supabase.from('tasks').insert(
        auto.map(t => ({
          title:          t.title,
          description:    t.description,
          priority:       t.priority,
          status:         'open',
          lead_id:        lead.id,
          due_date:       new Date(now + t.dueHours * 3600000).toISOString(),
          auto_generated: true,
        }))
      )
    }

    // Create notification for HOT leads
    if (tier === 'hot') {
      await supabase.from('notifications').insert({
        type:  'hot_lead',
        title: `HOT Lead: ${name}`,
        body:  `Score ${total}/100 — ${form_type.replace(/-/g,' ')} — ${country ?? 'Unknown'} — Respond within 2 hours`,
        link:  `/enquiries/${lead.id}`,
        read:  false,
      })
    }

    // Send email notification (always)
    const tierEmoji = tier === 'hot' ? '🔥' : tier === 'warm' ? '⚡' : '📧'
    const tierLabel = tier.toUpperCase()

    await resend.emails.send({
      from:    'Kromium CRM <onboarding@resend.dev>',
      to:      [NOTIFY_EMAIL],
      subject: `${tierEmoji} [${tierLabel}] New lead: ${name} — ${form_type.replace(/-/g,' ')}`,
      html:    buildEmailHTML({ lead: { ...lead, first_name, last_name, email, phone, company, country, industry, referral_source, form_type }, total, tier, breakdown, name, auto }),
    })

    await supabase.from('leads').update({ email_sent: true }).eq('id', lead.id)

    return NextResponse.json({ success: true, lead_id: lead.id, score: total, tier })
  } catch (err) {
    console.error('Lead submission error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function buildEmailHTML({ lead, total, tier, breakdown, name, auto }: any) {
  const tierColor  = tier === 'hot' ? '#EF4444' : tier === 'warm' ? '#F59E0B' : '#6B7794'
  const tierLabel  = tier.toUpperCase()
  const tierEmoji  = tier === 'hot' ? '🔥' : tier === 'warm' ? '⚡' : '📧'
  const appUrl     = process.env.NEXT_PUBLIC_APP_URL ?? 'https://kromium-crm.vercel.app'

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0B0E1A;font-family:Inter,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">

  <div style="margin-bottom:28px;">
    <div style="font-family:Outfit,sans-serif;font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px;">
      KROMIUM<span style="color:#F26419;">.</span>
    </div>
    <div style="font-size:11px;color:#6B7794;letter-spacing:2px;text-transform:uppercase;margin-top:4px;">Agency CRM</div>
  </div>

  <div style="background:#141929;border:1px solid rgba(255,255,255,0.07);padding:28px;margin-bottom:16px;border-top:3px solid ${tierColor};">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
      <span style="font-size:24px;">${tierEmoji}</span>
      <div>
        <div style="font-family:Outfit,sans-serif;font-size:18px;font-weight:700;color:#fff;">${name}</div>
        <div style="font-size:13px;color:#9AA0B8;margin-top:2px;">${lead.form_type?.replace(/-/g,' ')} &middot; ${lead.country ?? '—'}</div>
      </div>
      <div style="margin-left:auto;text-align:right;">
        <div style="font-family:Outfit,sans-serif;font-size:28px;font-weight:800;color:${tierColor};">${total}</div>
        <div style="font-size:10px;color:#6B7794;letter-spacing:1px;text-transform:uppercase;">Score</div>
      </div>
    </div>

    <div style="background:rgba(255,255,255,0.04);border-left:3px solid ${tierColor};padding:10px 14px;margin-bottom:20px;">
      <span style="font-size:11px;font-weight:700;color:${tierColor};letter-spacing:1px;text-transform:uppercase;">${tierLabel} TIER</span>
      <div style="font-size:13px;color:#9AA0B8;margin-top:4px;">
        ${tier === 'hot' ? 'Respond within 2 hours' : tier === 'warm' ? 'Respond within 24 hours' : 'Add to nurture sequence'}
      </div>
    </div>

    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      <tr><td style="padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.07);font-size:12px;color:#6B7794;width:120px;">Email</td><td style="padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.07);font-size:13px;color:#EEF0F5;">${lead.email}</td></tr>
      ${lead.phone ? `<tr><td style="padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.07);font-size:12px;color:#6B7794;">Phone</td><td style="padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.07);font-size:13px;color:#EEF0F5;">${lead.phone}</td></tr>` : ''}
      ${lead.company ? `<tr><td style="padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.07);font-size:12px;color:#6B7794;">Company</td><td style="padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.07);font-size:13px;color:#EEF0F5;">${lead.company}</td></tr>` : ''}
      <tr><td style="padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.07);font-size:12px;color:#6B7794;">Industry</td><td style="padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.07);font-size:13px;color:#EEF0F5;text-transform:capitalize;">${lead.industry?.replace(/_/g,' ') ?? '—'}</td></tr>
      <tr><td style="padding:7px 0;font-size:12px;color:#6B7794;">Source</td><td style="padding:7px 0;font-size:13px;color:#EEF0F5;text-transform:capitalize;">${lead.referral_source?.replace(/_/g,' ') ?? '—'}</td></tr>
    </table>

    ${Object.keys(breakdown).length > 0 ? `
    <div style="margin-bottom:20px;">
      <div style="font-size:11px;font-weight:700;color:#6B7794;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">Score Breakdown</div>
      ${Object.entries(breakdown).map(([k,v]) => `
        <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.05);font-size:12px;">
          <span style="color:#9AA0B8;">${k}</span>
          <span style="color:#F26419;font-weight:700;">+${v}</span>
        </div>`).join('')}
    </div>` : ''}

    ${auto.length > 0 ? `
    <div>
      <div style="font-size:11px;font-weight:700;color:#6B7794;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">Auto-Generated Tasks</div>
      ${auto.map((t: any) => `<div style="padding:7px 10px;background:rgba(255,255,255,0.04);border-left:2px solid #F26419;margin-bottom:6px;font-size:12px;color:#9AA0B8;">${t.title}</div>`).join('')}
    </div>` : ''}

    <div style="margin-top:24px;text-align:center;">
      <a href="${appUrl}/enquiries/${lead.id}" style="display:inline-block;background:#F26419;color:#fff;padding:12px 28px;font-family:Outfit,sans-serif;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;text-decoration:none;clip-path:polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%);">
        View Lead in CRM →
      </a>
    </div>
  </div>

  <div style="text-align:center;font-size:11px;color:#6B7794;">
    Kromium Digital &middot; hello@kromiumdigital.com &middot; (246) 232-1006
  </div>
</div>
</body>
</html>`
}
