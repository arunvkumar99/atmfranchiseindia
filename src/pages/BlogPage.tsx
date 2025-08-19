
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/hooks/useLanguageRouter";
import { Calendar, Clock, ArrowRight, TrendingUp, DollarSign, Building, Banknote, MapPin } from "lucide-react";
import { useTranslation } from 'react-i18next';

const BlogPage = () => {
  const { t } = useTranslation('blog');
  const articles = [
    {
      id: 1,
      title: "Why 2025 is the Perfect Time to Start Your Side Hustle",
      excerpt: "India is growing faster than any other major economy. Discover how this creates incredible opportunities for building passive income streams.",
      readTime: "5 min read",
      date: "January 2025",
      icon: TrendingUp,
      category: "Economic Trends",
      slug: "perfect-time-side-hustle-2025"
    },
    {
      id: 2,
      title: "What is Passive Income, Really? Your First Step to Financial Freedom",
      excerpt: "Understanding passive income beyond the hype. Learn the 5 key questions to ask before starting your wealth-building journey.",
      readTime: "4 min read",
      date: "January 2025",
      icon: DollarSign,
      category: "Financial Planning",
      slug: "passive-income-financial-freedom"
    },
    {
      id: 3,
      title: "The Truth About Popular Passive Income Ideas in India",
      excerpt: "Rental property, stocks, P2P lending - we break down the real costs and risks of popular investment options for young Indians.",
      readTime: "6 min read",
      date: "January 2025",
      icon: Building,
      category: "Investment Analysis",
      slug: "truth-about-passive-income-ideas"
    },
    {
      id: 4,
      title: "The ATM Franchise: A Smarter, Simpler Path to Passive Income",
      excerpt: "Discover why ATM franchises offer a unique balance of low risk, steady returns, and minimal effort in India's growing economy.",
      readTime: "5 min read",
      date: "January 2025",
      icon: Banknote,
      category: "Business Opportunity",
      slug: "atm-franchise-passive-income"
    },
    {
      id: 5,
      title: "Your 5-Step Guide to Launching Your Own ATM Business",
      excerpt: "Ready to start? Here's your complete roadmap from finding the perfect location to earning your first commission.",
      readTime: "7 min read",
      date: "January 2025",
      icon: MapPin,
      category: "Getting Started",
      slug: "5-step-guide-atm-business"
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary">{t('content.financial_education', 'Financial Education')}</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Build Your Financial Future
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Expert insights on passive income, investment strategies, and building wealth in India's growing economy.
          </p>
        </div>

        {/* Featured Article */}
        <Card className="mb-16 bg-gradient-hero text-primary-foreground border-0 overflow-hidden">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-8 md:p-12">
                <Badge className="mb-4 bg-primary-foreground/20 text-primary-foreground">
                  Featured Article
                </Badge>
                <h2 className="text-3xl font-bold mb-4">
                  {articles[0].title}
                </h2>
                <p className="text-primary-foreground/90 mb-6 leading-relaxed">
                  {articles[0].excerpt}
                </p>
                <div className="flex items-center gap-4 mb-6 text-primary-foreground/80">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{articles[0].date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{articles[0].readTime}</span>
                  </div>
                </div>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  asChild
                  className="font-semibold"
                >
                  <Link to={`/blog/${articles[0].slug}`} className="flex items-center gap-2">
                    Read Article <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </div>
              <div className="bg-primary-foreground/10 p-8 md:p-12 flex items-center justify-center">
                <TrendingUp className="w-32 h-32 text-primary-foreground/30" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {articles.slice(1).map((article) => {
            const IconComponent = article.icon;
            return (
              <Card 
                key={article.id} 
                className="group hover:shadow-professional transition-all duration-300 border-border/50 hover:border-primary/20"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="outline" className="text-xs">
                      {article.category}
                    </Badge>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <IconComponent className="w-6 h-6" />
                    </div>
                  </div>
                  <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{article.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="p-0 h-auto">
                      <Link to={`/blog/${article.slug}`} className="flex items-center gap-1 text-primary hover:text-primary/80">
                        Read More <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <Card className="mt-16 bg-gradient-card border-border/50">
          <CardContent className="p-8 md:p-12 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Start Your ATM Business?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join hundreds of successful franchisees who are building passive income through ATM businesses. Get expert guidance and start your journey today.
            </p>
            <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/become-franchise" className="flex items-center gap-2">
                Start Your ATM Business <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogPage;
