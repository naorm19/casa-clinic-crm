import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// SQL to run in Supabase SQL editor:
/*
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  entry_date DATE,                          -- עמודה A: תאריך
  name TEXT NOT NULL,                       -- עמודה B: שם מלא
  phone TEXT,                               -- עמודה C: מספר טלפון
  treatment TEXT,                           -- עמודה D: סוג טיפול
  arrival_confirmed TEXT DEFAULT 'ממתין',   -- עמודה E: אישור הגעה למקום
  status TEXT DEFAULT 'חדש',
  notes TEXT,
  follow_up_date TIMESTAMPTZ,
  follow_up_note TEXT,
  agent TEXT DEFAULT 'רלי',
  source TEXT DEFAULT 'אינסטגרם',
  is_vip BOOLEAN DEFAULT false
);

ALTER PUBLICATION supabase_realtime ADD TABLE leads;
*/
