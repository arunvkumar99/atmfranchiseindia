import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, Search, Globe } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link, useNavigate } from "@/hooks/useLanguageRouter";
import SearchComponent from "@/components/SearchComponent";
import SEOMetaTags from "@/components/SEOMetaTags";
import { SUPPORTED_LANGUAGES } from "@/lib/i18n";
import { useTranslation } from "react-i18next";


const Header = () => {
  // State management
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Refs for cleanup
  const dropdownTimer = useRef<NodeJS.Timeout | null>(null);
  const languageTimer = useRef<NodeJS.Timeout | null>(null);

  // Hooks
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  // Enhanced dropdown handlers
  const handleDropdownEnter = useCallback(() => {
    if (dropdownTimer.current) {
      clearTimeout(dropdownTimer.current);
      dropdownTimer.current = null;
    }
    setIsAboutDropdownOpen(true);
  }, []);

  const handleDropdownLeave = useCallback(() => {
    dropdownTimer.current = setTimeout(() => {
      setIsAboutDropdownOpen(false);
    }, 300);
  }, []);

  // Language dropdown handlers
  const handleLanguageEnter = useCallback(() => {
    if (languageTimer.current) {
      clearTimeout(languageTimer.current);
      languageTimer.current = null;
    }
    setIsLanguageDropdownOpen(true);
  }, []);

  const handleLanguageLeave = useCallback(() => {
    languageTimer.current = setTimeout(() => {
      setIsLanguageDropdownOpen(false);
    }, 300);
  }, []);

  // Translation function using i18n with navigation
  const handleLanguageChange = async (languageCode: string) => {
    await i18n.changeLanguage(languageCode);
    setCurrentLanguage(languageCode);
    
    // Store in localStorage for persistence
    localStorage.setItem('i18nextLng', languageCode);
    
    // Update the URL to reflect language change
    const currentPath = location.pathname;
    const pathWithoutLang = currentPath.replace(/^\/[a-z]{2}(\/|$)/, '/');
    
    if (languageCode === 'en') {
      navigate(pathWithoutLang);
    } else {
      navigate(`/${languageCode}${pathWithoutLang === '/' ? '' : pathWithoutLang}`);
    }
  };

  const translateToLanguage = useCallback((languageCode: string) => {
    handleLanguageChange(languageCode);
    setIsLanguageDropdownOpen(false);
  }, []);

  // Navigation items with translations
  const navItems = [
    { label: t('nav.home'), href: "/" },
    { 
      label: t('nav.aboutUs'), 
      href: "/about-us",
      hasDropdown: true,
      dropdownItems: [
        { label: t('nav.blog'), href: "/blog" },
        { label: t('nav.pixellpayAdvantage', 'PixellPay Advantage'), href: "/pixellpay-advantage" },
        { label: t('nav.contactUs'), href: "/contact-us" },
      ]
    },
    { label: t('nav.ourProducts'), href: "/our-products" },
    { label: t('nav.submitLocation', 'Submit ATM Location'), href: "/submit-location" },
    { label: t('nav.becomeFranchise', 'Become Franchise'), href: "/become-franchise" },
  ];

  // Check translation system readiness on mount and persist language
  useEffect(() => {
    // Check localStorage first for persisted language
    const savedLang = localStorage.getItem('i18nextLng');
    const urlLang = location.pathname.match(/^\/([a-z]{2})(\/|$)/)?.[1];
    
    // Priority: URL > localStorage > browser default
    const targetLang = urlLang || savedLang || i18n.language || 'en';
    
    if (targetLang !== i18n.language) {
      i18n.changeLanguage(targetLang);
    }
    setCurrentLanguage(targetLang);
    
    // Listen for language changes
    const handleLanguageChanged = (lng: string) => {
      setCurrentLanguage(lng);
      localStorage.setItem('i18nextLng', lng);
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, location.pathname]);

  // Check if current path is in About section
  const isAboutActive = location.pathname === "/about-us" || 
                       location.pathname === "/blog" || 
                       location.pathname.startsWith("/blog/") ||
                       location.pathname === "/pixellpay-advantage" ||
                       location.pathname === "/contact-us";

  return (
    <>
      {/* SEO Meta Tags with current language */}
      <SEOMetaTags currentLanguage={currentLanguage} />
      
      <header className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between min-h-[80px]">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
              <img 
                src="/assets/atm-franchise-logo.png" 
                alt={t('alt.atm_franchise_india_logo', 'ATM Franchise India Logo')} 
                className="h-12 sm:h-14 md:h-16 w-auto object-contain transition-transform hover:scale-105"
                loading="eager"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <div key={item.label} className="relative">
                  {item.hasDropdown ? (
                    <div 
                      className="relative group"
                      onMouseEnter={handleDropdownEnter}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <div className="flex items-center gap-1 py-2">
                        <Link
                          to={item.href}
                          className={`transition-colors font-medium ${
                            isAboutActive && item.label === "About Us"
                              ? "text-primary" 
                              : "text-foreground hover:text-primary"
                          }`}
                        >
                          {item.label}
                        </Link>
                        <ChevronDown 
                          className={`w-4 h-4 text-foreground hover:text-primary transition-transform duration-200 ${
                            isAboutDropdownOpen ? 'rotate-180' : ''
                          }`} 
                        />
                      </div>
                      
                      {isAboutDropdownOpen && (
                        <div 
                          className="absolute top-full left-0 pt-2 z-50"
                          onMouseEnter={handleDropdownEnter}
                          onMouseLeave={handleDropdownLeave}
                        >
                          <div className="w-full h-2 bg-transparent" />
                          <div className="w-56 bg-background border border-border rounded-lg shadow-xl overflow-hidden animate-fade-in">
                            <div className="py-2">
                              {item.dropdownItems?.map((dropdownItem) => (
                                <Link
                                  key={dropdownItem.label}
                                  to={dropdownItem.href}
                                  className={`block px-4 py-3 text-sm transition-all duration-200 hover:pl-6 ${
                                    location.pathname === dropdownItem.href || 
                                    (dropdownItem.href === "/blog" && location.pathname.startsWith("/blog/"))
                                      ? "text-primary bg-primary/10 border-r-2 border-primary" 
                                      : "text-foreground hover:text-primary hover:bg-muted/50"
                                  }`}
                                >
                                  {dropdownItem.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className={`transition-colors font-medium ${
                        location.pathname === item.href 
                          ? "text-primary" 
                          : "text-foreground hover:text-primary"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}

              {/* Language Dropdown - Now placed after "Become Franchise" */}
              <div 
                className="relative group"
                onMouseEnter={handleLanguageEnter}
                onMouseLeave={handleLanguageLeave}
              >
                 <div className="flex items-center gap-2 py-2 cursor-pointer">
                  <Globe className="w-4 h-4" />
                  <span className="transition-colors font-medium text-foreground hover:text-primary">
                    {SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage)?.native || 'English'}
                  </span>
                  <ChevronDown 
                    className={`w-4 h-4 text-foreground hover:text-primary transition-transform duration-200 ${
                      isLanguageDropdownOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </div>
                
                {isLanguageDropdownOpen && (
                  <div 
                    className="absolute top-full left-0 pt-2 z-50"
                    onMouseEnter={handleLanguageEnter}
                    onMouseLeave={handleLanguageLeave}
                  >
                    <div className="w-full h-2 bg-transparent" />
                    <div className="w-72 bg-background border border-border rounded-lg shadow-xl overflow-hidden animate-fade-in max-h-80 overflow-y-auto">
                      <div className="p-3 border-b border-border bg-muted/30">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <Globe className="w-4 h-4" />
                          Choose your language
                        </div>
                      </div>
                      <div className="py-2">
                        {SUPPORTED_LANGUAGES.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => translateToLanguage(lang.code)}
                            className={`block w-full text-left px-4 py-3 text-sm transition-all duration-200 hover:pl-6 hover:bg-muted/50 ${
                              currentLanguage === lang.code 
                                ? "text-primary bg-primary/10 border-r-2 border-primary" 
                                : "text-foreground hover:text-primary"
                            }`}
                          >
                            <span className="font-medium">{lang.native}</span>
                            <span className="text-muted-foreground ml-2">({lang.name})</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              
              {/* Join Us button */}
              <Button className="bg-gradient-primary text-primary-foreground hover:bg-gradient-accent-crimson transition-all duration-300 min-h-[44px] px-lg" asChild>
                <Link to="/join-us">{t('cta.joinUs', 'Join Us')}</Link>
              </Button>
              
              {/* Search Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="text-foreground hover:text-primary ml-2"
                aria-label={t('aria.search', 'Search')}
              >
                <Search className="h-4 w-4" />
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={t('aria.toggle_menu', 'Toggle menu')}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-border animate-fade-in">
              <div className="flex flex-col space-y-4 pt-4">
                {navItems.map((item) => (
                  <div key={item.label}>
                    {item.hasDropdown ? (
                      <>
                        <div className="flex items-center justify-between">
                          <Link
                            to={item.href}
                            className={`transition-colors font-medium ${
                              isAboutActive && item.label === "About Us"
                                ? "text-primary" 
                                : "text-foreground hover:text-primary"
                            }`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {item.label}
                          </Link>
                          <button
                            onClick={() => setIsAboutDropdownOpen(!isAboutDropdownOpen)}
                            className="p-2 -mr-2"
                            aria-label={t('aria.toggle_about_us_menu', 'Toggle About Us menu')}
                          >
                            <ChevronDown className={`w-4 h-4 transition-transform ${isAboutDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                        {isAboutDropdownOpen && (
                          <div className="ml-4 mt-2 space-y-2 animate-fade-in">
                            {item.dropdownItems?.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.label}
                                to={dropdownItem.href}
                                className={`block py-2 text-sm transition-colors ${
                                  location.pathname === dropdownItem.href || 
                                  (dropdownItem.href === "/blog" && location.pathname.startsWith("/blog/"))
                                    ? "text-primary" 
                                    : "text-foreground hover:text-primary"
                                }`}
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {dropdownItem.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        to={item.href}
                        className={`transition-colors font-medium ${
                          location.pathname === item.href 
                            ? "text-primary" 
                            : "text-foreground hover:text-primary"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
                
                {/* Mobile Language Menu - Collapsed by default */}
                <div className="border-t pt-4">
                  <button
                    onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                    className="flex items-center justify-between w-full text-left mb-3"
                  >
                    <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Choose Language
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isLanguageDropdownOpen && (
                    <div className="max-h-60 overflow-y-auto animate-fade-in">
                      <div className="grid grid-cols-1 gap-1">
                        {SUPPORTED_LANGUAGES.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              translateToLanguage(lang.code);
                              setIsMenuOpen(false);
                            }}
                            className={`text-left p-3 text-sm rounded transition-colors ${
                              currentLanguage === lang.code 
                                ? "bg-primary/10 text-primary border border-primary/20" 
                                : "bg-muted/30 hover:bg-muted/50"
                            }`}
                          >
                            <div className="font-medium">{lang.native}</div>
                            <div className="text-xs text-muted-foreground">{lang.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Join Us button for mobile */}
                <Button className="bg-gradient-primary text-primary-foreground hover:bg-gradient-accent-crimson transition-all duration-300 min-h-[44px] px-lg justify-start" asChild>
                  <Link to="/join-us" onClick={() => setIsMenuOpen(false)}>{t('cta.joinUs', 'Join Us')}</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>


      {/* Search Component */}
      <SearchComponent isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Global Styles for Google Translate */}
      <style>{`
        /* Hide Google Translate top banner */
        .goog-te-banner-frame {
          display: none !important;
        }
        
        /* Hide Google Translate attribution */
        .goog-te-gadget-simple .goog-te-menu-value span:first-child {
          display: none !important;
        }
        
        /* Adjust body position when Google Translate is active */
        body {
          top: 0 !important;
        }
        
        /* Style Google Translate dropdown */
        .goog-te-combo {
          margin: 0 !important;
          padding: 4px 8px !important;
          border: 1px solid hsl(var(--border)) !important;
          border-radius: 6px !important;
          background: hsl(var(--background)) !important;
          color: hsl(var(--foreground)) !important;
          font-size: 12px !important;
        }
        
        /* Ensure high z-index for translate menu */
        .goog-te-menu-frame {
          z-index: 9999 !important;
        }
      `}</style>
    </>
  );
};

export default Header;