import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Building, Users, Target, Briefcase, Phone, FileText } from "lucide-react";

interface StrategicLinksProps {
  currentPage: 'home' | 'about' | 'franchise' | 'agent' | 'influencer' | 'contact' | 'blog';
  variant?: 'compact' | 'detailed';
}

export function StrategicCrossPageLinks({ currentPage, variant = 'detailed' }: StrategicLinksProps) {
  const getRecommendedLinks = () => {
    switch (currentPage) {
      case 'home':
        return [
          { 
            title: "Become a Franchise Partner", 
            description: "Start your ATM business with proven success model",
            path: "/become-franchise", 
            icon: Building,
            priority: 'high'
          },
          { 
            title: "Join as Sales Agent", 
            description: "Earn commissions by promoting ATM franchises",
            path: "/agent", 
            icon: Users,
            priority: 'high'
          },
          { 
            title: "About Our Mission", 
            description: "Learn about our 4+ years of industry experience",
            path: "/about-us", 
            icon: FileText,
            priority: 'medium'
          }
        ];
      
      case 'about':
        return [
          { 
            title: "Start Your Franchise", 
            description: "Ready to begin? Explore franchise opportunities",
            path: "/become-franchise", 
            icon: Building,
            priority: 'high'
          },
          { 
            title: "Our ATM Products", 
            description: "Discover our comprehensive ATM solutions",
            path: "/our-products", 
            icon: Target,
            priority: 'medium'
          },
          { 
            title: "Contact Our Team", 
            description: "Speak with our franchise experts",
            path: "/contact-us", 
            icon: Phone,
            priority: 'medium'
          }
        ];
      
      case 'franchise':
        return [
          { 
            title: "Join Our Sales Team", 
            description: "Become an agent and earn attractive commissions",
            path: "/agent", 
            icon: Users,
            priority: 'high'
          },
          { 
            title: "Career Opportunities", 
            description: "Full-time positions with growth potential",
            path: "/join-us/jobs", 
            icon: Briefcase,
            priority: 'medium'
          },
          { 
            title: "Contact for Support", 
            description: "Get personalized guidance from our experts",
            path: "/contact-us", 
            icon: Phone,
            priority: 'medium'
          }
        ];
      
      case 'agent':
        return [
          { 
            title: "Explore Franchise Options", 
            description: "Understand the business model you'll be promoting",
            path: "/become-franchise", 
            icon: Building,
            priority: 'high'
          },
          { 
            title: "Influencer Program", 
            description: "Leverage social media for additional income",
            path: "/influencer", 
            icon: Target,
            priority: 'medium'
          },
          { 
            title: "Our Success Stories", 
            description: "Read about our proven track record",
            path: "/about-us", 
            icon: FileText,
            priority: 'medium'
          }
        ];
      
      case 'influencer':
        return [
          { 
            title: "Sales Agent Program", 
            description: "Direct sales approach with higher commissions",
            path: "/agent", 
            icon: Users,
            priority: 'high'
          },
          { 
            title: "Franchise Business Model", 
            description: "Understand what you'll be promoting",
            path: "/become-franchise", 
            icon: Building,
            priority: 'medium'
          },
          { 
            title: "Contact for Support", 
            description: "Get marketing materials and guidance",
            path: "/contact-us", 
            icon: Phone,
            priority: 'medium'
          }
        ];
      
      default:
        return [
          { 
            title: "Start Your Journey", 
            description: "Explore ATM franchise opportunities",
            path: "/become-franchise", 
            icon: Building,
            priority: 'high'
          },
          { 
            title: "Join Our Network", 
            description: "Become part of our growing team",
            path: "/join-us/agent", 
            icon: Users,
            priority: 'medium'
          }
        ];
    }
  };

  const links = getRecommendedLinks();
  const highPriorityLinks = links.filter(link => link.priority === 'high');
  const displayLinks = variant === 'compact' ? highPriorityLinks : links;

  if (variant === 'compact') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {displayLinks.map((link, index) => {
          const IconComponent = link.icon;
          return (
            <Button
              key={index}
              asChild
              variant="outline"
              className="h-auto p-4 text-left justify-start hover:bg-muted/50 transition-all duration-200"
            >
              <Link to={link.path}>
                <div className="flex items-center gap-3">
                  <IconComponent className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">{link.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{link.description}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-50 flex-shrink-0" />
                </div>
              </Link>
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Related Opportunities</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayLinks.map((link, index) => {
          const IconComponent = link.icon;
          return (
            <Card key={index} className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
              <CardContent className="p-4">
                <Link to={link.path} className="block">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-foreground mb-1 group-hover:text-primary transition-colors">
                        {link.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {link.description}
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-primary text-sm">
                        <span>Learn more</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}