
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
    <section id="gallery" className="py-20 bg-elegant-light">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-elegant-heading text-elegant-dark mb-6">
              Onze Galerij
            </h2>
            <div className="w-24 h-1 bg-elegant-terracotta mx-auto mb-8"></div>
            <p className="text-xl font-elegant-body text-elegant-nav max-w-3xl mx-auto">
              Neem eens een kijkje in de galerij wat wij afgelopen jaar allemaal mochten realiseren. 
              Van intieme lunches tot grote feesten - elk evenement krijgt onze volle aandacht.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                variant={activeCategory === category.id ? "elegant" : "elegant-outline"}
                size="elegant"
                className="flex items-center gap-2"
              >
                {category.icon}
                {category.name}
              </Button>
            ))}
          </div>

          {/* Gallery Grid - Masonry Style */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="break-inside-avoid group cursor-pointer"
              >
                <div className="bg-elegant-light rounded-elegant overflow-hidden shadow-elegant-soft hover:shadow-elegant-panel transition-all duration-300">
                  {/* Image Placeholder with Styling */}
                  <div className={`${item.height} bg-gradient-to-br from-elegant-terracotta/10 via-elegant-nav/5 to-elegant-terracotta/5 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-elegant-terracotta text-elegant-light font-elegant-body">
                        {item.type}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-elegant-light opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h4 className="font-elegant-heading text-lg mb-1">{item.title}</h4>
                      <p className="text-sm opacity-90 font-elegant-body">{item.description}</p>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <h4 className="font-elegant-heading text-elegant-dark text-lg mb-2 group-hover:text-elegant-terracotta transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-elegant-nav text-sm leading-relaxed font-elegant-body">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-elegant-light rounded-elegant p-10 md:p-16 shadow-elegant-panel">
              <h3 className="text-2xl md:text-3xl font-elegant-heading text-elegant-dark mb-6">
                Laat Ons Uw Verhaal Vertellen
              </h3>
              <p className="text-elegant-nav font-elegant-body text-lg mb-10 max-w-2xl mx-auto">
                Elk evenement is uniek, net als onze aanpak. Laten we samen iets bijzonders creëren 
                dat uw gasten nog lang zullen herinneren.
              </p>
              <Button 
                variant="elegant"
                size="elegant-lg"
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
