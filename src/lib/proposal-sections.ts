// ── Proposal section templates by service type ────────────────────────────────
// Each section has: id, title, content (editable text), included (toggle)

export interface ProposalSection {
  id:       string
  title:    string
  content:  string
  included: boolean
  locked?:  boolean   // can\'t be removed (cover, investment, next steps)
}

export type ServiceType =
  | 'custom-crm'
  | 'website'
  | 'brand'
  | 'marketing'
  | 'seo'
  | 'paid-advertising'
  | 'retainer'
  | 'full-ecosystem'

// ── Map form_type to service_type ─────────────────────────────────────────────
export const FORM_TYPE_TO_SERVICE: Record<string, ServiceType> = {
  'get-a-custom-crm-quote':   'custom-crm',
  'start-a-website-project':  'website',
  'start-a-brand-project':    'brand',
  'get-a-marketing-proposal': 'marketing',
  'discuss-a-retainer':       'retainer',
  'book-a-discovery-call':    'full-ecosystem',
  'get-a-proposal':           'full-ecosystem',
}

export const SERVICE_LABELS: Record<ServiceType, string> = {
  'custom-crm':       'Custom CRM and Business Intelligence',
  'website':          'Website and Digital Infrastructure',
  'brand':            'Brand and Identity',
  'marketing':        'Marketing and Growth',
  'seo':              'Search Engine Optimisation',
  'paid-advertising': 'Paid Advertising',
  'retainer':         'Business Optimisation Retainer',
  'full-ecosystem':   'Full Digital Ecosystem',
}

