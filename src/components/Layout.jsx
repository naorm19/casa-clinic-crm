import { Bell, LayoutDashboard, Users, Sparkles, Settings, X } from 'lucide-react'

const NAV = [
  { id:'dashboard',  label:'דשבורד',    mLabel:'בית',      Icon:LayoutDashboard },
  { id:'leads',      label:'פניות',      mLabel:'פניות',    Icon:Users },
  { id:'reminders',  label:'תזכורות',   mLabel:'תזכורות',  Icon:Bell },
  { id:'treatments', label:'טיפולים',   mLabel:'טיפולים',  Icon:Sparkles },
  { id:'settings',   label:'הגדרות',    mLabel:'הגדרות',   Icon:Settings },
]

export default function Layout({ children, page, onNav, toast, onDismissToast, overdueCount }) {
  return (
    <div className="app-shell">

      {/* ── Sidebar ── */}
      <aside className="sidebar">
        {/* logo */}
        <div style={{padding:'24px 20px 16px',borderBottom:'1px solid var(--border)'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{width:36,height:36,borderRadius:'50%',overflow:'hidden',border:'1.5px solid var(--border-gold)',flexShrink:0}}>
              <img src="/logo.png" alt="Casa Clinic" style={{width:'100%',height:'100%',objectFit:'cover'}} />
            </div>
            <div>
              <div className="playfair" style={{fontSize:15,fontWeight:500,color:'var(--text-1)',letterSpacing:'.01em'}}>Casa Clínic</div>
              <div style={{fontSize:9,letterSpacing:'.2em',color:'var(--text-3)',marginTop:1}}>AESTHETICS</div>
            </div>
          </div>
        </div>

        {/* nav */}
        <nav style={{flex:1,padding:'12px 10px',display:'flex',flexDirection:'column',gap:2}}>
          {NAV.map(({id,label,Icon})=>(
            <button
              key={id}
              className={`nav-item${page===id?' active':''}`}
              onClick={()=>onNav(id)}
            >
              <Icon size={16} className="nav-icon"/>
              <span>{label}</span>
              {id==='reminders' && overdueCount>0 && (
                <span style={{marginRight:'auto',background:'#EF4444',color:'#fff',borderRadius:100,fontSize:10,fontWeight:700,padding:'1px 7px',minWidth:20,textAlign:'center'}}>
                  {overdueCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* footer */}
        <div style={{padding:'16px 20px',borderTop:'1px solid var(--border)'}}>
          <div style={{fontSize:10,color:'var(--text-3)',letterSpacing:'.06em',fontStyle:'italic'}} className="playfair">
            Casa Clínic Aesthetics
          </div>
          <div style={{fontSize:9,color:'var(--text-3)',marginTop:2,opacity:.6}}>מערכת ניהול פניות</div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="main-wrap">
        {/* mobile top bar */}
        <div style={{display:'none',alignItems:'center',justifyContent:'space-between',padding:'16px 18px 0'}} className="mobile-topbar">
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:30,height:30,borderRadius:'50%',overflow:'hidden',border:'1px solid var(--border-gold)'}}>
              <img src="/logo.png" alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} />
            </div>
            <span className="playfair" style={{fontSize:14,color:'var(--text-1)'}}>Casa Clínic</span>
          </div>
          {overdueCount>0 && (
            <div style={{display:'flex',alignItems:'center',gap:5,background:'#FEE2E2',borderRadius:100,padding:'4px 10px',fontSize:11,color:'#991B1B',fontWeight:600}}>
              <Bell size={11}/>{overdueCount}
            </div>
          )}
        </div>

        <div className="page-content">
          {children}
        </div>
      </div>

      {/* ── Bottom nav (mobile) ── */}
      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          {NAV.slice(0,4).map(({id,mLabel,Icon})=>(
            <button
              key={id}
              className={`bottom-nav-btn${page===id?' active':''}`}
              onClick={()=>onNav(id)}
            >
              <Icon size={20}/>
              <span>{mLabel}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* ── Toast ── */}
      {toast && (
        <div className="toast-wrap">
          <div style={{display:'flex',alignItems:'flex-start',gap:12,padding:'14px 18px',background:'rgba(28,26,23,.94)',backdropFilter:'blur(20px)',borderRadius:16,boxShadow:'0 20px 60px rgba(0,0,0,.25)',border:'1px solid rgba(201,169,110,.2)',minWidth:270,maxWidth:340}}>
            <div style={{width:32,height:32,borderRadius:9,background:'rgba(201,169,110,.2)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <Bell size={14} style={{color:'var(--gold)'}}/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:13,color:'#fff',lineHeight:1.3}}>{toast.title}</div>
              <div style={{fontSize:11,color:'rgba(255,255,255,.5)',marginTop:2}}>{toast.body}</div>
            </div>
            <button onClick={onDismissToast} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,.3)',display:'flex',flexShrink:0,padding:0}}>
              <X size={14}/>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
