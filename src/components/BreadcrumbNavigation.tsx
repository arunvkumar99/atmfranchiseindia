import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { useLocation } from "react-router-dom";
import { Link } from "@/hooks/useLanguageRouter";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Home, ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbNavigationProps {
  customItems?: BreadcrumbItem[];
}

export function BreadcrumbNavigation({ customItems }: BreadcrumbNavigationProps) {
  const { t } = useTranslation();
  const location = useLocation();
  
  // Generate breadcrumb items from current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customItems) {
      return customItems;
    }

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];
    
    // Map of path segments to readable labels
    const pathLabels: Record<string, string> = {
      'about-us': 'About Us',
      'become-franchise': 'Become Franchise',
      'join-us': 'Join Us',
      'agent': 'Sales Agent',
      'influencer': 'Influencer Program',
      'jobs': 'Career Opportunities',
      'employee': 'Employee',
      'contact-us': 'Contact Us',
      'our-products': 'Our Products',
      'our-services': 'Our Services',
      'submit-location': 'Submit Location',
      'why-atm-business': 'Why ATM Business',
      'pixellpay-advantage': 'PixellPay Advantage',
      'blog': 'Blog',
      'privacy-policy': 'Privacy Policy',
      'terms-conditions': 'Terms & Conditions',
      'refund-policy': 'Refund Policy'
    };

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      
      if (index === pathSegments.length - 1) {
        // Last item (current page) - no link
        breadcrumbs.push({ label });
      } else {
        breadcrumbs.push({ label, href: currentPath });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on home page
  if (location.pathname === '/' && !customItems) {
    return null;
  }

  return (
    <div className="bg-muted/30 border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <div key={index} className="flex items-center">
                {index === 0 && (
                  <Home className="w-4 h-4 mr-2 text-muted-foreground" />
                )}
                <BreadcrumbItem>
                  {item.href ? (
                    <BreadcrumbLink asChild>
                      <Link 
                        to={item.href}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.label}
                      </Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="text-foreground font-medium">
                      {item.label}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && (
                  <BreadcrumbSeparator>
                    <ChevronRight className="w-4 h-4" />
                  </BreadcrumbSeparator>
                )}
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}