import { useState } from 'react'
import { format, isToday, isPast, isTomorrow, isThisMonth } from 'date-fns'
import { he } from 'date-fns/locale'
import { Plus, Bell, Phone, MessageCircle, ChevronLeft, Users, CheckCircle, Clock, MapPin, X, Share, Download } from 'lucide-react'

function isIOS() { return /iphone|ipad|ipod/i.test(navigator.userAgent) }
function isInStandaloneMode() { return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone }

function PwaBanner() {
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem('pwa-dismissed') === '1')
  if (dismissed || isInStandaloneMode()) return null

  const dismiss = () => { sessionStorage.setItem('pwa-dismissed','1'); setDismissed(true) }

  return (
    <div className="pwa-banner">
      <div className="pwa-banner-icon">
        <img src="/logo.png" alt="Casa Clinic" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
      </div>
      <div className="pwa-banner-text">
        <strong>התקיני את האפליקציה על האייפון</strong>
        <span>
          {isIOS()
            ? <>לחצי על <Share size={11} style={{display:'inline',verticalAlign:'middle'}}/> ואז "הוסף למסך הבית" — תקבלי תזכורות גם כשהאפליקציה סגורה</>
            : <>לחצי על התפריט ← "התקן אפליקציה" — תקבלי תזכורות גם כשהאפליקציה סגורה</>
          }
        </span>
      </div>
      <button className="pwa-banner-close" onClick={dismiss}><X size={16}/></button>
    </div>
  )
}

const wa = phone => `https://wa.me/972${(phone||'').replace(/[-\s]/g,'').replace(/^0/,'')}`

function remTag(iso) {
  if (!iso) return null
  const dt = new Date(iso)
  if (isPast(dt) && !isToday(dt)) return { label:'באיחור', color:'#EF4444', bg:'#FEF2F2' }
  if (isToday(dt))                return { label:'היום',    color:'#D97706', bg:'#FFFBEB' }
  if (isTomorrow(dt))             return { label:'מחר',     color:'#059669', bg:'#ECFDF5' }
  return null
}

const ACTIVE_STATUSES = ['ממתין','נשלחה הודעה','אין מענה','חזרה אלינו']

