import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, TrendingUp, Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const Services = () => {
  const { t } = useTranslation('home');
  
  const services = [
    {
      id: 1,
      icon: Shield,
      title: t('services.items.trusted.title', 'Trusted ATM Franchise Information'),
      description: t('services.items.trusted.description', 'Get accurate, verified insights into the regulated ATM industry. Our experts cut through misinformation to provide fact-based guidance for informed franchise decisions.'),
      benefits: [
        t('services.items.trusted.benefits.compliance', 'RBI compliance verification'),
        t('services.items.trusted.benefits.analysis', 'Transparent business model analysis'),
        t('services.items.trusted.benefits.risk', 'Risk assessment and mitigation'),
        t('services.items.trusted.benefits.legal', 'Legal documentation support')
      ],
      cta: t('services.items.trusted.cta', 'Get Verified Info'),
      link: "#enquiry-form"
    },
    {
      id: 2,
      icon: Users,
      title: t('services.items.guidance.title', 'Expert WLA Operator Guidance'),
      description: t('services.items.guidance.description', 'Choose the right White Label ATM partner with confidence. We provide unbiased comparisons of major operators, highlighting strengths and weaknesses.'),
      benefits: [
        t('services.items.guidance.benefits.comparison', 'Operator comparison reports'),
        t('services.items.guidance.benefits.revenue', 'Revenue sharing analysis'),
        t('services.items.guidance.benefits.technical', 'Technical support evaluation'),
        t('services.items.guidance.benefits.contract', 'Contract negotiation assistance')
      ],
      cta: t('services.items.guidance.cta', 'Compare Operators'),
      link: "#wla-comparison"
    },
    {
      id: 3,
      icon: TrendingUp,
      title: t('services.items.digital.title', 'Digital Presence Boost'),
      description: t('services.items.digital.description', 'Already running an ATM franchise? Enhance your online visibility and connect with more customers through our digital marketing services.'),
      benefits: [
        t('services.items.digital.benefits.branding', 'Online branding development'),
        t('services.items.digital.benefits.seo', 'Local SEO optimization'),
        t('services.items.digital.benefits.acquisition', 'Customer acquisition strategies'),
        t('services.items.digital.benefits.analytics', 'Performance analytics')
      ],
      cta: t('services.items.digital.cta', 'Boost Visibility'),
      link: "#enquiry-form"
    }
  ];

  const supportFeatures = [
    t('services.support.onboarding', 'Franchise onboarding & setup'),
    t('services.support.training', 'Comprehensive training programs'),
    t('services.support.marketing', 'Local marketing & promotions'),
    t('services.support.technical', '24/7 technical support'),
    t('services.support.settlement', 'Bank settlement assistance'),
    t('services.support.consultation', 'Ongoing business consultation')
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('services.title', 'Why Choose')}
            <span className="bg-gradient-hero bg-clip-text text-transparent"> {t('services.titleHighlight', 'ATM Franchise India?')}</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('services.subtitle', 'With 4+ years of experience across all WLA brands, we provide end-to-end support to ensure your ATM business success in rural India.')}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={service.id} className="bg-gradient-card border-0 shadow-soft hover:shadow-warm transition-all duration-300 group">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm mx-auto mb-3">
                    {service.id}
                  </div>
                  <CardTitle className="text-xl text-foreground">{service.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="space-y-3">
                    {service.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                        <span className="text-foreground text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  
                  {service.link.startsWith('#') ? (
                    <Button 
                      variant="outline" 
                      className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground group"
                      onClick={() => {
                        const element = document.querySelector(service.link);
                        element?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {service.cta}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  ) : (
                    <Link to={service.link}>
                      <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground group">
                        {service.cta}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* End-to-End Support Section */}
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 md:p-12 border border-border">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-6">
                {t('services.supportSection.title', 'Complete Franchise Support')}
              </h3>
              <p className="text-muted-foreground mb-8 text-lg">
                {t('services.supportSection.description', 'From initial setup to ongoing operations, we handle everything so you can focus on growing your passive income from your ATM business.')}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {supportFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span className="text-foreground font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-hero rounded-xl p-8 text-center text-primary-foreground">
              <h4 className="text-2xl font-bold mb-4">{t('services.cta.title', 'Ready to Start?')}</h4>
              <p className="mb-6 opacity-90 text-lg">
                {t('services.cta.description', 'Join our network of successful ATM franchise owners across rural India')}
              </p>
              <div className="mb-6">
                <div className="text-4xl font-bold mb-2">500+</div>
                <p className="opacity-80">{t('services.cta.franchisees', 'Happy Franchisees')}</p>
              </div>
              <Button 
                size="lg" 
                variant="secondary" 
                className="bg-white text-primary hover:bg-white/90 shadow-lg"
                onClick={() => {
                  const element = document.querySelector('#enquiry-form');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {t('services.cta.button', 'Start Your Journey')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;