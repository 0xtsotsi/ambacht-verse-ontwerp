
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Marie van den Berg",
      company: "Techniek Groep Gelderland",
      text: "Wesley's catering heeft ons bedrijfsfeest tot een groot succes gemaakt. De pulled pork was fenomenaal en de service was onberispelijk. Alle 120 gasten waren zeer tevreden!",
      rating: 5,
      event: "Bedrijfsfeest"
    },
    {
      name: "Jan Hoekstra", 
      company: "Hoekstra & Zonen BV",
      text: "Al jaren laten wij onze lunch verzorgen door Wesley's Ambacht. Altijd vers, altijd op tijd, en de kwaliteit is constant uitstekend. Een betrouwbare partner!",
      rating: 5,
      event: "Kantoor Catering"
    },
    {
      name: "Sandra Pietersen",
      company: "Privé klant",
      text: "Voor mijn 50ste verjaardag heeft Wesley een prachtig buffet verzorgd. De combinatie van traditionele gerechten met moderne presentatie was perfect. Mijn gasten zijn nog steeds vol lof!",
      rating: 5,
      event: "Verjaardag Buffet"
    },
    {
      name: "Dirk van Schaik",
      company: "Van Schaik Installatietechniek",
      text: "De BBQ die Wesley voor ons team heeft verzorgd was fantastisch. Het vlees was perfect bereid en de sfeer die hij creëerde was geweldig. Absoluut een aanrader!",
      rating: 5,
      event: "Team BBQ"
    }
  ];

  return (
    <section className="py-20 bg-clean-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-forest-green mb-4">
              Wat Onze Klanten Zeggen
            </h2>
            <div className="w-24 h-1 bg-burnt-orange mx-auto mb-6"></div>
            <p className="text-xl text-natural-brown max-w-3xl mx-auto">
              Niets maakt ons trotser dan tevreden klanten. Lees wat anderen over hun ervaring 
              met Wesley's Ambacht te zeggen hebben.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 bg-warm-cream border-beige/30 overflow-hidden">
                <CardContent className="p-8 relative">
                  {/* Quote Icon */}
                  <div className="absolute top-6 right-6 opacity-20">
                    <Quote className="w-12 h-12 text-forest-green" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-burnt-orange fill-current" />
                    ))}
                    <span className="ml-2 text-sm text-natural-brown">
                      {testimonial.rating}/5 sterren
                    </span>
                  </div>

                  {/* Event Type Badge */}
                  <div className="inline-block px-3 py-1 bg-forest-green/10 border border-forest-green/20 rounded-full text-xs text-forest-green font-medium mb-4">
                    {testimonial.event}
                  </div>

                  {/* Testimonial Text */}
                  <blockquote className="text-natural-brown leading-relaxed mb-6 relative z-10">
                    "{testimonial.text}"
                  </blockquote>

                  {/* Author */}
                  <div className="border-t border-beige pt-4">
                    <div className="font-serif text-forest-green font-semibold">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-natural-brown">
                      {testimonial.company}
                    </div>
                  </div>

                  {/* Decorative Element */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-forest-green via-burnt-orange to-deep-teal transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="bg-forest-green rounded-xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-serif text-burnt-orange mb-2">500+</div>
                <div className="text-warm-cream/90">Tevreden Klanten</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-serif text-burnt-orange mb-2">15+</div>
                <div className="text-warm-cream/90">Jaar Ervaring</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-serif text-burnt-orange mb-2">98%</div>
                <div className="text-warm-cream/90">Klanten Komen Terug</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-serif text-burnt-orange mb-2">4.9</div>
                <div className="text-warm-cream/90">Gemiddelde Score</div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <h3 className="text-2xl font-serif text-forest-green mb-4">
              Hopelijk tot ziens!
            </h3>
            <p className="text-natural-brown text-lg mb-6">
              Wilt u ook deel uitmaken van onze tevreden klanten? 
              Neem contact met ons op voor een vrijblijvende offerte.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
