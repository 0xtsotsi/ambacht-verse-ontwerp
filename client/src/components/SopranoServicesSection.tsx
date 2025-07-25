import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Building2, PartyPopper, Heart, Flame, UtensilsCrossed, Sparkles } from "lucide-react";
import corporateImage from "@assets/1000005907_1753439577476.jpg";
import socialImage from "@assets/1000005886_1753439577476.jpg";
import weddingsImage from "@assets/1000005737_1753439577482.jpg";
import grillImage from "@assets/1000005722_1753439577481.jpg";
import trayImage from "@assets/1000005705_1753439577479.jpg";

export const SopranoServicesSection = () => {
  const [visibleSections, setVisibleSections] = useState<string[]>([]);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section-id');
            if (sectionId && !visibleSections.includes(sectionId)) {
              setVisibleSections(prev => [...prev, sectionId]);
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [visibleSections]);

  const services = [
    {
      id: "corporate",
      title: "Corporate Events",
      image: corporateImage,
      icon: Building2,
      description: "Professional catering voor zakelijke bijeenkomsten"
    },
    {
      id: "social",
      title: "Social Events", 
      image: socialImage,
      icon: PartyPopper,
      description: "Perfecte catering voor sociale evenementen"
    },
    {
      id: "weddings",
      title: "Weddings",
      image: weddingsImage,
      icon: Heart,
      description: "Onvergetelijke catering voor uw speciale dag"
    },
    {
      id: "grill",
      title: "Grill & BBQ",
      image: grillImage,
      icon: Flame,
      description: "Heerlijke BBQ catering voor elke gelegenheid"
    },
    {
      id: "tray",
      title: "By The Tray",
      image: trayImage,
      icon: UtensilsCrossed,
      description: "Flexibele catering oplossingen per schaal"
    }
  ];

  return (
    <section className="py-20 bg-[#F9F6F1]" data-section="services" id="services">
      {/* Banner Section - Exact Soprano's Copy */}
      <div 
        className="w-full py-16 mb-20"
        style={{
          background: 'linear-gradient(135deg, #5B7DA3 0%, #7A9BC4 50%, #5B7DA3 100%)',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M0 40c0-22.09 17.91-40 40-40s40 17.91 40 40-17.91 40-40 40S0 62.09 0 40zm10 0c0 16.569 13.431 30 30 30s30-13.431 30-30-13.431-30-30-30S10 23.431 10 40zm10 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-white mb-8" style={{
            fontSize: '2.75rem',
            fontWeight: '800',
            fontFamily: 'Open Sans, sans-serif',
            textShadow: '2px 2px 6px rgba(0,0,0,0.4)',
            letterSpacing: '0.15em',
            lineHeight: '1.2'
          }}>
            LENTE SPECIALS MENU
          </h2>
          <Button 
            className="px-8 py-3 rounded-full text-white font-semibold text-base transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #E86C32 0%, #FF6B35 100%)',
              border: 'none',
              fontFamily: 'Open Sans, sans-serif',
              letterSpacing: '0.05em'
            }}
          >
            Lente Specials
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Discover Section - First reveal from sides to center */}
        <div 
          ref={el => sectionRefs.current['discover'] = el}
          data-section-id="discover"
          className="text-center mb-16"
        >
          <div className={`transition-all duration-1000 ${
            visibleSections.includes('discover') 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 -translate-x-16'
          }`}>
            <p className="text-script mb-6" style={{ 
              color: '#D4AF37', 
              fontSize: '2.5rem',
              fontFamily: 'Great Vibes, cursive'
            }}>
              Ontdek
            </p>
          </div>
          
          <div className={`transition-all duration-1000 delay-300 ${
            visibleSections.includes('discover') 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 translate-x-16'
          }`}>
            <h2 className="text-4xl font-bold mb-8 text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              ONZE SERVICES
            </h2>
          </div>

          <div className={`transition-all duration-1000 delay-600 ${
            visibleSections.includes('discover') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}>
            <div className="w-20 h-1 bg-gradient-to-r from-[#E86C32] to-[#D4B170] mx-auto mb-8"></div>
            <p className="max-w-4xl mx-auto text-lg text-gray-600 leading-relaxed" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              We behandelen alle gelegenheden, groot en klein, ongeacht wat uw catering behoeften zijn, bel ons om te zien of uw datum beschikbaar is. Wesley's Ambacht biedt een breed scala aan ophaal- en bezorgselecties voor uw volgende gecaterde evenement, waaronder: ontbijt, lunch en doos lunches, voorgerechten, BBQ en diner opties evenals volledige service catering voor grote zakelijke evenementen en bruiloften.
            </p>
          </div>
        </div>

        {/* Service Buttons - Second reveal from center outward */}
        <div 
          ref={el => sectionRefs.current['buttons'] = el}
          data-section-id="buttons"
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-20"
        >
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`transition-all duration-1000 ${
                visibleSections.includes('buttons')
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-12 scale-95'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <Button
                className="w-full h-16 rounded-full text-white font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden group"
                style={{
                  background: 'linear-gradient(135deg, #E86C32 0%, #D4B170 100%)',
                  border: 'none',
                  fontFamily: 'Open Sans, sans-serif'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <service.icon className="w-5 h-5 mr-2" />
                {service.title}
              </Button>
            </div>
          ))}
        </div>

        {/* First Image Block - Third reveal from bottom */}
        <div 
          ref={el => sectionRefs.current['block1'] = el}
          data-section-id="block1"
          className="grid md:grid-cols-2 gap-12 items-center mb-20"
        >
          <div className={`transition-all duration-1000 ${
            visibleSections.includes('block1') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-16'
          }`}>
            <div className="relative overflow-hidden rounded-lg shadow-2xl group">
              <img 
                src={corporateImage} 
                alt="Corporate Events"
                className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#E86C32]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-6 left-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Building2 className="w-8 h-8 mb-2" />
                <h4 className="text-xl font-bold">Corporate Events</h4>
              </div>
            </div>
          </div>

          <div className={`transition-all duration-1000 delay-300 ${
            visibleSections.includes('block1') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-16'
          }`}>
            <p className="text-script mb-4" style={{ color: '#D4AF37', fontSize: '2rem', fontFamily: 'Great Vibes, cursive' }}>
              Professioneel
            </p>
            <h3 className="text-3xl font-bold mb-6 text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              CORPORATE EVENTS
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              Van vergaderingen tot grote bedrijfsevenementen, wij zorgen voor professionele catering die indruk maakt op uw gasten en collega's.
            </p>
            <Button 
              className="px-8 py-3 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #E86C32 0%, #D4B170 100%)',
                border: 'none'
              }}
            >
              Meer Informatie
            </Button>
          </div>
        </div>

        {/* Second Image Block - Fourth reveal from sides */}
        <div 
          ref={el => sectionRefs.current['block2'] = el}
          data-section-id="block2"
          className="grid md:grid-cols-2 gap-12 items-center mb-20"
        >
          <div className={`md:order-2 transition-all duration-1000 ${
            visibleSections.includes('block2') 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 translate-x-16'
          }`}>
            <div className="relative overflow-hidden rounded-lg shadow-2xl group">
              <img 
                src={weddingsImage} 
                alt="Weddings"
                className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-[#E86C32]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute bottom-6 right-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-right">
                <Heart className="w-8 h-8 mb-2 ml-auto" />
                <h4 className="text-xl font-bold">Bruiloften</h4>
              </div>
            </div>
          </div>

          <div className={`md:order-1 transition-all duration-1000 delay-300 ${
            visibleSections.includes('block2') 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 -translate-x-16'
          }`}>
            <p className="text-script mb-4" style={{ color: '#D4AF37', fontSize: '2rem', fontFamily: 'Great Vibes, cursive' }}>
              Uw Speciale Dag
            </p>
            <h3 className="text-3xl font-bold mb-6 text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              BRUILOFT CATERING
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              Maak uw trouwdag onvergetelijk met onze elegante catering services. Van intieme bijeenkomsten tot grote feesten.
            </p>
            <Button 
              className="px-8 py-3 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #E86C32 0%, #D4B170 100%)',
                border: 'none'
              }}
            >
              Bekijk Pakketten
            </Button>
          </div>
        </div>

        {/* Final CTA Section - Fifth reveal from bottom */}
        <div 
          ref={el => sectionRefs.current['cta'] = el}
          data-section-id="cta"
          className={`text-center transition-all duration-1000 ${
            visibleSections.includes('cta') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-16'
          }`}
        >
          <div className="bg-gradient-to-r from-[#E86C32] to-[#D4B170] rounded-2xl p-12 text-white">
            <Sparkles className="w-12 h-12 mx-auto mb-6" />
            <h3 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Klaar om te beginnen?
            </h3>
            <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              Laat ons uw volgende evenement onvergetelijk maken met onze professionele catering services.
            </p>
            <Button 
              className="px-12 py-4 bg-white text-[#E86C32] font-bold rounded-full text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
            >
              Contact Ons Nu
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};