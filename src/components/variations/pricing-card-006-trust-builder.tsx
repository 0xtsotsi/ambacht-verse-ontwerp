import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Shield, Star, Award } from "lucide-react";
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
 * Trust-focused pricing card with social proof and credibility indicators
 * Features trust badges, testimonials, and satisfaction guarantees
 */
const PricingCard006TrustBuilder: React.FC<PricingCardProps> = ({
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

  const trustTranslations = {
    nl: {
      trusted: "Vertrouwd",
      satisfied: "98% Tevreden",
      since: "Sinds 1989",
      guarantee: "100% Betrouwbaarheidsgarantie",
      testimonial: "Geweldige service, precies wat we nodig hadden!",
      reviewer: "Maria van der Berg",
    },
    en: {
      trusted: "Trusted",
      satisfied: "98% Satisfied",
      since: "Since 1989",
      guarantee: "100% Reliability Guarantee",
      testimonial: "Great service, exactly what we needed!",
      reviewer: "Maria van den Berg",
    },
  };
  const tt = trustTranslations[language];

  const trustMetrics = {
    corporate: "250+ Zakelijke Events",
    social: "300+ Sociale Events",
    wedding: "150+ Bruiloften",
    custom: "200+ Unieke Events",
  };

  return (
    <Card
      className={`relative ${colorScheme.gradient} ${COMMON_STYLES.card} transition-all duration-300 hover:scale-105`}
      data-testid="pricing-card"
    >
      <div className="absolute top-4 right-4" data-testid="trust-badge">
        <div className="bg-green-500 text-white rounded-full p-2 shadow-lg">
          <Shield className="w-4 h-4" />
        </div>
      </div>

      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ServiceIcon className={`w-5 h-5 ${colorScheme.accent}`} />
            <CardTitle className="text-lg font-semibold text-gray-800">
              {t[serviceType]}
            </CardTitle>
          </div>
          <Badge className="bg-green-100 text-green-700 text-xs">
            {tt.trusted}
          </Badge>
        </div>

        <div className="space-y-2 mt-3">
          <div className="flex items-center gap-2" data-testid="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-4 h-4 text-yellow-500 fill-current"
              />
            ))}
            <span className="text-sm font-medium text-gray-700">4.9</span>
          </div>
          <p className="text-xs text-gray-600">
            {tt.satisfied} • {tt.since}
          </p>
        </div>

        <div className={`text-center py-4 ${COMMON_STYLES.priceDisplay} mt-4`}>
          {finalPrice ? (
            <div>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-sm text-gray-600">{t.vanaf}</span>
                <span className="text-3xl font-bold text-[#CC5D00]">
                  €{finalPrice.toFixed(2)}
                </span>
                <span className="text-sm text-gray-600">{t.perPersoon}</span>
              </div>
            </div>
          ) : (
            <div className="text-2xl font-bold text-[#CC5D00]">
              {t.getQuote}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="space-y-3 mb-4">
          <h4 className="font-medium text-gray-800 text-sm flex items-center gap-2">
            <Award className="w-4 h-4 text-yellow-600" />
            {t.inclusief}:
          </h4>
          <ul className="space-y-2">
            {SERVICE_INCLUSIONS[tier][language].map((item, index) => (
              <li key={index} className={COMMON_STYLES.inclusionItem}>
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
          <p className="text-xs text-yellow-800 italic">"{tt.testimonial}"</p>
          <p className="text-xs text-yellow-700 mt-1 font-medium">
            - {tt.reviewer}
          </p>
        </div>

        <div className="text-center mb-4" data-testid="trust-signals">
          <Badge
            variant="outline"
            className="text-xs px-3 py-1 bg-green-50 border-green-200 text-green-700"
          >
            {tt.guarantee}
          </Badge>
        </div>

        <Button
          onClick={() => onBookNow(serviceType, tier)}
          className={`w-full ${COMMON_STYLES.primaryButton} py-3 transition-colors duration-200`}
        >
          {finalPrice ? t.bookNow : t.getQuote}
        </Button>

        <div className="text-center mt-3 space-y-1">
          <p className="text-xs text-gray-500">
            {trustMetrics[serviceType]} • {tt.guarantee}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingCard006TrustBuilder;
