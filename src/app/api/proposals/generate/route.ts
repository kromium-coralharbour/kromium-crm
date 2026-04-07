import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured in Vercel environment variables' }, { status: 500 })

  const body = await req.json()
  const { serviceType, clientData, formData, notes, sectionId, sectionTitle } = body

  const company = clientData?.company || `${clientData?.firstName || ''} ${clientData?.lastName || ''}`.trim() || 'the client'
  const industry = (clientData?.industry || '').replace(/_/g, ' ')
  const country = clientData?.country || 'the Caribbean'

  const clientContext = [
    clientData?.company        && `Company: ${clientData.company}`,
    clientData?.firstName      && `Contact: ${clientData.firstName} ${clientData.lastName || ''}`.trim(),
    industry                   && `Industry: ${industry}`,
    country                    && `Location: ${country}`,
    clientData?.website        && `Website: ${clientData.website}`,
    clientData?.phone          && `Phone: ${clientData.phone}`,
  ].filter(Boolean).join('\n')

  const skip = new Set(['name','first_name','last_name','email','phone','company','website','country',
    'social_instagram','social_facebook','social_linkedin','social_other','referral_source','form_type',
    'manual_entry','viewport','industry'])

  const formContext = Object.entries(formData || {})
    .filter(([k, v]) => !skip.has(k) && v && v !== '')
    .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${Array.isArray(v) ? v.join(', ') : String(v)}`)
    .join('\n')

  const notesContext = (notes || []).length
    ? (notes as any[]).map((n: any) => `${n.profiles?.full_name || n.author || 'Team'}: ${n.content}`).join('\n\n')
    : ''

  const sectionInstructions = getSectionInstructions(sectionId, serviceType, company, industry, country, formData)

  const prompt = `You are writing a proposal section for Kromium Marketing and Development Inc., a premium Caribbean digital transformation agency based in Barbados. You are writing the "${sectionTitle}" section of a ${serviceType} proposal.

WRITING VOICE AND STYLE:
- Confident, warm, and relationship-led. Not salesy. The tone of a senior trusted advisor.
- Write in full paragraphs. Use numbered or bulleted lists only for specific deliverable breakdowns.
- Speak directly to the client using "you" throughout. Address their specific situation.
- Use real specificity. Reference their industry, country, and goals from the context.
- Never over-promise. "We are confident" not "we guarantee".
- Never use em dashes. Use commas or restructure the sentence.
- No emoji, no exclamation marks.
- Write as if Kromium has already done the homework on this client.
- Be comprehensive and thorough. Each section should be substantial - 3 to 5 solid paragraphs minimum unless it is a structured list.
- Match the warmth and partnership language of the Massy Stores and FCPAS proposals: "we are committed to", "our team will", "together we can".

CLIENT CONTEXT:
${clientContext}

ENQUIRY AND FORM DETAILS:
${formContext || 'No form data provided.'}

NOTES FROM TEAM OR DISCOVERY:
${notesContext || 'No notes provided.'}

SERVICE TYPE: ${serviceType}

SECTION: ${sectionTitle}

INSTRUCTIONS FOR THIS SECTION:
${sectionInstructions}

Write the ${sectionTitle} section now. Do not include the section heading. Write directly to ${company} using their specific context. Be thorough and comprehensive.`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    return NextResponse.json({ error: `API error: ${err}` }, { status: 500 })
  }

  const data = await response.json()
  const content = data.content?.[0]?.text ?? ''

  return NextResponse.json({ content })
}

function getSectionInstructions(sectionId: string, serviceType: string, company: string, industry: string, country: string, formData: any, sectionTitle?: string): string {
  const fd = formData || {}

  const base: Record<string, string> = {
    'executive-summary': `Write a warm, confident executive summary that opens by acknowledging the opportunity to work with ${company}, references their specific industry (${industry}) and location (${country}), articulates the core problem or opportunity clearly, states what Kromium will deliver and the outcome, and closes with a forward-looking partnership statement. Minimum 3 paragraphs. This should feel personally written for ${company}, not templated.`,

    'about-kromium': `Write a full About Kromium section covering: who Kromium is (premier Caribbean digital transformation agency, Barbados, 7+ years experience), our mission (tailored digital solutions that drive engagement and deliver measurable results), our philosophy (quality over quantity, selective client approach, data-driven strategies, commitment to excellence), and our exclusivity (limited new client intake ensures each partner receives dedicated senior attention). Close by connecting why this matters specifically for ${company}. Write 3-4 paragraphs, warm and authoritative.`,

    'philosophy': `Write a detailed Philosophy and Selective Approach section explaining: Kromium values quality over quantity and takes on a limited number of clients. Our selective approach means we only partner with businesses that align with our standards. Cover three pillars: (1) Data-Driven Solutions: strategies rooted in market research, audience analytics, and performance tracking. (2) Tailored Approach: every campaign uniquely designed for the specific needs and goals of each client. (3) Commitment to Excellence: continuously refining strategies to stay ahead of industry trends. Write this as a genuine statement of values, 2-3 paragraphs.`,

    'team-credentials': `Write the Team and Credentials section. Cover:
