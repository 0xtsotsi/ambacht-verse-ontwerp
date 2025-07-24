"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Eye, Shield, Calculator, PieChart } from "lucide-react";

// INFINITE LOOP VARIATION 1: Cost Breakdown Transparency
// Psychology: Dutch directness values seeing exactly where money goes
// Trust building through radical transparency

interface CostBreakdown {
  category: string;
  percentage: number;
  amount: number;
  description: string;
  color: string;
}

interface PricingTier {
  id: string;
  name: string;
  description: string;
  pricePerPerson: number;
  guestCountRange: string;
  breakdown: CostBreakdown[];
  features: string[];
  guarantee: string;
  localSourcing: string;
  isRecommended?: boolean;
}

interface CostBreakdownPricingProps {
  className?: string;
  onSelectTier?: (tierId: string) => void;
}

const pricingTiers: PricingTier[] = [
  {
    id: "essential",
    name: "Essential",
    description: "Transparante basis kwaliteit",
    pricePerPerson: 28.5,
    guestCountRange: "20-75 gasten",
    breakdown: [
      {
        category: "Verse Ingrediënten",
        percentage: 45,
        amount: 12.83,
        description: "100% Nederlandse leveranciers",
        color: "bg-green-500",
      },
      {
        category: "Vakkundig Personeel",
        percentage: 50,
        amount: 14.25,
        description: "Gediplomeerde chefs & service",
        color: "bg-blue-500",
      },
      {
        category: "Service & Materialen",
        percentage: 5,
        amount: 1.42,
        description: "Transport, servies, setup",
        color: "bg-amber-500",
      },
    ],
    features: [
      "Lokale biologische ingrediënten",
      "Professionele presentatie",
      "Standaard servies inbegrepen",
      "Flexibele menuopties",
    ],
    guarantee: "Tevredenheidsgarantie of geld terug",
    localSourcing: "85% lokale leveranciers binnen 50km",
  },
  {
    id: "premium",
    name: "Premium",
    description: "Uitgebreide transparantie",
    pricePerPerson: 38.75,
    guestCountRange: "30-150 gasten",
    breakdown: [
      {
        category: "Premium Ingrediënten",
        percentage: 45,
        amount: 17.44,
        description: "Biologisch + seizoensspecialiteiten",
        color: "bg-green-600",
      },
      {
        category: "Expert Bemanning",
        percentage: 50,
        amount: 19.38,
        description: "Sous-chefs + dedicated service",
        color: "bg-blue-600",
      },
      {
        category: "Premium Service",
        percentage: 5,
        amount: 1.93,
        description: "Elegant servies + decoratie",
        color: "bg-amber-600",
      },
    ],
    features: [
      "Ambachtelijke seizoensgerechten",
      "Premium servies & linnen",
      "Persoonlijke chef aanwezig",
      "Wijn advies inbegrepen",
    ],
    guarantee: "Perfecte dag garantie + backup plan",
    localSourcing: "95% lokale leveranciers + verhaal per gerecht",
    isRecommended: true,
  },
  {
    id: "luxury",
    name: "Luxury",
    description: "Volledige transparantie",
    pricePerPerson: 52.0,
    guestCountRange: "50-300 gasten",
    breakdown: [
      {
        category: "Exclusieve Ingrediënten",
        percentage: 45,
        amount: 23.4,
        description: "Biologisch + import specialiteiten",
        color: "bg-green-700",
      },
      {
        category: "Dedicated Team",
        percentage: 50,
        amount: 26.0,
        description: "Chef de cuisine + full service team",
        color: "bg-blue-700",
      },
      {
        category: "White-glove Service",
        percentage: 5,
        amount: 2.6,
        description: "Luxe materialen + decoratie",
        color: "bg-amber-700",
      },
    ],
    features: [
      "Chef-designed exclusieve menu's",
      "Luxe servies & kristal",
      "Dedicated event coordinator",
      "Live cooking stations",
    ],
    guarantee: "Onbeperkte aanpassingen tot perfectie",
    localSourcing: "100% traceerbaarheid + bezoek leveranciers",
  },
];

