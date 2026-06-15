# Casa Clinic CRM - Supabase Setup

## Step 1: Create Supabase Project
1. Go to https://supabase.com → New Project
2. Name: "casa-clinic-crm"
3. Copy the **Project URL** and **anon public key**

## Step 2: Create the leads table
In the Supabase SQL Editor, run:

```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  treatment TEXT,
  source TEXT DEFAULT 'אחר',
  status TEXT DEFAULT 'חדש',
  notes TEXT,
  follow_up_date TIMESTAMPTZ,
  follow_up_note TEXT,
  agent TEXT DEFAULT 'רלי',
  is_vip BOOLEAN DEFAULT false
);

ALTER PUBLICATION supabase_realtime ADD TABLE leads;
```

## Step 3: Configure .env
Edit the `.env` file in this folder:
```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Deploy to the web (Vercel - free)
```bash
npm run build
# Then drag the dist/ folder to vercel.com
```
Or use Netlify, GitHub Pages, etc.
