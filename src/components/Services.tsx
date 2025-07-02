
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
    <section className="py-32 bg-white">
      <div className="container mx-auto px-16 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          {/* Clean Header */}
          <div className="mb-32">
            <h1 className="text-8xl md:text-9xl font-elegant-heading text-elegant-dark mb-16 tracking-[-0.02em] font-light">
              WESLEY'S<br />
              <span className="text-terracotta-600">
                MENU
              </span>
            </h1>
            <div className="w-24 h-px bg-terracotta-600 mx-auto mb-16"></div>
            <p className="text-elegant-dark font-elegant-script text-4xl md:text-5xl font-light">
              ambachtelijk genieten
            </p>
          </div>

          {/* Clean Category Buttons */}
          <div className="flex flex-wrap justify-center gap-16 mb-32">
            {categories.map((category, index) => (
              <Button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                variant={activeCategory === category.id ? "luxury-primary" : "luxury-ghost"}
                size="luxury-lg"
                className="transition-all duration-300"
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Clean Menu Items Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 max-w-6xl mx-auto">
            {/* Clean Menu Card */}
            <Card className="bg-white border-0 shadow-none">
              <CardContent className="p-16 text-left">
                <h3 className="text-5xl font-elegant-heading text-elegant-dark mb-20 font-light tracking-[-0.02em]">
                  VERSE SOEPEN
                </h3>
                <div className="space-y-16">
                  {menuItems[activeCategory as keyof typeof menuItems]?.map((item, index) => (
                    <div key={index} className="border-b border-gray-100 last:border-0 pb-8 last:pb-0">
                      <h4 className="text-2xl font-elegant-body text-elegant-dark mb-4 font-light">
                        {item.title}
                      </h4>
                      <p className="text-elegant-nav font-elegant-body text-lg leading-relaxed font-light">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Clean Food Image */}
            <div className="relative">
              <div 
                className="h-[600px] bg-cover bg-center bg-no-repeat transition-all duration-300"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=2074')"
                }}
              >
              </div>
            </div>
          </div>

          {/* Clean Additional Menu Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 mt-32 max-w-6xl mx-auto">
            <Card className="bg-white border-0 shadow-none">
              <CardContent className="p-16 text-left">
                <h3 className="text-4xl font-elegant-heading text-elegant-dark mb-16 font-light tracking-[-0.02em]">
                  HARTIGE HAPJES
                </h3>
                <div className="space-y-12">
                  <div className="border-b border-gray-100 pb-8">
                    <h4 className="text-xl font-elegant-body text-elegant-dark mb-3 font-light">Ambachtelijke Kaasplank</h4>
                    <p className="text-elegant-nav font-elegant-body leading-relaxed font-light">
                      Diverse zaorten kookeke saucs met brood eni kkanters.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xl font-elegant-body text-elegant-dark mb-3 font-light">Huisgerookte Ham</h4>
                    <p className="text-elegant-nav font-elegant-body leading-relaxed font-light">
                      Traditioneel gerookt met eigen kruiden mix.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-none">
              <CardContent className="p-16 text-left">
                <h3 className="text-4xl font-elegant-heading text-elegant-dark mb-16 font-light tracking-[-0.02em]">
                  MINI QUICHES
                </h3>
                <div className="space-y-12">
                  <div>
                    <h4 className="text-xl font-elegant-body text-elegant-dark mb-3 font-light">Hollandse Bitterballen</h4>
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
};
