import React from 'react';
import { Button } from '@/components/ui/button';
import { Languages, Globe } from 'lucide-react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-gray-200 hover:bg-white hover:scale-105 transition-all duration-300 shadow-md"
          title={t('lang.toggle_tooltip')}
        >
          <Globe className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-sm font-medium text-gray-700">
            {language.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="min-w-[120px]">
        <DropdownMenuItem
          onClick={() => handleLanguageChange('nl')}
          className={`flex items-center gap-2 cursor-pointer ${
            language === 'nl' ? 'bg-[#F9F6F1] text-[#CC7A00] font-semibold' : ''
          }`}
        >
          🇳🇱 Nederlands
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLanguageChange('en')}
          className={`flex items-center gap-2 cursor-pointer ${
            language === 'en' ? 'bg-[#F9F6F1] text-[#CC7A00] font-semibold' : ''
          }`}
        >
          🇬🇧 English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};