Leadership Team:
Jelissa Richards, Chief Content Strategist: 10+ years in digital marketing and campaign management, expert in cross-channel integration and branding strategies, 5+ years in project management for non-profit, HubSpot Certified Content Marketer, professional experience in photography, videography, and graphic design.
Rommel Richards, Chief Advertising Strategist: 10+ years in digital advertising, Meta Blueprint certified advertising professional, Google Search Ads certified specialist.
Core Team: experienced videographers and photographers handling projects from cinematic productions to trending short-form content; skilled graphic designers with a keen eye for branding, a solid grasp of business development, and a deep commitment to brand cohesion; experienced website developers and CRM architects for technical engagements.
Write this as a genuine introduction to the people who will work on ${company}'s account. 2-3 paragraphs.`,

    'case-studies': `Write 2 to 3 detailed case study narratives relevant to ${industry} and ${serviceType}. Use these real Kromium case studies, selecting the most relevant to ${company}'s context:

RIMCO Barbados SRL (heavy-duty equipment, Caribbean-wide): Goal was brand awareness and sales. Strategy: personification of the brand, year-long advertising campaign, customer testimonials for social proof, localized content creation, highlighting social endeavours. Results: 3.59 million impressions, 1,562 interactions, 2,576 followers across platforms. The audience built was quality, not volume, individuals most likely to convert.

Italia Coffee Barbados (food and beverage, 25-year brand): Faced brand stagnation. Over a six-month partnership: brand refresh modernising and streamlining branding across all touchpoints; social media transformation infusing personality and relatability. Results: Instagram grew from a stagnant 12,000 to nearly 15,000 followers, 1.6 million impressions in the first three months, 10,860 interactions.

Barbados Gospelfest (events and culture): Full rebrand and digital refresh. Redesigned festival logo, revamped social media pages, new promotional materials, updated website. Results: Instagram grew from 2,278 to 3,165 (39% increase, a jump not seen in years of the platform's existence). Multiple events during the festival week achieved sold-out attendance.

COSCAP Barbados (professional organization, copyright): Featured Artist Campaign across social media. In-depth interviews with members and featured artists, compelling video content. Results: revived social media following, high engagement on every video released, increased awareness and more artists seeking their services.

Write each case study as a proper narrative, not just bullets. Tell the before, what Kromium did, and the specific results. 3-4 paragraphs total.`,

    'our-plan': `Write "Our Plan for ${company}" as a comprehensive, numbered breakdown of exactly what Kromium will do for this ${serviceType} engagement. This is the most critical section.

Open with a paragraph addressing ${company} directly, acknowledging what makes their business unique and explaining the approach.

Then present each component as a numbered item with a bold title and 2-3 sentences of specific explanation. Tailor the components to ${serviceType} and what was submitted in the enquiry. Cover all relevant elements such as monthly content planning, quarterly creative development, platform management, research and copywriting, community engagement, paid advertising, monthly analytical reports, dedicated team.

Close with a paragraph about the overall commitment to becoming an extension of the ${company} team.

Reference ${industry} specifics and ${country} context throughout. Match the style of the Massy Stores plan section exactly.`,

    'content-strategy': `Write a comprehensive Content Strategy section for ${company} covering: (1) Monthly Content Planning - how the content calendar is developed, presented quarterly for approval, aligned with brand strategy and seasonal goals. (2) Quarterly Creative Development - photography and video production sessions to build a bank of original content. (3) High-Quality Graphics Development - premium custom-designed graphics for campaigns, special offers, brand messaging, optimised per platform. (4) Research and Copywriting - compelling targeted copy informed by ongoing market research, audience behaviour, and competitive analysis. (5) Platform Monitoring and Community Engagement - timely responses, community building, reputation management. (6) Monthly Analytical Reports - key metrics, audience growth, content performance, insights and recommendations. (7) Dedicated Account Team - who manages what. Write this in full paragraphs, specific to ${company} and their ${industry} context in ${country}.`,

    'paid-advertising': `Write a detailed Paid Advertising Strategy section covering: platform recommendations with specific rationale for each (Meta/Facebook/Instagram, Google Ads, LinkedIn), campaign objectives, audience targeting approach, budget recommendation with percentage allocation across platforms, and payment structure. Crucially: explain clearly that the advertising budget is separate from the management fee, and that Kromium strongly recommends the client hold their own card directly in the ad manager platforms for full transparency, direct ownership of campaign data and billing records, and real-time visibility into spend. Cover Stage One vs Stage Two advertising focus (awareness first, then conversion). Be specific about what works for ${company} in ${industry} in ${country}.`,

    'reporting': `Write a comprehensive Reporting and Analytics section covering: Monthly Reports (delivered end of each month, summarising initiatives executed and results achieved), Quarterly Reports (broader view of progress and key performance metrics over each three-month period), End-of-Year Report (comprehensive review highlighting overall results, key milestones, and opportunities for future growth). Explain what metrics are tracked and why they matter. Frame this as a commitment to full transparency and data-driven strategy. Write in full paragraphs, 3-4 minimum.`,

    'phase-plan': `Write a detailed Phase Plan for this ${serviceType} engagement for ${company}. Structure it clearly as Phase 1 / Stage 1 (setup, foundation, audit, launch) and Phase 2 / Stage 2 (growth, ongoing management, optimisation). Within each phase, include a month-by-month breakdown with specific deliverables and outcomes. Reference ${company}'s stated goals and ${country} market context. Close each phase with a clear "Deliverable:" statement. This should read as a concrete commitment of exactly what will happen and when.`,

    'investment': `Write a professional Investment section note explaining: Kromium designs pricing structures based on the specific requirements of each project. The pricing below is a preliminary estimate based on ${company}'s needs. Note that the advertising budget (if applicable) is not included in the management fee and will be invoiced separately or charged directly by the platforms. The services listed are elements of a comprehensive package and any modification may result in price adjustment. Do not include numbers. The table is separate. Write 2-3 paragraphs.`,

    'next-steps': `Write a clear, warm, actionable Next Steps section with three numbered steps:
1. Digital Marketing Audit: once the estimate is approved, Kromium will conduct a comprehensive digital marketing audit analysing the current digital presence, highlighting strengths, weaknesses, and opportunities for growth. Delivered within two weeks.
2. Implementation and Ongoing Work: after the audit is reviewed and approved, Kromium will begin developing two months of content ahead of schedule. Month-to-month execution of agreed strategies with real-time performance adjustments.
3. Reporting and Performance Tracking: monthly, quarterly, and end-of-year reports delivered to keep ${company} fully informed and confident in progress.

Close with a warm, genuine closing paragraph expressing enthusiasm for the partnership. Include contact details: info@kromiumagency.com, +1 246 232 1006, www.kromiumdigital.com.`,

    'conclusion': `Write a warm, confident conclusion for ${company}'s proposal. Reaffirm Kromium's commitment to becoming an extension of their team, reference their specific goals and the ${country} context, express genuine enthusiasm for the partnership (warm but not sycophantic), state confidence in the ability to deliver exceptional results. Close with contact information and a clear invitation to begin. Match the Massy Stores proposal conclusion tone exactly: "We are truly excited about the opportunity to work with the ${company} team and look forward to building a strong, results-driven relationship."`,

    'terms': `Write a professional Terms and Conditions section covering: Exclusions (advertising budget not included in management fees, invoiced separately or charged directly by platforms per the agreed arrangement); Package Pricing (services are offered as a comprehensive package, exclusion or modification of any element may result in price adjustment); Payment Terms (payment due as per the terms specified on the invoice); Minimum Commitment (3-month minimum for ongoing services, 30 days notice to cancel after initial term); Intellectual Property (all content produced belongs to the client on full payment of each invoice). Keep this professional, clear, and fair.`,
  }

  return base[sectionId] || `Write a comprehensive, detailed ${sectionTitle} section for this ${serviceType} proposal for ${company}. Be specific to their ${industry} industry and ${country} context. Write in full paragraphs, at least 3 substantial paragraphs. Match Kromium's warm, confident, relationship-led voice.`
}
