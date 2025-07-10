import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Zap, TrendingUp, AlertCircle, Gift } from 'lucide-react';
import { 
  BASE_PRICES, 
  TIER_MULTIPLIERS, 
  COLOR_SCHEMES, 
  TRANSLATIONS, 
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
  variant?: 'urgency' | 'social-proof' | 'value' | 'scarcity';
}

/**
 * Conversion-optimized pricing card with A/B test variants
 * Features urgency timers, social proof, scarcity messaging, and value propositions
 */
const PricingCard008ConversionOptimized: React.FC<PricingCardProps> = ({
  serviceType,
  pricePerPerson,
  tier,
  onBookNow,
  language = 'nl',
  variant = 'urgency'
}) => {
  // All hooks must be called first
  const [timeLeft, setTimeLeft] = useState(3600);
  const [peopleViewing, setPeopleViewing] = useState(Math.floor(Math.random() * 8) + 3);
  const [recentBookings, setRecentBookings] = useState(Math.floor(Math.random() * 5) + 2);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((prev) => (prev > 0 ? prev - 1 : 3600)), 1000);
    const viewingTimer = setInterval(() => setPeopleViewing(Math.floor(Math.random() * 8) + 3), 15000);
    return () => { clearInterval(timer); clearInterval(viewingTimer); };
  }, []);

  // Input validation after hooks
  const validation = validatePricingCardProps({ serviceType, tier, language, pricePerPerson });
  if (!validation.isValid) {
    console.error('Invalid props:', validation.errors);
    return null;
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const t = TRANSLATIONS[language];
  const colorScheme = COLOR_SCHEMES[serviceType];
  const finalPrice = calculateFinalPrice(serviceType, tier);
  const originalPrice = finalPrice ? finalPrice * 1.2 : null;

  const conversionTranslations = {
    nl: {
      limitedTime: 'Beperkte Tijd', peopleViewing: 'mensen bekijken dit nu', recentBookings: 'boekingen vandaag',
      guarantee: '100% Tevredenheidsgarantie', instantConfirmation: 'Directe Bevestiging',
      popularChoice: 'Populaire Keuze', valueAdd: 'EXTRA WAARDE', saveToday: 'Bespaar Vandaag',
      limitedAvailability: 'Beperkte Beschikbaarheid', freeQuote: 'GRATIS Offerte'
    },
    en: {
      limitedTime: 'Limited Time', peopleViewing: 'people viewing now', recentBookings: 'bookings today',
      guarantee: '100% Satisfaction Guarantee', instantConfirmation: 'Instant Confirmation',
      popularChoice: 'Popular Choice', valueAdd: 'EXTRA VALUE', saveToday: 'Save Today',
      limitedAvailability: 'Limited Availability', freeQuote: 'FREE Quote'
    }
  };
  const ct = conversionTranslations[language];

  const savingsPercentage = { corporate: '15%', social: '20%', wedding: '25%', custom: '30%' };
  const ctaColors = { 
    corporate: 'bg-blue-600 hover:bg-blue-700', social: 'bg-green-600 hover:bg-green-700',
    wedding: 'bg-pink-600 hover:bg-pink-700', custom: 'bg-purple-600 hover:bg-purple-700'
  };

  const getVariantElements = () => {
    switch (variant) {
      case 'urgency':
        return (
          <div className="bg-red-500 text-white text-center py-2 px-3 rounded-lg mb-3 animate-pulse">
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-bold">{ct.limitedTime}: {formatTime(timeLeft)}</span>
            </div>
          </div>
        );
      
      case 'social-proof':
        return (
          <div className="bg-green-50 border border-green-200 text-center py-2 px-3 rounded-lg mb-3">
            <div className="text-xs text-green-700">
              🔥 {peopleViewing} {ct.peopleViewing} • {recentBookings} {ct.recentBookings}
            </div>
          </div>
        );
      
      case 'scarcity':
        return (
          <div className="bg-orange-50 border border-orange-200 text-center py-2 px-3 rounded-lg mb-3">
            <div className="flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              <span className="text-xs text-orange-700 font-medium">{ct.limitedAvailability}</span>
            </div>
          </div>
        );
      
      default: // value
        return (
          <div className="bg-green-500 text-white text-center py-2 px-3 rounded-lg mb-3">
            <div className="flex items-center justify-center gap-2">
              <Gift className="w-4 h-4" />
              <span className="text-sm font-bold">{ct.valueAdd} - {ct.saveToday} {savingsPercentage[serviceType]}</span>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className={`relative ${colorScheme.gradient} ${COMMON_STYLES.card} transition-all duration-300 transform hover:scale-105`}>
      <div data-testid="countdown-timer">{getVariantElements()}</div>

      {tier === 'premium' && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-[#CC5D00] text-white px-4 py-1 text-xs font-bold shadow-lg animate-bounce">
            ⭐ {ct.popularChoice}
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="text-center">
          <CardTitle className="text-xl font-bold text-gray-800 mb-2">
{t[serviceType]}
          </CardTitle>
          
          {/* Conversion-Focused Pricing Display */}
          <div className="relative">
            {originalPrice && (
              <div className="text-lg text-gray-400 line-through mb-1">
                €{originalPrice.toFixed(2)} {t.perPersoon}
              </div>
            )}
            
            <div className="text-center py-4 bg-white/80 rounded-xl border-2 border-[#CC5D00] shadow-lg">
              {finalPrice ? (
                <div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-lg text-gray-600 font-medium">{t.vanaf}</span>
                    <span className="text-5xl font-black text-[#CC5D00]">€{finalPrice.toFixed(2)}</span>
                    <span className="text-lg text-gray-600">{t.perPersoon}</span>
                  </div>
                  
                  {originalPrice && (
                    <div className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold mt-2">
                      BESPAAR €{(originalPrice - finalPrice).toFixed(2)}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-3xl font-bold text-[#CC5D00]">
{ct.freeQuote}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {/* Key Benefits - Conversion Focused */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm font-medium text-green-700">
            <CheckCircle className="w-4 h-4" />
            <span>✅ {ct.guarantee}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
            <Zap className="w-4 h-4" />
            <span>⚡ {ct.instantConfirmation}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-purple-700">
            <TrendingUp className="w-4 h-4" />
            <span>📈 4.9/5 Sterren (500+ Reviews)</span>
          </div>
        </div>

        {/* Urgency-Driven CTA */}
        <div className="space-y-3">
          <Button 
            onClick={() => onBookNow(serviceType, tier)}
            className={`w-full h-16 ${ctaColors[serviceType]} text-white font-black text-lg transition-all duration-200 transform hover:scale-105 shadow-xl hover:shadow-2xl`}
            data-testid="conversion-cta"
          >
            <div className="flex flex-col items-center">
              <span className="text-xl">{finalPrice ? t.bookNow : t.getQuote}</span>
              <span className="text-xs opacity-90">
                {variant === 'urgency' ? `⏰ ${formatTime(timeLeft)} OVER` : '🚀 DIRECT BEVESTIGD'}
              </span>
            </div>
          </Button>

          {/* Secondary Action with Urgency */}
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-2">
              {language === 'nl' ? 'Of bel voor directe hulp:' : 'Or call for immediate help:'}
            </p>
            <Button 
              variant="outline" 
              className="w-full border-2 border-[#CC5D00] text-[#CC5D00] hover:bg-[#CC5D00] hover:text-white font-bold"
            >
              📞 +31 20 123 4567
            </Button>
          </div>
        </div>

        {/* Trust Signals Footer */}
        <div className="mt-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
            <span>🛡️ SSL Beveiligd</span>
            <span>💳 Veilig Betalen</span>
            <span>📞 24/7 Support</span>
          </div>
          
          {variant === 'social-proof' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-xs text-yellow-800">
              💬 "Fantastische service, precies op tijd!" - Recent review
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingCard008ConversionOptimized;