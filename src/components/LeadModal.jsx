import { useState, useEffect } from 'react'
import { X, Star, Phone, Calendar, User, Sparkles, MessageSquare, Tag, AlertCircle, CheckCircle } from 'lucide-react'
import { STATUSES, SOURCES, TREATMENTS, AGENTS, ARRIVAL_OPTIONS } from '../lib/constants'
import { format } from 'date-fns'

const EMPTY = {
  entry_date: format(new Date(), 'yyyy-MM-dd'),
  name: '',
  phone: '',
  treatment: '',
  arrival_confirmed: 'ממתין',
  source: 'אינסטגרם',
  status: 'חדש',
  notes: '',
  follow_up_date: '',
  follow_up_note: '',
  agent: 'רלי',
  is_vip: false
}

export default function LeadModal({ lead, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (lead) {
      setForm({
        ...EMPTY, ...lead,
        entry_date: lead.entry_date || format(new Date(lead.created_at || Date.now()), 'yyyy-MM-dd'),
        follow_up_date: lead.follow_up_date
          ? format(new Date(lead.follow_up_date), "yyyy-MM-dd'T'HH:mm")
          : ''
      })
    }
  }, [lead])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.name.trim()) return alert('שם חובה')
    setSaving(true)
    await onSave({
      ...form,
      follow_up_date: form.follow_up_date ? new Date(form.follow_up_date).toISOString() : null
    })
    setSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="glass slide-in rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-amber-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full btn-gold flex items-center justify-center">
              <User size={18} />
            </div>
            <div>
              <h2 className="serif text-xl font-semibold" style={{color:'var(--charcoal)'}}>
                {lead?.id ? 'עריכת ליד' : 'ליד חדש'}
              </h2>
              <p className="text-xs" style={{color:'rgba(58,54,50,0.5)'}}>Casa Clinic Aesthetics</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => set('is_vip', !form.is_vip)}
              className={`p-2 rounded-full transition-all ${form.is_vip ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-yellow-500'}`}
              title="סמן VIP"
            >
              <Star size={18} fill={form.is_vip ? 'currentColor' : 'none'} />
            </button>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-2 gap-4">

          {/* A — תאריך */}
          <div>
            <label className="block text-xs font-bold mb-1.5" style={{color:'rgba(58,54,50,0.6)', letterSpacing:'0.05em'}}>
              <span className="inline-flex items-center justify-center w-4 h-4 rounded text-white text-[9px] font-bold ml-1.5" style={{background:'var(--gold)'}}>A</span>
              תאריך
            </label>
            <input
              type="date"
              className="w-full px-4 py-2.5 rounded-xl border focus:outline-none text-sm"
              style={{background:'rgba(255,255,255,0.8)', borderColor:'rgba(201,169,110,0.3)'}}
              value={form.entry_date} onChange={e => set('entry_date', e.target.value)}
              dir="ltr"
            />
          </div>

          {/* B — שם מלא */}
          <div>
            <label className="block text-xs font-bold mb-1.5" style={{color:'rgba(58,54,50,0.6)', letterSpacing:'0.05em'}}>
              <span className="inline-flex items-center justify-center w-4 h-4 rounded text-white text-[9px] font-bold ml-1.5" style={{background:'var(--gold)'}}>B</span>
              שם מלא *
            </label>
            <input
              className="w-full px-4 py-2.5 rounded-xl border focus:outline-none text-sm"
              style={{background:'rgba(255,255,255,0.8)', borderColor:'rgba(201,169,110,0.3)'}}
              value={form.name} onChange={e => set('name', e.target.value)}
              placeholder="שם הלקוח/ה"
            />
          </div>

          {/* C — מספר טלפון */}
          <div>
            <label className="block text-xs font-bold mb-1.5" style={{color:'rgba(58,54,50,0.6)', letterSpacing:'0.05em'}}>
              <span className="inline-flex items-center justify-center w-4 h-4 rounded text-white text-[9px] font-bold ml-1.5" style={{background:'var(--gold)'}}>C</span>
              <Phone size={10} className="inline ml-1" />מספר טלפון
            </label>
            <input
              className="w-full px-4 py-2.5 rounded-xl border focus:outline-none text-sm"
              style={{background:'rgba(255,255,255,0.8)', borderColor:'rgba(201,169,110,0.3)'}}
              value={form.phone} onChange={e => set('phone', e.target.value)}
              placeholder="05X-XXXXXXX" dir="ltr"
            />
          </div>

          {/* D — סוג טיפול */}
          <div>
            <label className="block text-xs font-bold mb-1.5" style={{color:'rgba(58,54,50,0.6)', letterSpacing:'0.05em'}}>
              <span className="inline-flex items-center justify-center w-4 h-4 rounded text-white text-[9px] font-bold ml-1.5" style={{background:'var(--gold)'}}>D</span>
              <Sparkles size={10} className="inline ml-1" />סוג טיפול
            </label>
            <select
              className="w-full px-4 py-2.5 rounded-xl border focus:outline-none text-sm"
              style={{background:'rgba(255,255,255,0.8)', borderColor:'rgba(201,169,110,0.3)'}}
              value={form.treatment} onChange={e => set('treatment', e.target.value)}
            >
              <option value="">בחר טיפול...</option>
              {TREATMENTS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* E — אישור הגעה למקום */}
          <div className="col-span-2">
            <label className="block text-xs font-bold mb-2" style={{color:'rgba(58,54,50,0.6)', letterSpacing:'0.05em'}}>
              <span className="inline-flex items-center justify-center w-4 h-4 rounded text-white text-[9px] font-bold ml-1.5" style={{background:'var(--gold)'}}>E</span>
              <CheckCircle size={10} className="inline ml-1" />אישור הגעה למקום
            </label>
            <div className="flex gap-2">
              {ARRIVAL_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => set('arrival_confirmed', opt.id)}
                  className={`flex-1 py-2 px-3 rounded-xl text-sm font-bold transition-all border-2 ${form.arrival_confirmed === opt.id ? 'border-current shadow-sm scale-105' : 'border-transparent opacity-60 hover:opacity-90'}`}
                  style={{background: opt.bg, color: opt.color}}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="col-span-2 flex items-center gap-3">
            <div className="flex-1 h-px" style={{background:'rgba(201,169,110,0.2)'}} />
            <span className="text-xs text-gray-400" style={{letterSpacing:'0.1em'}}>פרטים נוספים</span>
            <div className="flex-1 h-px" style={{background:'rgba(201,169,110,0.2)'}} />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-bold mb-1.5" style={{color:'rgba(58,54,50,0.6)', letterSpacing:'0.05em'}}>סטטוס מעקב</label>
            <div className="flex flex-wrap gap-1.5">
              {STATUSES.map(s => (
                <button
                  key={s.id}
                  onClick={() => set('status', s.id)}
                  className={`status-pill ${s.cls} cursor-pointer transition-all ${form.status === s.id ? 'ring-2 ring-offset-1 scale-105' : 'opacity-50 hover:opacity-80'}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Source + Agent */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-bold mb-1.5" style={{color:'rgba(58,54,50,0.6)', letterSpacing:'0.05em'}}>
                <Tag size={9} className="inline ml-1" />מקור
              </label>
              <select
                className="w-full px-3 py-2.5 rounded-xl border focus:outline-none text-sm"
                style={{background:'rgba(255,255,255,0.8)', borderColor:'rgba(201,169,110,0.3)'}}
                value={form.source} onChange={e => set('source', e.target.value)}
              >
                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold mb-1.5" style={{color:'rgba(58,54,50,0.6)', letterSpacing:'0.05em'}}>
                <User size={9} className="inline ml-1" />נציג
              </label>
              <select
                className="w-full px-3 py-2.5 rounded-xl border focus:outline-none text-sm"
                style={{background:'rgba(255,255,255,0.8)', borderColor:'rgba(201,169,110,0.3)'}}
                value={form.agent} onChange={e => set('agent', e.target.value)}
              >
                {AGENTS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>

          {/* Follow-up reminder */}
          <div className="col-span-2 p-4 rounded-xl" style={{background:'rgba(201,169,110,0.08)', border:'1px solid rgba(201,169,110,0.2)'}}>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={14} style={{color:'var(--gold)'}} />
              <span className="text-xs font-bold" style={{color:'var(--charcoal)', letterSpacing:'0.05em'}}>תזכורת מעקב</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs mb-1 text-gray-500">תאריך ושעה</label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none text-sm"
                  style={{background:'rgba(255,255,255,0.9)', borderColor:'rgba(201,169,110,0.3)'}}
                  value={form.follow_up_date} onChange={e => set('follow_up_date', e.target.value)}
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-xs mb-1 text-gray-500">הערת מעקב</label>
                <input
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none text-sm"
                  style={{background:'rgba(255,255,255,0.9)', borderColor:'rgba(201,169,110,0.3)'}}
                  value={form.follow_up_note} onChange={e => set('follow_up_note', e.target.value)}
                  placeholder="למה לחזור אליה..."
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="col-span-2">
            <label className="block text-xs font-bold mb-1.5" style={{color:'rgba(58,54,50,0.6)', letterSpacing:'0.05em'}}>
              <MessageSquare size={10} className="inline ml-1" />הערות
            </label>
            <textarea
              className="w-full px-4 py-2.5 rounded-xl border focus:outline-none text-sm resize-none"
              style={{background:'rgba(255,255,255,0.8)', borderColor:'rgba(201,169,110,0.3)'}}
              rows={3} value={form.notes} onChange={e => set('notes', e.target.value)}
              placeholder="הערות חופשיות..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-amber-100">
          <button onClick={onClose} className="btn-ghost px-5 py-2 rounded-xl text-sm">ביטול</button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-gold px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-60"
          >
            {saving ? 'שומר...' : lead?.id ? 'עדכן ליד' : 'הוסף ליד'}
          </button>
        </div>
      </div>
    </div>
  )
}
