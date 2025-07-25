import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Building2, PartyPopper, Heart, Flame, UtensilsCrossed, Sparkles } from "lucide-react";

export const ServiceSection = () => {
  const [activeService, setActiveService] = useState("corporate");
  const [isVisible, setIsVisible] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

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
        {/* Header Banner - Spring Specials */}
        <div className="relative mb-20 overflow-hidden rounded-3xl shadow-2xl">
          <div 
            className="py-20 px-8 relative"
            style={{
              background: 'linear-gradient(135deg, #4A5D78 0%, #6B7FA1 50%, #4A5D78 100%)',
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 0c16.569 0 30 13.431 30 30 0 16.569-13.431 30-30 30C13.431 60 0 46.569 0 30 0 13.431 13.431 0 30 0zm0 6C16.745 6 6 16.745 6 30s10.745 24 24 24 24-10.745 24-24S43.255 6 30 6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
            <div className="relative z-10">
              <h2 className="text-white mb-8" style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                fontFamily: 'Playfair Display, serif',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                letterSpacing: '0.05em'
              }}>
                LENTE SPECIALS MENU
              </h2>
              <Button 
                className="px-10 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, #E86C32 0%, #FF6B35 100%)',
                  border: 'none',
                  fontFamily: 'Open Sans, sans-serif'
                }}
              >
                Lente Specials
              </Button>
            </div>
          </div>
        </div>

        {/* Discover Section with luxury reveal */}
        <div className={`mb-16 fade-in-up ${isVisible ? 'visible' : ''}`} ref={sectionRef}>
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