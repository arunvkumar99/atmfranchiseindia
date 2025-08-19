import { useNavigate as useReactNavigate, Link as RouterLink, LinkProps } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { forwardRef } from 'react';

/**
 * Custom hook for language-aware navigation
 */
export const useNavigate = () => {
  const { t } = useTranslation('forms');
  const navigate = useReactNavigate();
  const { i18n } = useTranslation();
  
  return (to: string, options?: any) => {
    const currentLang = i18n.language;
    
    // If not English and the path doesn't already have a language prefix
    if (currentLang !== 'en' && !to.match(/^\/[a-z]{2}(\/|$)/)) {
      const langPath = `/${currentLang}${to === '/' ? '' : to}`;
      navigate(langPath, options);
    } else {
      navigate(to, options);
    }
  };
};

/**
 * Language-aware Link component
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, ...props }, ref) => {
    const { i18n } = useTranslation();
    const currentLang = i18n.language;
    
    // Convert to string if it's not already
    const path = typeof to === 'string' ? to : to.pathname || '/';
    
    // Add language prefix if needed
    let langPath = path;
    if (currentLang !== 'en' && !path.match(/^\/[a-z]{2}(\/|$)/)) {
      langPath = `/${currentLang}${path === '/' ? '' : path}`;
    }
    
    return <RouterLink ref={ref} to={langPath} {...props} />;
  }
);

Link.displayName = 'LanguageLink';