// ── Section templates ─────────────────────────────────────────────────────────
export const SECTION_TEMPLATES: Record<ServiceType, ProposalSection[]> = {

  'custom-crm': [
    {
      id: 'executive-summary', title: 'Executive Summary', locked: false, included: true,
      content: 'This proposal outlines a custom CRM and Business Intelligence platform built specifically for [Client Name]. The current operational infrastructure is limiting visibility, follow-up consistency, and the ability to scale. Kromium will design and build a system that matches the exact workflow, team structure, and growth ambitions of the business — and hand it over in full ownership.',
    },
    {
      id: 'the-case-for-custom', title: 'The Case for Custom', locked: false, included: true,
      content: 'Off-the-shelf platforms like HubSpot and Salesforce were built for North American and European markets. They carry no Caribbean market intelligence and no understanding of how premium operations in this region work. More critically: you pay a monthly fee for access to a system you will never own. If you stop paying, you lose your data, your automations, and your pipeline history.\n\nKromium builds custom CRM platforms tailored to the exact way the business operates. One-time build fee. Zero monthly SaaS. Full code ownership. Your data stays yours.',
    },
    {
      id: 'understanding-your-operation', title: 'Understanding Your Operation', locked: false, included: true,
      content: '[Pre-fill from enquiry form and discovery notes. Describe back to the client their workflow, pain points, team structure, and growth goals in precise terms. This section proves you listened.]',
    },
    {
      id: 'what-we-will-build', title: 'What We Will Build', locked: false, included: true,
      content: 'The CRM will be built across the following modules:\n\nLead Management — Full pipeline from first enquiry to conversion. Status tracking, lead scoring, and automated follow-up tasks.\n\nPipeline and Kanban — Visual deal tracking across all stages of the sales cycle.\n\nClient and Contact Management — Comprehensive profiles with interaction history, notes, tasks, and linked projects.\n\nReporting and Dashboards — Revenue tracking, pipeline velocity, team performance, and conversion analytics.\n\nWebsite Lead Capture — Forms integrated directly into the CRM. Every enquiry scored, assigned, and actioned automatically.\n\nMobile Access — Full CRM functionality on any device, no separate app required.',
    },
    {
      id: 'technical-architecture', title: 'Technical Architecture', locked: false, included: true,
      content: 'The platform is built on a modern, proven stack designed for performance and longevity:\n\nFrontend: Next.js 14 with TypeScript and Tailwind CSS. Fast, responsive, and built to scale.\n\nDatabase: Supabase (PostgreSQL). Row-level security, real-time data, and enterprise-grade reliability.\n\nHosting: Vercel. Zero-downtime deployments, global CDN, and 99.99% uptime.\n\nAuthentication: Supabase Auth with role-based access control. Full audit log of every login and action.\n\nYou own the repository, the domain, the hosting account, and the database. Kromium holds no ongoing access unless specifically engaged for support.',
    },
    {
      id: 'what-you-will-own', title: 'What You Will Own', locked: false, included: true,
      content: 'This is not a SaaS subscription. When the project is complete:\n\n- You own the full source code, hosted in your own GitHub repository\n- You own the database and all data within it\n- You own the domain and hosting infrastructure\n- There is no monthly licence fee, no per-seat charge, and no dependency on Kromium for the system to function\n\nKromium will train your team, document the system, and offer optional ongoing support — but the platform operates independently from day one.',
    },
    {
      id: 'phase-plan', title: 'Phase Plan and Timeline', locked: false, included: true,
      content: 'Phase 1 — Discovery and Architecture (Weeks 1–2)\nDeep-dive session with the team. Database schema design. User journey mapping. Technical specification sign-off.\n\nPhase 2 — Design System (Weeks 3–4)\nUI kit, colour system, and component library built to the brand. All screens prototyped for approval before build begins.\n\nPhase 3 — Core Build (Weeks 5–9)\nAll primary modules built and tested. Internal QA across all user roles and devices.\n\nPhase 4 — Integration and Testing (Week 10)\nWebsite lead capture wired. Email and WhatsApp notifications configured. Full end-to-end testing.\n\nPhase 5 — Training and Launch (Weeks 11–12)\nTeam training session recorded for reference. Production deployment. 30-day monitoring period.',
    },
    {
      id: 'case-studies', title: 'Proof of Delivery', locked: false, included: true,
      content: 'Azure Keys Realty — Custom CRM Platform\nA luxury Caribbean real estate firm operating across Cayman Islands, Nassau, and Montego Bay. Full CRM built for brokerage sales, holiday rentals, and property management. Live demo at azure-keys-crm.vercel.app.\n\nSummitStone Developments — Construction OS\nA construction and development group operating across four Caribbean islands. Operations platform covering project tracking, subcontractor management, investor reporting, and multi-island compliance workflows.',
    },
    {
      id: 'investment', title: 'Investment', locked: true, included: true,
      content: '',
    },
    {
      id: 'next-steps', title: 'Next Steps', locked: true, included: true,
      content: '1. Approve this proposal and sign the project brief\n2. Pay the deposit to secure your start date (35% of total investment)\n3. Schedule the discovery session — a focused 2-hour session with your team\n4. Build begins within 5 business days of the signed brief and deposit received\n\nFor questions or to proceed: info@kromiumagency.com | (246) 232-1006',
    },
    {
      id: 'terms', title: 'Terms and Conditions', locked: false, included: true,
      content: 'Payment Terms: 35% deposit on signing. 35% on design approval (Phase 2 sign-off). 30% on launch. All work remains the intellectual property of Kromium Marketing and Development Inc. until full payment is received, at which point full ownership transfers to the client.\n\nRevisions: Two rounds of revisions are included per phase. Additional revisions are billed at the agreed hourly rate.\n\nTimeline: The timeline above assumes timely feedback and approvals from the client at each phase. Delays in client feedback may extend the delivery schedule accordingly.\n\nConfidentiality: All client information shared during this engagement is treated as strictly confidential and will not be shared with third parties.',
    },
  ],

  'website': [
    {
      id: 'executive-summary', title: 'Executive Summary', locked: false, included: true,
      content: 'This proposal outlines the design and development of a new website for [Client Name]. The brief is to build a site that functions as a lead generation and conversion asset — not just a digital brochure. Every page will have a clear purpose, a defined audience, and a measurable outcome.',
    },
    {
      id: 'the-problem', title: 'The Problem with the Current Digital Infrastructure', locked: false, included: true,
      content: '[Describe specifically what is broken or missing based on enquiry. If rebuilding: what the current site fails to do. If new: what the competitive gap is. Be specific — this section earns trust by showing you did the homework.]',
    },
    {
      id: 'what-the-site-will-achieve', title: 'What the New Site Will Achieve', locked: false, included: true,
      content: 'Primary goal: [From enquiry — leads / bookings / credibility / e-commerce / CRM feed]\n\nEvery page of the new site will be designed around a single outcome. Visitors will land with intent and leave with a reason to make contact. The site will be built to rank in search, load fast on every device, and convert at a higher rate than the current web presence.',
    },
    {
      id: 'sitemap', title: 'Sitemap and Page Architecture', locked: false, included: true,
      content: 'Homepage — Brand positioning, primary CTA, case studies, services overview\nAbout — Team, credibility, mission\nServices — Individual service pages with specific CTAs\nContact — Enquiry form, phone, location\n\n[Add additional pages based on the client\'s specific requirements]',
    },
    {
      id: 'design-brand', title: 'Design and Brand Direction', locked: false, included: true,
      content: '[Brand status from enquiry: full guidelines / partial / none]\n\nIf full brand guidelines exist: Design will adhere strictly to the established system across all breakpoints.\n\nIf no brand: A visual direction session will be conducted prior to design, resulting in an agreed moodboard and design language before any mockups are produced.\n\nAll designs are presented in desktop and mobile. Client approves before build begins.',
    },
    {
      id: 'technical-approach', title: 'Technical Approach', locked: false, included: true,
      content: 'Platform: [WordPress / Custom Next.js / depending on scope]\nHosting: Vercel or managed WordPress hosting — fast, secure, and reliable\nSSL: Included and configured\nMobile: Fully responsive across all breakpoints\nCMS: Client can update content independently after handover\nPage Speed: Built to achieve 90+ Google PageSpeed score',
    },
    {
      id: 'seo-foundation', title: 'SEO Foundation', locked: false, included: true,
      content: 'Every page will be optimised for search at the point of build:\n\n- Keyword-mapped title tags and meta descriptions\n- Proper heading hierarchy (H1–H3)\n- Schema markup for business information\n- Image optimisation and alt text\n- Internal linking architecture\n- Google Search Console setup and sitemap submission\n- Target search market: [From enquiry: Barbados / Caribbean / North America / International]',
    },
    {
      id: 'lead-capture', title: 'Lead Capture and CRM Integration', locked: false, included: true,
      content: 'Every enquiry submitted through the website will flow directly into a structured system:\n\n- Contact and enquiry forms on relevant pages\n- Automatic lead scoring on submission\n- Notification to the team with full context\n- CRM integration for pipeline tracking (if applicable)\n- UTM attribution to track which marketing channels drive enquiries',
    },
    {
      id: 'copy-content', title: 'Content and Copy', locked: false, included: false,
      content: 'Copy status: [From enquiry: ready / draft / needs copywriting support]\n\nIf copywriting is included: Kromium will research, write, and deliver all page copy prior to the build phase. Two rounds of revision are included. Copy is written to rank for agreed keywords while remaining natural and conversion-focused.',
    },
    {
      id: 'phase-plan', title: 'Phase Plan and Timeline', locked: false, included: true,
      content: 'Week 1–2: Discovery, sitemap agreement, and brief sign-off\nWeek 3–4: Wireframes — lo-fi structure for all primary pages\nWeek 5: Design concepts presented. Client selects direction\nWeek 6–7: Hi-fi design across all pages, desktop and mobile\nWeek 8: Design approval. Build begins\nWeek 9–11: Full development build\nWeek 12: Client UAT. Revisions.\nWeek 13: DNS transfer and launch. 14-day post-launch monitoring.',
    },
    {
      id: 'investment', title: 'Investment', locked: true, included: true,
      content: '',
    },
    {
      id: 'next-steps', title: 'Next Steps', locked: true, included: true,
      content: '1. Approve this proposal and sign the project brief\n2. Pay the deposit to secure your start date (35% of total investment)\n3. Discovery session scheduled within 5 business days\n4. Build begins once brief is signed and deposit received\n\nFor questions or to proceed: info@kromiumagency.com | (246) 232-1006',
    },
    {
      id: 'terms', title: 'Terms and Conditions', locked: false, included: true,
      content: 'Payment Terms: 35% deposit on signing. 35% on design approval. 30% on launch. All work remains the intellectual property of Kromium Marketing and Development Inc. until full payment is received.\n\nRevisions: Two rounds of revisions per phase. Additional revisions billed at the agreed hourly rate.\n\nConfidentiality: All client information is treated as strictly confidential.',
    },
  ],

  'brand': [
    {
      id: 'executive-summary', title: 'Executive Summary', locked: false, included: true,
      content: 'This proposal outlines a brand identity project for [Client Name]. The brief is to [new brand / full rebrand / refresh / extension]. The outcome will be a coherent, distinctive visual identity that reflects where the business is now and where it is going — built to travel consistently across every touchpoint.',
    },
    {
      id: 'why-now', title: 'Why This Brand Needs to Change', locked: false, included: true,
      content: '[From enquiry and notes: the honest assessment. Name what is dated, inconsistent, or no longer aligned with the direction of the business. This section earns trust by demonstrating that Kromium has listened and understood the real problem.]',
    },
    {
      id: 'discovery-process', title: 'Brand Discovery Process', locked: false, included: true,
      content: 'Before any design is produced, Kromium conducts a structured discovery process:\n\nCompetitor and market review — how the brand sits relative to the landscape\nAudience analysis — who the brand needs to speak to and what they respond to\nVisual audit — an honest assessment of all current brand materials\nBrand personality session — a facilitated conversation to define values, tone, and direction\n\nDiscovery outputs are signed off before concepts begin. No guesswork.',
    },
    {
      id: 'deliverables', title: 'What We Will Deliver', locked: false, included: true,
      content: '[From enquiry — select applicable deliverables:]\n\nLogo Suite — Primary, secondary, and icon variants across all formats (SVG, PNG, PDF)\nColour Palette — Primary, secondary, and neutral colours with hex, RGB, and CMYK values\nTypography System — Primary and secondary typefaces with hierarchy rules\nBrand Guidelines Document — The complete reference document for consistent application\nStationery Suite — Business cards, letterhead, email signature, compliments slips\nSocial Media Templates — Editable templates for all primary platforms\nSignage — If applicable\nNaming and Tagline — If applicable',
    },
    {
      id: 'creative-directions', title: 'Brand Personality and Creative Direction', locked: false, included: true,
      content: 'Three distinct creative directions will be presented at the concept stage. Each direction will be accompanied by:\n\n- A personality descriptor and positioning statement\n- A moodboard of visual references\n- An initial logo concept in that direction\n\nThe client selects one direction for full development. All three are presented simultaneously to ensure the decision is informed and comparative.',
    },
    {
      id: 'application', title: 'How the Brand Will Be Applied', locked: false, included: false,
      content: 'A brand is only as strong as its application. Alongside the deliverables, Kromium will provide:\n\n- A do and do-not guide — specific examples of correct and incorrect usage\n- Colour and typography combinations that maintain legibility and hierarchy\n- Photography style guidance to ensure visual consistency across the brand',
    },
    {
      id: 'revisions', title: 'Revision and Approval Process', locked: false, included: true,
      content: 'Two rounds of revisions are included at each phase. A round of revisions means consolidated, written feedback addressed in a single pass. Concept pivots after direction is selected are not included in the revision allowance and will be scoped separately.',
    },
    {
      id: 'phase-plan', title: 'Phase Plan and Timeline', locked: false, included: true,
      content: 'Week 1–2: Brand discovery session, competitor review, audience analysis\nWeek 3: Moodboard and creative direction presentation. Client selects one direction.\nWeek 4–5: Logo concepts — three options within the selected direction\nWeek 6: Client feedback. Revision round 1.\nWeek 7: Refined logo and initial colour/typography direction presented\nWeek 8: Final logo approved. Full brand system developed.\nWeek 9: Brand guidelines document, stationery, and social templates delivered\nWeek 10: Final file delivery and handover session',
    },
    {
      id: 'case-studies', title: 'Proof of Delivery', locked: false, included: true,
      content: 'Barbados Gospelfest — Rebrand and Digital Refresh\nA complete rebrand of one of the Caribbean\'s most prominent cultural festivals. New logo, revamped social media, and new promotional materials. Instagram followers increased by 39% in one campaign cycle. Events sold out.\n\nItalia Coffee Barbados — Brand Refresh\nA six-month engagement modernising and streamlining the brand for a 25-year-old Barbados institution. Social media growth from 12,000 to 15,000 followers. 1.6 million impressions in the first three months.',
    },
    {
      id: 'investment', title: 'Investment', locked: true, included: true,
      content: '',
    },
    {
      id: 'next-steps', title: 'Next Steps', locked: true, included: true,
      content: '1. Approve this proposal and sign the project brief\n2. Pay the deposit to secure your start date (35% of total investment)\n3. Brand discovery session scheduled within 5 business days\n\nFor questions or to proceed: info@kromiumagency.com | (246) 232-1006',
    },
    {
      id: 'terms', title: 'Terms and Conditions', locked: false, included: true,
      content: 'Payment Terms: 35% deposit on signing. 35% on concept approval. 30% on final file delivery.\n\nRevisions: Two rounds per phase. Additional revisions billed at the agreed hourly rate.\n\nOwnership: Full IP transfers to the client on final payment. Kromium retains the right to display completed work in its portfolio.',
    },
  ],

  'marketing': [
    {
      id: 'executive-summary', title: 'Executive Summary', locked: false, included: true,
      content: 'This proposal outlines a [social media management / paid advertising / full marketing programme] engagement for [Client Name]. The goal is to [lead generation / brand awareness / launch / retention] within [market]. Kromium will serve as the dedicated marketing partner — handling strategy, content, advertising, and reporting.',
    },
    {
      id: 'where-you-are-now', title: 'Where You Are Now', locked: false, included: true,
      content: '[From enquiry and discovery notes: an honest audit of the current digital presence. Follower counts, engagement rates, ad spend history, what is working, what is not. Be specific. This section builds immediate credibility.]',
    },
    {
      id: 'strategic-approach', title: 'Our Strategic Approach', locked: false, included: true,
      content: '[Audience definition — who we are reaching and on which platforms]\n\n[Message positioning — what the brand stands for and how it will be communicated]\n\n[Platform prioritisation — rationale for each chosen channel]\n\nEvery decision — creative, budget, posting schedule — is informed by data. We do not post for the sake of posting. Each piece of content has a defined role in the overall strategy.',
    },
    {
      id: 'phase-1', title: 'Phase 1 — Foundation and Launch', locked: false, included: true,
      content: 'Month 1 — Audit and Strategy\nComprehensive audit of all current digital platforms. Content calendar developed. Campaign structure agreed. All accounts optimised and ready for campaign rollout.\n\nMonth 2 — Launch and Activation\nCampaigns live across agreed platforms. Content published to agreed schedule. Community management active. First performance report delivered at end of month.\n\nDeliverable: A clear, consistent digital presence with an active campaign in market and baseline data established.',
    },
    {
      id: 'phase-2', title: 'Phase 2 — Growth and Retention', locked: false, included: true,
      content: 'Month 3 onwards — ongoing monthly management\n\nContent creation: [number] posts per month across [platforms], inclusive of graphics, copy, and scheduling\nCommunity management: Timely responses to comments, DMs, and reviews\nPaid advertising: Campaign management across [platforms] with agreed monthly ad budget\nMonthly reporting: Performance data with insights and strategic recommendations\n\nAll content is developed to brief, reviewed by the client before publishing, and adjusted in real-time based on performance.',
    },
    {
      id: 'content-strategy', title: 'Content Strategy', locked: false, included: true,
      content: 'Content will be developed to a monthly calendar, presented for approval before scheduling. Each month includes:\n\nOriginal branded graphics — custom designed to brand standards\nCopywriting and captions — researched, targeted, and on-brand\nStory content — behind-the-scenes, announcements, and real-time updates\nPhotography and video — [quarterly shoots / as required / monthly]\n\nContent categories will include: [brand storytelling / product/service highlights / client testimonials / industry insights / community and culture]',
    },
    {
      id: 'paid-advertising', title: 'Paid Advertising Strategy', locked: false, included: true,
      content: 'Platforms: [Meta (Facebook and Instagram) / Google Ads / LinkedIn]\n\nCampaign objectives: [awareness / lead generation / conversion / retargeting]\n\nBudget recommendation: [amount] per month. This is the media spend — paid directly to the platforms. It is separate from the management fee.\n\nPayment: Kromium\'s strong recommendation is that the advertising budget is held on a client-owned card added to the relevant ad managers. This ensures complete transparency: you see exactly what is spent and where, in real-time.\n\nAllocation: [e.g. 50% Meta / 30% Google / 20% LinkedIn — adjusted monthly based on performance]',
    },
    {
      id: 'reporting', title: 'Reporting and Analytics', locked: false, included: true,
      content: 'Monthly reports are delivered at the end of each month and cover:\n\nAudience growth and follower trends\nContent performance — reach, engagement, saves, and link clicks\nPaid campaign performance — impressions, CTR, CPL, and ROAS\nInsights and strategic recommendations for the following month\n\nQuarterly strategy sessions review the broader direction and set the next 90-day plan.\nAn end-of-year report summarises overall results, key milestones, and the roadmap for the year ahead.',
    },
    {
      id: 'dedicated-team', title: 'Dedicated Team', locked: false, included: true,
      content: 'Your account will be managed by a dedicated team of specialists:\n\nAccount Manager — day-to-day coordination, content scheduling, client communication\nCreative Team — graphics, photography, and video production\nCopywriter — research, captions, and long-form content\nAdvertising Manager — campaign setup, optimisation, and budget management\n\nYour account manager is your primary point of contact and is available for last-minute requests, urgent updates, and regular strategic check-ins.',
    },
    {
      id: 'case-studies', title: 'Proof of Delivery', locked: false, included: true,
      content: 'RIMCO Barbados SRL — Heavy Equipment Manufacturer\n3.59 million impressions, 1,562 interactions, and 2,576 followers. A quality audience built for conversion — not volume.\n\nItalia Coffee Barbados — Food and Beverage\n12,000 to 15,000 Instagram followers. 1.6 million impressions in three months. 10,860 interactions.\n\nBarbados Gospelfest — Events and Culture\nInstagram followers increased 39% in a single campaign cycle. Multiple events sold out.',
    },
    {
      id: 'investment', title: 'Investment', locked: true, included: true,
      content: 'Note: The advertising budget is invoiced separately from the management fee, or charged directly by the platforms to a client-owned card. This ensures full transparency on where every dollar is spent.',
    },
    {
      id: 'next-steps', title: 'Next Steps', locked: true, included: true,
      content: '1. Approve this proposal and sign the service agreement\n2. Once approved, Kromium will conduct a comprehensive digital marketing audit — delivered within two weeks\n3. Implementation begins immediately after the audit is reviewed and approved\n4. First content goes live in month two, ensuring we are always ahead of schedule\n\nFor questions or to proceed: info@kromiumagency.com | (246) 232-1006',
    },
    {
      id: 'terms', title: 'Terms and Conditions', locked: false, included: true,
      content: 'Minimum Term: 3-month initial commitment. 30 days notice required to cancel after the initial term.\n\nPayment: Invoiced monthly in advance. Management fees are separate from advertising spend.\n\nAdvertising Budget: The media spend is either charged directly to the client\'s card by the platforms, or invoiced separately by Kromium and disbursed on the client\'s behalf with full transparency.\n\nContent Ownership: All original content produced under this engagement is the property of the client on full payment of each monthly invoice.',
    },
  ],

  'seo': [
    {
      id: 'executive-summary', title: 'Executive Summary', locked: false, included: true,
      content: 'This proposal outlines an SEO engagement for [Client Name]. The goal is to achieve consistent, compounding visibility in search results for [target market] — moving from the current position to a measurable increase in organic traffic and qualified enquiries within the first 6 months.',
    },
    {
      id: 'seo-opportunity', title: 'The SEO Opportunity', locked: false, included: true,
      content: '[What the client is currently ranking for, or not. What the competition is doing. What is being left on the table. Be specific with market and keyword context. Show you have done the homework before this proposal was written.]',
    },
    {
      id: 'keyword-strategy', title: 'Keyword Strategy', locked: false, included: true,
      content: 'Primary keywords — high-intent, commercial searches that drive enquiries\nSecondary keywords — supporting terms that build topical authority\nLong-tail keywords — specific, low-competition searches with strong conversion intent\n\nSearch market: [From enquiry — Barbados / Caribbean / North America / International]\n\nAll keywords will be mapped to specific pages and content assets. No keyword targeting without a clear content home.',
    },
    {
      id: 'technical-seo', title: 'Technical SEO Audit and Fixes', locked: false, included: true,
      content: 'Month 1 will begin with a full technical audit covering:\n\nPage speed and Core Web Vitals\nMobile performance and responsiveness\nCrawl errors and indexation issues\nSite architecture and URL structure\nSchema markup and structured data\nSSL and security signals\n\nAll critical issues are fixed before content work begins. A clean technical foundation is non-negotiable.',
    },
    {
      id: 'on-page', title: 'On-Page Optimisation', locked: false, included: true,
      content: 'Every page will be optimised with:\n\nKeyword-mapped title tags and meta descriptions\nProper heading hierarchy (H1 through H3)\nInternal linking to distribute authority across the site\nImage optimisation and descriptive alt text\nContent updates where thin or outdated copy is holding rankings back',
    },
    {
      id: 'content-strategy', title: 'Content Strategy', locked: false, included: true,
      content: 'Authority in search is built through content. The content plan will include:\n\nPillar pages — comprehensive, long-form pages targeting primary keyword clusters\nBlog content — supporting articles that address specific questions and long-tail searches\nLocal and regional pages — Caribbean market-specific content to target geographic searches\n\nPublishing cadence: [frequency based on scope]. All content is written for people first, search engines second.',
    },
    {
      id: 'what-we-track', title: 'What We Track', locked: false, included: true,
      content: 'Monthly reporting covers:\n\nKeyword rankings — movement across all target terms\nOrganic traffic — sessions, new users, and engagement\nConversions — enquiries, contact form submissions, and calls tracked back to organic search\nCore Web Vitals — ongoing performance monitoring\nBacklink profile — new links earned and overall domain authority movement',
    },
    {
      id: 'timeline', title: 'Timeline', locked: false, included: true,
      content: 'Month 1: Technical audit, keyword research, on-page optimisation of priority pages\nMonth 2–3: Content production begins, remaining on-page fixes, local SEO setup\nMonth 4+: Content compounding, link building, refinement based on ranking data\n\nSEO is a long game. Meaningful ranking movement typically takes 3–6 months. The groundwork in months 1–3 determines how fast the compounding effect accelerates.',
    },
    {
      id: 'investment', title: 'Investment', locked: true, included: true,
      content: '',
    },
    {
      id: 'next-steps', title: 'Next Steps', locked: true, included: true,
      content: '1. Approve this proposal\n2. Kromium begins the technical audit within 5 business days\n3. Audit findings are presented and agreed before implementation begins\n\nFor questions or to proceed: info@kromiumagency.com | (246) 232-1006',
    },
    {
      id: 'terms', title: 'Terms and Conditions', locked: false, included: true,
      content: 'Minimum Term: 3-month initial commitment. 30 days notice to cancel after initial term.\n\nExpectations: SEO results are influenced by factors outside Kromium\'s control, including Google algorithm changes and competitor activity. Kromium guarantees diligent execution of best-practice SEO — not specific ranking positions.',
    },
  ],

  'paid-advertising': [
    {
      id: 'executive-summary', title: 'Executive Summary', locked: false, included: true,
      content: 'This proposal outlines a paid advertising engagement for [Client Name] across [platforms]. The objective is to [drive leads / build awareness / launch a product or service] in [market]. Every dollar of media spend will be accounted for, optimised, and reported on.',
    },
    {
      id: 'paid-opportunity', title: 'The Paid Media Opportunity', locked: false, included: true,
      content: '[Current search volume for the client\'s category. What competitors are spending. What is being missed. Where the quick wins are. Specific and evidence-based.]',
    },
    {
      id: 'platform-rationale', title: 'Platform Recommendation and Rationale', locked: false, included: true,
      content: '[Specific rationale for each recommended platform — not a generic list. Why Meta vs LinkedIn vs Google for this specific client, audience, and goal. The platform choice is a strategic decision and should be explained.]',
    },
    {
      id: 'campaign-architecture', title: 'Campaign Architecture', locked: false, included: true,
      content: 'Campaign structure: [awareness / consideration / conversion — layered or focused depending on objective]\nAudience targeting: [specific demographics, interests, and behaviours relevant to the client]\nAd formats: [static / carousel / video / search — based on platform and objective]\nLanding pages: [existing or new — recommendations for conversion optimisation]',
    },
    {
      id: 'creative-approach', title: 'Creative Approach', locked: false, included: true,
      content: 'Ad creative will be produced by Kromium\'s design team to brand standards. Each campaign will launch with a minimum of three creative variants to allow for performance testing. Underperforming creative is replaced within the first two weeks.',
    },
    {
      id: 'budget', title: 'Budget Recommendation and Allocation', locked: false, included: true,
      content: 'Recommended monthly media spend: [amount] USD\nThis is the advertising budget — paid directly to the platforms, separate from the management fee.\n\nAllocation: [e.g. 40% Meta / 30% Google / 30% LinkedIn]\n\nKromium\'s strong recommendation is that the advertising budget is on a client-owned card within each ad manager. This ensures complete, real-time transparency on exactly what is spent and where.',
    },
    {
      id: 'what-we-track', title: 'What We Track', locked: false, included: true,
      content: 'Conversions — enquiries, sign-ups, purchases, or calls generated by paid campaigns\nCost per lead (CPL) — what each conversion costs, tracked by platform and campaign\nReturn on ad spend (ROAS) — revenue generated relative to spend\nClick-through rate (CTR) — creative and copy performance\nImpression share — visibility relative to the available market\n\nAll data is available in a real-time dashboard. Monthly reports summarise performance and recommendations.',
    },
    {
      id: 'timeline', title: 'Timeline', locked: false, included: true,
      content: 'Week 1–2: Account audit (if existing), campaign setup, creative production, audience build\nMonth 1: Test phase — multiple creatives and audiences running simultaneously. Data collected.\nMonth 2: Optimisation phase — underperforming elements paused. Budget shifted to winners.\nMonth 3+: Scaling phase — proven campaigns expanded. New audiences tested.',
    },
    {
      id: 'investment', title: 'Investment', locked: true, included: true,
      content: 'Note: The management fee and advertising spend are invoiced separately. The advertising spend goes directly to the platforms — Kromium does not mark up media spend.',
    },
    {
      id: 'next-steps', title: 'Next Steps', locked: true, included: true,
      content: '1. Approve this proposal\n2. Access to existing ad accounts shared with Kromium (if applicable)\n3. Creative brief completed and design begins\n4. Campaigns live within 10 business days of brief sign-off\n\nFor questions or to proceed: info@kromiumagency.com | (246) 232-1006',
    },
    {
      id: 'terms', title: 'Terms and Conditions', locked: false, included: true,
      content: 'Minimum Term: 3-month initial commitment. 30 days notice to cancel after initial term.\n\nMedia Spend: Advertising budget is separate from management fees. Kromium does not add a markup to media spend.\n\nPerformance: Kromium will optimise campaigns diligently. Specific results are influenced by factors including market conditions, creative performance, and budget level.',
    },
  ],

  'retainer': [
    {
      id: 'executive-summary', title: 'Executive Summary', locked: false, included: true,
      content: 'This proposal outlines a Business Optimisation Retainer for [Client Name]. This is not a project engagement — it is an ongoing growth partnership. Kromium will function as the embedded digital growth partner: owning the strategy, the reporting, the campaigns, and the systems that drive the business forward month on month.',
    },
    {
      id: 'what-a-retainer-does', title: 'What a Growth Retainer Actually Does', locked: false, included: true,
      content: 'Most businesses hire agencies for projects. The website is done. The brand is done. The campaign ran. Then the momentum stops.\n\nA growth retainer is a fundamentally different relationship. Kromium becomes embedded in the operation — setting the strategy, executing against it, reporting on it, and adjusting it every single month. The result is compounding digital growth rather than isolated project outcomes.\n\nThis is for businesses that are ready to treat digital infrastructure as a core business function, not an occasional expense.',
    },
    {
      id: 'current-foundation', title: 'Current Digital Foundation Assessment', locked: false, included: true,
      content: '[From enquiry and notes: honest statement of what is in place and what is missing. Current website status. CRM or lack thereof. Brand consistency. Marketing activity and results. This section proves Kromium did the analysis before proposing a solution.]',
    },
    {
      id: 'what-we-will-own', title: 'What We Will Own Each Month', locked: false, included: true,
      content: 'Strategy — Monthly strategy session. 90-day rolling roadmap. All decisions are data-informed and agreed with the client before execution.\n\nReporting — A comprehensive monthly performance dashboard covering all digital channels, lead generation, and revenue attribution where possible.\n\nContent and Campaigns — Organic social content, email, and paid campaigns to an agreed schedule and budget.\n\nCRM and Operations — Oversight of the lead management system, follow-up sequences, and pipeline health.\n\nGrowth Projects — One or two defined growth projects per quarter beyond the monthly cadence — a new landing page, a lead generation campaign, a retargeting build.',
    },
    {
      id: 'monthly-rhythm', title: 'Monthly Rhythm', locked: false, included: true,
      content: 'Week 1: Strategy alignment call — review previous month, agree current month priorities\nWeek 2: Content and campaigns in execution\nWeek 3: Mid-month check-in — any adjustments required\nWeek 4: Performance review and end-of-month report delivered\n\nQuarterly sessions: Full 90-day review. KPI assessment. Roadmap revision for the next quarter.',
    },
    {
      id: 'what-success-looks-like', title: 'What Success Looks Like', locked: false, included: true,
      content: '[From enquiry: specific, measurable outcomes tied to the client\'s stated goals. Not generic metrics. The specific things this client said they want to achieve.]',
    },
    {
      id: 'team-structure', title: 'Team Structure', locked: false, included: true,
      content: 'Your dedicated team will include:\n\nGrowth Strategist — leads the engagement, owns the roadmap, leads quarterly reviews\nAccount Manager — day-to-day execution, content scheduling, client communication\nCreative Team — graphics, photography, video\nAdvertising Manager — paid campaign management\nDeveloper (as required) — CRM updates, landing pages, integrations',
    },
    {
      id: 'investment', title: 'Investment', locked: true, included: true,
      content: '',
    },
    {
      id: 'next-steps', title: 'Next Steps', locked: true, included: true,
      content: '1. Approve this proposal and sign the service agreement\n2. Onboarding session scheduled within 5 business days\n3. Month 1 strategy delivered within the first two weeks\n4. All accounts and access handed over to Kromium\'s management\n\nFor questions or to proceed: info@kromiumagency.com | (246) 232-1006',
    },
    {
      id: 'terms', title: 'Terms and Conditions', locked: false, included: true,
      content: 'Minimum Term: 6-month initial commitment. 30 days notice to cancel after the initial term.\n\nPayment: Monthly in advance. The first month\'s fee includes the onboarding and strategy session.\n\nScope: The monthly retainer covers the agreed deliverables. Additional projects or significant scope expansions are quoted separately.',
    },
  ],

  'full-ecosystem': [
    {
      id: 'executive-summary', title: 'Executive Summary', locked: false, included: true,
      content: 'This proposal outlines a full digital ecosystem engagement for [Client Name]. The scope covers [CRM / website / brand / marketing — as identified in discovery]. The goal is to build a cohesive, integrated digital infrastructure where every element reinforces the others — from the first point of contact through to client delivery and retention.',
    },
    {
      id: 'the-case-for-ecosystem', title: 'The Case for a Full Ecosystem', locked: false, included: true,
      content: 'Most businesses have fragments: a website that doesn\'t capture leads properly. A CRM that doesn\'t talk to the website. A social presence that isn\'t aligned to the brand. Marketing that runs independently of the CRM pipeline.\n\nThe result is predictable: opportunities fall through the gaps, and no one has full visibility of what is driving growth.\n\nKromium builds integrated systems where every component is designed to work together. The website feeds the CRM. The CRM informs the marketing. The marketing is measured against pipeline outcomes. This is digital infrastructure — not a collection of disconnected tools.',
    },
    {
      id: 'understanding-the-business', title: 'Understanding the Business', locked: false, included: true,
      content: '[From enquiry and discovery: detailed understanding of the business — operation, team, current tools, pain points, and growth ambitions. This section proves Kromium understood the business before proposing a solution.]',
    },
    {
      id: 'what-we-will-build', title: 'What We Will Build', locked: false, included: true,
      content: '[Customise based on scope — include only relevant components:]\n\nCustom CRM — Lead management, pipeline, client records, reporting, and automation\n\nWebsite — Lead-generating, SEO-optimised, integrated with the CRM\n\nBrand Identity — Visual system applied consistently across all digital and physical touchpoints\n\nMarketing Programme — Organic social, paid advertising, and content — all measured against pipeline outcomes',
    },
    {
      id: 'phase-plan', title: 'Phase Plan', locked: false, included: true,
      content: 'Phase 1 — Foundation (Months 1–2)\nBrand identity completed. CRM architecture designed and approved.\n\nPhase 2 — Build (Months 3–4)\nCRM built and tested. Website designed, built, and integrated with the CRM.\n\nPhase 3 — Launch and Activate (Month 5)\nAll systems live. Marketing programme begins. Team trained.\n\nPhase 4 — Optimise (Month 6+)\nOngoing growth retainer. Data-driven refinement. Quarterly strategy sessions.',
    },
    {
      id: 'case-studies', title: 'Proof of Delivery', locked: false, included: true,
      content: 'Azure Keys Realty — Full CRM Platform\nLive demo at azure-keys-crm.vercel.app\n\nSummitStone Developments — Construction Operations Platform\n\nCoralea Private Retreat — Hospitality CRM and Guest Intelligence Platform\n\nBarbados Gospelfest — Brand, Social Media, Website — 39% Instagram growth, sold-out events.',
    },
    {
      id: 'investment', title: 'Investment', locked: true, included: true,
      content: '',
    },
    {
      id: 'next-steps', title: 'Next Steps', locked: true, included: true,
      content: '1. Approve this proposal and sign the project brief\n2. Discovery session scheduled within 5 business days of deposit received\n3. Full project plan and timeline delivered after discovery\n\nFor questions or to proceed: info@kromiumagency.com | (246) 232-1006',
    },
    {
      id: 'terms', title: 'Terms and Conditions', locked: false, included: true,
      content: 'Payment Terms: 35% deposit on signing. Milestone payments as agreed per phase. 30% on final delivery.\n\nOwnership: Full IP and system ownership transfers to the client on final payment.\n\nConfidentiality: All client information is treated as strictly confidential.',
    },
  ],
}

