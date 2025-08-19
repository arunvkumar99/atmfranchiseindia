import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface UrgencyBannerProps {
  variant?: 'limited-time' | 'high-demand' | 'opportunity';
  className?: string;
}

export function UrgencyBanner({ variant = 'limited-time', className = '' }: UrgencyBannerProps) {
  const variants = {
    'limited-time': {
      icon: Clock,
      title: 'Limited Time Opportunity',
      description: 'Prime locations are filling up fast. Secure your ATM franchise today.',
      action: 'Apply Now',
      link: '/becomefranchise'
    },
    'high-demand': {
      icon: TrendingUp,
      title: 'High Demand Markets',
      description: 'Premium locations in high-traffic areas are available now.',
      action: 'View Locations',
      link: '/submit-location'
    },
    'opportunity': {
      icon: Users,
      title: 'Join 1000+ Partners',
      description: 'Be part of India\'s fastest growing ATM network.',
      action: 'Get Started',
      link: '/agent'
    }
  };

  const config = variants[variant];
  const IconComponent = config.icon;

  return (
    <div className={`bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-4 ${className}`}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IconComponent className="h-5 w-5 animate-pulse" />
            <div>
              <span className="font-semibold text-sm">{config.title}</span>
              <span className="text-sm ml-2 opacity-90">{config.description}</span>
            </div>
          </div>
          <Button 
            asChild 
            size="sm" 
            className="bg-white text-orange-600 hover:bg-orange-50 font-medium"
          >
            <Link to={config.link}>{config.action}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

interface CountdownTimerProps {
  endDate: Date;
  title?: string;
}

export function CountdownTimer({ endDate, title = "Offer Ends In" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = endDate.getTime() - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
      <h3 className="text-lg font-semibold mb-4 text-primary">{title}</h3>
      <div className="flex justify-center gap-4">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div key={unit} className="text-center">
            <div className="bg-primary text-primary-foreground rounded-lg p-2 min-w-[50px]">
              <div className="text-xl font-bold">{value.toString().padStart(2, '0')}</div>
            </div>
            <div className="text-xs text-muted-foreground mt-1 capitalize">{unit}</div>
          </div>
        ))}
      </div>
    </div>
  );
}