import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star, Clock, Users, ChefHat } from "lucide-react";
import { JulienneFadeCarousel } from "./JulienneFadeCarousel";

// Import high-quality food images
import dish1 from "@assets/1000005907_1753439577476.jpg";
import dish2 from "@assets/1000005886_1753439577476.jpg";
import dish3 from "@assets/1000005737_1753439577482.jpg";
import dish4 from "@assets/1000005722_1753439577481.jpg";
import dish5 from "@assets/1000005705_1753439577479.jpg";
import dish6 from "@assets/1000005727_1753439577481.jpg";
import dish7 from "@assets/1000005723_1753439577480.jpg";
import dish8 from "@assets/1000005739_1753439577480.jpg";

export const CateringMenuCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Luxury catering menu items with authentic details
  const menuItems = [
    {
      id: 1,
      title: "Pistachio Matcha Banana Bread",
      subtitle: "Gourmet Breakfast Selection",
      image: dish1,
      prepTime: "40min",
      serves: "8-12",
      difficulty: "Easy",
      price: "€28",
      description: "Een prachtige fusie van romige bananen, aardse matcha en knapperige pistachenoten creëert dit levendige en gezonde bananenbrood.",
      ingredients: ["Verse bananen", "Matcha poeder", "Pistachenoten", "Biologische bloem"],
      tags: ["Vegan optie", "Glutenvrij beschikbaar", "Seizoensspecial"]
    },
    {
      id: 2,
      title: "Artisanale Charcuterie Plank",
      subtitle: "Premium Borrel Service",
      image: dish2,
      prepTime: "25min",
      serves: "12-16",
      difficulty: "Expert",
      price: "€65",
      description: "Uitgelezen selectie van artisanale vleeswaren, farmhouse kazen en huisgemaakte accompaniments voor de ultieme borrelerving.",
      ingredients: ["Iberico ham", "Oude kazen", "Huisgemaakte mosterd", "Artisanaal brood"],
      tags: ["Premium selectie", "Lokale leveranciers", "Seizoenskazen"]
    },
    {
      id: 3,
      title: "Bruiloft Signature Gerecht",
      subtitle: "Wedding Speciality",
      image: dish3,
      prepTime: "2.5hr",
      serves: "50+",
      difficulty: "Expert",
      price: "€85",
      description: "Onze signature bruiloft creatie - perfect voor uw speciale dag met premium ingrediënten en elegante presentatie.",
      ingredients: ["Premium vlees/vis", "Seizoensgroenten", "Signature saus", "Gourmet garnituur"],
      tags: ["Bruiloft special", "Premium service", "Fotografisch perfect"]
    },
    {
      id: 4,
      title: "BBQ Grill Specialiteiten",
      subtitle: "Outdoor Catering Experience",
      image: dish4,
      prepTime: "3hr",
      serves: "25-40",
      difficulty: "Expert",
      price: "€45",
      description: "Heerlijke BBQ catering met vers gegrilde specialiteiten, perfecte marinade en authentieke rooksmaken.",
      ingredients: ["Premium vlees", "Huisgemaakte rubs", "Verse kruiden", "Seizoensalade"],
      tags: ["Live cooking", "Outdoor service", "Interactief"]
    },
    {
      id: 5,
      title: "Gourmet Lunch Selectie",
      subtitle: "Corporate Catering Excellence",
      image: dish5,
      prepTime: "1.5hr",
      serves: "20-30",
      difficulty: "Medium",
      price: "€35",
      description: "Verfijnde lunch opties perfect voor zakelijke bijeenkomsten en corporate events met focus op kwaliteit en presentatie.",
      ingredients: ["Premium brood", "Verse vullingen", "Gourmet salades", "Artisanale dressings"],
      tags: ["Corporate friendly", "Dieet opties", "Premium kwaliteit"]
    },
    {
      id: 6,
      title: "Luxe Visspecialiteiten",
      subtitle: "Fresh Seafood Selection",
      image: dish6,
      prepTime: "2hr",
      serves: "15-20",
      difficulty: "Expert",
      price: "€75",
      description: "Dagverse vis en zeevruchten bereid met verfijnde technieken en geserveerd met seizoensgebonden accompaniments.",
      ingredients: ["Dagverse vis", "Premium zeevruchten", "Citrus", "Microgreens"],
      tags: ["Dagvers", "Premium kwaliteit", "Seizoensgebonden"]
    },
    {
      id: 7,
      title: "Family Style Feast",
      subtitle: "Gedeelde Tafel Ervaring",
      image: dish7,
      prepTime: "2.5hr",
      serves: "30-50",
      difficulty: "Expert",
      price: "€55",
      description: "Warme, gedeelde maaltijd ervaring perfect voor familie evenementen en intieme bijeenkomsten.",
      ingredients: ["Comfort classics", "Seizoensgroenten", "Huisgemaakte sauzen", "Warm brood"],
      tags: ["Family style", "Comfort food", "Gedeelde ervaring"]
    },
    {
      id: 8,
      title: "Dessert Masterpiece",
      subtitle: "Sweet Finale Experience",
      image: dish8,
      prepTime: "3hr",
      serves: "25-35",
      difficulty: "Expert",
      price: "€42",
      description: "Spectaculaire dessert creaties die uw evenement perfect afsluiten met visuele pracht en smaakintensiteit.",
      ingredients: ["Premium chocolade", "Verse vruchten", "Artisanale room", "Edible flowers"],
      tags: ["Visueel spectaculair", "Instagram worthy", "Artisanaal"]
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % menuItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + menuItems.length) % menuItems.length);
  };

  const currentItem = menuItems[currentSlide];

  return (
    <section 
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-[#F9F6F1] via-[#FEFCF8] to-[#F5E6D3] relative overflow-hidden"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #E86C32 2px, transparent 2px), radial-gradient(circle at 75% 75%, #D4AF37 2px, transparent 2px)`,
          backgroundSize: '80px 80px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <p className="text-script mb-6" style={{ 
            color: '#D4AF37', 
            fontSize: '2.5rem',
            fontFamily: 'Great Vibes, cursive'
          }}>
            Culinaire Kunst
          </p>
          <h2 className="text-4xl font-bold mb-8 text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            SIGNATURE MENU COLLECTIE
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#E86C32] to-[#D4B170] mx-auto mb-8"></div>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Ontdek onze zorgvuldig samengestelde collectie van signature gerechten, elk met liefde bereid en geperfectioneerd door onze ervaren chefs. Van intieme diners tot grote evenementen.
          </p>
        </div>

        {/* Carousel Container */}
        <div className={`max-w-6xl mx-auto transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
            
            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-0">
              
              {/* Image Section with Julienne Fade */}
              <div className="relative h-96 lg:h-auto overflow-hidden">
                {menuItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                      index === currentSlide
                        ? 'opacity-100 transform translate-y-0'
                        : 'opacity-0 transform translate-y-8'
                    }`}
                    style={{
                      backgroundImage: `url(${item.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Price Badge with fade animation */}
                <div className={`absolute top-6 right-6 bg-gradient-to-r from-[#E86C32] to-[#D4B170] text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg transition-all duration-1200 delay-300 ${
                  'opacity-100 transform translate-y-0'
                }`}>
                  {currentItem.price}
                </div>

                {/* Navigation Arrows */}
                <button 
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group"
                >
                  <ChevronLeft className="w-6 h-6 text-white group-hover:text-[#E86C32] transition-colors" />
                </button>
                
                <button 
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group"
                >
                  <ChevronRight className="w-6 h-6 text-white group-hover:text-[#E86C32] transition-colors" />
                </button>
              </div>

              {/* Content Section with Julienne Fade */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className={`transition-all duration-1200 delay-500 ${
                  'opacity-100 transform translate-y-0'
                }`}>
                
                {/* Category */}
                <div className="flex items-center gap-2 mb-4">
                  <ChefHat className="w-5 h-5 text-[#E86C32]" />
                  <span className="text-[#E86C32] font-semibold text-sm uppercase tracking-wide">
                    {currentItem.subtitle}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-3xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {currentItem.title}
                </h3>

                {/* Meta Info */}
                <div className="flex items-center gap-6 mb-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{currentItem.prepTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{currentItem.serves} personen</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-[#D4AF37] font-medium">{currentItem.difficulty}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed mb-6" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                  {currentItem.description}
                </p>

                {/* Ingredients */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Signature Ingrediënten:</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentItem.ingredients.map((ingredient, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-[#F5E6D3] text-[#E86C32] text-sm rounded-full font-medium"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-8">
                  <div className="flex flex-wrap gap-2">
                    {currentItem.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gradient-to-r from-[#E86C32] to-[#D4B170] text-white text-xs rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-4">
                  <Button 
                    className="flex-1 px-6 py-3 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #E86C32 0%, #D4B170 100%)',
                      border: 'none'
                    }}
                  >
                    Bestel Nu
                  </Button>
                  <Button 
                    variant="outline"
                    className="px-6 py-3 rounded-full border-2 border-[#E86C32] text-[#E86C32] hover:bg-[#E86C32] hover:text-white transition-all duration-300"
                  >
                    Meer Info
                  </Button>
                </div>
                </div>
              </div>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
              {menuItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-[#E86C32] scale-125' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-600 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Button 
            className="px-12 py-4 bg-gradient-to-r from-[#E86C32] to-[#D4B170] text-white font-bold rounded-full text-lg hover:scale-105 transition-all duration-300 shadow-xl"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            Bekijk Volledige Menu Collectie
          </Button>
        </div>
      </div>
    </section>
  );
};