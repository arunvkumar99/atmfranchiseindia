import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Users, Award, TrendingUp, Shield, Building2, Zap, ArrowRight } from "lucide-react";
import { Link } from "@/hooks/useLanguageRouter";
import { useTranslation } from 'react-i18next';
import vakrangeeLogo from "@/assets/vakrangee-logo.png";
import findiLogo from "@/assets/findi-logo.png";
import WLAOperators from "@/components/WLAOperators";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import { StrategicCrossPageLinks } from "@/components/StrategicCrossPageLinks";
import successfulTeamImage from "@/assets/successful-young-team.jpg";
import modernAtmImage from "@/assets/modern-atm-kiosk.jpg";

const AboutUs = () => {
  const { t } = useTranslation(['common', 'about']);
  return (
    <div className="min-h-screen bg-background pt-24">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-8 animate-fade-in shadow-lg">
              <Building2 className="w-4 h-4" />
              {t('about:hero.badge', 'Trusted Business Partner Since 2020')}
            </div>
            <h1 className="font-heading font-bold text-4xl md:text-6xl text-gray-900 mb-6 leading-tight animate-fade-in">
              {t('about:hero.title.prefix', 'About')} <span className="text-blue-600">{t('about:hero.title.middle', 'ATM Franchise')}</span> <span className="text-purple-600">{t('about:hero.title.suffix', 'India')}</span>
            </h1>
            <p className="font-body text-xl md:text-2xl text-gray-700 leading-relaxed max-w-3xl mx-auto animate-fade-in mb-8">
              {t('about:hero.subtitle', 'Your trusted partner in the ATM franchise business, providing reliable guidance and comprehensive support across India.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-4" onClick={() => document.getElementById('who-we-are')?.scrollIntoView({ behavior: 'smooth' })}>
                <Users className="w-5 h-5 mr-2" />
                {t('about:hero.buttons.expertise', 'Our Expertise')}
              </Button>
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-4" onClick={() => document.getElementById('group-companies')?.scrollIntoView({ behavior: 'smooth' })}>
                <ExternalLink className="w-5 h-5 mr-2" />
                {t('about:hero.buttons.companies', 'Group Companies')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Are Section - Enhanced with Success Image */}
      <section id="who-we-are" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                {t('about:whoWeAre.badge', 'Industry Expertise')}
              </div>
              <h2 className="font-heading font-bold text-3xl md:text-5xl text-gray-900 mb-6">
                {t('about:whoWeAre.heading', 'Who We Are')}
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
                {t('about:whoWeAre.content', 'ATM Franchise India is a leading consultancy specializing in the ATM franchise business. With over 5 years of experience and 200+ successful franchise partnerships across all White Label ATM (WLA) brands, we provide accurate, verified insights into the ATM industry.')}
              </p>
            </div>

            {/* Success Story Image Section */}
            <div className="mb-16">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={successfulTeamImage}
                  alt={t('alt.successful_young_entrepreneurs', 'Successful young entrepreneurs celebrating business achievements')}
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/60 flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <h3 className="text-2xl md:text-4xl font-bold mb-4">{t('content.empowering_young_entrepreneurs', 'Empowering Young Entrepreneurs')}</h3>
                    <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
                      {t('about:whoWeAre.empowering.description', 'Join thousands of successful young Indians who have built thriving businesses with our ATM franchise opportunities')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <Card className="text-center border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group @media (prefers-reduced-motion: reduce) { transition: none; transform: none; }">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">{t('content.expert_team', 'Expert Team')}</h3>
                  <p className="text-gray-600">{t('content.experienced_professionals_with', 'Experienced professionals with deep industry knowledge')}</p>
                </CardContent>
              </Card>

              <Card className="text-center border-2 border-green-100 hover:border-green-300 hover:shadow-xl transition-all duration-300 group @media (prefers-reduced-motion: reduce) { transition: none; transform: none; }">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 min-h-[44px] @media (prefers-reduced-motion: reduce) { transition: none; transform: none; }">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">{t('about:whoWeAre.features.experience.title', '5+ Years Experience')}</h3>
                  <p className="text-gray-600">{t('about:whoWeAre.features.experience.description', '200+ successful franchise partnerships and proven track record')}</p>
                </CardContent>
              </Card>

              <Card className="text-center border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all duration-300 group @media (prefers-reduced-motion: reduce) { transition: none; transform: none; }">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 min-h-[44px] @media (prefers-reduced-motion: reduce) { transition: none; transform: none; }">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">{t('content.proven_results', 'Proven Results')}</h3>
                  <p className="text-gray-600">{t('about:whoWeAre.features.results.description', '95% partner success rate with average ROI in 12-18 months')}</p>
                </CardContent>
              </Card>

              <Card className="text-center border-2 border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all duration-300 group @media (prefers-reduced-motion: reduce) { transition: none; transform: none; }">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 min-h-[44px] @media (prefers-reduced-motion: reduce) { transition: none; transform: none; }">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">{t('content.trusted_guidance', 'Trusted Guidance')}</h3>
                  <p className="text-gray-600">{t('about:whoWeAre.features.guidance.description', '100% transparent with no hidden costs or surprise fees')}</p>
                </CardContent>
              </Card>
            </div>

            {/* ATM Business Opportunity Section */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  {t('about:whoWeAre.path.title', 'Your Path to Financial Independence')}
                </h3>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  {t('about:whoWeAre.path.description', 'As a regulated sector, the ATM business often sees widespread misinformation. Our mission is to cut through the noise and provide reliable, fact-based guidance to help investors make informed franchise decisions.')}
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">{t('content.transparent_business_model', 'Transparent business model')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">{t('content.passive_income_generation', 'Passive income generation')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">{t('content.community_service_opportunity', 'Community service opportunity')}</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img 
                  src={modernAtmImage}
                  alt={t('alt.modern_atm_kiosk_representing_', 'Modern ATM kiosk representing business opportunity')}
                  className="w-full h-80 object-cover rounded-2xl shadow-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Group Companies */}
      <section id="group-companies" className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Building2 className="w-4 h-4" />
              {t('about:groupCompanies.badge', 'Group Companies')}
            </div>
            <h2 className="font-heading font-bold text-3xl md:text-5xl text-gray-900 mb-6">
              {t('about:groupCompanies.title', 'Part of a Trusted Business Group')}
            </h2>
            <p className="font-body text-lg md:text-xl text-gray-600 leading-relaxed">
              {t('about:groupCompanies.subtitle', 'ATM Franchise India is part of a dynamic group of companies focused on financial technology and business solutions.')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* PixellPay Card */}
            <Card className="group bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center relative overflow-hidden">
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <img 
                      src="https://via.placeholder.com/200x80/ffffff/333333?text=PixellPay"
                      alt={t('alt.pixellpay_logo', 'PixellPay Logo')}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <h3 className="font-heading font-bold text-2xl md:text-3xl text-purple-600 mb-4">
                    {t('about:groupCompanies.pixellpay.name', 'PixellPay')}
                  </h3>
                  <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                    {t('about:groupCompanies.pixellpay.badge', 'Payment Solutions')}
                  </div>
                  <p className="font-body text-gray-600 mb-8 leading-relaxed">
                    {t('about:groupCompanies.pixellpay.description', 'Innovative payment solutions and financial technology services designed to simplify digital transactions and enhance financial accessibility.')}
                  </p>
                  <Button asChild className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    <a 
                      href="https://www.pixellpay.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      {t('about:groupCompanies.pixellpay.button', 'Visit PixellPay')}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Evosyz Card */}
            <Card className="group bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center relative overflow-hidden">
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md">
                    <img 
                      src="https://via.placeholder.com/200x80/ffffff/333333?text=Evosyz"
                      alt={t('alt.evosyz_technology_logo', 'Evosyz Technology Logo')}
                      className="w-16 h-10 object-contain"
                    />
                  </div>
                  <h3 className="font-heading font-bold text-2xl md:text-3xl text-blue-600 mb-2">
                    {t('about:groupCompanies.evosyz.name', 'Evosyz')}
                  </h3>
                  <div className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                    {t('about:groupCompanies.evosyz.badge', "South India's Largest ATM Franchise Operator")}
                  </div>
                  <p className="font-body text-gray-600 mb-8 leading-relaxed">
                    {t('about:groupCompanies.evosyz.description', 'Leading ATM franchise operations and business solutions across South India with proven expertise and exceptional track record.')}
                  </p>
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    <a 
                      href="https://www.evosyz.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      {t('about:groupCompanies.evosyz.button', 'Visit Evosyz')}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-2xl mx-auto shadow-lg">
              <h3 className="font-heading font-bold text-2xl text-gray-900 mb-4">
                {t('about:cta.title', 'Ready to Join Our Success Story?')}
              </h3>
              <p className="font-body text-gray-600 mb-6">
                {t('about:cta.subtitle', 'Become part of our trusted network and start your ATM franchise journey today.')}
              </p>
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4" asChild>
                <Link to="/become-franchise">
                  <Users className="w-5 h-5 mr-2" />
                  {t('about:cta.button', 'Get Started Now')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted WLA Partners Section - Redesigned */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-green-200/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-blue-700 px-6 py-3 rounded-full text-sm font-medium mb-6 shadow-lg border border-blue-100">
              <Shield className="w-4 h-4" />
              {t('about:wlaPartners.badge', 'Trusted WLA Network')}
            </div>
            <h2 className="font-heading font-bold text-4xl md:text-5xl text-gray-900 mb-6 leading-tight">
              Our <span className="text-blue-600">{t('content.trusted', 'Trusted')}</span> WLA Partners
            </h2>
            <p className="font-body text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              {t('about:wlaPartners.subtitle', "We collaborate with India's leading White Label ATM operators, each bringing unique strengths and nationwide coverage to provide you with the best franchise opportunities.")}
            </p>
          </div>

          {/* WLA Partner Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
            
            {/* EPS Card */}
            <div className="group bg-white/90 backdrop-blur-sm border border-white/50 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl transform translate-x-8 -translate-y-8"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <img 
                    src="https://via.placeholder.com/200x80/ffffff/333333?text=EPS"
                    alt={t('alt.eps_wla_partner', 'EPS WLA Partner')}
                    className="w-16 h-12 object-contain"
                  />
                </div>
                <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium mb-4 inline-block text-center mx-auto">
                  {t('about:wlaPartners.eps.badge', 'Established WLA Operator')}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t('about:wlaPartners.eps.description', "One of India's pioneering WLA operators with extensive network coverage and proven track record in ATM deployment and management services.")}
                </p>
              </div>
            </div>

            {/* India Card */}
            <div className="group bg-white/90 backdrop-blur-sm border border-white/50 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-xl transform translate-x-8 -translate-y-8"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <img 
                    src="https://via.placeholder.com/200x80/ffffff/333333?text=India1"
                    alt={t('alt.india_wla_partner', 'India WLA Partner')}
                    className="w-16 h-12 object-contain"
                  />
                </div>
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium mb-4 inline-block text-center mx-auto">
                  {t('about:wlaPartners.india.badge', 'National Coverage')}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t('about:wlaPartners.india.description', 'Comprehensive ATM solutions provider focusing on rural and semi-urban markets, bringing banking services to underserved communities across India.')}
                </p>
              </div>
            </div>

            {/* Indicash (TATA) Card */}
            <div className="group bg-white/90 backdrop-blur-sm border border-white/50 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-xl transform translate-x-8 -translate-y-8"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <img 
                    src="https://via.placeholder.com/200x80/ffffff/333333?text=Indicash"
                    alt={t('alt.indicash_tata_product', 'Indicash TATA Product')}
                    className="w-16 h-12 object-contain"
                  />
                </div>
                <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-medium mb-4 inline-block text-center mx-auto">
                  {t('about:wlaPartners.indicash.badge', 'TATA Group Product')}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t('about:wlaPartners.indicash.description', "Backed by TATA Group's legacy of trust and excellence, Indicash offers premium ATM solutions with cutting-edge technology and reliable service infrastructure.")}
                </p>
              </div>
            </div>

            {/* Vakrangee Card */}
            <div className="group bg-white/90 backdrop-blur-sm border border-white/50 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl transform translate-x-8 -translate-y-8"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <img 
                    src={vakrangeeLogo}
                    alt={t('alt.vakrangee_wla_partner', 'Vakrangee WLA Partner')}
                    className="w-16 h-12 object-contain"
                  />
                </div>
                <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium mb-4 inline-block text-center mx-auto">
                  {t('about:wlaPartners.vakrangee.badge', 'Digital Ecosystem Leader')}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t('about:wlaPartners.vakrangee.description', "India's largest network of digital service centers, combining ATM services with comprehensive digital solutions for rural and urban communities.")}
                </p>
              </div>
            </div>

            {/* Findi ATM Card */}
            <div className="group bg-white/90 backdrop-blur-sm border border-white/50 rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 relative overflow-hidden lg:col-span-1 md:col-span-2 lg:col-start-2">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-xl transform translate-x-8 -translate-y-8"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <img 
                    src={findiLogo}
                    alt={t('alt.findi_atm_wla_partner', 'Findi ATM WLA Partner')}
                    className="w-16 h-12 object-contain"
                  />
                </div>
                <div className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs font-medium mb-4 inline-block text-center mx-auto">
                  {t('about:wlaPartners.findi.badge', 'Next-Gen Fintech')}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t('about:wlaPartners.findi.description', 'Modern fintech platform revolutionizing ATM operations with innovative technology, smart analytics, and customer-centric solutions for the digital age.')}
                </p>
              </div>
            </div>
          </div>

          {/* Partnership Benefits */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 max-w-5xl mx-auto shadow-lg border border-white/50">
            <div className="text-center mb-8">
              <h3 className="font-heading font-bold text-2xl md:text-3xl text-gray-900 mb-4">
                {t('about:wlaPartners.whyMatter.title', 'Why Our Partnerships Matter')}
              </h3>
              <p className="text-gray-600 max-w-3xl mx-auto">
                {t('about:wlaPartners.whyMatter.subtitle', 'Our strategic partnerships with leading WLA operators ensure you get access to the best opportunities, technology, and support in the ATM franchise business.')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">{t('content.verified_partners', 'Verified Partners')}</h4>
                <p className="text-gray-600 text-sm">{t('content.all_our_wla_partners_are_rbiap', 'All our WLA partners are RBI-approved and have proven track records')}</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">{t('content.growth_opportunities', 'Growth Opportunities')}</h4>
                <p className="text-gray-600 text-sm">{t('content.access_to_diverse_markets_and_', 'Access to diverse markets and expansion opportunities across India')}</p>
              </div>
              
              <div className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">{t('content.technology_excellence', 'Technology Excellence')}</h4>
                <p className="text-gray-600 text-sm">{t('content.latest_atm_technology_and_digi', 'Latest ATM technology and digital banking solutions for competitive advantage')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <Testimonials />
      
      {/* Strategic Cross Page Links */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <StrategicCrossPageLinks currentPage="about" />
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />
    </div>
  );
};

export default AboutUs;