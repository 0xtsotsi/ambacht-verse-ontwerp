
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
    <section id="gallery" className="py-32 bg-white">
      <div className="container mx-auto px-16">
        <div className="max-w-7xl mx-auto">
          {/* Clean Section Header */}
          <div className="text-center mb-32">
            <h2 className="text-8xl md:text-9xl font-elegant-heading text-elegant-dark mb-16 font-light tracking-[-0.02em]">
              <span className="text-terracotta-600">
                Onze
              </span> Galerij
            </h2>
            <div className="w-32 h-px bg-terracotta-600 mx-auto mb-16"></div>
            <p className="text-2xl font-elegant-body text-elegant-dark max-w-4xl mx-auto font-light leading-relaxed">
              Neem eens een kijkje in de galerij wat wij afgelopen jaar allemaal mochten realiseren. 
              Van intieme lunches tot grote feesten - elk evenement krijgt onze volle aandacht.
            </p>
          </div>

          {/* Clean Category Filter */}
          <div className="flex flex-wrap justify-center gap-16 mb-32">
            {categories.map((category, index) => (
              <Button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                variant={activeCategory === category.id ? "luxury-primary" : "luxury-ghost"}
                size="luxury-lg"
                className="flex items-center gap-3 transition-all duration-300"
              >
                {category.icon}
                {category.name}
              </Button>
            ))}
          </div>

          {/* Clean Gallery Grid */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-16 space-y-16">
            {filteredItems.map((item, index) => (
              <div 
                key={item.id} 
                className="break-inside-avoid group cursor-pointer"
              >
                <div className="bg-white border-0 shadow-none overflow-hidden transition-all duration-300">
                  {/* Clean Image Placeholder */}
                  <div className={`${item.height} bg-gray-100 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                    
                    {/* Clean Badge */}
                    <div className="absolute top-6 left-6">
                      <Badge className="bg-terracotta-600 text-white font-elegant-body font-light px-4 py-2 border-0 shadow-none">
                        {item.type}
                      </Badge>
                    </div>
                    
                    {/* Clean Hover Content */}
                    <div className="absolute bottom-6 left-6 right-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <h4 className="font-elegant-heading text-xl mb-2 font-light">{item.title}</h4>
                      <p className="text-sm opacity-90 font-elegant-body leading-relaxed font-light">{item.description}</p>
                    </div>
                  </div>
                  
                  {/* Clean Content */}
                  <div className="p-8">
                    <h4 className="font-elegant-heading text-elegant-dark text-2xl mb-4 group-hover:text-terracotta-600 transition-colors font-light">
                      {item.title}
                    </h4>
                    <p className="text-elegant-nav leading-relaxed font-elegant-body font-light">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Clean Call to Action */}
          <div className="text-center mt-32">
            <div className="bg-gray-50 p-24 md:p-32 border-0 shadow-none">
              <h3 className="text-6xl md:text-7xl font-elegant-heading text-elegant-dark mb-16 font-light tracking-[-0.02em]">
                Laat Ons Uw Verhaal Vertellen
              </h3>
              <div className="w-32 h-px bg-terracotta-600 mx-auto mb-16"></div>
              <p className="text-elegant-dark font-elegant-body text-2xl mb-20 max-w-4xl mx-auto font-light leading-relaxed">
                Elk evenement is uniek, net als onze aanpak. Laten we samen iets bijzonders creëren 
                dat uw gasten nog lang zullen herinneren.
              </p>
              <Button 
                variant="luxury-primary"
                size="luxury-xl"
                className="text-xl font-light"
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
