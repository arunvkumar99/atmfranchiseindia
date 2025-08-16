-- Trigger initial translation population for all languages
-- This will ensure complete translation coverage

-- First, let's create a function to populate initial translations
CREATE OR REPLACE FUNCTION populate_initial_translations()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    content_item RECORD;
    lang_code TEXT;
    translated_text TEXT;
BEGIN
    -- Core content items that should be translated
    FOR content_item IN 
        SELECT unnest(ARRAY[
            ROW('/', 'nav_home', 'Home', 'navigation'),
            ROW('/', 'nav_about', 'About Us', 'navigation'),
            ROW('/', 'nav_contact', 'Contact Us', 'navigation'),
            ROW('/', 'nav_franchise', 'Become Franchise', 'navigation'),
            ROW('/', 'nav_submit_location', 'Submit ATM Location', 'navigation'),
            ROW('/', 'nav_products', 'Our Products', 'navigation'),
            ROW('/', 'hero_title', 'Your ATM - Your Income', 'title'),
            ROW('/', 'hero_subtitle', 'Start your own ATM franchise business with minimal investment and maximum returns', 'content'),
            ROW('/', 'cta_get_started', 'Get Started', 'button'),
            ROW('/', 'cta_apply_now', 'Apply Now', 'button'),
            ROW('/', 'form_full_name', 'Full Name', 'form_field'),
            ROW('/', 'form_phone', 'Phone Number', 'form_field'),
            ROW('/', 'form_email', 'Email Address', 'form_field'),
            ROW('/', 'form_state', 'State', 'form_field'),
            ROW('/', 'form_city', 'City', 'form_field'),
            ROW('/', 'form_submit', 'Submit', 'button'),
            ROW('/', 'monthly_income', 'Monthly Income', 'content'),
            ROW('/', 'investment_required', 'Investment Required', 'content'),
            ROW('/', 'atm_franchise', 'ATM Franchise', 'content'),
            ROW('/become-franchise', 'hero_title', 'Become an ATM Partner', 'title'),
            ROW('/become-franchise', 'join_partners', 'Join 200+ successful partners', 'content'),
            ROW('/become-franchise', 'profitable_business', 'profitable ATM business', 'content'),
            ROW('/become-franchise', 'minimal_investment', 'minimal investment', 'content'),
            ROW('/contact-us', 'contact_title', 'Get in Touch', 'title'),
            ROW('/contact-us', 'contact_desc', 'Contact our expert team for ATM franchise guidance', 'content'),
            ROW('/contact-us', 'business_hours', 'Business Hours', 'label'),
            ROW('/contact-us', 'response_time', 'Response Time', 'label')
        ]) AS t(page_path, content_key, original_text, content_type)
    LOOP
        -- For each supported language (excluding English)
        FOR lang_code IN 
            SELECT unnest(ARRAY['hi', 'bn', 'ta', 'te', 'mr', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'])
        LOOP
            -- Check if translation already exists
            IF NOT EXISTS (
                SELECT 1 FROM website_translations 
                WHERE page_path = content_item.page_path 
                AND language_code = lang_code 
                AND content_key = content_item.content_key
            ) THEN
                -- Insert placeholder translation (will be updated by the translation function)
                INSERT INTO website_translations (
                    page_path,
                    language_code,
                    content_key,
                    original_text,
                    translated_text,
                    content_type
                ) VALUES (
                    content_item.page_path,
                    lang_code,
                    content_item.content_key,
                    content_item.original_text,
                    content_item.original_text, -- Placeholder, will be updated
                    content_item.content_type
                );
            END IF;
        END LOOP;
    END LOOP;
    
    RAISE NOTICE 'Initial translation placeholders created successfully';
END;
$$;

-- Execute the function to populate initial translations
SELECT populate_initial_translations();

-- Create index for better performance on translation lookups
CREATE INDEX IF NOT EXISTS idx_website_translations_lookup_fast 
ON website_translations(page_path, language_code, content_key);

-- Create index for content updates
CREATE INDEX IF NOT EXISTS idx_website_translations_original_text 
ON website_translations(original_text);

-- Add trigger to automatically update timestamp
CREATE TRIGGER update_website_translations_updated_at
  BEFORE UPDATE ON website_translations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();