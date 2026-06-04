-- AquanovaX Schema V2 - Complete MVP Database

-- 1. Drop existing tables if re-running
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.wallet_transactions CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.tracking CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.suppliers CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;

-- 2. Customers Table
CREATE TABLE public.customers (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    mobile TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    wallet_balance NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Suppliers Table
CREATE TABLE public.suppliers (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    rating NUMERIC DEFAULT 0,
    trust_score NUMERIC DEFAULT 0,
    badge TEXT DEFAULT 'bronze',
    tds NUMERIC,
    ph NUMERIC,
    price NUMERIC NOT NULL,
    eta TEXT,
    coverage_area JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Orders Table
CREATE TABLE public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
    supplier_id UUID REFERENCES public.suppliers(id) ON DELETE RESTRICT NOT NULL,
    quantity NUMERIC NOT NULL,
    amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL,
    delivery_date TIMESTAMP WITH TIME ZONE NOT NULL,
    eta TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tracking Table
CREATE TABLE public.tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL UNIQUE,
    current_status TEXT NOT NULL,
    latitude NUMERIC,
    longitude NUMERIC,
    eta TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Reviews Table
CREATE TABLE public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
    supplier_id UUID REFERENCES public.suppliers(id) ON DELETE CASCADE NOT NULL,
    rating NUMERIC NOT NULL CHECK (rating >= 0 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Wallet Transactions Table
CREATE TABLE public.wallet_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('credit', 'debit', 'refund')),
    amount NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Notifications Table
CREATE TABLE public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' NOT NULL CHECK (status IN ('read', 'unread')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies (For prototype, we will allow all authenticated users to read/write, and secure it later)
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers all access" ON public.customers FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Suppliers all access" ON public.suppliers FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Orders all access" ON public.orders FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE public.tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tracking all access" ON public.tracking FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews all access" ON public.reviews FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Wallet all access" ON public.wallet_transactions FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Notifications all access" ON public.notifications FOR ALL USING (auth.role() = 'authenticated');

-- 9. Tankers Table
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
