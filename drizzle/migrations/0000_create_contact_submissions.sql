CREATE TABLE public.contact_submissions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
 email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
 topic text NOT NULL CHECK (topic IN ('General enquiry','Opportunity enquiry','Collaboration enquiry','Community interest')),
 message text NOT NULL CHECK (char_length(message) BETWEEN 10 AND 3000),
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.contact_submissions TO service_role;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE INDEX contact_submissions_email_created_idx ON public.contact_submissions (email, created_at DESC);
CREATE TABLE public.contact_rate_limits (bucket text PRIMARY KEY, window_start timestamptz NOT NULL DEFAULT now(), attempts integer NOT NULL DEFAULT 1);
GRANT ALL ON public.contact_rate_limits TO service_role;
ALTER TABLE public.contact_rate_limits ENABLE ROW LEVEL SECURITY;
CREATE FUNCTION public.consume_contact_limit(p_bucket text) RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE n integer;
BEGIN
 INSERT INTO public.contact_rate_limits(bucket) VALUES (p_bucket)
 ON CONFLICT (bucket) DO UPDATE SET attempts = CASE WHEN contact_rate_limits.window_start < now() - interval '1 hour' THEN 1 ELSE contact_rate_limits.attempts + 1 END, window_start = CASE WHEN contact_rate_limits.window_start < now() - interval '1 hour' THEN now() ELSE contact_rate_limits.window_start END
 RETURNING attempts INTO n;
 RETURN n <= 5;
END; $$;
REVOKE ALL ON FUNCTION public.consume_contact_limit(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_contact_limit(text) TO service_role;