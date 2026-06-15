import { useState, useEffect, useCallback } from 'react'
import { format, isToday, isPast } from 'date-fns'
import { supabase } from './lib/supabase'
import { Sparkles, Settings } from 'lucide-react'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import LeadsPage from './components/LeadsPage'
import LeadDrawer from './components/LeadDrawer'
import RemindersPage from './components/RemindersPage'

/* ─── constants ─── */
export const TREATMENTS = [
  'בוטוקס','פילר / חומצה היאלורונית','ביוסטימולטורים','סקין בוסטר',
  'פולינוקלאוטידים','טיפול שפתיים','טיפול פנים / שיקום עור',
  'הסרת שיער לייזר','פיגמנטציה','Carbon Peel','RF / IPL',
  'מיצוק עור','ניקוי עמוק','אחר',
]

export const STATUSES = [
  // בתהליך
  { id:'ממתין',         label:'ממתין',         cls:'pill-wait',      group:'active',   autoReminder:false },
  { id:'נשלחה הודעה',  label:'נשלחה הודעה',   cls:'pill-sent',      group:'active',   autoReminder:false },
  { id:'אין מענה',     label:'אין מענה',      cls:'pill-silent',    group:'active',   autoReminder:true  },
  { id:'חזרה אלינו',   label:'חזרה אלינו',    cls:'pill-responded', group:'active',   autoReminder:false },
  // קדימה
  { id:'נקבע ייעוץ',   label:'נקבע ייעוץ',    cls:'pill-consult',   group:'progress', autoReminder:false },
  { id:'נקבע טיפול',   label:'נקבע טיפול',    cls:'pill-booked',    group:'progress', autoReminder:false },
  { id:'הגיעה לטיפול', label:'הגיעה לטיפול',  cls:'pill-arrived',   group:'progress', autoReminder:false },
  { id:'נסגרה',        label:'נסגרה ✓',       cls:'pill-yes',       group:'done',     autoReminder:false },
  // לא סגר
  { id:'רחוק לה',      label:'רחוק לה 📍',    cls:'pill-far',       group:'lost',     autoReminder:false },
  { id:'יקר לה',       label:'יקר לה',        cls:'pill-expensive', group:'lost',     autoReminder:false },
  { id:'מתלבטת',       label:'מתלבטת',        cls:'pill-thinking',  group:'lost',     autoReminder:true  },
  { id:'לחזור בהמשך',  label:'לחזור בהמשך',   cls:'pill-later',     group:'lost',     autoReminder:true  },
  { id:'לא רלוונטי',   label:'לא רלוונטי',    cls:'pill-no',        group:'lost',     autoReminder:false },
]

export const AREAS = [
  'נווה אילן','מבשרת ציון','הר אדר','שורש','בית נקופה',
  'קריית יערים','אבו גוש','קריית ענבים','מעלה החמישה',
  'מוצא','בית זית','עין כרם','מערב ירושלים','ירושלים (מרכז)','אחר',
]

export const SOURCES = [
  'Meta (פייסבוק/אינסטגרם)','טיקטוק','המלצה','אחר',
]

export const USE_DEMO = !import.meta.env.VITE_SUPABASE_URL

const d = n => new Date(Date.now()+n*864e5).toISOString().slice(0,10)

const DEMO_LEADS = []

const EMPTY = {
  entry_date: d(0), name:'', phone:'', treatment:'', status:'ממתין',
  source:'Meta (פייסבוק/אינסטגרם)', notes:'', reminder_at:'', reminder_note:'',
}

