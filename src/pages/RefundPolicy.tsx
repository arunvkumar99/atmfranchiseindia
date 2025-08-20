import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, FileText, Clock, Shield } from "lucide-react";
import { Link } from "@/hooks/useLanguageRouter";
import { useTranslation } from 'react-i18next';

const RefundPolicy = () => {
  const { t } = useTranslation('refund');
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
              {t('hero.title', 'Refund Policy')}
            </h1>
            <p className="font-body text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto animate-fade-in">
              {t('hero.subtitle', 'Transparency and fairness in all our dealings')}
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
                {t('content.intro', 'Welcome to ATM Franchise India')} (<a href="http://www.atmfranchiseindia.in/" className="text-blue-600 hover:text-blue-700">www.atmfranchiseindia.in</a>), {t('content.intro2', 'a registered brand of PixellPay Innovations Pvt Ltd. We value transparency and fairness in all our dealings. This Refund Policy explains the terms under which refunds are processed for payments made on our platform.')}
              </p>

              {/* General Refund Terms */}
              <Card className="border-2 border-blue-100 mb-8">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('content.general_refund_terms', 'General Refund Terms')}</h2>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    {t('sections.general.content', 'We strive to deliver all services as promised in our agreements and contracts. In the event that ATM Franchise India is unable to provide the agreed-upon services as specified in your contract, we will process a full refund of the amount paid, provided that:')}
                  </p>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                      {t('sections.general.point1', 'The failure to provide services is solely attributable to ATM Franchise India.')}
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                      {t('sections.general.point2', 'The refund request is made in writing within the specified period.')}
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                      {t('sections.general.point3', 'The refund will be processed within 60 days of approval.')}
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Customer Withdrawal */}
              <Card className="border-2 border-orange-100 mb-8">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('content.refunds_in_case_of_customer_wi', 'Refunds in Case of Customer Withdrawal')}</h2>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    {t('sections.withdrawal.content', 'If a customer voluntarily decides to withdraw from the service after making payment:')}
                  </p>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                      {t('sections.withdrawal.point1', 'Any GST amount paid on the transaction will be deducted, as this is paid to the government and is non-refundable.')}
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                      {t('sections.withdrawal.point2', 'An additional deduction of ₹10,000 will apply towards registration and administrative charges incurred by the company.')}
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                      {t('sections.withdrawal.point3', 'The balance amount will be refunded as per our processing timelines.')}
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Principal Service Providers */}
              <Card className="border-2 border-purple-100 mb-8">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('content.refunds_where_principal_servic', 'Refunds Where Principal Service Providers Are Involved')}</h2>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    {t('sections.principal.content', 'In cases where services are provided by principal companies or partners (such as RBI-licensed White Label ATM (WLA) operators like TSI Findi, EPS Bancs, Vakrangee, or India One):')}
                  </p>
                  <ul className="space-y-3 text-gray-700 mb-4">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2"></div>
                      {t('sections.principal.point1', 'The responsibility for processing refunds lies directly with those principal companies.')}
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2"></div>
                      {t('sections.principal.point2', 'ATM Franchise India acts as a facilitator and will not be responsible for refunds of amounts paid directly to these principal companies.')}
                    </li>
                  </ul>
                  <p className="text-gray-700">
                    {t('sections.principal.note', 'Customers are encouraged to refer to the refund policies of the respective WLA operators for such transactions.')}
                  </p>
                </CardContent>
              </Card>

              {/* Refund Request Process */}
              <Card className="border-2 border-green-100 mb-8">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('sections.process.title', 'Refund Request Process')}</h2>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    {t('sections.process.intro', 'To initiate a refund request or for any queries related to refunds, please contact:')}
                  </p>
                  <p className="text-gray-700 mb-4">
                    📧 Email: <a href="mailto:support@pixellpay.com" className="text-blue-600 hover:text-blue-700">support@pixellpay.com</a>
                  </p>
                  <p className="text-gray-700 mb-4">{t('sections.process.withInfo', 'All requests must include:')}</p>
                  <ul className="space-y-3 text-gray-700 mb-4">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                      {t('sections.process.item1', 'Full name of the applicant')}
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                      {t('sections.process.item2', 'Payment reference/transaction ID')}
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                      {t('sections.process.item3', 'Service availed')}
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                      {t('sections.process.item4', 'Reason for refund request')}
                    </li>
                  </ul>
                  <p className="text-gray-700">
                    {t('sections.process.review', 'Our team will review your request and respond within a reasonable time frame.')}
                  </p>
                </CardContent>
              </Card>

              {/* Processing Timelines */}
              <Card className="border-2 border-teal-100 mb-8">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('sections.timelines.title', 'Processing Timelines')}</h2>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    {t('sections.timelines.content', 'Approved refunds by ATM Franchise India will be processed within 60 days from the date of approval. Refunds will be credited to the original mode of payment unless otherwise specified.')}
                  </p>
                </CardContent>
              </Card>

              {/* Disclaimer */}
              <Card className="border-2 border-red-100">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('sections.disclaimer.title', 'Disclaimer')}</h2>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    {t('sections.disclaimer.content', 'ATM Franchise India reserves the right to modify this Refund Policy at any time without prior notice. Any changes will be updated on this page. Customers are encouraged to review this policy periodically.')}
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

export default RefundPolicy;