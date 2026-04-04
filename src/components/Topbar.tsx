'use client'
import { Bell } from 'lucide-react'

interface Props {
  title: string
  action?: { label: string; href?: string; onClick?: () => void }
  notifCount?: number
}

export default function Topbar({ title, action, notifCount = 0 }: Props) {
  const S = {
    bar: {
      height: 52, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      background: '#0B0E1A',
    } as React.CSSProperties,
    title: { fontFamily: 'Outfit,sans-serif', fontSize: '1.05rem', fontWeight: 700, color: '#fff' },
    right: { display: 'flex', alignItems: 'center', gap: 8 },
    notifBtn: {
      position: 'relative', width: 34, height: 34,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#141929', border: '1px solid rgba(255,255,255,0.07)',
      color: '#9AA0B8', cursor: 'pointer',
    } as React.CSSProperties,
    btn: {
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '7px 16px', background: '#F26419', color: '#fff', border: 'none',
      fontFamily: 'Outfit,sans-serif', fontSize: '.8rem', fontWeight: 700,
      letterSpacing: '.04em', textTransform: 'uppercase', cursor: 'pointer',
      clipPath: 'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)',
    } as React.CSSProperties,
  }

  return (
    <div style={S.bar}>
      <div style={S.title}>{title}</div>
      <div style={S.right}>
        {action && (
          <button style={S.btn} onClick={action.onClick}>
            {action.label}
          </button>
        )}
        <div style={S.notifBtn}>
          <Bell size={15} />
          {notifCount > 0 && (
            <div style={{
              position: 'absolute', top: 6, right: 6,
              width: 7, height: 7, borderRadius: '50%',
              background: '#EF4444', border: '1.5px solid #0B0E1A',
            }} />
          )}
        </div>
      </div>
    </div>
  )
}
