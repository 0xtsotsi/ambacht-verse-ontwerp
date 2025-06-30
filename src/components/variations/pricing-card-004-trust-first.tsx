"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, Shield, Users, Award, Star, 
  Heart, DollarSign, Clock, Truck, Phone 
} from 'lucide-react';

// INFINITE LOOP VARIATION 2: Trust-First Psychology
// Dutch cultural emphasis on reliability and social proof
// Leading with guarantees and testimonials before price

interface TrustSignal {
  icon: React.ReactNode;
  title: string;
  description: string;
  metric?: string;
}

interface PricingOption {
  id: string;
  name: string;
  tagline: string;
  priceRange: string;
  exactPrice: number;
  guarantees: string[];
  socialProof: string;
  trustSignals: TrustSignal[];
  included: string[];
  clientTestimonial: {
    quote: string;
    author: string;
    company: string;
    rating: number;
  };
  isPopular?: boolean;
}

interface TrustFirstPricingProps {
  className?: string;
  onSelectOption?: (optionId: string) => void;
}

const pricingOptions: PricingOption[] = [
  {
    id: 'betrouwbaar',
    name: 'Betrouwbaar Basis',
    tagline: 'De veilige keuze voor uw evenement',
    priceRange: '€25-32',
    exactPrice: 28.50,
    guarantees: [
      'Tevredenheidsgarantie of geld terug',
      '24/7 bereikbaarheid dag van evenement',
      'Backup plan voor elke situatie',
      'Vaste contactpersoon toegewezen'
    ],
    socialProof: '847 tevreden klanten dit jaar',
    trustSignals: [
      {
        icon: <Shield className="h-5 w-5" />,
        title: 'Verzekerd',
        description: 'Volledig verzekerd tot €2M',
      },
      {
        icon: <Award className="h-5 w-5" />,
        title: 'Gecertificeerd',
        description: 'HACCP & BIO gecertificeerd',
      },
      {
        icon: <Clock className="h-5 w-5" />,
        title: 'Punctueel',
        description: '99.7% on-time delivery',
        metric: '99.7%'
      }
    ],
    included: [
      'Lokale biologische ingrediënten',
      'Professioneel opgeleide chefs',
      'Standaard servies & materialen',
      'Setup en afruimen inbegrepen',
      'Flexibele menu aanpassingen'
    ],
    clientTestimonial: {
      quote: "Betrouwbaar, lekker en zonder stress. Precies wat je wilt voor een bedrijfsevent.",
      author: "Marieke van der Berg",
      company: "Philips Nederland",
      rating: 5
    }
  },
  {
    id: 'vertrouwd',
    name: 'Vertrouwd Premium',
    tagline: 'De Nederlandse standaard voor kwaliteit',
    priceRange: '€35-45',
    exactPrice: 39.75,
    guarantees: [
      'Perfecte dag garantie - geen stress',
      'Dedicated event coordinator',
      'Voorproeverij altijd mogelijk',
      'Onbeperkte wijzigingen tot 48u tevoren',
      'Backup catering bij force majeure'
    ],
    socialProof: 'Vertrouwd door 230+ Nederlandse bedrijven',
    trustSignals: [
      {
        icon: <Users className="h-5 w-5" />,
        title: 'Ervaren Team',
        description: '12+ jaar ervaring gemiddeld',
        metric: '12+ jaar'
      },
      {
        icon: <Star className="h-5 w-5" />,
        title: 'Top Rated',
        description: '4.9/5 gemiddelde beoordeling',
        metric: '4.9/5'
      },
      {
        icon: <Heart className="h-5 w-5" />,
        title: 'Lokaal',
        description: '85% ingrediënten binnen 50km',
        metric: '85%'
      }
    ],
    included: [
      'Premium biologische ingrediënten',
      'Sous-chef ter plaatse aanwezig',
      'Elegant servies & linnen',
      'Wijn- en drankadvies',
      'Decoratieve presentatie',
      'Live cooking opties'
    ],
    clientTestimonial: {
      quote: "Ons jubileumfeest was perfect. Het team dacht mee en leverde meer dan beloofd.",
      author: "Jan Smit",
      company: "De Nederlandsche Bank",
      rating: 5
    },
    isPopular: true
  },
  {
    id: 'exclusief',
    name: 'Exclusief Luxury',
    tagline: 'Voor wie het allerbeste verdient',
    priceRange: '€48-65',
    exactPrice: 55.00,
    guarantees: [
      'Onbeperkte perfectie garantie',
      'Personal chef de cuisine',
      'Vooraf locatiebezoek met planning',
      'Luxe backup faciliteiten standby',
      '100% tevredenheid of volledige terugbetaling'
    ],
    socialProof: 'Exclusief gekozen door Nederlandse elite',
    trustSignals: [
      {
        icon: <Award className="h-5 w-5" />,
        title: 'Award Winning',
        description: 'Beste Cateraar Nederland 2023',
      },
      {
        icon: <DollarSign className="h-5 w-5" />,
        title: 'Premium',
        description: 'Top 1% Nederlandse cateraars',
      },
      {
        icon: <Truck className="h-5 w-5" />,
        title: 'Nationwide',
        description: 'Service door heel Nederland',
      }
    ],
    included: [
      'Exclusieve seizoens ingrediënten',
      'Dedicated chef de cuisine team',
      'Luxe kristal & porselein servies',
      'Sommelier voor wijn selectie',
      'Artistieke food styling',
      'White-glove table service',
      'Event fotografie inbegrepen'
    ],
    clientTestimonial: {
      quote: "Onze gasten praten er nog steeds over. Wereldklasse service in Nederland.",
      author: "Alexandra Koning",
      company: "Koninklijke Familie Event",
      rating: 5
    }
  }
];

