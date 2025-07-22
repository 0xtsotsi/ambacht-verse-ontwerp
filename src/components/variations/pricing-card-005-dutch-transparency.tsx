import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, MapPin } from "lucide-react";
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
  type LanguageType,
} from "@/lib/pricing-card-constants";

interface PricingCardProps {
  serviceType: ServiceType;
  pricePerPerson?: number;
  tier: TierType;
  onBookNow: (serviceType: string, tier: string) => void;
  language?: LanguageType;
}

/**
 * Dutch transparency-focused pricing card with cultural localization
 * Features transparent pricing, Dutch quality messaging, and trust indicators
 */
const PricingCard005DutchTransparency: React.FC<PricingCardProps> = ({
  serviceType,
  pricePerPerson,
  tier,
  onBookNow,
  language = "nl",
}) => {
  // Input validation
  const validation = validatePricingCardProps({
    serviceType,
    tier,
    language,
    pricePerPerson,
  });
  if (!validation.isValid) {
    console.error("Invalid props:", validation.errors);
    return null;
  }

  const t = TRANSLATIONS[language];
  const colorScheme = COLOR_SCHEMES[serviceType];
  const ServiceIcon = SERVICE_ICONS[serviceType];
  const finalPrice = calculateFinalPrice(serviceType, tier);

  const dutchTranslations = {
    nl: {
      transparent: "Transparante Prijzen",
      noHiddenFees: "Geen Verborgen Kosten",
      dutchQuality: "Nederlandse Kwaliteit",
    },
    en: {
      transparent: "Transparent Pricing",
      noHiddenFees: "No Hidden Fees",
      dutchQuality: "Dutch Quality",
    },
  };
  const dt = dutchTranslations[language];

  return (
    <Card
      className={`relative ${colorScheme.bg} ${COMMON_STYLES.card} transition-all duration-300 group`}
      data-testid="transparent-pricing"
    >
      <div className="absolute -top-2 left-4 flex gap-2">
        {tier === "premium" && (
          <Badge className="bg-orange-500 text-white text-xs px-2 py-1">
            Populaire Keuze
          </Badge>
        )}
        <Badge variant="outline" className="bg-white text-xs px-2 py-1">
          {dt.transparent}
        </Badge>
      </div>

      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ServiceIcon className={`w-5 h-5 ${colorScheme.accent}`} />
            <CardTitle className="text-lg font-semibold text-gray-800">
              {t[serviceType]}
            </CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            {t[tier]}
          </Badge>
        </div>

        <div
          className={`text-center py-4 ${COMMON_STYLES.priceDisplay} border-b border-gray-200`}
          data-price
        >
          {finalPrice ? (
            <div>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-sm text-gray-600">{t.vanaf}</span>
                <span className="text-3xl font-bold text-[#CC5D00]">
                  €{finalPrice.toFixed(2)}
                </span>
                <span className="text-sm text-gray-600">{t.perPersoon}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {t.inclusief} BTW • {dt.noHiddenFees}
              </div>
            </div>
          ) : (
            <div className="text-2xl font-bold text-[#CC5D00]">
              {t.getQuote}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="space-y-3 mb-6">
          <h4 className="font-medium text-gray-800 text-sm">{t.inclusief}:</h4>
          <ul className="space-y-2">
            {SERVICE_INCLUSIONS[tier][language].map((item, index) => (
              <li key={index} className={COMMON_STYLES.inclusionItem}>
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center mb-4">
          <Badge
            variant="outline"
            className="text-xs px-3 py-1 bg-orange-50 border-orange-200 text-orange-700"
          >
            {dt.dutchQuality}
          </Badge>
        </div>

        <Button
          onClick={() => onBookNow(serviceType, tier)}
          className={`w-full ${COMMON_STYLES.primaryButton} py-3 transition-colors duration-200`}
          data-testid="book-button"
        >
          {finalPrice ? t.bookNow : t.getQuote}
        </Button>

        <div className="text-center mt-3">
          <p className="text-xs text-gray-500">{t.confirmation}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingCard005DutchTransparency;
