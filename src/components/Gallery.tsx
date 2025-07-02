
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, ChefHat, Utensils, Users } from "lucide-react";

export const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "Alles", icon: <Camera className="w-4 h-4" /> },
    { id: "bbq", name: "BBQ Events", icon: <ChefHat className="w-4 h-4" /> },
    { id: "catering", name: "Catering", icon: <Utensils className="w-4 h-4" /> },
    { id: "events", name: "Evenementen", icon: <Users className="w-4 h-4" /> },
  ];

  // Using placeholder content that represents the style of images
  const galleryItems = [
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
  ];

  const filteredItems = activeCategory === "all" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <section id="gallery" className="py-20 bg-gradient-to-br from-elegant-light via-terracotta-50/30 to-elegant-light">
      {/* Modern Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(224,138,79,0.4) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(224,138,79,0.3) 0%, transparent 50%),
              linear-gradient(30deg, transparent 48%, rgba(224,138,79,0.1) 49%, rgba(224,138,79,0.1) 51%, transparent 52%)
            `,
            backgroundSize: '600px 600px, 400px 400px, 120px 120px'
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Modern Section Header */}
          <div className="text-center mb-20 animate-elegant-fade-in">
            <h2 className="text-5xl md:text-6xl font-elegant-heading text-elegant-dark mb-8 font-bold tracking-tight">
              <span className="bg-gradient-to-r from-terracotta-600 via-terracotta-700 to-terracotta-800 bg-clip-text text-transparent">
                Onze
              </span> Galerij
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-terracotta-400 to-terracotta-600 mx-auto mb-10 rounded-full"></div>
            <p className="text-2xl font-elegant-body text-elegant-nav max-w-4xl mx-auto font-medium leading-relaxed">
              Neem eens een kijkje in de galerij wat wij afgelopen jaar allemaal mochten realiseren. 
              Van intieme lunches tot grote feesten - elk evenement krijgt onze volle aandacht.
            </p>
          </div>

          {/* Modern Category Filter */}
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            {categories.map((category, index) => (
              <Button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                variant={activeCategory === category.id ? "fusion-primary" : "fusion-glass"}
                size="elegant-lg"
                className="flex items-center gap-3 transform hover:scale-110 hover:-translate-y-1 transition-all duration-300"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: 'elegant-fade-in 0.6s ease-out forwards'
                }}
              >
                {category.icon}
                {category.name}
              </Button>
            ))}
          </div>

          {/* Modern Gallery Grid - Enhanced Masonry */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {filteredItems.map((item, index) => (
              <div 
                key={item.id} 
                className="break-inside-avoid group cursor-pointer"
                style={{
                  animationDelay: `${0.2 + index * 0.1}s`,
                  animation: 'elegant-fade-in 0.8s ease-out forwards'
                }}
              >
                <div className="bg-gradient-to-br from-elegant-light/95 via-elegant-light/90 to-terracotta-50/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-elegant-soft hover:shadow-elegant-panel transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 border border-terracotta-200/50">
                  {/* Enhanced Image Placeholder */}
                  <div className={`${item.height} bg-gradient-to-br from-terracotta-400/20 via-terracotta-500/10 to-terracotta-600/20 relative overflow-hidden`}>
                    {/* Modern Geometric Overlay */}
                    <div className="absolute inset-0 opacity-20">
                      <div 
                        className="w-full h-full"
                        style={{
                          backgroundImage: `
                            linear-gradient(45deg, transparent 30%, rgba(224,138,79,0.3) 50%, transparent 70%),
                            radial-gradient(circle at 30% 70%, rgba(224,138,79,0.2) 0%, transparent 50%)
                          `,
                          backgroundSize: '60px 60px, 150px 150px'
                        }}
                      ></div>
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-terracotta-900/70 via-terracotta-800/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                    
                    {/* Modern Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white font-elegant-body font-semibold px-4 py-2 rounded-xl shadow-elegant-button border-0">
                        {item.type}
                      </Badge>
                    </div>
                    
                    {/* Modern Hover Content */}
                    <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <h4 className="font-elegant-heading text-xl mb-2 font-bold">{item.title}</h4>
                      <p className="text-sm opacity-90 font-elegant-body leading-relaxed">{item.description}</p>
                    </div>
                    
                    {/* Decorative Corner Element */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-terracotta-400 to-terracotta-600 rounded-full opacity-0 group-hover:opacity-80 transition-all duration-300 transform scale-0 group-hover:scale-100"></div>
                  </div>
                  
                  {/* Enhanced Content */}
                  <div className="p-6">
                    <h4 className="font-elegant-heading text-elegant-dark text-xl mb-3 group-hover:text-terracotta-600 transition-colors font-bold">
                      {item.title}
                    </h4>
                    <p className="text-elegant-nav leading-relaxed font-elegant-body font-medium">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modern Call to Action */}
          <div className="text-center mt-20">
            <div className="bg-gradient-to-br from-elegant-light/95 via-elegant-light/90 to-terracotta-50/80 backdrop-blur-md rounded-3xl p-12 md:p-20 shadow-elegant-panel border border-terracotta-200/50 transform hover:scale-[1.02] transition-all duration-500 relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-terracotta-400 to-terracotta-600 rounded-full opacity-60"></div>
              <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-gradient-to-br from-terracotta-500 to-terracotta-700 rounded-full opacity-60"></div>
              
              <h3 className="text-4xl md:text-5xl font-elegant-heading text-elegant-dark mb-8 font-bold">
                Laat Ons Uw Verhaal Vertellen
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-terracotta-400 to-terracotta-600 mx-auto mb-8 rounded-full"></div>
              <p className="text-elegant-nav font-elegant-body text-xl mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
                Elk evenement is uniek, net als onze aanpak. Laten we samen iets bijzonders creëren 
                dat uw gasten nog lang zullen herinneren.
              </p>
              <Button 
                variant="fusion-primary"
                size="elegant-lg"
                className="px-12 py-6 text-xl font-bold"
              >
                Plan Uw Evenement
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
