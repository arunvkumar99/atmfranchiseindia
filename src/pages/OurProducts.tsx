import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Phone, Mail, Globe, Package, MapPin, TrendingUp, Shield, Users, Star, ArrowRight, Zap, Award, Target, Sparkles, Clock, MoveRight, PhoneCall, Search, Briefcase, CreditCard, AlertCircle, FileText, Wrench, Building } from "lucide-react";
import { Link } from "@/hooks/useLanguageRouter";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from 'react-i18next';

const OurProducts = () => {
  const { t } = useTranslation('products');
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => [
      t('hero.titles.solutions', 'Solutions'),
      t('hero.titles.advantage', 'Advantage'), 
      t('hero.titles.products', 'Products'),
      t('hero.titles.success', 'Success'),
      t('hero.titles.excellence', 'Excellence')
    ],
    [t]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  const wlaPartners = [
    {
      name: t('partners.vakrangee.name', 'Vakrangee'),
      logo: "/assets/Vakrangee_Limited_Logo.png",
      tagline: t('partners.vakrangee.tagline', 'Market Leader')
    },
    {
      name: t('partners.findi.name', 'Findi'),
      logo: "/assets/findi.png",
      tagline: t('partners.findi.tagline', 'Fast Growing')
    },
    {
      name: t('partners.indiaone.name', 'India One'),
      logo: "/assets/India1Logo.jpg",
      tagline: t('partners.indiaone.tagline', 'Reliable Network')
    },
    {
      name: t('partners.eps.name', 'EPS Bancs'),
      logo: "/assets/EPS.png",
      tagline: t('partners.eps.tagline', 'Proven Track Record')
    }
  ];

  const care360Features = [
    { icon: Globe, text: t('care360.features.gmb', '🎯 Google GMB Profile & Location Boosting') },
    { icon: Shield, text: t('care360.features.settlement', '⚖️ Settlement Dispute Resolution') },
    { icon: CreditCard, text: t('care360.features.payout', '💰 Payout Delay & Discrepancy Handling') },
    { icon: Wrench, text: t('care360.features.troubleshooting', '🔧 ATM & Asset Troubleshooting') },
    { icon: FileText, text: t('care360.features.insurance', '🛡️ Insurance Claim Filing & Follow-up') },
    { icon: Briefcase, text: t('care360.features.tax', '📊 194N TDS Tagging & Tax Compliance') },
    { icon: Zap, text: t('care360.features.support', '⚡ Fast-Response Support Team') },
    { icon: Building, text: t('care360.features.account', '🏦 Assistance with Settlement Account Opening') }
  ];

  const visibilityFeatures = [
    { icon: Search, text: t('visibility.features.0', 'Google My Business Creation & Verification') },
    { icon: Target, text: t('visibility.features.1', 'Professional Business Profile Optimization') },
    { icon: MapPin, text: t('visibility.features.2', 'Maps & Search Tagging for High Visibility') },
    { icon: TrendingUp, text: t('visibility.features.3', 'Local SEO Optimization') },
    { icon: Award, text: t('visibility.features.4', 'Monthly Performance Insights') }
  ];

  return (
    <div className="min-h-screen bg-background pt-24">
      {/* Modern Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto text-center py-24">
            <motion.div 
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full text-sm font-medium mb-8 shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
              {t('hero.badge', 'Premium Business Solutions')}
              <Package className="w-5 h-5 text-purple-400 animate-pulse delay-500" />
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <motion.span className="block text-white">
                {t('hero.title.main', 'ATM Business')}
              </motion.span>
              <motion.div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                {titles[titleNumber]}
              </motion.div>
            </h1>
            
            <motion.p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-12">
              {t('hero.subtitle', 'Transform your entrepreneurial dreams into reality with our comprehensive ATM franchise solutions. Experience the perfect blend of technology, support, and profitability.')}
            </motion.p>

            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <ArrowRight className="mr-2" />
                {t('hero.buttons.explore', 'Explore Solutions')}
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10" asChild>
                <Link to="/become-franchise">
                  <PhoneCall className="mr-2" />
                  {t('hero.buttons.franchise', 'Become Franchise')}
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-8 justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{t('hero.stats.partners.value', '4+')}</div>
                <div className="text-sm text-blue-200">{t('hero.stats.partners.label', 'WLA Partners')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{t('hero.stats.care360.value', '₹30K')}</div>
                <div className="text-sm text-purple-200">{t('hero.stats.care360.label', 'Care360 Value')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{t('hero.stats.visibility.value', '₹3K')}</div>
                <div className="text-sm text-green-200">{t('hero.stats.visibility.label', 'Visibility Boost')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WLA ATMs Partnership Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-900 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Shield className="w-4 h-4" />
                  {t('partners.badge', 'Premium Partnership Network')}
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="text-slate-900">{t('partners.title.part1', 'WLA ATMs')}</span>{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {t('partners.title.part2', 'Partnership')}
                  </span>
                </h2>
                <p className="text-xl text-slate-600 mb-8">
                  {t('partners.description', "Access India's most trusted White Label ATM operators through our exclusive partnership network. Choose from multiple operators based on your location and investment preferences.")}
                </p>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-white p-4 rounded-xl shadow-lg">
                    <div className="text-3xl font-bold text-blue-600">{t('partners.stats.roi.value', '12-18')}</div>
                    <div className="text-sm text-slate-600">{t('partners.stats.roi.label', 'Months ROI')}</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-lg">
                    <div className="text-3xl font-bold text-green-600">{t('partners.stats.income.value', '₹15K+')}</div>
                    <div className="text-sm text-slate-600">{t('partners.stats.income.label', 'Monthly Income')}</div>
                  </div>
                </div>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600" asChild>
                  <Link to="/become-franchise">
                    <ArrowRight className="mr-2" />
                    {t('partners.cta', 'Start Your Franchise')}
                  </Link>
                </Button>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-8 text-center">{t('partners.sectionTitle', 'Our Trusted WLA Partners')}</h3>
                <div className="grid grid-cols-2 gap-6">
                  {wlaPartners.map((partner, index) => (
                    <motion.div
                      key={partner.name}
                      className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <img 
                        src={partner.logo} 
                        alt={partner.name}
                        className="h-16 w-auto mx-auto mb-4 object-contain"
                      />
                      <h4 className="font-bold text-lg text-slate-900">{partner.name}</h4>
                      <p className="text-sm text-slate-600">{partner.tagline}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ATM Care360 Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-900 px-6 py-3 rounded-full text-sm font-bold mb-6">
                <Star className="w-4 h-4" />
                {t('care360.badge', '⭐ PREMIUM FRANCHISE SUPPORT ⭐')}
                <Star className="w-4 h-4" />
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {t('care360.title', 'ATM Care360')}
                </span>
              </h2>
              <p className="text-xl text-slate-600 max-w-4xl mx-auto mb-8">
                {t('care360.description', '🚀 The ultimate support system that transforms ATM franchise ownership from stressful to profitable with our comprehensive 360° coverage. Join 500+ successful franchise partners! 🎯')}
              </p>
              <div className="flex flex-wrap gap-6 justify-center mb-12">
                <div className="bg-white px-6 py-3 rounded-xl shadow-lg">
                  <div className="text-2xl font-bold text-purple-600">{t('care360.stats.support.value', '24/7')}</div>
                  <div className="text-sm text-slate-600">{t('care360.stats.support.label', 'Support')}</div>
                </div>
                <div className="bg-white px-6 py-3 rounded-xl shadow-lg">
                  <div className="text-2xl font-bold text-pink-600">{t('care360.stats.partners.value', '500+')}</div>
                  <div className="text-sm text-slate-600">{t('care360.stats.partners.label', 'Partners')}</div>
                </div>
                <div className="bg-white px-6 py-3 rounded-xl shadow-lg">
                  <div className="text-2xl font-bold text-green-600">{t('care360.stats.success.value', '98%')}</div>
                  <div className="text-sm text-slate-600">{t('care360.stats.success.label', 'Success Rate')}</div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-8 shadow-2xl">
                <div className="text-center mb-8">
                  <Package className="w-16 h-16 mx-auto mb-4" />
                  <div className="text-5xl font-bold mb-2">{t('care360.price.value', '₹30,000')}</div>
                  <div className="text-xl">{t('care360.price.label', 'One-Time Investment')}</div>
                  <p className="text-purple-100 mt-2">{t('care360.price.features', '🎯 No hidden fees • Full support • Maximum ROI')}</p>
                </div>
                <Button size="lg" className="w-full bg-white text-purple-600 hover:bg-purple-50">
                  {t('care360.cta', '🚀 Get Care360 Now')}
                </Button>
              </Card>

              <div>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Shield className="text-purple-600" />
                  {t('care360.featuresTitle', 'What\'s Included in Care360:')}
                </h3>
                <div className="space-y-3">
                  {care360Features.map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                      <span className="text-slate-700">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <Card className="mt-12 p-8 bg-gradient-to-r from-purple-100 to-pink-100">
              <div className="flex items-start gap-4">
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full border-2 border-white" />
                  ))}
                </div>
                <div className="flex-1">
                  <p className="text-lg text-slate-700 italic mb-4">
                    {t('care360.testimonial.quote', '"Care360 gave me complete peace of mind. When an insurance claim came up, their team handled it end-to-end while I focused on my shop. Best investment I made! 🎯"')}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                      S
                    </div>
                    <span className="text-slate-600">{t('care360.testimonial.author', '– Suresh, Franchise Partner, Vizag')}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ATM Visibility Boost Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <Card className="bg-gradient-to-br from-green-600 to-blue-600 text-white p-8 shadow-2xl mb-8">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 mx-auto mb-4" />
                    <div className="text-5xl font-bold mb-2">{t('visibility.price.value', '₹3,000')}</div>
                    <div className="text-xl mb-2">{t('visibility.price.label', 'One-Time Investment')}</div>
                    <p className="text-green-100 mb-6">{t('visibility.price.features', 'Complete setup + 3 months support')}</p>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white/20 rounded-lg p-3">
                        <div className="text-2xl font-bold">{t('visibility.stats.increase.value', '30%')}</div>
                        <div className="text-sm">{t('visibility.stats.increase.label', 'Transaction Increase')}</div>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3">
                        <div className="text-2xl font-bold">{t('visibility.stats.visibility.value', '24/7')}</div>
                        <div className="text-sm">{t('visibility.stats.visibility.label', 'Visibility')}</div>
                      </div>
                    </div>
                    <Button size="lg" className="w-full bg-white text-green-600 hover:bg-green-50">
                      <Search className="mr-2" />
                      {t('visibility.cta', 'Boost Visibility Now')}
                    </Button>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-r from-green-100 to-blue-100">
                  <p className="text-lg text-slate-700 italic mb-3">
                    {t('visibility.testimonial.quote', '"After using ATM Visibility Boost, my ATM started showing on Google Maps. My transaction count went up 30%!"')}
                  </p>
                  <span className="text-slate-600">{t('visibility.testimonial.author', '– Ravi, Franchisee, Coimbatore')}</span>
                </Card>
              </div>

              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 bg-green-100 text-green-900 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Search className="w-4 h-4" />
                  {t('visibility.badge', 'Digital Visibility Solution')}
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="text-slate-900">{t('visibility.title.part1', 'ATM Visibility')}</span>{' '}
                  <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    {t('visibility.title.part2', 'Boost')}
                  </span>
                </h2>
                <p className="text-xl text-slate-600 mb-8">
                  {t('visibility.description', 'Transform your ATM into the most discoverable location in your area. We put your ATM on the digital map—literally!')}
                </p>

                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">{t('visibility.featuresTitle', 'What\'s Included:')}</h3>
                  <div className="space-y-3">
                    {visibilityFeatures.map((feature, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start gap-3 bg-white p-3 rounded-lg shadow-md"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                        <span className="text-slate-700">{feature.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-xl p-6">
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Target className="text-green-600" />
                    {t('visibility.whyNeeded.title', 'Why You Need This')}
                  </h4>
                  <ul className="space-y-2 text-slate-700">
                    <li>{t('visibility.whyNeeded.maps', '📍 Appear on Google Maps searches')}</li>
                    <li>{t('visibility.whyNeeded.volume', '📈 Increase daily transaction volume')}</li>
                    <li>{t('visibility.whyNeeded.presence', '🎯 Build digital presence & trust')}</li>
                    <li>{t('visibility.whyNeeded.locations', '💼 Works for all location types')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('cta.title', 'Ready to Transform Your Business?')}
            </h2>
            <p className="text-xl text-blue-100 mb-12">
              {t('cta.subtitle', 'Get started with our premium products and join thousands of successful franchise partners')}
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <Phone className="w-12 h-12 mx-auto mb-4 text-blue-400" />
                <h4 className="text-xl font-bold mb-2">{t('cta.contact.phone.title', 'Call Us')}</h4>
                <p className="text-blue-100">{t('cta.contact.phone.number', '9072380076')}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <Globe className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                <h4 className="text-xl font-bold mb-2">{t('cta.contact.website.title', 'Website')}</h4>
                <p className="text-purple-100">{t('cta.contact.website.url', 'atmfranchiseindia.in')}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6">
                <Mail className="w-12 h-12 mx-auto mb-4 text-green-400" />
                <h4 className="text-xl font-bold mb-2">{t('cta.contact.email.title', 'Email')}</h4>
                <p className="text-green-100">{t('cta.contact.email.address', 'atmfranchise@pixellpay.com')}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100" asChild>
                <Link to="/contact-us">
                  <PhoneCall className="mr-2" />
                  {t('cta.buttons.contact', 'Contact Our Experts')}
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10" asChild>
                <Link to="/become-franchise">
                  <ArrowRight className="mr-2" />
                  {t('cta.buttons.start', 'Start Your Franchise')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurProducts;