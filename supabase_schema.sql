-- Supabase SQL Schema for Irene & Franklin's Wedding RSVP Database

-- 1. Create table
CREATE TABLE IF NOT EXISTS public.rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT,
    attendance TEXT NOT NULL CHECK (attendance IN ('attending', 'declined')),
    dietary_requirements TEXT,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow public anonymous visitors to submit RSVPs (INSERT only)
CREATE POLICY "Allow public RSVP submission" 
ON public.rsvps 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- 4. Policy: Allow service role or authenticated staff to view all RSVPs
CREATE POLICY "Allow service role full access" 
ON public.rsvps 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- 5. Helpful index for sorting by submission date
CREATE INDEX IF NOT EXISTS idx_rsvps_created_at ON public.rsvps (created_at DESC);
