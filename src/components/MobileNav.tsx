import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Home, Info, Package, Phone, Users, FileText, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useFocusTrap } from './AccessibilityEnhancements';
import { designTokens } from '@/lib/design-system';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav = ({ isOpen, onClose }: MobileNavProps) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const containerRef = useFocusTrap(isOpen);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Navigation items with icons for better mobile UX
  const navItems = [
    { 
      label: t('nav.home'), 
      href: '/',
      icon: Home
    },
    { 
      label: t('nav.aboutUs'), 
      href: '/about-us',
      icon: Info,
      hasDropdown: true,
      dropdownItems: [
        { label: t('nav.blog'), href: '/blog' },
        { label: t('nav.pixellpayAdvantage'), href: '/pixellpay-advantage' },
      ]
    },
    { 
      label: t('nav.ourProducts'), 
      href: '/our-products',
      icon: Package
    },
    { 
      label: t('nav.becomeAgent'), 
      href: '/agent',
      icon: Users
    },
    { 
      label: t('nav.submitLocation'), 
      href: '/submit-location',
      icon: FileText
    },
    { 
      label: t('nav.becomeFranchise'), 
      href: '/become-franchise',
      icon: FileText
    },
    { 
      label: t('nav.contactUs'), 
      href: '/contact-us',
      icon: Phone
    },
  ];

  // Close menu on route change
  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Focus close button when menu opens
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);

      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(`/${i18n.language}${href}`);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile Navigation Panel */}
      <div
        ref={containerRef}
        className={cn(
          "fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl z-50 transition-transform duration-300 ease-out lg:hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label={t('a11y.mobileMenu', 'Mobile navigation menu')}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('nav.menu', 'Menu')}
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/80 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={t('a11y.closeMenu', 'Close menu')}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isExpanded = expandedItems.includes(item.label);
              const isCurrentActive = isActive(item.href);

              return (
                <li key={item.label}>
                  {item.hasDropdown ? (
                    <>
                      <button
                        onClick={() => toggleExpanded(item.label)}
                        className={cn(
                          "w-full flex items-center justify-between px-6 py-4 text-left transition-colors min-h-[56px]",
                          "hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500",
                          isCurrentActive && "bg-blue-50 text-blue-600 font-medium"
                        )}
                        aria-expanded={isExpanded}
                        aria-controls={`dropdown-${item.label}`}
                      >
                        <div className="flex items-center gap-3">
                          {Icon && <Icon className="w-5 h-5" aria-hidden="true" />}
                          <span className="text-base">{item.label}</span>
                        </div>
                        <ChevronDown
                          className={cn(
                            "w-5 h-5 transition-transform duration-200",
                            isExpanded && "rotate-180"
                          )}
                          aria-hidden="true"
                        />
                      </button>
                      {isExpanded && (
                        <ul
                          id={`dropdown-${item.label}`}
                          className="bg-gray-50 border-y"
                        >
                          {item.dropdownItems?.map((dropdownItem) => (
                            <li key={dropdownItem.href}>
                              <Link
                                to={dropdownItem.href}
                                className={cn(
                                  "block px-12 py-4 text-base transition-colors min-h-[56px] flex items-center",
                                  "hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500",
                                  isActive(dropdownItem.href) && "bg-blue-100 text-blue-600 font-medium"
                                )}
                              >
                                {dropdownItem.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 px-6 py-4 transition-colors min-h-[56px]",
                        "hover:bg-gray-50 focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500",
                        isCurrentActive && "bg-blue-50 text-blue-600 font-medium"
                      )}
                    >
                      {Icon && <Icon className="w-5 h-5" aria-hidden="true" />}
                      <span className="text-base">{item.label}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Language Selector */}
        <div className="border-t p-4 bg-gray-50">
          <label htmlFor="mobile-language" className="block text-sm font-medium text-gray-700 mb-2">
            <Globe className="inline w-4 h-4 mr-1" />
            {t('nav.language', 'Language')}
          </label>
          <select
            id="mobile-language"
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="en">{t('languages.en', 'English')}</option>
            <option value="hi">{t('languages.hi', 'हिन्दी')}</option>
            <option value="ta">{t('languages.ta', 'தமிழ்')}</option>
            <option value="te">{t('languages.te', 'తెలుగు')}</option>
            <option value="bn">{t('languages.bn', 'বাংলা')}</option>
            <option value="mr">{t('languages.mr', 'मराठी')}</option>
            <option value="gu">{t('languages.gu', 'ગુજરાતી')}</option>
            <option value="kn">{t('languages.kn', 'ಕನ್ನಡ')}</option>
            <option value="ml">{t('languages.ml', 'മലയാളം')}</option>
            <option value="pa">{t('languages.pa', 'ਪੰਜਾਬੀ')}</option>
            <option value="or">{t('languages.or', 'ଓଡ଼ିଆ')}</option>
            <option value="as">{t('languages.as', 'অসমীয়া')}</option>
            <option value="ur">{t('languages.ur', 'اردو')}</option>
          </select>
        </div>

        {/* CTA Buttons */}
        <div className="border-t p-4 space-y-3">
          <Link
            to="/become-franchise"
            className="block w-full py-3 px-4 bg-blue-600 text-white text-center rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {t('nav.becomeFranchise', 'Become Franchise')}
          </Link>
          <Link
            to="/submit-location"
            className="block w-full py-3 px-4 bg-white border-2 border-blue-600 text-blue-600 text-center rounded-lg font-medium hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {t('nav.submitLocation', 'Submit Location')}
          </Link>
        </div>
      </div>
    </>
  );
};

// Mobile Menu Button Component
interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const MobileMenuButton = ({ isOpen, onClick }: MobileMenuButtonProps) => {
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "lg:hidden p-3 rounded-lg transition-colors",
        "hover:bg-gray-100 focus:bg-gray-100",
        "focus:outline-none focus:ring-2 focus:ring-blue-500",
        "min-w-[44px] min-h-[44px]" // Ensure minimum touch target
      )}
      aria-label={isOpen ? t('a11y.closeMenu', 'Close menu') : t('a11y.openMenu', 'Open menu')}
      aria-expanded={isOpen}
      aria-controls="mobile-navigation"
    >
      {isOpen ? (
        <X className="w-6 h-6" aria-hidden="true" />
      ) : (
        <Menu className="w-6 h-6" aria-hidden="true" />
      )}
    </button>
  );
};