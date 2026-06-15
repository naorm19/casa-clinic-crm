export const STATUSES = [
  { id: 'חדש',       label: 'חדש',        cls: 's-new',     color: '#F59E0B' },
  { id: 'יצרנו קשר', label: 'יצרנו קשר',  cls: 's-contact', color: '#3B82F6' },
  { id: 'מעקב',      label: 'מעקב',        cls: 's-follow',  color: '#EF4444' },
  { id: 'קבע תור',   label: 'קבע תור',     cls: 's-booked',  color: '#10B981' },
  { id: 'סגרנו',     label: 'סגרנו',       cls: 's-closed',  color: '#6B7280' },
  { id: 'VIP',       label: 'VIP',         cls: 's-vip',     color: '#8B5CF6' },
]

// עמודה E — אישור הגעה למקום
export const ARRIVAL_OPTIONS = [
  { id: 'ממתין',   label: 'ממתין',   color: '#F59E0B', bg: '#FEF3C7' },
  { id: 'אישר',    label: 'אישר ✓',  color: '#10B981', bg: '#D1FAE5' },
  { id: 'ביטל',   label: 'ביטל ✗',  color: '#EF4444', bg: '#FEE2E2' },
  { id: 'לא ענה', label: 'לא ענה',  color: '#6B7280', bg: '#F3F4F6' },
]

// עמודה D — סוג טיפול
export const TREATMENTS = [
  'בוטוקס', 'פילר', 'הסרת שיער לייזר', 'טיפול פנים', 'מיצוק עור',
  'פילינג כימי', 'RF / אולטראסאונד', 'ביופלסטיה', 'ניקוי עמוק', 'אחר'
]

export const SOURCES = [
  'אינסטגרם', 'פייסבוק', 'וואטסאפ', 'המלצה', 'גוגל', 'TikTok', 'אחר'
]

export const AGENTS = ['רלי', 'נאור', 'אחר']
