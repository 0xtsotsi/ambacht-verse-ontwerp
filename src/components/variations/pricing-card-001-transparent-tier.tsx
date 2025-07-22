"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Users, Calendar, Trophy } from "lucide-react";

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  minPrice: number;
  maxPrice: number;
  features: string[];
  popularFeatures: string[];
  icon: React.ReactNode;
  badge?: string;
  gradient: string;
}

interface ServicePricingCardProps {
  className?: string;
  onBookNow?: (category: string) => void;
  featured?: string; // category id to highlight as featured
}

const serviceCategories: ServiceCategory[] = [
  {
    id: "corporate",
    name: "Zakelijke Catering",
    description:
      "Professionele catering voor bedrijfsevenementen en zakelijke bijeenkomsten",
    minPrice: 18.5,
    maxPrice: 27.5,
    features: [
      "Professionele presentatie",
      "Flexibele menuopties",
      "Gediplomeerde chefs",
      "Premium ingrediënten",
      "Volledige service",
    ],
    popularFeatures: ["Meest gekozen door Fortune 500", "Gediplomeerde chefs"],
    icon: <Users className="h-6 w-6" />,
    badge: "Meest Populair",
    gradient:
      "from-sopranos-gold/10 via-sophisticated-green/5 to-elegant-cream/20",
  },
  {
    id: "social",
    name: "Sociale Evenementen",
    description:
      "Verfijnde catering voor privé feesten en sociale gelegenheden",
    minPrice: 15.75,
    maxPrice: 24.5,
    features: [
      "Creatieve menusamenstelling",
      "Seizoensgebonden specialiteiten",
      "Ambachtelijke preparatie",
      "Lokale leveranciers",
      "Persoonlijke service",
    ],
    popularFeatures: ["Seizoensgebonden specialiteiten", "Lokale leveranciers"],
    icon: <Star className="h-6 w-6" />,
    gradient:
      "from-refined-teal/10 via-elegant-cream/10 to-sophisticated-green/5",
  },
  {
    id: "wedding",
    name: "Bruiloft Catering",
    description: "Exclusieve culinaire ervaring voor uw perfecte dag",
    minPrice: 22.0,
    maxPrice: 35.0,
    features: [
      "Gepersonaliseerde menu's",
      "Uitgebreide proeverij",
      "Exclusieve locatie service",
      "Bruiloft specialisten",
      "Premium presentatie",
    ],
    popularFeatures: ["Gepersonaliseerde menu's", "Uitgebreide proeverij"],
    icon: <Trophy className="h-6 w-6" />,
    gradient: "from-classic-brown/10 via-sopranos-gold/5 to-elegant-cream/15",
  },
  {
    id: "custom",
    name: "Maatwerk Service",
    description:
      "Volledig op maat gemaakte culinaire concepten voor unieke evenementen",
    minPrice: 12.5,
    maxPrice: 42.5,
    features: [
      "Volledig maatwerk concept",
      "Persoonlijke chef consultant",
      "Unieke menu creatie",
      "Exclusieve ingrediënten",
      "White-glove service",
    ],
    popularFeatures: [
      "Volledig maatwerk concept",
      "Persoonlijke chef consultant",
    ],
    icon: <Calendar className="h-6 w-6" />,
    gradient:
      "from-deep-charcoal/5 via-sophisticated-green/10 to-refined-teal/5",
  },
];

