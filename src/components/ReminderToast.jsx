import { useEffect, useState } from 'react'
import { Bell, X } from 'lucide-react'
import { format } from 'date-fns'
import { he } from 'date-fns/locale'

export default function ReminderToast({ leads }) {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date()
      const due = leads.filter(l => {
        if (!l.follow_up_date || l.status === 'סגרנו') return false
        const d = new Date(l.follow_up_date)
        const diff = d - now
        return diff >= 0 && diff <= 60000 // within next 1 minute
      })
      due.forEach(l => {
        const key = `reminder-${l.id}-${l.follow_up_date}`
        if (!sessionStorage.getItem(key)) {
          sessionStorage.setItem(key, '1')
          setToasts(prev => [...prev, { id: key, lead: l }])
          // Browser notification
          if (Notification.permission === 'granted') {
            new Notification(`תזכורת - ${l.name}`, {
              body: l.follow_up_note || 'זמן לחזור לליד!',
              icon: '/logo.png'
            })
          }
        }
      })
    }

    checkReminders()
    const interval = setInterval(checkReminders, 30000)
    return () => clearInterval(interval)
  }, [leads])

  const dismiss = id => setToasts(p => p.filter(t => t.id !== id))

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 left-6 flex flex-col gap-3 z-50">
      {toasts.map(({ id, lead }) => (
        <div key={id} className="glass slide-in rounded-2xl p-4 shadow-2xl w-72" style={{borderColor:'rgba(201,169,110,0.4)'}}>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full btn-gold flex items-center justify-center flex-shrink-0 pulse-gold">
              <Bell size={15} />
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm" style={{color:'var(--charcoal)'}}>תזכורת מעקב!</div>
              <div className="text-sm mt-0.5">{lead.name}</div>
              {lead.follow_up_note && (
                <div className="text-xs mt-1 text-gray-500">{lead.follow_up_note}</div>
              )}
              <div className="text-xs mt-1 font-bold" style={{color:'var(--gold)'}}>
                {format(new Date(lead.follow_up_date), 'HH:mm', { locale: he })}
              </div>
            </div>
            <button onClick={() => dismiss(id)} className="text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