// ── Helper: get sections for a given service type ─────────────────────────────
export function getDefaultSections(serviceType: ServiceType): ProposalSection[] {
  return (SECTION_TEMPLATES[serviceType] ?? SECTION_TEMPLATES['full-ecosystem']).map(s => ({ ...s }))
}

// ── All possible sections that can be added ───────────────────────────────────
export const ADDABLE_SECTIONS: { id: string; title: string }[] = [
  { id: 'team-credentials',  title: 'Team and Credentials' },
  { id: 'about-kromium',     title: 'About Kromium' },
  { id: 'our-approach',      title: 'Our Approach' },
  { id: 'kpis',              title: 'Key Performance Indicators' },
  { id: 'exclusivity',       title: 'Our Selective Approach' },
  { id: 'custom-section',    title: 'Custom Section' },
]

export const ADDABLE_SECTION_DEFAULTS: Record<string, string> = {
  'team-credentials': 'Jelissa Richards — Chief Content Strategist. 10+ years in digital marketing and campaign management. HubSpot Certified Content Marketer. Expert in cross-channel integration, brand strategy, photography, and videography.\n\nRommel Richards — Chief Advertising Strategist. 10+ years in digital advertising. Meta Blueprint Certified. Google Search Ads Certified.\n\nOur core team includes experienced videographers, photographers, graphic designers, and developers with a deep commitment to brand cohesion and measurable results.',
  'about-kromium': 'Kromium Marketing and Development Inc. is a Caribbean digital transformation agency based in Barbados. We are a selective partner — working with a limited number of clients to ensure each receives the personalised attention and dedication needed to succeed.\n\nOur expertise spans Custom CRM and Business Intelligence, Website and Digital Infrastructure, Brand and Identity, Social Media Management, Marketing and Growth, and Business Optimisation. We serve premium Caribbean businesses in real estate, construction, and hospitality — and any business ready to treat digital infrastructure as a core business function.',
  'our-approach': 'We believe in quality over quantity. Every client partnership is approached with the same level of rigour: deep discovery, tailored strategy, precise execution, and transparent reporting.\n\nWe do not build solutions and then find problems to apply them to. We understand the problem first — then design the solution that fits.',
  'kpis': 'Key performance indicators for this engagement will be agreed at the start of Month 1 and reviewed monthly. Initial KPIs will include:\n\n[Customise based on service type and client goals — e.g. lead volume, cost per lead, organic ranking movement, social engagement rate, pipeline value]',
  'exclusivity': 'Kromium takes on a limited number of new clients each year. This is intentional. We do not scale by volume — we scale by quality of outcome. Each client receives senior-level attention from the strategy layer down, not a team of juniors managed remotely.\n\nThis proposal reflects the considered view of our senior team on what is needed, what will work, and what we are prepared to commit to.',
  'custom-section': '[Add your content here]',
}
