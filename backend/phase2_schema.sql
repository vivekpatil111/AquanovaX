-- Phase 2 Schema for AquanovaX

-- 1. Password Reset Requests
CREATE TABLE public.password_reset_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    otp_code TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'used')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Modify Suppliers Table (assuming it exists, we will just alter it if we can, 
-- but since we might not have 'suppliers' natively created yet if they used profiles, let's create a supplier_kyc table to be safe)

CREATE TABLE public.supplier_kyc (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    supplier_id UUID NOT NULL,
    business_name TEXT,
    owner_name TEXT,
    gst_verified BOOLEAN DEFAULT false,
    aadhaar_verified BOOLEAN DEFAULT false,
    business_license_verified BOOLEAN DEFAULT false,
    quality_reports_verified BOOLEAN DEFAULT false,
    kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Driver Assignments
CREATE TABLE public.driver_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL,
    driver_id UUID,
    tanker_id UUID,
    status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_transit', 'delivered', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Delivery Tracking
CREATE TABLE public.delivery_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL,
    latitude NUMERIC,
    longitude NUMERIC,
    eta TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Water Quality Reports
CREATE TABLE public.water_quality_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    supplier_id UUID NOT NULL,
    report_url TEXT,
    tds_value NUMERIC,
    ph_value NUMERIC,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Complaints
CREATE TABLE public.complaints (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID NOT NULL,
    supplier_id UUID NOT NULL,
    order_id UUID,
    description TEXT NOT NULL,
    evidence_url TEXT,
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'escalated', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: Ensure you enable RLS and add basic policies if needed. 
-- For MVP, we allow all for now.
ALTER TABLE public.password_reset_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all PR" ON public.password_reset_requests FOR ALL USING (true);

ALTER TABLE public.supplier_kyc ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all KYC" ON public.supplier_kyc FOR ALL USING (true);

ALTER TABLE public.driver_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all DA" ON public.driver_assignments FOR ALL USING (true);

ALTER TABLE public.delivery_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all DT" ON public.delivery_tracking FOR ALL USING (true);

ALTER TABLE public.water_quality_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all WQR" ON public.water_quality_reports FOR ALL USING (true);

ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all Complaints" ON public.complaints FOR ALL USING (true);
