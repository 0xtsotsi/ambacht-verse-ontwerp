
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
    <section className="py-0 bg-gradient-to-br from-elegant-light via-terracotta-50/20 to-elegant-light">
      <div 
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "linear-gradient(135deg, rgba(224,138,79,0.85), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=2076')"
        }}
      >
        {/* Modern Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 80%, rgba(224,138,79,0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(224,138,79,0.2) 0%, transparent 50%),
                linear-gradient(45deg, transparent 40%, rgba(224,138,79,0.1) 50%, transparent 60%)
              `,
              backgroundSize: '400px 400px, 300px 300px, 60px 60px'
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            {/* Modern Header */}
            <div className="mb-16 animate-elegant-fade-in">
              <h1 className="text-6xl md:text-8xl font-elegant-heading text-elegant-light mb-6 tracking-tight">
                WESLEY'S<br />
                <span className="bg-gradient-to-r from-terracotta-300 via-terracotta-400 to-terracotta-500 bg-clip-text text-transparent">
                  MENU
                </span>
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-terracotta-400 to-terracotta-600 mx-auto mb-6 rounded-full"></div>
              <p className="text-terracotta-300 font-elegant-script text-4xl md:text-5xl animate-elegant-glow">
                ambachtelijk genieten
              </p>
            </div>

            {/* Modern Category Buttons */}
            <div className="flex flex-wrap justify-center gap-6 mb-20">
              {categories.map((category, index) => (
                <Button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  variant={activeCategory === category.id ? "fusion-primary" : "fusion-glass"}
                  size="elegant-lg"
                  className={`
                    transform transition-all duration-300 hover:scale-110 hover:-translate-y-1
                    ${activeCategory === category.id ? 'shadow-elegant-button-hover' : 'hover:shadow-elegant-soft'}
                  `}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: 'elegant-fade-in 0.6s ease-out forwards'
                  }}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Modern Menu Items Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
              {/* Enhanced Menu Card */}
              <Card className="bg-gradient-to-br from-elegant-light/95 via-elegant-light/90 to-terracotta-50/80 backdrop-blur-md border border-terracotta-200/50 shadow-elegant-panel transform hover:scale-[1.02] transition-all duration-500 rounded-2xl overflow-hidden">
                <CardContent className="p-12 relative">
                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-terracotta-400/20 to-terracotta-600/20 rounded-full"></div>
                  
                  <h3 className="text-4xl font-elegant-heading text-elegant-dark mb-10 font-bold">
                    VERSE SOEPEN
                  </h3>
                  <div className="space-y-8">
                    {menuItems[activeCategory as keyof typeof menuItems]?.map((item, index) => (
                      <div 
                        key={index} 
                        className="text-left transform hover:translate-x-2 transition-all duration-300"
                        style={{
                          animationDelay: `${0.5 + index * 0.1}s`,
                          animation: 'elegant-fade-in 0.6s ease-out forwards'
                        }}
                      >
                        <div className="flex items-center mb-4">
                          <div className="w-4 h-4 bg-gradient-to-r from-terracotta-400 to-terracotta-600 rounded-full mr-5 shadow-elegant-subtle"></div>
                          <h4 className="text-2xl font-bold font-elegant-body text-elegant-dark">
                            {item.title}
                          </h4>
                        </div>
                        <p className="text-elegant-nav font-elegant-body ml-9 text-lg leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Food Image */}
              <div className="relative group">
                <div 
                  className="h-96 bg-cover bg-center bg-no-repeat rounded-2xl shadow-elegant-panel border border-terracotta-200/30 transform group-hover:scale-105 transition-all duration-500 overflow-hidden"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=2074')"
                  }}
                >
                  {/* Modern Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-terracotta-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                {/* Floating Badge */}
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white px-6 py-3 rounded-xl shadow-elegant-button font-elegant-body font-semibold">
                  Signature Dish
                </div>
              </div>
            </div>

            {/* Modern Additional Menu Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20 max-w-5xl mx-auto">
              <Card className="bg-gradient-to-br from-elegant-light/90 via-terracotta-50/60 to-elegant-light/80 backdrop-blur-sm border border-terracotta-200/40 shadow-elegant-soft transform hover:scale-105 hover:rotate-1 transition-all duration-300 rounded-2xl">
                <CardContent className="p-10 relative">
                  <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-terracotta-400 to-terracotta-600 rounded-full"></div>
                  <h3 className="text-3xl font-elegant-heading text-elegant-dark mb-8 font-bold">
                    HARTIGE HAPJES
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center hover:translate-x-2 transition-all duration-300">
                      <div className="w-3 h-3 bg-gradient-to-r from-terracotta-400 to-terracotta-600 rounded-full mr-5"></div>
                      <span className="text-elegant-dark font-elegant-body font-bold text-lg">Ambachtelijke Kaasplank</span>
                    </div>
                    <p className="text-elegant-nav font-elegant-body ml-8 mt-2 leading-relaxed">
                      Diverse zaorten kookeke saucs met brood eni kkanters.
                    </p>
                    <div className="flex items-center mt-6 hover:translate-x-2 transition-all duration-300">
                      <div className="w-3 h-3 bg-gradient-to-r from-terracotta-400 to-terracotta-600 rounded-full mr-5"></div>
                      <span className="text-elegant-dark font-elegant-body font-bold text-lg">Huisgerookte Ham</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-elegant-light/90 via-terracotta-50/60 to-elegant-light/80 backdrop-blur-sm border border-terracotta-200/40 shadow-elegant-soft transform hover:scale-105 hover:-rotate-1 transition-all duration-300 rounded-2xl">
                <CardContent className="p-10 relative">
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-terracotta-500 to-terracotta-700 rounded-full"></div>
                  <h3 className="text-3xl font-elegant-heading text-elegant-dark mb-8 font-bold">
                    MINI QUICHES
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center hover:translate-x-2 transition-all duration-300">
                      <div className="w-3 h-3 bg-gradient-to-r from-terracotta-400 to-terracotta-600 rounded-full mr-5"></div>
                      <span className="text-elegant-dark font-elegant-body font-bold text-lg">Hollandse Bitterballen</span>
                    </div>
                    <p className="text-elegant-nav font-elegant-body ml-8 mt-2 leading-relaxed">
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
