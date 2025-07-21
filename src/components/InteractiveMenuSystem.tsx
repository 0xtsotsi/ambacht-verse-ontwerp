// V5 Interactive Elegance - Interactive Menu System
// This component provides an enhanced menu browsing experience
import { useState, memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ChefHat, Clock, Users } from "lucide-react";

interface MenuItemProps {
  title: string;
  description: string;
  price: string;
  category: string;
  cookingTime?: string;
  servings?: string;
}

interface InteractiveMenuSystemProps {
  onBack?: () => void;
}

const menuData: Record<string, MenuItemProps[]> = {
  soepen: [
    {
      title: "Tomaten Basilicum",
      description:
        "Geserveerd met onze ambachtelijk gebakken broden. Een klassieker met verse basilicum.",
      price: "€ 8,50",
      category: "soepen",
      cookingTime: "15 min",
      servings: "1 persoon",
    },
    {
      title: "Prei & Aardappel",
      description:
        "Rico en roomig gemengd met verse kruiden uit de tuin. Comfort food op zijn best.",
      price: "€ 9,00",
      category: "soepen",
      cookingTime: "20 min",
      servings: "1 persoon",
    },
  ],
  hapjes: [
    {
      title: "Ambachtelijke Kaasplank",
      description:
        "Diverse soorten lokale kazen met zelfgemaakte chutney en versgebakken brood.",
      price: "€ 24,50",
      category: "hapjes",
      servings: "2-3 personen",
    },
    {
      title: "Huisgerookte Ham",
      description:
        "Traditioneel gerookt met eigen kruiden mix. Perfect voor bij de borrel.",
      price: "€ 22,00",
      category: "hapjes",
      servings: "2-3 personen",
    },
  ],
  buffets: [
    {
      title: "Hollandse Bitterballen",
      description:
        "Krokante ragout ballen met huisgemaakte mosterd. Een Nederlandse klassieker.",
      price: "€ 18,50",
      category: "buffets",
      servings: "10 stuks",
    },
  ],
};

const categoryInfo = {
  soepen: {
    name: "Soepen & Warme Happen",
    icon: "🍲",
    color: "bg-terracotta-500",
  },
  hapjes: {
    name: "Ambachtelijke Hapjes",
    icon: "🧀",
    color: "bg-terracotta-600",
  },
  buffets: {
    name: "Buffet Specialiteiten",
    icon: "🎉",
    color: "bg-terracotta-700",
  },
};

