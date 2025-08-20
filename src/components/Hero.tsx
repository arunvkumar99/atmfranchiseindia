import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Banknote, Building2, Shield, Navigation, Megaphone, HeartHandshake, DollarSign } from "lucide-react";
import { Link } from "@/hooks/useLanguageRouter";
import { OptimizedImage } from "@/components/ui/optimized-image";
import heroRuralATM from "@/assets/hero-rural-atm.jpg";
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation('home');
  return (
    <section className="relative min-h-screen flex items-center">
      {/* Full-bleed hero image with dark overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <OptimizedImage
          src={heroRuralATM}
          alt={t('alt.atmInIndianSetting', 'ATM in Indian semi-urban setting')}
          className="w-full h-full"
          priority={true}
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Hero content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
          {t('hero.title', 'Your ATM – Your Income')}
        </h1>
        <p className="font-body text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-95">
          {t('hero.subtitle', 'Start your own ATM franchise business with minimal investment and maximum returns. Partner with RBI licensed operators across India.')}
        </p>
        
        {/* Primary CTAs - side by side */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button 
            size="lg" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-heading font-semibold min-h-[44px] px-8"
            asChild
          >
            <Link to="/submit-location">{t('hero.submitLocation', 'Submit ATM Location')}</Link>
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground font-heading font-semibold min-h-[44px] px-8"
            asChild
          >
            <Link to="/become-franchise">{t('hero.becomeFranchise', 'Become Franchise')}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

// Value-Props Strip Component
export const ValuePropsStrip = () => {
  const { t } = useTranslation('home');
  const features = [
    {
      icon: TrendingUp,
      title: t("features.roi.title", "upto 50%"),
      subtitle: t("features.roi.subtitle", "Return On Investment"),
      description: t("features.roi.description", "All Payout Received by RBI Licensed WLA ATM Partners"),
      bgColor: "bg-white"
    },
    {
      icon: Users,
      title: t("features.penetration.title", "15 Per Lac"),
      subtitle: t("features.penetration.subtitle", "Only 15 ATMs per 1 Lac People"),
      description: t("features.penetration.description", "ATM Penetration in India is very Low"),
      bgColor: "bg-muted"
    },
    {
      icon: Banknote,
      title: t("features.cash.title", "75% Cash"),
      subtitle: t("features.cash.subtitle", "Cash Circulation"),
      description: t("features.cash.description", "Indian Economy is still Largely Cash based"),
      bgColor: "bg-white"
    },
    {
      icon: Building2,
      title: t("features.potential.title", "90% Potential"),
      subtitle: t("features.potential.subtitle", "90% of Banks Offsite ATMs are closing down"),
      description: t("features.potential.description", "Banks Offsite ATM Closure creates a Large market for ATMs"),
      bgColor: "bg-muted"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 animate-fade-in">
            {t('whyAtm.heading', 'Why ATM Business?')}
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto opacity-90">
            {t('whyAtm.subtitle', 'Zero Loss and Fully Transparent Business Opportunity from RBI Licensed Companies')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <TrendingUp className="w-6 h-6" />,
              value: 50,
              suffix: '%',
              prefix: t('valueProps.stats.roi.prefix', 'upto '),
              label: t('whyAtm.roi.title', 'Return On Investment'),
              description: t('whyAtm.roi.description', 'All Payout Received by RBI Licensed WLA ATM Partners'),
              gradient: 'from-emerald-500 to-teal-600'
            },
            {
              icon: <Users className="w-6 h-6" />,
              value: 15,
              suffix: t('valueProps.stats.penetration.suffix', ' Per Lac'),
              label: t('whyAtm.penetration.title', 'ATM Penetration'),
              description: t('whyAtm.penetration.description', 'Only 15 ATMs per 1 Lac People - ATM Penetration in India is very Low'),
              gradient: 'from-blue-500 to-cyan-600'
            },
            {
              icon: <DollarSign className="w-6 h-6" />,
              value: 75,
              suffix: t('valueProps.stats.cash.suffix', '% Cash'),
              label: t('whyAtm.cash.title', 'Cash Circulation'),
              description: t('whyAtm.cash.description', 'Indian Economy is still Largely Cash based'),
              gradient: 'from-orange-500 to-red-600'
            },
            {
              icon: <Building2 className="w-6 h-6" />,
              value: 90,
              suffix: t('valueProps.stats.potential.suffix', '% Potential'),
              label: t('whyAtm.market.title', 'Market Opportunity'),
              description: t('whyAtm.market.description', '90% of Banks Offsite ATMs are closing down - Banks Offsite ATM Closure creates a Large market for ATMs'),
              gradient: 'from-purple-500 to-pink-600'
            }
          ].map((stat, index) => (
            <div 
              key={index}
              className={`
                relative bg-gradient-to-br ${stat.gradient} 
                rounded-2xl p-8 text-center shadow-2xl 
                transform transition-all duration-700 
                hover:scale-105 hover:shadow-3xl
                animate-slide-up opacity-100
                border border-white/20 backdrop-blur-sm
              `}
              style={{
                animationDelay: `${index * 200}ms`
              }}
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/30">
                <div className="text-white">
                  {stat.icon}
                </div>
              </div>

              {/* Animated Value */}
              <div className="mb-4">
                <span className="text-4xl md:text-5xl font-black text-white tracking-tight">
                  {stat.prefix}{stat.value}{stat.suffix}
                </span>
              </div>

              {/* Label */}
              <h3 className="text-xl font-bold text-white mb-3 leading-tight">
                {stat.label}
              </h3>

              {/* Description */}
              <p className="text-sm text-white/90 leading-relaxed">
                {stat.description}
              </p>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-8 h-8 border-2 border-white/30 rounded-full"></div>
              <div className="absolute bottom-4 left-4 w-12 h-1 bg-white/30 rounded-full"></div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl px-8 py-6 border border-white/20">
            <div className="text-center">
              <p className="text-2xl font-bold text-white mb-2">{t('valueProps.perfectTime', 'Perfect Time for ATM Business in Rural India')}</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-100">
                <span className="bg-white/20 px-3 py-1 rounded-full">• {t('valueProps.bullets.digitalAdoption', 'Digital Adoption Growing')}</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">• {t('valueProps.bullets.governmentPush', 'Government Push for Financial Inclusion')}</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">• {t('valueProps.bullets.bankClosures', 'Bank Branch Closures')}</span>
              </div>
              <p className="text-lg font-semibold text-yellow-300 mt-4">
                {t('hero.investmentRange', 'Investment Range: ₹2-5 Lakhs')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Why ATM Franchise India Section
export const WhyATMFranchiseIndia = () => {
  const { t } = useTranslation('home');
  const franchiseFeatures = [
    {
      icon: Shield,
      title: t('whyChoose.features.trusted.title', "Trusted ATM Franchise Information"),
      description: t('whyChoose.features.trusted.description', "Gain accurate and verified insights into the ATM industry. As a regulated sector, the ATM business often sees widespread misinformation. Our representatives ensure you receive reliable, fact-based guidance to make informed franchise decisions."),
      gradient: "from-blue-500/20 to-cyan-500/20",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200/50"
    },
    {
      icon: Navigation,
      title: t('whyChoose.features.guidance.title', "Expert Guidance on WLA Operators"),
      description: t('whyChoose.features.guidance.description', "Let us help you choose the right White Label ATM partner. Many operators exaggerate their offerings and mislead investors. We provide unbiased comparisons of all major WLA operators—highlighting their strengths and weaknesses—to ensure you find the perfect fit for your business."),
      gradient: "from-emerald-500/20 to-teal-500/20",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-200/50"
    },
    {
      icon: Megaphone,
      title: t('whyChoose.features.digital.title', "Boost Your Digital Presence"),
      description: t('whyChoose.features.digital.description', "Already running an ATM franchise? Register with us to increase your digital reach and enhance your online branding. Connect with more customers and grow your visibility in the market."),
      gradient: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200/50"
    },
    {
      icon: HeartHandshake,
      title: t('whyChoose.features.support.title', "End-to-End Franchise Support"),
      description: t('whyChoose.features.support.description', "With 4+ years of experience across all WLA brands, we handle everything: Franchise onboarding, Training & operational setup, Local promotions & brand visibility, Technical support & troubleshooting, Bank account settlements, Dispute resolution with WLA operators. We're your one-stop solution for ATM business success."),
      gradient: "from-orange-500/20 to-red-500/20",
      iconColor: "text-orange-600",
      borderColor: "border-orange-200/50"
    }
  ];

  return (
    <section className="py-16 bg-muted/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-primary/10 rounded-full mb-6">
            <span className="text-primary font-medium text-sm">{t('whyChoose.badge', 'Our Advantage')}</span>
          </div>
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-foreground mb-6 leading-tight">
            {t('whyChoose.title', 'Why Choose')}{" "}
            <span className="text-primary font-bold">
              {t('whyChoose.titleHighlight', 'ATM Franchise India?')}
            </span>
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('whyChoose.subtitle', 'Experience the difference with our comprehensive support system and industry expertise')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {franchiseFeatures.map((feature, index) => (
            <div 
              key={index}
              className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border ${feature.borderColor} hover:scale-105 hover:-translate-y-2`}
            >
              {/* Card Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                  </div>
                  <div className={`absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br ${feature.gradient.replace('/20', '/40')} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                </div>
                
                {/* Title */}
                <h3 className="font-heading font-bold text-xl mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="font-body text-muted-foreground leading-relaxed text-sm group-hover:text-foreground/80 transition-colors duration-300">
                  {feature.description}
                </p>
                
                {/* Decorative Element */}
                <div className={`absolute bottom-4 right-4 w-8 h-8 bg-gradient-to-br ${feature.gradient} rounded-full opacity-0 group-hover:opacity-30 transition-all duration-500 group-hover:scale-150`}></div>
              </div>
              
              {/* Hover Border Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"></div>
            </div>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-primary/20">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full border-2 border-white"></div>
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-2 border-white"></div>
            </div>
            <span className="font-medium text-foreground">{t('whyChoose.cta.partners', 'Join 500+ successful franchise partners')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;