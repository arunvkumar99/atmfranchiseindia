import { Suspense } from "react";
import Hero, { ValuePropsStrip, WhyATMFranchiseIndia } from "@/components/Hero";
import { OptimizedImage } from "@/components/ui/optimized-image";
import TrustSignals from "@/components/TrustSignals";
const Home = () => {
  
  return (
    <div className="min-h-screen pt-24">
      <Hero />
      <ValuePropsStrip />
      <TrustSignals />
      <WhyATMFranchiseIndia />
      
      {/* Stats Banner */}
      <section className="bg-primary py-16 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-16 animate-slide-up">
            {/* Optimized Logo */}
            <div className="flex-shrink-0 animate-float-3d">
              <OptimizedImage
                src="/lovable-uploads/66055441-3af8-4124-9186-55a3967c791e.png"
                alt="ATM Franchise India Logo"
                className="w-60 h-auto object-contain drop-shadow-2xl"
                width={240}
                height={120}
                priority={true}
              />
            </div>
            
            {/* Stats text */}
            <div className="text-left">
              <div className="text-6xl md:text-8xl font-heading font-black text-primary-foreground mb-4 animate-pulse-3d tracking-wide">
                200<span className="text-accent animate-glow">+</span>
              </div>
              <div className="text-2xl md:text-3xl font-heading font-bold text-primary-foreground/95 mb-2">
                ATMs across India
              </div>
              <div className="text-lg font-body font-medium text-primary-foreground/85">
                and counting...
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;