export const InteractiveMenuSystem = memo(
  ({ onBack }: InteractiveMenuSystemProps) => {
    const [activeCategory, setActiveCategory] = useState("soepen");
    const [hoveredItem, setHoveredItem] = useState<number | null>(null);

    const handleCategoryChange = useCallback((categoryId: string) => {
      setActiveCategory(categoryId);
    }, []);

    const handleItemHover = useCallback((itemId: number | null) => {
      setHoveredItem(itemId);
    }, []);

    return (
      <section className="py-32 bg-gradient-to-br from-white via-terracotta-50/30 to-white min-h-screen">
        <div className="container mx-auto px-16">
          <div className="max-w-7xl mx-auto">
            {/* Header with back button */}
            <div className="flex items-center justify-between mb-16">
              <Button
                variant="interactive-outline"
                size="elegant-lg"
                onClick={onBack}
                className="group"
              >
                <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform duration-300" />
                <span>Terug naar Overzicht</span>
              </Button>
              <div className="text-center">
                <h2 className="text-terracotta-600 font-elegant-script text-4xl md:text-5xl font-light mb-4">
                  Interactieve Menukaart
                </h2>
                <p className="text-elegant-dark font-elegant-body text-lg">
                  Ontdek onze ambachtelijke specialiteiten
                </p>
              </div>
              <div className="w-48"></div> {/* Spacer for centering */}
            </div>

            {/* Category Navigation */}
            <div className="flex flex-wrap justify-center gap-8 mb-16">
              {Object.entries(categoryInfo).map(([categoryId, info]) => (
                <Button
                  key={categoryId}
                  variant={
                    activeCategory === categoryId
                      ? "interactive-primary"
                      : "interactive-glass"
                  }
                  size="elegant-lg"
                  onClick={() => handleCategoryChange(categoryId)}
                  className="group animate-interactive-bounce hover:animate-none"
                  style={{
                    animationDelay: `${Object.keys(categoryInfo).indexOf(categoryId) * 0.1}s`,
                  }}
                >
                  <span className="text-2xl mr-3">{info.icon}</span>
                  <span className="relative z-10">{info.name}</span>
                </Button>
              ))}
            </div>

            {/* Menu Items Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {menuData[activeCategory]?.map((item, index) => (
                <Card
                  key={index}
                  className="group bg-white/80 backdrop-blur-md border-2 border-terracotta-200/50 hover:border-terracotta-400/70 rounded-3xl overflow-hidden transition-all duration-700 transform hover:scale-105 hover:-translate-y-2 shadow-elegant-soft hover:shadow-elegant-panel cursor-pointer animate-interactive-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onMouseEnter={() => handleItemHover(index)}
                  onMouseLeave={() => handleItemHover(null)}
                >
                  <CardContent className="p-8">
                    {/* Item Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h3 className="text-elegant-dark font-elegant-heading text-xl font-bold mb-2 group-hover:text-terracotta-600 transition-colors duration-500">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-4 text-elegant-grey-500 text-sm mb-4">
                          {item.cookingTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{item.cookingTime}</span>
                            </div>
                          )}
                          {item.servings && (
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{item.servings}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-terracotta-600 font-elegant-heading text-2xl font-bold">
                          {item.price}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-elegant-grey-600 font-elegant-body leading-relaxed mb-6">
                      {item.description}
                    </p>

                    {/* Action Button */}
                    <Button
                      variant="interactive-primary"
                      size="elegant-lg"
                      className="w-full group-hover:animate-interactive-bounce"
                    >
                      <ChefHat className="w-5 h-5 mr-3" />
                      <span className="relative z-10">Bestellen</span>
                    </Button>

                    {/* Hover Glow Effect */}
                    {hoveredItem === index && (
                      <div className="absolute inset-0 bg-gradient-to-br from-terracotta-400/10 via-transparent to-terracotta-400/10 rounded-3xl animate-interactive-pulse-glow pointer-events-none"></div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Call to Action */}
            <div className="text-center mt-16 p-12 bg-gradient-to-r from-terracotta-50 via-white to-terracotta-50 rounded-3xl border border-terracotta-200/50">
              <h3 className="text-elegant-dark font-elegant-heading text-2xl font-bold mb-4">
                Niet gevonden wat u zoekt?
              </h3>
              <p className="text-elegant-grey-600 font-elegant-body text-lg mb-8 max-w-2xl mx-auto">
                Wij maken graag een persoonlijk menu voor uw gelegenheid. Neem
                contact met ons op voor maatwerk catering.
              </p>
              <Button
                variant="interactive-primary"
                size="luxury-xl"
                className="animate-interactive-bounce"
              >
                <span className="relative z-10">
                  Contacteer Ons Voor Maatwerk
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  },
);

// Error Boundary Wrapper Component
export const InteractiveMenuSystemWithBoundary = memo(() => {
  const [showMenu, setShowMenu] = useState(true);

  if (!showMenu) {
    // Fallback to prevent component breaking
    return null;
  }

  return (
    <div className="interactive-menu-system-wrapper">
      <InteractiveMenuSystem onBack={() => setShowMenu(false)} />
    </div>
  );
});

InteractiveMenuSystem.displayName = "InteractiveMenuSystem";
InteractiveMenuSystemWithBoundary.displayName =
  "InteractiveMenuSystemWithBoundary";
