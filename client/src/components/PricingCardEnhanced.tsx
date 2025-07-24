// V5 Interactive Elegance - Enhanced Pricing Card with €12.50/person Corporate Pricing
// Consolidated from Epic 2 task_002_1-pricing-cards branch
import React, { useState, useEffect, memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  Zap,
  TrendingUp,
  AlertCircle,
  Gift,
} from "lucide-react";
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
  type LanguageType,
} from "@/lib/pricing-card-constants";

interface PricingCardEnhancedProps {
  serviceType: ServiceType;
  pricePerPerson?: number;
  tier: TierType;
  onBookNow: (serviceType: string, tier: string) => void;
  language?: LanguageType;
  variant?: "urgency" | "social-proof" | "value" | "scarcity";
}

/**
 * Enhanced pricing card with V5 Interactive Elegance animations
 * Features conversion optimization, urgency timers, social proof, and €12.50/person corporate pricing
 */
const PricingCardEnhanced: React.FC<PricingCardEnhancedProps> = memo(
  ({
    serviceType,
    pricePerPerson,
    tier,
    onBookNow,
    language = "nl",
    variant = "urgency",
  }) => {
    // React hooks must be called before any conditional returns
    const [timeLeft, setTimeLeft] = useState(3600);
    const [peopleViewing, setPeopleViewing] = useState(
      Math.floor(Math.random() * 8) + 3,
    );
    const [recentBookings, setRecentBookings] = useState(
      Math.floor(Math.random() * 5) + 2,
    );
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
      const timer = setInterval(
        () => setTimeLeft((prev) => (prev > 0 ? prev - 1 : 3600)),
        1000,
      );
      const viewingTimer = setInterval(
        () => setPeopleViewing(Math.floor(Math.random() * 8) + 3),
        15000,
      );
      return () => {
        clearInterval(timer);
        clearInterval(viewingTimer);
      };
    }, []);

    // Input validation after all hooks
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

    const formatTime = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes}:${secs.toString().padStart(2, "0")}`;
    };

    const t = TRANSLATIONS[language];
    const colorScheme = COLOR_SCHEMES[serviceType];
    const finalPrice = calculateFinalPrice(serviceType, tier);
    const originalPrice = finalPrice ? finalPrice * 1.2 : null;

    const conversionTranslations = {
      nl: {
        limitedTime: "Beperkte Tijd",
        peopleViewing: "mensen bekijken dit nu",
        recentBookings: "boekingen vandaag",
        guarantee: "100% Tevredenheidsgarantie",
        instantConfirmation: "Directe Bevestiging",
        popularChoice: "Populaire Keuze",
        valueAdd: "EXTRA WAARDE",
        saveToday: "Bespaar Vandaag",
        limitedAvailability: "Beperkte Beschikbaarheid",
        freeQuote: "GRATIS Offerte",
      },
      en: {
        limitedTime: "Limited Time",
        peopleViewing: "people viewing now",
        recentBookings: "bookings today",
        guarantee: "100% Satisfaction Guarantee",
        instantConfirmation: "Instant Confirmation",
        popularChoice: "Popular Choice",
        valueAdd: "EXTRA VALUE",
        saveToday: "Save Today",
        limitedAvailability: "Limited Availability",
        freeQuote: "FREE Quote",
      },
    };
    const ct = conversionTranslations[language];

    const savingsPercentage = {
      corporate: "15%",
      social: "20%",
      wedding: "25%",
      custom: "30%",
    };
    const ctaColors = {
      corporate: "bg-blue-600 hover:bg-blue-700",
      social: "bg-green-600 hover:bg-green-700",
      wedding: "bg-pink-600 hover:bg-pink-700",
      custom: "bg-purple-600 hover:bg-purple-700",
    };

    const getVariantElements = () => {
      switch (variant) {
        case "urgency":
          return (
            <div className="bg-red-500 text-white text-center py-2 px-3 rounded-lg mb-3 animate-interactive-pulse-glow">
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 animate-interactive-bounce" />
                <span className="text-sm font-bold">
                  {ct.limitedTime}: {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          );

        case "social-proof":
          return (
            <div className="bg-green-50 border border-green-200 text-center py-2 px-3 rounded-lg mb-3 animate-interactive-slide-up">
              <div className="text-xs text-green-700">
                🔥 {peopleViewing} {ct.peopleViewing} • {recentBookings}{" "}
                {ct.recentBookings}
              </div>
            </div>
          );

        case "scarcity":
          return (
            <div className="bg-orange-50 border border-orange-200 text-center py-2 px-3 rounded-lg mb-3 animate-interactive-shimmer">
              <div className="flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600" />
                <span className="text-xs text-orange-700 font-medium">
                  {ct.limitedAvailability}
                </span>
              </div>
            </div>
          );

        default: // value
          return (
            <div className="bg-green-500 text-white text-center py-2 px-3 rounded-lg mb-3 animate-interactive-bounce">
              <div className="flex items-center justify-center gap-2">
                <Gift className="w-4 h-4" />
                <span className="text-sm font-bold">
                  {ct.valueAdd} - {ct.saveToday}{" "}
                  {savingsPercentage[serviceType]}
                </span>
              </div>
            </div>
          );
      }
    };

    return (
      <Card
        className={`relative ${colorScheme.gradient} ${COMMON_STYLES?.card || "shadow-elegant-soft border-2"} transition-all duration-700 transform hover:scale-105 hover:-translate-y-2 hover:shadow-elegant-panel animate-interactive-slide-up ${isHovered ? "animate-interactive-pulse-glow" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div data-testid="countdown-timer">{getVariantElements()}</div>

        {tier === "premium" && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-terracotta-600 text-white px-4 py-1 text-xs font-bold shadow-elegant-deep animate-interactive-bounce">
              ⭐ {ct.popularChoice}
            </Badge>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="text-center">
            <CardTitle className="text-xl font-bold text-elegant-dark mb-2 group-hover:animate-interactive-shimmer">
              {t[serviceType]}
            </CardTitle>

            {/* V5 Enhanced Pricing Display with Terracotta Theme */}
            <div className="relative">
              {originalPrice && (
                <div className="text-lg text-elegant-grey-500 line-through mb-1">
                  €{originalPrice.toFixed(2)} {t.perPersoon}
                </div>
              )}

              <div className="text-center py-4 bg-white/90 backdrop-blur-md rounded-2xl border-2 border-terracotta-500 shadow-elegant-panel">
                {finalPrice ? (
                  <div>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-lg text-elegant-grey-600 font-medium">
                        {t.vanaf}
                      </span>
                      <span className="text-5xl font-black text-terracotta-600">
                        €{finalPrice.toFixed(2)}
                      </span>
                      <span className="text-lg text-elegant-grey-600">
                        {t.perPersoon}
                      </span>
                    </div>

                    {originalPrice && (
                      <div className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold mt-2 animate-interactive-bounce">
                        BESPAAR €{(originalPrice - finalPrice).toFixed(2)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-3xl font-bold text-terracotta-600">
                    {ct.freeQuote}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          {/* Key Benefits - V5 Enhanced with Animations */}
          <div className="space-y-2 mb-4">
            <div
              className="flex items-center gap-2 text-sm font-medium text-green-700 animate-interactive-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              <CheckCircle className="w-4 h-4" />
              <span>✅ {ct.guarantee}</span>
            </div>
            <div
              className="flex items-center gap-2 text-sm font-medium text-blue-700 animate-interactive-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              <Zap className="w-4 h-4" />
              <span>⚡ {ct.instantConfirmation}</span>
            </div>
            <div
              className="flex items-center gap-2 text-sm font-medium text-purple-700 animate-interactive-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              <TrendingUp className="w-4 h-4" />
              <span>📈 4.9/5 Sterren (500+ Reviews)</span>
            </div>
          </div>

          {/* V5 Enhanced CTA with Interactive Animations */}
          <div className="space-y-3">
            <Button
              onClick={() => onBookNow(serviceType, tier)}
              variant="interactive-primary"
              size="elegant-lg"
              className={`w-full h-16 ${ctaColors[serviceType]} text-white font-black text-lg transition-all duration-700 transform hover:scale-105 shadow-elegant-panel hover:shadow-elegant-deep animate-interactive-bounce hover:animate-none`}
              data-testid="conversion-cta"
            >
              <div className="flex flex-col items-center">
                <span className="text-xl relative z-10">
                  {finalPrice ? t.bookNow : t.getQuote}
                </span>
                <span className="text-xs opacity-90">
                  {variant === "urgency"
                    ? `⏰ ${formatTime(timeLeft)} OVER`
                    : "🚀 DIRECT BEVESTIGD"}
                </span>
              </div>
            </Button>

            {/* Secondary Action with V5 Styling */}
            <div className="text-center">
              <p className="text-xs text-elegant-grey-600 mb-2">
                {language === "nl"
                  ? "Of bel voor directe hulp:"
                  : "Or call for immediate help:"}
              </p>
              <Button
                variant="interactive-outline"
                size="elegant-lg"
                className="w-full group"
              >
                <span className="relative z-10">📞 +31 20 123 4567</span>
              </Button>
            </div>
          </div>

          {/* Trust Signals Footer with V5 Styling */}
          <div className="mt-4 text-center space-y-2">
            <div className="flex items-center justify-center gap-4 text-xs text-elegant-grey-600">
              <span>🛡️ SSL Beveiligd</span>
              <span>💳 Veilig Betalen</span>
              <span>📞 24/7 Support</span>
            </div>

            {variant === "social-proof" && (
              <div className="bg-terracotta-50 border border-terracotta-200 rounded-2xl p-3 text-xs text-terracotta-700 animate-interactive-slide-up">
                💬 "Fantastische service, precies op tijd!" - Recent review
              </div>
            )}
          </div>

          {/* V5 Hover Glow Effect */}
          {isHovered && (
            <div className="absolute inset-0 bg-gradient-to-br from-terracotta-400/10 via-transparent to-terracotta-400/10 rounded-3xl animate-interactive-pulse-glow pointer-events-none"></div>
          )}
        </CardContent>
      </Card>
    );
  },
);

PricingCardEnhanced.displayName = "PricingCardEnhanced";

export default PricingCardEnhanced;
