import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, FileText, Shield, Mail } from "lucide-react";
import { Link } from "@/hooks/useLanguageRouter";
import { useTranslation } from 'react-i18next';

const TermsConditions = () => {
  const { t } = useTranslation('terms');
  return (
    <div className="min-h-screen bg-background pt-14">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              {t('hero.backToHome', 'Back to Home')}
            </Link>
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-medium animate-fade-in shadow-lg">
                <FileText className="w-4 h-4" />
                {t('hero.badge', 'Legal Documentation')}
              </div>
            </div>
            <h1 className="font-heading font-bold text-4xl md:text-6xl text-gray-900 mb-6 leading-tight animate-fade-in">
              {t('hero.title', 'Terms & Conditions')}
            </h1>
            <p className="font-body text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto animate-fade-in">
              {t('hero.subtitle', 'Clear guidelines for using our services')}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 mb-8">
                {t('content.intro', 'Welcome to ATM Franchise India. These terms and conditions outline the rules and regulations for the use of our website and services provided by PixellPay Innovations Pvt Ltd.')}
              </p>

              {/* Acceptance of Terms */}
              <Card className="border-2 border-blue-100 mb-8">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('content.acceptance_of_terms', 'Acceptance of Terms')}</h2>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    {t('sections.acceptance.content', 'By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.')}
                  </p>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                      {t('sections.acceptance.point1', 'You must be at least 18 years old to use our services')}
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                      {t('sections.acceptance.point2', 'You agree to provide accurate and complete information')}
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                      {t('sections.acceptance.point3', 'You are responsible for maintaining account confidentiality')}
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Service Terms */}
              <Card className="border-2 border-green-100 mb-8">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('content.service_terms', 'Service Terms')}</h2>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    {t('sections.service.content', 'Our services are provided subject to the following terms and conditions:')}
                  </p>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                      {t('sections.service.point1', 'All franchise agreements are subject to approval')}
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                      {t('sections.service.point2', 'Services are provided through authorized banking partners')}
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                      {t('sections.service.point3', 'Location approval depends on regulatory compliance')}
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Liability and Disclaimers */}
              <Card className="border-2 border-orange-100 mb-8">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('content.liability_and_disclaimers', 'Liability and Disclaimers')}</h2>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    {t('sections.liability.content', 'The following limitations apply to our liability:')}
                  </p>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                      {t('sections.liability.point1', 'Services are provided "as is" without warranties')}
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                      {t('sections.liability.point2', 'We are not liable for indirect or consequential damages')}
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                      {t('sections.liability.point3', 'Maximum liability is limited to amounts paid for services')}
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="border-2 border-red-100">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('content.contact_information', 'Contact Information')}</h2>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    {t('sections.contact.content', 'If you have any questions about these Terms and Conditions, please contact us:')}
                  </p>
                  <div className="space-y-3 text-gray-700 mb-4">
                    <p><strong>{t('content.email', 'Email:')}</strong> <a href="mailto:atmfranchise@pixellpay.com" className="text-blue-600 hover:text-blue-700">atmfranchise@pixellpay.com</a></p>
                    <p><strong>{t('content.phone', 'Phone:')}</strong> <a href="tel:+919072380076" className="text-blue-600 hover:text-blue-700">+91 9072380076</a></p>
                  </div>
                  <p className="text-gray-700">
                    {t('sections.contact.effective', 'These terms and conditions are effective as of July 2025 and may be updated from time to time.')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsConditions;