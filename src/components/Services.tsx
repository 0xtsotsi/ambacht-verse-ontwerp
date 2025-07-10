
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, memo, useMemo, useCallback } from "react";
import { usePerformanceLogger } from "@/hooks/useComponentLogger";
import { InteractiveMenuSystemWithBoundary } from "./InteractiveMenuSystem";

export const Services = memo(() => {
  const [activeCategory, setActiveCategory] = useState("soepen");
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showInteractiveMenu, setShowInteractiveMenu] = useState(false);
  
  // Performance monitoring
  const { getPerformanceStats } = usePerformanceLogger({
    componentName: 'Services',
    slowRenderThreshold: 16,
    enableMemoryTracking: true
  });

  useEffect(() => {
    setIsVisible(true);
    
    // Preload the background image
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = 'https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=2074';
  }, []);

  // Memoize categories to prevent unnecessary re-renders
  const categories = useMemo(() => [
    { id: "soepen", name: "BBQ", color: "bg-burnt-orange", icon: "🔥" },
    { id: "hapjes", name: "Kantoor Catering", color: "bg-forest-green", icon: "🏢" },
    { id: "buffets", name: "Evenement Buffets", color: "bg-deep-teal", icon: "🎉" },
  ], []);

  // Memoize menu items to prevent unnecessary re-renders
  const menuItems = useMemo(() => ({
    soepen: [
      {
        title: "Tomaten Basilicum",
        description: "gesetveerd met onze ambachtelijk gebakken broden.",
        price: "€ 8,50"
      },
      {
        title: "Prei & Aardappel", 
        description: "rijk en roomig gemengd met verse kruiden uit de tuin.",
        price: "€ 9,00"
      }
    ],
    hapjes: [
      {
        title: "Ambachtelijke Kaasplank",
        description: "Diverse zaorten kookeke saucs met brood eni kkanters.",
        price: "€ 24,50"
      },
      {
        title: "Huisgerookte Ham",
        description: "Traditioneel gerookt met eigen kruiden mix.",
        price: "€ 22,00"
      }
    ],
    buffets: [
      {
        title: "Hollandse Bitterballen",
        description: "Krispigs vele ragout ballen met mustard.",
        price: "€ 18,50"
      }
    ]
  }), []);

  // Memoize handlers to prevent unnecessary re-renders
  const handleCategoryChange = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
  }, []);

  const handleMouseEnter = useCallback((cardId: number) => {
    setHoveredCard(cardId);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredCard(null);
  }, []);

  const handleShowInteractiveMenu = useCallback(() => {
    setShowInteractiveMenu(true);
  }, []);

  // Conditionally render interactive menu system or traditional menu
  if (showInteractiveMenu) {
    return <InteractiveMenuSystemWithBoundary />;
  }

  return (
    <section className="py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-16 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          {/* Interactive Header with Glow Effects */}
          <div 
            className="mb-32"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 1s ease-out'
            }}
          >
            <h1 className="text-8xl md:text-9xl font-elegant-heading text-elegant-dark mb-16 tracking-[-0.02em] font-light relative inline-block">
              WESLEY'S<br />
              <span className="text-terracotta-600 relative">
                MENU
                <span className="absolute inset-0 blur-3xl bg-terracotta-400/20 animate-pulse"></span>
              </span>
            </h1>
            <div className="relative w-24 h-px bg-terracotta-600 mx-auto mb-16 overflow-hidden">
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-terracotta-400 to-transparent animate-pulse"></span>
            </div>
            <p className="text-elegant-dark font-elegant-script text-4xl md:text-5xl font-light animate-interactive-slide-up">
              ambachtelijk genieten
            </p>
            
            {/* Interactive Menu Toggle Button */}
            <div className="mt-16">
              <Button
                onClick={handleShowInteractiveMenu}
                variant="interactive-primary"
                size="elegant-lg"
                className="group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  🍽️
                  Interactieve Menu Bekijken
                </span>
              </Button>
            </div>
          </div>

          {/* Interactive Category Buttons with Enhanced Effects */}
          <div className="flex flex-wrap justify-center gap-16 mb-32">
            {categories.map((category, index) => (
              <Button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                variant={activeCategory === category.id ? "interactive-primary" : "interactive-glass"}
                size="elegant-lg"
                className="group relative overflow-hidden"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: isVisible ? 'interactive-slide-up 0.8s ease-out forwards' : 'none'
                }}
              >
                <span className="relative z-10 flex items-center gap-3">
                  <span className="text-2xl transform group-hover:scale-125 transition-transform duration-500">
                    {category.icon}
                  </span>
                  {category.name}
                </span>
              </Button>
            ))}
          </div>

          {/* Interactive Menu Items Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 max-w-6xl mx-auto">
            {/* Interactive Menu Card */}
            <Card 
              className="bg-white/90 backdrop-blur-sm border-0 shadow-elegant-panel hover:shadow-2xl transition-all duration-700 transform hover:scale-105 hover:-translate-y-2 group overflow-hidden"
              onMouseEnter={() => handleMouseEnter(0)}
              onMouseLeave={handleMouseLeave}
            >
              <CardContent className="p-16 text-left relative">
                {/* Glow background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-terracotta-50/0 to-terracotta-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <h3 className="text-5xl font-elegant-heading text-elegant-dark mb-20 font-light tracking-[-0.02em] relative z-10 transition-all duration-500 group-hover:text-terracotta-600">
                  {activeCategory === "soepen" ? "VERSE SOEPEN" : activeCategory === "hapjes" ? "HARTIGE HAPJES" : "FEEST BUFFETS"}
                </h3>
                <div className="space-y-16 relative z-10">
                  {menuItems[activeCategory as keyof typeof menuItems]?.map((item, index) => (
                    <div 
                      key={index} 
                      className="border-b border-gray-100 last:border-0 pb-8 last:pb-0 transition-all duration-500 hover:translate-x-2 group/item"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        animation: hoveredCard === 0 ? 'interactive-slide-up 0.6s ease-out forwards' : 'none'
                      }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-2xl font-elegant-body text-elegant-dark font-light group-hover/item:text-terracotta-600 transition-colors duration-300">
                          {item.title}
                        </h4>
                        <span className="text-terracotta-600 font-elegant-body text-xl font-medium opacity-0 group-hover/item:opacity-100 transition-all duration-500 transform translate-x-4 group-hover/item:translate-x-0">
                          {item.price}
                        </span>
                      </div>
                      <p className="text-elegant-nav font-elegant-body text-lg leading-relaxed font-light">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Interactive Food Image */}
            <div 
              className="relative overflow-hidden rounded-2xl group cursor-pointer"
              onMouseEnter={() => handleMouseEnter(1)}
              onMouseLeave={handleMouseLeave}
            >
              <div 
                className="h-[600px] bg-cover bg-center bg-no-repeat transition-all duration-700 transform group-hover:scale-110"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=2074')",
                  willChange: 'transform',
                  opacity: imageLoaded ? 1 : 0
                }}
              >
                {/* Interactive overlay with gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-terracotta-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                {/* Floating text overlay */}
                <div className="absolute bottom-8 left-8 right-8 transform translate-y-full group-hover:translate-y-0 transition-transform duration-700">
                  <p className="text-white font-elegant-script text-3xl">Vers bereid met liefde</p>
                </div>
              </div>
              
              {/* Glow effect on hover */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-terracotta-400/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              </div>
            </div>
          </div>

          {/* Interactive Additional Menu Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 mt-32 max-w-6xl mx-auto">
            <Card 
              className="bg-white/90 backdrop-blur-sm border-0 shadow-elegant-soft hover:shadow-elegant-panel transition-all duration-700 transform hover:scale-105 hover:-translate-y-2 group overflow-hidden"
              onMouseEnter={() => handleMouseEnter(2)}
              onMouseLeave={handleMouseLeave}
            >
              <CardContent className="p-16 text-left relative">
                <div className="absolute inset-0 bg-gradient-to-br from-terracotta-50/0 to-terracotta-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <h3 className="text-4xl font-elegant-heading text-elegant-dark mb-16 font-light tracking-[-0.02em] relative z-10 transition-all duration-500 group-hover:text-terracotta-600">
                  HARTIGE HAPJES
                </h3>
                <div className="space-y-12 relative z-10">
                  <div className="border-b border-gray-100 pb-8 transition-all duration-500 hover:translate-x-2">
                    <h4 className="text-xl font-elegant-body text-elegant-dark mb-3 font-light hover:text-terracotta-600 transition-colors duration-300">Ambachtelijke Kaasplank</h4>
                    <p className="text-elegant-nav font-elegant-body leading-relaxed font-light">
                      Diverse zaorten kookeke saucs met brood eni kkanters.
                    </p>
                  </div>
                  <div className="transition-all duration-500 hover:translate-x-2">
                    <h4 className="text-xl font-elegant-body text-elegant-dark mb-3 font-light hover:text-terracotta-600 transition-colors duration-300">Huisgerookte Ham</h4>
                    <p className="text-elegant-nav font-elegant-body leading-relaxed font-light">
                      Traditioneel gerookt met eigen kruiden mix.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="bg-white/90 backdrop-blur-sm border-0 shadow-elegant-soft hover:shadow-elegant-panel transition-all duration-700 transform hover:scale-105 hover:-translate-y-2 group overflow-hidden"
              onMouseEnter={() => handleMouseEnter(3)}
              onMouseLeave={handleMouseLeave}
            >
              <CardContent className="p-16 text-left relative">
                <div className="absolute inset-0 bg-gradient-to-br from-terracotta-50/0 to-terracotta-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <h3 className="text-4xl font-elegant-heading text-elegant-dark mb-16 font-light tracking-[-0.02em] relative z-10 transition-all duration-500 group-hover:text-terracotta-600">
                  MINI QUICHES
                </h3>
                <div className="space-y-12 relative z-10">
                  <div className="transition-all duration-500 hover:translate-x-2">
                    <h4 className="text-xl font-elegant-body text-elegant-dark mb-3 font-light hover:text-terracotta-600 transition-colors duration-300">Hollandse Bitterballen</h4>
                    <p className="text-elegant-nav font-elegant-body leading-relaxed font-light">
                      Krispigs vele ragout ballen met mustard.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
});
