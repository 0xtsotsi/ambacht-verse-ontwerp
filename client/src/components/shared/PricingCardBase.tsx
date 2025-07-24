import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle, Star, Users, Calendar, Trophy } from "lucide-react";

export interface ServiceFeature {
  name: string;
  included: boolean;
  popular?: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  minPrice: number;
  maxPrice: number;
  features: ServiceFeature[];
  icon: React.ReactNode;
  badge?: string;
  gradient: string;
  variant?: "default" | "featured" | "premium";
}

export interface PricingCardBaseProps {
  category: ServiceCategory;
  onBookNow?: (categoryId: string) => void;
  featured?: boolean;
  className?: string;
  variant?:
    | "transparent"
    | "grid"
    | "breakdown"
    | "trust"
    | "dutch"
    | "builder"
    | "mobile"
    | "conversion"
    | "premium";
}

/**
 * Base component for pricing cards with configurable variants
 * Eliminates duplication across 9 pricing card variations
 */
export function PricingCardBase({
  category,
  onBookNow,
  featured = false,
  className,
  variant = "transparent",
}: PricingCardBaseProps) {
  const variantStyles = {
    transparent: {
      card: "bg-white/80 backdrop-blur-sm border-0 shadow-elegant-panel",
      header:
        "bg-gradient-to-r from-sophisticated-green/10 to-elegant-cream/20",
      price: "text-burnt-orange font-bold",
      button: "bg-burnt-orange hover:bg-burnt-orange/90 text-white",
    },
    grid: {
      card: "border border-gray-200 hover:border-burnt-orange transition-colors",
      header: "bg-gray-50",
      price: "text-forest-green font-bold",
      button: "bg-forest-green hover:bg-forest-green/90 text-white",
    },
    breakdown: {
      card: "bg-white shadow-lg border-0",
      header: "bg-gradient-to-r from-burnt-orange/10 to-forest-green/10",
      price: "text-burnt-orange font-bold text-lg",
      button: "bg-burnt-orange hover:bg-burnt-orange/90 text-white",
    },
    trust: {
      card: "bg-white/95 backdrop-blur-sm border border-elegant-cream shadow-elegant-panel",
      header: "bg-gradient-to-r from-sophisticated-green/5 to-burnt-orange/5",
      price: "text-sophisticated-green font-bold",
      button:
        "bg-sophisticated-green hover:bg-sophisticated-green/90 text-white",
    },
    dutch: {
      card: "bg-white/90 backdrop-blur-sm border-0 shadow-elegant-panel",
      header: "bg-gradient-to-r from-burnt-orange/10 to-forest-green/10",
      price: "text-burnt-orange font-bold",
      button: "bg-burnt-orange hover:bg-burnt-orange/90 text-white",
    },
    builder: {
      card: "bg-white shadow-md border border-gray-100",
      header: "bg-gradient-to-r from-forest-green/5 to-burnt-orange/5",
      price: "text-forest-green font-bold",
      button: "bg-forest-green hover:bg-forest-green/90 text-white",
    },
    mobile: {
      card: "bg-white/85 backdrop-blur-sm border-0 shadow-elegant-panel",
      header:
        "bg-gradient-to-r from-sophisticated-green/10 to-elegant-cream/20",
      price: "text-burnt-orange font-bold",
      button: "bg-burnt-orange hover:bg-burnt-orange/90 text-white w-full",
    },
    conversion: {
      card: "bg-white shadow-xl border-0 hover:shadow-2xl transition-shadow",
      header: "bg-gradient-to-r from-burnt-orange/10 to-forest-green/10",
      price: "text-burnt-orange font-bold text-xl",
      button: "bg-burnt-orange hover:bg-burnt-orange/90 text-white w-full",
    },
    premium: {
      card: "bg-white/95 backdrop-blur-sm border-2 border-burnt-orange shadow-elegant-panel",
      header: "bg-gradient-to-r from-burnt-orange/20 to-forest-green/20",
      price: "text-burnt-orange font-bold text-xl",
      button: "bg-burnt-orange hover:bg-burnt-orange/90 text-white w-full",
    },
  };

  const styles = variantStyles[variant];

  return (
    <Card
      className={cn(
        styles.card,
        featured && "ring-2 ring-burnt-orange",
        className,
      )}
    >
      <CardHeader className={cn(styles.header, "pb-4")}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {category.icon}
            <div>
              <h3 className="text-lg font-serif text-forest-green">
                {category.name}
              </h3>
              {category.badge && (
                <Badge className="mt-1 bg-burnt-orange/10 text-burnt-orange">
                  {category.badge}
                </Badge>
              )}
            </div>
          </div>
          {featured && (
            <Star className="w-5 h-5 text-burnt-orange fill-current" />
          )}
        </div>
        <p className="text-sm text-gray-600 mt-2">{category.description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Price Range */}
        <div className="text-center">
          <div className={cn(styles.price, "text-2xl")}>
            €{category.minPrice.toFixed(2)} - €{category.maxPrice.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">per persoon</div>
        </div>

        {/* Features */}
        <div className="space-y-2">
          {category.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle
                className={cn(
                  "w-4 h-4",
                  feature.included ? "text-green-500" : "text-gray-300",
                )}
              />
              <span
                className={cn(
                  "text-sm",
                  feature.included ? "text-gray-700" : "text-gray-400",
                )}
              >
                {feature.name}
              </span>
              {feature.popular && (
                <Badge className="text-xs bg-green-100 text-green-800">
                  Populair
                </Badge>
              )}
            </div>
          ))}
        </div>

        {/* Action Button */}
        <Button
          onClick={() => onBookNow?.(category.id)}
          className={cn(styles.button, "mt-6")}
        >
          Boek Nu
        </Button>
      </CardContent>
    </Card>
  );
}
