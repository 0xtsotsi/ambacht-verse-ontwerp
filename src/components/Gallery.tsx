
import { useState, useEffect, useRef, memo, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, ChefHat, Utensils, Users } from "lucide-react";
import { useOptimizedIntersectionObserver } from "@/hooks/useAnimationOptimization";
import { usePerformanceLogger } from "@/hooks/useComponentLogger";

export const Gallery = memo(() => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Optimized intersection observer with proper cleanup
  const { observe, isVisible } = useOptimizedIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });
  
  // Performance monitoring
  const { getPerformanceStats } = usePerformanceLogger({
    componentName: 'Gallery',
    slowRenderThreshold: 16,
    enableMemoryTracking: true
  });

  // Set up intersection observer
  useEffect(() => {
    if (sectionRef.current) {
      observe(sectionRef.current);
    }
  }, [observe]);

  // Memoize categories to prevent unnecessary re-renders
  const categories = useMemo(() => [
    { id: "all", name: "Alles", icon: <Camera className="w-4 h-4" /> },
    { id: "bbq", name: "BBQ Events", icon: <ChefHat className="w-4 h-4" /> },
    { id: "catering", name: "Catering", icon: <Utensils className="w-4 h-4" /> },
    { id: "events", name: "Evenementen", icon: <Users className="w-4 h-4" /> },
  ], []);

  // Memoize gallery items to prevent unnecessary re-renders
  const galleryItems = useMemo(() => [
    {
      id: 1,
      category: "bbq",
      title: "Pulled Pork Perfectie",
      description: "16 uur langzaam gerookt voor de perfecte textuur",
      type: "Smoking Specialty",
      height: "h-64"
    },
    {
      id: 2,
      category: "catering", 
      title: "Broodjes Lunch Setup",
      description: "Vers belegde broodjes voor kantoor catering",
      type: "Office Catering",
      height: "h-80"
    },
    {
      id: 3,
      category: "events",
      title: "Bruiloft Buffet",
      description: "Uitgebreid buffet met lokale specialiteiten",
      type: "Wedding Catering",
      height: "h-72"
    },
    {
      id: 4,
      category: "bbq",
      title: "Outdoor BBQ Setup",
      description: "Complete BBQ opstelling voor bedrijfsfeest",
      type: "Corporate Event",
      height: "h-60"
    },
    {
      id: 5,
      category: "catering",
      title: "Seizoen Salade Bar",
      description: "Verse seizoenssalades met lokale groenten",
      type: "Healthy Options",
      height: "h-68"
    },
    {
      id: 6,
      category: "events",
      title: "Verjaardag Catering",
      description: "Persoonlijk menu voor 50ste verjaardag",
      type: "Birthday Party",
      height: "h-76"
    }
  ], []);

  // Memoize filtered items to prevent unnecessary filtering
  const filteredItems = useMemo(() => {
    return activeCategory === "all" 
      ? galleryItems 
      : galleryItems.filter(item => item.category === activeCategory);
  }, [activeCategory, galleryItems]);

  // Memoize hover handlers to prevent unnecessary re-renders
  const handleMouseEnter = useCallback((itemId: number) => {
    setHoveredItem(itemId);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredItem(null);
  }, []);

  // Memoize category change handler
  const handleCategoryChange = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
  }, []);

  return (
    <section id="gallery" className="py-32 bg-white overflow-hidden" ref={sectionRef}>
      <div className="container mx-auto px-16">
        <div className="max-w-7xl mx-auto">
          {/* Interactive Section Header */}
          <div 
            className="text-center mb-32"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 1s ease-out'
            }}
          >
            <h2 className="text-8xl md:text-9xl font-elegant-heading text-elegant-dark mb-16 font-light tracking-[-0.02em] relative inline-block">
              <span className="text-terracotta-600 relative">
                Onze
                <span className="absolute inset-0 blur-3xl bg-terracotta-400/20 animate-pulse"></span>
              </span> Galerij
            </h2>
            <div className="relative w-32 h-px bg-terracotta-600 mx-auto mb-16 overflow-hidden">
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-terracotta-400 to-transparent animate-pulse"></span>
            </div>
            <p className="text-2xl font-elegant-body text-elegant-dark max-w-4xl mx-auto font-light leading-relaxed animate-interactive-slide-up">
              Neem eens een kijkje in de galerij wat wij afgelopen jaar allemaal mochten realiseren. 
              Van intieme lunches tot grote feesten - elk evenement krijgt onze volle aandacht.
            </p>
          </div>

          {/* Interactive Category Filter */}
          <div className="flex flex-wrap justify-center gap-16 mb-32">
            {categories.map((category, index) => (
              <Button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                variant={activeCategory === category.id ? "interactive-primary" : "interactive-glass"}
                size="elegant-lg"
                className="flex items-center gap-3 group"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: isVisible ? 'interactive-slide-up 0.8s ease-out forwards' : 'none'
                }}
              >
                <span className="transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                  {category.icon}
                </span>
                <span className="relative z-10">{category.name}</span>
              </Button>
            ))}
          </div>

          {/* Interactive Gallery Grid */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-16 space-y-16">
            {filteredItems.map((item, index) => (
              <div 
                key={item.id} 
                className="break-inside-avoid group cursor-pointer transform transition-all duration-700 hover:scale-105 hover:-translate-y-2"
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={handleMouseLeave}
                style={{
                  animationDelay: `${index * 0.15}s`,
                  animation: isVisible ? 'interactive-slide-up 1s ease-out forwards' : 'none',
                  opacity: isVisible ? 1 : 0,
                  willChange: 'transform, opacity'
                }}
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-elegant-soft hover:shadow-elegant-panel overflow-hidden transition-all duration-700">
                  {/* Interactive Image Placeholder */}
                  <div className={`${item.height} bg-gray-100 relative overflow-hidden group`}>
                    {/* Dynamic gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-terracotta-100 via-terracotta-200 to-terracotta-300 opacity-50"></div>
                    
                    {/* Interactive overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                    
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-terracotta-400/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    
                    {/* Interactive Badge */}
                    <div className="absolute top-6 left-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      <Badge className="bg-terracotta-600 text-white font-elegant-body font-light px-4 py-2 rounded-full shadow-lg animate-elegant-glow">
                        {item.type}
                      </Badge>
                    </div>
                    
                    {/* Interactive Hover Content */}
                    <div className="absolute bottom-6 left-6 right-6 text-white transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700">
                      <h4 className="font-elegant-heading text-2xl mb-3 font-light animate-interactive-slide-up">{item.title}</h4>
                      <p className="text-base opacity-90 font-elegant-body leading-relaxed font-light animate-interactive-slide-up" style={{ animationDelay: '0.1s' }}>
                        {item.description}
                      </p>
                    </div>
                    
                    {/* Decorative corner accent */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-terracotta-400/30 to-transparent transform translate-x-12 -translate-y-12 rotate-45 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700"></div>
                  </div>
                  
                  {/* Interactive Content */}
                  <div className="p-8 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-terracotta-50/0 to-terracotta-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    <h4 className="font-elegant-heading text-elegant-dark text-2xl mb-4 group-hover:text-terracotta-600 transition-all duration-500 transform group-hover:translate-x-2 font-light relative z-10">
                      {item.title}
                    </h4>
                    <p className="text-elegant-nav leading-relaxed font-elegant-body font-light transition-all duration-500 transform group-hover:translate-x-2 relative z-10">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Call to Action */}
          <div 
            className="text-center mt-32"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
              transition: 'all 1.2s ease-out 0.5s'
            }}
          >
            <div className="bg-gradient-to-br from-gray-50 via-terracotta-50/30 to-gray-50 p-24 md:p-32 rounded-3xl shadow-elegant-panel hover:shadow-2xl transition-all duration-700 group cursor-pointer transform hover:scale-105">
              <h3 className="text-6xl md:text-7xl font-elegant-heading text-elegant-dark mb-16 font-light tracking-[-0.02em] transition-all duration-700 group-hover:text-terracotta-600 relative">
                Laat Ons Uw Verhaal Vertellen
                <span className="absolute inset-0 blur-3xl bg-terracotta-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></span>
              </h3>
              <div className="relative w-32 h-px bg-terracotta-600 mx-auto mb-16 overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-terracotta-400 to-transparent animate-pulse"></span>
              </div>
              <p className="text-elegant-dark font-elegant-body text-2xl mb-20 max-w-4xl mx-auto font-light leading-relaxed transition-all duration-700 group-hover:text-elegant-grey-700">
                Elk evenement is uniek, net als onze aanpak. Laten we samen iets bijzonders creëren 
                dat uw gasten nog lang zullen herinneren.
              </p>
              <Button 
                variant="interactive-primary"
                size="luxury-xl"
                className="text-xl font-light group animate-interactive-pulse-glow"
              >
                <span className="relative z-10">Plan Uw Evenement</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
