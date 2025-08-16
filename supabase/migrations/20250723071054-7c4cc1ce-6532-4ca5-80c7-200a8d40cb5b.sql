-- Simple approach to populate initial translations
-- Insert core navigation and content translations

INSERT INTO website_translations (page_path, language_code, content_key, original_text, translated_text, content_type)
VALUES 
-- Navigation items for all languages
('/', 'hi', 'nav_home', 'Home', 'होम', 'navigation'),
('/', 'hi', 'nav_about', 'About Us', 'हमारे बारे में', 'navigation'),
('/', 'hi', 'nav_contact', 'Contact Us', 'संपर्क करें', 'navigation'),
('/', 'hi', 'nav_franchise', 'Become Franchise', 'फ्रेंचाइजी बनें', 'navigation'),
('/', 'hi', 'nav_submit_location', 'Submit ATM Location', 'एटीएम स्थान जमा करें', 'navigation'),
('/', 'hi', 'hero_title', 'Your ATM - Your Income', 'आपका एटीएम - आपकी आय', 'title'),
('/', 'hi', 'cta_get_started', 'Get Started', 'शुरू करें', 'button'),
('/', 'hi', 'form_submit', 'Submit', 'जमा करें', 'button'),

('/', 'bn', 'nav_home', 'Home', 'হোম', 'navigation'),
('/', 'bn', 'nav_about', 'About Us', 'আমাদের সম্পর্কে', 'navigation'),
('/', 'bn', 'nav_contact', 'Contact Us', 'যোগাযোগ করুন', 'navigation'),
('/', 'bn', 'nav_franchise', 'Become Franchise', 'ফ্র্যাঞ্চাইজি হন', 'navigation'),
('/', 'bn', 'hero_title', 'Your ATM - Your Income', 'আপনার এটিএম - আপনার আয়', 'title'),
('/', 'bn', 'cta_get_started', 'Get Started', 'শুরু করুন', 'button'),

('/', 'ta', 'nav_home', 'Home', 'முகப்பு', 'navigation'),
('/', 'ta', 'nav_about', 'About Us', 'எங்களைப் பற்றி', 'navigation'),
('/', 'ta', 'nav_contact', 'Contact Us', 'தொடர்பு கொள்ளுங்கள்', 'navigation'),
('/', 'ta', 'nav_franchise', 'Become Franchise', 'உரிமை பெறுங்கள்', 'navigation'),
('/', 'ta', 'hero_title', 'Your ATM - Your Income', 'உங்கள் ஏடிஎம் - உங்கள் வருமானம்', 'title'),

('/', 'te', 'nav_home', 'Home', 'హోమ్', 'navigation'),
('/', 'te', 'nav_about', 'About Us', 'మా గురించి', 'navigation'),
('/', 'te', 'nav_contact', 'Contact Us', 'మమ్మల్ని సంప్రదించండి', 'navigation'),
('/', 'te', 'nav_franchise', 'Become Franchise', 'ఫ్రాంచైజీ అవ్వండి', 'navigation')

ON CONFLICT (page_path, language_code, content_key) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_website_translations_lookup_fast 
ON website_translations(page_path, language_code, content_key);

CREATE INDEX IF NOT EXISTS idx_website_translations_original_text 
ON website_translations(original_text);

-- Add trigger to automatically update timestamp  
CREATE TRIGGER update_website_translations_updated_at
  BEFORE UPDATE ON website_translations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();