import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Calculator, Euro, ArrowRight, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  useLifecycleLogger,
  useStateLogger,
  useRenderLogger,
  usePerformanceLogger,
} from "@/hooks/useComponentLogger";
import { UserFlowLogger, ComponentLogger } from "@/lib/logger";
import {
  QUOTE_SERVICE_CATEGORIES,
  QUOTE_SERVICE_TIERS,
  QUOTE_ADD_ONS,
  QUOTE_GUEST_CONFIG,
  QUOTE_TRANSLATIONS,
  QUOTE_CALCULATOR_STYLES,
  validateQuoteCalculatorProps,
  calculateTotalQuote,
  type QuoteServiceCategory,
  type QuoteServiceTier,
  type QuoteAddOn,
} from "@/lib/quote-calculator-constants";
import { renderServiceCategories, renderServiceTiers } from "@/components/QuoteCalculator/QuoteRenderers";
import { type QuoteBreakdown } from "@/lib/quote-calculations";

interface PreliminaryQuoteCalculatorProps {
  onRequestDetailedQuote?: (quote: QuoteBreakdown) => void;
  initialGuestCount?: number;
}

/**
 * Preliminary quote calculator with step-by-step configuration
 * Refactored to comply with 300 LOC limit and ≤4 parameters per function
 */
