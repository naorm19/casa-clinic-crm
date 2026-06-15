import { Bell, Phone, Edit2, AlertTriangle } from 'lucide-react'
import { format, isToday, isTomorrow, isPast, differenceInDays } from 'date-fns'
import { he } from 'date-fns/locale'
import { STATUSES } from '../lib/constants'

export default function FollowUpView({ leads, onEdit }) {
  const withFollowUp = leads
    .filter(l => l.follow_up_date && l.status !== 'סגרנו')
    .sort((a, b) => new Date(a.follow_up_date) - new Date(b.follow_up_date))

  const overdue = withFollowUp.filter(l => isPast(new Date(l.follow_up_date)) && !isToday(new Date(l.follow_up_date)))
  const today = withFollowUp.filter(l => isToday(new Date(l.follow_up_date)))
  const tomorrow = withFollowUp.filter(l => isTomorrow(new Date(l.follow_up_date)))
  const upcoming = withFollowUp.filter(l => {
    const d = new Date(l.follow_up_date)
    return !isPast(d) && !isToday(d) && !isTomorrow(d)
  })

  const Group = ({ title, items, accent }) => (
    items.length > 0 && (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px flex-1" style={{background: `linear-gradient(to left, ${accent}30, transparent)`}} />
          <span className="text-xs font-bold px-3 py-1 rounded-full" style={{background: `${accent}15`, color: accent}}>
            {title} ({items.length})
          </span>
          <div className="h-px flex-1" style={{background: `linear-gradient(to right, ${accent}30, transparent)`}} />
        </div>
        <div className="flex flex-col gap-3">
          {items.map(lead => <LeadCard key={lead.id} lead={lead} onEdit={onEdit} accent={accent} />)}
        </div>
      </div>
    )
  )

  return (
    <div className="fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Bell size={20} style={{color:'var(--gold)'}} />
        <h2 className="serif text-2xl" style={{color:'var(--charcoal)'}}>לוח מעקב</h2>
      </div>

      {withFollowUp.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <Bell size={40} className="mx-auto mb-4" style={{color:'var(--gold-light)'}} />
          <p className="serif text-xl" style={{color:'var(--charcoal)'}}>אין תזכורות פעילות</p>
          <p className="text-sm mt-2 text-gray-400">הוסף תזכורת ללידים כדי לעקוב אחריהם</p>
        </div>
      ) : (
        <>
          <Group title="🔴 איחור!" items={overdue} accent="#EF4444" />
          <Group title="⚡ היום" items={today} accent="#F59E0B" />
          <Group title="📅 מחר" items={tomorrow} accent="#3B82F6" />
          <Group title="🕐 בקרוב" items={upcoming} accent="#6B7280" />
        </>
      )}
    </div>
  )
}

function LeadCard({ lead, onEdit, accent }) {
  const status = STATUSES.find(s => s.id === lead.status) || STATUSES[0]
  const d = new Date(lead.follow_up_date)

  return (
    <div className="glass rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className="w-1 h-16 rounded-full flex-shrink-0" style={{background: accent}} />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold" style={{color:'var(--charcoal)'}}>{lead.name}</span>
          <span className={`status-pill ${status.cls}`}>{status.label}</span>
        </div>
        {lead.follow_up_note && (
          <p className="text-sm text-gray-500 mb-1">{lead.follow_up_note}</p>
        )}
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="font-bold" style={{color: accent}}>
            {format(d, "EEEE, d MMMM 'בשעה' HH:mm", { locale: he })}
          </span>
          {lead.treatment && <span>· {lead.treatment}</span>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {lead.phone && (
          <a href={`tel:${lead.phone}`} className="p-2 rounded-xl hover:bg-green-50 text-gray-400 hover:text-green-600 transition-all">
            <Phone size={16} />
          </a>
        )}
        <button onClick={() => onEdit(lead)} className="p-2 rounded-xl hover:bg-amber-50 text-gray-400 hover:text-amber-700 transition-all">
          <Edit2 size={16} />
        </button>
      </div>
    </div>
  )
}
