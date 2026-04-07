'use client'
import { tierColor, statusColor, priorityColor } from '@/lib/utils'

// ── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ label, color }: { label: string; color?: string }) {
  const cls = color ?? 'text-slate-400 bg-slate-500/10'
  return (
    <span style={{
      display:'inline-flex', alignItems:'center',
      fontSize:'.63rem', fontWeight:700, letterSpacing:'.06em',
      textTransform:'uppercase', padding:'3px 7px',
    }} className={cls}>
      {label}
    </span>
  )
}

export function TierBadge({ tier }: { tier: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    hot:        { bg:'rgba(239,68,68,0.12)',   color:'#EF4444' },
    warm:       { bg:'rgba(245,158,11,0.12)',  color:'#F59E0B' },
    cold:       { bg:'rgba(107,119,148,0.15)', color:'#9AA0B8' },
    unqualified:{ bg:'rgba(107,119,148,0.10)', color:'#6B7794' },
  }
  const c = colors[tier] ?? colors.cold
  return (
    <span style={{
      display:'inline-flex', alignItems:'center',
      fontSize:'.63rem', fontWeight:700, letterSpacing:'.06em',
      textTransform:'uppercase', padding:'3px 7px',
      background: c.bg, color: c.color,
    }}>
      {tier.toUpperCase()}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    new:          { bg:'rgba(242,100,25,0.12)',  color:'#F26419' },
    contacted:    { bg:'rgba(59,130,246,0.12)',  color:'#3B82F6' },
    proposal_sent:{ bg:'rgba(168,85,247,0.12)', color:'#A855F7' },
    negotiating:  { bg:'rgba(245,158,11,0.12)', color:'#F59E0B' },
    won:          { bg:'rgba(34,197,94,0.12)',   color:'#22C55E' },
    lost:         { bg:'rgba(239,68,68,0.12)',   color:'#EF4444' },
    nurturing:    { bg:'rgba(107,119,148,0.12)', color:'#9AA0B8' },
    scoping:      { bg:'rgba(168,85,247,0.12)', color:'#A855F7' },
    active:       { bg:'rgba(59,130,246,0.12)',  color:'#3B82F6' },
    review:       { bg:'rgba(245,158,11,0.12)', color:'#F59E0B' },
    complete:     { bg:'rgba(34,197,94,0.12)',   color:'#22C55E' },
    paused:       { bg:'rgba(107,119,148,0.12)', color:'#9AA0B8' },
    open:         { bg:'rgba(242,100,25,0.12)',  color:'#F26419' },
    in_progress:  { bg:'rgba(59,130,246,0.12)',  color:'#3B82F6' },
    done:         { bg:'rgba(34,197,94,0.12)',   color:'#22C55E' },
    cancelled:    { bg:'rgba(239,68,68,0.12)',   color:'#EF4444' },
    draft:        { bg:'rgba(107,119,148,0.12)', color:'#9AA0B8' },
    sent:         { bg:'rgba(59,130,246,0.12)',  color:'#3B82F6' },
  }
  const c = colors[status] ?? { bg:'rgba(107,119,148,0.12)', color:'#9AA0B8' }
  const label = status.replace(/_/g,' ')
  return (
    <span style={{
      display:'inline-flex', alignItems:'center',
      fontSize:'.63rem', fontWeight:700, letterSpacing:'.06em',
      textTransform:'uppercase', padding:'3px 7px',
      background: c.bg, color: c.color,
    }}>
      {label}
    </span>
  )
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string
  value: string | number
  meta?: string
  metaUp?: boolean
  accent?: string
}
export function StatCard({ label, value, meta, metaUp, accent = '#F26419' }: StatCardProps) {
  return (
    <div style={{
      background:'#141929', border:'1px solid rgba(255,255,255,0.07)',
      padding:'18px 20px', position:'relative',
    }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background: accent }} />
      <div style={{ fontSize:'.68rem', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'#6B7794', marginBottom:8 }}>{label}</div>
      <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'1.8rem', fontWeight:800, color:'#fff', lineHeight:1, letterSpacing:'-.02em' }}>{value}</div>
      {meta && <div style={{ fontSize:'.72rem', color: metaUp ? '#22C55E' : '#6B7794', marginTop:6 }}>{meta}</div>}
    </div>
  )
}

// ── Score Bar ─────────────────────────────────────────────────────────────────
export function ScoreBar({ score, tier }: { score: number; tier: string }) {
  const color = tier === 'hot' ? '#EF4444' : tier === 'warm' ? '#F59E0B' : '#F26419'
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <div style={{ flex:1, height:4, background:'rgba(255,255,255,0.12)', borderRadius:2, maxWidth:80 }}>
        <div style={{ width:`${score}%`, height:4, borderRadius:2, background: color }} />
      </div>
      <span style={{ fontSize:'.78rem', fontWeight:700, color, minWidth:24 }}>{score}</span>
    </div>
  )
}

