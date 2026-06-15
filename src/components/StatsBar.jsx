import { Users, TrendingUp, Bell, CheckCircle } from 'lucide-react'

export default function StatsBar({ leads }) {
  const total = leads.length
  const newLeads = leads.filter(l => l.status === 'חדש').length
  const followUps = leads.filter(l => {
    if (!l.follow_up_date) return false
    return new Date(l.follow_up_date) <= new Date() && l.status !== 'סגרנו'
  }).length
  const booked = leads.filter(l => l.status === 'קבע תור').length
  const convRate = total > 0 ? Math.round((booked / total) * 100) : 0

  const cards = [
    { label: 'סה"כ לידים', value: total, icon: Users, color: '#C9A96E', bg: 'rgba(201,169,110,0.1)' },
    { label: 'לידים חדשים', value: newLeads, icon: TrendingUp, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
    { label: 'מעקב דחוף', value: followUps, icon: Bell, color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
    { label: 'קבעו תור', value: booked, icon: CheckCircle, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {cards.map(({ label, value, icon: Icon, color, bg }) => (
        <div key={label} className="glass rounded-2xl p-4 fade-in">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background: bg}}>
              <Icon size={16} style={{color}} />
            </div>
            {label === 'מעקב דחוף' && value > 0 && (
              <span className="text-xs font-bold text-red-500 pulse-gold bg-red-50 px-2 py-0.5 rounded-full">דחוף!</span>
            )}
          </div>
          <div className="text-2xl font-bold serif" style={{color: 'var(--charcoal)'}}>{value}</div>
          <div className="text-xs mt-0.5" style={{color: 'rgba(58,54,50,0.55)'}}>{label}</div>
          {label === 'קבעו תור' && (
            <div className="text-xs mt-1 font-bold" style={{color: '#10B981'}}>{convRate}% המרה</div>
          )}
        </div>
      ))}
    </div>
  )
}
