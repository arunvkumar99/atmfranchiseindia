import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = React.useState(
    i18n.language || 'en'
  );

  React.useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
  const { t } = useTranslation();
      setCurrentLanguage(event.detail.language);
    };

    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, []);

  const handleLanguageSwitch = async (languageCode: string) => {
    console.log('Language switcher: Changing to', languageCode);
    
    // Store preference
    localStorage.setItem('preferred-language', languageCode);
    localStorage.setItem('i18nextLng', languageCode);
    
    // Change language
    await i18n.changeLanguage(languageCode);
    setCurrentLanguage(languageCode);
    
    // Update URL for non-English languages
    const currentPath = window.location.pathname;
    const cleanPath = currentPath.replace(/^\/[a-z]{2}(\/|$)/, '/');
    
    if (languageCode !== 'en') {
      const newPath = `/${languageCode}${cleanPath === '/' ? '' : cleanPath}`;
      window.history.pushState({}, '', newPath);
    } else {
      window.history.pushState({}, '', cleanPath);
    }
    
    // Force re-render
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: languageCode } }));
  };

  const currentLang = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLang.native}</span>
          <span className="sm:hidden">{currentLang.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[200px]">
        {SUPPORTED_LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageSwitch(language.code)}
            className={`flex items-center gap-3 px-3 py-2 cursor-pointer ${
              currentLanguage === language.code ? 'bg-accent' : ''
            }`}
          >
            <span className="text-lg">{language.flag}</span>
            <div className="flex flex-col">
              <span className="font-medium">{language.native}</span>
              <span className="text-xs text-muted-foreground">{language.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;