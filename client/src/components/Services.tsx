import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Building2, PartyPopper, Heart, Flame, UtensilsCrossed } from "lucide-react";

export const Services = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      setTimeout(() => setButtonsVisible(true), 500);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const services = [
    {
      id: "corporate",
      name: "Corporate Events",
      icon: <Building2 className="w-6 h-6" />,
      description: "Professionele zakelijke catering voor bedrijfsevenementen"
    },
    {
      id: "social",
      name: "Social Events",
      icon: <PartyPopper className="w-6 h-6" />,
      description: "Verjaardagen, jubilea en informele bijeenkomsten"
    },
    {
      id: "weddings",
      name: "Weddings",
      icon: <Heart className="w-6 h-6" />,
      description: "Droombruiloften met verfijnde culinaire ervaringen"
    },
    {
      id: "grill",
      name: "Grill & BBQ",
      icon: <Flame className="w-6 h-6" />,
      description: "Authentieke BBQ en grill specialiteiten"
    },
    {
      id: "bytray",
      name: "By The Tray",
      icon: <UtensilsCrossed className="w-6 h-6" />,
      description: "Convenient catering per schaal voor elke gelegenheid"
    }
  ];

  return (
    <section id="services" className="relative section-spacing bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 overflow-hidden">
      {/* Blue Wave Pattern Background */}
      <div className="absolute inset-0 opacity-30">
        <svg
          className="absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#1D4ED8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          
          {/* Flowing Wave Paths */}
          <path
            d="M0,200 Q300,100 600,200 T1200,200 L1200,0 L0,0 Z"
            fill="url(#waveGradient)"
            className="animate-pulse"
          />
          <path
            d="M0,400 Q400,300 800,400 T1200,400 L1200,200 L0,200 Z"
            fill="url(#waveGradient)"
            className="animate-pulse"
            style={{ animationDelay: '1s' }}
          />
          <path
            d="M0,600 Q200,500 400,600 T800,600 T1200,600 L1200,400 L0,400 Z"
            fill="url(#waveGradient)"
            className="animate-pulse"
            style={{ animationDelay: '2s' }}
          />
        </svg>
      </div>

      <div className="container-main relative z-10">
        {/* Header - Soprano's "Discover Our Services" Layout */}
        <div className={`text-center mb-20 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <p className="text-script mb-4 text-[#E86C32]">Ontdek</p>
          <h2 className="text-display text-foreground mb-6 font-bold">
            ONZE <span className="text-[#E86C32]">SERVICES</span>
          </h2>
          <div className="w-24 h-1 bg-[#E86C32] mx-auto mb-8 rounded-full" />
          <p className="text-body text-foreground max-w-3xl mx-auto text-lg leading-relaxed">
            Van intieme zakelijke bijeenkomsten tot grootse bruiloften, wij bieden professionele 
            catering services die elke gelegenheid tot een onvergetelijke culinaire ervaring maken.
          </p>
        </div>

        {/* Service Buttons - Soprano's Style */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16 transition-all duration-1000 delay-300 ${
          buttonsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`relative service-button ${buttonsVisible ? 'visible' : ''} group`}
              style={{ '--stagger-delay': index } as React.CSSProperties}
            >
              <Button
                variant="soprano-services"
                className="w-full h-auto py-6 px-4 flex flex-col items-center gap-3 hover:shadow-xl transition-all duration-300"
              >
                <div className="text-white group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <span className="text-white font-semibold text-sm text-center leading-tight">
                  {service.name}
                </span>
              </Button>
              
              {/* Service Description - appears on hover */}
              <div className="absolute inset-x-0 top-full mt-2 p-4 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-20 pointer-events-none">
                <p className="text-sm text-gray-700 text-center">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className={`text-center transition-all duration-1000 delay-700 ${
          buttonsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Button
            variant="soprano-cta"
            size="elegant-lg"
            className="font-bold tracking-wide"
          >
            Plan Uw Evenement
          </Button>
          <p className="text-body text-gray-600 mt-4 max-w-xl mx-auto">
            Neem contact met ons op voor een persoonlijk adviesgesprek en 
            ontdek hoe wij uw evenement tot een succes kunnen maken.
          </p>
        </div>
      </div>
    </section>
  );
};