
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowLeft, TrendingUp, Users, DollarSign } from "lucide-react";

const PerfectTimeSideHustle2025 = () => {
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
          <Badge className="mb-4 bg-primary/10 text-primary">Economic Trends</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Why 2025 is the Perfect Time to Start Your Side Hustle
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
                Feeling the buzz in the air? It's not just you. India is growing faster than any other major economy in the world, and that's great news for your wallet. But what does "economic growth" actually mean for a young person like you?
              </p>

              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-primary" />
                Think of it this way:
              </h2>

              <div className="space-y-8">
                <div className="bg-gradient-card rounded-lg p-6 border border-border/50">
                  <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    More Opportunities
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    A growing economy is like a rising tide that lifts all boats. Businesses are expanding, new companies are starting up, and there's more money flowing through the system. This creates countless opportunities for you to earn, save, and invest.
                  </p>
                </div>

                <div className="bg-gradient-card rounded-lg p-6 border border-border/50">
                  <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    More Spending Power
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    With inflation cooling down, the money you earn goes further. People are feeling more confident about spending, whether it's in big cities or small towns. This creates a ready market for new products and services.
                  </p>
                </div>

                <div className="bg-gradient-card rounded-lg p-6 border border-border/50">
                  <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-accent" />
                    A Nation of Young Aspirations
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Millions of young Indians are joining the workforce, opening bank accounts, and investing for the first time. They are looking for ways to build wealth and secure their future.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-hero text-primary-foreground rounded-xl p-8 mt-8">
                <h3 className="text-xl font-bold mb-4">The Bottom Line</h3>
                <p className="leading-relaxed">
                  This isn't just a temporary phase; it's a fundamental shift. India's growth is powered by its own people—by our domestic demand. This makes it a stable and exciting time to bet on yourself. You don't need to be a business tycoon to get a piece of the action. All you need is the right idea and a smart plan to start building a source of passive income that works for you, even while you sleep.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Start Building Passive Income?
            </h3>
            <p className="text-muted-foreground mb-6">
              Discover how ATM franchises can be your smart entry into India's growing economy.
            </p>
            <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/become-franchise">
                Explore ATM Business Opportunities
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerfectTimeSideHustle2025;
