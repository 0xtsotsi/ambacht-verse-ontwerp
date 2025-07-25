import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Flame, Sun, Users, CheckCircle2, Thermometer, Clock, TreePine, ChefHat } from "lucide-react";
import { FloatingBookingWidget } from "@/components/FloatingBookingWidget";
import { Navigation } from "@/components/Navigation";
import bbqHeroImage from "@assets/1000005871_1753439577475.jpg";
import grillImage from "@assets/1000005880_1753439577477.jpg";
import outdoorImage from "@assets/1000005886_1753439577476.jpg";
import smokingImage from "@assets/1000005916_1753439577477.jpg";

export const BBQPage = () => {
  const [activeStyle, setActiveStyle] = useState("classic");
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

  const bbqStyles = {
    classic: {
      title: "Classic American BBQ",
      subtitle: "TRADITIONAL GRILL",
      price: "€32",
      image: grillImage,
      description: "Authentieke American-style BBQ met slow-smoked vlees, traditional rubs en signature sauzen voor de ultieme outdoor dining experience",
      features: [
        "Live grilling en smoking op locatie",
        "Premium meat cuts: brisket, ribs, pulled pork",
        "Huisgemaakte rubs en marinades",
        "Traditional BBQ sides en salades",
        "Complete outdoor setup met grills",
        "Professional pit master service"
      ],
      menuHighlights: [
        "12-hour smoked brisket",
        "Baby back ribs met signature glaze",
        "Pulled pork sliders",
        "Grilled corn on the cob",
        "Mac & cheese en coleslaw"
      ]
    },
    dutch: {
      title: "Dutch BBQ Experience",
      subtitle: "HOLLANDSE GRILL",
      price: "€28",
      image: outdoorImage,
      description: "Nederlandse BBQ traditie met lokale specialiteiten, verse ingrediënten en gezellige outdoor dining voor een authentieke Hollandse ervaring",
      features: [
        "Lokale vlees specialiteiten en worst",
        "Verse seizoensgroenten van Nederlandse boeren",
        "Gezellige outdoor setup met Nederlandse sfeer",
        "Traditional Dutch BBQ accompaniments",
        "Local beer en jenever pairing suggestions",
        "Family-style serving voor sharing"
      ],
      menuHighlights: [
        "Nederlandse worst specialiteiten",
        "Gegrilde zalm en andere verse vis",
        "Boeren aardappel salades",
        "Verse groenten van seizoen",
        "Traditional Dutch desserts"
      ]
    },
    premium: {
      title: "Premium Grill Experience",
      subtitle: "LUXURY OUTDOOR",
      price: "€45",
      image: smokingImage,
      description: "Luxe BBQ ervaring met premium cuts, gourmet marinades en sophisticated outdoor dining setup voor exclusieve events",
      features: [
        "Wagyu beef en premium seafood options",
        "Gourmet marinades en artisanal rubs",
        "White-glove outdoor service staff",
        "Elegant outdoor table settings",
        "Wine pairing suggestions met BBQ menu",
        "Custom menu development voor dietary needs"
      ],
      menuHighlights: [
        "Wagyu steaks en premium lamb",
        "Grilled lobster tails",
        "Truffle-infused vegetables",
        "Artisanal bread en gourmet sides",
        "Premium dessert station"
      ]
    }
  };

  const scrollToStyles = () => {
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
          backgroundImage: `url(${bbqHeroImage})`,
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
            <Flame className="w-8 h-8 text-[#D4AF37]" />
            <p className="text-script text-2xl" style={{ color: '#D4AF37', fontFamily: 'Great Vibes, cursive' }}>
              Fire & Flavor
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
            BBQ CATERING
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Van traditionele American BBQ tot Nederlandse grill specialiteiten - wij brengen de ultieme 
            outdoor dining experience naar uw locatie.
          </p>
        </div>

        {/* Scroll Arrow */}
        <div 
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer group"
          onClick={scrollToStyles}
        >
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 shadow-lg group-hover:scale-110">
            <ChevronDown className="w-6 h-6 text-white group-hover:text-[#E86C32] transition-colors duration-300" />
          </div>
        </div>
      </section>

      {/* BBQ Styles Section */}
      <section className="py-20 bg-[#F9F6F1]" ref={sectionRef}>
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className={`max-w-4xl mx-auto text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <ChefHat className="w-6 h-6 text-[#E86C32]" />
              <p className="text-script text-2xl" style={{ color: '#D4AF37', fontFamily: 'Great Vibes, cursive' }}>
                Outdoor Excellence
              </p>
            </div>
            <h2 className="text-4xl font-bold mb-8 text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              BBQ CATERING SPECIALITEITEN
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#E86C32] to-[#D4B170] mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 leading-relaxed" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              Onze BBQ catering brengt de warmte van een echte grill naar uw event. Live cooking, 
              premium ingrediënten en authentieke smaken voor een onvergetelijke outdoor dining ervaring.
            </p>
          </div>

          {/* BBQ Benefits */}
          <div className={`grid md:grid-cols-3 gap-8 mb-16 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <Sun className="w-12 h-12 text-[#E86C32] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                Outdoor Experience
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                Complete outdoor setup met professional equipment voor een authentieke BBQ ervaring.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <Thermometer className="w-12 h-12 text-[#E86C32] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                Live Cooking
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                Professional pit masters die live grillen en roken voor de beste smaken en entertainment.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <TreePine className="w-12 h-12 text-[#E86C32] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                Natuurlijke Smaken
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                Authentiek roken en grillen met natuurlijke houtsoorten voor ongeëvenaarde smaakintensiteit.
              </p>
            </div>
          </div>

          {/* Style Selection */}
          <div className={`transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
                KIES UW BBQ STIJL
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {Object.entries(bbqStyles).map(([key, style]) => (
                  <button
                    key={key}
                    onClick={() => setActiveStyle(key)}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
                      activeStyle === key
                        ? 'text-white'
                        : 'bg-white text-[#E86C32] border-2 border-[#E86C32] hover:bg-[#E86C32] hover:text-white'
                    }`}
                    style={{
                      background: activeStyle === key ? 'linear-gradient(135deg, #E86C32 0%, #D4B170 100%)' : '',
                      border: activeStyle === key ? 'none' : ''
                    }}
                  >
                    {style.subtitle}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Style Details */}
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="grid lg:grid-cols-2 gap-0">
                  {/* Image */}
                  <div className="relative h-96 lg:h-auto overflow-hidden">
                    <img 
                      src={bbqStyles[activeStyle as keyof typeof bbqStyles].image}
                      alt={bbqStyles[activeStyle as keyof typeof bbqStyles].subtitle}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-6 right-6 bg-gradient-to-r from-[#E86C32] to-[#D4B170] text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                      {bbqStyles[activeStyle as keyof typeof bbqStyles].price}/persoon
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <Flame className="w-6 h-6 text-[#E86C32]" />
                      <span className="text-[#E86C32] font-semibold text-sm uppercase tracking-wide">
                        {bbqStyles[activeStyle as keyof typeof bbqStyles].subtitle}
                      </span>
                    </div>

                    <h3 className="text-3xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {bbqStyles[activeStyle as keyof typeof bbqStyles].title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed mb-6" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                      {bbqStyles[activeStyle as keyof typeof bbqStyles].description}
                    </p>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">BBQ Features:</h4>
                      <div className="space-y-2">
                        {bbqStyles[activeStyle as keyof typeof bbqStyles].features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#E86C32] mt-1 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-8">
                      <h4 className="font-semibold text-gray-900 mb-3">Signature Dishes:</h4>
                      <div className="flex flex-wrap gap-2">
                        {bbqStyles[activeStyle as keyof typeof bbqStyles].menuHighlights.map((item, index) => (
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
                        Book BBQ Event
                      </Button>
                      <Button 
                        variant="outline"
                        className="px-6 py-3 rounded-full border-2 border-[#E86C32] text-[#E86C32] hover:bg-[#E86C32] hover:text-white transition-all duration-300"
                      >
                        BBQ Menu
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Weather & Season Info */}
          <div className={`mt-16 transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="bg-gradient-to-r from-[#E86C32] to-[#D4B170] text-white px-8 py-6 rounded-2xl text-center">
              <h4 className="text-xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Seizoen & Weer Flexibiliteit
              </h4>
              <p className="mb-4" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                Complete weather backup plans • Indoor BBQ alternatives • Year-round availability
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  className="bg-white text-[#E86C32] hover:bg-gray-100 font-bold px-6 py-2 rounded-full transition-all duration-300"
                >
                  Weather Protection Plan
                </Button>
                <Button 
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-[#E86C32] px-6 py-2 rounded-full transition-all duration-300"
                >
                  Indoor BBQ Options
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};