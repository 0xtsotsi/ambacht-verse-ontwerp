import React from "react";
import { PricingCardBase, ServiceCategory } from "./PricingCardBase";
import { Users, Sparkles, CheckCircle, Calculator } from "lucide-react";

/**
 * Standardized service categories data
 * Eliminates duplication across pricing card variations
 */
export const standardServiceCategories: ServiceCategory[] = [
  {
    id: "corporate",
    name: "Zakelijke Catering",
    description:
      "Professionele catering voor bedrijfsevenementen en zakelijke bijeenkomsten",
    minPrice: 18.5,
    maxPrice: 27.5,
    features: [
      { name: "Professionele presentatie", included: true },
      { name: "Flexibele menuopties", included: true },
      { name: "Gediplomeerde chefs", included: true, popular: true },
      { name: "Premium ingrediënten", included: true },
      { name: "Volledige service", included: true },
    ],
    icon: <Users className="h-6 w-6 text-burnt-orange" />,
    badge: "Meest Populair",
    gradient:
      "from-sopranos-gold/10 via-sophisticated-green/5 to-elegant-cream/20",
  },
  {
    id: "social",
    name: "Sociale Evenementen",
    description:
      "Perfecte catering voor verjaardagen, jubilea en andere sociale gelegenheden",
    minPrice: 22.5,
    maxPrice: 35.0,
    features: [
      { name: "Feestelijke presentatie", included: true },
      { name: "Interactieve elementen", included: true },
      { name: "Aangepaste decoratie", included: true },
      { name: "Fotografieservice", included: false },
      { name: "Live entertainment", included: false },
    ],
    icon: <Sparkles className="h-6 w-6 text-burnt-orange" />,
    gradient: "from-burnt-orange/10 via-forest-green/5 to-elegant-cream/20",
  },
  {
    id: "wedding",
    name: "Bruiloft Catering",
    description:
      "Exclusieve catering voor uw speciale dag met persoonlijke service",
    minPrice: 45.0,
    maxPrice: 85.0,
    features: [
      { name: "Persoonlijke wedding planner", included: true },
      { name: "Proeverij vooraf", included: true, popular: true },
      { name: "Ceremoniële service", included: true },
      { name: "Bruidstaart", included: true },
      { name: "Fotografieservice", included: true },
    ],
    icon: <CheckCircle className="h-6 w-6 text-burnt-orange" />,
    badge: "Premium",
    gradient:
      "from-elegant-cream/10 via-sophisticated-green/5 to-burnt-orange/20",
  },
  {
    id: "custom",
    name: "Op Maat Gemaakt",
    description:
      "Volledig aangepaste catering oplossing voor unieke evenementen",
    minPrice: 25.0,
    maxPrice: 150.0,
    features: [
      { name: "Volledig maatwerk", included: true },
      { name: "Dedicated event manager", included: true },
      { name: "Onbeperkte menu-aanpassingen", included: true },
      { name: "Premium locatie service", included: true },
      { name: "24/7 support", included: true },
    ],
    icon: <Calculator className="h-6 w-6 text-burnt-orange" />,
    badge: "Exclusief",
    gradient:
      "from-sophisticated-green/10 via-burnt-orange/5 to-elegant-cream/20",
  },
];

/**
 * Component variation factory
 * Creates different pricing card layouts using the same base component
 */
export const ComponentVariations = {
  /**
   * Transparent tier pricing cards
   */
  TransparentTier: ({
    onBookNow,
    featured,
  }: {
    onBookNow?: (id: string) => void;
    featured?: string;
  }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {standardServiceCategories.map((category) => (
        <PricingCardBase
          key={category.id}
          category={category}
          onBookNow={onBookNow}
          featured={featured === category.id}
          variant="transparent"
        />
      ))}
    </div>
  ),

  /**
   * Grid composition layout
   */
  GridComposition: ({
    onBookNow,
    featured,
  }: {
    onBookNow?: (id: string) => void;
    featured?: string;
  }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {standardServiceCategories.map((category) => (
        <PricingCardBase
          key={category.id}
          category={category}
          onBookNow={onBookNow}
          featured={featured === category.id}
          variant="grid"
        />
      ))}
    </div>
  ),

  /**
   * Cost breakdown cards
   */
  CostBreakdown: ({
    onBookNow,
    featured,
  }: {
    onBookNow?: (id: string) => void;
    featured?: string;
  }) => (
    <div className="space-y-6">
      {standardServiceCategories.map((category) => (
        <PricingCardBase
          key={category.id}
          category={category}
          onBookNow={onBookNow}
          featured={featured === category.id}
          variant="breakdown"
          className="max-w-2xl mx-auto"
        />
      ))}
    </div>
  ),

  /**
   * Trust-first layout
   */
  TrustFirst: ({
    onBookNow,
    featured,
  }: {
    onBookNow?: (id: string) => void;
    featured?: string;
  }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {standardServiceCategories.map((category) => (
        <PricingCardBase
          key={category.id}
          category={category}
          onBookNow={onBookNow}
          featured={featured === category.id}
          variant="trust"
        />
      ))}
    </div>
  ),

  /**
   * Dutch transparency style
   */
  DutchTransparency: ({
    onBookNow,
    featured,
  }: {
    onBookNow?: (id: string) => void;
    featured?: string;
  }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {standardServiceCategories.map((category) => (
        <PricingCardBase
          key={category.id}
          category={category}
          onBookNow={onBookNow}
          featured={featured === category.id}
          variant="dutch"
        />
      ))}
    </div>
  ),

  /**
   * Trust builder layout
   */
  TrustBuilder: ({
    onBookNow,
    featured,
  }: {
    onBookNow?: (id: string) => void;
    featured?: string;
  }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {standardServiceCategories.map((category) => (
        <PricingCardBase
          key={category.id}
          category={category}
          onBookNow={onBookNow}
          featured={featured === category.id}
          variant="builder"
        />
      ))}
    </div>
  ),

  /**
   * Mobile-first layout
   */
  MobileFirst: ({
    onBookNow,
    featured,
  }: {
    onBookNow?: (id: string) => void;
    featured?: string;
  }) => (
    <div className="space-y-4">
      {standardServiceCategories.map((category) => (
        <PricingCardBase
          key={category.id}
          category={category}
          onBookNow={onBookNow}
          featured={featured === category.id}
          variant="mobile"
        />
      ))}
    </div>
  ),

  /**
   * Conversion-optimized layout
   */
  ConversionOptimized: ({
    onBookNow,
    featured,
  }: {
    onBookNow?: (id: string) => void;
    featured?: string;
  }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {standardServiceCategories.map((category) => (
        <PricingCardBase
          key={category.id}
          category={category}
          onBookNow={onBookNow}
          featured={featured === category.id}
          variant="conversion"
        />
      ))}
    </div>
  ),

  /**
   * Premium positioning layout
   */
  PremiumPositioning: ({
    onBookNow,
    featured,
  }: {
    onBookNow?: (id: string) => void;
    featured?: string;
  }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {standardServiceCategories.map((category) => (
        <PricingCardBase
          key={category.id}
          category={category}
          onBookNow={onBookNow}
          featured={featured === category.id}
          variant="premium"
        />
      ))}
    </div>
  ),
};
