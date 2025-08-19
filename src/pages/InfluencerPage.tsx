
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Target, CheckCircle, MapPin, Phone, Mail, Building, Award, ArrowUp, Shield } from "lucide-react";
import businessGrowth from "@/assets/business-growth.jpg";
import { InfluencerFormProgressive } from "@/components/InfluencerFormProgressive";
import { SocialProofElements } from "@/components/SocialProofElements";
import { useTranslation } from 'react-i18next';

const InfluencerPage = () => {
  const { t } = useTranslation('influencer');
  return (
    <div className="min-h-screen pt-14">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Join the <span className="text-primary font-bold">{t('content.sahasra_network_influencer_pro', 'Sahasra Network Influencer Program')}</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
            Partner with India's leading ATM franchise network and earn attractive commissions while helping 
            entrepreneurs discover financial independence through our proven business model.
          </p>
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 flex-wrap">
            <Badge variant="secondary" className="bg-gradient-success text-secondary-foreground">
              <Users className="w-4 h-4 mr-1" />
              Growing Influencer Network
            </Badge>
            <Badge variant="secondary" className="bg-gradient-success text-secondary-foreground">
              <Award className="w-4 h-4 mr-1" />
              Trusted Brand Partner
            </Badge>
          </div>
        </div>

        {/* Hero Image */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <img
              src={businessGrowth}
              alt={t('alt.influencer_partnership_growth', 'Influencer Partnership Growth')}
              className="w-full h-[200px] sm:h-[300px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
              <div className="text-white p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-2">{t('content.promote_a_trusted_business_mod', 'Promote a Trusted Business Model')}</h3>
                <p className="text-sm opacity-90">{t('content.help_your_audience_discover_fi', 'Help your audience discover financial independence while earning attractive referral commissions')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits for Influencers */}
        <div className="mb-8">
          <div className="bg-muted/50 border border-border rounded-2xl shadow-xl overflow-hidden">
            <div className="relative p-6 sm:p-8">
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4">{t('content.benefits_for_influencers_who_j', 'Benefits for Influencers Who Join the Sahasra Network')}</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white border border-border rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">{t('content.attractive_commissions', 'Attractive Commissions')}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{t('content.earn_competitive_commissions_f', 'Earn competitive commissions for every successful franchise partnership')}</p>
                </div>
                <div className="bg-white border border-border rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">{t('content.flexible_promotion', 'Flexible Promotion')}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{t('content.promote_our_franchise_model_on', 'Promote our franchise model on your channels with flexible content formats')}</p>
                </div>
                <div className="bg-white border border-border rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">{t('content.authentic_brand', 'Authentic Brand')}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{t('content.partner_with_a_trusted_brand_t', 'Partner with a trusted brand that has 4+ years of proven track record')}</p>
                </div>
                <div className="bg-white border border-border rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Building className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">{t('content.marketing_support', 'Marketing Support')}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{t('content.access_professional_marketing_', 'Access professional marketing materials, tracking links, and ongoing assistance')}</p>
                </div>
                <div className="bg-white border border-border rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">{t('content.transparent_process', 'Transparent Process')}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{t('content.clear_commission_structure_and', 'Clear commission structure and timely payouts with full transparency')}</p>
                </div>
                <div className="bg-white border border-border rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <ArrowUp className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base">{t('content.growth_opportunity', 'Growth Opportunity')}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{t('content.scale_your_income_as_our_netwo', 'Scale your income as our network grows and expands across India')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Progressive Form Section with better mobile layout */}
        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Left side - Social Proof Elements (Desktop only) */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="sticky top-20 space-y-6">
                <SocialProofElements variant="compact" />
                <SocialProofElements variant="stats" />
                <SocialProofElements variant="testimonials" />
                <SocialProofElements variant="trust-signals" />
              </div>
            </div>

            {/* Right side - Main Progressive Form */}
            <div className="lg:col-span-9">
              <InfluencerFormProgressive />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <Card className="bg-gradient-card border-0 shadow-soft text-center">
            <CardContent className="p-4 sm:p-6">
              <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-primary-foreground" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">{t('content.call_us', 'Call Us')}</h4>
              <p className="text-muted-foreground text-sm mb-2">{t('content.speak_with_our_experts', 'Speak with our experts')}</p>
              <p className="font-medium text-primary">+91 9072380076</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-soft text-center">
            <CardContent className="p-4 sm:p-6">
              <div className="w-12 h-12 bg-gradient-success rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">{t('content.email_us', 'Email Us')}</h4>
              <p className="text-muted-foreground text-sm mb-2">{t('content.get_detailed_information', 'Get detailed information')}</p>
              <p className="font-medium text-primary">atmfranchise@pixellpay.com</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card border-0 shadow-soft text-center sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4 sm:p-6">
              <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-accent-foreground" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">{t('content.visit_office', 'Visit Office')}</h4>
              <p className="text-muted-foreground text-sm mb-2">{t('content.meet_our_team', 'Meet our team')}</p>
              <p className="font-medium text-primary">{t('content.bangalore_karnataka', 'Bangalore, Karnataka')}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InfluencerPage;
