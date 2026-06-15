import { Star, Phone, Edit2, Trash2, Bell, ChevronDown } from 'lucide-react'
import { STATUSES, ARRIVAL_OPTIONS } from '../lib/constants'
import { format, isToday, isPast } from 'date-fns'
import { he } from 'date-fns/locale'

export default function LeadRow({ lead, onEdit, onDelete, onStatusChange, onArrivalChange }) {
  const status = STATUSES.find(s => s.id === lead.status) || STATUSES[0]
  const arrival = ARRIVAL_OPTIONS.find(a => a.id === lead.arrival_confirmed) || ARRIVAL_OPTIONS[0]
  const hasFollowUp = !!lead.follow_up_date
  const followUpDate = hasFollowUp ? new Date(lead.follow_up_date) : null
  const isOverdue = followUpDate && isPast(followUpDate) && lead.status !== 'סגרנו'
  const isDueToday = followUpDate && isToday(followUpDate)

  return (
    <tr className="lead-row border-b border-amber-50 text-sm">

      {/* A — תאריך */}
      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
        {lead.entry_date
          ? format(new Date(lead.entry_date + 'T00:00:00'), 'dd/MM/yy', { locale: he })
          : format(new Date(lead.created_at), 'dd/MM/yy', { locale: he })}
      </td>

      {/* B — שם מלא */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          {lead.is_vip && <Star size={12} className="text-purple-500 fill-current flex-shrink-0" />}
          <span className="font-semibold" style={{color:'var(--charcoal)'}}>{lead.name}</span>
        </div>
      </td>

      {/* C — מספר טלפון */}
      <td className="px-4 py-3">
        {lead.phone ? (
          <a href={`tel:${lead.phone}`} className="flex items-center gap-1 text-gray-500 hover:text-amber-700 transition-colors whitespace-nowrap">
            <Phone size={11} />
            <span dir="ltr">{lead.phone}</span>
          </a>
        ) : <span className="text-gray-300">—</span>}
      </td>

      {/* D — סוג טיפול */}
      <td className="px-4 py-3">
        <span className="text-xs px-2 py-1 rounded-lg bg-amber-50 text-amber-800 whitespace-nowrap">
          {lead.treatment || '—'}
        </span>
      </td>

      {/* E — אישור הגעה */}
      <td className="px-4 py-3">
        <div className="relative group">
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold cursor-pointer whitespace-nowrap"
            style={{background: arrival.bg, color: arrival.color}}
          >
            {arrival.label}
            <ChevronDown size={10} />
          </span>
          <div className="absolute top-8 right-0 hidden group-hover:flex flex-col glass rounded-xl shadow-xl z-20 overflow-hidden py-1 min-w-[110px]">
            {ARRIVAL_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => onArrivalChange(lead.id, opt.id)}
                className="text-right px-3 py-1.5 text-xs hover:bg-amber-50 transition-colors"
                style={{color: opt.color, fontWeight: lead.arrival_confirmed === opt.id ? '700' : '400'}}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </td>

      {/* סטטוס מעקב */}
      <td className="px-4 py-3">
        <div className="relative group">
          <span className={`status-pill ${status.cls} cursor-pointer flex items-center gap-1 whitespace-nowrap`}>
            {status.label}
            <ChevronDown size={9} />
          </span>
          <div className="absolute top-7 right-0 hidden group-hover:flex flex-col glass rounded-xl shadow-xl z-20 min-w-[130px] py-1 overflow-hidden">
            {STATUSES.map(s => (
              <button
                key={s.id}
                onClick={() => onStatusChange(lead.id, s.id)}
                className="text-right px-3 py-2 text-xs hover:bg-amber-50 transition-colors"
              >
                <span className={`status-pill ${s.cls}`}>{s.label}</span>
              </button>
            ))}
          </div>
        </div>
      </td>

      {/* תזכורת מעקב */}
      <td className="px-4 py-3">
        {hasFollowUp ? (
          <div className={`flex items-center gap-1 text-xs rounded-lg px-2 py-1 w-fit whitespace-nowrap ${isOverdue ? 'bg-red-50 text-red-600 font-bold' : isDueToday ? 'bg-amber-50 text-amber-700 font-bold' : 'text-gray-400'}`}>
            <Bell size={10} className={isOverdue || isDueToday ? 'fill-current' : ''} />
            {format(followUpDate, 'dd/MM HH:mm', { locale: he })}
            {isOverdue && ' ⚠️'}
          </div>
        ) : (
          <span className="text-gray-300 text-xs">—</span>
        )}
      </td>

      {/* פעולות */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(lead)}
            className="p-1.5 rounded-lg hover:bg-amber-50 text-gray-400 hover:text-amber-700 transition-all"
            title="עריכה"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={() => onDelete(lead.id)}
            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
            title="מחיקה"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </tr>
  )
}
