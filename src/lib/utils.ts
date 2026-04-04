export function fmt$(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000)    return `$${(n / 1000).toFixed(0)}K`
  return `$${n}`
}

export function fmtFull$(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n)
}

export function fmtDate(d: string | null | undefined) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function fmtRelative(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 60)   return `${mins}m ago`
  if (hours < 24)  return `${hours}h ago`
  if (days < 7)    return `${days}d ago`
  return fmtDate(d)
}

export function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export function tierColor(tier: string) {
  if (tier === 'hot')  return 'text-red-400 bg-red-500/10 border-red-500/20'
  if (tier === 'warm') return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
  if (tier === 'cold') return 'text-slate-400 bg-slate-500/10 border-slate-500/20'
  return 'text-slate-500 bg-slate-600/10 border-slate-600/20'
}

export function statusColor(status: string) {
  const map: Record<string, string> = {
    new:         'text-orange-400 bg-orange-500/10',
    contacted:   'text-blue-400 bg-blue-500/10',
    proposal_sent: 'text-purple-400 bg-purple-500/10',
    negotiating: 'text-amber-400 bg-amber-500/10',
    won:         'text-green-400 bg-green-500/10',
    lost:        'text-red-400 bg-red-500/10',
    nurturing:   'text-slate-400 bg-slate-500/10',
    scoping:     'text-purple-400 bg-purple-500/10',
    active:      'text-blue-400 bg-blue-500/10',
    review:      'text-amber-400 bg-amber-500/10',
    complete:    'text-green-400 bg-green-500/10',
    paused:      'text-slate-400 bg-slate-500/10',
    open:        'text-orange-400 bg-orange-500/10',
    in_progress: 'text-blue-400 bg-blue-500/10',
    done:        'text-green-400 bg-green-500/10',
    cancelled:   'text-red-400 bg-red-500/10',
    draft:       'text-slate-400 bg-slate-500/10',
    sent:        'text-blue-400 bg-blue-500/10',
  }
  return map[status] ?? 'text-slate-400 bg-slate-500/10'
}

export function priorityColor(priority: string) {
  if (priority === 'urgent') return 'text-red-400'
  if (priority === 'high')   return 'text-amber-400'
  if (priority === 'medium') return 'text-blue-400'
  return 'text-slate-400'
}
