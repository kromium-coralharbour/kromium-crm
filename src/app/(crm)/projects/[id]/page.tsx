import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProjectWorkspace from './ProjectWorkspace'

const ACCENT: Record<string, string> = {
  crm: '#F26419', website: '#3B82F6', brand: '#A855F7',
  marketing: '#22C55E', retainer: '#F59E0B', other: '#6B7794',
}

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const [{ data: project }, { data: notes }, { data: profiles }] = await Promise.all([
    supabase
      .from('projects')
      .select('*,clients(id,company_name,email,contact_name),project_tasks(*,profiles(full_name))')
      .eq('id', params.id)
      .single(),
    supabase
      .from('notes')
      .select('*,profiles(full_name)')
      .eq('project_id', params.id)
      .order('created_at', { ascending: false }),
    supabase.from('profiles').select('*'),
  ])

  if (!project) notFound()

  const tasks = (project.project_tasks ?? []).sort((a: any, b: any) => a.order_index - b.order_index)
  const accent = ACCENT[project.type] ?? '#F26419'

  return (
    <ProjectWorkspace
      project={project}
      tasks={tasks}
      profiles={profiles ?? []}
      notes={notes ?? []}
      accent={accent}
    />
  )
}
