import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Eye, Ear, Hand, Brain, Monitor, Accessibility } from "lucide-react";
import { Link } from "@/hooks/useLanguageRouter";
import { useTranslation } from 'react-i18next';

const AccessibilityStatement = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-background pt-14">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-medium animate-fade-in shadow-lg">
                <Accessibility className="w-4 h-4" />
                Accessibility Commitment
              </div>
            </div>
            <h1 className="font-heading font-bold text-4xl md:text-6xl text-gray-900 mb-6 leading-tight animate-fade-in">
              Accessibility Statement
            </h1>
            <p className="font-body text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto animate-fade-in">
              Making ATM Franchise opportunities accessible to everyone
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
                ATM Franchise India is committed to ensuring digital accessibility for people with disabilities. We are continuously improving the user experience for everyone and applying the relevant accessibility standards.
              </p>

              {/* Web Accessibility */}
              <Card className="border-2 border-blue-100 mb-8">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Monitor className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('content.web_accessibility', 'Web Accessibility')}</h2>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    Our website is designed to be compatible with assistive technologies and follows Web Content Accessibility Guidelines (WCAG) 2.1 standards.
                  </p>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                      Keyboard navigation support for all interactive elements
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                      Screen reader compatibility with proper heading structure
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                      High contrast color schemes for better visibility
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                      Alternative text for all images and graphics
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Visual Accessibility */}
              <Card className="border-2 border-green-100 mb-8">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('content.visual_accessibility', 'Visual Accessibility')}</h2>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    We understand that visual impairments can affect how people interact with our platform:
                  </p>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                      Large, readable fonts throughout the website
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                      Sufficient color contrast ratios meeting WCAG standards
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                      Information conveyed through means other than color alone
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                      Scalable text that can be enlarged up to 200% without loss of functionality
                    </li>
                  </ul>
                </CardContent>
               </Card>

               {/* Motor and Cognitive Accessibility */}
               <Card className="border-2 border-orange-100 mb-8">
                 <CardContent className="p-8">
                   <div className="flex items-start gap-4 mb-6">
                     <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                       <Hand className="w-6 h-6 text-white" />
                     </div>
                     <div>
                       <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('content.motor_and_cognitive_accessibil', 'Motor and Cognitive Accessibility')}</h2>
                     </div>
                   </div>
                   <p className="text-gray-700 mb-4">
                     We design our interface to be usable by people with various motor and cognitive abilities:
                   </p>
                   <ul className="space-y-3 text-gray-700">
                     <li className="flex items-start gap-2">
                       <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                       Large click targets for easier interaction
                     </li>
                     <li className="flex items-start gap-2">
                       <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                       Simple and clear navigation structure
                     </li>
                     <li className="flex items-start gap-2">
                       <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                       Consistent layout and design patterns
                     </li>
                     <li className="flex items-start gap-2">
                       <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                       Clear and simple language throughout
                     </li>
                   </ul>
                 </CardContent>
               </Card>

               {/* Hearing Accessibility */}
               <Card className="border-2 border-purple-100 mb-8">
                 <CardContent className="p-8">
                   <div className="flex items-start gap-4 mb-6">
                     <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                       <Ear className="w-6 h-6 text-white" />
                     </div>
                     <div>
                       <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('content.hearing_accessibility', 'Hearing Accessibility')}</h2>
                     </div>
                   </div>
                   <p className="text-gray-700 mb-4">
                     Our platform is designed to be fully accessible for users with hearing impairments:
                   </p>
                   <ul className="space-y-3 text-gray-700">
                     <li className="flex items-start gap-2">
                       <div className="w-1.5 h-1.5 bg-purple-500 rounded-fulld4d mt-2"></div>
                       Visual indicators for all audio cues
                     </li>
                     <li className="flex items-start gap-2">
                       <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2"></div>
                       Text-based alternatives for audio content
                     </li>
                     <li className="flex items-start gap-2">
                       <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2"></div>
                       Multiple contact methods available
                     </li>
                    </ul>
                  </CardContent>
                </Card>

              {/* Contact and Feedback */}
              <Card className="border-2 border-red-100">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                      <Accessibility className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('content.feedback_and_support', 'Feedback and Support')}</h2>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    We welcome your feedback on the accessibility of ATM Franchise India. Please let us know if you encounter accessibility barriers:
                  </p>
                  <div className="space-y-3 text-gray-700 mb-4">
                    <p><strong>{t('content.email', 'Email:')}</strong> <a href="mailto:atmfranchise@pixellpay.com" className="text-blue-600 hover:text-blue-700">atmfranchise@pixellpay.com</a></p>
                    <p><strong>{t('content.phone', 'Phone:')}</strong> <a href="tel:+919072380076" className="text-blue-600 hover:text-blue-700">+91 9072380076</a></p>
                  </div>
                  <p className="text-gray-700">
                    We try to respond to accessibility feedback within 5 business days.
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

export default AccessibilityStatement;