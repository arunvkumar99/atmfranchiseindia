import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CONTACT_INFO } from "@/lib/contactInfo";

const Footer = () => {
  const quickLinks = [
    { label: "Home", href: "#home" },
    { label: "Why ATM Business", href: "#why-atm" },
    { label: "Our Services", href: "#services" },
    { label: "Get Started", href: "#get-started" },
  ];

  const services = [
    "ATM Franchise Consultation",
    "WLA Operator Comparison", 
    "Site Evaluation",
    "Training & Support",
    "Digital Marketing",
    "Technical Assistance"
  ];

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/lovable-uploads/66055441-3af8-4124-9186-55a3967c791e.png" 
                  alt="ATM Franchise India Logo" 
                  className="h-12 w-auto object-contain"
                />
                <div>
                  <h3 className="font-bold text-lg">ATM Franchise India</h3>
                  <p className="text-xs text-background/70">Trusted Business Partner</p>
                </div>
              </div>
              <p className="text-background/80 leading-relaxed">
                Empowering rural entrepreneurs with transparent ATM franchise opportunities. 
                Building passive income streams while serving communities across India.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-background/90">{CONTACT_INFO.phoneFormatted}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-background/90">{CONTACT_INFO.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-background/90">Bangalore, Karnataka, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <div className="space-y-3">
              <Link to="/submit-location" className="block text-background/80 hover:text-primary transition-colors">
                Submit ATM Location
              </Link>
              <Link to="/become-franchise" className="block text-background/80 hover:text-primary transition-colors">
                Become Franchise
              </Link>
              <Link to="/agent" className="block text-background/80 hover:text-primary transition-colors">
                Agent
              </Link>
              <Link to="/influencer" className="block text-background/80 hover:text-primary transition-colors">
                Influencer
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-lg mb-6">Our Services</h4>
            <div className="space-y-3">
              {services.map((service) => (
                <div key={service} className="text-background/80 text-sm">
                  {service}
                </div>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-lg mb-6">Legal</h4>
            <div className="space-y-3">
              <Link to="/privacy-policy" className="block text-background/80 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-conditions" className="block text-background/80 hover:text-primary transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/refund-policy" className="block text-background/80 hover:text-primary transition-colors">
                Refund Policy
              </Link>
              <Link to="/accessibility-statement" className="block text-background/80 hover:text-primary transition-colors">
                Accessibility Statement
              </Link>
            </div>
          </div>
        </div>


        {/* Bottom Footer */}
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-background/70 text-sm font-body">
              © 2025 ATM Franchise India. All rights reserved. | RBI Licensed Partners Only
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-background/70">
              <Link to="/about-us" className="hover:text-accent transition-colors font-body">About Us</Link>
              <Link to="/contact-us" className="hover:text-accent transition-colors font-body">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;