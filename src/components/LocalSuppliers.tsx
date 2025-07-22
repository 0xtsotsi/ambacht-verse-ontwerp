import { Badge } from "@/components/ui/badge";
import { Leaf, MapPin, Heart } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export const LocalSuppliers = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const suppliers = [
    {
      name: "Kaasboerderij van Schaik",
      specialty: "Ambachtelijke kazen",
      location: "Gelderland",
      badge: "Biologisch",
      description: "Al generaties lang traditionele kaasproductie",
    },
    {
      name: "Bakkerij van Harberden",
      specialty: "Vers brood & gebak",
      location: "Overijssel",
      badge: "Dagvers",
      description: "Handgemaakt brood volgens eeuwenoude recepten",
    },
    {
      name: "Vishandel Sperling",
      specialty: "Verse vis & zeevruchten",
      location: "Noordzee",
      badge: "Duurzaam",
      description: "Direct van de boot naar uw bord",
    },
  ];

  return (
    <section
      className="py-32 bg-gradient-to-b from-gray-50 to-white overflow-hidden relative"
      ref={sectionRef}
    >
      {/* Interactive background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-96 h-96 bg-terracotta-100/20 rounded-full blur-3xl animate-organic-float"
            style={{
              left: `${20 + i * 30}%`,
              top: `${10 + i * 25}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${15 + i * 5}s`,
              transform: `translate(${mousePosition.x * (i + 1) * 0.5}px, ${mousePosition.y * (i + 1) * 0.5}px)`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* V5 Interactive Section Header */}
          <div className="text-center mb-24">
            <div
              className="inline-flex items-center px-6 py-3 bg-terracotta-100/50 backdrop-blur-sm border border-terracotta-300/50 rounded-full mb-12 transition-all duration-700 hover:bg-terracotta-200/60 hover:scale-110 hover:shadow-elegant-soft group cursor-pointer"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.8s ease-out",
              }}
            >
              <Leaf className="w-5 h-5 text-terracotta-600 mr-3 transition-transform duration-500 group-hover:rotate-12" />
              <span className="text-terracotta-700 font-elegant-body font-medium">
                Lokale Samenwerking
              </span>
            </div>

            <h2
              className="text-7xl md:text-8xl font-elegant-heading text-elegant-dark mb-12 font-light tracking-[-0.02em] relative inline-block group"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? "translateY(0) scale(1)"
                  : "translateY(40px) scale(0.95)",
                transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.2s",
              }}
            >
              <span className="inline-block transition-all duration-700 hover:scale-110 hover:-translate-y-2">
                ONZE
              </span>{" "}
              <span className="text-terracotta-600 inline-block transition-all duration-700 hover:scale-110 hover:-translate-y-2 relative">
                TROUWE
                <span className="absolute inset-0 blur-3xl bg-terracotta-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></span>
              </span>
              <br />
              <span className="inline-block transition-all duration-700 hover:scale-110 hover:-translate-y-2">
                PARTNERS
              </span>
            </h2>

            <div
              className="relative w-32 h-px bg-terracotta-600 mx-auto mb-12 overflow-hidden"
              style={{
                opacity: isVisible ? 1 : 0,
                transition: "opacity 0.8s ease-out 0.6s",
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-terracotta-400 to-transparent animate-pulse"></span>
            </div>

            <p
              className="text-2xl text-elegant-dark font-elegant-body font-light max-w-3xl mx-auto leading-relaxed"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.8s ease-out 0.8s",
              }}
            >
              Kwaliteit begint bij de bron. Daarom werken wij samen met de beste
              lokale leveranciers die net als wij geloven in ambachtelijkheid en
              vers, duurzaam voedsel.
            </p>
          </div>

          {/* V5 Interactive Suppliers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24">
            {suppliers.map((supplier, index) => (
              <div
                key={index}
                className="group cursor-pointer"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateY(0)" : "translateY(40px)",
                  transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${1 + index * 0.2}s`,
                }}
              >
                <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-10 h-full hover:bg-white hover:shadow-elegant-panel transition-all duration-700 transform hover:scale-105 hover:-translate-y-3 border border-terracotta-200/30 overflow-hidden">
                  {/* V5 Interactive Badge */}
                  <div className="flex justify-between items-start mb-6">
                    <Badge className="bg-terracotta-600 text-white px-4 py-2 font-elegant-body font-medium transition-all duration-500 hover:bg-terracotta-700 hover:scale-110 hover:shadow-elegant-button">
                      {supplier.badge}
                    </Badge>
                    <div className="flex items-center text-elegant-grey-600 text-sm font-elegant-body transition-all duration-500 group-hover:text-terracotta-600">
                      <MapPin className="w-4 h-4 mr-2 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12" />
                      {supplier.location}
                    </div>
                  </div>

                  {/* V5 Interactive Content */}
                  <h3 className="text-2xl font-elegant-heading text-elegant-dark mb-3 font-light transition-all duration-500 group-hover:text-terracotta-600">
                    {supplier.name}
                  </h3>
                  <p className="text-terracotta-600 font-elegant-body font-medium mb-4 text-lg transition-all duration-500 group-hover:text-terracotta-700">
                    {supplier.specialty}
                  </p>
                  <p className="text-elegant-grey-700 font-elegant-body font-light leading-relaxed transition-all duration-500 group-hover:text-elegant-dark">
                    {supplier.description}
                  </p>

                  {/* V5 Interactive Quality Indicator */}
                  <div className="mt-8 pt-6 border-t border-terracotta-200/50">
                    <div className="flex items-center text-elegant-grey-600 text-sm font-elegant-body font-light transition-all duration-500 group-hover:text-terracotta-600">
                      <Heart className="w-5 h-5 mr-3 text-terracotta-600 transition-all duration-500 group-hover:scale-125 animate-pulse" />
                      <span>Vertrouwde kwaliteit sinds jaren</span>
                    </div>
                  </div>

                  {/* Interactive background effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-terracotta-50/0 via-terracotta-100/10 to-terracotta-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div
                    className="absolute inset-0 -top-full -bottom-full bg-gradient-to-r from-transparent via-white/20 to-transparent w-full animate-interactive-shimmer opacity-0 group-hover:opacity-100"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  ></div>

                  {/* Floating particles */}
                  {hoveredCard === index && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 bg-terracotta-400/30 rounded-full animate-organic-float"
                          style={{
                            left: `${20 + i * 30}%`,
                            top: `${20 + i * 25}%`,
                            animationDelay: `${i * 0.3}s`,
                            animationDuration: `${2 + i * 0.5}s`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* V5 Interactive Sustainability Statement */}
          <div
            className="relative bg-gradient-to-br from-elegant-dark via-gray-800 to-elegant-dark rounded-3xl p-12 md:p-20 text-center overflow-hidden group cursor-pointer transform transition-all duration-700 hover:scale-105 hover:shadow-2xl"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(40px)",
              transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1) 1.6s",
            }}
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-terracotta-600/10 via-transparent to-terracotta-600/10 animate-pulse"></div>

            {/* Interactive glow effect */}
            <div className="absolute inset-0 bg-terracotta-400/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

            <div className="max-w-3xl mx-auto relative z-10">
              <div className="w-20 h-20 bg-terracotta-600 rounded-full flex items-center justify-center mx-auto mb-10 transition-all duration-700 group-hover:scale-125 group-hover:rotate-12 group-hover:bg-terracotta-500 shadow-elegant-button group-hover:shadow-elegant-button-hover">
                <Leaf className="w-10 h-10 text-white transition-transform duration-700 group-hover:scale-125 group-hover:rotate-[-12deg]" />
              </div>

              <h3 className="text-5xl md:text-6xl font-elegant-heading text-white mb-8 font-light tracking-[-0.02em] transition-all duration-700 group-hover:scale-105">
                <span className="inline-block transition-all duration-700 hover:scale-110 hover:-translate-y-1">
                  Minimale E-nummers,
                </span>
                <br />
                <span className="text-terracotta-400 inline-block transition-all duration-700 hover:scale-110 hover:-translate-y-1">
                  Maximale Smaak
                </span>
              </h3>

              <p className="text-white/80 font-elegant-body text-xl leading-relaxed mb-12 font-light transition-all duration-700 group-hover:text-white">
                Wij geloven in eerlijk eten. Daarom kiezen wij bewust voor
                ingrediënten met minimale toevoegingen en maximale smaak. Wat de
                natuur ons geeft, is vaak het beste.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
                <div className="text-center transform transition-all duration-500 hover:scale-110 hover:-translate-y-2 group/stat">
                  <div className="text-6xl font-elegant-heading text-terracotta-400 mb-3 font-light animate-interactive-pulse-glow">
                    95%
                  </div>
                  <div className="text-white/70 font-elegant-body font-light transition-all duration-500 group-hover/stat:text-white">
                    Lokale Ingrediënten
                  </div>
                </div>
                <div
                  className="text-center transform transition-all duration-500 hover:scale-110 hover:-translate-y-2 group/stat"
                  style={{ animationDelay: "0.2s" }}
                >
                  <div
                    className="text-6xl font-elegant-heading text-terracotta-400 mb-3 font-light animate-interactive-pulse-glow"
                    style={{ animationDelay: "0.4s" }}
                  >
                    0
                  </div>
                  <div className="text-white/70 font-elegant-body font-light transition-all duration-500 group-hover/stat:text-white">
                    Kunstmatige Kleurstoffen
                  </div>
                </div>
                <div
                  className="text-center transform transition-all duration-500 hover:scale-110 hover:-translate-y-2 group/stat"
                  style={{ animationDelay: "0.4s" }}
                >
                  <div
                    className="text-6xl font-elegant-heading text-terracotta-400 mb-3 font-light animate-interactive-pulse-glow"
                    style={{ animationDelay: "0.8s" }}
                  >
                    100%
                  </div>
                  <div className="text-white/70 font-elegant-body font-light transition-all duration-500 group-hover/stat:text-white">
                    Verse Bereiding
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
