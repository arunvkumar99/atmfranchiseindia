
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/hooks/useLanguageRouter";
import { Calendar, Clock, ArrowLeft, MapPin, FileCheck, UserCheck, DollarSign, Rocket, CheckCircle, AlertCircle } from "lucide-react";

const FiveStepGuideATMBusiness = () => {
  const { t } = useTranslation('forms');
  const steps = [
    {
      number: 1,
      title: "Find the Perfect Spot",
      icon: MapPin,
      description: "Location is everything. The right spot ensures a steady stream of transactions.",
      details: [
        "Busy markets, main roads, or near bus and railway stations",
        "Dense residential colonies or large apartment complexes",
        "Near colleges, hospitals, or government offices"
      ],
      goldRule: "Make sure there is no other bank or WLA ATM within a 100-meter radius. This gives you a local monopoly."
    },
    {
      number: 2,
      title: "Check the Simple Requirements",
      icon: FileCheck,
      description: "You don't need a business degree to qualify. The eligibility criteria are basic.",
      details: [
        "Ground-floor commercial space of 50-80 sq. ft. with concrete roof",
        "24/7 power supply connection",
        "Basic ID and address proofs (Aadhaar, PAN card, etc.)"
      ],
      goldRule: "Most young professionals already meet these requirements."
    },
    {
      number: 3,
      title: "Apply and Get Onboard",
      icon: UserCheck,
      description: "This is where a facilitator like ATM India.in makes it easy.",
      details: [
        "Apply through a single point of contact",
        "Get connected with RBI-approved operators",
        "Guided through application, verification, and agreement process"
      ],
      goldRule: "Avoid scams and fake websites by working with verified facilitators."
    },
    {
      number: 4,
      title: "Understand the Investment",
      icon: DollarSign,
      description: "The investment is manageable and transparent.",
      details: [
        "Refundable Security Deposit: ₹2-3 lakhs (you get this back)",
        "One-Time Setup Costs: Basic interior work and setup",
        "Total investment: Usually around ₹5 lakhs"
      ],
      goldRule: "This is a fraction of what it costs to buy rental property."
    },
    {
      number: 5,
      title: "Launch and Start Earning!",
      icon: Rocket,
      description: "Once approved, the operator installs the machine and provides training.",
      details: [
        "Keep the space clean and accessible",
        "Coordinate with cash agency for refills",
        "Technical issues handled 24/7 by operator"
      ],
      goldRule: "Your daily involvement is minimal - just basic maintenance and coordination."
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
          <Badge className="mb-4 bg-primary/10 text-primary">{t('components.fivestepguideatmbusiness.text1')}</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Your 5-Step Guide to Launching Your Own ATM Business
          </h1>
          <div className="flex items-center gap-6 text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{t('components.fivestepguideatmbusiness.text2')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>7 min read</span>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <Card className="mb-12">
          <CardContent className="p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Ready to turn a small space into a money-making machine? Starting an ATM franchise is more straightforward than you think. With a partner like ATM India.in to guide you and connect you with trusted operators like Vakrangee and India1 ATM, you can get your business up and running smoothly. Here's your simple, five-step plan.
              </p>

              <div className="space-y-8">
                {steps.map((step, index) => {
                  const IconComponent = step.icon;
                  return (
                    <div key={index} className="border border-border/50 rounded-xl overflow-hidden">
                      {/* Step Header */}
                      <div className="bg-gradient-primary text-primary-foreground p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="text-sm opacity-80">Step {step.number}</div>
                            <h3 className="text-2xl font-bold">{step.title}</h3>
                          </div>
                        </div>
                        <p className="mt-4 opacity-90">{step.description}</p>
                      </div>

                      {/* Step Content */}
                      <div className="p-6">
                        <div className="space-y-4 mb-6">
                          {step.details.map((detail, detailIndex) => (
                            <div key={detailIndex} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{detail}</span>
                            </div>
                          ))}
                        </div>

                        {/* Golden Rule */}
                        <div className="bg-gradient-accent rounded-lg p-4 border border-accent/20">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-accent-foreground mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="font-semibold text-accent-foreground mb-1">Golden Rule:</div>
                              <p className="text-accent-foreground/90 text-sm">{step.goldRule}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Success Story */}
              <div className="bg-gradient-hero text-primary-foreground rounded-xl p-8 mt-12">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4">{t('components.fivestepguideatmbusiness.text3')}</h3>
                  <p className="leading-relaxed mb-6">
                    By starting an ATM franchise, you're not just earning a passive income; you're also providing an essential service to your community and becoming a part of India's incredible growth story. It's a smart, secure, and simple way to build your financial future.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div className="bg-primary-foreground/20 rounded-lg p-4">
                      <div className="text-2xl font-bold">₹25k-30k</div>
                      <div className="text-sm opacity-80">{t('components.fivestepguideatmbusiness.text4')}</div>
                    </div>
                    <div className="bg-primary-foreground/20 rounded-lg p-4">
                      <div className="text-2xl font-bold">33%+</div>
                      <div className="text-sm opacity-80">{t('components.fivestepguideatmbusiness.text5')}</div>
                    </div>
                    <div className="bg-primary-foreground/20 rounded-lg p-4">
                      <div className="text-2xl font-bold">15-20 min</div>
                      <div className="text-sm opacity-80">{t('components.fivestepguideatmbusiness.text6')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-muted-foreground mb-6">
              Take the first step towards building your ATM business. Our experts will guide you through the entire process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/become-franchise">
                  Start Your ATM Business
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact-us">
                  Talk to an Expert
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FiveStepGuideATMBusiness;
