import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'nl' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  nl: {
    // Navigation
    'nav.home': 'HOME',
    'nav.weddings': 'BRUILOFTEN',
    'nav.corporate': 'CORPORATE',
    'nav.social': 'SOCIALE EVENTS',
    'nav.bbq': 'BBQ CATERING',
    'nav.gallery': 'GALERIJ',
    'nav.contact': 'CONTACT',
    
    // Common buttons
    'btn.book_now': 'Boek Nu',
    'btn.view_menu': 'Bekijk Menu',
    'btn.request_quote': 'Vraag Offerte Aan',
    'btn.contact_us': 'Neem Contact Op',
    'btn.call_now': 'Bel Ons Nu',
    'btn.check_availability': 'Check Beschikbaarheid',
    
    // Hero sections
    'hero.weddings_subtitle': 'Laten We Verbinden',
    'hero.weddings_title': 'BRUILOFTEN',
    'hero.corporate_subtitle': 'Zakelijke Excellentie',
    'hero.corporate_title': 'BEDRIJFSCATERING',
    'hero.bbq_subtitle': 'Vuur & Smaak',
    'hero.bbq_title': 'BBQ CATERING',
    'hero.social_subtitle': 'Vier Het Leven',
    'hero.social_title': 'SOCIALE EVENEMENTEN',
    'hero.contact_subtitle': 'Laten We Verbinden',
    'hero.contact_title': 'CONTACT',
    
    // Service titles
    'service.weddings': 'BRUILOFTEN',
    'service.fresh_inspired': 'VERS & GEÏNSPIREERD',
    'service.service_styles': 'SERVICE STIJLEN',
    'service.venues_vendors': 'LOCATIES & LEVERANCIERS',
    'service.we_are_here': 'WIJ ZIJN ER VOOR U',
    
    // Corporate services
    'corporate.executive_meetings': 'Directie Vergaderingen',
    'corporate.boardroom_catering': 'DIRECTIEKAMER CATERING',
    'corporate.conference_catering': 'Conferentie Catering',
    'corporate.all_day_events': 'HELE DAG EVENEMENTEN',
    'corporate.office_dining': 'Kantoor Dining',
    'corporate.daily_catering': 'DAGELIJKSE CATERING',
    'corporate.professional_services': 'Professionele Services',
    'corporate.professional_image': 'Professioneel Imago',
    'corporate.setup_account': 'Stel Zakelijk Account In',
    
    // BBQ services
    'bbq.classic_american': 'Klassieke American BBQ',
    'bbq.traditional_grill': 'TRADITIONELE GRILL',
    'bbq.dutch_experience': 'Nederlandse BBQ Ervaring',
    'bbq.dutch_grill': 'HOLLANDSE GRILL',
    'bbq.premium_experience': 'Premium Grill Ervaring',
    'bbq.luxury_outdoor': 'LUXE OUTDOOR',
    'bbq.outdoor_excellence': 'Outdoor Excellentie',
    'bbq.outdoor_experience': 'Outdoor Ervaring',
    
    // Social events
    'social.birthday_celebrations': 'Verjaardag Vieringen',
    'social.birthday_parties': 'VERJAARDAG FEESTEN',
    'social.anniversary_parties': 'Jubileum Feesten',
    'social.anniversary_celebrations': 'JUBILEUM VIERINGEN',
    'social.family_gatherings': 'Familie Bijeenkomsten',
    'social.family_meetings': 'FAMILIE BIJEENKOMSTEN',
    'social.special_moments': 'Bijzondere Momenten',
    
    // Language toggle
    'lang.toggle_tooltip': 'Wissel naar Engels',
    'lang.current': 'Nederlands'
  },
  en: {
    // Navigation
    'nav.home': 'HOME',
    'nav.weddings': 'WEDDINGS',
    'nav.corporate': 'CORPORATE',
    'nav.social': 'SOCIAL EVENTS',
    'nav.bbq': 'BBQ CATERING',
    'nav.gallery': 'GALLERY',
    'nav.contact': 'CONTACT',
    
    // Common buttons
    'btn.book_now': 'Book Now',
    'btn.view_menu': 'View Menu',
    'btn.request_quote': 'Request Quote',
    'btn.contact_us': 'Contact Us',
    'btn.call_now': 'Call Now',
    'btn.check_availability': 'Check Availability',
    
    // Hero sections
    'hero.weddings_subtitle': 'Let\'s Connect',
    'hero.weddings_title': 'WEDDINGS',
    'hero.corporate_subtitle': 'Business Excellence',
    'hero.corporate_title': 'CORPORATE CATERING',
    'hero.bbq_subtitle': 'Fire & Flavor',
    'hero.bbq_title': 'BBQ CATERING',
    'hero.social_subtitle': 'Celebrate Life',
    'hero.social_title': 'SOCIAL EVENTS',
    'hero.contact_subtitle': 'Let\'s Connect',
    'hero.contact_title': 'CONTACT',
    
    // Service titles
    'service.weddings': 'WEDDINGS',
    'service.fresh_inspired': 'FRESH & INSPIRED',
    'service.service_styles': 'SERVICE STYLES',
    'service.venues_vendors': 'VENUES & VENDORS',
    'service.we_are_here': 'WE ARE HERE TO SERVE YOU',
    
    // Corporate services
    'corporate.executive_meetings': 'Executive Meetings',
    'corporate.boardroom_catering': 'BOARDROOM CATERING',
    'corporate.conference_catering': 'Conference Catering',
    'corporate.all_day_events': 'ALL-DAY EVENTS',
    'corporate.office_dining': 'Office Dining',
    'corporate.daily_catering': 'DAILY CATERING',
    'corporate.professional_services': 'Professional Services',
    'corporate.professional_image': 'Professional Image',
    'corporate.setup_account': 'Setup Corporate Account',
    
    // BBQ services
    'bbq.classic_american': 'Classic American BBQ',
    'bbq.traditional_grill': 'TRADITIONAL GRILL',
    'bbq.dutch_experience': 'Dutch BBQ Experience',
    'bbq.dutch_grill': 'DUTCH GRILL',
    'bbq.premium_experience': 'Premium Grill Experience',
    'bbq.luxury_outdoor': 'LUXURY OUTDOOR',
    'bbq.outdoor_excellence': 'Outdoor Excellence',
    'bbq.outdoor_experience': 'Outdoor Experience',
    
    // Social events
    'social.birthday_celebrations': 'Birthday Celebrations',
    'social.birthday_parties': 'BIRTHDAY PARTIES',
    'social.anniversary_parties': 'Anniversary Parties',
    'social.anniversary_celebrations': 'ANNIVERSARY CELEBRATIONS',
    'social.family_gatherings': 'Family Gatherings',
    'social.family_meetings': 'FAMILY GATHERINGS',
    'social.special_moments': 'Special Moments',
    
    // Language toggle
    'lang.toggle_tooltip': 'Switch to Dutch',
    'lang.current': 'English'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('nl'); // Default to Dutch

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};