export function TrustFirstPricing({ className, onSelectOption }: TrustFirstPricingProps) {
  const [selectedOption, setSelectedOption] = useState<string>('vertrouwd');
  const [activeTab, setActiveTab] = useState('guarantees');

  const handleSelectOption = (optionId: string) => {
    setSelectedOption(optionId);
    onSelectOption?.(optionId);
  };

  const selectedOptionData = pricingOptions.find(opt => opt.id === selectedOption);

  return (
    <div className={cn("w-full max-w-7xl mx-auto p-6", className)}>
      {/* Trust-Forward Header */}
      <div className="text-center mb-12 space-y-6">
        <div className="flex items-center justify-center gap-2 text-sopranos-gold text-sm font-medium">
          <Shield className="h-5 w-5" />
          <span>Vertrouwd door 2000+ Nederlandse Families & Bedrijven</span>
        </div>
        <h2 className="text-4xl font-serif text-deep-charcoal tracking-tight">
          Eerst Vertrouwen, Dan Prijs
        </h2>
        <p className="text-xl text-sophisticated-green/80 max-w-3xl mx-auto leading-relaxed">
          Nederlandse waarden: betrouwbaarheid, kwaliteit en eerlijkheid. 
          Daarom beginnen wij met onze garanties, niet onze prijzen.
        </p>
      </div>

      {/* Quick Trust Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-sopranos-gold">2000+</div>
          <div className="text-sm text-sophisticated-green/70">Tevreden Klanten</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-sopranos-gold">4.9/5</div>
          <div className="text-sm text-sophisticated-green/70">Gemiddelde Review</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-sopranos-gold">99.7%</div>
          <div className="text-sm text-sophisticated-green/70">Op Tijd Bezorgd</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-sopranos-gold">0</div>
          <div className="text-sm text-sophisticated-green/70">Verborgen Kosten</div>
        </div>
      </div>

      {/* Pricing Options */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {pricingOptions.map((option) => {
          const isSelected = selectedOption === option.id;

          return (
            <Card
              key={option.id}
              className={cn(
                "relative overflow-hidden transition-all duration-500 cursor-pointer h-full",
                "hover:shadow-2xl hover:shadow-sopranos-gold/20 hover:scale-[1.02]",
                isSelected && "ring-2 ring-sopranos-gold shadow-2xl scale-[1.02]",
                option.isPopular && "ring-2 ring-blue-500/50"
              )}
              onClick={() => handleSelectOption(option.id)}
            >
              {/* Popular Badge */}
              {option.isPopular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-blue-600 text-white px-4 py-1 text-xs font-medium">
                    Meest Gekozen
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="space-y-3">
                  <h3 className="text-2xl font-serif text-deep-charcoal font-medium">
                    {option.name}
                  </h3>
                  <p className="text-sm text-sopranos-gold font-medium">
                    {option.tagline}
                  </p>
                  
                  {/* Social Proof First */}
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="flex items-center justify-center gap-2 text-green-700 text-sm">
                      <Users className="h-4 w-4" />
                      <span>{option.socialProof}</span>
                    </div>
                  </div>

                  {/* Price (Secondary) */}
                  <div className="py-2">
                    <div className="text-3xl font-bold text-deep-charcoal">
                      {option.priceRange}
                    </div>
                    <div className="text-sm text-sophisticated-green/60">
                      per persoon | exact: €{option.exactPrice}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Trust Signals */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-deep-charcoal">Vertrouwenssignalen:</h4>
                  {option.trustSignals.map((signal, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="text-sopranos-gold">{signal.icon}</div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-deep-charcoal">
                          {signal.title}
                          {signal.metric && (
                            <span className="ml-2 text-sopranos-gold">{signal.metric}</span>
                          )}
                        </div>
                        <div className="text-xs text-sophisticated-green/70">
                          {signal.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Top Guarantees */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-deep-charcoal">Onze Garanties:</h4>
                  {option.guarantees.slice(0, 3).map((guarantee, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-sopranos-gold mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-sophisticated-green/80">{guarantee}</span>
                    </div>
                  ))}
                  {option.guarantees.length > 3 && (
                    <div className="text-xs text-sopranos-gold font-medium">
                      +{option.guarantees.length - 3} meer garanties
                    </div>
                  )}
                </div>

                {/* Client Testimonial */}
                <div className="bg-elegant-cream/30 p-4 rounded-lg border">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(option.clientTestimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-sopranos-gold text-sopranos-gold" />
                    ))}
                  </div>
                  <p className="text-sm text-deep-charcoal/80 italic mb-2">
                    "{option.clientTestimonial.quote}"
                  </p>
                  <div className="text-xs text-sophisticated-green/60">
                    - {option.clientTestimonial.author}, {option.clientTestimonial.company}
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  className={cn(
                    "w-full transition-all duration-300",
                    isSelected 
                      ? "bg-sopranos-gold hover:bg-sopranos-gold/90 text-white"
                      : "bg-deep-charcoal hover:bg-deep-charcoal/90 text-white"
                  )}
                  size="lg"
                >
                  {isSelected ? 'Meer Details Bekijken' : 'Vertrouw Op Deze Keuze'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Information Tabs */}
      {selectedOptionData && (
        <Card className="mb-12">
          <CardHeader>
            <h3 className="text-2xl font-serif text-deep-charcoal text-center">
              Volledige Details: {selectedOptionData.name}
            </h3>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="guarantees">Alle Garanties</TabsTrigger>
                <TabsTrigger value="included">Wat is Inbegrepen</TabsTrigger>
                <TabsTrigger value="contact">Direct Contact</TabsTrigger>
              </TabsList>
              
              <TabsContent value="guarantees" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedOptionData.guarantees.map((guarantee, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                      <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-green-800">{guarantee}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="included" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedOptionData.included.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-blue-800">{item}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="contact" className="mt-6">
                <div className="text-center space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-sopranos-gold">
                      <Phone className="h-5 w-5" />
                      <span className="text-lg font-medium">Praat direct met onze expert</span>
                    </div>
                    <p className="text-sophisticated-green/80 max-w-2xl mx-auto">
                      Geen chatbots of wachtrijen. Binnen 2 minuten verbonden met een echte expert 
                      die uw wensen begrijpt en direct kan adviseren.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                    <Button className="bg-green-600 hover:bg-green-700 text-white" size="lg">
                      <Phone className="h-4 w-4 mr-2" />
                      Bel Nu: 020-123-4567
                    </Button>
                    <Button variant="outline" size="lg">
                      Plan Videocall
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Final Trust Signal */}
      <div className="bg-deep-charcoal text-white rounded-xl p-8 text-center">
        <h3 className="text-2xl font-serif mb-4">Nederlandse Betrouwbaarheid</h3>
        <p className="text-sophisticated-green/80 mb-6 max-w-2xl mx-auto">
          "Zeggen wat je doet, doen wat je zegt" - dat is Wesley's Ambacht. 
          Sinds 2015 de vertrouwde keuze van Nederlandse families en bedrijven.
        </p>
        <div className="flex items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-sopranos-gold" />
            <span>Gecertificeerd & Verzekerd</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-sopranos-gold" />
            <span>Familiebedrijf</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-sopranos-gold" />
            <span>100% Garantie</span>
          </div>
        </div>
      </div>
    </div>
  );
}