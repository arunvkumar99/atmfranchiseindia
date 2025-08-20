
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/hooks/useLanguageRouter";
import { Calendar, Clock, ArrowLeft, Building, TrendingUp, Users, AlertTriangle, X, Check } from "lucide-react";

const TruthAboutPassiveIncomeIdeas = () => {
  const { t } = useTranslation('forms');
  const ideas = [
    {
      title: "Rental Property: The Traditional Dream",
      icon: Building,
      investment: "₹30-50 lakhs+",
      reality: "High Cost, Active Management",
      pros: [
        "Tangible asset ownership",
        "Potential long-term appreciation",
        "Monthly rental income"
      ],
      cons: [
        "Huge upfront investment (₹30-50L)",
        "Additional costs: stamp duty (5-8%), furnishing, maintenance",
        "Active management required - finding tenants, repairs, complaints",
        "Low yield: only 4-6% annually",
        "Market risk and liquidity issues"
      ],
      riskLevel: "Medium-High"
    },
    {
      title: "Stock Market & Mutual Funds: High-Risk, High-Reward",
      icon: TrendingUp,
      investment: "₹500 - No limit",
      reality: "Volatile, Requires Expertise",
      pros: [
        "Low barrier to entry",
        "Potential for high returns",
        "Liquidity - can sell anytime",
        "Diversification options"
      ],
      cons: [
        "High volatility - value can swing dramatically",
        "Requires constant research and monitoring",
        "No predictable monthly income",
        "Emotional stress during market downturns",
        "Best for long-term growth, not regular cash flow"
      ],
      riskLevel: "High"
    },
    {
      title: "Peer-to-Peer (P2P) Lending: The Risky Bet",
      icon: Users,
      investment: "₹1,000 - ₹10 lakhs",
      reality: "High Risk of Defaults",
      pros: [
        "Higher interest rates (up to 18%)",
        "Easy online platform access",
        "Diversification across multiple borrowers"
      ],
      cons: [
        "High default rates - many borrowers don't pay back",
        "Skyrocketing NPAs in the P2P sector",
        "Recent RBI crackdowns on platforms",
        "Risk of losing entire investment",
        "Uncertain regulatory future"
      ],
      riskLevel: "Very High"
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Button variant="outline" asChild className="mb-8">
          <Link to="/blog" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </Button>

        {/* Article Header */}
        <div className="mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary">{t('components.truthaboutpassiveincomeideas.text1')}</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            The Truth About Popular Passive Income Ideas in India
          </h1>
          <div className="flex items-center gap-6 text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{t('components.truthaboutpassiveincomeideas.text2')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>6 min read</span>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <Card className="mb-12">
          <CardContent className="p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                When you search for passive income ideas, you'll see the same options pop up again and again. But what does it really take to succeed with them? Let's break down the most common choices for young Indians and look at the real costs and risks involved.
              </p>

              <div className="space-y-8">
                {ideas.map((idea, index) => {
                  const IconComponent = idea.icon;
                  return (
                    <div key={index} className="border border-border/50 rounded-xl overflow-hidden">
                      {/* Header */}
                      <div className="bg-gradient-card p-6 border-b border-border/50">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              <IconComponent className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-foreground">{idea.title}</h3>
                              <p className="text-muted-foreground">{idea.reality}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">{t('components.truthaboutpassiveincomeideas.text3')}</div>
                            <div className="font-semibold text-foreground">{idea.investment}</div>
                            <Badge 
                              variant={idea.riskLevel === "Very High" ? "destructive" : idea.riskLevel === "High" || idea.riskLevel === "Medium-High" ? "secondary" : "default"}
                              className="mt-2"
                            >
                              {idea.riskLevel} Risk
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Pros */}
                          <div>
                            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-600" />
                              The Positives
                            </h4>
                            <ul className="space-y-2">
                              {idea.pros.map((pro, proIndex) => (
                                <li key={proIndex} className="flex items-start gap-2 text-sm">
                                  <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-muted-foreground">{pro}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Cons */}
                          <div>
                            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                              <X className="w-4 h-4 text-red-600" />
                              The Reality Check
                            </h4>
                            <ul className="space-y-2">
                              {idea.cons.map((con, conIndex) => (
                                <li key={conIndex} className="flex items-start gap-2 text-sm">
                                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-muted-foreground">{con}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-gradient-hero text-primary-foreground rounded-xl p-8 mt-8">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6" />
                  <h3 className="text-xl font-bold">{t('components.truthaboutpassiveincomeideas.text4')}</h3>
                </div>
                <p className="leading-relaxed">
                  While these options can work for some, they all come with significant challenges: high cost, high risk, or a high-effort requirement. It's crucial to look for an option that balances these factors – offering reasonable returns with manageable risk and minimal ongoing effort.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Looking for a Better Balance?
            </h3>
            <p className="text-muted-foreground mb-6">
              Discover how ATM franchises offer a unique combination of low risk, steady returns, and minimal effort.
            </p>
            <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/blog/atm-franchise-passive-income">
                Explore ATM Franchise Benefits
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TruthAboutPassiveIncomeIdeas;
