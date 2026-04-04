import type { LeadTier } from './types'

export interface ScoreResult {
  total: number
  tier: LeadTier
  breakdown: Record<string, number>
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

const CORE_INDUSTRIES = ['real_estate', 'construction', 'hospitality']

export function scoreLeadFromForm(formType: string, formData: Record<string, unknown>): ScoreResult {
  const breakdown: Record<string, number> = {}
  let total = 0

  function add(label: string, pts: number) {
    breakdown[label] = pts
    total += pts
  }

  const industry = formData.industry as string | undefined
  const country  = formData.country  as string | undefined
  const phone    = formData.phone    as string | undefined
  const website  = formData.website  as string | undefined
  const referral = formData.referral_source as string | undefined

  // ── Universal signals ────────────────────────────────────────────────────
  if (industry && CORE_INDUSTRIES.includes(industry)) add('Core industry', 25)
  else if (industry === 'professional')               add('Professional services', 15)
  else if (industry)                                  add('Other industry', 5)

  if (phone)   add('Phone provided', 5)
  if (website) add('Website provided', 5)
  if (referral === 'existing_client' || referral === 'friend') add('Referral source', 15)
  else if (referral === 'google' || referral === 'press')      add('Search/press source', 5)

  // ── Form-specific signals ────────────────────────────────────────────────
  if (formType === 'get-a-custom-crm-quote') {
    const pain      = (formData.pain      as string[] | undefined) ?? []
    const features  = (formData.features  as string[] | undefined) ?? []
    const teamSize  = formData.team_size  as string | undefined
    const timeline  = formData.timeline   as string | undefined
    const budgetRng = formData.budget_range as string | undefined

    if (pain.length >= 3)                         add('3+ pain points', 20)
    if (pain.includes('pipeline') || pain.includes('reporting')) add('Pipeline/reporting pain', 10)
    if (features.length >= 5)                     add('5+ features selected', 15)
    if (features.includes('website') || features.includes('automation')) add('Automation/web capture', 10)
    if (teamSize === '6-15' || teamSize === '16+') add('Team 6+', 15)
    else if (teamSize === '2-5')                   add('Team 2-5', 10)
    if (timeline === 'asap' || timeline === '1-3') add('Near-term timeline', 20)
    else if (timeline === '3-6')                   add('3-6 month timeline', 10)
    if (budgetRng === '15-30k' || budgetRng === '30-60k' || budgetRng === '60k+') add('Budget $15K+', 20)
    else if (budgetRng === '5-15k')                add('Budget $5K-15K', 10)
  }

  if (formType === 'start-a-website-project') {
    const projectType = formData.project_type as string | undefined
    const goal        = formData.goal         as string | undefined
    const brand       = formData.brand_status as string | undefined
    const copy        = formData.copy_status  as string | undefined
    const timeline    = formData.timeline     as string | undefined
    const budget      = Number(formData.budget ?? 0)

    if (projectType && ['new_site','rebuild','both'].includes(projectType)) add('Full project', 20)
    else if (projectType) add('Partial project', 10)
    if (goal && ['leads','bookings','crm'].includes(goal)) add('Conversion goal', 20)
    if (brand === 'full')    add('Brand ready', 10)
    if (copy === 'ready' || copy === 'draft') add('Content ready/draft', 10)
    if (timeline === 'asap' || timeline === '1-2months') add('Near-term timeline', 20)
    else if (timeline === '3months') add('3-month timeline', 10)
    if (budget >= 15000) add('Budget $15K+', 20)
    else if (budget >= 5000) add('Budget $5K-15K', 10)
  }

  if (formType === 'start-a-brand-project') {
    const brandStage   = formData.brand_stage  as string | undefined
    const deliverables = (formData.deliverables as string[] | undefined) ?? []
    const timeline     = formData.timeline     as string | undefined
    const budget       = Number(formData.budget ?? 0)
    const audience     = formData.audience     as string | undefined
    const references   = formData.references   as string | undefined

    if (brandStage === 'new' || brandStage === 'rebrand') add('Full rebrand', 20)
    else if (brandStage)                                   add('Refresh/extend', 12)
    if (deliverables.length >= 4)                          add('4+ deliverables', 20)
    if (deliverables.includes('logo') && deliverables.includes('guidelines')) add('Logo+guidelines', 10)
    if (deliverables.includes('naming'))                   add('Naming/tagline', 5)
    if (audience && audience.length > 30)                  add('Audience defined', 15)
    if (timeline === 'asap' || timeline === '1month')      add('Near-term timeline', 20)
    else if (timeline === '2-3months')                     add('2-3 month timeline', 10)
    if (budget >= 10000)      add('Budget $10K+', 15)
    else if (budget >= 5000)  add('Budget $5K-10K', 10)
    if (references)           add('References provided', 5)
  }

  if (formType === 'get-a-marketing-proposal') {
    const services    = (formData.services       as string[] | undefined) ?? []
    const adPlatforms = (formData.ad_platforms   as string[] | undefined) ?? []
    const goal        = formData.goal            as string | undefined
    const currentSpend = formData.current_spend  as string | undefined
    const budget      = Number(formData.budget ?? 0)

    if (services.includes('full'))   add('Full programme', 25)
    else if (services.length >= 3)   add('3+ services', 20)
    if (services.includes('paid_ads')) add('Paid ads intent', 15)
    if (adPlatforms.includes('google') && adPlatforms.includes('meta')) add('Multi-platform ads', 10)
    if (adPlatforms.includes('linkedin')) add('LinkedIn ads (B2B)', 5)
    if (goal === 'leads' || goal === 'launch') add('Lead/launch goal', 15)
    if (currentSpend === '3k-7k' || currentSpend === '7k+') add('Current spend $3K+', 15)
    else if (currentSpend === '1k-3k') add('Current spend $1K-3K', 10)
    if (budget >= 5000)  add('Target $5K+/mo', 20)
    else if (budget >= 2000) add('Target $2K-5K/mo', 10)
  }

  if (formType === 'discuss-a-retainer') {
    const foundation = (formData.foundation as string[] | undefined) ?? []
    const focus      = (formData.focus      as string[] | undefined) ?? []
    const teamSize   = formData.team_size   as string | undefined
    const pain       = formData.pain        as string | undefined

    if (foundation.includes('crm') && foundation.includes('website')) add('CRM+website in place', 25)
    if (foundation.length >= 4) add('4+ foundation items', 20)
    if (foundation.includes('marketing')) add('Active marketing', 10)
    if (focus.length >= 3) add('3+ focus areas', 20)
    if (focus.includes('reporting') || focus.includes('automation') || focus.includes('growth')) add('Key focus areas', 15)
    if (teamSize === '6-15' || teamSize === '16-50' || teamSize === '50+') add('Team 6+', 15)
    else if (teamSize === '2-5') add('Team 2-5', 10)
    if (pain && pain.length > 40) add('Specific pain described', 15)
  }

  if (formType === 'get-a-proposal') {
    const caseStudy = formData.case_study as string | undefined
    const needs     = (formData.needs     as string[] | undefined) ?? []
    const notes     = formData.notes      as string | undefined

    if (caseStudy && caseStudy !== 'not_sure') add('Case study selected', 25)
    if (caseStudy === 'all') add('All case studies', 20)
    if (needs.includes('crm'))  add('CRM need', 20)
    if (needs.includes('full')) add('Full ecosystem', 25)
    else if (needs.length >= 3) add('3+ needs', 15)
    if (notes && notes.length > 30) add('Specific context', 15)
  }

  if (formType === 'book-a-discovery-call') {
    const priorities = (formData.priorities as string[] | undefined) ?? []
    const tenure     = formData.tenure as string | undefined

    if (tenure === '3-10' || tenure === '10+') add('Established business', 20)
    else if (tenure === '1-3') add('1-3 years', 10)
    else if (tenure === 'under1') add('Under 1 year', 5)
    if (priorities.includes('crm') || priorities.includes('reporting')) add('CRM/reporting priority', 20)
    if (priorities.includes('website') || priorities.includes('marketing')) add('Website/marketing priority', 15)
    if (priorities.length >= 3) add('3+ priorities', 10)
  }

  const score = clamp(total, 0, 100)
  let tier: LeadTier
  if (score >= 80) tier = 'hot'
  else if (score >= 55) tier = 'warm'
  else if (score >= 30) tier = 'cold'
  else tier = 'unqualified'

  return { total: score, tier, breakdown }
}

export function getAutoTasks(tier: LeadTier, leadName: string): Array<{ title: string; description: string; priority: string; dueHours: number }> {
  if (tier === 'hot') return [
    { title: `Call ${leadName}`, description: 'HOT lead — call within 2 hours', priority: 'urgent', dueHours: 2 },
    { title: `Send intro email to ${leadName}`, description: 'Share relevant case studies and next steps', priority: 'high', dueHours: 4 },
    { title: `Schedule discovery call with ${leadName}`, description: 'Book a 30-minute call this week', priority: 'high', dueHours: 48 },
  ]
  if (tier === 'warm') return [
    { title: `Send intro email to ${leadName}`, description: 'WARM lead — respond within 24 hours', priority: 'high', dueHours: 24 },
    { title: `Follow up with ${leadName}`, description: 'Check in if no reply in 3 days', priority: 'medium', dueHours: 72 },
    { title: `Schedule discovery call with ${leadName}`, description: 'Book a 30-minute call this week', priority: 'medium', dueHours: 120 },
  ]
  return [
    { title: `Add ${leadName} to nurture sequence`, description: 'COLD lead — add to newsletter and 30-day check-in', priority: 'low', dueHours: 168 },
    { title: `30-day check-in: ${leadName}`, description: 'Re-engage after 30 days', priority: 'low', dueHours: 720 },
  ]
}

export const PROJECT_TASK_TEMPLATES: Record<string, string[]> = {
  crm: ['Discovery call','Brief signed','Database schema','Design system','Core build','Testing','Client training','Launch','30-day check-in'],
  website: ['Discovery call','Brief signed','Wireframes','Design approval','Copywriting','Build','UAT','Launch','Handover'],
  brand: ['Discovery call','Brief signed','Moodboard','Logo concepts','Client revision','Final files','Brand guidelines','Handover'],
  marketing: ['Strategy call','Account audit','Plan approval','Campaign setup','Week 1 review','Month 1 report','Monthly review cadence'],
  retainer: ['Onboarding call','Month 1 kick-off','Access and setup','Month 1 deliverables','Month 1 review','Month 2 kick-off'],
  other: ['Discovery call','Brief signed','Delivery','Review','Handover'],
}
