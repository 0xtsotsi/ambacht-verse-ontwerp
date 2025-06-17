
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

export const Services = () => {
  const [activeCategory, setActiveCategory] = useState("soepen");

  const categories = [
    { id: "soepen", name: "BBQ", color: "bg-burnt-orange" },
    { id: "hapjes", name: "Kantoor Catering", color: "bg-forest-green" },
    { id: "buffets", name: "Evenement Buffets", color: "bg-deep-teal" },
  ];

  const menuItems = {
    soepen: [
      {
        title: "Tomaten Basilicum",
        description: "gesetveerd met onze ambachtelijk gebakken broden."
      },
      {
        title: "Prei & Aardappel", 
        description: "rijk en roomig gemengd met verse kruiden uit de tuin."
      }
    ],
    hapjes: [
      {
        title: "Ambachtelijke Kaasplank",
        description: "Diverse zaorten kookeke saucs met brood eni kkanters."
      },
      {
        title: "Huisgerookte Ham",
        description: "Traditioneel gerookt met eigen kruiden mix."
      }
    ],
    buffets: [
      {
        title: "Hollandse Bitterballen",
        description: "Krispigs vele ragout ballen met mustard."
      }
    ]
  };

  return (
    <section className="py-0 bg-forest-green">
      <div 
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "linear-gradient(rgba(46, 111, 64, 0.8), rgba(46, 111, 64, 0.8)), url('https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=2076')"
        }}
      >
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto text-center">
            {/* Header */}
            <h1 className="text-6xl md:text-7xl font-serif text-warm-cream mb-4">
              WESLEY'S<br />
              MENU
            </h1>
            <p className="text-burnt-orange font-script text-3xl md:text-4xl mb-12">
              ambachtelijk genieten
            </p>

            {/* Category Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`${
                    activeCategory === category.id ? category.color : "bg-warm-cream/20"
                  } text-warm-cream hover:bg-burnt-orange px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300`}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Menu Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Menu Card */}
              <Card className="bg-warm-cream border-0 shadow-2xl">
                <CardContent className="p-8">
                  <h3 className="text-3xl font-serif text-forest-green mb-6">
                    VERSE SOEPEN
                  </h3>
                  <div className="space-y-6">
                    {menuItems[activeCategory as keyof typeof menuItems]?.map((item, index) => (
                      <div key={index} className="text-left">
                        <div className="flex items-center mb-2">
                          <div className="w-3 h-3 bg-burnt-orange rounded-full mr-3"></div>
                          <h4 className="text-xl font-semibold text-forest-green">
                            {item.title}
                          </h4>
                        </div>
                        <p className="text-natural-brown ml-6">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Food Image */}
              <div className="relative">
                <div 
                  className="h-80 bg-cover bg-center bg-no-repeat rounded-lg shadow-2xl"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=2074')"
                  }}
                ></div>
              </div>
            </div>

            {/* Additional Menu Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 max-w-4xl mx-auto">
              <Card className="bg-warm-cream border-0 shadow-2xl">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-serif text-forest-green mb-4">
                    HARTIGE HAPJES
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-burnt-orange rounded-full mr-3"></div>
                      <span className="text-forest-green font-semibold">Ambachtelijke Kaasplank</span>
                    </div>
                    <p className="text-natural-brown text-sm ml-5">
                      Diverse zaorten kookeke saucs met brood eni kkanters.
                    </p>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-burnt-orange rounded-full mr-3"></div>
                      <span className="text-forest-green font-semibold">Huisgerookte Ham</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-warm-cream border-0 shadow-2xl">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-serif text-forest-green mb-4">
                    MINI QUICHES
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-burnt-orange rounded-full mr-3"></div>
                      <span className="text-forest-green font-semibold">Hollandse Bitterballen</span>
                    </div>
                    <p className="text-natural-brown text-sm ml-5">
                      Krispigs vele ragout ballen met mustard.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
