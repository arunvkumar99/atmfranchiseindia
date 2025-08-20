import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from "@/hooks/useLanguageRouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Building, Users, Target, Phone, Mail, MapPin, ExternalLink, Briefcase } from "lucide-react";
import ruralShopOwner from "@/assets/rural-shop-owner.jpg";
import atmFranchiseCareer from "@/assets/atm-franchise-career.jpg";
import youngBusinessOwner from "@/assets/young-business-owner.jpg";

const JoinUsPage = () => {
  const { t } = useTranslation('forms');
  const { tab } = useParams();
  const navigate = useNavigate();

  // Show all tabs when no specific tab is selected, default to agent when a tab is specified
  const currentTab = tab || "";

  // Don't auto-redirect - let users see all options first

  const handleTabChange = (value: string) => {
    navigate(`/join-us/${value}`);
  };

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 pt-32">
      {/* Custom styles for red theme on this page */}
      <style>{`
        .join-us-page .data-[state=active]:bg-gradient-hero {
          background: linear-gradient(135deg, hsl(355 85% 50%), hsl(355 70% 60%)) !important;
          color: white !important;
        }
        .join-us-page .bg-gradient-hero {
          background: linear-gradient(135deg, hsl(355 85% 50%), hsl(355 70% 60%)) !important;
        }
        .join-us-page .bg-gradient-accent-crimson {
          background: linear-gradient(135deg, hsl(355 80% 55%), hsl(355 75% 65%)) !important;
        }
        .join-us-page .bg-gradient-accent-red {
          background: linear-gradient(135deg, hsl(355 85% 50%), hsl(355 70% 60%)) !important;
        }
        .join-us-page .text-primary {
          color: hsl(355 85% 50%) !important;
        }
        .join-us-page .text-secondary {
          color: hsl(142 76% 36%) !important;
        }
      `}</style>
      
      <div className="container mx-auto px-4 join-us-page">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            {t('joinUs.hero.title', 'Join Our')}
            <span className="bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 bg-clip-text text-transparent"> {t('joinUs.hero.network', 'Growing Network')}</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-8">
            {t('joinUs.hero.subtitle', 'Multiple opportunities to partner with us and build a successful business in the ATM industry')}
          </p>
        </div>

        {/* Tabs for different join options */}
        <div className="max-w-5xl mx-auto">
          <Tabs value={currentTab || "agent"} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-12 h-auto p-3 bg-white shadow-lg rounded-2xl border-0 gap-2">
              <TabsTrigger 
                value="agent" 
                className="flex-col h-16 sm:h-20 px-3 sm:px-4 text-xs sm:text-base rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:scale-[1.02] hover:bg-red-50"
              >
                <Users className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
                <span className="font-medium leading-tight text-center">{t('content.join_as', 'Join as')}<br className="sm:hidden" /><span className="sm:ml-1">{t('content.agent', 'Agent')}</span></span>
              </TabsTrigger>
              <TabsTrigger 
                value="influencer" 
                className="flex-col h-16 sm:h-20 px-3 sm:px-4 text-xs sm:text-base rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:scale-[1.02] hover:bg-red-50"
              >
                <Target className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
                <span className="font-medium leading-tight text-center">{t('content.join_as', 'Join as')}<br className="sm:hidden" /><span className="sm:ml-1">{t('content.influencer', 'Influencer')}</span></span>
              </TabsTrigger>
              <TabsTrigger 
                value="employee" 
                className="flex-col h-16 sm:h-20 px-3 sm:px-4 text-xs sm:text-base rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg hover:scale-[1.02] hover:bg-red-50"
              >
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
                <span className="font-medium leading-tight text-center">{t('content.join_as', 'Join as')}<br className="sm:hidden" /><span className="sm:ml-1">{t('content.employee', 'Employee')}</span></span>
              </TabsTrigger>
            </TabsList>

            {/* Agent Content */}
            <TabsContent value="agent" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
                <Card className="bg-white border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl text-foreground flex items-center">
                      <Users className="w-6 h-6 mr-3 text-red-500" />
                      {t('joinUs.agent.title', 'Sahasra Network Agent')}
                    </CardTitle>
                    <p className="text-muted-foreground">
                      {t('joinUs.agent.description')}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white">
                        <div className="text-lg font-bold">{t('content.no_limit', 'No Limit')}</div>
                        <div className="text-xs opacity-90">{t('content.commission_earning', 'Commission Earning')}</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg text-white">
                        <div className="text-lg font-bold">{t('content.flexible', 'Flexible')}</div>
                        <div className="text-xs opacity-90">{t('content.work_schedule', 'Work Schedule')}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        t('joinUs.agent.benefits.earning', 'Attractive earning potential with competitive commissions'),
                        t('joinUs.agent.benefits.flexible', 'Flexible work opportunity - full-time or part-time'),
                        t('joinUs.agent.benefits.mission', 'Be part of national mission for financial inclusion'),
                        t('joinUs.agent.benefits.training', 'Training & marketing support provided'),
                        t('joinUs.agent.benefits.growth', 'Growth path to regional coordinator roles')
                      ].map((benefit, idx) => (
                        <div key={idx} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-foreground text-sm leading-relaxed">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-4">
                      <Button asChild className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold transform transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base px-4 py-3">
                        <Link to="/agent" className="flex items-center justify-center">
                          <span>{t('content.view_detailed_agent_program_ap', 'View Detailed Agent Program & Apply')}</span>
                          <ExternalLink className="w-4 h-4 ml-2 flex-shrink-0" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <img
                    src={ruralShopOwner}
                    alt={t('alt.sales_agent_opportunity', 'Sales Agent Opportunity')}
                    className="w-full h-64 object-cover rounded-2xl shadow-lg"
                  />
                  <Card className="bg-white border-0 shadow-lg">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-foreground mb-4">
                        {t('joinUs.agent.requirements.title')}
                      </h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>• {t('joinUs.agent.requirements.passionate')}</p>
                        <p>• {t('joinUs.agent.requirements.help')}</p>
                        <p>• {t('joinUs.agent.requirements.represent')}</p>
                        <p>• {t('joinUs.agent.requirements.work')}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Influencer Content */}
            <TabsContent value="influencer" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
                <Card className="bg-white border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl text-foreground flex items-center">
                      <Target className="w-6 h-6 mr-3 text-red-500" />
                      {t('joinUs.influencer.title')}
                    </CardTitle>
                    <p className="text-muted-foreground">
                      {t('joinUs.influencer.description')}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg text-white">
                        <div className="text-lg font-bold">{t('content.unlimited', 'Unlimited')}</div>
                        <div className="text-xs opacity-90">{t('content.commissions', 'Commissions')}</div>
                      </div>
                      <div className="text-center p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white">
                        <div className="text-lg font-bold">{t('content.zero', 'Zero')}</div>
                        <div className="text-xs opacity-90">{t('content.joining_fee', 'Joining Fee')}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        t('joinUs.influencer.benefits.grow', 'Grow followers, subscribers, likes & shares'),
                        t('joinUs.influencer.benefits.reach', 'Greater reach & visibility through national project'),
                        t('joinUs.influencer.benefits.content', 'Access to highly engaging content'),
                        t('joinUs.influencer.benefits.earning', 'Earn money for real business leads with unique code'),
                        t('joinUs.influencer.benefits.brand', 'Stronger personal brand as business promoter')
                      ].map((benefit, idx) => (
                        <div key={idx} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-foreground text-sm leading-relaxed">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-4">
                      <Button asChild className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold transform transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base px-4 py-3">
                        <Link to="/influencer" className="flex items-center justify-center">
                          <span>{t('content.view_detailed_influencer_progr', 'View Detailed Influencer Program & Apply')}</span>
                          <ExternalLink className="w-4 h-4 ml-2 flex-shrink-0" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <img
                    src={youngBusinessOwner}
                    alt={t('alt.young_indian_woman_influencer_', 'Young Indian Woman Influencer for ATM Business')}
                    className="w-full h-64 object-cover rounded-2xl shadow-lg"
                  />
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-foreground mb-4">{t('content.target_build_1000_atms', 'Target: Build 1,000+ ATMs')}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-500">{t('content.any_size', 'Any Size')}</div>
                        <div className="text-sm text-muted-foreground">{t('content.audience_welcome', 'Audience Welcome')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">{t('content.national', 'National')}</div>
                        <div className="text-sm text-muted-foreground">{t('content.project_reach', 'Project Reach')}</div>
                      </div>
                    </div>
                  </div>
                  
                  <Card className="bg-white border-0 shadow-lg">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-foreground mb-4">
                        {t('joinUs.influencer.requirements.title')}
                      </h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>• {t('joinUs.influencer.requirements.presence')}</p>
                        <p>• {t('joinUs.influencer.requirements.content')}</p>
                        <p>• {t('joinUs.influencer.requirements.audience')}</p>
                        <p>• {t('joinUs.influencer.requirements.schedule')}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Employee Content */}
            <TabsContent value="employee" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <Card className="bg-white border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl text-foreground flex items-center">
                      <Briefcase className="w-6 h-6 mr-3 text-red-500" />
                      {t('joinUs.employee.title')}
                    </CardTitle>
                    <p className="text-muted-foreground">
                      {t('joinUs.employee.description')}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                       {[
                         { title: t('joinUs.employee.benefits.salary.title', 'Competitive Salary'), subtitle: t('joinUs.employee.benefits.salary.subtitle', 'with performance incentives'), icon: "💰" },
                         { title: t('joinUs.employee.benefits.location.title', 'Office Location'), subtitle: t('joinUs.employee.benefits.location.subtitle', 'Vytilla, Ernakulam'), icon: "🏢" },
                         { title: t('joinUs.employee.benefits.role.title', 'Leadership Role'), subtitle: t('joinUs.employee.benefits.role.subtitle', 'Agent network development'), icon: "👥" },
                         { title: t('joinUs.employee.benefits.growth.title', 'Professional Growth'), subtitle: t('joinUs.employee.benefits.growth.subtitle', 'Training & development'), icon: "📈" },
                         { title: t('joinUs.employee.benefits.company.title', 'Expanding Company'), subtitle: t('joinUs.employee.benefits.company.subtitle', 'Career advancement'), icon: "🚀" }
                       ].map((benefit, idx) => (
                         <div key={idx} className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 hover:scale-[1.02] transition-transform">
                           <div className="flex items-center space-x-3">
                             <span className="text-2xl">{benefit.icon}</span>
                             <div>
                               <div className="font-semibold text-foreground text-sm">{benefit.title}</div>
                               <div className="text-muted-foreground text-xs">{benefit.subtitle}</div>
                             </div>
                           </div>
                         </div>
                       ))}
                     </div>
                    
                     <div className="pt-4 space-y-4">
                       <Button asChild className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold transform transition-all duration-300 hover:scale-105 shadow-lg">
                         <Link to="/join-us/jobs">
                           {t('joinUs.employee.applyNow')}
                           <ExternalLink className="w-4 h-4 ml-2" />
                         </Link>
                       </Button>
                     </div>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <img
                    src={atmFranchiseCareer}
                    alt={t('alt.atm_franchise_india_career_opp', 'ATM Franchise India Career Opportunity')}
                    className="w-full h-64 object-cover rounded-2xl shadow-lg"
                  />
                  <Card className="bg-white border-0 shadow-lg">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-foreground mb-4">
                        {t('joinUs.employee.currentOpening')}
                      </h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p><strong>{t('joinUs.employee.position')}:</strong> {t('joinUs.employee.salesManager')}</p>
                        <p><strong>{t('joinUs.employee.experience')}:</strong> {t('joinUs.employee.minExperience')}</p>
                        <p><strong>{t('joinUs.employee.location')}:</strong> {t('joinUs.employee.vytilla')}</p>
                        <p><strong>{t('joinUs.employee.skills')}:</strong> {t('joinUs.employee.teamManagement')}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Contact Information */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">{t('content.call_us', 'Call Us')}</h4>
                <p className="text-muted-foreground text-sm mb-2">{t('content.speak_with_our_experts', 'Speak with our experts')}</p>
                <p className="font-medium text-red-500">+91 9072380076</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">{t('content.email_us', 'Email Us')}</h4>
                <p className="text-muted-foreground text-sm mb-2">{t('content.send_us_your_queries', 'Send us your queries')}</p>
                <p className="font-medium text-green-600">atmfranchise@pixellpay.com</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-0 shadow-lg text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">{t('content.visit_us', 'Visit Us')}</h4>
                <p className="text-muted-foreground text-sm mb-2">{t('content.corporate_office', 'Corporate Office')}</p>
                <p className="font-medium text-blue-600 text-sm">{t('content.kochi_kerala', 'Kochi, Kerala')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinUsPage;