CREATE TYPE public.app_role AS ENUM ('student','university','admin');
CREATE TYPE public.verify_status AS ENUM ('unverified','pending','verified','rejected');
CREATE TYPE public.cred_status AS ENUM ('pending','verified','revoked');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  school text,
  major text,
  dob date,
  student_code text,
  did text NOT NULL DEFAULT ('did:trustid:0x' || encode(gen_random_bytes(8),'hex')),
  identity_status public.verify_status NOT NULL DEFAULT 'unverified',
  identity_score numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "own profile select" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.has_role(auth.uid(),'university') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE TABLE public.kyc_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  id_doc_path text,
  selfie_path text,
  ai_result jsonb,
  score numeric,
  status public.verify_status NOT NULL DEFAULT 'pending',
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.kyc_submissions TO authenticated;
GRANT ALL ON public.kyc_submissions TO service_role;
ALTER TABLE public.kyc_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "kyc own or staff" ON public.kyc_submissions FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'university') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "kyc insert own" ON public.kyc_submissions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "kyc update own or staff" ON public.kyc_submissions FOR UPDATE TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'university')) WITH CHECK (true);

CREATE TABLE public.credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  cred_type text NOT NULL,
  issuer text NOT NULL,
  issued_at date,
  icon text NOT NULL DEFAULT '📄',
  detail jsonb NOT NULL DEFAULT '{}'::jsonb,
  file_path text,
  status public.cred_status NOT NULL DEFAULT 'pending',
  hash text,
  reviewer_note text,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.credentials TO authenticated;
GRANT ALL ON public.credentials TO service_role;
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cred select" ON public.credentials FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'university') OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "cred insert own" ON public.credentials FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "cred update own pending or staff" ON public.credentials FOR UPDATE TO authenticated USING ((user_id = auth.uid() AND status = 'pending') OR public.has_role(auth.uid(),'university') OR public.has_role(auth.uid(),'admin')) WITH CHECK (true);
CREATE POLICY "cred delete own pending" ON public.credentials FOR DELETE TO authenticated USING (user_id = auth.uid() AND status = 'pending');

CREATE TABLE public.share_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(12),'hex'),
  org text,
  purpose text,
  credential_ids uuid[] NOT NULL DEFAULT '{}',
  fields text[] NOT NULL DEFAULT '{}',
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  revoked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.share_links TO authenticated;
GRANT SELECT ON public.share_links TO anon;
GRANT ALL ON public.share_links TO service_role;
ALTER TABLE public.share_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "share own" ON public.share_links FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "share public by token" ON public.share_links FOR SELECT TO anon USING (revoked = false AND expires_at > now());

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, school, major)
  VALUES (NEW.id, NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'school',
    NEW.raw_user_meta_data->>'major')
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE POLICY "kyc own folder read" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'kyc' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "kyc own folder write" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'kyc' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "cred file read" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'credentials' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(),'university')));
CREATE POLICY "cred file write" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'credentials' AND auth.uid()::text = (storage.foldername(name))[1]);