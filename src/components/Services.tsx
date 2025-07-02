
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
    <section className="py-0 bg-gradient-to-br from-elegant-light via-terracotta-50/30 to-terracotta-100/15">
      <div 
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "linear-gradient(135deg, rgba(224,138,79,0.8), rgba(139,69,19,0.6), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=2076')"
        }}
      >
        {/* Organic Natural Pattern Overlay */}
        <div className="absolute inset-0 opacity-25">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                radial-gradient(ellipse 600px 400px at 25% 75%, rgba(224,138,79,0.3) 0%, transparent 60%),
                radial-gradient(ellipse 500px 350px at 75% 25%, rgba(224,138,79,0.25) 0%, transparent 55%),
                radial-gradient(ellipse 350px 250px at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 45%)
              `,
              backgroundSize: '1000px 800px, 800px 700px, 600px 500px',
              filter: 'blur(2px)'
            }}
          ></div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            {/* Organic Header */}
            <div className="mb-20 animate-organic-grow">
              <h1 className="text-6xl md:text-8xl font-elegant-heading text-elegant-light mb-8 tracking-tight transform">
                WESLEY'S<br />
                <span className="bg-gradient-to-br from-terracotta-300 via-terracotta-400 to-terracotta-500 bg-clip-text text-transparent">
                  MENU
                </span>
              </h1>
              <div className="w-40 h-2 bg-gradient-to-r from-terracotta-400 via-terracotta-500 to-terracotta-600 mx-auto mb-8 rounded-full opacity-90"></div>
              <p className="text-terracotta-200 font-elegant-script text-4xl md:text-5xl animate-organic-float">
                ambachtelijk genieten
              </p>
            </div>

            {/* Organic Category Buttons */}
            <div className="flex flex-wrap justify-center gap-8 mb-24">
              {categories.map((category, index) => (
                <Button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  variant={activeCategory === category.id ? "organic-primary" : "organic-floating"}
                  size="organic-lg"
                  className={`
                    transform transition-all duration-500 hover:scale-110
                    ${activeCategory === category.id ? 'shadow-organic-glow' : 'hover:shadow-organic-floating'}
                  `}
                  style={{
                    animationDelay: `${index * 0.2}s`,
                    animation: 'organic-grow 0.8s ease-out forwards'
                  }}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Organic Menu Items Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* Organic Menu Card */}
              <Card className="bg-gradient-to-br from-elegant-light/90 via-terracotta-50/50 to-elegant-light/85 backdrop-blur-md border border-terracotta-200/40 shadow-organic-floating transform hover:scale-[1.03] transition-all duration-700 rounded-3xl overflow-hidden animate-organic-breathe">
                <CardContent className="p-16 relative">
                  {/* Organic Decorative Elements */}
                  <div className="absolute top-6 right-6 w-20 h-14 bg-gradient-to-br from-terracotta-400/30 to-terracotta-600/30 rounded-full transform rotate-12 animate-organic-float"></div>
                  <div className="absolute bottom-8 left-6 w-12 h-8 bg-gradient-to-br from-terracotta-300/25 to-terracotta-500/25 rounded-full transform -rotate-6 animate-organic-float" style={{ animationDelay: '1.5s' }}></div>
                  
                  <h3 className="text-4xl font-elegant-heading text-elegant-dark mb-12 font-bold">
                    VERSE SOEPEN
                  </h3>
                  <div className="space-y-10">
                    {menuItems[activeCategory as keyof typeof menuItems]?.map((item, index) => (
                      <div 
                        key={index} 
                        className="text-left transform hover:translate-x-3 transition-all duration-500"
                        style={{
                          animationDelay: `${0.8 + index * 0.2}s`,
                          animation: 'organic-grow 0.8s ease-out forwards'
                        }}
                      >
                        <div className="flex items-center mb-5">
                          <div className="w-5 h-5 bg-gradient-to-br from-terracotta-400 to-terracotta-600 rounded-full mr-6 shadow-organic-soft animate-organic-breathe" style={{ animationDelay: `${index * 0.3}s` }}></div>
                          <h4 className="text-2xl font-bold font-elegant-body text-elegant-dark">
                            {item.title}
                          </h4>
                        </div>
                        <p className="text-elegant-nav font-elegant-body ml-11 text-lg leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Organic Food Image */}
              <div className="relative group animate-organic-float" style={{ animationDelay: '0.5s' }}>
                <div 
                  className="h-96 bg-cover bg-center bg-no-repeat rounded-3xl shadow-organic-floating border border-terracotta-200/30 transform group-hover:scale-105 transition-all duration-700 overflow-hidden"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=2074')"
                  }}
                >
                  {/* Organic Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-terracotta-900/60 via-terracotta-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                {/* Floating Organic Badge */}
                <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-terracotta-500 via-terracotta-600 to-terracotta-700 text-white px-8 py-4 rounded-full shadow-organic-natural font-elegant-body font-semibold transform rotate-3 animate-organic-breathe">
                  Signature Dish
                </div>
              </div>
            </div>

            {/* Organic Additional Menu Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-24 max-w-5xl mx-auto">
              <Card className="bg-gradient-to-br from-elegant-light/85 via-terracotta-50/50 to-elegant-light/80 backdrop-blur-sm border border-terracotta-200/40 shadow-organic-natural transform hover:scale-105 hover:rotate-1 transition-all duration-500 rounded-3xl animate-organic-breathe">
                <CardContent className="p-12 relative">
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-terracotta-400/60 to-terracotta-600/60 rounded-full animate-organic-float"></div>
                  <h3 className="text-3xl font-elegant-heading text-elegant-dark mb-10 font-bold">
                    HARTIGE HAPJES
                  </h3>
                  <div className="space-y-8">
                    <div className="flex items-center hover:translate-x-3 transition-all duration-500">
                      <div className="w-4 h-4 bg-gradient-to-br from-terracotta-400 to-terracotta-600 rounded-full mr-6 animate-organic-breathe"></div>
                      <span className="text-elegant-dark font-elegant-body font-bold text-lg">Ambachtelijke Kaasplank</span>
                    </div>
                    <p className="text-elegant-nav font-elegant-body ml-10 mt-3 leading-relaxed">
                      Diverse zaorten kookeke saucs met brood eni kkanters.
                    </p>
                    <div className="flex items-center mt-8 hover:translate-x-3 transition-all duration-500">
                      <div className="w-4 h-4 bg-gradient-to-br from-terracotta-400 to-terracotta-600 rounded-full mr-6 animate-organic-breathe" style={{ animationDelay: '0.5s' }}></div>
                      <span className="text-elegant-dark font-elegant-body font-bold text-lg">Huisgerookte Ham</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-elegant-light/85 via-terracotta-50/50 to-elegant-light/80 backdrop-blur-sm border border-terracotta-200/40 shadow-organic-natural transform hover:scale-105 hover:-rotate-1 transition-all duration-500 rounded-3xl animate-organic-breathe" style={{ animationDelay: '0.3s' }}>
                <CardContent className="p-12 relative">
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-terracotta-500/60 to-terracotta-700/60 rounded-full animate-organic-float" style={{ animationDelay: '1s' }}></div>
                  <h3 className="text-3xl font-elegant-heading text-elegant-dark mb-10 font-bold">
                    MINI QUICHES
                  </h3>
                  <div className="space-y-8">
                    <div className="flex items-center hover:translate-x-3 transition-all duration-500">
                      <div className="w-4 h-4 bg-gradient-to-br from-terracotta-400 to-terracotta-600 rounded-full mr-6 animate-organic-breathe" style={{ animationDelay: '1.2s' }}></div>
                      <span className="text-elegant-dark font-elegant-body font-bold text-lg">Hollandse Bitterballen</span>
                    </div>
                    <p className="text-elegant-nav font-elegant-body ml-10 mt-3 leading-relaxed">
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
