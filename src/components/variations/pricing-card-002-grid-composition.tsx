import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Users, Heart, Building } from 'lucide-react';

interface ServicePricingCardProps {
  className?: string;
}

interface PricingTier {
  id: string;
  category: 'Corporate' | 'Social' | 'Wedding' | 'Custom';
  title: string;
  subtitle: string;
  priceRange: {
    min: number;
    max: number;
  };
  features: string[];
  highlighted?: boolean;
  icon: React.ReactNode;
  accent: string;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'corporate',
    category: 'Corporate',
    title: 'Zakelijk Catering',
    subtitle: 'Professionele bedrijfsevenementen',
    priceRange: { min: 18.50, max: 27.50 },
    features: [
      'Uitgebreide menuopties',
      'Professionele service',
      'Flexibele planning',
      'Premium presentatie'
    ],
    icon: <Building className="w-6 h-6" />,
    accent: 'bg-gradient-to-br from-blue-600 to-blue-700',
  },
  {
    id: 'wedding',
    category: 'Wedding',
    title: 'Bruiloft Catering',
    subtitle: 'Uw perfecte dag verdient perfectie',
    priceRange: { min: 22.50, max: 27.50 },
    features: [
      'Persoonlijke menusamenstelling',
      'Ceremoniële service',
      'Decoratieve presentatie',
      'Fotografvriendelijke opmaak'
    ],
    highlighted: true,
    icon: <Heart className="w-6 h-6" />,
    accent: 'bg-gradient-to-br from-rose-500 to-pink-600',
  },
  {
    id: 'social',
    category: 'Social',
    title: 'Sociale Evenementen',
    subtitle: 'Familiefeesten en bijeenkomsten',
    priceRange: { min: 12.50, max: 22.50 },
    features: [
      'Gezellige atmosfeer',
      'Gevarieerde keuzes',
      'Informele service',
      'Betaalbare luxe'
    ],
    icon: <Users className="w-6 h-6" />,
    accent: 'bg-gradient-to-br from-green-600 to-emerald-700',
  },
  {
    id: 'custom',
    category: 'Custom',
    title: 'Maatwerk Service',
    subtitle: 'Volledig aangepast aan uw wensen',
    priceRange: { min: 15.00, max: 27.50 },
    features: [
      'Unieke menuontwikkeling',
      'Themagerichte styling',
      'Persoonlijke begeleiding',
      'Creatieve vrijheid'
    ],
    icon: <Crown className="w-6 h-6" />,
    accent: 'bg-gradient-to-br from-amber-600 to-orange-700',
  },
];

export function ServicePricingCard({ className }: ServicePricingCardProps) {
  return (
    <section className={cn("py-16 px-4", className)}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section with Asymmetric Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-3">
              <Badge 
                variant="outline" 
                className="text-[#CC5D00] border-[#CC5D00] bg-[#FFEFDA] font-medium"
              >
                Transparante Prijzen
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-serif text-[#2C2C2C] leading-tight">
                Kwaliteit per persoon,{' '}
                <span className="text-[#CC5D00] italic">eerlijk geprijsd</span>
              </h2>
            </div>
            <p className="text-lg text-[#3D6160] leading-relaxed max-w-2xl">
              Ontdek onze transparante tarieven voor elke gelegenheid. Van intieme bijeenkomsten 
              tot grootschalige evenementen - wij bieden eerlijke prijzen zonder verborgen kosten.
            </p>
          </div>
          
          {/* Trust Signal Cards in Sidebar */}
          <div className="space-y-4">
            <Card className="border-[#3D6160]/20 bg-gradient-to-br from-[#FFEFDA] to-white">
              <CardContent className="p-6">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-[#CC5D00]">850+</div>
                  <div className="text-sm text-[#3D6160]">Tevreden klanten</div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-[#3D6160]/20 bg-gradient-to-br from-white to-[#FFEFDA]">
              <CardContent className="p-6">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-[#2B4040]">€850</div>
                  <div className="text-sm text-[#3D6160]">Gemiddelde bestelling</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Pricing Grid with Dynamic Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          {pricingTiers.map((tier) => (
            <Card
              key={tier.id}
              className={cn(
                "group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl",
                "hover:-translate-y-2 cursor-pointer",
                tier.highlighted 
                  ? "border-[#CC5D00] shadow-lg scale-105 lg:scale-110 z-10" 
                  : "border-[#3D6160]/20 hover:border-[#CC5D00]/50",
                tier.highlighted && "xl:col-span-1 xl:row-span-2" // Make highlighted card taller on XL screens
              )}
            >
              {tier.highlighted && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#CC5D00] to-[#BB3A3C] text-white text-center py-2 text-sm font-medium">
                  Meest Populair
                </div>
              )}

              <CardHeader className={cn("relative", tier.highlighted && "pt-8")}>
                {/* Category Icon with Accent */}
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4",
                  tier.accent
                )}>
                  {tier.icon}
                </div>

                {/* Category Badge */}
                <Badge 
                  variant="secondary" 
                  className="w-fit mb-2 bg-[#3D6160]/10 text-[#3D6160] border-0"
                >
                  {tier.category}
                </Badge>

                {/* Title and Subtitle */}
                <div className="space-y-2">
                  <h3 className="text-xl font-serif text-[#2C2C2C] font-semibold leading-tight">
                    {tier.title}
                  </h3>
                  <p className="text-sm text-[#3D6160] leading-relaxed">
                    {tier.subtitle}
                  </p>
                </div>

                {/* Price Display with Enhanced Typography */}
                <div className="mt-6 space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-[#CC5D00]">
                      €{tier.priceRange.min.toFixed(2)}
                    </span>
                    <span className="text-lg text-[#3D6160]">-</span>
                    <span className="text-2xl font-bold text-[#CC5D00]">
                      €{tier.priceRange.max.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-[#3D6160]">per persoon</p>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features Grid */}
                <div className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-[#2B4040] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-[#2C2C2C] leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button 
                  className={cn(
                    "w-full transition-all duration-300 font-medium",
                    tier.highlighted
                      ? "bg-[#CC5D00] hover:bg-[#BB3A3C] text-white shadow-lg hover:shadow-xl"
                      : "bg-[#2B4040] hover:bg-[#3D6160] text-white"
                  )}
                >
                  Reserveer Nu
                </Button>

                {/* Additional Info for Highlighted Card */}
                {tier.highlighted && (
                  <div className="mt-4 p-4 bg-gradient-to-r from-[#FFEFDA] to-[#FFEFDA]/50 rounded-lg">
                    <p className="text-xs text-[#3D6160] text-center leading-relaxed">
                      Inclusief persoonlijke planning en styling advies
                    </p>
                  </div>
                )}
              </CardContent>

              {/* Hover Effect Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#CC5D00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </Card>
          ))}
        </div>

        {/* Bottom Call-to-Action Section */}
        <div className="mt-16 text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-4">
            <h3 className="text-2xl font-serif text-[#2C2C2C]">
              Heeft u vragen over onze tarieven?
            </h3>
            <p className="text-[#3D6160] leading-relaxed">
              Onze ervaren planners staan klaar om u persoonlijk te adviseren 
              over de beste keuze voor uw evenement.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              className="bg-[#CC5D00] hover:bg-[#BB3A3C] text-white px-8 py-3 font-medium"
            >
              Gratis Offerte Aanvragen
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-[#3D6160] text-[#3D6160] hover:bg-[#3D6160] hover:text-white px-8 py-3"
            >
              Bel: 06 1234 5678
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}