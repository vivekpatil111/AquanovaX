-- Supabase Schema for AquanovaX

-- 1. Create Listings Table
CREATE TABLE public.listings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    quantity_liters NUMERIC NOT NULL CHECK (quantity_liters > 0),
    price_per_liter NUMERIC NOT NULL CHECK (price_per_liter > 0),
    location TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Create Transactions Table
CREATE TABLE public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES public.listings(id) ON DELETE RESTRICT NOT NULL,
    buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    quantity_liters NUMERIC NOT NULL CHECK (quantity_liters > 0),
    total_price NUMERIC NOT NULL CHECK (total_price > 0),
    status TEXT DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Setup Row Level Security (RLS)

-- Enable RLS on all tables
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Listings Policies
-- Anyone can read active listings
CREATE POLICY "Anyone can view active listings" 
ON public.listings FOR SELECT 
USING (is_active = true);

-- Sellers can view all their own listings (even inactive ones)
CREATE POLICY "Sellers can view their own listings" 
ON public.listings FOR SELECT 
USING (auth.uid() = seller_id);

-- Only authenticated users can create listings (seller_id must match their auth uid)
CREATE POLICY "Users can create listings" 
ON public.listings FOR INSERT 
WITH CHECK (auth.uid() = seller_id);

-- Sellers can update their own listings
CREATE POLICY "Sellers can update their own listings" 
ON public.listings FOR UPDATE 
USING (auth.uid() = seller_id);

-- Sellers can delete their own listings
CREATE POLICY "Sellers can delete their own listings" 
ON public.listings FOR DELETE 
USING (auth.uid() = seller_id);


-- Transactions Policies
-- Users can view their own transactions (as either buyer or seller)
CREATE POLICY "Users can view their own transactions" 
ON public.transactions FOR SELECT 
USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Only authenticated users can create a transaction (as a buyer)
CREATE POLICY "Users can create transactions" 
ON public.transactions FOR INSERT 
WITH CHECK (auth.uid() = buyer_id);

-- (Optional) Add a trigger to update 'updated_at' on listings automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_listings_updated_at
    BEFORE UPDATE ON public.listings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
