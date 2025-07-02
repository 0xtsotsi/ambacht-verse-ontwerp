
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
    <section className="py-0 bg-elegant-light">
      <div 
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=2076')"
        }}
      >
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto text-center">
            {/* Header */}
            <h1 className="text-6xl md:text-7xl font-elegant-heading text-elegant-light mb-6">
              WESLEY'S<br />
              MENU
            </h1>
            <p className="text-elegant-terracotta font-elegant-script text-3xl md:text-4xl mb-16">
              ambachtelijk genieten
            </p>

            {/* Category Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  variant={activeCategory === category.id ? "elegant" : "elegant-outline"}
                  size="elegant"
                  className={`${
                    activeCategory === category.id ? "" : "text-elegant-light border-elegant-light hover:bg-elegant-light hover:text-elegant-terracotta"
                  }`}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Menu Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Menu Card */}
              <Card className="bg-elegant-light border-0 shadow-elegant-panel">
                <CardContent className="p-10">
                  <h3 className="text-3xl font-elegant-heading text-elegant-dark mb-8">
                    VERSE SOEPEN
                  </h3>
                  <div className="space-y-6">
                    {menuItems[activeCategory as keyof typeof menuItems]?.map((item, index) => (
                      <div key={index} className="text-left">
                        <div className="flex items-center mb-3">
                          <div className="w-3 h-3 bg-elegant-terracotta rounded-full mr-4"></div>
                          <h4 className="text-xl font-semibold font-elegant-body text-elegant-dark">
                            {item.title}
                          </h4>
                        </div>
                        <p className="text-elegant-nav font-elegant-body ml-7">
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
              <Card className="bg-elegant-light border-0 shadow-elegant-soft">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-elegant-heading text-elegant-dark mb-6">
                    HARTIGE HAPJES
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-elegant-terracotta rounded-full mr-4"></div>
                      <span className="text-elegant-dark font-elegant-body font-semibold">Ambachtelijke Kaasplank</span>
                    </div>
                    <p className="text-elegant-nav font-elegant-body text-sm ml-6 mt-1">
                      Diverse zaorten kookeke saucs met brood eni kkanters.
                    </p>
                    <div className="flex items-center mt-3">
                      <div className="w-2 h-2 bg-elegant-terracotta rounded-full mr-4"></div>
                      <span className="text-elegant-dark font-elegant-body font-semibold">Huisgerookte Ham</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-elegant-light border-0 shadow-elegant-soft">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-elegant-heading text-elegant-dark mb-6">
                    MINI QUICHES
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-elegant-terracotta rounded-full mr-4"></div>
                      <span className="text-elegant-dark font-elegant-body font-semibold">Hollandse Bitterballen</span>
                    </div>
                    <p className="text-elegant-nav font-elegant-body text-sm ml-6 mt-1">
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
