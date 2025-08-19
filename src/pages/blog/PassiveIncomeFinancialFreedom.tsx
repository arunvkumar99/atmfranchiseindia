
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/hooks/useLanguageRouter";
import { Calendar, Clock, ArrowLeft, DollarSign, HelpCircle, CheckCircle } from "lucide-react";

const PassiveIncomeFinancialFreedom = () => {
  const { t } = useTranslation('forms');
  const questions = [
    {
      question: "What am I good at?",
      explanation: "Your best ideas will come from your skills and interests. If you love design, maybe selling templates online is for you. If you're a people person, a service-based business could be a great fit."
    },
    {
      question: "How much time can I commit?",
      explanation: "Some ideas, like starting a blog, take a lot of time to build an audience. Others, like investing, require initial research but less daily work. Be realistic about your schedule."
    },
    {
      question: "What's my budget?",
      explanation: "Every venture needs some investment, whether it's time or money. Figure out what you can comfortably afford to put in at the start."
    },
    {
      question: "What are the rules?",
      explanation: "Remember, any income you earn is taxable. A little research into the tax and legal rules now can save you a lot of headaches later."
    },
    {
      question: "Will this last?",
      explanation: "Look for ideas that have long-term potential. A trendy get-rich-quick scheme might fade, but a solid business or investment can provide stable income for years to come."
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
          <Badge className="mb-4 bg-primary/10 text-primary">Financial Planning</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            What is Passive Income, Really? Your First Step to Financial Freedom
          </h1>
          <div className="flex items-center gap-6 text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>January 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>4 min read</span>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <Card className="mb-12">
          <CardContent className="p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                You've probably heard the term "passive income" thrown around. It sounds like a dream: making money with little to no effort. But what does it actually mean, and how can you get started?
              </p>

              <div className="bg-gradient-card rounded-lg p-6 border border-border/50 mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-primary" />
                  The Real Definition
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Passive income isn't about getting something for nothing. It's about putting in the work upfront so that you can reap the rewards later with minimal ongoing effort. It's the opposite of your 9-to-5 job, where you only get paid for the hours you actively work. Passive income streams, once set up, can generate money for you 24/7, giving you financial security and the freedom to pursue your passions.
                </p>
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-6">
                5 Questions to Ask Before You Start
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Before you jump in, it's important to find the right fit for you. Ask yourself these five simple questions:
              </p>

              <div className="space-y-6">
                {questions.map((item, index) => (
                  <div key={index} className="bg-gradient-card rounded-lg p-6 border border-border/50">
                    <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      {item.question}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed ml-11">
                      {item.explanation}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-hero text-primary-foreground rounded-xl p-8 mt-8">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6" />
                  <h3 className="text-xl font-bold">Your Next Step</h3>
                </div>
                <p className="leading-relaxed">
                  Thinking through these points is the first and most important step on your journey to building real, sustainable wealth. Take your time with this process – the right passive income strategy for you is the one that aligns with your skills, schedule, budget, and long-term goals.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Looking for a Low-Risk, High-Reward Option?
            </h3>
            <p className="text-muted-foreground mb-6">
              ATM franchises might be the perfect passive income opportunity that checks all your boxes.
            </p>
            <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/blog/atm-franchise-passive-income">
                Learn About ATM Franchises
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PassiveIncomeFinancialFreedom;