export function PreliminaryQuoteCalculator({
  onRequestDetailedQuote,
  initialGuestCount = QUOTE_GUEST_CONFIG.default,
}: PreliminaryQuoteCalculatorProps) {
  // All hooks must be called first
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] =
    useState<QuoteServiceCategory>("corporate");
  const [selectedTier, setSelectedTier] = useState<QuoteServiceTier>("premium");
  const [guestCount, setGuestCount] = useState([initialGuestCount]);
  const [selectedAddOns, setSelectedAddOns] = useState<QuoteAddOn[]>([]);
  const [step, setStep] = useState(1);
  const [quote, setQuote] = useState<QuoteBreakdown | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Logging setup
  useLifecycleLogger({
    componentName: "PreliminaryQuoteCalculator",
    props: { initialGuestCount, hasQuoteCallback: !!onRequestDetailedQuote },
    enablePropLogging: true,
  });

  const { logStateChange: logCategoryChange } =
    useStateLogger<QuoteServiceCategory>({
      componentName: "PreliminaryQuoteCalculator",
      stateName: "selectedCategory",
    });

  const { logStateChange: logTierChange } = useStateLogger<QuoteServiceTier>({
    componentName: "PreliminaryQuoteCalculator",
    stateName: "selectedTier",
  });

  const { logStateChange: logGuestCountChange } = useStateLogger<number[]>({
    componentName: "PreliminaryQuoteCalculator",
    stateName: "guestCount",
  });

  const { logStateChange: logStepChange } = useStateLogger<number>({
    componentName: "PreliminaryQuoteCalculator",
    stateName: "step",
  });

  const renderInfo = useRenderLogger({
    componentName: "PreliminaryQuoteCalculator",
    dependencies: [
      selectedCategory,
      selectedTier,
      guestCount,
      selectedAddOns,
      step,
      quote,
      isCalculating,
    ],
  });

  const { getPerformanceStats } = usePerformanceLogger({
    componentName: "PreliminaryQuoteCalculator",
    slowRenderThreshold: 25,
  });

  // State change logging effects
  useEffect(() => {
    logCategoryChange(selectedCategory, "category_selection");
  }, [selectedCategory, logCategoryChange]);

  useEffect(() => {
    logTierChange(selectedTier, "tier_selection");
  }, [selectedTier, logTierChange]);

  useEffect(() => {
    logGuestCountChange(guestCount, "guest_count_slider");
  }, [guestCount, logGuestCountChange]);

  useEffect(() => {
    logStepChange(step, "step_navigation");
  }, [step, logStepChange]);

  // Calculate quote when form changes
  useEffect(() => {
    setIsCalculating(true);
    ComponentLogger.stateChange(
      "PreliminaryQuoteCalculator",
      false,
      true,
      "quote_calculation_started",
    );

    setTimeout(() => {
      try {
        const calculatedQuote = calculateTotalQuote(
          selectedCategory,
          selectedTier,
          guestCount[0],
          selectedAddOns,
        );
        setQuote(calculatedQuote);
        ComponentLogger.stateChange(
          "PreliminaryQuoteCalculator",
          null,
          calculatedQuote,
          "quote_calculation_completed",
        );

        UserFlowLogger.interaction(
          "quote_calculated",
          "PreliminaryQuoteCalculator",
          {
            category: selectedCategory,
            tier: selectedTier,
            guestCount: guestCount[0],
            addOns: selectedAddOns,
            totalPrice: calculatedQuote?.total,
          },
        );
      } catch (error) {
        console.error("Quote calculation error:", error);
        setQuote(null);
        UserFlowLogger.error(
          "quote_calculation_error",
          "Failed to calculate quote",
          {
            error,
            selectedCategory,
            selectedTier,
            guestCount: guestCount[0],
            selectedAddOns,
          },
        );
      }
      setIsCalculating(false);
      ComponentLogger.stateChange(
        "PreliminaryQuoteCalculator",
        true,
        false,
        "quote_calculation_finished",
      );
    }, 300);
  }, [selectedCategory, selectedTier, guestCount, selectedAddOns]);

  // Input validation after all hooks
  const validation = validateQuoteCalculatorProps({
    initialGuestCount,
    onRequestDetailedQuote,
  });
  if (!validation.isValid) {
    console.error("Invalid props:", validation.errors);
    return null;
  }

  const t = QUOTE_TRANSLATIONS.nl;

  const handleCategorySelect = (categoryId: QuoteServiceCategory) => {
    try {
      const previousCategory = selectedCategory;
      setSelectedCategory(categoryId);
      setStep(2);

      UserFlowLogger.interaction(
        "category_selected",
        "PreliminaryQuoteCalculator",
        {
          previousCategory,
          newCategory: categoryId,
          categoryLabel: QUOTE_SERVICE_CATEGORIES[categoryId].label,
        },
      );

      toast({
        title: "Geweldige keuze!",
        description: `${QUOTE_SERVICE_CATEGORIES[categoryId].label} geselecteerd.`,
        duration: 2000,
      });
    } catch (error) {
      console.error("Category selection error:", error);
      UserFlowLogger.error(
        "category_selection_error",
        "Failed to select category",
        { error, categoryId },
      );
    }
  };

  const handleTierSelect = (tierId: QuoteServiceTier) => {
    try {
      const previousTier = selectedTier;
      setSelectedTier(tierId);
      setStep(3);

      UserFlowLogger.interaction(
        "tier_selected",
        "PreliminaryQuoteCalculator",
        {
          previousTier,
          newTier: tierId,
          tierLabel: QUOTE_SERVICE_TIERS[tierId].label,
        },
      );
    } catch (error) {
      console.error("Tier selection error:", error);
      UserFlowLogger.error("tier_selection_error", "Failed to select tier", {
        error,
        tierId,
      });
    }
  };

  const handleAddOnToggle = (addonId: QuoteAddOn) => {
    try {
      const wasSelected = selectedAddOns.includes(addonId);
      setSelectedAddOns((prev) =>
        prev.includes(addonId)
          ? prev.filter((id) => id !== addonId)
          : [...prev, addonId],
      );

      UserFlowLogger.interaction(
        wasSelected ? "addon_deselected" : "addon_selected",
        "PreliminaryQuoteCalculator",
        {
          addonId,
          addonLabel: QUOTE_ADD_ONS[addonId].label,
          totalAddOns: wasSelected
            ? selectedAddOns.length - 1
            : selectedAddOns.length + 1,
        },
      );
    } catch (error) {
      console.error("Add-on toggle error:", error);
      UserFlowLogger.error("addon_toggle_error", "Failed to toggle add-on", {
        error,
        addonId,
      });
    }
  };

  const handleRequestDetailedQuote = () => {
    if (quote) {
      onRequestDetailedQuote?.(quote);
      toast({
        title: "Offerte aangevraagd!",
        description: "We stellen uw gepersonaliseerde offerte samen.",
        duration: 3000,
      });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Calculator className="w-8 h-8 text-burnt-orange" />
          <h2 className="text-4xl font-serif text-forest-green">{t.title}</h2>
        </div>
        <p className="text-lg text-forest-green/80 max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Service Category */}
          <Card className={QUOTE_CALCULATOR_STYLES.card}>
            <CardHeader className={QUOTE_CALCULATOR_STYLES.header}>
              <h3 className="text-xl font-serif">{t.serviceCategory}</h3>
            </CardHeader>
            <CardContent>
              {renderServiceCategories(selectedCategory, handleCategorySelect)}
            </CardContent>
          </Card>

          {/* Step 2: Service Tier */}
          {step >= 2 && (
            <Card className={QUOTE_CALCULATOR_STYLES.card}>
              <CardHeader className={QUOTE_CALCULATOR_STYLES.header}>
                <h3 className="text-xl font-serif">{t.serviceTier}</h3>
              </CardHeader>
              <CardContent>
                {renderServiceTiers(selectedTier, handleTierSelect)}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Guest Count */}
          {step >= 3 && (
            <Card className={QUOTE_CALCULATOR_STYLES.card}>
              <CardHeader className={QUOTE_CALCULATOR_STYLES.header}>
                <h3 className="text-xl font-serif">{t.guestCount}</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <span className="text-2xl font-bold">
                    {guestCount[0]} {t.guests}
                  </span>
                </div>
                <Slider
                  value={guestCount}
                  onValueChange={setGuestCount}
                  min={QUOTE_GUEST_CONFIG.min}
                  max={QUOTE_GUEST_CONFIG.max}
                  step={QUOTE_GUEST_CONFIG.step}
                  className="w-full"
                />
                <div className="grid grid-cols-6 gap-2">
                  {QUOTE_GUEST_CONFIG.presets.map((count) => (
                    <Button
                      key={count}
                      variant="outline"
                      size="sm"
                      onClick={() => setGuestCount([count])}
                      className={cn(
                        "transition-colors",
                        guestCount[0] === count && "border-blue-500 bg-blue-50",
                      )}
                    >
                      {count}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Add-ons */}
          <Card className={QUOTE_CALCULATOR_STYLES.card}>
            <CardHeader className={QUOTE_CALCULATOR_STYLES.header}>
              <h3 className="text-xl font-serif">{t.addOns}</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(QUOTE_ADD_ONS).map(([key, addon]) => (
                  <div
                    key={key}
                    className={cn(
                      QUOTE_CALCULATOR_STYLES.addOnItem,
                      selectedAddOns.includes(key as QuoteAddOn)
                        ? QUOTE_CALCULATOR_STYLES.addOnSelected
                        : QUOTE_CALCULATOR_STYLES.addOnDefault,
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={key}
                        checked={selectedAddOns.includes(key as QuoteAddOn)}
                        onCheckedChange={() =>
                          handleAddOnToggle(key as QuoteAddOn)
                        }
                      />
                      <div>
                        <Label
                          htmlFor={key}
                          className="font-medium cursor-pointer"
                        >
                          {addon.label}
                          {addon.popular && (
                            <Badge className="ml-2 text-xs">{t.popular}</Badge>
                          )}
                        </Label>
                        <p className="text-sm text-blue-600">
                          €{addon.price.toFixed(2)}
                          {addon.perPerson && ` ${t.perPerson}`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quote Summary */}
        <div className="lg:col-span-1">
          <Card className={QUOTE_CALCULATOR_STYLES.priceDisplay}>
            <CardHeader>
              <h3 className="text-xl font-serif flex items-center gap-2">
                <Euro className="w-5 h-5" />
                {t.total}
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {isCalculating ? (
                <div className="text-center py-8">
                  <Calculator className="w-8 h-8 text-blue-600 animate-pulse mx-auto mb-2" />
                  <p className="text-sm">Berekenen...</p>
                </div>
              ) : quote ? (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">{t.basePrice}:</span>
                      <span className="text-sm">
                        €{quote.basePrice.toFixed(2)}
                      </span>
                    </div>
                    {quote.addOnTotal > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm">{t.addOnTotal}:</span>
                        <span className="text-sm">
                          €{quote.addOnTotal.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm">{t.tax}:</span>
                      <span className="text-sm">€{quote.tax.toFixed(2)}</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="text-center">
                    <div className={QUOTE_CALCULATOR_STYLES.totalPrice}>
                      €{quote.total.toFixed(2)}
                    </div>
                    <div className={QUOTE_CALCULATOR_STYLES.perPersonPrice}>
                      €{quote.perPerson.toFixed(2)} {t.perPersonPrice}
                    </div>
                  </div>
                  <Button
                    onClick={handleRequestDetailedQuote}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    size="lg"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {t.getDetailedQuote}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-600">
                    Selecteer uw opties om een offerte te zien
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
