
import { DirectSheetsForm } from "@/components/DirectSheetsForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin } from "lucide-react";
import { CONTACT_INFO } from "@/lib/contactInfo";
import { useTranslation } from 'react-i18next';

const ContactUs = () => {
  const { t } = useTranslation(['contact', 'common']);
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('contact:title', 'Get in Touch')}
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-blue-600" />
                    {t('contact:phone.title', 'Phone')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">{CONTACT_INFO.phone}</p>
                  <p className="text-sm text-gray-600">{t('contact:phone.hours', 'Mon-Sat: 9 AM - 6 PM IST')}</p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                    {t('contact:email.title', 'Email')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">{CONTACT_INFO.email}</p>
                  <p className="text-sm text-gray-600">{t('contact:email.response', 'We reply within 24 hours')}</p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    {t('contact:office.title', 'Office Address')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{CONTACT_INFO.address}</p>
                </CardContent>
              </Card>

              {/* Trust Badges */}
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">100%</div>
                  <div className="text-xs text-gray-600">{t('content.secure', 'Secure')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">24hr</div>
                  <div className="text-xs text-gray-600">{t('content.response', 'Response')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">200+</div>
                  <div className="text-xs text-gray-600">{t('content.happy_clients', 'Happy Clients')}</div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <DirectSheetsForm
                  formType="contact_submissions"
                  title={t('titles.send_us_a_message', 'Send us a Message')}
                  description="Fill out the form below and we'll get back to you within 24 hours."
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