export default function Dashboard({ leads, onAdd, onEdit, onNav, USE_DEMO }) {
  const today = new Date().toISOString().slice(0,10)

  const kpi = {
    newToday:  leads.filter(l => l.entry_date === today).length,
    waiting:   leads.filter(l => ACTIVE_STATUSES.includes(l.status)).length,
    todayRem:  leads.filter(l => l.reminder_at && isToday(new Date(l.reminder_at))).length,
    closed:    leads.filter(l => l.status === 'נסגרה' && l.entry_date && isThisMonth(new Date(l.entry_date+'T12:00'))).length,
    tooFar:    leads.filter(l => l.status === 'רחוק לה').length,
  }

  const urgent = leads.filter(l =>
    l.status === 'אין מענה' ||
    (l.reminder_at && isPast(new Date(l.reminder_at)) && !isToday(new Date(l.reminder_at)))
  ).slice(0,5)

  const todayRemLeads = leads.filter(l => l.reminder_at && isToday(new Date(l.reminder_at))).slice(0,4)

  return (
    <div className="anim-fade-in">

      {/* ── PWA install banner ── */}
      <PwaBanner />

      {/* ── Welcome strip ── */}
      <div className="welcome-strip" style={{marginBottom:28}}>
        <img src="/bg.jpg" alt="" />
        <div className="welcome-strip-overlay" />
        <div className="welcome-strip-text">
          <p style={{fontSize:10,color:'rgba(255,255,255,.6)',letterSpacing:'.2em',textTransform:'uppercase',marginBottom:8}}>ברוכה הבאה</p>
          <h1 className="playfair" style={{fontSize:32,color:'#fff',fontWeight:400,lineHeight:1.1,textShadow:'0 2px 20px rgba(0,0,0,.4)',marginBottom:6}}>
            Casa Clínic Aesthetics
          </h1>
          <p style={{fontSize:13,color:'rgba(255,255,255,.6)'}}>
            {format(new Date(),'EEEE, d בMMMM yyyy',{locale:he})}
          </p>
        </div>
      </div>

      {USE_DEMO && (
        <div className="demo-badge" style={{marginBottom:20}}>
          מצב הדגמה — חבר Supabase לנתונים אמיתיים
        </div>
      )}

      {/* ── KPI Cards ── */}
      <div className="kpi-grid">
        <KpiCard
          num={kpi.newToday} label="פניות חדשות היום"
          icon={<Users size={18} style={{color:'#7C3AED'}}/>}
          iconBg="rgba(124,58,237,.1)"
          onClick={()=>onNav('leads')}
        />
        <KpiCard
          num={kpi.waiting} label="ממתינות לטיפול"
          icon={<Clock size={18} style={{color:'#D97706'}}/>}
          iconBg="rgba(217,119,6,.1)"
          onClick={()=>onNav('leads')}
        />
        <KpiCard
          num={kpi.todayRem} label="תזכורות להיום"
          icon={<Bell size={18} style={{color:'#DC2626'}}/>}
          iconBg="rgba(220,38,38,.1)"
          onClick={()=>onNav('reminders')}
        />
        <KpiCard
          num={kpi.closed} label="נסגרו החודש"
          icon={<CheckCircle size={18} style={{color:'#059669'}}/>}
          iconBg="rgba(5,150,105,.1)"
        />
        <KpiCard
          num={kpi.tooFar} label='אמרו "רחוק לה"'
          icon={<MapPin size={18} style={{color:'#EA580C'}}/>}
          iconBg="rgba(234,88,12,.1)"
          accent="#EA580C"
          onClick={()=>onNav('leads')}
        />
      </div>

      <div className="dash-grid">

        {/* ── Urgent ── */}
        <div>
          <div className="section-header">
            <h2 className="section-title">דורש טיפול עכשיו</h2>
            {urgent.length > 0 && (
              <button className="btn-ghost" style={{fontSize:12,padding:'5px 10px'}} onClick={()=>onNav('leads')}>
                כל הפניות <ChevronLeft size={13}/>
              </button>
            )}
          </div>

          {urgent.length === 0 ? (
            <div className="card" style={{padding:'32px 20px',textAlign:'center'}}>
              <div style={{fontSize:13,color:'var(--text-3)',fontStyle:'italic'}} className="playfair">
                אין פניות דחופות כרגע ✨
              </div>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {urgent.map((lead,i) => {
                const isNoAnswer = lead.status === 'אין מענה'
                return (
                  <div
                    key={lead.id}
                    className="card anim-fade-up"
                    style={{padding:'14px 16px',cursor:'pointer',borderRight:`3px solid ${isNoAnswer?'#1D4ED8':'#EF4444'}`,animationDelay:`${i*60}ms`}}
                    onClick={()=>onEdit(lead)}
                  >
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                      <span style={{fontWeight:600,fontSize:14,color:'var(--text-1)'}}>{lead.name}</span>
                      <span className={`pill ${isNoAnswer?'pill-silent':'pill-wait'}`} style={{fontSize:10}}>
                        {isNoAnswer ? 'אין מענה' : 'תזכורת באיחור'}
                      </span>
                    </div>
                    {lead.area && (
                      <div style={{fontSize:11,color:'var(--text-3)',marginBottom:6,display:'flex',alignItems:'center',gap:4}}>
                        <MapPin size={10}/>{lead.area}
                      </div>
                    )}
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      {lead.phone && (
                        <>
                          <a href={`tel:${lead.phone}`} onClick={e=>e.stopPropagation()} className="btn-action call" style={{padding:'6px 12px',fontSize:11}}>
                            <Phone size={11}/>התקשרי
                          </a>
                          <a href={wa(lead.phone)} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} className="btn-action wa" style={{padding:'6px 12px',fontSize:11}}>
                            <MessageCircle size={11}/>WhatsApp
                          </a>
                        </>
                      )}
                      <span style={{fontSize:11,color:'var(--text-3)',marginRight:'auto'}}>
                        {lead.treatment || '—'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Today's reminders ── */}
        <div>
          <div className="section-header">
            <h2 className="section-title">תזכורות להיום</h2>
            {todayRemLeads.length > 0 && (
              <button className="btn-ghost" style={{fontSize:12,padding:'5px 10px'}} onClick={()=>onNav('reminders')}>
                כל התזכורות <ChevronLeft size={13}/>
              </button>
            )}
          </div>

          {todayRemLeads.length === 0 ? (
            <div className="card" style={{padding:'32px 20px',textAlign:'center'}}>
              <div style={{fontSize:13,color:'var(--text-3)',fontStyle:'italic'}} className="playfair">
                אין תזכורות להיום 🌿
              </div>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {todayRemLeads.map((lead,i) => (
                <div
                  key={lead.id}
                  className="rem-card today anim-fade-up"
                  style={{animationDelay:`${i*60}ms`}}
                  onClick={()=>onEdit(lead)}
                >
                  <div style={{width:36,height:36,borderRadius:10,background:'rgba(245,158,11,.1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    <Bell size={16} style={{color:'#D97706'}}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:600,fontSize:13,color:'var(--text-1)',marginBottom:2}}>{lead.name}</div>
                    <div style={{fontSize:11,color:'var(--text-3)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                      {lead.reminder_note || 'תזכורת לחזרה ללקוחה'}
                    </div>
                  </div>
                  <div style={{flexShrink:0,textAlign:'center'}}>
                    <div style={{fontSize:11,fontWeight:700,color:'#D97706'}}>
                      {format(new Date(lead.reminder_at),'HH:mm',{locale:he})}
                    </div>
                    <div style={{fontSize:9,color:'var(--text-3)'}}>היום</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Add CTA ── */}
      <div style={{marginTop:28,display:'flex',justifyContent:'center'}}>
        <button className="btn-gold" style={{padding:'14px 32px',borderRadius:14,fontSize:14,boxShadow:'0 6px 24px rgba(166,124,69,.28)'}} onClick={onAdd}>
          <Plus size={16}/>
          הוספת פנייה חדשה
        </button>
      </div>
    </div>
  )
}

function KpiCard({ num, label, icon, iconBg, onClick, accent }) {
  return (
    <div
      className="kpi-card"
      style={{cursor:onClick?'pointer':'default', borderTop: accent ? `3px solid ${accent}` : undefined}}
      onClick={onClick}
    >
      <div className="kpi-icon" style={{background:iconBg}}>{icon}</div>
      <div className="kpi-num" style={{color: accent && num > 0 ? accent : undefined}}>{num}</div>
      <div className="kpi-label">{label}</div>
    </div>
  )
}
