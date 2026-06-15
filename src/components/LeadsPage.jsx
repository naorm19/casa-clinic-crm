import { useState } from 'react'
import { format, isToday, isPast, isTomorrow } from 'date-fns'
import { he } from 'date-fns/locale'
import { Plus, Search, Phone, MessageCircle, Edit2, Trash2, ChevronDown, Bell, X } from 'lucide-react'

const wa = phone => `https://wa.me/972${(phone||'').replace(/[-\s]/g,'').replace(/^0/,'')}`

function remInfo(iso) {
  if (!iso) return null
  const dt = new Date(iso)
  if (isPast(dt) && !isToday(dt)) return { dot:'rem-red',   tag:'באיחור', text:format(dt,'dd/MM HH:mm',{locale:he}) }
  if (isToday(dt))                return { dot:'rem-amber', tag:'היום',   text:format(dt,'HH:mm',{locale:he}) }
  if (isTomorrow(dt))             return { dot:'rem-green', tag:'מחר',    text:format(dt,'HH:mm',{locale:he}) }
  return                                 { dot:'rem-green', tag:'',       text:format(dt,'dd/MM',{locale:he}) }
}

const FILTER_OPTIONS = [
  { id:'all',           label:'הכל' },
  { id:'active',        label:'פעילות' },
  { id:'ממתין',         label:'ממתין' },
  { id:'אין מענה',      label:'אין מענה' },
  { id:'נקבע ייעוץ',   label:'נקבע ייעוץ' },
  { id:'נסגרה',         label:'נסגרה' },
  { id:'רחוק לה',       label:'רחוק לה 📍' },
  { id:'לא רלוונטי',   label:'לא רלוונטי' },
]

const ACTIVE_STATUSES = ['ממתין','נשלחה הודעה','אין מענה','חזרה אלינו']

