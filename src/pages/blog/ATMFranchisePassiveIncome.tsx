
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/hooks/useLanguageRouter";
import { Calendar, Clock, ArrowLeft, Banknote, Smartphone, TrendingUp, Users, CheckCircle, Calculator } from "lucide-react";

const ATMFranchisePassiveIncome = () => {
  const { t } = useTranslation('forms');
  const benefits = [
    {
      title: "Low Daily Effort",
      description: "Just 15-20 minutes daily for coordination",
      icon: Clock
    },
    {
      title: "Steady Returns",
      description: "Predictable monthly income from transactions",
      icon: TrendingUp
    },
    {
      title: "Growing Market",
      description: "Cash demand increasing in Tier-2/3 cities",
      icon: Users
    },
    {
      title: "Backed by RBI",
      description: "Partner with RBI-licensed operators",
      icon: CheckCircle
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
          <Badge className="mb-4 bg-primary/10 text-primary">Business Opportunity</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            The ATM Franchise: A Smarter, Simpler Path to Passive Income
          </h1>
          <div className="flex items-center gap-6 text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>January 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>5 min read</span>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <Card className="mb-12">
          <CardContent className="p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                So, if property is too expensive and stocks are too risky, what's left? Here's an idea you may not have considered: an ATM franchise. It's a surprisingly simple and stable business model that's perfect for someone looking for genuine passive income.
              </p>

              {/* UPI Question */}
              <div className="bg-gradient-card rounded-lg p-6 border border-border/50 mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                  <Smartphone className="w-6 h-6 text-primary" />
                  "But Doesn't Everyone Use UPI?"
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  It's a fair question. We all use UPI for small payments. But look at the facts: the amount of cash in India is actually increasing every year, reaching a record high of ₹36.88 lakh crore in FY25.
                </p>
                <div className="bg-primary/5 rounded-lg p-4">
                  <p className="text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Here's the simple reason:</strong> people use UPI for small, daily spends, but they still trust and use cash for larger expenses, household budgeting, and savings. This is especially true in the fast-growing Tier-2 and Tier-3 cities, where the demand for cash is highest but the number of ATMs is lowest. This gap between high demand and low supply is your business opportunity.
                  </p>
                </div>
              </div>

              {/* How it Works */}
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Banknote className="w-6 h-6 text-primary" />
                How Does an ATM Franchise Work?
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                It's a "business-in-a-box" model. You partner with a White Label ATM Operator (WLAO)—a company licensed by the RBI to set up ATMs.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-success text-white rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Your Role (The Easy Part)</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      Provide 50-80 sq. ft. commercial space
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      Make one-time investment (mostly refundable)
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      Coordinate cash refills (15-20 mins daily)
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-primary text-white rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Company's Role (The Hard Part)</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      Provide and install ATM machine
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      Manage technology and banking network
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      Provide 24/7 technical support
                    </li>
                  </ul>
                </div>
              </div>

              {/* Earnings */}
              <div className="bg-gradient-hero text-primary-foreground rounded-xl p-8 mb-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Calculator className="w-6 h-6" />
                  How Do You Earn?
                </h3>
                <p className="leading-relaxed mb-4">
                  You earn a commission for every single transaction, whether it's a cash withdrawal or a balance check. For example, you could earn ₹8 for every cash transaction and ₹2 for every non-cash one.
                </p>
                <div className="bg-primary-foreground/20 rounded-lg p-4">
                  <p className="font-semibold">
                    If your ATM gets 100 transactions a day, you could earn a steady income of ₹25,000 to ₹30,000 or more per month, with a potential return on your initial investment of over 33% in the first year.
                  </p>
                </div>
              </div>

              {/* Benefits Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {benefits.map((benefit, index) => {
                  const IconComponent = benefit.icon;
                  return (
                    <div key={index} className="bg-gradient-card rounded-lg p-6 border border-border/50">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <h4 className="font-semibold text-foreground">{benefit.title}</h4>
                      </div>
                      <p className="text-muted-foreground text-sm">{benefit.description}</p>
                    </div>
                  );
                })}
              </div>

              <div className="bg-gradient-card rounded-lg p-6 border border-border/50">
                <p className="text-lg text-center text-foreground font-medium">
                  It's a simple, low-effort business with predictable returns, backed by a real, physical asset.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Learn How to Start?
            </h3>
            <p className="text-muted-foreground mb-6">
              Get your complete 5-step guide to launching your own ATM business.
            </p>
            <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/blog/5-step-guide-atm-business">
                Get Your Step-by-Step Guide
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ATMFranchisePassiveIncome;
