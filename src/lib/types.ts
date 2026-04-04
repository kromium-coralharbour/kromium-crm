export type Role = 'admin' | 'manager' | 'executive'
export type LeadTier = 'hot' | 'warm' | 'cold' | 'unqualified'
export type LeadStatus = 'new' | 'contacted' | 'proposal_sent' | 'negotiating' | 'won' | 'lost' | 'nurturing'
export type ProjectType = 'crm' | 'website' | 'brand' | 'marketing' | 'retainer' | 'other'
export type ProjectStatus = 'scoping' | 'active' | 'review' | 'complete' | 'paused'
export type TaskStatus = 'open' | 'in_progress' | 'done' | 'cancelled'
export type ProposalStatus = 'draft' | 'sent' | 'negotiating' | 'won' | 'lost'
export type Priority = 'low' | 'medium' | 'high' | 'urgent'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: Role
  avatar_url?: string
  created_at: string
}

export interface Lead {
  id: string
  created_at: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  company?: string
  country?: string
  industry?: string
  website?: string
  social_instagram?: string
  social_facebook?: string
  social_linkedin?: string
  social_other?: string
  referral_source?: string
  form_type: string
  lead_score: number
  lead_tier: LeadTier
  status: LeadStatus
  assigned_to?: string
  form_data: Record<string, unknown>
  score_breakdown: Record<string, number>
  notes?: string
  email_sent: boolean
  assigned_profile?: Profile
}

export interface Client {
  id: string
  created_at: string
  lead_id?: string
  company_name: string
  contact_name: string
  email: string
  phone?: string
  country?: string
  industry?: string
  website?: string
  social_instagram?: string
  social_linkedin?: string
  notes?: string
  lifetime_value: number
  active: boolean
}

export interface Project {
  id: string
  created_at: string
  client_id: string
  name: string
  type: ProjectType
  status: ProjectStatus
  description?: string
  value: number
  start_date?: string
  due_date?: string
  assigned_to?: string
  progress: number
  client?: Client
  tasks?: ProjectTask[]
  assigned_profile?: Profile
}

export interface ProjectTask {
  id: string
  created_at: string
  project_id: string
  title: string
  description?: string
  status: TaskStatus
  assigned_to?: string
  due_date?: string
  order_index: number
  completed_at?: string
  assigned_profile?: Profile
}

export interface Task {
  id: string
  created_at: string
  title: string
  description?: string
  status: TaskStatus
  priority: Priority
  assigned_to?: string
  due_date?: string
  lead_id?: string
  project_id?: string
  auto_generated: boolean
  completed_at?: string
  lead?: Lead
  project?: Project
  assigned_profile?: Profile
}

export interface Note {
  id: string
  created_at: string
  content: string
  author_id: string
  lead_id?: string
  client_id?: string
  project_id?: string
  author?: Profile
}

export interface Proposal {
  id: string
  created_at: string
  lead_id?: string
  client_id?: string
  title: string
  status: ProposalStatus
  value: number
  services: string[]
  scope: string
  deliverables: string
  timeline: string
  pricing_breakdown: PricingItem[]
  terms: string
  valid_until?: string
  sent_at?: string
  notes?: string
  lead?: Lead
  client?: Client
}

export interface PricingItem {
  description: string
  amount: number
  type: 'one_off' | 'monthly' | 'retainer'
}

export interface NurtureEntry {
  id: string
  created_at: string
  lead_id: string
  sequence_type: string
  touchpoint: string
  sent_at?: string
  next_action?: string
  next_due?: string
  lead?: Lead
}

export interface RevenueRecord {
  id: string
  created_at: string
  client_id: string
  project_id?: string
  amount: number
  description: string
  date: string
  invoice_number?: string
  paid: boolean
  client?: Client
}

export interface Notification {
  id: string
  created_at: string
  user_id?: string
  type: string
  title: string
  body: string
  read: boolean
  link?: string
}
