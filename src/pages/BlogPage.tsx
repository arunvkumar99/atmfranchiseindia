
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
      title: t('articles.article1.title'),
      excerpt: t('articles.article1.excerpt'),
      readTime: `5 ${t('post.minRead')}`,
      date: t('post.date'),
      icon: TrendingUp,
      category: t('articles.article1.category'),
      slug: "perfect-time-side-hustle-2025"
    },
    {
      id: 2,
      title: t('articles.article2.title'),
      excerpt: t('articles.article2.excerpt'),
      readTime: `4 ${t('post.minRead')}`,
      date: t('post.date'),
      icon: DollarSign,
      category: t('articles.article2.category'),
      slug: "passive-income-financial-freedom"
    },
    {
      id: 3,
      title: t('articles.article3.title'),
      excerpt: t('articles.article3.excerpt'),
      readTime: `6 ${t('post.minRead')}`,
      date: t('post.date'),
      icon: Building,
      category: t('articles.article3.category'),
      slug: "truth-about-passive-income-ideas"
    },
    {
      id: 4,
      title: t('articles.article4.title'),
      excerpt: t('articles.article4.excerpt'),
      readTime: `5 ${t('post.minRead')}`,
      date: t('post.date'),
      icon: Banknote,
      category: t('articles.article4.category'),
      slug: "atm-franchise-passive-income"
    },
    {
      id: 5,
      title: t('articles.article5.title'),
      excerpt: t('articles.article5.excerpt'),
      readTime: `7 ${t('post.minRead')}`,
      date: t('post.date'),
      icon: MapPin,
      category: t('articles.article5.category'),
      slug: "5-step-guide-atm-business"
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary">{t('hero.badge')}</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            {t('hero.heading')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('hero.description')}
          </p>
        </div>

        {/* Featured Article */}
        <Card className="mb-16 bg-gradient-hero text-primary-foreground border-0 overflow-hidden">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-8 md:p-12">
                <Badge className="mb-4 bg-primary-foreground/20 text-primary-foreground">
                  {t('featured.badge')}
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
                    {t('featured.readArticle')} <ArrowRight className="w-5 h-5" />
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
                        {t('post.readMore')} <ArrowRight className="w-4 h-4" />
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
              {t('cta.heading')}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              {t('cta.description')}
            </p>
            <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/become-franchise" className="flex items-center gap-2">
                {t('cta.button')} <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogPage;
