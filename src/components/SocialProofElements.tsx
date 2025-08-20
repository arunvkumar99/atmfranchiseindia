
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, Users, TrendingUp, Shield, Award } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface TestimonialProps {
  name: string;
  role: string;
  content: string;
  rating: number;
  location: string;
}

const testimonials: TestimonialProps[] = [
  {
    name: "Rajesh Kumar",
    role: "ATM Franchise Owner",
    content: "Best decision I made for passive income. Professional support and consistent earnings every month.",
    rating: 5,
    location: "Mumbai, Maharashtra"
  },
  {
    name: "Priya Sharma",
    role: "Business Owner",
    content: "The team guided me through everything. My ATM has been profitable from month one.",
    rating: 5,
    location: "Delhi, NCR"
  },
  {
    name: "Amit Patel",
    role: "Retired Professional",
    content: "Perfect retirement investment. Minimal effort required and good returns guaranteed.",
    rating: 5,
    location: "Ahmedabad, Gujarat"
  }
];

interface SocialProofElementsProps {
  variant?: 'testimonials' | 'trust-signals' | 'stats' | 'compact';
  className?: string;
}

export function SocialProofElements({ variant = 'testimonials', className = "" }: SocialProofElementsProps) {
  const { t } = useTranslation();
  
  if (variant === 'testimonials') {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Quote className="w-5 h-5 text-primary" />
          What Our Partners Say
        </h3>
        <div className="grid gap-4">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-gradient-card border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">"{testimonial.content}"</p>
                    <div className="text-xs">
                      <div className="font-medium text-foreground">{testimonial.name}</div>
                      <div className="text-muted-foreground">{testimonial.role} • {testimonial.location}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'trust-signals') {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Trusted & Certified
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <Badge variant="secondary" className="justify-center p-3 bg-gradient-success text-secondary-foreground">
            <Shield className="w-4 h-4 mr-2" />
            RBI Licensed
          </Badge>
          <Badge variant="secondary" className="justify-center p-3 bg-gradient-hero text-primary-foreground">
            <Award className="w-4 h-4 mr-2" />
            ISO Certified
          </Badge>
          <Badge variant="secondary" className="justify-center p-3 bg-gradient-card text-foreground">
            <Users className="w-4 h-4 mr-2" />
            500+ Partners
          </Badge>
          <Badge variant="secondary" className="justify-center p-3 bg-gradient-accent text-accent-foreground">
            <TrendingUp className="w-4 h-4 mr-2" />
            4+ Years Experience
          </Badge>
        </div>
      </div>
    );
  }

  if (variant === 'stats') {
    return (
      <div className={`bg-gradient-card rounded-xl p-6 border border-border ${className}`}>
        <h3 className="text-lg font-semibold text-foreground mb-4 text-center">{t('content.our_impact', 'Our Impact')}</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">500+</div>
            <div className="text-sm text-muted-foreground">{t('content.active_atms', 'Active ATMs')}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-secondary">₹50L+</div>
            <div className="text-sm text-muted-foreground">{t('content.monthly_transactions', 'Monthly Transactions')}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent">95%</div>
            <div className="text-sm text-muted-foreground">{t('content.uptime', 'Uptime')}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">4.8★</div>
            <div className="text-sm text-muted-foreground">{t('content.partner_rating', 'Partner Rating')}</div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`bg-blue-50 border border-blue-200 rounded-lg p-3 ${className}`}>
        <div className="flex items-center gap-2 text-sm">
          <Shield className="w-4 h-4 text-blue-600" />
          <span className="text-blue-700 font-medium">{t('content.trusted_by_500_partners', 'Trusted by 500+ partners')}</span>
          <span className="text-blue-600">• RBI Licensed • ISO Certified</span>
        </div>
      </div>
    );
  }

  return null;
}
