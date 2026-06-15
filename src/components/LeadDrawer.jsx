import { useEffect, useRef } from 'react'
import { format } from 'date-fns'
import { X, Phone, MessageCircle, Bell, CheckCircle, PhoneMissed } from 'lucide-react'

const wa = phone => `https://wa.me/972${(phone||'').replace(/[-\s]/g,'').replace(/^0/,'')}`

export default function LeadDrawer({ form, setForm, saving, onSave, onClose, isNew, openReminder, STATUSES, TREATMENTS, SOURCES }) {
  const set = (k,v) => setForm(f=>({...f,[k]:v}))

  const logCallAttempt = () => {
    const now = new Date()
    const stamp = `📞 ${now.getDate()}/${now.getMonth()+1} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')} — ניסיון חזרה`
    const prevNotes = form.notes ? form.notes + '\n' : ''
    setForm(f => ({ ...f, status: 'אין מענה', notes: prevNotes + stamp }))
  }
  const reminderRef = useRef(null)

  useEffect(() => {
    if (openReminder && reminderRef.current)
      setTimeout(()=>reminderRef.current?.scrollIntoView({behavior:'smooth',block:'center'}),250)
  }, [openReminder])

  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  const currentStatus = STATUSES.find(s=>s.id===form.status) || STATUSES[0]

  return (
    <>
      <div className="drawer-backdrop anim-fade-in" onClick={onClose}/>
      <div className="drawer-panel">
        <div className="drawer-box anim-scale-in">

          {/* ── Header ── */}
          <div style={{padding:'28px 28px 20px',borderBottom:'1px solid var(--border)',background:'linear-gradient(135deg,rgba(239,235,227,.7),rgba(255,255,255,.5))'}}>
            <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between'}}>
              <div>
                <h2 className="playfair" style={{fontSize:26,fontWeight:400,color:'var(--text-1)'}}>
                  {isNew ? 'פנייה חדשה' : (form.name || 'עריכת פנייה')}
                </h2>
                <p style={{fontSize:10,letterSpacing:'.2em',color:'var(--text-3)',marginTop:3,textTransform:'uppercase'}}>
                  {isNew ? 'Casa Clínic Aesthetics' : (form.treatment || 'Casa Clínic Aesthetics')}
                </p>
              </div>
              <button
                onClick={onClose}
                style={{width:34,height:34,borderRadius:9,background:'rgba(154,145,136,.1)',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text-3)',transition:'all .15s',flexShrink:0}}
                onMouseEnter={e=>{e.currentTarget.style.background='rgba(239,68,68,.1)';e.currentTarget.style.color='#EF4444'}}
                onMouseLeave={e=>{e.currentTarget.style.background='rgba(154,145,136,.1)';e.currentTarget.style.color='var(--text-3)'}}
              ><X size={14}/></button>
            </div>

            {/* quick actions (edit only) */}
            {!isNew && form.phone && (
              <div style={{display:'flex',gap:8,marginTop:14}}>
                <a href={`tel:${form.phone}`} className="btn-action call" style={{flex:1,justifyContent:'center',padding:'8px 0',fontSize:12,textDecoration:'none'}}>
                  <Phone size={12}/>התקשרי
                </a>
                <a href={wa(form.phone)} target="_blank" rel="noreferrer" className="btn-action wa" style={{flex:1,justifyContent:'center',padding:'8px 0',fontSize:12,textDecoration:'none'}}>
                  <MessageCircle size={12}/>WhatsApp
                </a>
                <button
                  className="btn-action"
                  style={{flex:1,justifyContent:'center',padding:'8px 0',fontSize:12,background:'#FEE2E2',color:'#991B1B'}}
                  onClick={logCallAttempt}
                >
                  <PhoneMissed size={12}/>אין מענה
                </button>
                <button
                  className="btn-action close-lead"
                  style={{flex:1,justifyContent:'center',padding:'8px 0',fontSize:12}}
                  onClick={()=>set('status','נסגרה')}
                  disabled={form.status==='נסגרה'}
                >
                  <CheckCircle size={12}/>נסגרה
                </button>
              </div>
            )}
          </div>

          {/* ── Body ── */}
          <div style={{padding:'24px 28px',display:'flex',flexDirection:'column',gap:18}}>

            {/* date + name */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1.5fr',gap:14}}>
              <div>
                <label className="inp-label">תאריך פנייה</label>
                <input type="date" className="inp" dir="ltr" value={form.entry_date} onChange={e=>set('entry_date',e.target.value)}/>
              </div>
              <div>
                <label className="inp-label">שם מלא *</label>
                <input className="inp" placeholder="שם הלקוחה" value={form.name} onChange={e=>set('name',e.target.value)} autoFocus={isNew}/>
              </div>
            </div>

            {/* phone */}
            <div>
              <label className="inp-label">טלפון</label>
              <input className="inp" placeholder="05X-XXX-XXXX" dir="ltr" value={form.phone} onChange={e=>set('phone',e.target.value)}/>
            </div>

            {/* treatment + source */}
            <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:14}}>
              <div>
                <label className="inp-label">סוג טיפול</label>
                <select className="inp" value={form.treatment||''} onChange={e=>set('treatment',e.target.value)}>
                  <option value="">בחרי טיפול...</option>
                  {(TREATMENTS||[]).map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="inp-label">מקור הליד</label>
                <select className="inp" value={form.source||'Meta (פייסבוק/אינסטגרם)'} onChange={e=>set('source',e.target.value)}>
                  {(SOURCES||[]).map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* status */}
            <div>
              <label className="inp-label" style={{marginBottom:8}}>מצב הפנייה</label>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <select
                  className="inp"
                  value={form.status}
                  onChange={e=>set('status',e.target.value)}
                  style={{flex:1}}
                >
                  <optgroup label="── בתהליך ──">
                    {STATUSES.filter(s=>s.group==='active').map(s=>(
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="── קדימה ──">
                    {STATUSES.filter(s=>s.group==='progress'||s.group==='done').map(s=>(
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </optgroup>
                  <optgroup label="── לא סגר ──">
                    {STATUSES.filter(s=>s.group==='lost').map(s=>(
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </optgroup>
                </select>
                <span className={`pill ${currentStatus.cls}`} style={{flexShrink:0,fontSize:11}}>
                  {currentStatus.label}
                </span>
              </div>
              {currentStatus.autoReminder && (
                <p style={{fontSize:11,color:'var(--gold-deep)',marginTop:6,display:'flex',alignItems:'center',gap:5}}>
                  <Bell size={11}/> מומלץ להגדיר תזכורת לחזרה ללקוחה
                </p>
              )}
            </div>

            {/* notes */}
            <div>
              <label className="inp-label">הערות כלליות</label>
              <textarea
                className="inp"
                rows={2}
                placeholder="הערות, פרטים נוספים, סיבת אי-סגירה..."
                value={form.notes||''}
                onChange={e=>set('notes',e.target.value)}
                style={{resize:'vertical',minHeight:64,fontFamily:'inherit',lineHeight:1.5}}
              />
            </div>

            {/* reminder */}
            <div
              ref={reminderRef}
              style={{
                background: openReminder ? 'rgba(201,169,110,.12)' : 'rgba(239,235,227,.5)',
                borderRadius: 13, padding:'18px 18px',
                border: openReminder ? '1.5px solid rgba(201,169,110,.45)' : '1px solid var(--border)',
                transition:'all .3s',
              }}
            >
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
                <div style={{width:28,height:28,borderRadius:8,background:'rgba(201,169,110,.15)',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <Bell size={13} style={{color:'var(--gold)'}}/>
                </div>
                <span style={{fontSize:11,fontWeight:600,letterSpacing:'.1em',textTransform:'uppercase',color:'var(--text-3)'}}>
                  תזכורת לחזרה ללקוחה
                </span>
                {openReminder && (
                  <span style={{marginRight:'auto',fontSize:10,background:'rgba(201,169,110,.2)',color:'var(--gold-deep)',padding:'2px 8px',borderRadius:100,fontWeight:600}}>
                    מומלץ להגדיר
                  </span>
                )}
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                <div>
                  <label className="inp-label">מתי לחזור</label>
                  <input type="datetime-local" className="inp" dir="ltr" style={{fontSize:13}} value={form.reminder_at||''} onChange={e=>set('reminder_at',e.target.value)}/>
                </div>
                <div>
                  <label className="inp-label">הערה</label>
                  <input className="inp" style={{fontSize:13}} placeholder="למה לחזור אליה..." value={form.reminder_note||''} onChange={e=>set('reminder_note',e.target.value)}/>
                </div>
              </div>
            </div>

          </div>

          {/* ── Footer ── */}
          <div style={{padding:'0 28px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',borderTop:'1px solid var(--border)',paddingTop:16}}>
            <button onClick={onClose} className="btn-outline" style={{padding:'10px 20px',borderRadius:10}}>
              חזרה ללא שינוי
            </button>
            <button
              onClick={onSave}
              disabled={saving || !form.name?.trim()}
              className="btn-gold"
              style={{padding:'11px 26px',borderRadius:11,boxShadow:'0 4px 16px rgba(166,124,69,.28)'}}
            >
              {saving ? 'שומרת...' : isNew ? 'הוספת פנייה' : 'שמירת שינויים'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
