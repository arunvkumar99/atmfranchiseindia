import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { SUPPORTED_LANGUAGES, changeLanguage } from '@/lib/i18n';
import { useNavigate, useLocation } from 'react-router-dom';

export const LanguageSwitcherNew = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentLanguage = SUPPORTED_LANGUAGES.find(
    lang => lang.code === i18n.language
  ) || SUPPORTED_LANGUAGES[0];

  const handleLanguageChange = (langCode: string) => {
    // Get current path without language prefix
    const currentPath = location.pathname;
    const pathMatch = currentPath.match(/^\/([a-z]{2})(\/.*)?$/);
    
    let newPath: string;
    
    if (langCode === 'en') {
      // Remove language prefix for English
      if (pathMatch) {
        newPath = pathMatch[2] || '/';
      } else {
        newPath = currentPath;
      }
    } else {
      // Add or replace language prefix
      if (pathMatch) {
        newPath = `/${langCode}${pathMatch[2] || ''}`;
      } else {
        newPath = `/${langCode}${currentPath === '/' ? '' : currentPath}`;
      }
    }
    
    // Change language in i18n
    i18n.changeLanguage(langCode);
    
    // Navigate to new path
    navigate(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 hover:bg-accent"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline-block">
            {currentLanguage.flag} {currentLanguage.native}
          </span>
          <span className="sm:hidden">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>{t('common:nav.language')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-96 overflow-y-auto">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`flex items-center justify-between cursor-pointer ${
                lang.code === currentLanguage.code ? 'bg-accent' : ''
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.native}</span>
              </span>
              {lang.code === currentLanguage.code && (
                <span className="text-xs text-muted-foreground">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};