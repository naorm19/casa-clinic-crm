import { LayoutDashboard, Users, Bell, Calendar, BarChart2, Settings } from 'lucide-react'

const NAV = [
  { id: 'dashboard', label: 'דאשבורד', icon: LayoutDashboard },
  { id: 'leads',     label: 'לידים',   icon: Users },
  { id: 'followups', label: 'מעקב',    icon: Bell },
  { id: 'calendar',  label: 'לוח שנה', icon: Calendar },
  { id: 'analytics', label: 'ניתוח',   icon: BarChart2 },
]

export default function Sidebar({ active, onChange, followUpCount }) {
  return (
    <aside className="glass h-screen w-60 flex flex-col py-6 px-3 border-l border-amber-100 fixed right-0 top-0 z-30">
      {/* Logo */}
      <div className="px-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
            <img src="/logo.png" alt="Casa Clinic" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="serif font-semibold text-base leading-tight" style={{color:'var(--charcoal)'}}>Casa Clínic</div>
            <div className="text-xs tracking-widest" style={{color:'var(--gold)', letterSpacing:'0.2em'}}>AESTHETICS</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`nav-item w-full text-right ${active === id ? 'active' : ''}`}
          >
            <Icon size={16} />
            <span>{label}</span>
            {id === 'followups' && followUpCount > 0 && (
              <span className="mr-auto text-xs font-bold bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                {followUpCount > 9 ? '9+' : followUpCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-2 pt-4 border-t border-amber-100">
        <div className="text-xs text-center text-gray-400 leading-relaxed">
          <span className="serif italic" style={{color:'var(--gold)'}}>Casa Clínic</span><br/>
          CRM System
        </div>
      </div>
    </aside>
  )
}