export function ServicePricingCard({
  className,
  onBookNow,
  featured = "corporate",
}: ServicePricingCardProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [focusedCard, setFocusedCard] = useState<string | null>(null);

  const handleBookNow = (categoryId: string) => {
    onBookNow?.(categoryId);
  };

  return (
    <div className={cn("w-full max-w-7xl mx-auto p-6", className)}>
      {/* Header Section */}
      <div className="text-center mb-12 space-y-4">
        <h2 className="text-4xl font-serif text-deep-charcoal tracking-tight">
          Transparante Prijsstelling
        </h2>
        <p className="text-lg text-sophisticated-green/80 max-w-2xl mx-auto leading-relaxed">
          Eerlijke, transparante prijzen per persoon. Geen verborgen kosten, wel
          uitstekende kwaliteit.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-sopranos-gold font-medium">
          <CheckCircle className="h-4 w-4" />
          <span>Alle prijzen zijn inclusief BTW en service</span>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {serviceCategories.map((category) => {
          const isHovered = hoveredCard === category.id;
          const isFocused = focusedCard === category.id;
          const isFeatured = featured === category.id;
          const isActive = isHovered || isFocused;

          return (
            <Card
              key={category.id}
              className={cn(
                "relative overflow-hidden transition-all duration-500 ease-out cursor-pointer group",
                "border-2 hover:shadow-2xl hover:shadow-sopranos-gold/20",
                "transform hover:scale-[1.02] hover:-translate-y-2",
                isFeatured && "ring-2 ring-sopranos-gold/50 shadow-lg",
                isActive &&
                  "shadow-2xl shadow-sopranos-gold/30 scale-[1.02] -translate-y-2",
                "focus-within:ring-2 focus-within:ring-sopranos-gold focus-within:outline-none",
              )}
              onMouseEnter={() => setHoveredCard(category.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onFocus={() => setFocusedCard(category.id)}
              onBlur={() => setFocusedCard(null)}
              tabIndex={0}
            >
              {/* Animated Background Gradient */}
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br transition-opacity duration-500",
                  category.gradient,
                  isActive ? "opacity-100" : "opacity-50",
                )}
              />

              {/* Featured Badge */}
              {isFeatured && category.badge && (
                <div className="absolute -top-1 -right-1 z-10">
                  <Badge
                    className={cn(
                      "bg-sopranos-gold text-warm-white px-3 py-1 text-xs font-medium",
                      "animate-pulse hover:animate-none transition-all duration-300",
                      isActive && "scale-110",
                    )}
                  >
                    {category.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="relative z-10 pb-4">
                {/* Icon with Animation */}
                <div
                  className={cn(
                    "flex items-center gap-3 transition-all duration-300",
                    isActive && "transform scale-110",
                  )}
                >
                  <div
                    className={cn(
                      "p-3 rounded-xl bg-white/90 transition-all duration-300",
                      isActive && "bg-sopranos-gold text-white shadow-lg",
                    )}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-deep-charcoal font-medium">
                      {category.name}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-sophisticated-green/70 leading-relaxed mt-3">
                  {category.description}
                </p>
              </CardHeader>

              <CardContent className="relative z-10 space-y-6">
                {/* Pricing Section */}
                <div className="text-center space-y-2">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-deep-charcoal">
                      €{category.minPrice.toFixed(2)}
                    </span>
                    <span className="text-sophisticated-green/60 text-sm">
                      - €{category.maxPrice.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-sophisticated-green/60 font-medium">
                    per persoon, inclusief BTW
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-3">
                  {category.features.map((feature, index) => {
                    const isPopular =
                      category.popularFeatures.includes(feature);
                    return (
                      <div
                        key={index}
                        className={cn(
                          "flex items-start gap-2 transition-all duration-300",
                          isActive && "transform translate-x-1",
                        )}
                        style={{
                          transitionDelay: isActive ? `${index * 50}ms` : "0ms",
                        }}
                      >
                        <CheckCircle
                          className={cn(
                            "h-4 w-4 mt-0.5 transition-colors duration-300",
                            isPopular
                              ? "text-sopranos-gold"
                              : "text-sophisticated-green",
                            isActive &&
                              isPopular &&
                              "text-sopranos-gold scale-110",
                          )}
                        />
                        <span
                          className={cn(
                            "text-sm transition-all duration-300",
                            isPopular
                              ? "text-deep-charcoal font-medium"
                              : "text-sophisticated-green/80",
                            isActive && "text-deep-charcoal",
                          )}
                        >
                          {feature}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => handleBookNow(category.id)}
                  className={cn(
                    "w-full mt-6 transition-all duration-300 transform",
                    "bg-sopranos-gold hover:bg-sopranos-gold/90 text-warm-white",
                    "hover:shadow-lg hover:shadow-sopranos-gold/30",
                    isActive && "scale-105 shadow-lg shadow-sopranos-gold/30",
                  )}
                  size="lg"
                >
                  <span className="transition-all duration-300">
                    {isActive ? "Reserveer Nu" : "Meer Informatie"}
                  </span>
                </Button>
              </CardContent>

              {/* Subtle Border Animation */}
              <div
                className={cn(
                  "absolute inset-0 border-2 border-transparent rounded-lg",
                  "bg-gradient-to-r from-sopranos-gold via-elegant-cream to-sopranos-gold",
                  "opacity-0 transition-opacity duration-500",
                  isActive && "opacity-20",
                )}
              />
            </Card>
          );
        })}
      </div>

      {/* Trust Signal Footer */}
      <div className="mt-16 text-center space-y-4">
        <div className="flex items-center justify-center gap-8 text-sm text-sophisticated-green/60">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-sopranos-gold" />
            <span>Geen verborgen kosten</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-sopranos-gold" />
            <span>Flexibele annulering</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-sopranos-gold" />
            <span>24/7 klantenservice</span>
          </div>
        </div>
        <p className="text-xs text-sophisticated-green/50 max-w-2xl mx-auto">
          Alle prijzen zijn richtprijzen en kunnen variëren afhankelijk van
          specifieke wensen, locatie en seizoen. Voor een exacte offerte nodigen
          wij u uit voor een persoonlijk gesprek.
        </p>
      </div>
    </div>
  );
}
