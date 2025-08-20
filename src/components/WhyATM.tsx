import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, Banknote, Target } from "lucide-react";
import { useTranslation } from 'react-i18next';

const WhyATM = () => {
  const { t } = useTranslation('franchise');
  
  const stats = [
    {
      icon: TrendingUp,
      value: "50%",
      prefix: t('whyAtm.stats.roi.prefix', 'upto'),
      label: t('whyAtm.stats.roi.label', 'Return On Investment'),
      description: t('whyAtm.stats.roi.description', 'All Payout Received by RBI Licensed WLA ATM Partners'),
      gradient: "bg-gradient-accent-blue"
    },
    {
      icon: Users,
      value: "15",
      prefix: "",
      suffix: t('whyAtm.stats.penetration.suffix', 'Per Lac'),
      label: t('whyAtm.stats.penetration.label', 'Only 15 ATMs per 1Lac People'),
      description: t('whyAtm.stats.penetration.description', 'ATM Penetration in India is very Low'),
      gradient: "bg-gradient-accent-purple"
    },
    {
      icon: Banknote,
      value: "75%",
      prefix: "",
      suffix: t('whyAtm.stats.cash.suffix', 'Cash'),
      label: t('whyAtm.stats.cash.label', 'Cash Circulation'),
      description: t('whyAtm.stats.cash.description', 'Indian Economy is still Largely Cash based'),
      gradient: "bg-gradient-accent-green"
    },
    {
      icon: Target,
      value: "90%",
      prefix: "",
      suffix: t('whyAtm.stats.potential.suffix', 'Potential'),
      label: t('whyAtm.stats.potential.label', '90% of Banks Offsite ATMs are closing down'),
      description: t('whyAtm.stats.potential.description', 'Banks Offsite ATM Closure creates a Large market for ATMs'),
      gradient: "bg-gradient-accent-blue"
    }
  ];

  return (
    <section id="why-atm" className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-cyan-500/12 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-20 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
            {t('whyAtm.title', 'Why ATM Business')}
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              ?
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed opacity-90">
            {t('whyAtm.subtitle', 'Zero Loss and Fully Transparent Business Opportunity from RBI Licensed Companies')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7xl mx-auto">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={index} 
                className="group text-center animate-scale-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="relative mb-8">
                  <div className={`w-24 h-24 ${stat.gradient} rounded-3xl flex items-center justify-center mx-auto shadow-2xl group-hover:shadow-glow-modern transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                    <IconComponent className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-accent-blue rounded-full"></div>
                </div>
                
                {/* Value */}
                <div className="mb-6">
                  {stat.prefix && (
                    <div className="text-sm text-blue-300 mb-2 font-medium">{stat.prefix}</div>
                  )}
                  <div className="text-4xl md:text-5xl font-black text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">
                    {stat.value}
                  </div>
                  {stat.suffix && (
                    <div className="text-lg text-blue-200 font-medium">{stat.suffix}</div>
                  )}
                </div>
                
                {/* Label */}
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
                  {stat.label}
                </h3>
                
                {/* Description */}
                <p className="text-blue-100 leading-relaxed opacity-90">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-6 bg-gradient-glass backdrop-blur-md rounded-3xl px-12 py-8 border border-white/20 shadow-glass">
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-white mb-4">{t('whyAtm.cta.title', 'Perfect Time for ATM Business in Rural India')}</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-100 mb-6">
                <span className="bg-white/20 px-4 py-2 rounded-full">• {t('whyAtm.cta.points.digital', 'Digital Adoption Growing')}</span>
                <span className="bg-white/20 px-4 py-2 rounded-full">• {t('whyAtm.cta.points.government', 'Government Push for Financial Inclusion')}</span>
                <span className="bg-white/20 px-4 py-2 rounded-full">• {t('whyAtm.cta.points.branches', 'Bank Branch Closures')}</span>
              </div>
              <p className="text-xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                {t('whyAtm.cta.investment', 'Investment Range: ₹2-5 Lakhs')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyATM;