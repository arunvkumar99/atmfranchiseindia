import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Home, Phone, ArrowLeft } from 'lucide-react';
import SearchComponent from '@/components/SearchComponent';

const NotFound = () => {
  const { t } = useTranslation('notFound');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const quickLinks = [
    { title: 'ATM Franchise', path: '/becomefranchise', icon: Home },
    { title: 'Become Agent', path: '/agent', icon: Home },
    { title: 'Submit Location', path: '/submit-location', icon: Home },
    { title: 'Contact Us', path: '/contact', icon: Phone },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
      <div className="max-w-2xl w-full mx-auto text-center p-8">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-white/20 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-white mb-4">{t('components.notfound.text1')}</h2>
          <p className="text-white/80 mb-8">
            The page you're looking for doesn't exist or has been moved. Try searching for what you need or explore our main sections below.
          </p>
        </div>
        
        <div className="space-y-6">
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => setIsSearchOpen(true)}
              className="bg-white text-primary hover:bg-white/90"
            >
              <Search className="h-4 w-4 mr-2" />
              Search Site
            </Button>
            
            <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {quickLinks.map((link, index) => (
              <Button
                key={index}
                asChild
                variant="outline"
                className="border-white/30 text-white hover:bg-white hover:text-primary h-auto p-4"
              >
                <Link to={link.path} className="flex items-center justify-center">
                  <link.icon className="h-5 w-5 mr-2" />
                  {link.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>

      <SearchComponent 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </div>
  );
};

export default NotFound;
