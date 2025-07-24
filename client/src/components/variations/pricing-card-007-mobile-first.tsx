import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Phone,
  MessageCircle,
} from "lucide-react";
import {
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
 * Mobile-first pricing card optimized for touch interactions
 * Features large touch targets, expandable details, and mobile-specific action grid
 */
const PricingCard007MobileFirst: React.FC<PricingCardProps> = ({
  serviceType,
  pricePerPerson,
  tier,
  onBookNow,
  language = "nl",
}) => {
  // All hooks must be called first
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeAction, setActiveAction] = useState<
    "book" | "call" | "whatsapp" | null
  >(null);

  // Input validation after hooks
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

  const mobileTranslations = {
    nl: {
      callNow: "Bel Direct",
      whatsapp: "WhatsApp",
      showDetails: "Toon Details",
      hideDetails: "Verberg Details",
      quickBook: "Snel Boeken",
    },
    en: {
      callNow: "Call Now",
      whatsapp: "WhatsApp",
      showDetails: "Show Details",
      hideDetails: "Hide Details",
      quickBook: "Quick Book",
    },
  };
  const mt = mobileTranslations[language];

  const serviceConfig = {
    corporate: {
      basePrice: 12.5,
      color: "bg-blue-50 border-blue-200",
      gradientFrom: "from-blue-400",
      gradientTo: "to-blue-600",
      icon: "🏢",
      emoji: "💼",
    },
    social: {
      basePrice: 27.5,
      color: "bg-green-50 border-green-200",
      gradientFrom: "from-green-400",
      gradientTo: "to-green-600",
      icon: "🎉",
      emoji: "🎊",
    },
    wedding: {
      basePrice: 22.5,
      color: "bg-pink-50 border-pink-200",
      gradientFrom: "from-pink-400",
      gradientTo: "to-pink-600",
      icon: "💒",
      emoji: "💐",
    },
    custom: {
      basePrice: null,
      color: "bg-purple-50 border-purple-200",
      gradientFrom: "from-purple-400",
      gradientTo: "to-purple-600",
      icon: "✨",
      emoji: "🎨",
    },
  };

  const tierMultipliers = {
    basis: 1.0,
    premium: 1.4,
    luxe: 1.8,
  };

  const config = serviceConfig[serviceType];
  const finalPrice = config.basePrice
    ? config.basePrice * tierMultipliers[tier]
    : null;

  const inclusions = {
    basis: [
      language === "nl" ? "Professionele bediening" : "Professional service",
      language === "nl" ? "Verse ingrediënten" : "Fresh ingredients",
      language === "nl" ? "Standaard presentatie" : "Standard presentation",
      language === "nl" ? "Basis serviesgoed" : "Basic tableware",
    ],
    premium: [
      language === "nl" ? "Uitgebreide bediening" : "Extended service",
      language === "nl" ? "Premium ingrediënten" : "Premium ingredients",
      language === "nl" ? "Elegante presentatie" : "Elegant presentation",
      language === "nl" ? "Premium serviesgoed" : "Premium tableware",
      language === "nl" ? "Extra gerechten" : "Additional dishes",
    ],
    luxe: [
      language === "nl" ? "Persoonlijke chef" : "Personal chef",
      language === "nl" ? "Luxe ingrediënten" : "Luxury ingredients",
      language === "nl" ? "Exclusieve presentatie" : "Exclusive presentation",
      language === "nl" ? "Designer serviesgoed" : "Designer tableware",
      language === "nl" ? "Volledige verzorging" : "Full service",
      language === "nl" ? "Live cooking" : "Live cooking",
    ],
  };

  return (
    <Card
      className={`relative ${config.color} border-2 hover:shadow-lg transition-all duration-300 max-w-sm mx-auto`}
    >
      {/* Mobile Header with Visual Hierarchy */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{config.icon}</div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-800 leading-tight">
                {t[serviceType as keyof typeof t]}
              </CardTitle>
              <Badge variant="secondary" className="text-xs mt-1">
                {t[tier as keyof typeof t]}
                {tier === "premium" && (
                  <Star className="w-3 h-3 ml-1 fill-current" />
                )}
              </Badge>
            </div>
          </div>
          {tier === "premium" && (
            <Badge className="bg-orange-500 text-white text-xs px-2 py-1">
              {t.popular}
            </Badge>
          )}
        </div>

        {/* Large, Touch-Friendly Pricing */}
        <div
          className={`text-center py-6 bg-gradient-to-r ${config.gradientFrom} ${config.gradientTo} rounded-xl text-white shadow-md`}
        >
          {finalPrice ? (
            <div>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-lg font-medium opacity-90">
                  {t.vanaf}
                </span>
                <span className="text-4xl font-black">
                  €{finalPrice.toFixed(2)}
                </span>
                <span className="text-lg opacity-90">{t.perPersoon}</span>
              </div>
              <div className="text-sm opacity-90 mt-1">{t.inclusief} BTW</div>
            </div>
          ) : (
            <div className="text-2xl font-bold">{t.getQuote}</div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Expandable Details - Mobile Optimized */}
        <div className="mb-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full p-3 bg-white/60 rounded-lg border border-gray-200 hover:bg-white/80 transition-colors"
            style={{ minHeight: "48px" }} // 48px minimum touch target
          >
            <span className="font-medium text-gray-800 text-sm">
              {t.inclusief} ({inclusions[tier].length} items)
            </span>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {isExpanded && (
            <div className="mt-3 space-y-2 pl-2">
              {inclusions[tier].map((item, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Action Grid - Large Touch Targets */}
        <div className="space-y-3">
          {/* Primary Action */}
          <Button
            onClick={() => {
              setActiveAction("book");
              onBookNow(serviceType, tier);
            }}
            className={`w-full h-14 bg-[#CC5D00] hover:bg-[#B54A00] text-white font-semibold text-lg transition-all duration-200 ${
              activeAction === "book" ? "scale-95" : "hover:scale-105"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl">{config.emoji}</span>
              {finalPrice ? t.bookNow : t.getQuote}
            </div>
          </Button>

          {/* Secondary Actions Grid */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => setActiveAction("call")}
              className={`h-12 border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium transition-all duration-200 ${
                activeAction === "call" ? "scale-95" : "hover:scale-105"
              }`}
            >
              <Phone className="w-4 h-4 mr-2" />
              {t.callNow}
            </Button>

            <Button
              variant="outline"
              onClick={() => setActiveAction("whatsapp")}
              className={`h-12 border-2 border-green-200 bg-green-50 hover:bg-green-100 text-green-700 font-medium transition-all duration-200 ${
                activeAction === "whatsapp" ? "scale-95" : "hover:scale-105"
              }`}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>

        {/* Mobile Trust Footer */}
        <div className="text-center mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-gray-700">4.9/5</span>
            <span className="text-xs text-gray-500">• 500+ events</span>
          </div>
          <p className="text-xs text-gray-600">
            {language === "nl"
              ? "Bevestiging binnen 4 uur"
              : "Confirmation within 4 hours"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingCard007MobileFirst;