/* ══════════════════════════════ APP ══ */
export default function App() {
  const [page,     setPage]    = useState('dashboard')
  const [leads,    setLeads]   = useState([])
  const [drawer,   setDrawer]  = useState(null)
  const [form,     setForm]    = useState(EMPTY)
  const [saving,   setSaving]  = useState(false)
  const [toast,    setToast]   = useState(null)

  /* ── load ── */
  const load = useCallback(async () => {
    if (USE_DEMO) { setLeads(DEMO_LEADS); return }
    const { data } = await supabase.from('leads').select('*').order('entry_date',{ascending:false})
    setLeads(data || [])
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    if (USE_DEMO) return
    const ch = supabase.channel('leads')
      .on('postgres_changes',{event:'*',schema:'public',table:'leads'},load)
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [load])

  /* ── notification polling ── */
  useEffect(() => {
    if ('Notification' in window && Notification.permission==='default') Notification.requestPermission()
    const iv = setInterval(() => {
      leads.forEach(l => {
        if (!l.reminder_at) return
        const key = `notif-${l.id}-${l.reminder_at}`
        if (Math.abs(new Date(l.reminder_at)-new Date()) < 30000 && !sessionStorage.getItem(key)) {
          sessionStorage.setItem(key,'1')
          flashToast(`תזכורת — ${l.name}`, l.reminder_note || 'כדאי לחזור אליה עכשיו')
          if (Notification.permission==='granted')
            new Notification(`תזכורת — ${l.name}`, { body: l.reminder_note||'כדאי לחזור אליה עכשיו', icon:'/logo.png' })
        }
      })
    }, 20000)
    return () => clearInterval(iv)
  }, [leads])

  const flashToast = (title, body) => {
    setToast({title,body})
    setTimeout(()=>setToast(null), 5000)
  }

  /* ── drawer ── */
  const openNew  = () => { setForm({...EMPTY}); setDrawer('new') }
  const openEdit = l  => {
    setForm({ ...l, reminder_at: l.reminder_at ? format(new Date(l.reminder_at),"yyyy-MM-dd'T'HH:mm"):'' })
    setDrawer(l)
  }

  /* ── save ── */
  const save = async () => {
    if (!form.name?.trim()) return
    setSaving(true)
    const payload = { ...form, reminder_at: form.reminder_at ? new Date(form.reminder_at).toISOString() : null }
    if (USE_DEMO) {
      drawer==='new'
        ? setLeads(p=>[{...payload, id:Date.now().toString()}, ...p])
        : setLeads(p=>p.map(l=>l.id===form.id ? payload : l))
    } else {
      const { id, ...fields } = payload
      drawer==='new'
        ? await supabase.from('leads').insert([fields])
        : await supabase.from('leads').update(fields).eq('id',id)
      load()
    }
    setSaving(false)
    setDrawer(null)
    flashToast(drawer==='new' ? '✓ פנייה חדשה נשמרה' : '✓ שינויים נשמרו', form.name)
  }

  /* ── delete ── */
  const del = async id => {
    if (!confirm('למחוק פנייה זו?')) return
    if (USE_DEMO) { setLeads(p=>p.filter(l=>l.id!==id)); return }
    await supabase.from('leads').delete().eq('id',id)
    load()
  }

  /* ── setStatus ── */
  const setStatus = (id, status) => {
    setLeads(p=>p.map(l=>l.id===id ? {...l,status} : l))
    if (!USE_DEMO) supabase.from('leads').update({status}).eq('id',id).then(load)
    const st = STATUSES.find(s=>s.id===status)
    if (st?.autoReminder) {
      const lead = leads.find(l=>l.id===id)
      if (lead) {
        const updated = {...lead, status}
        setForm({ ...updated, reminder_at: updated.reminder_at ? format(new Date(updated.reminder_at),"yyyy-MM-dd'T'HH:mm"):'' })
        setDrawer({...updated, _openReminder:true})
      }
    }
  }

  const overdueCount = leads.filter(l =>
    l.reminder_at && isPast(new Date(l.reminder_at)) && !isToday(new Date(l.reminder_at))
  ).length

  /* ── render ── */
  return (
    <Layout page={page} onNav={setPage} toast={toast} onDismissToast={()=>setToast(null)} overdueCount={overdueCount}>

      {page === 'dashboard' && (
        <Dashboard
          leads={leads}
          onAdd={openNew}
          onEdit={openEdit}
          onNav={setPage}
          USE_DEMO={USE_DEMO}
        />
      )}

      {page === 'leads' && (
        <LeadsPage
          leads={leads}
          STATUSES={STATUSES}
          onAdd={openNew}
          onEdit={openEdit}
          onDelete={del}
          onSetStatus={setStatus}
          USE_DEMO={USE_DEMO}
        />
      )}

      {page === 'reminders' && (
        <RemindersPage leads={leads} onEdit={openEdit}/>
      )}

      {page === 'settings' && <DemoScreen icon={<Settings size={28} style={{color:'var(--gold)'}}/>} title="הגדרות" sub="התאמה אישית של המערכת — בקרוב"/>}

      {drawer && (
        <LeadDrawer
          form={form}
          setForm={setForm}
          saving={saving}
          onSave={save}
          onClose={()=>setDrawer(null)}
          isNew={drawer==='new'}
          openReminder={drawer?._openReminder}
          STATUSES={STATUSES}
          TREATMENTS={TREATMENTS}
          AREAS={AREAS}
          SOURCES={SOURCES}
        />
      )}
    </Layout>
  )
}

/* ── Demo placeholder screen ── */
function DemoScreen({ icon, title, sub }) {
  return (
    <div className="anim-fade-in">
      <div className="page-header">
        <h1 className="page-title">{title}</h1>
      </div>
      <div className="demo-screen">
        <div className="demo-screen-icon">{icon}</div>
        <div className="playfair" style={{fontSize:22,color:'var(--text-2)',fontStyle:'italic'}}>{title}</div>
        <p style={{fontSize:14,color:'var(--text-3)',maxWidth:300}}>{sub}</p>
        <div style={{display:'flex',gap:10,marginTop:4}}>
          {[1,2,3].map(i=>(
            <div key={i} style={{width:80,height:100,borderRadius:12,background:'var(--sidebar-bg)',border:'1px solid var(--border)',opacity:.5}}/>
          ))}
        </div>
      </div>
    </div>
  )
}
