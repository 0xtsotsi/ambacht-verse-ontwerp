import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";

export const Services = () => {
  const [activeCategory, setActiveCategory] = useState("bbq");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const categories = [
    { id: "bbq", name: "BBQ Catering" },
    { id: "kantoor", name: "Kantoor Catering" },
    { id: "evenement", name: "Evenement Buffets" },
  ];

  const serviceItems = {
    bbq: [
      {
        name: "Feest Buffet",
        description: "Uitgebreid buffet voor feesten en partijen",
        price: "€30 p.p.",
        image: "https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=2074",
      },
      {
        name: "Bruiloft Catering",
        description: "Elegante catering voor uw speciale dag",
        price: "€45 p.p.",
        image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=2080",
      },
    ],
    kantoor: [
      {
        name: "Lunch Catering",
        description: "Verse broodjes en salades voor op kantoor",
        price: "€12 p.p.",
        image: "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=2073",
      },
      {
        name: "Meeting Catering",
        description: "Perfecte catering voor zakelijke bijeenkomsten",
        price: "€18 p.p.",
        image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=2074",
      },
    ],
    evenement: [
      {
        name: "Premium BBQ Pakket",
        description: "Compleet BBQ-pakket met premium vlees en bijgerechten",
        price: "€25 p.p.",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2071",
      },
      {
        name: "Vegetarisch BBQ",
        description: "Heerlijke vegetarische alternatieven voor de BBQ",
        price: "€20 p.p.",
        image: "https://images.unsplash.com/photo-1543362906-acfc16c67564?q=80&w=2065",
      },
    ],
  };

  return (
    <section id="services" className="section-spacing bg-secondary">
      <div className="container-main">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <p className="text-script mb-4">Ontdek</p>
          <h2 className="text-display text-foreground mb-6">Onze Services</h2>
          <div className="w-16 h-0.5 bg-highlight mx-auto mb-6" />
          <p className="text-body text-foreground max-w-2xl mx-auto">
            Van intieme diners tot grote evenementen, wij zorgen voor een culinaire ervaring die uw gasten nooit zullen vergeten.
          </p>
        </div>

        {/* Category Tabs */}
        <div className={`flex flex-wrap justify-center gap-4 mb-12 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-accent text-white'
                  : 'bg-highlight text-white hover:bg-accent'
              }`}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Service Items */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {serviceItems[activeCategory as keyof typeof serviceItems]?.map((item, index) => (
            <Card key={index} className="card-hoverable overflow-hidden">
              <div className="relative h-48">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full text-small font-medium">
                  {item.price}
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-subheading text-foreground mb-3">{item.name}</h3>
                <p className="text-body text-muted mb-4">{item.description}</p>
                <Button className="btn-primary w-full">Meer Info</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};