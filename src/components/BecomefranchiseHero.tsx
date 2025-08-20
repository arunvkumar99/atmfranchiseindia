import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Star, TrendingUp, Users, Headphones, CheckCircle } from "lucide-react";
import { Link } from "@/hooks/useLanguageRouter";
import businessGrowth from "@/assets/business-growth.jpg";
import { useTranslation } from 'react-i18next';

const BecomefranchiseHero = () => {
  const { t } = useTranslation('franchise');
  const benefits = [
    {
      icon: TrendingUp,
      title: "Quick ROI",
      description: "Fast return on investment with proven business model"
    },
    {
      icon: Shield,
      title: "Dedicated Support",
      description: "24/7 technical and business support from our expert team"
    },
    {
      icon: Users,
      title: "Proven Network",
      description: "Join 500+ successful franchise partners across India"
    },
    {
      icon: Headphones,
      title: "Training Included", 
      description: "Comprehensive training and ongoing support provided"
    }
  ];

  const processSteps = [
    {
      number: 1,
      title: "Apply",
      description: "Submit your franchise application online"
    },
    {
      number: 2,
      title: "Agreement",
      description: "Complete documentation and sign agreement"
    },
    {
      number: 3,
      title: "Installation",
      description: "We handle ATM setup and installation"
    },
    {
      number: 4,
      title: "Start Earning",
      description: "Begin receiving monthly passive income"
    }
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden flex items-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-500/6 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${businessGrowth})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-900/85 to-indigo-900/80"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="text-primary-foreground">
              {/* Badge */}
              <div className="inline-flex items-center gap-sm mb-xl bg-background/10 backdrop-blur-md border border-border/20 rounded-full px-xl py-base shadow-professional">
                <Star className="w-5 h-5 text-primary" />
                <span className="text-primary-foreground/90 font-medium">{t('content.trusted_atm_franchise_partner', 'Trusted ATM Franchise Partner')}</span>
              </div>
              
              {/* Main Heading */}
              <h1 className="text-5xl md:text-7xl font-black mb-xl leading-tight">
                <span className="block text-primary-foreground">{t('content.become_an', 'Become an')}</span>
                <span className="block bg-gradient-primary bg-clip-text text-transparent">
                  ATM Franchise
                </span>
                <span className="block text-primary-foreground">{t('content.partner', 'Partner')}</span>
              </h1>
              
              {/* Description */}
              <p className="text-xl md:text-2xl mb-3xl text-primary-foreground/80 leading-relaxed">
                Join <span className="text-primary font-semibold">{t('jsx-text_200_successful_partners')}</span> and start your 
                <span className="text-accent font-semibold">{t('jsx-text_profitable_atm_business')}</span> today with 
                <span className="text-info font-semibold">{t('jsx-text_minimal_investment')}</span>.
              </p>
              
              {/* CTA Button */}
              <div className="flex justify-center sm:justify-start mb-3xl">
                <Button 
                  size="lg" 
                  className="bg-background text-foreground hover:bg-secondary border-0 shadow-professional hover:shadow-modern transition-all duration-500 hover:scale-105 px-2xl py-xl text-xl rounded-full font-semibold"
                  onClick={() => {
                    const enquiryForm = document.getElementById('enquiry-form');
                    if (enquiryForm) {
                      enquiryForm.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Apply Now
                </Button>
              </div>
              
              {/* Trust Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-xl">
                {benefits.map((benefit, index) => (
                  <div key={index} className="group bg-background/10 backdrop-blur-md rounded-2xl p-lg border border-border/20 hover:border-border/40 transition-all duration-500 hover:scale-105 shadow-professional">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-base group-hover:scale-110 transition-transform duration-300">
                      <benefit.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-sm font-bold text-primary-foreground mb-sm">{benefit.title}</h3>
                    <p className="text-xs text-primary-foreground/70">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Content - Process Steps */}
            <div className="bg-background/10 backdrop-blur-md rounded-3xl p-xl border border-border/20 shadow-professional">
              <h3 className="text-2xl font-bold text-primary-foreground mb-xl text-center">{t('content.simple_4step_process', 'Simple 4-Step Process')}</h3>
              <div className="space-y-xl">
                {processSteps.map((step, index) => (
                  <div key={index} className="group flex items-start gap-lg p-lg rounded-2xl bg-background/5 hover:bg-background/10 transition-all duration-300">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center font-bold text-primary-foreground text-lg group-hover:scale-110 transition-transform duration-300">
                      {step.number}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-primary-foreground mb-sm">{step.title}</h4>
                      <p className="text-primary-foreground/70 text-sm">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomefranchiseHero;