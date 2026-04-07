// ── Proposal section templates by service type ────────────────────────────────
// Each section has: id, title, content (editable text), included (toggle)
// All content is pre-written in Kromium brand voice and ready to use.
// [Client Name], [Industry], [Country] are placeholders to replace manually.

export interface ProposalSection {
  id:       string
  title:    string
  content:  string
  included: boolean
  locked?:  boolean
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


// ── Shared content blocks used across templates ───────────────────────────────

const ABOUT_KROMIUM = `Kromium Marketing and Development Inc. is a premier Caribbean digital transformation agency based in Barbados, specialising in building the digital infrastructure that premium Caribbean businesses need to grow with intention. Our work spans custom CRM and Business Intelligence platforms, website and digital infrastructure, brand identity, social media management, marketing and growth, and business optimisation. We serve clients across the English-speaking Caribbean and beyond, with a particular focus on the real estate, construction, and hospitality verticals.

Our mission is straightforward: to create tailored digital solutions that drive engagement, foster meaningful connections, and deliver tangible, measurable results for every client we partner with. We have spent more than seven years refining our approach, and our exclusive client roster reflects our commitment to working only with businesses that share our standards and our appetite for excellence.

What sets Kromium apart is not the breadth of services we offer, but the depth with which we deliver them. We take on a limited number of new clients each year. This is intentional. By restricting our client intake, we ensure that every partner receives senior-level attention from strategy through delivery, not a team of juniors managed remotely. When you engage Kromium, you work directly with the people who will actually build your project.`

const PHILOSOPHY = `At Kromium, we value quality over quantity. Our selective client approach ensures that we only work with partners who align with our standards, our values, and our commitment to excellence. This is not a positioning statement. It is how we operate in practice.

Data-Driven Solutions: Every strategy we develop is deeply rooted in market research, audience analytics, and performance tracking. We do not create content or campaigns on instinct. Every decision is informed by data, refined by performance, and measured against agreed outcomes.

Tailored Approach: Every engagement is uniquely designed to meet the specific needs and goals of the client. We do not apply templates to complex problems. We invest the time to understand how the business operates, who its customers are, what its growth ambitions look like, and where the current infrastructure is falling short.

Commitment to Excellence: We continuously refine our strategies to stay ahead of industry trends and deliver premium results. Our team members hold internationally recognised certifications in their respective disciplines and bring more than a decade of professional experience to every engagement.`

const TEAM_CREDENTIALS = `Jelissa Richards, Chief Content Strategist, brings more than ten years of experience in digital marketing and campaign management. She is an expert in cross-channel integration and branding strategy, with five additional years of project management experience in the non-profit sector. Jelissa is a HubSpot Certified Content Marketer and holds professional-level experience in photography, videography, and graphic design.

Rommel Richards, Chief Advertising Strategist, brings more than ten years of experience in digital advertising. He is a Meta Blueprint certified advertising professional and a certified Google Search Ads specialist, with a track record of building and managing high-performance campaigns across the Caribbean and internationally.

Our core team includes experienced videographers and photographers capable of handling productions ranging from cinematic brand films to high-performing short-form social content. Complementing them are skilled graphic designers with a keen eye for branding, a solid grasp of business development principles, and a deep personal commitment to maintaining brand cohesion across every touchpoint. For technical engagements, our development team brings expertise in full-stack web development, custom CRM architecture, and business intelligence platform design.`

const CASE_STUDIES_MARKETING = `RIMCO Barbados SRL is a prominent heavy-duty equipment provider serving Barbados and the English-speaking Caribbean. When RIMCO approached Kromium, their primary goal was to elevate brand awareness across the region while driving increased sales. Despite being a stalwart in the heavy-duty equipment industry for more than two decades, RIMCO was not a household name, and they needed that to change.

Our strategy focused on five pillars: the personalisation of the brand, a year-long advertising campaign, the use of customer testimonials for social proof, the development of localised content, and the highlighting of RIMCO's community and social endeavours. We humanised the brand by putting real faces to it, leveraging RIMCO's own sales team to showcase equipment through video. Original, local imagery ensured that the audience could identify with the machinery, the sales team, and the operators, rather than seeing generic stock photography.

The results were outstanding. RIMCO Barbados SRL achieved 3.59 million impressions, 1,562 interactions, and 2,576 followers across platforms. Our adaptive month-to-month strategies, informed continuously by performance data, drove not only increased brand awareness but tangible sales results across the Caribbean. The audience built was quality, not volume. The individuals following RIMCO's pages are those most likely to convert.

Italia Coffee Barbados, a beloved household name with a legacy of more than 25 years, faced a period of brand stagnation. Over a six-month partnership, Kromium collaborated with Italia Coffee to revitalise their presence both in-store and across social media. Our efforts included a brand refresh that modernised and streamlined their visual identity across all touchpoints, and a social media transformation that infused personality and relatability into their pages. Instagram followers grew from a stagnant 12,000 to nearly 15,000, 1.6 million impressions were achieved in the first three months alone, and 10,860 interactions reflected a measurably more engaged community.

Barbados Gospelfest partnered with Kromium to modernise their branding and enhance their social media presence ahead of the festival season. We executed a comprehensive refresh that included a redesigned festival logo, revamped social media pages with cohesive branding, new promotional materials, and an updated website. Instagram followers increased from 2,278 to 3,165, a jump of 39% not seen in many years of the platform's existence. Multiple events during the festival week achieved sold-out attendance.

COSCAP Barbados, the country's governing body for copyright in the music industry, partnered with Kromium to reintroduce their Featured Artist Campaign across social media. Through in-depth interviews with members and featured artists, we created compelling video content that highlighted the organisation's mission and its value to local artists. The campaign achieved a revived social media following, high engagement on every video released, and increased awareness of COSCAP's role, leading more individuals to actively seek their services.`

const CASE_STUDIES_TECH = `Azure Keys Realty is a luxury Caribbean real estate firm operating across Cayman Islands, Nassau, and Montego Bay. The firm required a CRM that reflected how premium property sales actually work, from first enquiry through to completed transaction. Kromium built a full-stack platform covering lead management with automated scoring, a pipeline tailored to the luxury property sales cycle, client and property records, investor portal functionality, financial reporting dashboards, and a website lead capture system routing enquiries directly into the pipeline. The platform is live at azure-keys-crm.vercel.app.

SummitStone Developments is a construction and development group operating across four Caribbean islands. The challenge was operational: multi-island project coordination, investor reporting, subcontractor management, hurricane compliance documentation, and multi-currency financial tracking. Kromium built a custom operations platform from the ground up, covering every workflow the business needed, owned outright with no monthly licence dependency.

Coralea Private Retreat is a luxury boutique retreat in Barbados that required a guest CRM handling the full guest lifecycle, from initial enquiry through reservation, in-stay experience management, and post-stay loyalty nurturing. The platform gives the Coralea team complete visibility into every guest relationship, with automated follow-up sequences, experience revenue tracking, and a reporting dashboard built for property management.`

const NEXT_STEPS_STANDARD = `1. Digital Marketing Audit
Once this proposal is approved, Kromium will conduct a comprehensive digital audit of your current presence. This will analyse your existing digital infrastructure, highlight strengths, identify weaknesses and gaps, and provide a clear set of strategic recommendations for moving forward. The completed audit will be delivered within two weeks of approval for your review and discussion.

2. Implementation and Ongoing Work
After the audit is reviewed and the implementation plan is agreed upon, we will begin developing the first two months of content and campaigns, ensuring we are always ahead of schedule. Month-to-month, we will execute the agreed strategies, consistently monitor performance, and make real-time adjustments to maximise results as data becomes available.

3. Reporting and Performance Tracking
Monthly reports delivered at the end of each month summarising initiatives and results. Quarterly reports giving a broader view of progress. An end-of-year report providing a comprehensive review of results, milestones, and opportunities for the year ahead.

We look forward to beginning this partnership. For any questions or to confirm your decision to proceed:
Email: info@kromiumagency.com | Phone: +1 246 232 1006 | Website: www.kromiumdigital.com`

const NEXT_STEPS_PROJECT = `1. Project Brief and Agreement
Once this proposal is approved, we will issue the project brief and service agreement for signature. The brief captures the full scope of work, key milestones, the revision policy, and all relevant timelines. No work begins until the brief is signed and the deposit is received.

2. Deposit and Start Date
A deposit of 35% of the total project investment is required to secure your start date. Start dates are allocated in the order deposits are received.

3. Discovery Session
The first formal session is a structured discovery meeting with the Kromium team. This is where we go deep on the operation, the goals, the existing infrastructure, and any constraints. It typically runs two to three hours and is recorded for reference.

4. Project Delivery
Following discovery, the project proceeds through the agreed phases with clear milestones and client approval gates at each stage.

For questions or to confirm your decision to proceed:
Email: info@kromiumagency.com | Phone: +1 246 232 1006 | Website: www.kromiumdigital.com`

const TERMS_RETAINER = `Exclusions: The fees outlined in this proposal do not include any advertising budget, which will be invoiced separately or charged directly by the respective advertising platforms as per the agreed arrangement. Event coverage, extended videography, or photography beyond the monthly package will be billed separately.

Package Pricing: The services detailed herein are offered as a comprehensive package. Any modification, removal, or substitution of individual services may result in an adjustment to the overall pricing.

Minimum Commitment: A minimum commitment of three months applies. After the initial three-month period, either party may terminate with thirty days written notice.

Payment Terms: Monthly invoices are issued at the beginning of each calendar month and are payable within seven days of receipt.

Content Ownership: All original content produced becomes the property of the client on full payment of each monthly invoice. Kromium retains the right to use completed work in its portfolio unless otherwise agreed.

Confidentiality: All client information is treated as strictly confidential and will not be shared with any third party without written consent.`

const TERMS_PROJECT = `Payment Terms: A deposit of 35% of the total investment is required upon signing. A second payment of 35% is due upon completion and approval of the design phase. The final 30% is due upon project launch and delivery of all final files. All work remains the intellectual property of Kromium Marketing and Development Inc. until full payment has been received, at which point full ownership transfers unconditionally to the client.

Revisions: Two rounds of consolidated, written revisions are included at each phase. Additional revision rounds will be scoped and billed separately.

Timeline: The timeline assumes timely feedback and approvals from the client at each phase gate. Delays in client feedback may extend the overall delivery schedule.

Intellectual Property: All creative work, code, designs, and deliverables transfer in full to the client upon receipt of final payment. Kromium retains the right to display completed work in its portfolio.

Confidentiality: All client information is treated as strictly confidential and will not be shared with any third party without written consent.`


export const SECTION_TEMPLATES: Record<ServiceType, ProposalSection[]> = {

  // ══════════════════════════════════════════════════════════════════════════
  // MARKETING
  // ══════════════════════════════════════════════════════════════════════════
  'marketing': [
    {
      id: 'executive-summary', title: 'Executive Summary', locked: false, included: true,
      content: `Thank you for the opportunity to present this proposal to [Client Name]. At Kromium Marketing and Development Inc., we understand the importance of a cohesive, consistent, and engaging digital presence to connect with your audience, reinforce the strength of your brand, and deliver measurable results that matter to your business.

This proposal outlines our tailored approach for [Client Name], covering social media management, content creation, and paid advertising across the channels most relevant to your audience in [Market]. Our goal from day one is to function not as an external vendor, but as an extension of your team, one that is as invested in your success as you are.

We have reviewed what you are looking to achieve and we are confident that the programme outlined in this document will deliver the visibility, engagement, and growth outcomes your business deserves. We look forward to building a strong, results-driven partnership together.`,
    },
    {
      id: 'about-kromium', title: 'About Kromium Marketing and Development Inc.', locked: false, included: true,
      content: 'Kromium Marketing and Development Inc. is a premier Caribbean digital transformation agency based in Barbados. We specialise in building the digital infrastructure that premium Caribbean businesses need to grow: custom CRM and business intelligence platforms, websites, brand identities, social media management, marketing and growth programmes, and business optimisation.\n\nWe are not a generalist agency. We work with a selective roster of clients across three core verticals: real estate, construction and development, and hospitality and tourism. This focus means we understand the specific operational realities of the businesses we serve in a way that no generalist could. When you work with Kromium, you work with a team that has already solved your industry\\\'s problems before.\n\nOur mission is straightforward: to create tailored digital solutions that drive engagement, foster meaningful connections, and deliver tangible results. We measure our success entirely by our clients\\\' success. That metric is why we are the preferred digital partner for premium Caribbean businesses across the region.',
    },
    {
      id: 'philosophy', title: 'Our Philosophy and Selective Approach', locked: false, included: true,
      content: 'At Kromium, we value quality over quantity. Our selective client approach ensures that every business we partner with receives the full attention and dedication needed to succeed. We do not take on every enquiry. We take on the right ones.\n\nOur approach is built on three pillars. First, data-driven solutions: every strategy we develop is rooted in market research, audience analytics, and performance tracking. We do not make creative decisions in a vacuum. Second, a tailored approach: no two clients receive the same proposal, the same strategy, or the same execution plan. Everything is designed specifically for your business, your audience, and your market. Third, a commitment to excellence: we continuously refine our strategies to stay ahead of industry trends and deliver results that genuinely move the needle.\n\nBy limiting the number of clients we take on at any given time, we ensure that your account receives senior-level attention from strategy through execution. You will work directly with the people building your project, not a rotating team of juniors.',
    },
    {
      id: 'team-credentials', title: 'Key Credentials and Team Expertise', locked: false, included: true,
      content: 'Our leadership team brings over a decade of experience in digital marketing, advertising, and creative production.\n\nJelissa Richards, Chief Content Strategist, has more than ten years of experience in digital marketing and campaign management, with deep expertise in cross-channel integration and branding strategies. She brings five years of project management experience in the non-profit sector, is a HubSpot Certified Content Marketer, and has professional training in photography, videography, and graphic design.\n\nRommel Richards, Chief Advertising Strategist, has over ten years of experience in digital advertising. He is a Meta Blueprint certified advertising professional and a Google Search Ads certified specialist with a proven track record of driving measurable results across Caribbean and international markets.\n\nOur core team includes experienced videographers and photographers who handle projects ranging from cinematic productions to high-performing short-form content. Complementing them are skilled graphic designers with a keen eye for branding, a solid grasp of business development, and a deep commitment to maintaining brand cohesion. For technical engagements, our development team brings expertise in custom CRM architecture, web development, and business intelligence systems.',
    },
    {
      id: 'case-studies', title: 'Case Studies: Proven Excellence', locked: false, included: true,
      content: 'RIMCO Barbados SRL, a prominent heavy-duty equipment provider serving Barbados and the English-speaking Caribbean, approached Kromium with a clear primary goal: elevate brand awareness across the region and drive increased sales. Despite being a stalwart in the heavy-duty equipment industry for over two decades, RIMCO was not a household name in the Caribbean.\n\nOur strategy focused on several key pillars: personification of the brand, a year-long advertising campaign, customer testimonials for social proof, localised content creation, and highlighting social endeavours. We humanised the brand by putting faces to it, leveraging the expertise of RIMCO\\\'s sales team to showcase equipment through video. Every piece of content used original, localised imagery so that the audience could identify with the machinery, the sales team, and the operators. The results were outstanding: 3.59 million impressions, 1,562 interactions, and 2,576 followers across platforms. The audience built was quality, not volume, which translates directly into higher conversion potential.\n\nItalia Coffee Barbados, a beloved household name with a legacy of over 25 years, faced brand stagnation and needed a fresh approach to remain relevant in a competitive market. Over a six-month partnership, Kromium modernised and streamlined the brand for their diverse food and drink offerings, ensuring a cohesive and visually appealing design across all touchpoints, while infusing personality and relatability into their social media presence. Instagram followers grew from a stagnant 12,000 to nearly 15,000 by the end of the engagement, with 1.6 million impressions achieved in the first three months alone and over 10,800 interactions across the period.\n\nBarbados Gospelfest partnered with Kromium to modernise its branding and enhance its social media presence. We redesigned the festival logo to reflect a contemporary yet culturally resonant identity, revamped all social media pages with cohesive branding and strategic content, developed new promotional materials including vibrant flyers for the week-long festival, and updated the website for user engagement and ticket information. Instagram followers increased from 2,278 to 3,165, a significant jump not seen in the platform\\\'s many years of existence. Many events during the festival week achieved sold-out attendance.',
    },
    {
      id: 'our-plan', title: 'Our Plan for [Client Name]', locked: false, included: true,
      content: `At Kromium Marketing and Development Inc., we understand that [Client Name] requires more than generic social media management. Your audience in [Market] is specific, your brand has standards, and your marketing investment needs to work as hard as you do. Our tailored approach ensures that every post, campaign, and report reflects your brand values and moves the needle on the outcomes you care about.

1. Monthly Content Planning
We will develop a comprehensive monthly content plan designed to align with your brand strategy, seasonal campaigns, and promotional goals. This content calendar will be presented for review and approval in advance of each month, allowing for strategic alignment and timely execution. Nothing goes live without your sign-off.

2. Quarterly Creative Development
To maintain fresh, high-performing content, we will conduct quarterly creative sessions to produce original content, including professional photography capturing visually compelling, on-brand imagery of your products, services, team, and community, and short-form video production showcasing your brand story, promotions, and key initiatives.

3. High-Quality Graphics and Design
Our design team will create premium, custom-designed graphics to support campaigns, special offers, and brand messaging. Every graphic is designed specifically for [Client Name] and optimised for the relevant platforms, ensuring seamless consistency across Facebook, Instagram, LinkedIn, and any other agreed channels.

4. Research and Copywriting
Our team will craft compelling, targeted copy for all posts and campaigns, informed by ongoing research into market trends, audience behaviour, and competitive activity. This ensures that every piece of content speaks directly to your audience and drives the engagement and action you are looking for.

5. Platform Monitoring and Community Engagement
We will actively monitor all [Client Name] platforms to ensure timely responses to comments, questions, and messages; community building through genuine engagement with followers; and reputation management, monitoring and addressing feedback to maintain a consistently positive brand image.

6. Monthly Analytical Reports
Each month, we will deliver a detailed performance report summarising key metrics including audience growth and engagement trends, content performance by format and topic, paid campaign performance and return on ad spend, and strategic recommendations for the month ahead. This data-driven approach guides every decision we make.

7. Dedicated Account Team
To ensure seamless execution, we will assign a dedicated team of specialists to manage the [Client Name] account. This team serves as an extension of your operation and is available for last-minute requests or urgent updates, regular strategic alignment meetings, and ongoing performance conversations. From day one, our goal is to integrate effortlessly with your operation and uphold the standards your brand represents.`,
    },
    {
      id: 'paid-advertising', title: 'Paid Advertising Strategy', locked: false, included: true,
      content: `To achieve meaningful reach and visibility, a dedicated advertising budget will be required in addition to the creative and management services outlined above. This budget is allocated directly to digital platforms such as Facebook, Instagram, Google, and LinkedIn and is entirely separate from Kromium's management fees.

Recommended Platforms:
Facebook and Instagram are ideal for broad awareness campaigns, reaching consumers and professionals while reinforcing your brand identity with high-quality visual content. Google Ads captures intent-driven searches from individuals actively looking for your products or services. LinkedIn is the most effective platform for B2B and professional audience engagement, with precise targeting by job title, industry, and seniority.

Payment Structure:
Our strong recommendation is that [Client Name] holds the advertising budget directly within the ad manager accounts for each platform. This provides full transparency, direct ownership of campaign data and billing records, and real-time visibility into exactly what is being spent and where. Kromium can manage the campaigns on your behalf while you retain complete financial control. If preferred, Kromium can manage all ad spend and invoice monthly, with full supporting documentation provided.

Recommended Ad Spend: [To be agreed based on market, objectives, and platform mix. Kromium will provide a specific recommendation following the digital audit.]`,
    },
    {
      id: 'reporting', title: 'Reporting and Performance Tracking', locked: false, included: true,
      content: `Transparency and accountability are not optional extras in a Kromium engagement. They are built into the programme from day one.

Monthly Reports are delivered at the end of each calendar month. They summarise every initiative executed during the month, the results achieved across all platforms, content performance by type and topic, paid campaign metrics including reach, clicks, cost per result, and return on ad spend, and specific recommendations for the following month based on what the data is telling us.

Quarterly Reports give a broader view of progress over each three-month period. They review the strategic direction, assess performance against the goals agreed at the outset, and propose any adjustments needed to the approach for the coming quarter.

End-of-Year Report provides a comprehensive review of overall results, key milestones achieved, and an honest assessment of what worked, what could be refined, and what the opportunities look like for the year ahead.

Every report is designed to keep [Client Name] fully informed and confident in the investment being made. We do not hide behind vanity metrics. We report on the numbers that actually matter to your business.`,
    },
    {
      id: 'investment', title: 'Investment', locked: true, included: true,
      content: `At Kromium Marketing and Development Inc., we design pricing structures based on the specific requirements of each engagement. The investment outlined below is based on the scope agreed for [Client Name]. Please note that the advertising budget is not included in the management fee and will be invoiced separately or charged directly by the platforms to a client-held card.

The services detailed in this proposal are offered as a comprehensive package. Any modification, removal, or substitution of individual services may result in an adjustment to the overall pricing.`,
    },
    {
      id: 'conclusion', title: 'Conclusion', locked: false, included: true,
      content: `At Kromium Marketing and Development Inc., we believe in the power of meaningful partnerships built on trust, shared ambition, and a genuine commitment to results. Our team is fully committed to becoming an extension of the [Client Name] operation, working closely with your team to deliver the consistency, creativity, and performance that your brand deserves.

By leveraging our expertise in social media strategy, creative development, and data-driven execution, we are confident in our ability to elevate the digital presence of [Client Name] and deliver outcomes that reflect the standards your organisation is known for. Our proactive and collaborative approach ensures that every campaign, every post, and every interaction aligns with your brand identity and vision.

We are genuinely excited about the opportunity to work with [Client Name] and look forward to building a strong, results-driven relationship together.

For any questions or further discussion, please feel free to contact us:
Email: info@kromiumagency.com | Phone: +1 246 232 1006 | Website: www.kromiumdigital.com`,
    },
    {
      id: 'next-steps', title: 'Next Steps', locked: true, included: true,
      content: 'Once this proposal is approved, Kromium will proceed as follows.\n\nFirst, we will conduct a comprehensive digital marketing audit of your current presence. This audit will analyse your existing platforms, highlight strengths, identify weaknesses, and provide specific strategic recommendations for moving forward. The completed audit will be delivered within two weeks of approval for your review and sign-off.\n\nSecond, following audit review and implementation agreement, we will begin developing two months worth of content ahead of schedule, ensuring we are always ahead of the delivery curve. From month one, we will execute the agreed strategies and monitor performance in real time, making adjustments as the data directs.\n\nThird, reporting and performance tracking will run consistently throughout the engagement. Monthly reports will be delivered at the end of each month. Quarterly reports will provide a broader view of progress. At the close of each year, a comprehensive annual review will be produced.\n\nEmail: info@kromiumagency.com\nPhone: +1 246 232 1006\nWebsite: www.kromiumdigital.com',
    },
    {
      id: 'terms', title: 'Terms and Conditions', locked: false, included: true,
      content: 'Minimum Commitment: This engagement requires a minimum initial term of three months. Following the initial term, either party may terminate with 30 days written notice.\n\nPayment: Monthly fees are invoiced in advance at the beginning of each month. Advertising budget, where applicable, is invoiced separately or charged directly by the platforms to the client\\\'s own card, as agreed.\n\nAdvertising Budget: The advertising spend is separate from the management fee. It is allocated directly to digital platforms. Kromium strongly recommends the client hold their own card within each platform\\\'s ad manager for full transparency. If Kromium manages payments on the client\\\'s behalf, funds will be disbursed to the platforms with full reporting provided.\n\nScope: The monthly retainer covers the agreed deliverables. Significant scope additions will be quoted separately.\n\nIntellectual Property: All original content produced becomes the property of the client on full payment of each monthly invoice.\n\nPackage Pricing: The services are offered as a comprehensive package. The exclusion or modification of any element may result in an adjustment to the overall package pricing.',
    },
  ],

  // ══════════════════════════════════════════════════════════════════════════
  // CUSTOM CRM
  // ══════════════════════════════════════════════════════════════════════════
  'custom-crm': [
    {
      id: 'executive-summary', title: 'Executive Summary', locked: false, included: true,
      content: `Thank you for the opportunity to present this proposal to [Client Name]. This document outlines a custom CRM and Business Intelligence platform built specifically for your operation in [Industry], designed around the exact workflow, team structure, and growth ambitions of your business.

The challenge facing [Client Name] is one we recognise immediately: a growing operation with increasing complexity that generic tools were never designed to handle. Whether it is leads falling through the gaps, inconsistent follow-up across a distributed team, no clear pipeline visibility, or a reporting picture that tells you almost nothing useful, the root cause is the same. The tools are not built for your business. They are built for a hypothetical average business, and you are not average.

Kromium will design and build a system that matches exactly how [Client Name] operates. When the project is complete, you own it outright. No monthly licence. No lock-in. No dependency on a platform that could change its pricing or features at any time. The platform is yours, permanently.`,
    },
    {
      id: 'about-kromium', title: 'About Kromium Marketing and Development Inc.', locked: false, included: true,
      content: 'Kromium Marketing and Development Inc. is a premier Caribbean digital transformation agency based in Barbados. We specialise in building the digital infrastructure that premium Caribbean businesses need to grow: custom CRM and business intelligence platforms, websites, brand identities, social media management, marketing and growth programmes, and business optimisation.\n\nWe are not a generalist agency. We work with a selective roster of clients across three core verticals: real estate, construction and development, and hospitality and tourism. This focus means we understand the specific operational realities of the businesses we serve in a way that no generalist could. When you work with Kromium, you work with a team that has already solved your industry\\\'s problems before.\n\nOur mission is straightforward: to create tailored digital solutions that drive engagement, foster meaningful connections, and deliver tangible results. We measure our success entirely by our clients\\\' success. That metric is why we are the preferred digital partner for premium Caribbean businesses across the region.',
    },
    {
      id: 'the-case-for-custom', title: 'The Case for a Custom Platform', locked: false, included: true,
      content: `Generic CRM platforms like HubSpot, Salesforce, and Zoho were built for North American and European business models. They carry no Caribbean market intelligence, no understanding of the specific operational rhythms of your industry, and no flexibility to reflect the way your business actually runs. You adapt to them, not the other way around.

Beyond the fit problem, there is the ownership problem. Every month you pay a SaaS subscription, you are paying rent on infrastructure that will never be yours. Cancel the subscription and you lose access to your pipeline, your client history, your automation rules, and your reporting. You are building on someone else's land.

Kromium builds custom platforms on technology you own outright. Next.js on the frontend, Supabase for the database, hosted on Vercel. All three are best-in-class, used by companies processing billions of transactions globally. The difference is that your instance is yours. The code is in your own repository. The data is in your own database. There is no monthly licence and no platform that can change the terms on you.

A custom build also means every module, every workflow, every report is designed around what [Client Name] actually needs, not what a product team in San Francisco decided the average business might want. The result is a system your team will actually use, because it reflects the way they already work.`,
    },
    {
      id: 'understanding-your-operation', title: 'Understanding Your Operation', locked: false, included: true,
      content: `[This section should be personalised to the client. Based on what was submitted in the enquiry and any discovery conversation, describe back to the client their specific operation, pain points, team structure, and goals. The following is a framework to complete:]

From what [Client Name] has shared with us, the business is [describe the operation, size, geography, what it does]. The team structure involves [describe team size and roles relevant to CRM use]. The current approach to managing leads and clients relies on [describe existing tools or lack thereof], which is creating friction at several points in the workflow.

The core pain points are clear: [list the specific pain points selected in the enquiry, written as full sentences]. The goal is not just to fix these problems in isolation, but to build a system that gives the entire team visibility, accountability, and the ability to scale without adding headcount or complexity.

[Client Name] is operating in [Country/Market], which means the platform needs to reflect the specific realities of the Caribbean market, including [add any relevant market specifics such as multi-currency, seasonal patterns, regulatory context].`,
    },
    {
      id: 'what-we-will-build', title: 'What We Will Build', locked: false, included: true,
      content: `The CRM platform for [Client Name] will be built across the following modules, each designed around the specific operational requirements identified during the discovery process.

Lead Management: A full pipeline from first enquiry through to conversion. Every lead is captured, scored automatically based on profile and behaviour, and assigned to the appropriate team member with follow-up tasks generated automatically. No lead falls through the gap.

Pipeline and Deal Tracking: A visual kanban-style pipeline that gives the entire team real-time visibility into where every deal stands, what the next action is, who owns it, and when it is due. Status updates trigger automated notifications to relevant team members.

Client and Contact Records: Comprehensive profiles for every client and contact, including full interaction history, notes, tasks, linked projects, and financial records. Every conversation, every email, every meeting is logged in one place.

Task and Activity Management: A unified task system linked to leads, clients, and projects. Automated task generation based on pipeline stage and lead score. Overdue task alerts and team performance visibility for management.

Reporting and Business Intelligence: Revenue tracking, pipeline velocity, conversion rates, team performance, and source attribution. Dashboards built for the decisions [Client Name] actually needs to make, not generic charts that look impressive but tell you nothing actionable.

Website Lead Capture: Forms integrated directly into the website that route enquiries into the CRM automatically. Every submission scored, tagged, assigned, and actioned without any manual input required.

Mobile Access: The full platform is accessible on any device through a browser. No separate app required, no additional cost, and the same experience whether you are at your desk or in the field.`,
    },
    {
      id: 'technical-architecture', title: 'Technical Architecture and Ownership', locked: false, included: true,
      content: `The platform is built on a modern, proven technology stack designed for performance, security, and longevity.

Frontend: Next.js 14 with TypeScript and Tailwind CSS. Next.js is used by some of the largest companies in the world. It is fast, maintainable, and designed to scale. TypeScript catches errors before they reach production. The result is a codebase that any competent developer can pick up and extend.

Database: Supabase, built on PostgreSQL. Row-level security ensures that every user sees only the data they are supposed to see. Real-time subscriptions mean that updates appear instantly across all open sessions. PostgreSQL is the most trusted relational database in the world.

Hosting: Vercel. Zero-downtime deployments, a global content delivery network, and 99.99% uptime SLA. Your platform loads fast anywhere in the Caribbean and beyond.

Authentication: Supabase Auth with role-based access control. Admin, manager, and standard user roles are configured to your exact requirements. A full audit log records every login and every significant action.

What you own when the project is complete:

The full source code, hosted in a private GitHub repository in your name. The database and every record within it. The domain and hosting infrastructure. There is no monthly licence, no per-seat charge, no dependency on Kromium for the system to continue operating. The platform runs without us.`,
    },
    {
      id: 'phase-plan', title: 'Phase Plan and Timeline', locked: false, included: true,
      content: `Phase 1: Discovery and Architecture (Weeks 1 to 2)
A structured discovery session with the [Client Name] team to map every workflow, data model, user role, and integration requirement. Database schema design and technical specification completed and signed off before any build work begins. No assumptions. No surprises.
Deliverable: Signed technical specification and project plan.

Phase 2: Design System (Weeks 3 to 4)
UI kit, colour system, and component library built to [Client Name] brand standards. All primary screens designed and presented for approval before development begins. The client sees exactly what they are getting before a line of code is written.
Deliverable: Approved design system and screen mockups.

Phase 3: Core Build (Weeks 5 to 9)
All primary modules built and tested: lead management, pipeline, client records, task management, and reporting dashboards. Internal quality assurance across all user roles and device types.
Deliverable: Functional platform available for client preview in staging environment.

Phase 4: Integration and Testing (Week 10)
Website lead capture integrated and tested. Email notifications configured. Any third-party integrations connected and verified. Full end-to-end testing with real data scenarios.
Deliverable: Fully integrated platform ready for user acceptance testing.

Phase 5: Training and Launch (Weeks 11 to 12)
Team training session conducted and recorded for ongoing reference. Production deployment with Kromium monitoring. 30-day post-launch support period included.
Deliverable: Live platform, trained team, and handover documentation.`,
    },
    {
      id: 'case-studies', title: 'Proof of Delivery', locked: false, included: true,
      content: 'Azure Keys Realty, a luxury Caribbean real estate firm operating across the Cayman Islands, Nassau, and Montego Bay, needed a CRM that reflected how premium property sales actually work. Generic SaaS tools carried none of the industry intelligence required for a luxury brokerage operation. Kromium built a full-stack custom CRM platform covering lead management, pipeline tracking, property records, buyer and seller portals, and reporting dashboards. The system is owned outright by Azure Keys, carries no monthly licence fee, and is live at azure-keys-crm.vercel.app.\n\nSummitStone Developments, a Caribbean construction and development group operating across four islands, required a single operational platform to manage projects, subcontractors, investor reporting, and multi-island compliance workflows. Kromium designed and built a construction operations system covering project tracking, subcontractor management, investor dashboards with real-time project updates, hurricane compliance documentation, and multi-currency financial reporting. Every module was designed around the specific operational realities of Caribbean construction.\n\nIn both engagements, the client received full code ownership, full data ownership, and a system trained to their team before handover. No ongoing licence fees. No dependency on Kromium for the platform to function.',
    },
    {
      id: 'investment', title: 'Investment', locked: true, included: true,
      content: `Kromium designs project pricing based on the specific scope of each engagement. The investment below covers the complete platform as described in this proposal, from discovery through to launch and the 30-day post-launch support period. All prices are quoted in USD.

The build is structured in three payment milestones: 35% deposit on signing of the project brief, 35% on design system approval at the end of Phase 2, and 30% on launch.`,
    },
    {
      id: 'next-steps', title: 'Next Steps', locked: true, included: true,
      content: 'Once this proposal is approved, the process moves quickly.\n\nThe first step is to sign the project brief and submit the deposit payment. This secures your place in our project schedule. We operate with a structured intake process and take on a limited number of projects at a time, so deposit receipt is what confirms your start date.\n\nWithin five business days of the signed brief and deposit, we will schedule the discovery session. This is a focused, working session with your team to finalise the scope, align on priorities, and establish the approval workflow for the engagement.\n\nBuild begins immediately after discovery. Every phase milestone is communicated in advance with a clear approval gate before the next phase commences. Nothing moves forward without your sign-off.\n\nTo proceed or to discuss any aspect of this proposal, contact us directly.\n\nEmail: info@kromiumagency.com\nPhone: +1 246 232 1006\nWebsite: www.kromiumdigital.com',
    },
    {
      id: 'terms', title: 'Terms and Conditions', locked: false, included: true,
      content: 'Payment Terms: A deposit of 35 percent of the total project investment is due on signing to secure the project start date. A further 35 percent is due on design or concept approval. The remaining 30 percent is due on final delivery and handover. All work produced remains the intellectual property of Kromium Marketing and Development Inc. until the final payment is received in full, at which point full ownership transfers permanently to the client.\n\nRevisions: Two rounds of consolidated revisions are included at each project phase. A round of revisions is defined as a single set of written feedback addressed in one pass. Requests for concept pivots after a direction has been approved, or revisions beyond the included rounds, will be scoped and quoted separately.\n\nTimeline: The timeline assumes timely feedback and approvals from the client at each phase. Delays in client feedback may extend the delivery schedule accordingly.\n\nConfidentiality: All client information shared during this engagement is treated as strictly confidential and will not be shared with any third party.\n\nPortfolio: Kromium reserves the right to display completed work in its portfolio unless the client requests otherwise in writing at the outset of the engagement.',
    },
  ],

  // ══════════════════════════════════════════════════════════════════════════
  // WEBSITE
  // ══════════════════════════════════════════════════════════════════════════
  'website': [
    {
      id: 'executive-summary', title: 'Executive Summary', locked: false, included: true,
      content: `Thank you for the opportunity to present this proposal to [Client Name]. This document outlines the design and development of a new website built to function as a genuine business asset, not a digital brochure.

The brief is clear: [Client Name] needs a website that [generates enquiries / takes direct bookings / showcases the work and builds credibility / feeds leads directly into a sales pipeline]. Every page will be designed around a specific audience, a defined purpose, and a measurable outcome. The site will be built to rank in search, load fast on every device, and convert visitors into leads or customers at a meaningfully higher rate than what currently exists.

When the project is complete, [Client Name] owns the site outright. Full access to the codebase, the hosting, the domain, and the content management system. No monthly platform fee, no lock-in, and no dependency on Kromium for the site to operate.`,
    },
    {
      id: 'about-kromium', title: 'About Kromium Marketing and Development Inc.', locked: false, included: true,
      content: 'Kromium Marketing and Development Inc. is a premier Caribbean digital transformation agency based in Barbados. We specialise in building the digital infrastructure that premium Caribbean businesses need to grow: custom CRM and business intelligence platforms, websites, brand identities, social media management, marketing and growth programmes, and business optimisation.\n\nWe are not a generalist agency. We work with a selective roster of clients across three core verticals: real estate, construction and development, and hospitality and tourism. This focus means we understand the specific operational realities of the businesses we serve in a way that no generalist could. When you work with Kromium, you work with a team that has already solved your industry\\\'s problems before.\n\nOur mission is straightforward: to create tailored digital solutions that drive engagement, foster meaningful connections, and deliver tangible results. We measure our success entirely by our clients\\\' success. That metric is why we are the preferred digital partner for premium Caribbean businesses across the region.',
    },
    {
      id: 'team-credentials', title: 'Key Credentials and Team Expertise', locked: false, included: true,
      content: 'Our leadership team brings over a decade of experience in digital marketing, advertising, and creative production.\n\nJelissa Richards, Chief Content Strategist, has more than ten years of experience in digital marketing and campaign management, with deep expertise in cross-channel integration and branding strategies. She brings five years of project management experience in the non-profit sector, is a HubSpot Certified Content Marketer, and has professional training in photography, videography, and graphic design.\n\nRommel Richards, Chief Advertising Strategist, has over ten years of experience in digital advertising. He is a Meta Blueprint certified advertising professional and a Google Search Ads certified specialist with a proven track record of driving measurable results across Caribbean and international markets.\n\nOur core team includes experienced videographers and photographers who handle projects ranging from cinematic productions to high-performing short-form content. Complementing them are skilled graphic designers with a keen eye for branding, a solid grasp of business development, and a deep commitment to maintaining brand cohesion. For technical engagements, our development team brings expertise in custom CRM architecture, web development, and business intelligence systems.',
    },
    {
      id: 'case-studies', title: 'Proof of Delivery', locked: false, included: true,
      content: `Barbados Gospelfest partnered with Kromium to modernise their digital presence ahead of the festival season. In addition to a full brand refresh and social media overhaul, Kromium redesigned and rebuilt the Gospelfest website, optimising it for user engagement and ticket information. The result was a platform that supported the festival's most successful season in recent memory, with multiple sold-out events and a 39% increase in Instagram followers over the campaign period.

Azure Keys Realty required a client-facing web presence integrated directly with their custom CRM. Kromium designed and built property-facing pages, a lead capture system, and a mortgage calculator, all routing directly into the CRM pipeline and scoring leads automatically on submission. The system is live at azurekeys.bb.

Italia Coffee Barbados worked with Kromium to update their website through their parent company WICOFFEE.COM. The project was part of a broader brand refresh that grew their Instagram following from 12,000 to nearly 15,000 and generated 1.6 million impressions in the first three months of the engagement.

[Customise with additional relevant examples based on the client's industry and goals.]`,
    },
    {
      id: 'our-plan', title: 'Our Plan for [Client Name]', locked: false, included: true,
      content: `At Kromium, we understand that a website for [Client Name] is not just a design project. It is a lead generation engine, a credibility signal, and often the first meaningful interaction a potential client has with your brand. Our approach ensures every page earns its place.

1. Discovery and Sitemap
Before any design begins, we conduct a structured discovery session to agree the sitemap, the primary purpose of each page, the target audience for each section, and the SEO keyword strategy. Nothing is designed without a clear brief for what that page is supposed to achieve.

2. Wireframing
Low-fidelity wireframes for all primary pages, presented for approval before any visual design begins. This ensures the structure and content hierarchy is right before time is invested in high-fidelity design.

3. Visual Design
High-fidelity mockups across all primary pages, presented in both desktop and mobile views. [Client Name] approves the design before development begins. Two rounds of revisions are included.

4. Copywriting
[Include if copywriting is in scope.] All copy is written by Kromium's team, researched against the agreed keyword strategy, and written first for the reader, second for search engines. The goal is copy that converts, not copy that exists to fill space.

5. Development Build
The full site is built to the approved designs. Every page is performance-optimised, mobile-responsive, and tested across browsers and devices before handover.

6. SEO Foundation
Every page is delivered with keyword-mapped title tags, meta descriptions, properly structured headings, image optimisation, and schema markup. Google Search Console is configured and the sitemap submitted on launch day.

7. Lead Capture Integration
[If applicable.] All enquiry and contact forms are integrated with [CRM platform / email notifications / agreed system] so that every submission is captured, attributed, and actioned without any manual work required.

8. Handover and Training
A structured handover session ensures the [Client Name] team can update content independently. Full documentation is provided. The post-launch support period covers any issues that arise in the first 30 days.`,
    },
    {
      id: 'seo-foundation', title: 'SEO and Search Strategy', locked: false, included: true,
      content: `The website will be built with search visibility as a foundational requirement, not an afterthought. Every page will be optimised at the point of build for the keywords that matter most to [Client Name].

Keyword Strategy: Based on the agreed target market of [Market], Kromium will conduct keyword research to identify the primary, secondary, and long-tail terms with the highest commercial intent for [Client Name]. Every page will be mapped to specific keywords before any content is written.

On-Page Optimisation: Every page will be delivered with keyword-mapped title tags and meta descriptions, a proper heading hierarchy from H1 through H3, optimised image alt text and file names, internal linking designed to distribute authority across the site, and schema markup for business information.

Technical SEO: The site will be built to achieve strong Core Web Vitals scores, meaning fast load times, layout stability, and responsive interactivity on all devices. SSL is configured on launch. A sitemap is submitted to Google Search Console on day one.

Target Search Market: [Barbados only / Multiple Caribbean islands / North America / International], and the content and keyword strategy will be calibrated accordingly.

Local SEO: Where relevant, Google Business Profile will be optimised and connected to the new site to strengthen local and regional search visibility.`,
    },
    {
      id: 'phase-plan', title: 'Phase Plan and Timeline', locked: false, included: true,
      content: `Week 1 to 2: Discovery, sitemap agreement, keyword research, and project brief sign-off.
Deliverable: Agreed sitemap, keyword map, and project brief.

Week 3 to 4: Wireframes for all primary pages. Client approval before visual design begins.
Deliverable: Approved lo-fi wireframes.

Week 5 to 6: High-fidelity design across all pages in desktop and mobile. Two rounds of revisions included.
Deliverable: Approved hi-fi design.

Week 7 to 10: Full development build. Internal testing across browsers and devices.
Deliverable: Site available for client review in staging environment.

Week 11: Client user acceptance testing. Revisions based on feedback.
Deliverable: Revised and approved staging site.

Week 12: DNS transfer and launch. SEO setup and Google Search Console submission. 30-day post-launch monitoring and support.
Deliverable: Live site and handover documentation.`,
    },
    {
      id: 'investment', title: 'Investment', locked: true, included: true,
      content: `The investment below covers the complete website project as described in this proposal, from discovery through to launch and the 30-day post-launch support period. All prices are quoted in USD.

The project is structured in three payment milestones: 35% deposit on signing of the project brief, 35% on design approval at the end of the design phase, and 30% on launch.`,
    },
    {
      id: 'next-steps', title: 'Next Steps', locked: true, included: true,
      content: 'Once this proposal is approved, the process moves quickly.\n\nThe first step is to sign the project brief and submit the deposit payment. This secures your place in our project schedule. We operate with a structured intake process and take on a limited number of projects at a time, so deposit receipt is what confirms your start date.\n\nWithin five business days of the signed brief and deposit, we will schedule the discovery session. This is a focused, working session with your team to finalise the scope, align on priorities, and establish the approval workflow for the engagement.\n\nBuild begins immediately after discovery. Every phase milestone is communicated in advance with a clear approval gate before the next phase commences. Nothing moves forward without your sign-off.\n\nTo proceed or to discuss any aspect of this proposal, contact us directly.\n\nEmail: info@kromiumagency.com\nPhone: +1 246 232 1006\nWebsite: www.kromiumdigital.com',
    },
    {
      id: 'terms', title: 'Terms and Conditions', locked: false, included: true,
      content: 'Payment Terms: A deposit of 35 percent of the total project investment is due on signing to secure the project start date. A further 35 percent is due on design or concept approval. The remaining 30 percent is due on final delivery and handover. All work produced remains the intellectual property of Kromium Marketing and Development Inc. until the final payment is received in full, at which point full ownership transfers permanently to the client.\n\nRevisions: Two rounds of consolidated revisions are included at each project phase. A round of revisions is defined as a single set of written feedback addressed in one pass. Requests for concept pivots after a direction has been approved, or revisions beyond the included rounds, will be scoped and quoted separately.\n\nTimeline: The timeline assumes timely feedback and approvals from the client at each phase. Delays in client feedback may extend the delivery schedule accordingly.\n\nConfidentiality: All client information shared during this engagement is treated as strictly confidential and will not be shared with any third party.\n\nPortfolio: Kromium reserves the right to display completed work in its portfolio unless the client requests otherwise in writing at the outset of the engagement.',
    },
  ],

  // ══════════════════════════════════════════════════════════════════════════
  // BRAND
  // ══════════════════════════════════════════════════════════════════════════
  'brand': [
    {
      id: 'executive-summary', title: 'Executive Summary', locked: false, included: true,
      content: `Thank you for the opportunity to present this proposal to [Client Name]. This document outlines a brand identity project designed to [build a new brand from the ground up / refresh and modernise the existing identity / execute a full rebrand] for [Client Name] in [Industry / Market].

A brand is the sum total of what people feel when they encounter your business. The logo, the colours, the typography, the tone of voice, the quality of everything they see before they experience your product or service. When those elements are disjointed, dated, or misaligned with where the business is going, they create friction at the point where you most need confidence. This project will resolve that friction.

When the work is complete, [Client Name] will have a coherent, distinctive visual identity that reflects the current ambition of the business, travels consistently across every touchpoint, and positions the brand exactly where it needs to be in the eyes of the audience it is trying to reach.`,
    },
    {
      id: 'about-kromium', title: 'About Kromium Marketing and Development Inc.', locked: false, included: true,
      content: 'Kromium Marketing and Development Inc. is a premier Caribbean digital transformation agency based in Barbados. We specialise in building the digital infrastructure that premium Caribbean businesses need to grow: custom CRM and business intelligence platforms, websites, brand identities, social media management, marketing and growth programmes, and business optimisation.\n\nWe are not a generalist agency. We work with a selective roster of clients across three core verticals: real estate, construction and development, and hospitality and tourism. This focus means we understand the specific operational realities of the businesses we serve in a way that no generalist could. When you work with Kromium, you work with a team that has already solved your industry\\\'s problems before.\n\nOur mission is straightforward: to create tailored digital solutions that drive engagement, foster meaningful connections, and deliver tangible results. We measure our success entirely by our clients\\\' success. That metric is why we are the preferred digital partner for premium Caribbean businesses across the region.',
    },
    {
      id: 'team-credentials', title: 'Key Credentials and Team Expertise', locked: false, included: true,
      content: 'Our leadership team brings over a decade of experience in digital marketing, advertising, and creative production.\n\nJelissa Richards, Chief Content Strategist, has more than ten years of experience in digital marketing and campaign management, with deep expertise in cross-channel integration and branding strategies. She brings five years of project management experience in the non-profit sector, is a HubSpot Certified Content Marketer, and has professional training in photography, videography, and graphic design.\n\nRommel Richards, Chief Advertising Strategist, has over ten years of experience in digital advertising. He is a Meta Blueprint certified advertising professional and a Google Search Ads certified specialist with a proven track record of driving measurable results across Caribbean and international markets.\n\nOur core team includes experienced videographers and photographers who handle projects ranging from cinematic productions to high-performing short-form content. Complementing them are skilled graphic designers with a keen eye for branding, a solid grasp of business development, and a deep commitment to maintaining brand cohesion. For technical engagements, our development team brings expertise in custom CRM architecture, web development, and business intelligence systems.',
    },
    {
      id: 'case-studies', title: 'Proof of Delivery', locked: false, included: true,
      content: `Barbados Gospelfest worked with Kromium to modernise their branding ahead of the festival season. The engagement included a redesigned festival logo reflecting a contemporary yet culturally resonant identity, revamped social media pages with cohesive branding, new promotional materials, and an updated website. The results were transformative. Instagram followers grew from 2,278 to 3,165, an increase of 39% not seen in many years of the platform's existence. Multiple events during the festival week sold out.

Italia Coffee Barbados, a beloved Caribbean institution with more than 25 years of history, faced a period of brand stagnation. Kromium executed a brand refresh that modernised and streamlined their visual identity across their diverse food and drink offerings, ensuring a cohesive and appealing design across all touchpoints. Combined with a social media transformation, Instagram followers grew from a stagnant 12,000 to nearly 15,000, and the refreshed branding resonated strongly with both loyal customers and new audiences.

Forensic CPA Society (FCPAS) engaged Kromium for a full brand refresh including logo update, brand guidelines, social media revamp across LinkedIn, Facebook, and Instagram, and a comprehensive digital audit. The refresh repositioned FCPAS for growth in the US, Canadian, Caribbean, and African professional markets.

[Customise with any additional relevant brand work.]`,
    },
    {
      id: 'discovery-process', title: 'Brand Discovery Process', locked: false, included: true,
      content: `Before any design work is produced, Kromium conducts a structured brand discovery process. This is not optional, and it is not a formality. The quality of the creative work depends entirely on the quality of the thinking that precedes it.

Competitor and Market Review: We analyse how [Client Name] currently sits relative to the competitive landscape in [Industry] and [Market]. We identify what the strongest brands in the space are doing, where the gaps are, and where the opportunity exists for [Client Name] to occupy distinctive territory.

Audience Analysis: We examine who the brand needs to speak to. Demographics, values, lifestyle, aspirations, and what they respond to visually and tonally. The brand cannot connect with its audience if we do not understand that audience with precision.

Visual Audit: An honest assessment of all existing brand materials, including what is working, what is inconsistent, what is outdated, and what equity is worth preserving through any change.

Brand Personality Session: A facilitated conversation with the [Client Name] team to define the core values, tone of voice, and personality of the brand. These outputs inform every creative decision that follows.

All discovery outputs are documented and presented to [Client Name] for sign-off before any creative work begins.`,
    },
    {
      id: 'what-we-will-deliver', title: 'What We Will Deliver', locked: false, included: true,
      content: `The following deliverables are included in this engagement based on the scope agreed with [Client Name]. [Adjust the list based on what was selected in the enquiry.]

Logo Suite: Primary logo, secondary/stacked variant, and icon/monogram variant. Delivered in all required formats including SVG, PNG (transparent background), PDF, and EPS. Colour, reverse, and black-and-white versions.

Colour Palette: Primary, secondary, and neutral colour system with HEX, RGB, and CMYK values for each. Usage guidance covering which colours are used for what purpose.

Typography System: Primary and secondary typefaces with hierarchy rules, sizing guidance, and line-spacing recommendations. Font files provided where licensing permits.

Brand Guidelines Document: A comprehensive PDF reference document covering logo usage rules, colour system, typography, do and do-not examples, photography style guidance, and tone of voice. This is the document that ensures every future application of the brand is consistent.

Stationery Suite: Business cards, letterhead template, and email signature template.

Social Media Templates: Editable templates for the primary social media platforms, covering post formats and story formats.

[Additional deliverables as selected: signage templates, naming and tagline, brand presentation template, etc.]`,
    },
    {
      id: 'creative-directions', title: 'Creative Direction and Concept Process', locked: false, included: true,
      content: `At the concept stage, Kromium will present three distinct creative directions for [Client Name] to review. Each direction represents a genuinely different interpretation of the brand brief, not minor variations on a single idea.

Each direction will be presented with a personality descriptor and positioning rationale, a moodboard of visual references that illustrate the direction, and an initial logo concept developed within that direction. The presentation is designed to be comparative, giving [Client Name] a clear view of the different territories available before committing to one.

[Client Name] selects one direction for full development. The two directions not selected are retired. This is how the process works, and it is important to understand it upfront: selecting a direction is a commitment to that creative territory. It is not the beginning of a negotiation to combine elements from all three.

Once a direction is selected, Kromium develops the full brand system within that direction across all agreed deliverables.`,
    },
    {
      id: 'phase-plan', title: 'Phase Plan and Timeline', locked: false, included: true,
      content: `Week 1 to 2: Brand discovery. Competitor review, audience analysis, visual audit, and brand personality session. All outputs documented.
Deliverable: Discovery report and brand brief.

Week 3: Moodboard presentation. Three distinct creative directions presented. Client selects one.
Deliverable: Agreed creative direction.

Week 4 to 5: Logo concepts. Three logo options developed within the selected direction. Client feedback and revision round one.
Deliverable: Approved logo direction.

Week 6: Logo refinement based on feedback. Colour palette and typography direction presented.
Deliverable: Approved logo, colour, and typography.

Week 7 to 8: Full brand system developed. All deliverables produced across the agreed scope.
Deliverable: Complete brand system for client review.

Week 9: Client review and revisions. Final adjustments based on consolidated feedback.
Deliverable: Approved final brand system.

Week 10: Final file delivery, brand guidelines document, and handover session.
Deliverable: All files delivered. Brand guidelines complete.`,
    },
    {
      id: 'investment', title: 'Investment', locked: true, included: true,
      content: `The investment below covers the complete brand project as scoped in this proposal. All prices are quoted in USD.

The project is structured in three payment milestones: 35% deposit on signing of the project brief, 35% on creative direction approval following the concept presentation, and 30% on final file delivery.`,
    },
    {
      id: 'next-steps', title: 'Next Steps', locked: true, included: true,
      content: 'Once this proposal is approved, the process moves quickly.\n\nThe first step is to sign the project brief and submit the deposit payment. This secures your place in our project schedule. We operate with a structured intake process and take on a limited number of projects at a time, so deposit receipt is what confirms your start date.\n\nWithin five business days of the signed brief and deposit, we will schedule the discovery session. This is a focused, working session with your team to finalise the scope, align on priorities, and establish the approval workflow for the engagement.\n\nBuild begins immediately after discovery. Every phase milestone is communicated in advance with a clear approval gate before the next phase commences. Nothing moves forward without your sign-off.\n\nTo proceed or to discuss any aspect of this proposal, contact us directly.\n\nEmail: info@kromiumagency.com\nPhone: +1 246 232 1006\nWebsite: www.kromiumdigital.com',
    },
    {
      id: 'terms', title: 'Terms and Conditions', locked: false, included: true,
      content: 'Payment Terms: A deposit of 35 percent of the total project investment is due on signing to secure the project start date. A further 35 percent is due on design or concept approval. The remaining 30 percent is due on final delivery and handover. All work produced remains the intellectual property of Kromium Marketing and Development Inc. until the final payment is received in full, at which point full ownership transfers permanently to the client.\n\nRevisions: Two rounds of consolidated revisions are included at each project phase. A round of revisions is defined as a single set of written feedback addressed in one pass. Requests for concept pivots after a direction has been approved, or revisions beyond the included rounds, will be scoped and quoted separately.\n\nTimeline: The timeline assumes timely feedback and approvals from the client at each phase. Delays in client feedback may extend the delivery schedule accordingly.\n\nConfidentiality: All client information shared during this engagement is treated as strictly confidential and will not be shared with any third party.\n\nPortfolio: Kromium reserves the right to display completed work in its portfolio unless the client requests otherwise in writing at the outset of the engagement.',
    },
  ],

  // ══════════════════════════════════════════════════════════════════════════
  // SEO
  // ══════════════════════════════════════════════════════════════════════════
  'seo': [
    {
      id: 'executive-summary', title: 'Executive Summary', locked: false, included: true,
      content: `Thank you for the opportunity to present this proposal to [Client Name]. This document outlines a Search Engine Optimisation engagement designed to build consistent, compounding visibility for [Client Name] in search results across [Market].

The opportunity in front of [Client Name] is significant. The searches your potential clients are performing every day are not being captured by your current digital presence. Every search that returns a competitor ahead of you is a conversation you are not having and a relationship you are not building. This engagement will change that.

SEO is not a short-term tactic. It is infrastructure. The work done in the first three to six months lays a technical and content foundation that grows in value over time. Unlike paid advertising, which stops the moment the budget does, organic search visibility compounds. The sites that rank today are benefiting from work done years ago. The right time to start is always now.`,
    },
    {
      id: 'about-kromium', title: 'About Kromium Marketing and Development Inc.', locked: false, included: true,
      content: 'Kromium Marketing and Development Inc. is a premier Caribbean digital transformation agency based in Barbados. We specialise in building the digital infrastructure that premium Caribbean businesses need to grow: custom CRM and business intelligence platforms, websites, brand identities, social media management, marketing and growth programmes, and business optimisation.\n\nWe are not a generalist agency. We work with a selective roster of clients across three core verticals: real estate, construction and development, and hospitality and tourism. This focus means we understand the specific operational realities of the businesses we serve in a way that no generalist could. When you work with Kromium, you work with a team that has already solved your industry\\\'s problems before.\n\nOur mission is straightforward: to create tailored digital solutions that drive engagement, foster meaningful connections, and deliver tangible results. We measure our success entirely by our clients\\\' success. That metric is why we are the preferred digital partner for premium Caribbean businesses across the region.',
    },
    {
      id: 'seo-opportunity', title: 'The SEO Opportunity', locked: false, included: true,
      content: `[This section should be personalised based on what is known about the client's current search visibility. The following is a framework:]

Based on what [Client Name] has shared with us, the current website is [not ranking for commercially relevant keywords / ranking inconsistently / losing ground to competitors who have invested in SEO]. The target audience is actively searching for [describe the types of searches relevant to the client's business], and those searches are currently being captured by other businesses.

The search market for [Client Name] is [Barbados / the wider Caribbean / North America / international], and the keyword landscape in [Industry] presents a genuine opportunity. Many of the most commercially valuable searches in this space are not being contested at the level of quality and consistency that a well-executed SEO programme can achieve.

The specific opportunity for [Client Name] lies in [technical improvements that would yield fast gains / fresh content that targets high-intent searches / local SEO that captures regional demand]. Kromium will prioritise the work that moves the needle fastest while building the long-term foundation in parallel.`,
    },
    {
      id: 'our-plan', title: 'Our SEO Programme for [Client Name]', locked: false, included: true,
      content: `1. Keyword Research and Strategy
We will develop a full keyword map for [Client Name] covering primary keywords with the highest commercial intent, secondary keywords that support topical authority, and long-tail terms that are lower competition but high conversion. Every keyword will be mapped to a specific existing or new page on the site.

2. Technical SEO Audit and Fixes
Month one begins with a full technical audit covering page speed and Core Web Vitals scores, mobile performance and responsiveness, crawl errors and indexation issues, site architecture and URL structure, SSL and security signals, and schema markup. All critical issues are resolved before content work begins.

3. On-Page Optimisation
Every existing page will be reviewed and updated with keyword-mapped title tags and meta descriptions, a clean heading hierarchy from H1 through H3, optimised image alt text, and improved internal linking to distribute authority across the site.

4. Content Strategy and Production
Authority in search is built through content. The content plan will include pillar pages targeting primary keyword clusters, supporting blog articles targeting specific questions and long-tail searches, and local and regional pages to capture geographic demand. All content is written for the reader first and search engines second.

5. Local and Regional SEO
Google Business Profile will be optimised and connected to the website. Regional signals will be built into the site architecture to ensure [Client Name] captures searches across [specific markets].

6. Reporting and Monitoring
Monthly reports covering keyword ranking movement across all target terms, organic traffic trends, Core Web Vitals monitoring, and conversion tracking tied back to organic search. Recommendations updated each month based on what the data shows.`,
    },
    {
      id: 'what-we-track', title: 'What We Track', locked: false, included: true,
      content: `Keyword Rankings: Movement across all target terms, tracked weekly and reported monthly. We track position, search volume, and the page capturing each keyword.

Organic Traffic: Sessions, new users, engaged sessions, and bounce rate from organic search. Month-over-month and year-over-year comparisons.

Conversions: Enquiries, contact form submissions, and calls tracked back to organic search as the source. This is the number that matters most.

Core Web Vitals: Largest Contentful Paint, Interaction to Next Paint, and Cumulative Layout Shift, monitored continuously and flagged if they deteriorate.

Backlink Profile: New links earned, overall domain authority movement, and any toxic links that need disavowing.

We do not bury you in data. We report on the numbers that connect directly to business outcomes.`,
    },
    {
      id: 'timeline', title: 'Timeline', locked: false, included: true,
      content: `Month 1: Technical audit, keyword research, on-page optimisation of priority pages. Foundation work.

Month 2 to 3: Content production begins. Remaining on-page fixes completed. Local SEO configuration. Google Search Console and Analytics setup or audit.

Month 4 onwards: Content compounding, link-building activity, and continuous refinement based on ranking data. Monthly reports guide ongoing prioritisation.

SEO timelines are honest: meaningful ranking movement for competitive terms typically takes three to six months. The groundwork in months one through three determines how fast the compounding effect accelerates. Businesses that expect overnight results from SEO should not invest in it. Businesses that invest with a twelve-month horizon consistently win.`,
    },
    {
      id: 'investment', title: 'Investment', locked: true, included: true,
      content: `The investment below covers the SEO programme as outlined in this proposal. A minimum commitment of three months applies, after which the engagement can continue monthly with thirty days notice to cancel.`,
    },
    {
      id: 'next-steps', title: 'Next Steps', locked: true, included: true,
      content: 'Once this proposal is approved, Kromium will proceed as follows.\n\nFirst, we will conduct a comprehensive digital marketing audit of your current presence. This audit will analyse your existing platforms, highlight strengths, identify weaknesses, and provide specific strategic recommendations for moving forward. The completed audit will be delivered within two weeks of approval for your review and sign-off.\n\nSecond, following audit review and implementation agreement, we will begin developing two months worth of content ahead of schedule, ensuring we are always ahead of the delivery curve. From month one, we will execute the agreed strategies and monitor performance in real time, making adjustments as the data directs.\n\nThird, reporting and performance tracking will run consistently throughout the engagement. Monthly reports will be delivered at the end of each month. Quarterly reports will provide a broader view of progress. At the close of each year, a comprehensive annual review will be produced.\n\nEmail: info@kromiumagency.com\nPhone: +1 246 232 1006\nWebsite: www.kromiumdigital.com',
    },
    {
      id: 'terms', title: 'Terms and Conditions', locked: false, included: true,
      content: `${TERMS_RETAINER}

SEO Results Disclaimer: SEO outcomes are influenced by factors outside Kromium's direct control, including Google algorithm updates, competitor activity, and the quality and authority of the existing domain. Kromium commits to diligent, best-practice execution of the agreed programme. Specific ranking positions cannot be guaranteed.`,
    },
  ],

  // ══════════════════════════════════════════════════════════════════════════
  // PAID ADVERTISING
  // ══════════════════════════════════════════════════════════════════════════
  'paid-advertising': [
    {
      id: 'executive-summary', title: 'Executive Summary', locked: false, included: true,
      content: `Thank you for the opportunity to present this proposal to [Client Name]. This document outlines a paid advertising engagement across [Platforms] designed to [drive leads / build brand awareness / launch a product or service / convert an existing audience] for [Client Name] in [Market].

Paid advertising done well is among the most efficient ways to accelerate growth. The difference between advertising that produces consistent, measurable returns and advertising that drains budget with little to show for it is not the platform or the budget. It is the strategy, the creative, and the discipline of the team managing it. Kromium brings all three.

Every dollar of media spend on this engagement will be accounted for, optimised, and reported on. You will always know exactly what is being spent, where it is going, and what it is returning.`,
    },
    {
      id: 'about-kromium', title: 'About Kromium Marketing and Development Inc.', locked: false, included: true,
      content: 'Kromium Marketing and Development Inc. is a premier Caribbean digital transformation agency based in Barbados. We specialise in building the digital infrastructure that premium Caribbean businesses need to grow: custom CRM and business intelligence platforms, websites, brand identities, social media management, marketing and growth programmes, and business optimisation.\n\nWe are not a generalist agency. We work with a selective roster of clients across three core verticals: real estate, construction and development, and hospitality and tourism. This focus means we understand the specific operational realities of the businesses we serve in a way that no generalist could. When you work with Kromium, you work with a team that has already solved your industry\\\'s problems before.\n\nOur mission is straightforward: to create tailored digital solutions that drive engagement, foster meaningful connections, and deliver tangible results. We measure our success entirely by our clients\\\' success. That metric is why we are the preferred digital partner for premium Caribbean businesses across the region.',
    },
    {
      id: 'team-credentials', title: 'Key Credentials and Team Expertise', locked: false, included: true,
      content: 'Our leadership team brings over a decade of experience in digital marketing, advertising, and creative production.\n\nJelissa Richards, Chief Content Strategist, has more than ten years of experience in digital marketing and campaign management, with deep expertise in cross-channel integration and branding strategies. She brings five years of project management experience in the non-profit sector, is a HubSpot Certified Content Marketer, and has professional training in photography, videography, and graphic design.\n\nRommel Richards, Chief Advertising Strategist, has over ten years of experience in digital advertising. He is a Meta Blueprint certified advertising professional and a Google Search Ads certified specialist with a proven track record of driving measurable results across Caribbean and international markets.\n\nOur core team includes experienced videographers and photographers who handle projects ranging from cinematic productions to high-performing short-form content. Complementing them are skilled graphic designers with a keen eye for branding, a solid grasp of business development, and a deep commitment to maintaining brand cohesion. For technical engagements, our development team brings expertise in custom CRM architecture, web development, and business intelligence systems.',
    },
    {
      id: 'platform-strategy', title: 'Platform Strategy and Rationale', locked: false, included: true,
      content: `Facebook and Instagram (Meta): The Meta platform remains the most versatile and cost-effective channel for reaching consumers and professionals across the Caribbean. Precise targeting by location, age, interest, and behaviour, combined with high-quality visual creative, makes Meta the default choice for awareness and lead generation campaigns in most categories. For [Client Name] in [Industry], Meta allows us to reach [describe specific audience] with content designed to [describe the conversion goal].

Google Ads: Google captures people at the moment of intent. When someone searches for what [Client Name] offers, a well-structured Google campaign puts you at the top of those results. Search campaigns work best when the demand already exists and the goal is to capture it. Display and YouTube campaigns extend reach to audiences that have shown relevant signals. For [Client Name], Google is [recommended / not recommended for this phase] because [brief rationale].

LinkedIn: For B2B audiences, professional services, and corporate decision-makers, LinkedIn offers targeting precision unavailable on other platforms. Job title, seniority, company size, and industry can all be used to reach exactly the right professional. The cost per click is higher than Meta, but the quality of the audience for professional engagements is unmatched. For [Client Name], LinkedIn is [recommended / not recommended] because [brief rationale].

[Adjust platform selection and rationale based on the client's specific context.]`,
    },
    {
      id: 'campaign-approach', title: 'Campaign Approach', locked: false, included: true,
      content: `Phase One: Launch and Test (Month 1)
Multiple creative variants and audience combinations are run simultaneously in the first month. The goal is not to maximise spend, it is to identify what works. We launch with at least three creative directions and two to three audience segments. By the end of month one, we have real data on what the [Client Name] audience responds to.

Phase Two: Optimisation (Month 2)
Underperforming creative and audiences are paused. Budget is shifted to the combinations showing the strongest results. Campaign structure is refined. Cost per result begins to improve materially.

Phase Three: Scale (Month 3 onwards)
Proven campaigns are scaled. New audiences are tested against the benchmark set by the winners. Creative is refreshed to prevent fatigue. The programme matures into a consistent, predictable lead generation engine.

Creative Approach: All ad creative will be produced by Kromium's design team to brand standards. Each campaign launches with a minimum of three creative variants. Underperforming creative is identified within the first two weeks and replaced without waiting for a monthly review.`,
    },
    {
      id: 'budget-transparency', title: 'Budget and Transparency', locked: false, included: true,
      content: `The advertising budget is entirely separate from Kromium's management fee. It is the money that goes directly to the platforms: Meta, Google, LinkedIn. Kromium's management fee covers the strategy, campaign setup, creative production, optimisation, and reporting. The two are always invoiced separately.

Kromium's strong recommendation is that [Client Name] holds the advertising budget on a credit card added directly within the ad manager accounts for each platform. This gives [Client Name] direct ownership of the campaign data and billing records, real-time visibility into ad spend as it happens, and complete financial transparency without any additional invoicing from Kromium.

If [Client Name] prefers, Kromium can manage all payments to the advertising platforms on your behalf. In this case, we will issue a monthly invoice at the beginning of each month for the agreed advertising budget, which we will then disburse to the relevant platforms and reconcile with full supporting documentation.

Recommended monthly media spend: [To be agreed based on objectives, market, and platform mix. Minimum effective spend recommendations will be provided following the strategy session.]`,
    },
    {
      id: 'what-we-track', title: 'What We Track', locked: false, included: true,
      content: `Conversions: Enquiries, sign-ups, purchases, or calls generated by paid campaigns. This is the primary metric and the one every other metric feeds into.

Cost Per Lead or Cost Per Result: What each conversion costs, tracked by platform, campaign, ad set, and creative. This is how we know where to put more budget and where to pull it.

Return on Ad Spend: Revenue generated relative to media spend. Tracked where purchase data is available.

Click-Through Rate: How compelling the creative and targeting are. A low CTR tells us we need new creative or a different audience. A high CTR with low conversion tells us the landing page is the problem.

Reach and Frequency: How many unique people are seeing the ads and how often. Frequency above three to four typically signals creative fatigue and is a trigger to refresh.

All data is available in a real-time dashboard. Monthly reports summarise performance and the specific actions taken in response.`,
    },
    {
      id: 'investment', title: 'Investment', locked: true, included: true,
      content: `The management fee and advertising spend are always invoiced separately. The management fee below covers strategy, campaign setup, creative production, optimisation, and reporting. The advertising budget is additional and goes directly to the platforms.`,
    },
    {
      id: 'next-steps', title: 'Next Steps', locked: true, included: true,
      content: 'Once this proposal is approved, Kromium will proceed as follows.\n\nFirst, we will conduct a comprehensive digital marketing audit of your current presence. This audit will analyse your existing platforms, highlight strengths, identify weaknesses, and provide specific strategic recommendations for moving forward. The completed audit will be delivered within two weeks of approval for your review and sign-off.\n\nSecond, following audit review and implementation agreement, we will begin developing two months worth of content ahead of schedule, ensuring we are always ahead of the delivery curve. From month one, we will execute the agreed strategies and monitor performance in real time, making adjustments as the data directs.\n\nThird, reporting and performance tracking will run consistently throughout the engagement. Monthly reports will be delivered at the end of each month. Quarterly reports will provide a broader view of progress. At the close of each year, a comprehensive annual review will be produced.\n\nEmail: info@kromiumagency.com\nPhone: +1 246 232 1006\nWebsite: www.kromiumdigital.com',
    },
    {
      id: 'terms', title: 'Terms and Conditions', locked: false, included: true,
      content: 'Minimum Commitment: This engagement requires a minimum initial term of three months. Following the initial term, either party may terminate with 30 days written notice.\n\nPayment: Monthly fees are invoiced in advance at the beginning of each month. Advertising budget, where applicable, is invoiced separately or charged directly by the platforms to the client\\\'s own card, as agreed.\n\nAdvertising Budget: The advertising spend is separate from the management fee. It is allocated directly to digital platforms. Kromium strongly recommends the client hold their own card within each platform\\\'s ad manager for full transparency. If Kromium manages payments on the client\\\'s behalf, funds will be disbursed to the platforms with full reporting provided.\n\nScope: The monthly retainer covers the agreed deliverables. Significant scope additions will be quoted separately.\n\nIntellectual Property: All original content produced becomes the property of the client on full payment of each monthly invoice.\n\nPackage Pricing: The services are offered as a comprehensive package. The exclusion or modification of any element may result in an adjustment to the overall package pricing.',
    },
  ],

  // ══════════════════════════════════════════════════════════════════════════
  // RETAINER
  // ══════════════════════════════════════════════════════════════════════════
  'retainer': [
    {
      id: 'executive-summary', title: 'Executive Summary', locked: false, included: true,
      content: `Thank you for the opportunity to present this proposal to [Client Name]. This document outlines a Business Optimisation Retainer, a structured monthly partnership in which Kromium functions as the embedded digital growth partner for [Client Name].

This is not a project engagement with a defined end date. It is an ongoing relationship built around a shared commitment to growth. Kromium will own the digital strategy, the reporting, the campaigns, and the systems that drive [Client Name] forward month on month. You focus on running the business. We focus on growing it.

The businesses that compound their digital advantage over time are not the ones that run occasional campaigns. They are the ones that treat digital infrastructure as a core business function and invest in it consistently. This retainer is designed to build exactly that kind of compounding advantage for [Client Name].`,
    },
    {
      id: 'about-kromium', title: 'About Kromium Marketing and Development Inc.', locked: false, included: true,
      content: 'Kromium Marketing and Development Inc. is a premier Caribbean digital transformation agency based in Barbados. We specialise in building the digital infrastructure that premium Caribbean businesses need to grow: custom CRM and business intelligence platforms, websites, brand identities, social media management, marketing and growth programmes, and business optimisation.\n\nWe are not a generalist agency. We work with a selective roster of clients across three core verticals: real estate, construction and development, and hospitality and tourism. This focus means we understand the specific operational realities of the businesses we serve in a way that no generalist could. When you work with Kromium, you work with a team that has already solved your industry\\\'s problems before.\n\nOur mission is straightforward: to create tailored digital solutions that drive engagement, foster meaningful connections, and deliver tangible results. We measure our success entirely by our clients\\\' success. That metric is why we are the preferred digital partner for premium Caribbean businesses across the region.',
    },
    {
      id: 'philosophy', title: 'Our Philosophy and Selective Approach', locked: false, included: true,
      content: 'At Kromium, we value quality over quantity. Our selective client approach ensures that every business we partner with receives the full attention and dedication needed to succeed. We do not take on every enquiry. We take on the right ones.\n\nOur approach is built on three pillars. First, data-driven solutions: every strategy we develop is rooted in market research, audience analytics, and performance tracking. We do not make creative decisions in a vacuum. Second, a tailored approach: no two clients receive the same proposal, the same strategy, or the same execution plan. Everything is designed specifically for your business, your audience, and your market. Third, a commitment to excellence: we continuously refine our strategies to stay ahead of industry trends and deliver results that genuinely move the needle.\n\nBy limiting the number of clients we take on at any given time, we ensure that your account receives senior-level attention from strategy through execution. You will work directly with the people building your project, not a rotating team of juniors.',
    },
    {
      id: 'team-credentials', title: 'Key Credentials and Team Expertise', locked: false, included: true,
      content: 'Our leadership team brings over a decade of experience in digital marketing, advertising, and creative production.\n\nJelissa Richards, Chief Content Strategist, has more than ten years of experience in digital marketing and campaign management, with deep expertise in cross-channel integration and branding strategies. She brings five years of project management experience in the non-profit sector, is a HubSpot Certified Content Marketer, and has professional training in photography, videography, and graphic design.\n\nRommel Richards, Chief Advertising Strategist, has over ten years of experience in digital advertising. He is a Meta Blueprint certified advertising professional and a Google Search Ads certified specialist with a proven track record of driving measurable results across Caribbean and international markets.\n\nOur core team includes experienced videographers and photographers who handle projects ranging from cinematic productions to high-performing short-form content. Complementing them are skilled graphic designers with a keen eye for branding, a solid grasp of business development, and a deep commitment to maintaining brand cohesion. For technical engagements, our development team brings expertise in custom CRM architecture, web development, and business intelligence systems.',
    },
    {
      id: 'case-studies', title: 'Proof of Delivery', locked: false, included: true,
      content: 'RIMCO Barbados SRL, a prominent heavy-duty equipment provider serving Barbados and the English-speaking Caribbean, approached Kromium with a clear primary goal: elevate brand awareness across the region and drive increased sales. Despite being a stalwart in the heavy-duty equipment industry for over two decades, RIMCO was not a household name in the Caribbean.\n\nOur strategy focused on several key pillars: personification of the brand, a year-long advertising campaign, customer testimonials for social proof, localised content creation, and highlighting social endeavours. We humanised the brand by putting faces to it, leveraging the expertise of RIMCO\\\'s sales team to showcase equipment through video. Every piece of content used original, localised imagery so that the audience could identify with the machinery, the sales team, and the operators. The results were outstanding: 3.59 million impressions, 1,562 interactions, and 2,576 followers across platforms. The audience built was quality, not volume, which translates directly into higher conversion potential.\n\nItalia Coffee Barbados, a beloved household name with a legacy of over 25 years, faced brand stagnation and needed a fresh approach to remain relevant in a competitive market. Over a six-month partnership, Kromium modernised and streamlined the brand for their diverse food and drink offerings, ensuring a cohesive and visually appealing design across all touchpoints, while infusing personality and relatability into their social media presence. Instagram followers grew from a stagnant 12,000 to nearly 15,000 by the end of the engagement, with 1.6 million impressions achieved in the first three months alone and over 10,800 interactions across the period.\n\nBarbados Gospelfest partnered with Kromium to modernise its branding and enhance its social media presence. We redesigned the festival logo to reflect a contemporary yet culturally resonant identity, revamped all social media pages with cohesive branding and strategic content, developed new promotional materials including vibrant flyers for the week-long festival, and updated the website for user engagement and ticket information. Instagram followers increased from 2,278 to 3,165, a significant jump not seen in the platform\\\'s many years of existence. Many events during the festival week achieved sold-out attendance.',
    },
    {
      id: 'what-a-retainer-does', title: 'What a Growth Retainer Actually Does', locked: false, included: true,
      content: `Most businesses hire agencies for projects. The website is done. The brand is done. The campaign ran. Then the momentum stops and the next initiative starts from zero again.

A growth retainer is a fundamentally different relationship. Kromium becomes embedded in the operation, setting the strategy, executing against it, reporting on it, and adjusting it every single month. The result is compounding digital growth rather than isolated project outcomes. Each month builds on the last. Each quarter is informed by the data of the quarters before it.

This is for businesses that are ready to treat digital infrastructure as a core business function, not an occasional expense. [Client Name] has reached a stage where the business deserves a digital programme that matches its ambition. A retainer with Kromium is how that happens.`,
    },
    {
      id: 'current-foundation', title: 'Current Digital Foundation Assessment', locked: false, included: true,
      content: `[This section should be personalised based on what was submitted in the enquiry and any discovery conversation. The following is a framework:]

Based on what [Client Name] has shared with us, the current digital foundation includes [describe what is in place: website, social media presence, CRM or lack thereof, any current marketing activity]. There are clear strengths in [describe what is working], and equally clear gaps in [describe what is missing or underperforming].

The opportunity for [Client Name] is significant. The businesses in [Industry] that are winning in [Market] have invested in consistent, well-managed digital programmes. The ones that are losing ground are the ones relying on ad hoc activity and hoping it accumulates into growth. The retainer structure ensures [Client Name] is in the first category, consistently and permanently.

The specific focus areas for the first 90 days, based on the enquiry, will be [list the key priorities selected: reporting, lead generation, automation, processes, revenue growth, cost efficiency].`,
    },
    {
      id: 'what-we-will-own', title: 'What Kromium Will Own Each Month', locked: false, included: true,
      content: `Strategy: A monthly strategy session sets the priorities for the coming month within the broader 90-day roadmap. All decisions are data-informed, discussed with [Client Name] in advance, and executed with a clear rationale.

Reporting: A comprehensive monthly performance dashboard covering all agreed digital channels. Not vanity metrics. The numbers that connect directly to pipeline, revenue, and business outcomes.

Content and Campaigns: Organic social content, email, and paid campaigns executed to an agreed schedule. Creative produced to brand standards. Every piece reviewed and approved by [Client Name] before it goes live.

CRM and Pipeline Oversight: Where a CRM is in place, Kromium monitors pipeline health, follow-up sequences, and lead management processes, and flags any breakdown in the system before it costs the business revenue.

Growth Projects: One to two defined growth projects per quarter beyond the monthly cadence. A new landing page, a lead generation campaign, a retargeting build, a referral programme. Each quarter builds new capability.`,
    },
    {
      id: 'monthly-rhythm', title: 'Monthly Rhythm', locked: false, included: true,
      content: `Week 1: Strategy alignment session. Review of the previous month's performance. Agreement on the current month's priorities and budget allocation.

Week 2: Execution in full swing. Content live, campaigns running, community management active.

Week 3: Mid-month check-in. Any adjustments based on early performance data. Creative refresh if needed.

Week 4: End-of-month performance review. Full report delivered. Recommendations for the following month prepared.

Quarterly: A structured 90-day review. Full performance assessment against the goals agreed at the start of the quarter. Roadmap revision for the next quarter. Strategy session with the [Client Name] leadership team.`,
    },
    {
      id: 'investment', title: 'Investment', locked: true, included: true,
      content: `The monthly retainer fee covers all management, strategy, content creation, and reporting services as outlined in this proposal. The advertising budget, where applicable, is separate and billed independently or charged directly to a client-held card for full transparency.

A minimum commitment of three months applies to this engagement. After the initial period, the arrangement continues month to month with thirty days written notice to cancel.`,
    },
    {
      id: 'next-steps', title: 'Next Steps', locked: true, included: true,
      content: 'Once this proposal is approved, Kromium will proceed as follows.\n\nFirst, we will conduct a comprehensive digital marketing audit of your current presence. This audit will analyse your existing platforms, highlight strengths, identify weaknesses, and provide specific strategic recommendations for moving forward. The completed audit will be delivered within two weeks of approval for your review and sign-off.\n\nSecond, following audit review and implementation agreement, we will begin developing two months worth of content ahead of schedule, ensuring we are always ahead of the delivery curve. From month one, we will execute the agreed strategies and monitor performance in real time, making adjustments as the data directs.\n\nThird, reporting and performance tracking will run consistently throughout the engagement. Monthly reports will be delivered at the end of each month. Quarterly reports will provide a broader view of progress. At the close of each year, a comprehensive annual review will be produced.\n\nEmail: info@kromiumagency.com\nPhone: +1 246 232 1006\nWebsite: www.kromiumdigital.com',
    },
    {
      id: 'terms', title: 'Terms and Conditions', locked: false, included: true,
      content: 'Minimum Commitment: This engagement requires a minimum initial term of three months. Following the initial term, either party may terminate with 30 days written notice.\n\nPayment: Monthly fees are invoiced in advance at the beginning of each month. Advertising budget, where applicable, is invoiced separately or charged directly by the platforms to the client\\\'s own card, as agreed.\n\nAdvertising Budget: The advertising spend is separate from the management fee. It is allocated directly to digital platforms. Kromium strongly recommends the client hold their own card within each platform\\\'s ad manager for full transparency. If Kromium manages payments on the client\\\'s behalf, funds will be disbursed to the platforms with full reporting provided.\n\nScope: The monthly retainer covers the agreed deliverables. Significant scope additions will be quoted separately.\n\nIntellectual Property: All original content produced becomes the property of the client on full payment of each monthly invoice.\n\nPackage Pricing: The services are offered as a comprehensive package. The exclusion or modification of any element may result in an adjustment to the overall package pricing.',
    },
  ],

  // ══════════════════════════════════════════════════════════════════════════
  // FULL ECOSYSTEM
  // ══════════════════════════════════════════════════════════════════════════
  'full-ecosystem': [
    {
      id: 'executive-summary', title: 'Executive Summary', locked: false, included: true,
      content: `Thank you for the opportunity to present this proposal to [Client Name]. This document outlines a full digital ecosystem engagement covering [the services identified in discovery]. The goal is to build a cohesive, integrated digital infrastructure where every element reinforces the others, from the first point of contact through to client delivery, retention, and growth.

Most businesses have fragments. A website that does not capture leads properly. A CRM, or the absence of one, that does not reflect how the business actually sells. A social presence that is not aligned to the brand. Marketing that runs independently of the sales pipeline. The result is predictable: opportunities fall through the gaps, and nobody has full visibility into what is actually driving growth.

Kromium builds integrated systems where every component is designed to work together. The website feeds the CRM. The CRM informs the marketing. The marketing is measured against pipeline outcomes. This is digital infrastructure, not a collection of disconnected tools.`,
    },
    {
      id: 'about-kromium', title: 'About Kromium Marketing and Development Inc.', locked: false, included: true,
      content: 'Kromium Marketing and Development Inc. is a premier Caribbean digital transformation agency based in Barbados. We specialise in building the digital infrastructure that premium Caribbean businesses need to grow: custom CRM and business intelligence platforms, websites, brand identities, social media management, marketing and growth programmes, and business optimisation.\n\nWe are not a generalist agency. We work with a selective roster of clients across three core verticals: real estate, construction and development, and hospitality and tourism. This focus means we understand the specific operational realities of the businesses we serve in a way that no generalist could. When you work with Kromium, you work with a team that has already solved your industry\\\'s problems before.\n\nOur mission is straightforward: to create tailored digital solutions that drive engagement, foster meaningful connections, and deliver tangible results. We measure our success entirely by our clients\\\' success. That metric is why we are the preferred digital partner for premium Caribbean businesses across the region.',
    },
    {
      id: 'philosophy', title: 'Our Philosophy and Selective Approach', locked: false, included: true,
      content: 'At Kromium, we value quality over quantity. Our selective client approach ensures that every business we partner with receives the full attention and dedication needed to succeed. We do not take on every enquiry. We take on the right ones.\n\nOur approach is built on three pillars. First, data-driven solutions: every strategy we develop is rooted in market research, audience analytics, and performance tracking. We do not make creative decisions in a vacuum. Second, a tailored approach: no two clients receive the same proposal, the same strategy, or the same execution plan. Everything is designed specifically for your business, your audience, and your market. Third, a commitment to excellence: we continuously refine our strategies to stay ahead of industry trends and deliver results that genuinely move the needle.\n\nBy limiting the number of clients we take on at any given time, we ensure that your account receives senior-level attention from strategy through execution. You will work directly with the people building your project, not a rotating team of juniors.',
    },
    {
      id: 'team-credentials', title: 'Key Credentials and Team Expertise', locked: false, included: true,
      content: 'Our leadership team brings over a decade of experience in digital marketing, advertising, and creative production.\n\nJelissa Richards, Chief Content Strategist, has more than ten years of experience in digital marketing and campaign management, with deep expertise in cross-channel integration and branding strategies. She brings five years of project management experience in the non-profit sector, is a HubSpot Certified Content Marketer, and has professional training in photography, videography, and graphic design.\n\nRommel Richards, Chief Advertising Strategist, has over ten years of experience in digital advertising. He is a Meta Blueprint certified advertising professional and a Google Search Ads certified specialist with a proven track record of driving measurable results across Caribbean and international markets.\n\nOur core team includes experienced videographers and photographers who handle projects ranging from cinematic productions to high-performing short-form content. Complementing them are skilled graphic designers with a keen eye for branding, a solid grasp of business development, and a deep commitment to maintaining brand cohesion. For technical engagements, our development team brings expertise in custom CRM architecture, web development, and business intelligence systems.',
    },
    {
      id: 'case-studies', title: 'Proof of Delivery', locked: false, included: true,
      content: `${CASE_STUDIES_TECH}

${CASE_STUDIES_MARKETING}`,
    },
    {
      id: 'understanding-your-business', title: 'Understanding Your Business', locked: false, included: true,
      content: `[This section should be personalised based on what was submitted in the enquiry and any discovery conversation. Describe back to the client their specific operation, current digital state, pain points, and goals.]

From what [Client Name] has shared, the business is operating in [Industry] across [Market], with a team of [Size] managing [describe what the operation does]. The current digital infrastructure consists of [describe what is in place], which is creating friction at several points in the growth journey.

The gaps are clear: [describe the specific challenges identified]. The opportunity is equally clear. A properly integrated digital ecosystem would give [Client Name] the visibility, the lead flow, and the operational leverage to grow without adding complexity at every step.

Everything that follows in this proposal has been scoped with those specific goals in mind.`,
    },
    {
      id: 'what-we-will-build', title: 'What We Will Build', locked: false, included: true,
      content: `The following components have been scoped for this engagement based on the priorities identified with [Client Name]. [Adjust the list to match what was selected.]

Custom CRM and Business Intelligence: A full-stack CRM platform built around how [Client Name] actually sells, manages clients, and tracks performance. Lead management, pipeline visibility, client records, automated follow-up, and reporting dashboards. Owned outright. No monthly licence.

Website and Digital Infrastructure: A lead-generating, SEO-optimised website integrated directly with the CRM. Every enquiry captured, scored, and actioned automatically.

Brand Identity: [If in scope.] A cohesive visual identity applied consistently across the website, social media, and all client-facing materials.

Marketing Programme: [If in scope.] An ongoing social media management and advertising programme measured against pipeline outcomes, not follower counts.`,
    },
    {
      id: 'phase-plan', title: 'Phase Plan', locked: false, included: true,
      content: `Phase 1: Foundation (Months 1 to 2)
Brand identity completed and approved. CRM architecture designed, documented, and signed off. All foundational decisions made before build work begins.
Deliverable: Approved brand system. Signed CRM technical specification.

Phase 2: Build (Months 3 to 4)
CRM platform built, tested, and presented for user acceptance testing. Website designed, built, and integrated with the CRM. All lead capture and attribution configured.
Deliverable: Live CRM in staging. Approved website ready for launch.

Phase 3: Launch and Activate (Month 5)
All systems launched to production. Marketing programme begins. Full team training conducted and recorded. 30-day post-launch monitoring and support.
Deliverable: All systems live. Team trained. First monthly report delivered.

Phase 4: Optimise (Month 6 onwards)
Ongoing growth retainer. Data-driven refinement of all systems and campaigns. Quarterly strategy sessions. The programme matures as the data accumulates.`,
    },
    {
      id: 'investment', title: 'Investment', locked: true, included: true,
      content: `The investment below covers the full ecosystem engagement as scoped in this proposal. Project components are priced individually and the ongoing retainer is priced separately. All prices are quoted in USD.

Project phases are billed on the milestone structure described in the terms below. The ongoing retainer is billed monthly in advance from the point the programme begins.`,
    },
    {
      id: 'conclusion', title: 'Conclusion', locked: false, included: true,
      content: `At Kromium Marketing and Development Inc., we believe in the power of meaningful partnerships built on shared ambition and a genuine commitment to results. Everything described in this proposal has been scoped with [Client Name]'s specific situation, goals, and market in mind. This is not a generic programme applied to another client.

We are fully committed to becoming an extension of the [Client Name] team, working closely with your leadership to build the digital infrastructure your business deserves. The outcome of this engagement is not a collection of deliverables. It is a compounding business asset that grows in value over time.

We look forward to beginning this work together.

Email: info@kromiumagency.com | Phone: +1 246 232 1006 | Website: www.kromiumdigital.com`,
    },
    {
      id: 'next-steps', title: 'Next Steps', locked: true, included: true,
      content: 'Once this proposal is approved, the process moves quickly.\n\nThe first step is to sign the project brief and submit the deposit payment. This secures your place in our project schedule. We operate with a structured intake process and take on a limited number of projects at a time, so deposit receipt is what confirms your start date.\n\nWithin five business days of the signed brief and deposit, we will schedule the discovery session. This is a focused, working session with your team to finalise the scope, align on priorities, and establish the approval workflow for the engagement.\n\nBuild begins immediately after discovery. Every phase milestone is communicated in advance with a clear approval gate before the next phase commences. Nothing moves forward without your sign-off.\n\nTo proceed or to discuss any aspect of this proposal, contact us directly.\n\nEmail: info@kromiumagency.com\nPhone: +1 246 232 1006\nWebsite: www.kromiumdigital.com',
    },
    {
      id: 'terms', title: 'Terms and Conditions', locked: false, included: true,
      content: `${TERMS_PROJECT}

Ongoing Retainer Terms: Following the completion of any project phases, the ongoing monthly retainer operates with a minimum three-month commitment and thirty days written notice to cancel after the initial term.`,
    },
  ],
}

// ── Helper: get default sections for a service type ───────────────────────────
export function getDefaultSections(serviceType: ServiceType): ProposalSection[] {
  return (SECTION_TEMPLATES[serviceType] ?? SECTION_TEMPLATES['full-ecosystem']).map(s => ({ ...s }))
}

// ── Optional addable sections ─────────────────────────────────────────────────
export const ADDABLE_SECTIONS: { id: string; title: string }[] = [
  { id: 'services-overview',    title: 'Services Overview' },
  { id: 'our-commitment',       title: 'Our Commitment to You' },
  { id: 'exclusivity',          title: 'Exclusive Partnerships' },
  { id: 'kpis',                 title: 'Key Performance Indicators' },
  { id: 'advertising-strategy', title: 'Digital Advertising Strategy' },
  { id: 'custom-section',       title: 'Custom Section' },
]

export const ADDABLE_SECTION_DEFAULTS: Record<string, string> = {
  'services-overview': `Kromium Marketing and Development Inc. offers a comprehensive suite of digital services for premium Caribbean businesses:

Digital Marketing: Social media management and strategy, display advertising, search engine marketing, and email marketing.

Creative Services: Website design and development, graphic design, photography, videography, animation, and copywriting.

Custom Technology: Custom CRM and Business Intelligence platforms, lead generation systems, business automation, and digital infrastructure.

Brand and Identity: Brand strategy, logo design, visual identity systems, brand guidelines, and stationery.

Business Optimisation: Growth retainers, reporting and analytics, process automation, and cost efficiency programmes.`,

  'our-commitment': `Behind Kromium is a team of senior specialists with a shared passion for excellence. Each member is highly qualified in their respective field and deeply committed to ensuring every client receives the absolute best that Kromium can offer.

When you partner with Kromium, you gain more than a service. You gain a dedicated team that is as invested in your success as you are. We are here to adapt to new challenges as they arise, deliver work that reflects a shared passion for excellence and creativity, and build a relationship that goes beyond a transaction, one built on trust, collaboration, and consistent results.

From day one, our goal is to integrate effortlessly with your operation and become an extension of your team in the fullest sense of the word.`,

  'exclusivity': `Kromium takes on a limited number of new clients each year. This is not a positioning statement. It is how we operate in practice.

By restricting the number of new partnerships we accept, we ensure that every client receives genuine senior-level attention from strategy through delivery. The businesses that partner with Kromium are not handed to an account coordinator. They work directly with the people who built the strategies, created the work, and are accountable for the results.

This proposal is presented because we believe [Client Name] is exactly the kind of partner Kromium is designed to work with.`,

  'kpis': `The following key performance indicators will be agreed and tracked from the first month of the engagement. They will be reviewed monthly and assessed against the targets agreed at the outset.

[Customise the KPIs based on the specific goals of the engagement. Examples include: monthly organic traffic growth, keyword ranking improvements, cost per lead from paid campaigns, social media follower growth rate, content engagement rate, CRM lead-to-conversion rate, website enquiry volume.]

KPI targets will be established formally during the discovery session and confirmed in the first monthly report.`,

  'advertising-strategy': `To achieve meaningful reach across the target market, a dedicated advertising budget will be required in addition to the creative and management services outlined in this proposal. This budget is allocated directly to the digital platforms and is entirely separate from Kromium's management fee.

Payment Structure: Kromium strongly recommends that [Client Name] holds the advertising budget directly within the ad manager accounts on each platform. This provides full transparency, direct ownership of campaign data and billing records, and complete real-time visibility into spend. If preferred, Kromium can manage all payments on [Client Name]'s behalf with full monthly documentation.

Recommended monthly advertising spend: [To be confirmed based on agreed objectives and market reach requirements.]`,

  'custom-section': `[Add your content here. Double-click to edit this section.]`,
}