export function CostBreakdownPricing({
  className,
  onSelectTier,
}: CostBreakdownPricingProps) {
  const [selectedTier, setSelectedTier] = useState<string>("premium");
  const [showBreakdown, setShowBreakdown] = useState<string | null>("premium");

  const handleSelectTier = (tierId: string) => {
    setSelectedTier(tierId);
    setShowBreakdown(tierId);
    onSelectTier?.(tierId);
  };

  return (
    <div className={cn("w-full max-w-7xl mx-auto p-6", className)}>
      {/* Trust-First Header */}
      <div className="text-center mb-12 space-y-6">
        <div className="flex items-center justify-center gap-2 text-sopranos-gold text-sm font-medium">
          <Shield className="h-5 w-5" />
          <span>100% Transparante Prijsstelling</span>
        </div>
        <h2 className="text-4xl font-serif text-deep-charcoal tracking-tight">
          Zie Precies Waar Uw Geld Naartoe Gaat
        </h2>
        <p className="text-lg text-sophisticated-green/80 max-w-3xl mx-auto leading-relaxed">
          Nederlandse directheid vereist eerlijkheid. Daarom laten wij exact
          zien hoe elke euro wordt besteed aan kwaliteit, vakmanschap en
          service.
        </p>
        <div className="flex items-center justify-center gap-6 text-sm text-deep-charcoal/70">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-sopranos-gold" />
            <span>Geen verborgen kosten</span>
          </div>
          <div className="flex items-center gap-2">
            <Calculator className="h-4 w-4 text-sopranos-gold" />
            <span>Exacte kostenberekening</span>
          </div>
          <div className="flex items-center gap-2">
            <PieChart className="h-4 w-4 text-sopranos-gold" />
            <span>Volledige uitsplitsing</span>
          </div>
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {pricingTiers.map((tier) => {
          const isSelected = selectedTier === tier.id;
          const showDetails = showBreakdown === tier.id;

          return (
            <Card
              key={tier.id}
              className={cn(
                "relative overflow-hidden transition-all duration-500 cursor-pointer",
                "hover:shadow-2xl hover:shadow-sopranos-gold/20 hover:scale-[1.02]",
                isSelected &&
                  "ring-2 ring-sopranos-gold shadow-2xl scale-[1.02]",
                tier.isRecommended && "ring-2 ring-blue-500/50",
              )}
              onClick={() => handleSelectTier(tier.id)}
            >
              {/* Recommended Badge */}
              {tier.isRecommended && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-blue-600 text-white px-4 py-1 text-xs font-medium">
                    Nederlandse Favoriet
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif text-deep-charcoal font-medium">
                    {tier.name}
                  </h3>
                  <p className="text-sm text-sophisticated-green/70">
                    {tier.description}
                  </p>
                  <div className="text-sm text-sopranos-gold font-medium">
                    {tier.guestCountRange}
                  </div>
                </div>

                {/* Main Price */}
                <div className="py-4">
                  <div className="text-4xl font-bold text-deep-charcoal">
                    €{tier.pricePerPerson.toFixed(2)}
                  </div>
                  <div className="text-sm text-sophisticated-green/60">
                    per persoon, alles inbegrepen
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Cost Breakdown */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-deep-charcoal flex items-center gap-2">
                    <PieChart className="h-4 w-4" />
                    Kostenspecificatie:
                  </h4>

                  {tier.breakdown.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-deep-charcoal/80">
                          {item.category}
                        </span>
                        <span className="font-medium text-deep-charcoal">
                          €{item.amount.toFixed(2)} ({item.percentage}%)
                        </span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                      <p className="text-xs text-sophisticated-green/60">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-deep-charcoal">
                    Inbegrepen:
                  </h4>
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-sopranos-gold mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-sophisticated-green/80">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Local Sourcing */}
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <h5 className="text-xs font-medium text-green-800 mb-1">
                    Lokale Inkoop:
                  </h5>
                  <p className="text-xs text-green-700">{tier.localSourcing}</p>
                </div>

                {/* Guarantee */}
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <h5 className="text-xs font-medium text-blue-800 mb-1">
                    Garantie:
                  </h5>
                  <p className="text-xs text-blue-700">{tier.guarantee}</p>
                </div>

                {/* CTA Button */}
                <Button
                  className={cn(
                    "w-full transition-all duration-300",
                    isSelected
                      ? "bg-sopranos-gold hover:bg-sopranos-gold/90 text-white"
                      : "bg-deep-charcoal hover:bg-deep-charcoal/90 text-white",
                  )}
                  size="lg"
                >
                  {isSelected
                    ? "Geselecteerd - Offerte Aanvragen"
                    : "Kies Dit Pakket"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Trust Signals Footer */}
      <div className="bg-elegant-cream/30 rounded-xl p-8 text-center space-y-4">
        <h3 className="text-xl font-serif text-deep-charcoal mb-4">
          Waarom Transparantie Bij Wesley's Ambacht?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="space-y-2">
            <Shield className="h-8 w-8 text-sopranos-gold mx-auto" />
            <h4 className="font-medium text-deep-charcoal">
              Nederlandse Eerlijkheid
            </h4>
            <p className="text-sophisticated-green/70">
              Geen verborgen kosten of verrassingen. Wat u ziet is wat u krijgt.
            </p>
          </div>
          <div className="space-y-2">
            <CheckCircle className="h-8 w-8 text-sopranos-gold mx-auto" />
            <h4 className="font-medium text-deep-charcoal">
              Kwaliteitsgarantie
            </h4>
            <p className="text-sophisticated-green/70">
              Elke euro wordt besteed aan de hoogste kwaliteit ingrediënten en
              service.
            </p>
          </div>
          <div className="space-y-2">
            <PieChart className="h-8 w-8 text-sopranos-gold mx-auto" />
            <h4 className="font-medium text-deep-charcoal">
              Volledige Controle
            </h4>
            <p className="text-sophisticated-green/70">
              U weet precies waar uw investering naartoe gaat en waarom.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
