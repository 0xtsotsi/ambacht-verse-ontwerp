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
        name: "BBQ Catering Pakket",
        description: "Broodjes hamburger, pulled chicken en kipsaté",
        price: "€25 p.p.",
        image: "/attached_assets/1000005931_1753439577477.jpg",
      },
      {
        name: "Premium Vlees Selectie",
        description: "Heerlijke gegrilde specialiteiten voor uw evenement",
        price: "€35 p.p.",
        image: "/attached_assets/1000005907_1753439577476.jpg",
      },
    ],
    kantoor: [
      {
        name: "Luxe Borrelplank",
        description: "Artisanale vleeswaren en kazen voor zakelijke events",
        price: "€18 p.p.",
        image: "/attached_assets/1000005871_1753439577475.jpg",
      },
      {
        name: "Gourmet Broodjes",
        description: "Vers belegde broodjes voor lunch catering",
        price: "€12 p.p.",
        image: "/attached_assets/1000005760_1753439577478.jpg",
      },
    ],
    evenement: [
      {
        name: "Verse Fruit Catering",
        description: "Kleurrijke fruitschaal met verse kruiden",
        price: "€15 p.p.",
        image: "/attached_assets/1000005916_1753439577477.jpg",
      },
      {
        name: "Luxe Visplank",
        description: "Verse zalm en andere visspecialiteiten",
        price: "€28 p.p.",
        image: "/attached_assets/1000005739_1753439577480.jpg",
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