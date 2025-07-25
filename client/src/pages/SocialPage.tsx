import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, PartyPopper, Gift, Calendar, Music, Star, CheckCircle2, Users, Heart } from "lucide-react";
import { FloatingBookingWidget } from "@/components/FloatingBookingWidget";
import { Navigation } from "@/components/Navigation";
import socialHeroImage from "@assets/1000005723_1753439577480.jpg";
import birthdayImage from "@assets/1000005739_1753439577480.jpg";
import anniversaryImage from "@assets/1000005737_1753439577482.jpg";
import familyImage from "@assets/1000005760_1753439577478.jpg";

export const SocialPage = () => {
  const [activeEvent, setActiveEvent] = useState("birthday");
  const [isVisible, setIsVisible] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHeroLoaded(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const socialEvents = {
    birthday: {
      title: "Birthday Celebrations",
      subtitle: "VERJAARDAG FEESTEN",
      price: "€22",
      image: birthdayImage,
      description: "Maak elke verjaardag onvergetelijk met onze creatieve party catering, van intieme family dinners tot grote surprise parties",
      features: [
        "Interactive food stations (taco bar, burger station)",
        "Kid-friendly finger foods en healthy options",
        "Custom birthday cake coordination",
        "Party decoratie assistance beschikbaar",
        "Flexible timing voor surprise parties",
        "Cleanup service included"
      ],
      menuHighlights: [
        "Build-your-own taco en pizza stations",
        "Mini sliders en stuffed mushrooms",
        "Veggie platters met premium dips",
        "Cupcake towers en dessert bars",
        "Candy stations voor kids"
      ]
    },
    anniversary: {
      title: "Anniversary Parties",
      subtitle: "JUBILEUM VIERINGEN",
      price: "€35",
      image: anniversaryImage,
      description: "Elegante catering voor jubileum vieringen en milestone celebrations met sophisticated menu opties en romantic ambiance",
      features: [
        "Elegant plated service of family-style options",
        "Wine pairings en signature cocktails",
        "Romantic table settings en ambiance lighting",
        "Custom menu development voor special diets",
        "Professional service staff",
        "Memory wall foto display assistance"
      ],
      menuHighlights: [
        "Prosciutto-wrapped melon met goat cheese",
        "Baked brie met pomegranates en honey",
        "Seafood tartlets en shrimp cocktail",
        "Classic comfort foods met gourmet twist",
        "High tea service voor afternoon celebrations"
      ]
    },
    family: {
      title: "Family Gatherings",
      subtitle: "FAMILIE BIJEENKOMSTEN",
      price: "€28",
      image: familyImage,
      description: "Warme, comfortable catering voor family reunions, holiday celebrations en special family moments die generaties samenbrengen",
      features: [
        "Multi-generational menu options",
        "Large portion family-style serving",
        "Accommodation voor dietary restrictions",
        "Comfort food focus met healthy options",
        "Easy setup voor home gatherings",
        "Traditional holiday meal specialties"
      ],
      menuHighlights: [
        "Family-style roasted chicken en beef",
        "Traditional comfort foods",
        "Seasonal vegetable medleys",
        "Homemade desserts en family recipes",
        "Kids menu met healthy choices"
      ]
    }
  };

  const scrollToEvents = () => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <FloatingBookingWidget />
      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${socialHeroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        
        <div className={`relative z-10 text-center text-white px-4 transition-all duration-1000 ${
          heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="flex items-center justify-center gap-3 mb-6">
            <PartyPopper className="w-8 h-8 text-[#D4AF37]" />
            <p className="text-script text-2xl" style={{ color: '#D4AF37', fontFamily: 'Great Vibes, cursive' }}>
              Celebrate Life
            </p>
          </div>
          <h1 className="text-white mb-8" style={{ 
            fontSize: '5rem', 
            fontWeight: '900', 
            lineHeight: '1.1',
            fontFamily: 'Playfair Display, serif',
            textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
            letterSpacing: '0.02em'
          }}>
            SOCIALE EVENEMENTEN
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Van intieme verjaardagen tot grote familie reunions - wij maken elke sociale gelegenheid 
            speciaal met catering die herinneringen creëert.
          </p>
        </div>

        {/* Scroll Arrow */}
        <div 
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer group"
          onClick={scrollToEvents}
        >
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 shadow-lg group-hover:scale-110">
            <ChevronDown className="w-6 h-6 text-white group-hover:text-[#E86C32] transition-colors duration-300" />
          </div>
        </div>
      </section>

      {/* Social Events Section */}
      <section className="py-20 bg-[#F9F6F1]" ref={sectionRef}>
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className={`max-w-4xl mx-auto text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-[#E86C32]" />
              <p className="text-script text-2xl" style={{ color: '#D4AF37', fontFamily: 'Great Vibes, cursive' }}>
                Special Moments
              </p>
            </div>
            <h2 className="text-4xl font-bold mb-8 text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              SOCIALE EVENEMENTEN CATERING
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#E86C32] to-[#D4B170] mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 leading-relaxed" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              Elke sociale gebeurtenis verdient speciale aandacht. Of het nu een intieme verjaardag, jubileum viering 
              of grote familie reunions is - wij zorgen voor catering die past bij de stemming en uw gasten blij maakt.
            </p>
          </div>

          {/* Event Benefits */}
          <div className={`grid md:grid-cols-3 gap-8 mb-16 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <Gift className="w-12 h-12 text-[#E86C32] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                Persoonlijke Touch
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                Elke event wordt gepersonaliseerd naar jouw wensen en de voorkeuren van jouw gasten.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <Music className="w-12 h-12 text-[#E86C32] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                Party Atmosfeer
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                Onze interactive food stations en creative presentations zorgen voor een levendige party sfeer.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <Users className="w-12 h-12 text-[#E86C32] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                Alle Leeftijden
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                Menu opties die alle leeftijdsgroepen aanspreken, van kids tot senioren.
              </p>
            </div>
          </div>

          {/* Event Selection */}
          <div className={`transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
                SELECTEER UW EVENEMENT TYPE
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {Object.entries(socialEvents).map(([key, event]) => (
                  <button
                    key={key}
                    onClick={() => setActiveEvent(key)}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
                      activeEvent === key
                        ? 'text-white'
                        : 'bg-white text-[#E86C32] border-2 border-[#E86C32] hover:bg-[#E86C32] hover:text-white'
                    }`}
                    style={{
                      background: activeEvent === key ? 'linear-gradient(135deg, #E86C32 0%, #D4B170 100%)' : '',
                      border: activeEvent === key ? 'none' : ''
                    }}
                  >
                    {event.subtitle}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Event Details */}
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="grid lg:grid-cols-2 gap-0">
                  {/* Image */}
                  <div className="relative h-96 lg:h-auto overflow-hidden">
                    <img 
                      src={socialEvents[activeEvent as keyof typeof socialEvents].image}
                      alt={socialEvents[activeEvent as keyof typeof socialEvents].subtitle}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-6 right-6 bg-gradient-to-r from-[#E86C32] to-[#D4B170] text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                      {socialEvents[activeEvent as keyof typeof socialEvents].price}/persoon
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar className="w-6 h-6 text-[#E86C32]" />
                      <span className="text-[#E86C32] font-semibold text-sm uppercase tracking-wide">
                        {socialEvents[activeEvent as keyof typeof socialEvents].subtitle}
                      </span>
                    </div>

                    <h3 className="text-3xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {socialEvents[activeEvent as keyof typeof socialEvents].title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed mb-6" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                      {socialEvents[activeEvent as keyof typeof socialEvents].description}
                    </p>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Event Features:</h4>
                      <div className="space-y-2">
                        {socialEvents[activeEvent as keyof typeof socialEvents].features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#E86C32] mt-1 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-8">
                      <h4 className="font-semibold text-gray-900 mb-3">Menu Highlights:</h4>
                      <div className="flex flex-wrap gap-2">
                        {socialEvents[activeEvent as keyof typeof socialEvents].menuHighlights.map((item, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-[#F5E6D3] text-[#E86C32] text-sm rounded-full font-medium"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        className="flex-1 px-6 py-3 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105"
                        style={{
                          background: 'linear-gradient(135deg, #E86C32 0%, #D4B170 100%)',
                          border: 'none'
                        }}
                      >
                        Plan My Event
                      </Button>
                      <Button 
                        variant="outline"
                        className="px-6 py-3 rounded-full border-2 border-[#E86C32] text-[#E86C32] hover:bg-[#E86C32] hover:text-white transition-all duration-300"
                      >
                        View Packages
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className={`text-center mt-16 transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="bg-gradient-to-r from-[#E86C32] to-[#D4B170] text-white px-8 py-6 rounded-2xl inline-block shadow-xl">
              <h4 className="text-xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Maak Uw Event Onvergetelijk
              </h4>
              <p className="mb-4" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                Custom decoratie • Photography coordination • Entertainment recommendations
              </p>
              <Button 
                className="bg-white text-[#E86C32] hover:bg-gray-100 font-bold px-8 py-3 rounded-full transition-all duration-300"
              >
                Start Planning Today
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};