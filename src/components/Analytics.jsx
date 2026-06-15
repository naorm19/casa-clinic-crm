import { BarChart2, TrendingUp, Sparkles } from 'lucide-react'
import { STATUSES, SOURCES, TREATMENTS } from '../lib/constants'

export default function Analytics({ leads }) {
  const total = leads.length || 1

  const byStatus = STATUSES.map(s => ({
    ...s,
    count: leads.filter(l => l.status === s.id).length
  }))

  const bySource = SOURCES.map(s => ({
    name: s,
    count: leads.filter(l => l.source === s).length
  })).filter(s => s.count > 0).sort((a, b) => b.count - a.count)

  const byTreatment = TREATMENTS.map(t => ({
    name: t,
    count: leads.filter(l => l.treatment === t).length
  })).filter(t => t.count > 0).sort((a, b) => b.count - a.count)

  const Bar = ({ label, count, total, color }) => (
    <div className="flex items-center gap-3">
      <div className="text-sm w-28 text-right text-gray-600 flex-shrink-0">{label}</div>
      <div className="flex-1 h-6 rounded-full overflow-hidden" style={{background:'rgba(201,169,110,0.1)'}}>
        <div
          className="h-full rounded-full transition-all duration-700 flex items-center pr-2"
          style={{width: `${Math.max((count/total)*100, 2)}%`, background: color || 'var(--gold)'}}
        >
          <span className="text-white text-xs font-bold">{count > 0 ? count : ''}</span>
        </div>
      </div>
      <div className="text-xs text-gray-400 w-8">{Math.round((count/total)*100)}%</div>
    </div>
  )

  return (
    <div className="fade-in">
      <div className="flex items-center gap-3 mb-6">
        <BarChart2 size={20} style={{color:'var(--gold)'}} />
        <h2 className="serif text-2xl" style={{color:'var(--charcoal)'}}>ניתוח לידים</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* By Status */}
        <div className="glass rounded-2xl p-6">
          <h3 className="serif text-lg mb-4" style={{color:'var(--charcoal)'}}>לפי סטטוס</h3>
          <div className="flex flex-col gap-3">
            {byStatus.map(s => (
              <Bar key={s.id} label={s.label} count={s.count} total={total} color={s.color} />
            ))}
          </div>
        </div>

        {/* By Source */}
        <div className="glass rounded-2xl p-6">
          <h3 className="serif text-lg mb-4" style={{color:'var(--charcoal)'}}>לפי מקור</h3>
          {bySource.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">אין מספיק נתונים</p>
          ) : (
            <div className="flex flex-col gap-3">
              {bySource.map(s => (
                <Bar key={s.name} label={s.name} count={s.count} total={total} />
              ))}
            </div>
          )}
        </div>

        {/* By Treatment */}
        <div className="glass rounded-2xl p-6 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} style={{color:'var(--gold)'}} />
            <h3 className="serif text-lg" style={{color:'var(--charcoal)'}}>טיפולים מבוקשים</h3>
          </div>
          {byTreatment.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">אין מספיק נתונים</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {byTreatment.map(t => (
                <Bar key={t.name} label={t.name} count={t.count} total={total} color="#8B9E8A" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Conversion */}
      <div className="glass rounded-2xl p-6 mt-6">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={16} style={{color:'var(--gold)'}} />
          <h3 className="serif text-lg" style={{color:'var(--charcoal)'}}>המרה</h3>
        </div>
        <div className="flex items-end gap-6">
          <div>
            <div className="text-4xl font-bold serif" style={{color:'var(--charcoal)'}}>
              {leads.length > 0 ? Math.round((leads.filter(l=>l.status==='קבע תור').length / leads.length) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-400 mt-1">שיעור המרה כולל</div>
          </div>
          <div className="flex-1 grid grid-cols-3 gap-4">
            {[
              {label:'לידים שנסגרו', val: leads.filter(l=>l.status==='סגרנו').length, color:'#6B7280'},
              {label:'קבעו תור', val: leads.filter(l=>l.status==='קבע תור').length, color:'#10B981'},
              {label:'VIP', val: leads.filter(l=>l.is_vip).length, color:'#8B5CF6'},
            ].map(({label, val, color}) => (
              <div key={label} className="text-center p-3 rounded-xl" style={{background: `${color}10`}}>
                <div className="text-2xl font-bold serif" style={{color}}>{val}</div>
                <div className="text-xs text-gray-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
