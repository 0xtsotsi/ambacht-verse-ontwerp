import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Heart, Users, Utensils, Calendar, Star, CheckCircle } from "lucide-react";
import weddingHeroImage from "@assets/1000005886_1753439577476.jpg";
import buffetImage from "@assets/1000005907_1753439577476.jpg";
import familyImage from "@assets/1000005737_1753439577482.jpg";

export const WeddingPage = () => {
  const [activePackage, setActivePackage] = useState("buffet");
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

  const packages = {
    buffet: {
      title: "Share Together",
      subtitle: "BUFFET STYLE",
      price: "€46",
      image: buffetImage,
      description: "Inclusief artisanale charcuterieplank en verse fruitschaal bij aankomst, huisgemaakte balsamico vinaigrette en ranch dressing",
      details: "Uitbreiding mogelijk met premium kazen, truffel mac & cheese, en seizoensspecialiteiten uit onze enhancement collectie",
      menu: {
        voorgerechten: ["Caviar-topped Deviled Eggs", "Iberico Ham Crostini", "Prosciutto-wrapped Figs", "Artisanale Charcuterie", "Oyster Station"],
        hoofdgerechten: ["Rack of Lamb met kruiden", "Plantain-crusted Yellowtail", "Prime NY Strip Steak", "Lobster Mac & Cheese", "Duck Confit"],
        bijgerechten: ["Truffle Roasted Potatoes", "Wild Mushroom Risotto", "Roasted Brussels Sprouts", "Seasonal Vegetables", "Wild Rice Pilaf"],
        desserts: ["Chocolate Lava Cake", "Tiramisu Trifle", "Flambéed Bananas Foster", "Artisanal Gelato Bar"]
      }
    },
    family: {
      title: "Share at the Table",
      subtitle: "FAMILY STYLE", 
      price: "€49",
      image: familyImage,
      description: "Warmhartige gedeelde maaltijd ervaring met premium ingrediënten, perfect voor intieme bruiloften en familiebijeenkomsten",
      details: "Grote communale schalen die interactie bevorderen, inclusief tableside service en premium presentatie",
      menu: {
        voorgerechten: ["Korean Corn Dogs", "Gourmet Ramen Station", "Build-Your-Own Caviar Service", "Mini Taco Assembly", "Premium Popcorn Bar"],
        hoofdgerechten: ["Tomahawk Steak Carving", "Giant Parmesan Wheel Pasta", "Champagne Chicken", "Chicken Florentine", "Wild Mushroom Risotto"],
        bijgerechten: ["Family-Style Comfort Classics", "Roasted Rosemary Potatoes", "Seasonal Vegetable Medley", "Artisanal Bread Service"],
        desserts: ["S'mores Station", "Chocolate-covered Strawberries", "Wedding Cake Service", "Late-night Truffle Fries"]
      }
    },
    plated: {
      title: "Individual Service",
      subtitle: "PLATED ELEGANCE",
      price: "€52",
      image: buffetImage,
      description: "Sophisticated 3-5 course plated dinner met fotografisch perfecte presentatie en premium service",
      details: "Multi-course ervaring met wine pairings, sommelier service en personalized menu cards voor elke gast",
      menu: {
        voorgerechten: ["Coffin Bay King Oysters", "Pecorino & Truffle Honey Crostini", "Shrimp & Lobster Cocktail", "Korean-fusion Amuse Bouche"],
        hoofdgerechten: ["Earl Grey-infused Proteins", "Mediterranean-Asian Fusion", "Premium Seafood Selection", "Vegetarian Luxury Options"],
        bijgerechten: ["Porcini Roasted Potatoes", "Roasted Sweet & White Potatoes", "Seasonal Microgreens", "Edible Art Displays"],
        desserts: ["Hand-painted Macarons", "Earl Grey Wedding Cake", "Adaptogenic Mocktails", "Premium Chocolate Truffles"]
      }
    }
  };

  const scrollToPackages = () => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with parallax background */}
      <section 
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${weddingHeroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        
        <div className={`relative z-10 text-center text-white px-4 transition-all duration-1000 ${
          heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h1 className="text-white mb-8" style={{ 
            fontSize: '5rem', 
            fontWeight: '900', 
            lineHeight: '1.1',
            fontFamily: 'Playfair Display, serif',
            textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
            letterSpacing: '0.02em'
          }}>
            BRUILOFTEN
          </h1>
        </div>

        {/* Scroll Arrow - Elegant Round Cutout */}
        <div 
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer group"
          onClick={scrollToPackages}
        >
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 shadow-lg group-hover:scale-110">
            <ChevronDown className="w-6 h-6 text-white group-hover:text-[#E86C32] transition-colors duration-300" />
          </div>
        </div>
      </section>

      {/* Wedding Content Section */}
      <section className="py-20 bg-[#F9F6F1]" ref={sectionRef}>
        <div className="container mx-auto px-4">
          {/* Wedding Description */}
          <div className={`max-w-4xl mx-auto text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <p className="text-script mb-6" style={{ color: '#D4AF37', fontSize: '2.5rem' }}>
              Your Special Day
            </p>
            <h2 className="text-4xl font-bold mb-8 text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              BRUILOFTEN CATERING
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              We zijn zo blij dat je overweegt ons in te huren voor jouw bruiloft. Onze chefs begrijpen het belang van jouw trouwdag en zullen nauw met je samenwerken om ervoor te zorgen dat elk detail wordt overwogen en elke verwachting wordt overtroffen. Van intieme achtertuin BBQ's tot extravagante zwarte das aangelegenheden, we zijn er om je te dienen op jouw speciale dag!
            </p>
            <div className="bg-gradient-to-r from-[#E86C32] to-[#D4B170] text-white px-6 py-3 rounded-full inline-block">
              <p className="font-semibold">50 personen minimum voor alle bruiloftspakketten</p>
            </div>
          </div>

          {/* Wedding Packages Menu */}
          <div className={`max-w-6xl mx-auto transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="text-center mb-12">
              <p className="text-script mb-4" style={{ color: '#D4AF37', fontSize: '2rem' }}>
                Menu
              </p>
              <h3 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                BRUILOFT PAKKETTEN
              </h3>
              <div className="w-20 h-1 bg-gradient-to-r from-[#E86C32] to-[#D4B170] mx-auto mt-4 mb-8"></div>
              <p className="text-gray-600 mb-8">
                ALLE PAKKETTEN BEVATTEN:
              </p>
              <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Charcuterieplank en vers fruit bij aankomst. Opstelling en afbraak, bruiloftschina, zilverwerk, linnen servetten, 
                geüniformeerde servers, bediening van eten en drankjes (tot 5 uur service), linnen voor food display tafels en 
                taart snijservice.
              </p>
              <Button 
                className="mt-8 px-8 py-3 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #E86C32 0%, #D4B170 100%)',
                  border: 'none'
                }}
              >
                Print Bruiloften Menu
              </Button>
            </div>

            {/* Service Style Selection */}
            <div className="bg-black text-white py-6 mb-12">
              <h4 className="text-center text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                KIES UW SERVICE STIJL
              </h4>
            </div>

            {/* Package Cards */}
            <div className="grid md:grid-cols-3 gap-8">
              {Object.entries(packages).map(([key, pkg]) => (
                <div 
                  key={key}
                  className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                    activePackage === key ? 'ring-2 ring-[#E86C32]' : ''
                  }`}
                  onClick={() => setActivePackage(key)}
                >
                  <div className="p-6 text-center">
                    <h5 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {pkg.subtitle}
                    </h5>
                    <p className="text-3xl font-bold text-[#E86C32] mb-4">{pkg.price}/persoon</p>
                    <p className="text-gray-600 mb-4">{pkg.description}</p>
                    <p className="text-sm text-gray-500">{pkg.details}</p>
                    <p className="text-sm text-gray-500 mt-2">Add Additional Entree +€5/persoon</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Active Package Details */}
            {activePackage && (
              <div className="mt-16 bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="relative h-64 md:h-auto">
                    <img 
                      src={packages[activePackage as keyof typeof packages].image} 
                      alt={packages[activePackage as keyof typeof packages].subtitle}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#E86C32]/80 to-transparent" />
                    <div className="absolute top-6 left-6 text-white">
                      <p className="text-script text-2xl" style={{ color: '#D4AF37' }}>
                        {packages[activePackage as keyof typeof packages].title}
                      </p>
                      <h6 className="text-3xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {packages[activePackage as keyof typeof packages].subtitle}
                      </h6>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <h6 className="text-2xl font-bold mb-6 text-center" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {packages[activePackage as keyof typeof packages].subtitle} - {packages[activePackage as keyof typeof packages].price} / PERSOON
                    </h6>
                    
                    {/* Package Description */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-4">PACKAGE INCLUSIEF:</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p>• Artisanale charcuterieplank en verse fruitschaal bij aankomst</p>
                          <p>• Premium ingrediënten en seizoensspecialiteiten</p>
                          <p>• Volledige opstelling en afbraak service</p>
                          <p>• Bruiloft china, zilverwerk, en linnen servetten</p>
                          <p>• Geüniformeerde servers (tot 5 uur service)</p>
                          <p>• Linnen voor food display tafels</p>
                          <p>• Professionele taart snijservice</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-gray-900 mb-4">LUXURY MENU SELECTIES:</h4>
                        <div className="grid grid-cols-1 gap-3 text-sm text-gray-600">
                          <div>
                            <span className="font-semibold text-[#E86C32]">Premium Voorgerechten:</span>
                            <span className="ml-2">Caviar service, Iberico ham, artisanale charcuterie</span>
                          </div>
                          <div>
                            <span className="font-semibold text-[#E86C32]">Signature Hoofdgerechten:</span>
                            <span className="ml-2">Rack of lamb, prime steak, lobster specialiteiten</span>
                          </div>
                          <div>
                            <span className="font-semibold text-[#E86C32]">Gourmet Bijgerechten:</span>
                            <span className="ml-2">Truffle potatoes, wild mushroom risotto, seasonal vegetables</span>
                          </div>
                          <div>
                            <span className="font-semibold text-[#E86C32]">Artisanale Desserts:</span>
                            <span className="ml-2">Chocolate lava cake, flambéed specialiteiten, gelato bar</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};