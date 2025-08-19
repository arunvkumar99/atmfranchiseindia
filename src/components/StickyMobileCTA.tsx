import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone, ArrowRight } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/contactInfo';

export function StickyMobileCTA() {
  const { t } = useTranslation('forms');
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 100px
      const scrolled = window.scrollY > 100;
      setHasScrolled(scrolled);
      
      // Hide when near footer (last 200px of page)
      const nearFooter = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
      setIsVisible(scrolled && !nearFooter);
    };

    // Check initial scroll position
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't render on desktop
  if (typeof window !== 'undefined' && window.innerWidth >= 768) {
    return null;
  }

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-3 sm:p-4 shadow-lg z-40 md:hidden transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex gap-2">
        {/* Primary CTA */}
        <Button 
          asChild 
          className="flex-1 h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          <Link to="/become-franchise" className="flex items-center justify-center gap-2">
            Start ATM Business
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        
        {/* Secondary CTA - Call */}
        <Button 
          asChild 
          variant="outline" 
          className="h-12 px-4 border-2"
        >
          <a href={CONTACT_INFO.phoneHref} className="flex items-center justify-center">
            <Phone className="h-5 w-5" />
          </a>
        </Button>
      </div>
      
      {/* Trust text */}
      <p className="text-xs text-center text-gray-600 mt-2">
        Join 200+ successful franchise partners
      </p>
    </div>
  );
}