// ── Progress Bar ──────────────────────────────────────────────────────────────
export function ProgressBar({ value, color = '#F26419' }: { value: number; color?: string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <div style={{ flex:1, height:3, background:'rgba(255,255,255,0.12)', borderRadius:2 }}>
        <div style={{ width:`${value}%`, height:3, borderRadius:2, background: color }} />
      </div>
      <span style={{ fontSize:'.72rem', color:'#6B7794', minWidth:28 }}>{value}%</span>
    </div>
  )
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background:'#141929', border:'1px solid rgba(255,255,255,0.07)', ...style }}>
      {children}
    </div>
  )
}

export function CardHead({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div style={{
      padding:'14px 18px', borderBottom:'1px solid rgba(255,255,255,0.07)',
      display:'flex', alignItems:'center', justifyContent:'space-between',
    }}>
      <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'.95rem', fontWeight:700, color:'#fff' }}>{title}</div>
      {action && <button onClick={onAction} style={{ fontSize:'.75rem', color:'#F26419', background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>{action}</button>}
    </div>
  )
}

// ── Table ─────────────────────────────────────────────────────────────────────
export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ overflowX:'auto' }}>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>{children}</table>
    </div>
  )
}
export function Th({ children }: { children: React.ReactNode }) {
  return <th style={{ fontSize:'.65rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#6B7794', padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.07)', textAlign:'left', background:'#141929', whiteSpace:'nowrap' }}>{children}</th>
}
export function Td({ children, bold, orange }: { children: React.ReactNode; bold?: boolean; orange?: boolean }) {
  return <td style={{ padding:'11px 16px', fontSize:'.82rem', color: orange ? '#F26419' : bold ? '#EEF0F5' : '#9AA0B8', borderBottom:'1px solid rgba(255,255,255,0.07)', verticalAlign:'middle', fontWeight: bold ? 600 : 400 }}>{children}</td>
}
export function Tr({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <tr
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      className="hover:bg-white/[0.02] transition-colors"
    >
      {children}
    </tr>
  )
}

// ── Empty State ───────────────────────────────────────────────────────────────
export function EmptyState({ message }: { message: string }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'48px', color:'#6B7794', textAlign:'center' }}>
      <div style={{ fontSize:2, marginBottom:12, opacity:.3 }}>◫</div>
      <p style={{ fontSize:'.85rem' }}>{message}</p>
    </div>
  )
}

// ── Filter Chip ───────────────────────────────────────────────────────────────
export function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding:'5px 12px', fontSize:'.72rem', fontWeight:600,
        background: active ? 'rgba(242,100,25,0.10)' : '#141929',
        border: active ? '1px solid #F26419' : '1px solid rgba(255,255,255,0.07)',
        color: active ? '#F26419' : '#9AA0B8',
        cursor:'pointer', transition:'all .15s',
      }}
    >
      {label}
    </button>
  )
}

// ── Input / Select / Textarea ─────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width:'100%', background:'#192035', border:'1px solid rgba(255,255,255,0.07)',
  color:'#EEF0F5', fontFamily:'Inter,sans-serif', fontSize:'.85rem',
  padding:'9px 12px', outline:'none',
}
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input style={inputStyle} {...props} />
}
export function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return <select style={{ ...inputStyle, cursor:'pointer', appearance:'none' }} {...props}>{children}</select>
}
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea style={{ ...inputStyle, resize:'vertical', minHeight:80 }} {...props} />
}

// ── Label ─────────────────────────────────────────────────────────────────────
export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label style={{ display:'block', fontSize:'.68rem', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'#9AA0B8', marginBottom:6 }}>{children}</label>
}

// ── Section Header ────────────────────────────────────────────────────────────
export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
      <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'.95rem', fontWeight:700, color:'#fff' }}>{title}</div>
      {action && <button onClick={onAction} style={{ fontSize:'.75rem', color:'#F26419', background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>{action}</button>}
    </div>
  )
}

// ── Primary Button ────────────────────────────────────────────────────────────
export function PrimaryBtn({ children, onClick, disabled, type = 'button', fullWidth }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; type?: 'button'|'submit'; fullWidth?: boolean
}) {
  return (
    <button
      type={type} onClick={onClick} disabled={disabled}
      style={{
        display:'inline-flex', alignItems:'center', gap:6,
        padding:'8px 18px', background: disabled ? '#333' : '#F26419', color:'#fff',
        border:'none', fontFamily:'Outfit,sans-serif', fontSize:'.8rem',
        fontWeight:700, letterSpacing:'.04em', textTransform:'uppercase',
        cursor: disabled ? 'not-allowed' : 'pointer',
        clipPath:'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)',
        width: fullWidth ? '100%' : undefined, justifyContent: fullWidth ? 'center' : undefined,
        transition:'background .15s',
      }}
    >
      {children}
    </button>
  )
}

