import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Building2, PartyPopper, Heart, Flame, UtensilsCrossed, Sparkles, ChevronDown } from "lucide-react";

export const ServiceSection = () => {
  const [activeService, setActiveService] = useState("corporate");
  const [isVisible, setIsVisible] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const discoverRef = useRef<HTMLDivElement>(null);

  const scrollToDiscover = () => {
    if (discoverRef.current) {
      discoverRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      // Trigger the reveal animation immediately after scroll
      setTimeout(() => {
        setIsVisible(true);
        setTimeout(() => setButtonsVisible(true), 500);
      }, 800);
    }
  };

  const services = [
    { id: "corporate", name: "Corporate Events", icon: <Building2 className="w-6 h-6" />, gradient: "from-blue-500 to-cyan-500" },
    { id: "social", name: "Social Events", icon: <PartyPopper className="w-6 h-6" />, gradient: "from-purple-500 to-pink-500" },
    { id: "weddings", name: "Bruiloften", icon: <Heart className="w-6 h-6" />, gradient: "from-rose-500 to-pink-500" },
    { id: "grill", name: "BBQ Catering", icon: <Flame className="w-6 h-6" />, gradient: "from-orange-500 to-red-500" },
    { id: "bytray", name: "Lunch Service", icon: <UtensilsCrossed className="w-6 h-6" />, gradient: "from-green-500 to-emerald-500" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === sectionRef.current && entry.isIntersecting) {
            setIsVisible(true);
          }
          if (entry.target === buttonsRef.current && entry.isIntersecting) {
            setTimeout(() => setButtonsVisible(true), 300);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    if (buttonsRef.current) observer.observe(buttonsRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="section-spacing relative overflow-hidden" style={{ backgroundColor: '#F9F6F1' }}>
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #E86C32 2px, transparent 2px), radial-gradient(circle at 75% 75%, #D4AF37 2px, transparent 2px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="container-main text-center relative">
        {/* Header Banner - Exact Soprano's Copy */}
        <div className="relative mb-20 overflow-hidden shadow-2xl">
          <div 
            className="py-16 px-8 relative"
            style={{
              background: 'linear-gradient(135deg, #5B7DA3 0%, #7A9BC4 50%, #5B7DA3 100%)',
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M0 40c0-22.09 17.91-40 40-40s40 17.91 40 40-17.91 40-40 40S0 62.09 0 40zm10 0c0 16.569 13.431 30 30 30s30-13.431 30-30-13.431-30-30-30S10 23.431 10 40zm10 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              minHeight: '200px'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/15" />
            <div className="relative z-10 text-center">
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
        </div>

        {/* Discover Section with luxury reveal */}
        <div className={`mb-16 fade-in-up ${isVisible ? 'visible' : ''}`} ref={discoverRef}>
          <p className={`text-script mb-6 luxury-underline ${isVisible ? 'visible' : ''}`} style={{ 
            color: '#D4AF37', 
            fontSize: '3rem',
            fontFamily: 'Great Vibes, cursive'
          }}>
            Ontdek
          </p>
          
          <h2 className="text-foreground mb-8" style={{
            fontSize: '3.5rem',
            fontWeight: '700',
            fontFamily: 'Playfair Display, serif',
            letterSpacing: '0.02em',
            lineHeight: '1.2'
          }}>
            ONZE SERVICES
          </h2>
          
          <div className={`w-24 h-1 mx-auto mb-12 rounded-full transition-all duration-1000 ${isVisible ? 'w-24' : 'w-0'}`} 
               style={{ background: 'linear-gradient(90deg, #E86C32, #D4AF37, #E86C32)' }} />
          
          <p className="max-w-4xl mx-auto text-gray-600 leading-relaxed mb-16" style={{
            fontSize: '1.125rem',
            fontFamily: 'Open Sans, sans-serif',
            lineHeight: '1.8'
          }}>
            Wij verzorgen alle gelegenheden, groot en klein. Ongeacht uw cateringbehoeften, bel ons om te zien of uw datum beschikbaar is. Wesley's Ambacht biedt een breed scala aan ophaal- en bezorgopties voor uw volgende catered evenement, inclusief: ontbijt, lunch en lunchpakketten, hapjes, BBQ en dineropties evenals volledige service catering voor grote bedrijfsevenementen en bruiloften.
          </p>

          {/* Service Buttons with staggered luxury animation */}
          <div 
            ref={buttonsRef}
            className="flex flex-wrap justify-center gap-6 stagger-children"
          >
            {services.map((service, index) => (
              <Button
                key={service.id}
                className={`service-button ${buttonsVisible ? 'visible' : ''} px-10 py-6 rounded-2xl font-semibold transition-all duration-700 flex items-center space-x-4 group relative overflow-hidden shadow-lg hover:shadow-2xl ${
                  activeService === service.id
                    ? 'text-white shadow-2xl scale-105'
                    : 'bg-white text-gray-700 hover:text-white border border-gray-200 hover:border-transparent'
                }`}
                style={{
                  ...(index !== undefined && { '--stagger-delay': index.toString() } as React.CSSProperties),
                  background: activeService === service.id 
                    ? 'linear-gradient(135deg, #E86C32 0%, #FF6B35 100%)' 
                    : undefined,
                  fontFamily: 'Open Sans, sans-serif',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
                onClick={() => setActiveService(service.id)}
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#E86C32] to-[#FF6B35] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
                
                <span className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </span>
                <span className="relative z-10 group-hover:tracking-wider transition-all duration-300">
                  {service.name}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};