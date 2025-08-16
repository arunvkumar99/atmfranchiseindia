-- Create tables for all forms in the application

-- 1. Agent onboarding submissions
CREATE TABLE public.agent_submissions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    gender TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    phone TEXT NOT NULL,
    whatsapp_phone TEXT NOT NULL,
    email TEXT NOT NULL,
    pan_number TEXT NOT NULL,
    pan_document_url TEXT,
    aadhaar_number TEXT NOT NULL,
    aadhaar_front_url TEXT,
    aadhaar_back_url TEXT,
    permanent_address TEXT NOT NULL,
    current_address TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    photo_url TEXT,
    joining_as TEXT NOT NULL,
    why_join TEXT NOT NULL,
    languages TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Influencer onboarding submissions
CREATE TABLE public.influencer_submissions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    gender TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    phone TEXT NOT NULL,
    whatsapp_phone TEXT NOT NULL,
    email TEXT NOT NULL,
    pan_number TEXT NOT NULL,
    pan_document_url TEXT,
    aadhaar_number TEXT NOT NULL,
    aadhaar_front_url TEXT,
    aadhaar_back_url TEXT,
    permanent_address TEXT NOT NULL,
    current_address TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    photo_url TEXT,
    facebook_link TEXT NOT NULL,
    instagram_link TEXT NOT NULL,
    youtube_link TEXT NOT NULL,
    linkedin_link TEXT,
    other_channel_1 TEXT,
    other_channel_2 TEXT,
    languages TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Contact us submissions
CREATE TABLE public.contact_submissions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. ATM enquiry submissions (StartATM page)
CREATE TABLE public.atm_enquiry_submissions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    email TEXT,
    state TEXT NOT NULL,
    enquiry_purpose TEXT NOT NULL,
    occupation TEXT NOT NULL,
    has_own_space TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. Get started submissions
CREATE TABLE public.get_started_submissions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    location TEXT NOT NULL,
    investment TEXT NOT NULL,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. ATM franchise application submissions
CREATE TABLE public.franchise_applications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    alternate_phone TEXT,
    date_of_birth DATE NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    business_type TEXT NOT NULL,
    experience_years TEXT NOT NULL,
    current_occupation TEXT NOT NULL,
    monthly_income TEXT NOT NULL,
    net_worth TEXT NOT NULL,
    investment_budget TEXT NOT NULL,
    funding_source TEXT NOT NULL,
    credit_score TEXT NOT NULL,
    preferred_location TEXT NOT NULL,
    space_availability TEXT NOT NULL,
    space_size TEXT NOT NULL,
    additional_info TEXT,
    agreed_to_terms BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. Location submission for survey
CREATE TABLE public.location_submissions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp_phone TEXT NOT NULL,
    email TEXT NOT NULL,
    state TEXT NOT NULL,
    city TEXT NOT NULL,
    location_type TEXT NOT NULL,
    location_description TEXT NOT NULL,
    monthly_footfall TEXT NOT NULL,
    nearby_competition TEXT NOT NULL,
    space_ownership TEXT NOT NULL,
    space_size TEXT NOT NULL,
    monthly_rent TEXT,
    security_deposit TEXT,
    additional_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security for all tables
ALTER TABLE public.agent_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencer_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.atm_enquiry_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.get_started_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchise_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for all tables (allow anonymous inserts for form submissions)
-- This allows public form submissions without authentication

CREATE POLICY "Allow anonymous inserts" ON public.agent_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous inserts" ON public.influencer_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous inserts" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous inserts" ON public.atm_enquiry_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous inserts" ON public.get_started_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous inserts" ON public.franchise_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous inserts" ON public.location_submissions FOR INSERT WITH CHECK (true);

-- For admin access to view data (when authentication is added later)
CREATE POLICY "Admin can view all" ON public.agent_submissions FOR SELECT USING (false); -- Will be updated when admin system is implemented
CREATE POLICY "Admin can view all" ON public.influencer_submissions FOR SELECT USING (false);
CREATE POLICY "Admin can view all" ON public.contact_submissions FOR SELECT USING (false);
CREATE POLICY "Admin can view all" ON public.atm_enquiry_submissions FOR SELECT USING (false);
CREATE POLICY "Admin can view all" ON public.get_started_submissions FOR SELECT USING (false);
CREATE POLICY "Admin can view all" ON public.franchise_applications FOR SELECT USING (false);
CREATE POLICY "Admin can view all" ON public.location_submissions FOR SELECT USING (false);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates on tables that have updated_at column
CREATE TRIGGER update_agent_submissions_updated_at
    BEFORE UPDATE ON public.agent_submissions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_influencer_submissions_updated_at
    BEFORE UPDATE ON public.influencer_submissions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_franchise_applications_updated_at
    BEFORE UPDATE ON public.franchise_applications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();