import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Award, Shield, ChefHat } from 'lucide-react';
import { 
  BASE_PRICES, 
  TIER_MULTIPLIERS, 
  COLOR_SCHEMES, 
  SERVICE_ICONS, 
  TRANSLATIONS, 
  SERVICE_INCLUSIONS,
  validatePricingCardProps,
  calculateFinalPrice,
  COMMON_STYLES,
  type ServiceType,
  type TierType,
  type LanguageType
} from '@/lib/pricing-card-constants';

interface PricingCardProps {
  serviceType: ServiceType;
  pricePerPerson?: number;
  tier: TierType;
  onBookNow: (serviceType: string, tier: string) => void;
  language?: LanguageType;
}

/**
 * Premium positioning pricing card with luxury design elements
 * Features metallic accents, heritage messaging, and sophisticated visual design
 */
const PricingCard009PremiumPositioning: React.FC<PricingCardProps> = ({
  serviceType,
  pricePerPerson,
  tier,
  onBookNow,
  language = 'nl'
}) => {
  // Input validation
  const validation = validatePricingCardProps({ serviceType, tier, language, pricePerPerson });
  if (!validation.isValid) {
    console.error('Invalid props:', validation.errors);
    return null;
  }

  const [isHovered, setIsHovered] = useState(false);
  const t = TRANSLATIONS[language];

  const luxuryMultipliers = { corporate: 2.2, social: 1.8, wedding: 2.0, custom: 2.5 };
  const finalPrice = calculateFinalPrice(serviceType, tier, luxuryMultipliers[serviceType]);

  const prestigeLabels = {
    corporate: 'Boardroom Prestige',
    social: 'Social Sophistication', 
    wedding: 'Bridal Elegance',
    custom: 'Artisanal Mastery'
  };

  const luxuryInclusions = {
    basis: ['🎯 Dedicated Event Coordinator', '👨‍🍳 Professional Culinary Team', '🥘 Artisanal Menu Selection', '🍽️ Premium Table Settings', '✨ Signature Presentation Style'],
    premium: ['🏆 Senior Event Director', '👨‍🍳 Master Chef Supervision', '🍾 Curated Wine Pairings', '🕯️ Ambient Lighting Design', '🎼 Coordinated Service Timing', '📞 24/7 Concierge Support'],
    luxe: ['👑 Personal Event Concierge', '⭐ Celebrity Chef Experience', '🥂 Sommelier Wine Selection', '💎 Luxury Tableware Collection', '🎭 Theatrical Presentation', '🚁 Optional Helicopter Service']
  };

  const colorScheme = COLOR_SCHEMES[serviceType];
  const ServiceIcon = SERVICE_ICONS[serviceType];

  return (
    <Card 
      className={`relative ${colorScheme.gradient} ${colorScheme.bg} ${COMMON_STYLES.card} transition-all duration-500 transform ${isHovered ? 'scale-105' : ''} overflow-hidden`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid="premium-card"
    >
      <div className={`h-2 ${colorScheme.metallic}`} data-testid="metallic-accent" />
      
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 flex gap-2">
        {tier === 'luxe' && (
          <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 px-3 py-1 text-xs font-bold shadow-lg" data-testid="premium-badge">
            <Crown className="w-3 h-3 mr-1" data-testid="crown-icon" />
            {t.luxe}
          </Badge>
        )}
        <Badge className={`bg-amber-100 text-amber-700 border-amber-300 border-2 px-3 py-1 text-xs font-semibold shadow-md`}>
          {t[tier]}
        </Badge>
      </div>

      <div className="absolute top-4 right-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-xs font-bold text-gray-700">5.0</span>
          </div>
        </div>
      </div>

      <CardHeader className="pt-8 pb-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <ServiceIcon className={`w-6 h-6 ${colorScheme.accent}`} />
            <CardTitle className="text-2xl font-bold text-gray-800">
              {t[serviceType]}
            </CardTitle>
          </div>
          
          <p className="text-sm text-gray-600 mb-4 italic">{prestigeLabels[serviceType]}</p>
          
          <div className="relative py-6">
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/80 shadow-lg" />
            <div className="relative z-10" data-testid="luxury-price">
              {finalPrice ? (
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-lg font-medium text-gray-600">{t.vanaf}</span>
                    <span className="text-5xl font-black bg-gradient-to-r from-[#CC5D00] to-[#B54A00] bg-clip-text text-transparent">
                      €{finalPrice.toFixed(2)}
                    </span>
                    <span className="text-lg text-gray-600">{t.perPersoon}</span>
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    {t.inclusief} • {t.guarantee}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-[#CC5D00] to-[#B54A00] bg-clip-text text-transparent">
                    {t.getQuote}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">Bespoke</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="space-y-4 mb-6">
          <h4 className="font-semibold text-gray-800 text-center flex items-center justify-center gap-2">
            <Award className="w-4 h-4 text-yellow-600" />
            Signature Service
          </h4>
          
          <div className="space-y-2">
            {luxuryInclusions[tier].map((item, index) => (
              <div key={index} className={COMMON_STYLES.inclusionItem}>
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 mt-2 flex-shrink-0" />
                <span className="text-gray-700 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/40 rounded-xl p-4 mb-6 border border-white/60">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-800">Sinds 1989</span>
            </div>
            <p className="text-xs text-gray-600 italic">
              "Drie generaties culinaire excellentie in Nederland"
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={() => onBookNow(serviceType, tier)}
            className={`w-full h-16 ${colorScheme.metallic} text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl`}
          >
            <div className="flex items-center justify-center gap-3">
              <ChefHat className="w-5 h-5" />
              <span>{finalPrice ? t.bookNow : t.getQuote}</span>
            </div>
          </Button>

          <div className="text-center bg-white/30 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-2">{t.concierge}</p>
            <div className="flex items-center justify-center gap-4 text-xs">
              <span className="flex items-center gap-1">📞 <strong>+31 20 123 4567</strong></span>
              <span className="flex items-center gap-1">💬 <strong>WhatsApp VIP</strong></span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            {[1,2,3,4,5].map((star) => (
              <Star key={star} className="w-4 h-4 text-yellow-500 fill-current" />
            ))}
          </div>
          <p className="text-xs text-gray-600">
            {language === 'nl' ? 'Vertrouwd door Amsterdam\'s Elite sinds 1989' : 'Trusted by Amsterdam\'s Elite since 1989'}
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <span>🏆 Michelin Recognized</span>
            <span>👑 Royal Warrant</span>
            <span>🌟 5-Star Service</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingCard009PremiumPositioning;