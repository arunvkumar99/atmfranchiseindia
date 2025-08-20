
import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Menu, X, Shield, LogOut, ChevronDown, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Link, useNavigate } from "@/hooks/useLanguageRouter";
import { useAuth } from "@/hooks/useAuth";
import SearchComponent from "@/components/SearchComponent";

const StickyHeader = () => {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  
  // Timer ref for delayed dropdown closing
  const dropdownTimer = useRef<NodeJS.Timeout | null>(null);

  // Enhanced dropdown handlers with UX best practices
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: "Home", href: "/" },
    { 
      label: "About Us", 
      href: "/about-us",
      hasDropdown: true,
      dropdownItems: [
        { label: "Blog", href: "/blog" },
        { label: "PixellPay Advantage", href: "/pixellpay-advantage" },
        { label: "Contact Us", href: "/contact-us" },
      ]
    },
    { label: "Our Products", href: "/our-products" },
    { label: "Submit ATM Location", href: "/submit-location" },
    { label: "Become Franchise", href: "/become-franchise" },
  ];

  const isAboutActive = location.pathname === "/about-us" || 
                       location.pathname === "/blog" || 
                       location.pathname.startsWith("/blog/") ||
                       location.pathname === "/pixellpay-advantage" ||
                       location.pathname === "/contact-us";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-sm border-b border-border h-16' 
        : 'bg-background/80 backdrop-blur-sm h-20'
    }`}>
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <img 
            src="https://via.placeholder.com/150x50/ffffff/333333?text=ATM+Franchise" 
            alt="ATM Franchise India Logo" 
            className={`object-contain transition-all duration-300 ${
              isScrolled ? 'h-10' : 'h-14'
            }`}
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
                  <div className="flex items-center gap-1">
                    <Link
                      to={item.href}
                      className={`transition-all duration-300 font-medium relative ${
                        location.pathname === item.href
                          ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-accent" 
                          : "text-foreground hover:text-primary"
                      }`}
                    >
                      {item.label}
                    </Link>
                    <ChevronDown className="w-4 h-4 text-foreground hover:text-primary" />
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
                  className={`transition-all duration-300 font-medium relative ${
                    location.pathname === item.href 
                      ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-accent" 
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          {user && isAdmin && (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin-export">
                  <Shield className="w-4 h-4 mr-1" />
                  Export
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin-users">
                  <Shield className="w-4 h-4 mr-1" />
                  Users
                </Link>
              </Button>
            </div>
          )}
          {user ? (
            <Button 
              variant="outline" 
              onClick={signOut}
              className="bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          ) : (
            <Button 
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-heading font-semibold min-h-[44px] min-w-[44px]" 
              asChild
            >
              <Link to="/join-us">Join Us</Link>
            </Button>
          )}
          
          {/* Search Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSearchOpen(true)}
            className="text-foreground hover:text-primary ml-2"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-background/95 backdrop-blur-sm border-t border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.hasDropdown ? (
                    <>
                      <div className="flex items-center justify-between">
                        <Link
                          to={item.href}
                          className={`transition-colors font-medium py-2 ${
                            location.pathname === item.href
                              ? "text-primary" 
                              : "text-foreground hover:text-primary"
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                        <button
                          onClick={() => setIsAboutDropdownOpen(!isAboutDropdownOpen)}
                          className="p-1"
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform ${isAboutDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                      {isAboutDropdownOpen && (
                        <div className="ml-4 mt-2 space-y-2">
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
                      className={`transition-colors font-medium py-2 ${
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
              {user && isAdmin && (
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/admin-export');
                  }}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              )}
              {user ? (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground mt-4"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Button 
                  className="bg-accent text-accent-foreground hover:bg-accent/90 font-heading font-semibold mt-4"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/join-us');
                  }}
                >
                  Join Us
                </Button>
              )}
            </div>
          </div>
        </nav>
      )}
      
      {/* Search Component */}
      <SearchComponent 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </header>
  );
};

export default StickyHeader;
