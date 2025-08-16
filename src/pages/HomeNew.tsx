import { Suspense } from "react";
import { useTranslation } from 'react-i18next';
import Hero, { ValuePropsStrip, WhyATMFranchiseIndia } from "@/components/Hero";
import { OptimizedImage } from "@/components/ui/optimized-image";
import TrustSignals from "@/components/TrustSignals";

const HomeNew = () => {
  const { t } = useTranslation(['home', 'common']);
  
  return (
    <div className="min-h-screen pt-24">
      <Hero />
      <ValuePropsStrip />
      <TrustSignals />
      <WhyATMFranchiseIndia />
      
      {/* Stats Banner - Now using translations */}
      <section className="bg-primary py-16 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-16 animate-slide-up">
            {/* Optimized Logo */}
            <div className="flex-shrink-0 animate-float-3d">
              <OptimizedImage
                src="/lovable-uploads/66055441-3af8-4124-9186-55a3967c791e.png"
                alt={t('home:hero.title')}
                className="w-60 h-auto object-contain drop-shadow-2xl"
                width={240}
                height={120}
                priority={true}
              />
            </div>
            
            {/* Stats text - Using translations */}
            <div className="text-left">
              <div className="text-6xl md:text-8xl font-heading font-black text-primary-foreground mb-4 animate-pulse-3d tracking-wide">
                200<span className="text-accent animate-glow">+</span>
              </div>
              <div className="text-2xl md:text-3xl font-heading font-bold text-primary-foreground/95 mb-2">
                {t('home:stats.activeFranchises')}
              </div>
              <div className="text-lg font-body font-medium text-primary-foreground/85">
                {t('common:loading.processing')}...
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeNew;