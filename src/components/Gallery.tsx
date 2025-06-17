
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
    <section id="gallery" className="py-20 bg-warm-cream">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-forest-green mb-4">
              Onze Galerij
            </h2>
            <div className="w-24 h-1 bg-burnt-orange mx-auto mb-6"></div>
            <p className="text-xl text-natural-brown max-w-3xl mx-auto">
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
                variant={activeCategory === category.id ? "default" : "outline"}
                className={`flex items-center gap-2 ${
                  activeCategory === category.id 
                    ? "bg-forest-green text-warm-cream hover:bg-forest-green/90" 
                    : "border-beige text-beige hover:bg-burnt-orange hover:text-warm-cream"
                }`}
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
                <div className="bg-clean-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                  {/* Image Placeholder with Styling */}
                  <div className={`${item.height} bg-gradient-to-br from-natural-brown/20 via-forest-green/10 to-beige rustic-pattern relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-burnt-orange text-clean-white">
                        {item.type}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-clean-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h4 className="font-serif text-lg mb-1">{item.title}</h4>
                      <p className="text-sm opacity-90">{item.description}</p>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <h4 className="font-serif text-forest-green text-lg mb-2 group-hover:text-burnt-orange transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-natural-brown text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="bg-clean-white rounded-xl p-8 md:p-12 delft-pattern">
              <h3 className="text-2xl md:text-3xl font-serif text-forest-green mb-4">
                Laat Ons Uw Verhaal Vertellen
              </h3>
              <p className="text-natural-brown text-lg mb-8 max-w-2xl mx-auto">
                Elk evenement is uniek, net als onze aanpak. Laten we samen iets bijzonders creëren 
                dat uw gasten nog lang zullen herinneren.
              </p>
              <Button 
                size="lg" 
                className="bg-forest-green hover:bg-forest-green/90 text-clean-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
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