export default function LeadsPage({ leads, STATUSES, onAdd, onEdit, onDelete, onSetStatus, USE_DEMO }) {
  const [search,   setSearch]   = useState('')
  const [filter,   setFilter]   = useState('all')
  const [openDrop, setOpenDrop] = useState(null)

  const visible = leads.filter(l => {
    let matchFilter = false
    if (filter === 'all') matchFilter = true
    else if (filter === 'active') matchFilter = ACTIVE_STATUSES.includes(l.status)
    else matchFilter = l.status === filter

    if (!matchFilter) return false
    if (!search) return true
    const q = search.toLowerCase()
    return (
      l.name?.toLowerCase().includes(q) ||
      l.phone?.includes(q) ||
      l.treatment?.toLowerCase().includes(q) ||
      l.area?.toLowerCase().includes(q)
    )
  })

  // cols: date | name | phone | area | status | reminder | actions
  const cols = '100px 1fr 130px 120px 150px 155px 70px'

  return (
    <div className="anim-fade-in">

      {/* ── Page header ── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">פניות</h1>
          <p className="page-subtitle">{leads.length} פניות בסך הכל</p>
        </div>
        <button className="btn-gold" style={{padding:'11px 22px',borderRadius:12,boxShadow:'0 4px 16px rgba(166,124,69,.25)'}} onClick={onAdd}>
          <Plus size={15}/>הוספת פנייה חדשה
        </button>
      </div>

      {USE_DEMO && (
        <div className="demo-badge">מצב הדגמה — חבר Supabase לנתונים אמיתיים</div>
      )}

      {/* ── Toolbar ── */}
      <div style={{display:'flex',gap:12,marginBottom:20,flexWrap:'wrap',alignItems:'center'}}>
        <div className="search-wrap" style={{flex:1,minWidth:200,maxWidth:320}}>
          <Search size={14}/>
          <input
            className="inp search-inp"
            placeholder="חיפוש לפי שם, טלפון, אזור..."
            value={search} onChange={e=>setSearch(e.target.value)}
          />
          {search && (
            <button onClick={()=>setSearch('')} style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--text-3)',display:'flex',padding:0}}>
              <X size={13}/>
            </button>
          )}
        </div>

        <div className="filter-bar">
          {FILTER_OPTIONS.map(f=>(
            <button
              key={f.id}
              className={`filter-pill${filter===f.id?' active':''}`}
              onClick={()=>setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <span style={{fontSize:12,color:'var(--text-3)',fontWeight:400,flexShrink:0}}>
          {visible.length} תוצאות
        </span>
      </div>

      {/* ── DESKTOP TABLE ── */}
      <div className="leads-table">
        <div className="table-head" style={{gridTemplateColumns:cols}}>
          {['תאריך','שם לקוחה','טלפון','אזור','סטטוס פנייה','תזכורת','פעולות'].map((h,i)=>(
            <div key={i} className="table-head-cell">{h}</div>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-title">
              {search ? `לא נמצאה פנייה עבור "${search}"` : 'עדיין לא נכנסו פניות חדשות'}
            </p>
            <p className="empty-state-sub">
              {search ? 'נסי מילות חיפוש אחרות' : 'לחצי על הוספת פנייה חדשה כדי להתחיל'}
            </p>
            {!search && (
              <button className="btn-gold" style={{padding:'11px 24px',borderRadius:12}} onClick={onAdd}>
                <Plus size={14}/>הוספת פנייה ראשונה
              </button>
            )}
          </div>
        ) : visible.map((lead, idx) => {
          const rem  = remInfo(lead.reminder_at)
          const st   = STATUSES.find(s=>s.id===lead.status)||STATUSES[0]
          const isOpen = openDrop === lead.id
          return (
            <div
              key={lead.id}
              className="table-row anim-fade-up"
              style={{gridTemplateColumns:cols,animationDelay:`${idx*40}ms`}}
              onClick={()=>onEdit(lead)}
            >
              {/* תאריך */}
              <div className="table-cell" style={{color:'var(--text-3)',fontSize:12}}>
                {lead.entry_date ? format(new Date(lead.entry_date+'T12:00'),'dd.MM.yy',{locale:he}) : '—'}
              </div>

              {/* שם */}
              <div className="table-cell">
                <div>
                  <div style={{fontWeight:600,fontSize:14,color:'var(--text-1)',lineHeight:1.3}}>{lead.name}</div>
                  {lead.treatment && <div style={{fontSize:11,color:'var(--text-3)',marginTop:1}}>{lead.treatment}</div>}
                </div>
              </div>

              {/* טלפון */}
              <div className="table-cell" onClick={e=>e.stopPropagation()}>
                {lead.phone ? (
                  <div style={{display:'flex',alignItems:'center',gap:6}}>
                    <a href={`tel:${lead.phone}`} style={{fontSize:12,color:'var(--text-2)',textDecoration:'none',direction:'ltr'}}
                       onMouseEnter={e=>e.currentTarget.style.color='var(--gold)'}
                       onMouseLeave={e=>e.currentTarget.style.color='var(--text-2)'}>
                      {lead.phone}
                    </a>
                    <a href={wa(lead.phone)} target="_blank" rel="noreferrer"
                       style={{width:24,height:24,borderRadius:6,background:'#E8F5EE',display:'flex',alignItems:'center',justifyContent:'center',color:'#065F46',textDecoration:'none',flexShrink:0,transition:'background .12s'}}
                       onMouseEnter={e=>e.currentTarget.style.background='#D1FAE5'}
                       onMouseLeave={e=>e.currentTarget.style.background='#E8F5EE'}>
                      <MessageCircle size={12}/>
                    </a>
                  </div>
                ) : <span style={{color:'var(--text-3)',fontSize:13}}>—</span>}
              </div>

              {/* אזור */}
              <div className="table-cell" style={{fontSize:12,color:'var(--text-2)'}}>{lead.area||'—'}</div>

              {/* סטטוס */}
              <div className="table-cell" style={{position:'relative'}} onClick={e=>e.stopPropagation()}>
                <button
                  className={`pill ${st.cls}`}
                  onClick={()=>setOpenDrop(isOpen?null:lead.id)}
                  style={{gap:5}}
                >
                  {st.label}
                  <ChevronDown size={9} style={{opacity:.6,transform:isOpen?'rotate(180deg)':'none',transition:'transform .2s'}}/>
                </button>
                {isOpen && (
                  <>
                    <div style={{position:'fixed',inset:0,zIndex:30}} onClick={()=>setOpenDrop(null)}/>
                    <div className="dropdown-menu anim-scale-in" style={{minWidth:180}}>
                      {['active','progress','done','lost'].map(group => {
                        const groupStatuses = STATUSES.filter(s=>
                          group==='done' ? s.group==='done' :
                          group==='progress' ? s.group==='progress' :
                          s.group===group
                        )
                        if (!groupStatuses.length) return null
                        const groupLabel = group==='active'?'בתהליך':group==='progress'?'קדימה':group==='done'?'הושלם':'לא סגר'
                        return (
                          <div key={group}>
                            <div style={{fontSize:9,fontWeight:700,letterSpacing:'.1em',color:'var(--text-3)',padding:'4px 12px 2px',textTransform:'uppercase'}}>{groupLabel}</div>
                            {groupStatuses.map(opt=>(
                              <button
                                key={opt.id}
                                className="dropdown-item"
                                onClick={()=>{onSetStatus(lead.id,opt.id);setOpenDrop(null)}}
                                style={{fontWeight:lead.status===opt.id?600:400}}
                              >
                                <span className={`pill ${opt.cls}`} style={{padding:'2px 9px',fontSize:10,pointerEvents:'none'}}>{opt.label}</span>
                                {opt.autoReminder && <Bell size={10} style={{color:'var(--gold)',marginRight:'auto'}}/>}
                                {lead.status===opt.id && <span style={{marginRight:'auto',color:'var(--gold)',fontSize:10}}>✓</span>}
                              </button>
                            ))}
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* תזכורת */}
              <div className="table-cell" style={{gap:7}}>
                {rem ? (
                  <>
                    <span className={`rem-dot ${rem.dot}`}/>
                    <div>
                      {rem.tag && <div style={{fontSize:9,fontWeight:700,letterSpacing:'.07em',color:rem.dot==='rem-red'?'#EF4444':rem.dot==='rem-amber'?'#D97706':'#059669',textTransform:'uppercase',lineHeight:1,marginBottom:1}}>{rem.tag}</div>}
                      <div style={{fontSize:11,color:'var(--text-2)',lineHeight:1}}>{rem.text}</div>
                      {lead.reminder_note && <div style={{fontSize:10,color:'var(--text-3)',marginTop:1,maxWidth:120,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{lead.reminder_note}</div>}
                    </div>
                  </>
                ) : <span style={{color:'var(--text-3)',fontSize:12}}>—</span>}
              </div>

              {/* פעולות */}
              <div className="table-cell" style={{gap:4,justifyContent:'center'}} onClick={e=>e.stopPropagation()}>
                <button
                  onClick={()=>onEdit(lead)}
                  style={{width:30,height:30,borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',background:'none',border:'none',cursor:'pointer',color:'var(--text-3)',transition:'all .15s'}}
                  onMouseEnter={e=>{e.currentTarget.style.background='rgba(201,169,110,.12)';e.currentTarget.style.color='var(--gold)'}}
                  onMouseLeave={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color='var(--text-3)'}}
                ><Edit2 size={13}/></button>
                <button
                  onClick={()=>onDelete(lead.id)}
                  style={{width:30,height:30,borderRadius:7,display:'flex',alignItems:'center',justifyContent:'center',background:'none',border:'none',cursor:'pointer',color:'var(--text-3)',transition:'all .15s'}}
                  onMouseEnter={e=>{e.currentTarget.style.background='rgba(239,68,68,.08)';e.currentTarget.style.color='#EF4444'}}
                  onMouseLeave={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color='var(--text-3)'}}
                ><Trash2 size={13}/></button>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── MOBILE CARDS ── */}
      <div className="leads-mobile">
        {visible.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-title">
              {search ? 'לא נמצאה פנייה' : 'עדיין לא נכנסו פניות'}
            </p>
            <button className="btn-gold" style={{padding:'12px 24px',borderRadius:12,marginTop:4}} onClick={onAdd}>
              <Plus size={14}/>הוספת פנייה ראשונה
            </button>
          </div>
        ) : visible.map((lead, idx) => {
          const rem = remInfo(lead.reminder_at)
          const st  = STATUSES.find(s=>s.id===lead.status)||STATUSES[0]
          return (
            <div key={lead.id} className="lead-card-mobile anim-fade-up" style={{animationDelay:`${idx*50}ms`}} onClick={()=>onEdit(lead)}>
              {/* top row */}
              <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:6}}>
                <div>
                  <div style={{fontWeight:700,fontSize:16,color:'var(--text-1)',lineHeight:1.2}}>{lead.name}</div>
                  <div style={{fontSize:11,color:'var(--text-3)',marginTop:2}}>
                    {lead.entry_date ? format(new Date(lead.entry_date+'T12:00'),'dd.MM.yy',{locale:he}) : ''}
                    {lead.area ? ` · ${lead.area}` : ''}
                    {lead.treatment ? ` · ${lead.treatment}` : ''}
                  </div>
                </div>
                <span className={`pill ${st.cls}`} style={{fontSize:10,flexShrink:0}}>{st.label}</span>
              </div>

              {/* reminder strip */}
              {rem && (
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:10,padding:'5px 10px',borderRadius:7,background:rem.dot==='rem-red'?'#FEF2F2':rem.dot==='rem-amber'?'#FFFBEB':'#ECFDF5'}}>
                  <span className={`rem-dot ${rem.dot}`}/>
                  <span style={{fontSize:11,color:'var(--text-2)',fontWeight:500}}>
                    {rem.tag ? `${rem.tag} · ` : ''}{rem.text}
                    {lead.reminder_note ? ` — ${lead.reminder_note}` : ''}
                  </span>
                </div>
              )}

              {/* actions */}
              {lead.phone && (
                <div style={{display:'flex',gap:8,marginTop:4}} onClick={e=>e.stopPropagation()}>
                  <a href={`tel:${lead.phone}`} className="btn-action call" style={{flex:1,justifyContent:'center',padding:'9px 0',fontSize:12,textDecoration:'none'}}>
                    <Phone size={13}/>התקשרי
                  </a>
                  <a href={wa(lead.phone)} target="_blank" rel="noreferrer" className="btn-action wa" style={{flex:1,justifyContent:'center',padding:'9px 0',fontSize:12,textDecoration:'none'}}>
                    <MessageCircle size={13}/>WhatsApp
                  </a>
                  <button className="btn-action edit" style={{flex:0,padding:'9px 14px'}} onClick={()=>onEdit(lead)}>
                    <Edit2 size={13}/>
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

    </div>
  )
}
