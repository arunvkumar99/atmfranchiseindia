import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Link } from "@/hooks/useLanguageRouter";
import { CONTACT_INFO } from "@/lib/contactInfo";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation('common');
  
  const quickLinks = [
    { label: t('quickLinks.home', 'Home'), href: "#home" },
    { label: t('quickLinks.whyAtm', 'Why ATM Business'), href: "#why-atm" },
    { label: t('quickLinks.services', 'Our Services'), href: "#services" },
    { label: t('quickLinks.getStarted', 'Get Started'), href: "#get-started" },
  ];

  const services = [
    t('services.consultation', 'ATM Franchise Consultation'),
    t('services.comparison', 'WLA Operator Comparison'), 
    t('services.evaluation', 'Site Evaluation'),
    t('services.training', 'Training & Support'),
    t('services.marketing', 'Digital Marketing'),
    t('services.technical', 'Technical Assistance')
  ];

  return (
    <footer id="footer" className="bg-foreground text-background py-16" role="contentinfo" tabIndex={-1}>
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="https://via.placeholder.com/150x50/ffffff/333333?text=ATM+Franchise" 
                  alt={t('alt.atm_franchise_india_logo', 'ATM Franchise India Logo')} 
                  className="h-12 w-auto object-contain"
                />
                <div>
                  <h3 className="font-bold text-lg">{t('company.name', 'ATM Franchise India')}</h3>
                  <p className="text-xs text-background/70">{t('company.tagline', 'Trusted Business Partner')}</p>
                </div>
              </div>
              <p className="text-background/80 leading-relaxed">
                {t('company.description', 'Empowering rural entrepreneurs with transparent ATM franchise opportunities. Building passive income streams while serving communities across India.')}
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-background/90">{CONTACT_INFO.phoneFormatted}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-background/90">{CONTACT_INFO.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-background/90">{t('contact.location', 'Bangalore, Karnataka, India')}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">{t('footer.quickLinks', 'Quick Links')}</h4>
            <div className="space-y-3">
              <Link to="/submit-location" className="block text-background/80 hover:text-primary transition-colors">
                {t('footer.submitLocation', 'Submit ATM Location')}
              </Link>
              <Link to="/become-franchise" className="block text-background/80 hover:text-primary transition-colors">
                {t('footer.becomeFranchise', 'Become Franchise')}
              </Link>
              <Link to="/agent" className="block text-background/80 hover:text-primary transition-colors">
                {t('footer.agent', 'Agent')}
              </Link>
              <Link to="/influencer" className="block text-background/80 hover:text-primary transition-colors">
                {t('footer.influencer', 'Influencer')}
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-lg mb-6">{t('footer.ourServices', 'Our Services')}</h4>
            <div className="space-y-3">
              {services.map((service) => (
                <div key={service} className="text-background/80 text-sm">
                  {service}
                </div>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-lg mb-6">{t('footer.legal', 'Legal')}</h4>
            <div className="space-y-3">
              <Link to="/privacy-policy" className="block text-background/80 hover:text-primary transition-colors">
                {t('footer.privacyPolicy', 'Privacy Policy')}
              </Link>
              <Link to="/terms-conditions" className="block text-background/80 hover:text-primary transition-colors">
                {t('footer.termsConditions', 'Terms & Conditions')}
              </Link>
              <Link to="/refund-policy" className="block text-background/80 hover:text-primary transition-colors">
                {t('footer.refundPolicy', 'Refund Policy')}
              </Link>
              <Link to="/accessibility-statement" className="block text-background/80 hover:text-primary transition-colors">
                {t('footer.accessibilityStatement', 'Accessibility Statement')}
              </Link>
            </div>
          </div>
        </div>


        {/* Bottom Footer */}
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-background/70 text-sm font-body">
              {t('copyright', '© 2025 ATM Franchise India. All rights reserved. | RBI Licensed Partners Only')}
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-background/70">
              <Link to="/about-us" className="hover:text-accent transition-colors font-body">{t('footer.aboutUs', 'About Us')}</Link>
              <Link to="/contact-us" className="hover:text-accent transition-colors font-body">{t('footer.contactUs', 'Contact Us')}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;