// ── Ghost Button ──────────────────────────────────────────────────────────────
export function GhostBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display:'inline-flex', alignItems:'center', gap:6,
        padding:'8px 16px', background:'transparent', color:'#9AA0B8',
        border:'1px solid rgba(255,255,255,0.12)',
        fontFamily:'Outfit,sans-serif', fontSize:'.8rem',
        fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase',
        cursor:'pointer', transition:'all .15s',
      }}
    >
      {children}
    </button>
  )
}

// ── Slide Panel ───────────────────────────────────────────────────────────────
export function SlidePanel({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  return (
    <>
      {open && <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', zIndex:100, backdropFilter:'blur(4px)' }} />}
      <div style={{
        position:'fixed', top:0, right:0, bottom:0, width:520,
        background:'#0F1422', borderLeft:'1px solid rgba(255,255,255,0.07)',
        zIndex:101, display:'flex', flexDirection:'column',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition:'transform .25s ease', overflowY:'auto',
      }}>
        {children}
      </div>
    </>
  )
}

// ── Panel Head ────────────────────────────────────────────────────────────────
export function PanelHead({ title, sub, badge, onClose }: { title: string; sub?: string; badge?: string; onClose: () => void }) {
  return (
    <div style={{
      padding:'20px 24px', borderBottom:'1px solid rgba(255,255,255,0.07)',
      display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexShrink:0,
    }}>
      <div>
        <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'1.1rem', fontWeight:700, color:'#fff' }}>{title}</div>
        {sub && <div style={{ fontSize:'.75rem', color:'#6B7794', marginTop:2 }}>{sub}</div>}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        {badge && <StatusBadge status={badge} />}
        <button onClick={onClose} style={{ width:28, height:28, display:'flex', alignItems:'center', justifyContent:'center', background:'#141929', border:'1px solid rgba(255,255,255,0.07)', color:'#9AA0B8', cursor:'pointer' }}>
          ✕
        </button>
      </div>
    </div>
  )
}

// ── Detail Section ────────────────────────────────────────────────────────────
export function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom:24 }}>
      <div style={{ fontSize:'.68rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#6B7794', marginBottom:12, paddingBottom:8, borderBottom:'1px solid rgba(255,255,255,0.07)' }}>{title}</div>
      {children}
    </div>
  )
}

// ── Info Grid ─────────────────────────────────────────────────────────────────
export function InfoGrid({ items }: { items: { label: string; value: string | null | undefined }[] }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
      {items.map(item => (
        <div key={item.label}>
          <div style={{ fontSize:'.65rem', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'#6B7794', marginBottom:3 }}>{item.label}</div>
          <div style={{ fontSize:'.82rem', color:'#EEF0F5' }}>{item.value || '—'}</div>
        </div>
      ))}
    </div>
  )
}

// ── Task Item ─────────────────────────────────────────────────────────────────
export function TaskItem({ title, meta, due, done, onToggle }: {
  title: string; meta?: string; due?: string; done?: boolean; onToggle?: () => void
}) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'10px 12px', background:'#141929', border:'1px solid rgba(255,255,255,0.07)', marginBottom:6 }}>
      <button
        onClick={onToggle}
        style={{
          width:16, height:16, borderRadius:2, flexShrink:0, marginTop:1,
          border: done ? 'none' : '1.5px solid rgba(255,255,255,0.2)',
          background: done ? '#22C55E' : 'transparent',
          cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
        }}
      >
        {done && <span style={{ color:'#fff', fontSize:8, fontWeight:800, lineHeight:1 }}>OK</span>}
      </button>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:'.82rem', color: done ? '#6B7794' : '#EEF0F5', textDecoration: done ? 'line-through' : 'none' }}>{title}</div>
        {meta && <div style={{ fontSize:'.7rem', color:'#6B7794', marginTop:2 }}>{meta}</div>}
      </div>
      {due && <div style={{ fontSize:'.68rem', color:'#F59E0B', flexShrink:0 }}>{due}</div>}
    </div>
  )
}

// ── Note Item ─────────────────────────────────────────────────────────────────
export function NoteItem({ content, author, date }: { content: string; author: string; date: string }) {
  return (
    <div style={{ padding:'10px 12px', background:'#141929', border:'1px solid rgba(255,255,255,0.07)', marginBottom:6 }}>
      <div style={{ fontSize:'.82rem', color:'#9AA0B8', lineHeight:1.6 }}>{content}</div>
      <div style={{ fontSize:'.68rem', color:'#6B7794', marginTop:6 }}>{author} &middot; {date}</div>
    </div>
  )
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div style={{ display:'flex', borderBottom:'1px solid rgba(255,255,255,0.07)', marginBottom:16 }}>
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          style={{
            padding:'8px 16px', fontSize:'.8rem', fontWeight:600,
            color: active === tab ? '#F26419' : '#9AA0B8',
            borderBottom: active === tab ? '2px solid #F26419' : '2px solid transparent',
            background:'none', border:'none',
            cursor:'pointer', transition:'all .15s',
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
