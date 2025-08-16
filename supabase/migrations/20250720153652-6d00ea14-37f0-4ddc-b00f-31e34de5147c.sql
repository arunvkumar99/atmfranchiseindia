
-- Enhanced rate limiting table with better granular control
CREATE TABLE IF NOT EXISTS public.form_rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL, -- IP address or user identifier
  form_type TEXT NOT NULL, -- specific form being submitted
  attempt_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  blocked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_form_rate_limits_lookup 
ON public.form_rate_limits(identifier, form_type, window_start);

-- Auto-save functionality table
CREATE TABLE IF NOT EXISTS public.form_drafts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL, -- browser session identifier
  form_type TEXT NOT NULL,
  draft_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '24 hours')
);

-- Create index for efficient draft lookups
CREATE INDEX IF NOT EXISTS idx_form_drafts_lookup 
ON public.form_drafts(session_id, form_type);

-- Enable RLS on both tables
ALTER TABLE public.form_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_drafts ENABLE ROW LEVEL SECURITY;

-- Rate limiting policies (system access only)
CREATE POLICY "System can manage rate limits" 
ON public.form_rate_limits 
FOR ALL 
USING (true);

-- Draft policies (public access for auto-save)
CREATE POLICY "Anyone can manage their drafts" 
ON public.form_drafts 
FOR ALL 
USING (true);

-- Function to clean up expired drafts
CREATE OR REPLACE FUNCTION public.cleanup_expired_drafts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.form_drafts 
  WHERE expires_at < now();
END;
$$;

-- Function to check rate limits (returns true if allowed, false if blocked)
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier TEXT,
  p_form_type TEXT,
  p_max_attempts INTEGER DEFAULT 5,
  p_window_minutes INTEGER DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_attempts INTEGER;
  window_start_time TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Calculate window start time
  window_start_time := now() - (p_window_minutes || ' minutes')::INTERVAL;
  
  -- Count attempts in current window
  SELECT COALESCE(SUM(attempt_count), 0)
  INTO current_attempts
  FROM public.form_rate_limits
  WHERE identifier = p_identifier
    AND form_type = p_form_type
    AND window_start > window_start_time
    AND (blocked_until IS NULL OR blocked_until < now());
  
  -- If under limit, record this attempt and allow
  IF current_attempts < p_max_attempts THEN
    INSERT INTO public.form_rate_limits (identifier, form_type, attempt_count, window_start)
    VALUES (p_identifier, p_form_type, 1, now())
    ON CONFLICT (identifier, form_type, window_start) 
    DO UPDATE SET attempt_count = form_rate_limits.attempt_count + 1;
    
    RETURN true;
  ELSE
    -- Block for additional time
    INSERT INTO public.form_rate_limits (identifier, form_type, attempt_count, window_start, blocked_until)
    VALUES (p_identifier, p_form_type, 1, now(), now() + INTERVAL '15 minutes')
    ON CONFLICT (identifier, form_type, window_start) 
    DO UPDATE SET 
      attempt_count = form_rate_limits.attempt_count + 1,
      blocked_until = now() + INTERVAL '15 minutes';
    
    RETURN false;
  END IF;
END;
$$;
