-- Add tutorial completion flag to profiles
ALTER TABLE public.profiles ADD COLUMN has_completed_tutorial BOOLEAN DEFAULT false;

-- Create Invitations Table
CREATE TABLE public.invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role user_role NOT NULL,
    token UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    accepted BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + interval '7 days'),
    UNIQUE(school_id, email, role)
);

-- RLS: Security Definer Helper for Invitations
CREATE OR REPLACE FUNCTION public.get_auth_school_id()
RETURNS UUID AS $$
  SELECT school_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

-- Enable RLS
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Policies
-- Admins can manage invitations for their school
CREATE POLICY "Admins can manage school invitations"
  ON public.invitations FOR ALL USING (school_id = public.get_auth_school_id() AND public.get_auth_role() IN ('super_admin', 'school_admin'));

-- Anyone with the token can select (view) the invitation to validate it before signup
CREATE POLICY "Anyone can view their invitation by token"
  ON public.invitations FOR SELECT USING (true); -- Usually restricted by token explicitly in queries

-- Note: During signup, updating the `accepted` flag might be done by a postgres function 
-- or edge function bypassing RLS. We can allow the invited user to update it upon accepting.
CREATE POLICY "Users can accept their own invitation"
  ON public.invitations FOR UPDATE USING (email = current_setting('request.jwt.claims', true)::json->>'email');
