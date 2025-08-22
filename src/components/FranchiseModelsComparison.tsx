import { useState } from "react";
import { useTranslation } from 'react-i18next';
import vakrangeeLogo from "@/assets/vakrangee-logo.png";
import findiLogo from "@/assets/findi-logo.png";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Star, IndianRupee, TrendingUp, Shield, Building } from "lucide-react";

const FranchiseModelsComparison = () => {
  const { t } = useTranslation('franchise');
  const [selectedModel, setSelectedModel] = useState("tsifindi");

  const franchiseModels = {
    tsifindi: {
      name: "TSI Findi",
      badge: t('franchise:comparison.badges.mostPopular'),
      badgeVariant: "default" as const,
      icon: Star,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      logo: findiLogo,
      details: {
        oneTimeCost: "₹2,00,000",
        refundableDeposit: "₹51,000",
         clf: "₹2,00,000",
        cashTxnIncome: "₹8 per txn",
        nonCashTxnIncome: "₹2 per txn",
        adRevenue: "30%"
      },
      features: [
        t('franchise:comparison.tsifindi.feature1'),
        t('franchise:comparison.tsifindi.feature2'),
        t('franchise:comparison.tsifindi.feature3'),
        t('franchise:comparison.tsifindi.feature4'),
        t('franchise:comparison.tsifindi.feature5')
      ],
      description: t('franchise:comparison.tsifindi.description')
    },
    epsbancs: {
      name: "EPS Bancs",
      badge: t('franchise:comparison.badges.bestReturns'),
      badgeVariant: "secondary" as const,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      logo: "https://via.placeholder.com/200x80/ffffff/333333?text=EPS",
      details: {
        oneTimeCost: "₹1,00,000",
        refundableDeposit: "₹30,000",
         clf: "₹1,00,000",
        cashTxnIncome: "₹8.5-11 per txn",
        nonCashTxnIncome: "₹2 per txn",
        adRevenue: "30%"
      },
      features: [
        t('franchise:comparison.epsbancs.feature1'),
        t('franchise:comparison.epsbancs.feature2'),
        t('franchise:comparison.epsbancs.feature3'),
        t('franchise:comparison.epsbancs.feature4'),
        t('franchise:comparison.epsbancs.feature5')
      ],
      description: t('franchise:comparison.epsbancs.description')
    },
    vakrangee: {
      name: "Vakrangee",
      badge: t('franchise:comparison.badges.lowInvestment'),
      badgeVariant: "outline" as const,
      icon: IndianRupee,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      logo: vakrangeeLogo,
      details: {
        oneTimeCost: "₹31,600",
        refundableDeposit: "0",
        clf: "₹1 lakh",
        cashTxnIncome: "₹9 per txn",
        nonCashTxnIncome: "₹2 per txn",
        adRevenue: "No ad revenue"
      },
      features: [
        t('franchise:comparison.vakrangee.feature1'),
        t('franchise:comparison.vakrangee.feature2'),
        t('franchise:comparison.vakrangee.feature3'),
        t('franchise:comparison.vakrangee.feature4'),
        t('franchise:comparison.vakrangee.feature5')
      ],
      description: t('franchise:comparison.vakrangee.description')
    },
    india1: {
      name: "India1",
      badge: t('franchise:comparison.badges.premiumModel'),
      badgeVariant: "destructive" as const,
      icon: Building,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      logo: "https://via.placeholder.com/200x80/ffffff/333333?text=India1",
      details: {
        oneTimeCost: "₹5,00,000",
        refundableDeposit: "₹5,00,000",
        clf: "NIL",
        cashTxnIncome: "₹7 per txn",
        nonCashTxnIncome: "₹2 per txn",
        adRevenue: "No ad revenue"
      },
      features: [
        t('franchise:comparison.india1.feature1'),
        t('franchise:comparison.india1.feature2'),
        t('franchise:comparison.india1.feature3'),
        t('franchise:comparison.india1.feature4'),
        t('franchise:comparison.india1.feature5')
      ],
      description: t('franchise:comparison.india1.description')
    }
  };

  const selectedModelData = franchiseModels[selectedModel as keyof typeof franchiseModels];

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            {t('franchise:comparison.title')}
          </h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">{t('franchise:comparison.subtitle')}</p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Model Selection Tabs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 justify-center">
            {Object.entries(franchiseModels).map(([key, model]) => {
              const Icon = model.icon;
              return (
                <Button
                  key={key}
                  variant={selectedModel === key ? "default" : "outline"}
                  className={`h-auto p-4 flex flex-col items-center space-y-2 ${
                    selectedModel === key ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedModel(key)}
                >
                  <div className="w-12 h-8 flex items-center justify-center">
                    <img
                      src={model.logo}
                      alt={model.name}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
                      }}
                    />
                    <Icon className="w-6 h-6 hidden fallback-icon" />
                  </div>
                  <Badge variant={model.badgeVariant} className="text-xs">
                    {model.badge}
                  </Badge>
                </Button>
              );
            })}
          </div>

          {/* Selected Model Details */}
          <Card className={`${selectedModelData.borderColor} border-2 transition-all duration-300 max-w-4xl mx-auto`}>
            <CardHeader className={`${selectedModelData.bgColor} border-b text-center`}>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center justify-center">
                  <img
                    src={selectedModelData.logo}
                    alt={selectedModelData.name}
                    className="w-16 h-12 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <selectedModelData.icon className={`w-8 h-8 ${selectedModelData.color} hidden`} />
                </div>
                <CardTitle className="text-center">
                  <Badge variant={selectedModelData.badgeVariant} className="mt-2">
                    {selectedModelData.badge}
                  </Badge>
                </CardTitle>
              </div>
              <p className="text-muted-foreground mt-3 text-center">{selectedModelData.description}</p>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-8 text-center">
                {/* Investment Details */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
                    <span className="text-primary text-lg">₹</span>
                    {t('franchise:comparison.investmentDetails')}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">{t('common:labels.onetime_cost')}</span>
                      <span className="font-bold text-primary">{selectedModelData.details.oneTimeCost}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">{t('common:labels.refundable_deposit')}</span>
                      <span className="font-bold text-primary">{selectedModelData.details.refundableDeposit}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">{t('common:labels.clf_working_capital')}</span>
                      <span className="font-bold text-primary">{selectedModelData.details.clf}</span>
                    </div>
                  </div>
                </div>

                {/* Revenue Details */}
                <div>
                  <h4 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    {t('franchise:comparison.revenueStreams')}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">{t('common:labels.cash_transaction')}</span>
                      <span className="font-bold text-green-600">{selectedModelData.details.cashTxnIncome}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">{t('common:labels.noncash_transaction')}</span>
                      <span className="font-bold text-green-600">{selectedModelData.details.nonCashTxnIncome}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium">{t('common:labels.ad_revenue_share')}</span>
                      <span className="font-bold text-green-600">{selectedModelData.details.adRevenue}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  {t('franchise:comparison.keyFeatures')}
                </h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {selectedModelData.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-left">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg text-center">
                <h5 className="text-lg font-semibold mb-2">{t('franchise:comparison.interestedIn', { name: selectedModelData.name })}</h5>
                <p className="text-muted-foreground mb-4">{t('common:messages.get_detailed_information_and_start_your_franchise_')}</p>
                <Button className="bg-primary hover:bg-primary/90">
                  {t('franchise:comparison.getStartedWith', { name: selectedModelData.name })}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FranchiseModelsComparison;