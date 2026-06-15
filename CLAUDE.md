# Casa Clinic CRM

CRM יוקרתי לקליניקת אסתטיקה — Casa Clínic Aesthetics (לקוחה: רלי מן).

## Stack
- React 19 + Vite 8 + Tailwind CSS v4 (`@tailwindcss/vite`)
- Supabase (מוכן, לא מחובר עדיין) — demo mode כשאין `.env`
- date-fns, lucide-react
- Port: 5176

## הרצה
```bash
cd casa-clinic-crm
npm run dev
```

## מבנה קבצים
```
src/
  App.jsx                    ← routing + data layer (STATUSES, TREATMENTS, DEMO_LEADS)
  index.css                  ← design system (tokens, sidebar, mobile, animations)
  components/
    Layout.jsx               ← sidebar (desktop) + bottom nav (mobile) + toast
    Dashboard.jsx            ← KPI cards + urgent leads + today reminders
    LeadsPage.jsx            ← table (desktop) + cards (mobile) + filters
    LeadDrawer.jsx           ← slide-in for editing/adding leads
    RemindersPage.jsx        ← reminders grouped by urgency
public/
  bg.jpg                     ← תמונת Casa Clinic (שלט + יער ירוק)
  logo.png                   ← לוגו העסק
```

## 5 עמודות מהGoogle Sheet של הלקוחה
A = תאריך | B = שם מלא | C = מספר טלפון | D = סוג טיפול | E = סטטוס הפניה

## סטטוסי פנייה
- ממתין (צהוב)
- אין מענה (כחול) → פותח drawer עם תזכורת אוטומטית
- לא רלוונטי (אדום)
- נסגר (ירוק)

## Design System
- Sidebar: cream (#EFEBE3), טקסט: dark brown (#1C1A17), הדגשות: gold (#C9A96E)
- Playfair Display לכותרות, Inter לגוף
- RTL בכל מקום

## Supabase
טבלה `leads` נדרשת:
```sql
create table leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  entry_date date,
  name text,
  phone text,
  treatment text,
  status text default 'ממתין',
  reminder_at timestamptz,
  reminder_note text
);
```
`.env` נדרש:
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```
