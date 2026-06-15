import { format, isToday, isPast, isTomorrow, isThisWeek } from 'date-fns'
import { he } from 'date-fns/locale'
import { Bell, Phone, MessageCircle, Edit2 } from 'lucide-react'

const wa = phone => `https://wa.me/972${(phone||'').replace(/[-\s]/g,'').replace(/^0/,'')}`

export default function RemindersPage({ leads, onEdit }) {
  const withRem = leads.filter(l => l.reminder_at)

  const overdue = withRem.filter(l => isPast(new Date(l.reminder_at)) && !isToday(new Date(l.reminder_at)))
  const today   = withRem.filter(l => isToday(new Date(l.reminder_at)))
  const week    = withRem.filter(l => !isToday(new Date(l.reminder_at)) && !isPast(new Date(l.reminder_at)) && isThisWeek(new Date(l.reminder_at), {weekStartsOn:0}))
  const future  = withRem.filter(l => !isToday(new Date(l.reminder_at)) && !isPast(new Date(l.reminder_at)) && !isThisWeek(new Date(l.reminder_at), {weekStartsOn:0}))

  if (withRem.length === 0) {
    return (
      <div className="anim-fade-in">
        <div className="page-header">
          <div>
            <h1 className="page-title">תזכורות</h1>
            <p className="page-subtitle">כל התזכורות שלך במקום אחד</p>
          </div>
        </div>
        <div className="empty-state">
          <div className="empty-state-title">אין תזכורות פעילות</div>
          <p className="empty-state-sub">תזכורות יופיעו כאן כשתגדירי אותן על פניות</p>
        </div>
      </div>
    )
  }

  return (
    <div className="anim-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">תזכורות</h1>
          <p className="page-subtitle">{withRem.length} תזכורות פעילות</p>
        </div>
      </div>

      {overdue.length > 0 && (
        <Section
          title="באיחור — דורש טיפול"
          leads={overdue}
          type="overdue"
          onEdit={onEdit}
          microcopy="כדאי לחזור אליהן בהקדם"
        />
      )}
      {today.length > 0 && (
        <Section
          title="היום"
          leads={today}
          type="today"
          onEdit={onEdit}
          microcopy="תזכורות שנקבעו להיום"
        />
      )}
      {week.length > 0 && (
        <Section
          title="השבוע"
          leads={week}
          type="future"
          onEdit={onEdit}
          microcopy="תזכורות בהמשך השבוע"
        />
      )}
      {future.length > 0 && (
        <Section
          title="בהמשך"
          leads={future}
          type="future"
          onEdit={onEdit}
          microcopy="תזכורות לטווח ארוך יותר"
        />
      )}
    </div>
  )
}

function Section({ title, leads, type, onEdit, microcopy }) {
  const color = type==='overdue' ? '#EF4444' : type==='today' ? '#D97706' : '#059669'
  const bg    = type==='overdue' ? '#FEF2F2' : type==='today' ? '#FFFBEB' : '#ECFDF5'

  return (
    <div style={{marginBottom:32}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
        <div style={{width:10,height:10,borderRadius:'50%',background:color,boxShadow:`0 0 0 3px ${bg}`}}/>
        <h2 className="section-title" style={{fontSize:17}}>{title}</h2>
        <span style={{fontSize:11,color:'var(--text-3)',marginRight:2}}>{microcopy}</span>
        <span style={{fontSize:11,color:'var(--text-3)',marginRight:'auto',background:'var(--sidebar-bg)',borderRadius:100,padding:'2px 10px',fontWeight:600}}>
          {leads.length}
        </span>
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {leads.map((lead,i) => (
          <RemCard key={lead.id} lead={lead} type={type} onEdit={onEdit} idx={i}/>
        ))}
      </div>
    </div>
  )
}

function RemCard({ lead, type, onEdit, idx }) {
  const dt = new Date(lead.reminder_at)
  const isOverdue = type === 'overdue'
  const isToday_  = type === 'today'

  const timeStr = isToday_
    ? format(dt,'HH:mm',{locale:he})
    : format(dt,'dd בMMMM, HH:mm',{locale:he})

  const copy = isOverdue
    ? 'פנייה שממתינה למענה'
    : isToday_
    ? 'כדאי לחזור אליה היום'
    : 'תזכורת להמשך טיפול'

  return (
    <div
      className={`rem-card ${type} anim-fade-up`}
      style={{animationDelay:`${idx*50}ms`}}
      onClick={()=>onEdit(lead)}
    >
      {/* icon */}
      <div style={{
        width:40, height:40, borderRadius:11, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center',
        background: isOverdue ? '#FEE2E2' : isToday_ ? '#FEF3C7' : '#DCFCE7',
      }}>
        <Bell size={17} style={{color: isOverdue ? '#EF4444' : isToday_ ? '#D97706' : '#059669'}}/>
      </div>

      {/* content */}
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
          <span style={{fontWeight:700,fontSize:14,color:'var(--text-1)'}}>{lead.name}</span>
          {lead.treatment && (
            <span style={{fontSize:11,color:'var(--text-3)',background:'var(--sidebar-bg)',borderRadius:100,padding:'1px 8px'}}>{lead.treatment}</span>
          )}
        </div>
        <div style={{fontSize:12,color:'var(--text-3)',marginBottom:lead.reminder_note?3:0}}>
          {copy}
        </div>
        {lead.reminder_note && (
          <div style={{fontSize:12,color:'var(--text-2)',fontStyle:'italic',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
            "{lead.reminder_note}"
          </div>
        )}
      </div>

      {/* time + actions */}
      <div style={{flexShrink:0,display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8}}>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:12,fontWeight:700,color: isOverdue?'#EF4444':isToday_?'#D97706':'#059669'}}>{timeStr}</div>
          {isOverdue && <div style={{fontSize:9,color:'#EF4444',marginTop:1}}>באיחור</div>}
        </div>
        {lead.phone && (
          <div style={{display:'flex',gap:6}} onClick={e=>e.stopPropagation()}>
            <a href={`tel:${lead.phone}`} className="btn-action call" style={{padding:'5px 10px',fontSize:11,textDecoration:'none'}}>
              <Phone size={11}/>
            </a>
            <a href={wa(lead.phone)} target="_blank" rel="noreferrer" className="btn-action wa" style={{padding:'5px 10px',fontSize:11,textDecoration:'none'}}>
              <MessageCircle size={11}/>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
