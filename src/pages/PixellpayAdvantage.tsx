import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Building2, Shield, TrendingUp, Zap, Award, CreditCard, IndianRupee, ArrowRight } from "lucide-react";
import youngEntrepreneurImage from "@/assets/young-atm-entrepreneur.jpg";
import modernAtmImage from "@/assets/modern-atm-kiosk.jpg";
import { useTranslation } from 'react-i18next';

const PixellpayAdvantage = () => {
  const { t } = useTranslation('pixellpay');
  return (
    <div className="min-h-screen bg-background pt-14">
      {/* Hero Section - Optimized Height */}
      <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-6 animate-fade-in shadow-lg">
              <Building2 className="w-4 h-4" />
              {t('content.powered_by_pixellpay')}
            </div>
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-gray-900 mb-4 leading-tight animate-fade-in">
              <span className="text-blue-600">{t('content.pixellpay', 'PixellPay')}</span> <span className="text-purple-600">{t('content.advantage', 'Advantage')}</span>
            </h1>
            <p className="font-body text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto animate-fade-in mb-6">
              {t('content.comprehensive_atm_franchise_se')}
            </p>
            
            {/* Success Story Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-3xl mx-auto">
              <img 
                src={youngEntrepreneurImage}
                alt={t('alt.young_entrepreneur_succeeding_', 'युवा उद्यमी एटीएम फ्रैंचाइज़ी व्यवसाय में सफलता प्राप्त कर रहा है')}
                className="w-full h-48 md:h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/70 to-purple-600/50 flex items-center justify-center">
                <div className="text-center text-white p-4">
                  <h3 className="text-lg md:text-2xl font-bold mb-2">{t('content.your_success_starts_here')}</h3>
                  <p className="text-sm md:text-base opacity-90">
                    {t('content.join_successful_entrepreneurs_')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Services Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-6 py-3 rounded-full text-sm font-medium mb-6">
                <Building2 className="w-4 h-4" />
                {t('content.atm_franchise_india_your_trust')}
              </div>
              <h2 className="font-heading font-bold text-3xl md:text-5xl text-gray-900 mb-4">
                {t('content.our_key_services')}
              </h2>
              <p className="text-lg text-gray-600 mb-2">
                {t('content.powered_by_pixellpay_partnered')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {/* Google GMB Profile & Location Boosting */}
              <Card className="border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">{t('content.google_gmb_profile_location_boo')}</h3>
                  <p className="text-gray-600 mb-4">{t('content.enhance_your_atm_visibility_an')}</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                      {t('content.creation_of_google_my_business')}
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                      {t('content.location_verification_on_google')}
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                      {t('content.photo_uploads_for_enhanced_visi')}
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                      {t('content.seo_optimization_meta_tagging_t')}
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Settlement Dispute Resolution */}
              <Card className="border-2 border-green-100 hover:border-green-300 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">{t('content.settlement_dispute_resolution')}</h3>
                  <p className="text-gray-600 mb-4">{t('content.smooth_handling_of_operational')}</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                      {t('content.assistance_in_resolving_settlem')}
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                      {t('content.customer_dispute_support_for_fa')}
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Payout Delay & Calculation Discrepancy Support */}
              <Card className="border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">{t('content.payout_delay_calculation_discre')}</h3>
                  <p className="text-gray-600 mb-4">{t('content.ensure_you_receive_your_rightfu')}</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2"></div>
                      {t('content.liaison_with_wla_companies_for')}
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2"></div>
                      {t('content.clarification_and_resolution_of')}
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* ATM & Asset Troubleshooting */}
              <Card className="border-2 border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">{t('content.atm_asset_troubleshooting')}</h3>
                  <p className="text-gray-600 mb-4">{t('content.endtoend_support_for_atm_hardw')}</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                      {t('content.call_log_creation_and_tracking')}
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                      {t('content.assistance_with_escalations_in')}
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2"></div>
                      {t('content.coordination_with_atm_upsbatter')}
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Insurance Claim Settlement Assistance */}
              <Card className="border-2 border-red-100 hover:border-red-300 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">{t('content.insurance_claim_settlement_assi')}</h3>
                  <p className="text-gray-600 mb-4">{t('content.your_backup_during_unforeseen_i')}</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2"></div>
                      {t('content.support_in_case_of_theft_or_ass')}
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2"></div>
                      {t('content.documentation_coordination_with')}
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* 194N TDS Tagging & Compliance */}
              <Card className="border-2 border-indigo-100 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">{t('content.194n_tds_tagging_compliance')}</h3>
                  <p className="text-gray-600 mb-4">{t('content.avoid_unnecessary_tds_deduction')}</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2"></div>
                      {t('content.assistance_with_tds_exemption_t')}
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2"></div>
                      {t('content.monthlyyearly_tds_tagging_with')}
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2"></div>
                      {t('content.facilitation_of_form_194n194_td')}
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Prompt Support */}
              <Card className="border-2 border-cyan-100 hover:border-cyan-300 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">{t('content.prompt_support')}</h3>
                  <p className="text-gray-600 mb-4">{t('content.247_assistance_for_all_your_atm')}</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-2"></div>
                      {t('content.quick_response_to_operational_q')}
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-2"></div>
                      {t('content.realtime_assistance_for_urgent')}
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mt-2"></div>
                      {t('content.dedicated_support_team_for_fran')}
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Settlement Account Opening */}
              <Card className="border-2 border-teal-100 hover:border-teal-300 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">{t('content.settlement_account_opening')}</h3>
                  <p className="text-gray-600 mb-4">{t('content.get_your_atm_current_account_re')}</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2"></div>
                      {t('content.liaising_with_bank_officials_fo')}
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2"></div>
                      {t('content.documentation_and_procedural_su')}
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Why Choose ATM Franchise India - Enhanced with ATM Image */}
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8">
                <h3 className="font-bold text-3xl text-gray-900 mb-4">{t('content.why_choose_atm_franchise_india')}</h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  {t('content.with_deep_expertise_a_vast_supp')}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {t('content.we_help_navigate_the_complex_ba')}
                </p>
              </div>
              <div className="relative">
                <img 
                  src={modernAtmImage}
                  alt={t('alt.modern_atm_representing_busine', 'आधुनिक एटीएम व्यावसायिक अवसर का प्रतिनिधित्व करता है')}
                  className="w-full h-80 object-cover rounded-3xl shadow-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-16">
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-amber-50 to-orange-100">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <ExternalLink className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl text-gray-900 mb-4">{t('content.important_disclaimer')}</h3>
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {t('content.atm_franchise_india_is_an_assis')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PixellpayAdvantage;
