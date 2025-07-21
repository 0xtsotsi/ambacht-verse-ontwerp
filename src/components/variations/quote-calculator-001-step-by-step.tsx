import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Calculator, 
  Users, 
  Sparkles, 
  CheckCircle, 
  ChefHat, 
  Crown, 
  Gem,
  Euro,
  ArrowRight,
  ArrowLeft,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useInteractionLogger, useBreadcrumbLogger } from '@/hooks/useUserFlowLogger';
import { useConversionFunnel } from '@/lib/conversionFunnel';
import {
  SERVICE_CATEGORIES,
  SERVICE_TIERS,
  ADD_ON_SERVICES,
  GUEST_COUNT_PRESETS,
  MIN_GUEST_COUNT,
  MAX_GUEST_COUNT,
} from '@/lib/pricing-constants';
import {
  calculateQuote,
  formatCurrency,
  type QuoteInput,
  type QuoteBreakdown,
} from '@/lib/quote-calculations';

interface StepByStepQuoteCalculatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestDetailedQuote?: (quote: QuoteBreakdown, input: QuoteInput) => void;
  initialCategory?: string;
  initialGuestCount?: number;
}

export function StepByStepQuoteCalculator({
  open,
  onOpenChange,
  onRequestDetailedQuote,
  initialCategory = 'corporate',
  initialGuestCount = 50,
}: StepByStepQuoteCalculatorProps) {
  const { toast } = useToast();
  
  // Form state
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedTier, setSelectedTier] = useState('premium');
  const [guestCount, setGuestCount] = useState([initialGuestCount]);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  
  // Calculation state
  const [quote, setQuote] = useState<QuoteBreakdown | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // User tracking hooks
  const { logClick, logButtonPress } = useInteractionLogger();
  const { addBreadcrumb, logJourneySummary } = useBreadcrumbLogger();
  const { startFunnel, logStep, complete, abandon } = useConversionFunnel('quote_calculator');

  // Reset when modal opens and initialize tracking
  useEffect(() => {
    if (open) {
      setSelectedCategory(initialCategory);
      setSelectedTier('premium');
      setGuestCount([initialGuestCount]);
      setSelectedAddOns([]);
      setStep(1);
      setQuote(null);
      
      // Initialize funnel tracking
      startFunnel();
      logStep('calculator_open');
      addBreadcrumb('quote_calculator_opened', {
        initialCategory,
        initialGuestCount
      });
    }
  }, [open, initialCategory, initialGuestCount, addBreadcrumb, logStep, startFunnel]);

  // Calculate quote when on final step
  useEffect(() => {
    if (step === 5) {
      const input: QuoteInput = {
        serviceCategory: selectedCategory,
        serviceTier: selectedTier,
        guestCount: guestCount[0],
        selectedAddOns,
      };

      logStep('quote_calculation');
      addBreadcrumb('calculating_quote', input);

      setIsCalculating(true);
      setTimeout(() => {
        try {
          const calculatedQuote = calculateQuote(input);
          setQuote(calculatedQuote);
          
          logStep('quote_display');
          addBreadcrumb('quote_calculated_successfully', {
            totalPrice: calculatedQuote.totalPrice,
            breakdown: calculatedQuote.breakdown
          });
        } catch (error) {
          console.error('Quote calculation error:', error);
          setQuote(null);
          
          addBreadcrumb('quote_calculation_error', {
            error: error instanceof Error ? error.message : 'Unknown error',
            input
          });
        }
        setIsCalculating(false);
      }, 800);
    }
  }, [step, selectedCategory, selectedTier, guestCount, selectedAddOns, addBreadcrumb, logStep]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    
    logClick('service_category_selection', { categoryId });
    logStep('service_category_selection');
    addBreadcrumb('category_selected', { 
      categoryId, 
      categoryName: SERVICE_CATEGORIES.find(cat => cat.id === categoryId)?.name 
    });
    
    toast({
      title: "Geweldige keuze!",
      description: `${SERVICE_CATEGORIES.find(cat => cat.id === categoryId)?.name} geselecteerd.`,
      duration: 2000,
    });
  };

  const handleTierSelect = (tierId: string) => {
    setSelectedTier(tierId);
    
    logClick('service_tier_selection', { tierId });
    logStep('service_tier_selection');
    addBreadcrumb('tier_selected', { 
      tierId, 
      tierName: SERVICE_TIERS.find(tier => tier.id === tierId)?.name 
    });
  };

  const handleGuestCountChange = (value: number[]) => {
    setGuestCount(value);
    
    logClick('guest_count_input', { guestCount: value[0] });
    logStep('guest_count_input');
    addBreadcrumb('guest_count_updated', { guestCount: value[0] });
  };

  const handleAddOnToggle = (addonId: string) => {
    const isAdding = !selectedAddOns.includes(addonId);
    setSelectedAddOns(prev => 
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
    
    logClick('addon_toggle', { addonId, action: isAdding ? 'add' : 'remove' });
    logStep('addon_selection');
    addBreadcrumb('addon_toggled', { 
      addonId, 
      action: isAdding ? 'add' : 'remove',
      totalAddons: isAdding ? selectedAddOns.length + 1 : selectedAddOns.length - 1
    });
  };

  const handleNext = () => {
    if (step < 5) {
      logButtonPress('next_step', `quote_calculator_step_${step}`);
      addBreadcrumb('step_advanced', { fromStep: step, toStep: step + 1 });
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      logButtonPress('previous_step', `quote_calculator_step_${step}`);
      addBreadcrumb('step_back', { fromStep: step, toStep: step - 1 });
      setStep(step - 1);
    }
  };

  const handleRequestDetailedQuote = () => {
    if (quote) {
      const input: QuoteInput = {
        serviceCategory: selectedCategory,
        serviceTier: selectedTier,
        guestCount: guestCount[0],
        selectedAddOns,
      };
      
      logButtonPress('request_detailed_quote', 'quote_calculator');
      logStep('detailed_quote_request');
      addBreadcrumb('detailed_quote_requested', {
        quote: quote.totalPrice,
        input
      });
      
      complete({
        quote,
        input,
        totalSteps: 5,
        completionTime: Date.now()
      });
      
      logJourneySummary('completed');
      
      onRequestDetailedQuote?.(quote, input);
      toast({
        title: "Offerte aangevraagd!",
        description: "We stellen uw gepersonaliseerde offerte samen.",
        duration: 3000,
      });
      onOpenChange(false);
    }
  };

  // Handle calculator close/abandonment
  const handleClose = () => {
    if (step > 1 && step < 5) {
      abandon('user_choice', {
        stepReached: step,
        progressPercentage: (step / 5) * 100,
        selectionsMade: {
          category: selectedCategory,
          tier: selectedTier,
          guestCount: guestCount[0],
          addons: selectedAddOns.length
        }
      });
      
      addBreadcrumb('calculator_abandoned', {
        stepReached: step,
        completionPercentage: (step / 5) * 100
      });
      
      logJourneySummary('abandoned');
    }
    
    onOpenChange(false);
  };

  const selectedCategoryData = SERVICE_CATEGORIES.find(cat => cat.id === selectedCategory);
  const selectedTierData = SERVICE_TIERS.find(tier => tier.id === selectedTier);

  const getTierIcon = (tierId: string) => {
    switch (tierId) {
      case 'essential': return <ChefHat className="w-5 h-5" />;
      case 'premium': return <Crown className="w-5 h-5" />;
      case 'luxury': return <Gem className="w-5 h-5" />;
      default: return <ChefHat className="w-5 h-5" />;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Selecteer Service Type";
      case 2: return "Kies Service Niveau";
      case 3: return "Aantal Gasten";
      case 4: return "Extra Services";
      case 5: return "Uw Offerte";
      default: return "Offerte Calculator";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1: return "Welk type evenement organiseert u?";
      case 2: return "Welk service niveau past bij uw wensen?";
      case 3: return "Hoeveel gasten verwacht u?";
      case 4: return "Maak uw ervaring compleet met extra services";
      case 5: return "Uw gepersonaliseerde offerte";
      default: return "";
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return selectedCategory !== '';
      case 2: return selectedTier !== '';
      case 3: return guestCount[0] >= MIN_GUEST_COUNT;
      case 4: return true; // Add-ons are optional
      case 5: return quote !== null;
      default: return false;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-forest-green flex items-center gap-3">
            <Calculator className="w-6 h-6 text-burnt-orange" />
            {getStepTitle()}
          </DialogTitle>
          <DialogDescription className="text-forest-green/80">
            {getStepDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
                  step >= stepNum 
                    ? "bg-burnt-orange text-white" 
                    : "bg-gray-200 text-gray-500"
                )}>
                  {stepNum}
                </div>
                {stepNum < 5 && (
                  <div className={cn(
                    "w-12 h-0.5 transition-colors",
                    step > stepNum ? "bg-burnt-orange" : "bg-gray-200"
                  )} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">
            {/* Step 1: Service Category */}
            {step === 1 && (
              <div className="space-y-4">
                <RadioGroup value={selectedCategory} onValueChange={handleCategorySelect}>
                  <div className="space-y-3">
                    {SERVICE_CATEGORIES.map((category) => (
                      <div key={category.id} className="relative">
                        <RadioGroupItem 
                          value={category.id} 
                          id={category.id} 
                          className="peer sr-only" 
                        />
                        <Label
                          htmlFor={category.id}
                          className={cn(
                            "block p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
                            "hover:border-burnt-orange hover:bg-warm-cream/30",
                            "peer-data-[state=checked]:border-burnt-orange peer-data-[state=checked]:bg-warm-cream/50"
                          )}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-forest-green">{category.name}</h4>
                              {category.id === 'corporate' && (
                                <Badge variant="secondary" className="text-xs">Populair</Badge>
                              )}
                            </div>
                            <p className="text-sm text-forest-green/70">{category.description}</p>
                            <div className="text-sm font-medium text-burnt-orange">
                              €{category.minPrice.toFixed(2)} - €{category.maxPrice.toFixed(2)} per persoon
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Step 2: Service Tier */}
            {step === 2 && (
              <div className="space-y-4">
                <RadioGroup value={selectedTier} onValueChange={handleTierSelect}>
                  <div className="space-y-3">
                    {SERVICE_TIERS.map((tier) => (
                      <div key={tier.id} className="relative">
                        <RadioGroupItem 
                          value={tier.id} 
                          id={tier.id} 
                          className="peer sr-only" 
                        />
                        <Label
                          htmlFor={tier.id}
                          className={cn(
                            "block p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
                            "hover:border-burnt-orange hover:bg-warm-cream/30",
                            "peer-data-[state=checked]:border-burnt-orange peer-data-[state=checked]:bg-warm-cream/50",
                            tier.id === 'premium' && "ring-1 ring-burnt-orange/30"
                          )}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              {getTierIcon(tier.id)}
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-forest-green">{tier.name}</h4>
                                  {tier.id === 'premium' && (
                                    <Badge variant="secondary" className="text-xs">Aanbevolen</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-forest-green/70 mt-1">{tier.description}</p>
                              </div>
                            </div>
                            <div className="text-sm font-medium text-burnt-orange">
                              {tier.priceMultiplier < 1 ? '-' : '+'}
                              {Math.abs((tier.priceMultiplier - 1) * 100).toFixed(0)}% 
                              {tier.priceMultiplier === 1 ? ' (basis)' : ' op basis prijs'}
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Step 3: Guest Count */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-burnt-orange mb-2">{guestCount[0]}</div>
                  <div className="text-lg text-forest-green">gasten</div>
                </div>

                <div className="space-y-4">
                  <Slider
                    value={guestCount}
                    onValueChange={handleGuestCountChange}
                    min={MIN_GUEST_COUNT}
                    max={MAX_GUEST_COUNT}
                    step={5}
                    className="w-full"
                  />
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Min. {MIN_GUEST_COUNT}</span>
                    <span>Max. {MAX_GUEST_COUNT}</span>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-2 mt-6">
                    {GUEST_COUNT_PRESETS.map((count) => (
                      <Button
                        key={count}
                        variant="outline"
                        size="sm"
                        onClick={() => setGuestCount([count])}
                        className={cn(
                          "transition-colors h-12",
                          guestCount[0] === count && "border-burnt-orange bg-burnt-orange/10"
                        )}
                      >
                        {count}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Add-ons */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-forest-green/70">
                    Optioneel - selecteer extra services die u wenst
                  </p>
                </div>

                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {ADD_ON_SERVICES.map((addon) => (
                    <div key={addon.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-warm-cream/30">
                      <Checkbox
                        id={addon.id}
                        checked={selectedAddOns.includes(addon.id)}
                        onCheckedChange={() => handleAddOnToggle(addon.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <Label htmlFor={addon.id} className="text-sm font-medium text-forest-green cursor-pointer block">
                          {addon.name}
                        </Label>
                        <p className="text-xs text-forest-green/70 mt-1">{addon.description}</p>
                        <p className="text-sm font-medium text-burnt-orange mt-1">
                          {addon.pricePerPerson 
                            ? `${formatCurrency(addon.pricePerPerson)} per persoon`
                            : `${formatCurrency(addon.flatRate || 0)} vast tarief`
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center text-sm text-forest-green/60">
                  {selectedAddOns.length} extra service{selectedAddOns.length !== 1 ? 's' : ''} geselecteerd
                </div>
              </div>
            )}

            {/* Step 5: Quote Summary */}
            {step === 5 && (
              <div className="space-y-6">
                {isCalculating ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                      <Sparkles className="w-12 h-12 text-burnt-orange animate-pulse mx-auto mb-4" />
                      <p className="text-lg text-forest-green">Uw offerte wordt berekend...</p>
                    </div>
                  </div>
                ) : quote ? (
                  <>
                    {/* Service Summary */}
                    <Card className="bg-warm-cream/30 border-burnt-orange/30">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-forest-green/70">Service:</span>
                          <span className="text-sm font-medium">{selectedCategoryData?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-forest-green/70">Niveau:</span>
                          <span className="text-sm font-medium">{selectedTierData?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-forest-green/70">Gasten:</span>
                          <span className="text-sm font-medium">{guestCount[0]} personen</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Price Breakdown */}
                    <Card className="border-forest-green/30">
                      <CardHeader>
                        <h4 className="font-semibold text-forest-green flex items-center gap-2">
                          <Euro className="w-4 h-4" />
                          Prijsoverzicht
                        </h4>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Basis catering ({formatCurrency(quote.basePricePerPerson)}/p.p.):</span>
                          <span className="text-sm font-medium">{formatCurrency(quote.basePrice)}</span>
                        </div>
                        
                        {quote.addOns.map((addon) => (
                          <div key={addon.id} className="flex justify-between">
                            <span className="text-sm text-forest-green/70">{addon.name}:</span>
                            <span className="text-sm">{formatCurrency(addon.total)}</span>
                          </div>
                        ))}

                        {quote.volumeDiscount && (
                          <div className="flex justify-between text-green-600">
                            <span className="text-sm">Volumekorting:</span>
                            <span className="text-sm font-medium">-{formatCurrency(quote.volumeDiscount.discountAmount)}</span>
                          </div>
                        )}

                        <div className="border-t pt-3 mt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-forest-green">Totaal:</span>
                            <span className="text-2xl font-bold text-burnt-orange">{formatCurrency(quote.finalTotal)}</span>
                          </div>
                          <div className="text-center mt-2">
                            <span className="text-sm text-forest-green/70">
                              {formatCurrency(quote.pricePerPerson)} per persoon
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* CTA */}
                    <Button
                      onClick={handleRequestDetailedQuote}
                      className="w-full bg-burnt-orange hover:bg-burnt-orange/90 text-white h-12"
                      size="lg"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Detailofferte Aanvragen
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>

                    <p className="text-xs text-forest-green/60 text-center">
                      Vrijblijvend • Binnen 2 uur respons • Inclusief BTW
                    </p>
                  </>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-forest-green/70">Er ging iets mis bij het berekenen van uw offerte.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Vorige
            </Button>

            {step < 5 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-burnt-orange hover:bg-burnt-orange/90 text-white flex items-center gap-2"
              >
                Volgende
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex items-center gap-2"
              >
                Sluiten
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}