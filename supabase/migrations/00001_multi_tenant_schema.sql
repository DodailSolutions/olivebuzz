-- Enums
CREATE TYPE school_plan AS ENUM ('free', 'starter', 'pro', 'enterprise');
CREATE TYPE user_role AS ENUM ('super_admin', 'school_admin', 'teacher', 'content_manager', 'student', 'parent', 'guest');
CREATE TYPE age_tier AS ENUM ('kg_5', 'grade_6_12', 'undergrad', 'postgrad', 'adult');

-- 1. SCHOOLS (Multi-Tenant Hub)
CREATE TABLE public.schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    theme_primary TEXT DEFAULT '#808b47',
    theme_accent TEXT DEFAULT '#f2b239',
    plan school_plan DEFAULT 'free',
    address TEXT,
    city TEXT,
    country TEXT,
    student_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROFILES (Users mapped to Schools)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    role user_role DEFAULT 'student',
    age_tier age_tier DEFAULT 'grade_6_12',
    grade TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. UTILITY FUNCTIONS (For Security Definer RLS checks to prevent infinite recursion)
-- We set search_path to public to ensure SECURITY DEFINER runs safely
CREATE OR REPLACE FUNCTION public.get_auth_school_id()
RETURNS UUID AS $$
  SELECT school_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

-- 4. ENABLE RLS
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. POLICIES: SCHOOLS
CREATE POLICY "Public visitors can view schools"
  ON public.schools FOR SELECT USING (true);
  
CREATE POLICY "Super Admins can manage all schools"
  ON public.schools FOR ALL USING (public.get_auth_role() = 'super_admin');
  
CREATE POLICY "School Admins can update their own school"
  ON public.schools FOR UPDATE USING (id = public.get_auth_school_id() AND public.get_auth_role() = 'school_admin');

CREATE POLICY "Anyone can register a school"
  ON public.schools FOR INSERT WITH CHECK (true);

-- 6. POLICIES: PROFILES (Multi-Tenant Isolation)
CREATE POLICY "Super Admins see all profiles"
  ON public.profiles FOR SELECT USING (public.get_auth_role() = 'super_admin');

CREATE POLICY "Users can view profiles within their own school"
  ON public.profiles FOR SELECT USING (school_id = public.get_auth_school_id());

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (id = auth.uid());

CREATE POLICY "School Admins can update any profile in their school"
  ON public.profiles FOR UPDATE USING (school_id = public.get_auth_school_id() AND public.get_auth_role() = 'school_admin');

-- 7. TRIGGERS: Timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_schools_updated_at
BEFORE UPDATE ON public.schools FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 8. TRIGGERS: Auto-Create Profile via Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  extracted_school_id UUID;
  extracted_role user_role;
  extracted_age_tier age_tier;
BEGIN
  -- Safely extract optional metadata on signup block
  BEGIN
    extracted_school_id := (NEW.raw_user_meta_data->>'school_id')::UUID;
  EXCEPTION WHEN OTHERS THEN
    extracted_school_id := NULL;
  END;
  
  BEGIN
    extracted_role := (NEW.raw_user_meta_data->>'role')::user_role;
  EXCEPTION WHEN OTHERS THEN
    extracted_role := 'student'::user_role;
  END;

  BEGIN
    extracted_age_tier := (NEW.raw_user_meta_data->>'age_tier')::age_tier;
  EXCEPTION WHEN OTHERS THEN
    extracted_age_tier := 'grade_6_12'::age_tier;
  END;

  INSERT INTO public.profiles (id, email, display_name, school_id, role, age_tier, grade)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    extracted_school_id,
    COALESCE(extracted_role, 'student'::user_role),
    COALESCE(extracted_age_tier, 'grade_6_12'::age_tier),
    NEW.raw_user_meta_data->>'grade'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
