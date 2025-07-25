import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, Heart, Award, Trophy, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export const Testimonials = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const testimonials = [
    {
      name: "Marie van den Berg",
      company: "Techniek Groep Gelderland",
      text: "Wesley's catering heeft ons bedrijfsfeest tot een groot succes gemaakt. De pulled pork was fenomenaal en de service was onberispelijk. Alle 120 gasten waren zeer tevreden!",
      rating: 5,
      event: "Bedrijfsfeest",
    },
    {
      name: "Jan Hoekstra",
      company: "Hoekstra & Zonen BV",
      text: "Al jaren laten wij onze lunch verzorgen door Wesley's Ambacht. Altijd vers, altijd op tijd, en de kwaliteit is constant uitstekend. Een betrouwbare partner!",
      rating: 5,
      event: "Kantoor Catering",
    },
    {
      name: "Sandra Pietersen",
      company: "Privé klant",
      text: "Voor mijn 50ste verjaardag heeft Wesley een prachtig buffet verzorgd. De combinatie van traditionele gerechten met moderne presentatie was perfect. Mijn gasten zijn nog steeds vol lof!",
      rating: 5,
      event: "Verjaardag Buffet",
    },
    {
      name: "Dirk van Schaik",
      company: "Van Schaik Installatietechniek",
      text: "De BBQ die Wesley voor ons team heeft verzorgd was fantastisch. Het vlees was perfect bereid en de sfeer die hij creëerde was geweldig. Absoluut een aanrader!",
      rating: 5,
      event: "Team BBQ",
    },
  ];

  return (
    <section
      className="py-32 bg-gray-50 overflow-hidden relative"
      ref={sectionRef}
    >
      <div className="container mx-auto px-16">
        <div className="max-w-6xl mx-auto">
          {/* V5 Interactive Section Header */}
          <div className="text-center mb-24">
            <h2
              className="text-7xl md:text-8xl font-elegant-heading text-elegant-dark mb-12 font-light tracking-[-0.02em] relative inline-block group"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? "translateY(0) scale(1)"
                  : "translateY(40px) scale(0.95)",
                transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <span className="inline-block transition-all duration-700 hover:scale-110 hover:-translate-y-2">
                WAT ONZE
              </span>
              <br />
              <span className="text-terracotta-600 inline-block transition-all duration-700 hover:scale-110 hover:-translate-y-2 relative">
                KLANTEN ZEGGEN
                <span className="absolute inset-0 blur-3xl bg-terracotta-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></span>
              </span>
            </h2>
            <div
              className="relative w-32 h-px bg-terracotta-600 mx-auto mb-12 overflow-hidden"
              style={{
                opacity: isVisible ? 1 : 0,
                transition: "opacity 0.8s ease-out 0.4s",
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-terracotta-400 to-transparent animate-pulse"></span>
            </div>
            <p
              className="text-2xl text-elegant-dark font-elegant-body font-light max-w-3xl mx-auto leading-relaxed"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.8s ease-out 0.6s",
              }}
            >
              Niets maakt ons trotser dan tevreden klanten. Lees wat anderen
              over hun ervaring met Wesley's Ambacht te zeggen hebben.
            </p>
          </div>

          {/* V5 Interactive Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="relative group cursor-pointer"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(40px)",
                  transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${0.8 + index * 0.2}s`,
                }}
              >
                <Card className="h-full bg-white/90 backdrop-blur-sm border-terracotta-200/30 hover:bg-white hover:shadow-elegant-panel transition-all duration-700 transform hover:scale-105 hover:-translate-y-2 overflow-hidden">
                  <CardContent className="p-12 relative">
                    {/* V5 Interactive Quote Icon */}
                    <div className="absolute top-8 right-8 opacity-20 transition-all duration-700 group-hover:opacity-40 group-hover:scale-125 group-hover:rotate-12">
                      <Quote className="w-16 h-16 text-terracotta-600" />
                    </div>

                    {/* Interactive glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-terracotta-50/0 via-terracotta-100/10 to-terracotta-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    {/* V5 Interactive Rating */}
                    <div className="flex items-center mb-6 relative z-10">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-6 h-6 text-terracotta-600 fill-current transition-all duration-500 hover:scale-125"
                          style={{
                            animationDelay: `${i * 0.1}s`,
                            animation:
                              hoveredCard === index
                                ? "interactive-bounce 1s ease-out"
                                : "none",
                          }}
                        />
                      ))}
                      <span className="ml-3 text-sm text-elegant-grey-600 font-elegant-body font-light group-hover:text-terracotta-600 transition-colors duration-500">
                        {testimonial.rating}/5 sterren
                      </span>
                    </div>

                    {/* V5 Interactive Event Type Badge */}
                    <div className="inline-block px-4 py-2 bg-terracotta-100/50 border border-terracotta-300/50 rounded-full text-sm text-terracotta-700 font-elegant-body font-medium mb-6 transition-all duration-500 hover:bg-terracotta-200/70 hover:scale-110 hover:shadow-elegant-soft relative z-10">
                      {testimonial.event}
                    </div>

                    {/* V5 Interactive Testimonial Text */}
                    <blockquote className="text-elegant-grey-700 font-elegant-body text-lg leading-relaxed mb-8 relative z-10 transition-all duration-700 group-hover:text-elegant-dark">
                      <span className="text-terracotta-600 text-2xl mr-2 font-elegant-script">
                        "
                      </span>
                      {testimonial.text}
                      <span className="text-terracotta-600 text-2xl ml-2 font-elegant-script">
                        "
                      </span>
                    </blockquote>

                    {/* V5 Interactive Author */}
                    <div className="border-t border-terracotta-200/50 pt-6 relative z-10">
                      <div className="font-elegant-heading text-elegant-dark text-xl font-light transition-all duration-500 group-hover:text-terracotta-600">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-elegant-grey-600 font-elegant-body font-light mt-1 transition-all duration-500 group-hover:text-elegant-grey-700">
                        {testimonial.company}
                      </div>
                    </div>

                    {/* V5 Interactive Decorative Element */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-terracotta-400 via-terracotta-600 to-terracotta-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>

                    {/* Shimmer effect on hover */}
                    <div className="absolute inset-0 -top-full -bottom-full bg-gradient-to-r from-transparent via-white/10 to-transparent w-full animate-interactive-shimmer opacity-0 group-hover:opacity-100 pointer-events-none"></div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* V5 Interactive Trust Indicators */}
          <div
            className="bg-gradient-to-br from-elegant-dark via-gray-800 to-elegant-dark rounded-3xl p-12 md:p-16 relative overflow-hidden group cursor-pointer transform transition-all duration-700 hover:scale-105 hover:shadow-2xl"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(40px)",
              transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1) 1.4s",
            }}
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-terracotta-600/10 via-transparent to-terracotta-600/10 animate-pulse"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center relative z-10">
              <div className="transform transition-all duration-500 hover:scale-110 hover:-translate-y-2 group">
                <div className="text-5xl md:text-6xl font-elegant-heading text-terracotta-400 mb-3 font-light animate-interactive-pulse-glow">
                  500+
                </div>
                <div className="text-white/80 font-elegant-body font-light">
                  Tevreden Klanten
                </div>
              </div>
              <div
                className="transform transition-all duration-500 hover:scale-110 hover:-translate-y-2 group"
                style={{ animationDelay: "0.1s" }}
              >
                <div
                  className="text-5xl md:text-6xl font-elegant-heading text-terracotta-400 mb-3 font-light animate-interactive-pulse-glow"
                  style={{ animationDelay: "0.2s" }}
                >
                  15+
                </div>
                <div className="text-white/80 font-elegant-body font-light">
                  Jaar Ervaring
                </div>
              </div>
              <div
                className="transform transition-all duration-500 hover:scale-110 hover:-translate-y-2 group"
                style={{ animationDelay: "0.2s" }}
              >
                <div
                  className="text-5xl md:text-6xl font-elegant-heading text-terracotta-400 mb-3 font-light animate-interactive-pulse-glow"
                  style={{ animationDelay: "0.4s" }}
                >
                  98%
                </div>
                <div className="text-white/80 font-elegant-body font-light">
                  Klanten Komen Terug
                </div>
              </div>
              <div
                className="transform transition-all duration-500 hover:scale-110 hover:-translate-y-2 group"
                style={{ animationDelay: "0.3s" }}
              >
                <div
                  className="text-5xl md:text-6xl font-elegant-heading text-terracotta-400 mb-3 font-light animate-interactive-pulse-glow"
                  style={{ animationDelay: "0.6s" }}
                >
                  4.9
                </div>
                <div className="text-white/80 font-elegant-body font-light">
                  Gemiddelde Score
                </div>
              </div>
            </div>
          </div>

          {/* V5 Interactive Call to Action */}
          <div
            className="text-center mt-24"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(30px)",
              transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1) 1.6s",
            }}
          >
            <h3 className="text-5xl font-elegant-script text-terracotta-600 mb-6 font-light animate-organic-float">
              Hopelijk tot ziens!
            </h3>
            <p className="text-elegant-dark font-elegant-body text-xl mb-8 max-w-2xl mx-auto leading-relaxed font-light">
              Wilt u ook deel uitmaken van onze tevreden klanten? Neem contact
              met ons op voor een vrijblijvende offerte.
            </p>
            <div className="relative w-24 h-px bg-terracotta-600 mx-auto overflow-hidden">
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-terracotta-400 to-transparent animate-pulse"></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
