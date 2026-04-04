'use client'
import { useState } from 'react'

const PIPELINE_STAGES = [
  { key:'new',           label:'New Enquiry',    color:'#F26419' },
  { key:'contacted',     label:'Contacted',       color:'#3B82F6' },
  { key:'proposal_sent', label:'Proposal Sent',  color:'#A855F7' },
  { key:'negotiating',   label:'Negotiating',    color:'#F59E0B' },
  { key:'won',           label:'Won',             color:'#22C55E' },
  { key:'lost',          label:'Lost',            color:'#EF4444' },
]

const NOTIF_SETTINGS = [
  { key:'email_new',   label:'Email on every new enquiry',   sub:'Regardless of score or tier',        default: true },
  { key:'email_hot',   label:'Priority email for HOT leads', sub:'Score 80 or above — same day',       default: true },
  { key:'dash_hot',    label:'Dashboard HOT lead banner',    sub:'Pinned alert until lead is actioned', default: true },
  { key:'task_remind', label:'Task due reminders',           sub:'1 hour before due time',              default: true },
]

export default function SettingsClient({ templates }: { templates: Record<string, string[]> }) {
  const [activeTab,    setActiveTab]    = useState('CRM')
  const [taskLists,    setTaskLists]    = useState<Record<string, string[]>>(templates)
  const [editingTask,  setEditingTask]  = useState<{type:string; index:number} | null>(null)
  const [editVal,      setEditVal]      = useState('')
  const [newTask,      setNewTask]      = useState('')
  const [notifState,   setNotifState]   = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIF_SETTINGS.map(n => [n.key, n.default]))
  )

  const tabs = Object.keys(taskLists).map(k => k.charAt(0).toUpperCase() + k.slice(1))
  const activeKey = activeTab.toLowerCase()

  function startEdit(type: string, i: number) {
    setEditingTask({ type, index: i })
    setEditVal(taskLists[type][i])
  }

  function saveEdit() {
    if (!editingTask) return
    setTaskLists(prev => ({
      ...prev,
      [editingTask.type]: prev[editingTask.type].map((t, i) => i === editingTask.index ? editVal : t),
    }))
    setEditingTask(null)
  }

  function deleteTask(type: string, i: number) {
    setTaskLists(prev => ({ ...prev, [type]: prev[type].filter((_, idx) => idx !== i) }))
  }

  function addTask(type: string) {
    if (!newTask.trim()) return
    setTaskLists(prev => ({ ...prev, [type]: [...prev[type], newTask.trim()] }))
    setNewTask('')
  }

  const S = {
    toggle: (on: boolean): React.CSSProperties => ({
      width:38, height:21, background: on ? '#F26419' : 'rgba(255,255,255,0.12)',
      borderRadius:10, position:'relative', cursor:'pointer', transition:'background .2s',
      flexShrink:0, border:'none',
    }),
    knob: (on: boolean): React.CSSProperties => ({
      position:'absolute', top:2.5, left: on ? 19 : 2.5,
      width:16, height:16, borderRadius:'50%', background:'#fff', transition:'left .2s',
    }),
  }

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
      <div>
        {/* Pipeline stages */}
        <div style={{ background:'#141929', border:'1px solid rgba(255,255,255,0.07)', marginBottom:16 }}>
          <div style={{ padding:'14px 18px', borderBottom:'1px solid rgba(255,255,255,0.07)', display:'flex', justifyContent:'space-between' }}>
            <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'.95rem', fontWeight:700, color:'#fff' }}>Pipeline Stages</div>
            <button style={{ fontSize:'.75rem', color:'#F26419', background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>Edit</button>
          </div>
          <div style={{ padding:12 }}>
            {PIPELINE_STAGES.map(s => (
              <div key={s.key} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', background:'#0F1422', border:'1px solid rgba(255,255,255,0.07)', marginBottom:6 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background: s.color, flexShrink:0 }} />
                <span style={{ fontSize:'.82rem', color:'#EEF0F5', flex:1 }}>{s.label}</span>
                <span style={{ fontSize:'.68rem', color:'#6B7794', fontFamily:'Courier,monospace' }}>{s.key}</span>
              </div>
            ))}
            <button style={{ width:'100%', padding:'7px', background:'transparent', border:'1px dashed rgba(255,255,255,0.12)', color:'#6B7794', fontSize:'.78rem', cursor:'pointer', marginTop:4 }}>+ Add Stage</button>
          </div>
        </div>

        {/* Notifications */}
        <div style={{ background:'#141929', border:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ padding:'14px 18px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'.95rem', fontWeight:700, color:'#fff' }}>Notifications</div>
          </div>
          <div style={{ padding:'12px 16px' }}>
            {NOTIF_SETTINGS.map(n => (
              <div key={n.key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                <div>
                  <div style={{ fontSize:'.85rem', color:'#EEF0F5' }}>{n.label}</div>
                  <div style={{ fontSize:'.72rem', color:'#6B7794', marginTop:2 }}>{n.sub}</div>
                </div>
                <button
                  style={S.toggle(notifState[n.key])}
                  onClick={() => setNotifState(prev => ({ ...prev, [n.key]: !prev[n.key] }))}
                >
                  <div style={S.knob(notifState[n.key])} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project task templates */}
      <div style={{ background:'#141929', border:'1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ padding:'14px 18px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontFamily:'Outfit,sans-serif', fontSize:'.95rem', fontWeight:700, color:'#fff' }}>Project Task Templates</div>
          <div style={{ fontSize:'.75rem', color:'#6B7794', marginTop:2 }}>These tasks are auto-created when a new project is started</div>
        </div>
        <div style={{ padding:14 }}>
          {/* Tabs */}
          <div style={{ display:'flex', borderBottom:'1px solid rgba(255,255,255,0.07)', marginBottom:14 }}>
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding:'7px 14px', fontSize:'.8rem', fontWeight:600,
                color: activeTab === tab ? '#F26419' : '#9AA0B8',
                background:'none', border:'none',
                borderBottom: activeTab === tab ? '2px solid #F26419' : '2px solid transparent',
                cursor:'pointer', transition:'all .15s',
              }}>{tab}</button>
            ))}
          </div>

          {/* Task list */}
          <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
            {(taskLists[activeKey] ?? []).map((task, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px', background:'#0F1422', border:'1px solid rgba(255,255,255,0.07)' }}>
                <span style={{ fontSize:'.7rem', fontWeight:700, color:'#6B7794', minWidth:18 }}>{i + 1}</span>
                {editingTask?.type === activeKey && editingTask.index === i ? (
                  <>
                    <input value={editVal} onChange={e => setEditVal(e.target.value)} onKeyDown={e => { if(e.key==='Enter') saveEdit(); if(e.key==='Escape') setEditingTask(null) }} autoFocus style={{ flex:1, background:'#192035', border:'1px solid rgba(242,100,25,0.5)', color:'#EEF0F5', fontFamily:'Inter,sans-serif', fontSize:'.82rem', padding:'4px 8px', outline:'none' }} />
                    <button onClick={saveEdit} style={{ padding:'3px 8px', background:'#F26419', color:'#fff', border:'none', fontSize:'.72rem', cursor:'pointer' }}>Save</button>
                  </>
                ) : (
                  <>
                    <span style={{ flex:1, fontSize:'.82rem', color:'#EEF0F5' }}>{task}</span>
                    <button onClick={() => startEdit(activeKey, i)} style={{ background:'none', border:'none', color:'#6B7794', cursor:'pointer', fontSize:'.75rem', padding:'2px 6px' }}>Edit</button>
                    <button onClick={() => deleteTask(activeKey, i)} style={{ background:'none', border:'none', color:'rgba(239,68,68,0.6)', cursor:'pointer', fontSize:'.75rem', padding:'2px 6px' }}>✕</button>
                  </>
                )}
              </div>
            ))}

            <div style={{ display:'flex', gap:6, marginTop:6 }}>
              <input value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask(activeKey)} placeholder="Add a task..." style={{ flex:1, background:'#192035', border:'1px dashed rgba(255,255,255,0.12)', color:'#EEF0F5', fontFamily:'Inter,sans-serif', fontSize:'.82rem', padding:'7px 10px', outline:'none' }} />
              <button onClick={() => addTask(activeKey)} style={{ padding:'7px 14px', background:'#F26419', color:'#fff', border:'none', fontFamily:'Outfit,sans-serif', fontSize:'.78rem', fontWeight:700, cursor:'pointer', clipPath:'polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%)' }}>Add</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
