-- Create function to get translation statistics
CREATE OR REPLACE FUNCTION public.get_translation_stats()
RETURNS TABLE (
  language_code text,
  total_count bigint,
  completed_count bigint
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    wt.language_code,
    COUNT(*) as total_count,
    COUNT(wt.translated_text) as completed_count
  FROM public.website_translations wt
  WHERE wt.language_code != 'en'
  GROUP BY wt.language_code
  ORDER BY wt.language_code;
$function$;