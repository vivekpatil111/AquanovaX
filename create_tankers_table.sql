-- Run this SQL in your Supabase SQL Editor to create the tankers table

CREATE TABLE public.tankers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE NOT NULL,
    registration_number TEXT NOT NULL,
    type TEXT NOT NULL,
    capacity NUMERIC NOT NULL,
    current_load NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.tankers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tankers all access" ON public.tankers FOR ALL USING (auth.role() = 'authenticated');
