import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/hooks/useLanguageRouter";
import { Shield, Users, TrendingUp, Headphones, ArrowRight } from "lucide-react";
import { useTranslation } from 'react-i18next';

const WhyATMFranchiseIndia = () => {
  const { t } = useTranslation();
  const reasons = [
    {
      number: "1",
      icon: Shield,
      title: "Trusted ATM Franchise Information",
      description: "Gain accurate and verified insights into the ATM industry. As a regulated sector, the ATM business often sees widespread misinformation. Our representatives ensure you receive reliable, fact-based guidance to make informed franchise decisions."
    },
    {
      number: "2", 
      icon: Users,
      title: "Expert Guidance on WLA Operators",
      description: "Let us help you choose the right White Label ATM partner. Many operators exaggerate their offerings and mislead investors. We provide unbiased comparisons of all major WLA operators—highlighting their strengths and weaknesses—to ensure you find the perfect fit for your business."
    },
    {
      number: "3",
      icon: TrendingUp,
      title: "Boost Your Digital Presence",
      description: "Already running an ATM franchise? Register with us to increase your digital reach and enhance your online branding. Connect with more customers and grow your visibility in the market.\n\nExpand your business presence today."
    },
    {
      number: "4",
      icon: Headphones,
      title: "End-to-End Franchise Support",
      description: "With 4+ years of experience across all WLA brands, we handle everything: Franchise onboarding, Training & operational setup, Local promotions & brand visibility, Technical support & troubleshooting, Bank account settlements, Dispute resolution with WLA operators. We're your one-stop solution for ATM business success."
    }
  ];

  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Why ATM Franchise India ?
          </h2>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
            Trusted expertise and comprehensive support for your ATM franchise journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-16">
          {reasons.map((reason, index) => {
            const IconComponent = reason.icon;
            return (
              <Card key={index} className="bg-white border-0 shadow-professional hover:shadow-glow transition-all duration-300 h-full flex flex-col">
                <CardHeader className="pb-4 flex-shrink-0">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg">
                      {reason.number}
                    </div>
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-5 h-5 text-primary" />
                      <CardTitle className="text-lg text-center text-foreground">{reason.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 px-6 flex-grow flex flex-col justify-between">
                  <p className="text-muted-foreground leading-relaxed text-center text-sm mb-4 whitespace-pre-line">
                    {reason.description}
                  </p>
                  <div className="text-center mt-auto">
                    <Button 
                      variant="link" 
                      className="px-0 text-primary text-sm whitespace-nowrap"
                      onClick={() => {
                        const actions = [
                          () => alert('Get verified franchise information from our experts'),
                          () => alert('Compare all WLA operators with detailed analysis'),
                          () => alert('Boost your digital presence and online visibility'),
                          () => alert('Get comprehensive franchise support and guidance')
                        ];
                        actions[index]();
                      }}
                    >
                      {index === 0 && 'Get Verified Info'}
                      {index === 1 && 'Compare Operators'}
                      {index === 2 && 'Boost Visibility'}
                      {index === 3 && 'Get Support'}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Success Story Banner */}
        <Card className="bg-gradient-hero text-primary-foreground border-0">
          <CardContent className="p-8 text-center">
            <Badge className="bg-primary-foreground/20 text-primary-foreground mb-4">
              Success Story
            </Badge>
             <div className="flex items-center justify-center gap-4 mb-4">
               <img 
                 src="https://via.placeholder.com/150x50/ffffff/333333?text=ATM+Franchise" 
                 alt={t('alt.atm_franchise_india_logo', 'ATM Franchise India Logo')} 
                 className="h-16 w-auto object-contain"
               />
               <span className="text-2xl font-bold">{t('content.entering_new_horizons_with_200', 'Entering New Horizons with 200+ ATM across South India')}</span>
             </div>
            <p className="text-xl mb-6 opacity-90">
              Start, Grow, and Succeed with ATM Franchise India!
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/become-franchise" className="flex items-center gap-2">
                Get Started Now <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default WhyATMFranchiseIndia;