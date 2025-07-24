import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";

export const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [textAnimation, setTextAnimation] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setTimeout(() => setTextAnimation(true), 300);
          }
        });
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Main About Section - Interactive Elegance */}
      <section className="py-32 bg-white overflow-hidden" ref={sectionRef}>
        <div className="container mx-auto px-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center min-h-screen">
              {/* Left Side - Interactive Content */}
              <div className="flex items-center justify-center">
                <div className="max-w-lg text-center group cursor-pointer">
                  <h2
                    className="text-7xl md:text-8xl font-elegant-heading text-elegant-dark mb-20 font-light tracking-[-0.02em] leading-none relative"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible
                        ? "translateY(0)"
                        : "translateY(40px)",
                      transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <span className="text-terracotta-600 inline-block transition-all duration-700 hover:scale-110 hover:-translate-y-2 relative">
                      AMBACHTELIJK
                      <span className="absolute inset-0 blur-3xl bg-terracotta-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></span>
                    </span>
                    <br />
                    <span className="inline-block transition-all duration-700 hover:scale-110 hover:-translate-y-2">
                      EN VERS
                    </span>
                  </h2>

                  <div
                    className="relative w-24 h-px bg-terracotta-600 mx-auto mb-16 overflow-hidden"
                    style={{
                      opacity: textAnimation ? 1 : 0,
                      transition: "opacity 0.8s ease-out 0.4s",
                    }}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-terracotta-400 to-transparent animate-pulse"></span>
                  </div>

                  <p
                    className="text-elegant-dark font-elegant-body text-2xl leading-relaxed font-light transition-all duration-700 group-hover:text-elegant-grey-700"
                    style={{
                      opacity: textAnimation ? 1 : 0,
                      transform: textAnimation
                        ? "translateY(0)"
                        : "translateY(20px)",
                      transition: "all 0.8s ease-out 0.6s",
                    }}
                  >
                    Of u nu een broodjeslunch op de zaak wilt, een BBQ om het
                    seizoen af te sluiten of een buffet om uw verjaardag te
                    vieren. Wij staan voor u klaar!
                  </p>
                </div>
              </div>

              {/* Right Side - Interactive Image */}
              <div className="relative group">
                <div
                  className="h-[800px] bg-cover bg-center bg-no-repeat transition-all duration-1000 transform group-hover:scale-105 rounded-2xl overflow-hidden"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=2074')",
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateX(0)" : "translateX(50px)",
                    transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.2s",
                  }}
                >
                  {/* Interactive gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700"></div>

                  {/* Floating text with interaction */}
                  <div className="absolute inset-0 flex items-end justify-center p-16">
                    <div className="text-center transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700">
                      <h3 className="text-white font-elegant-script text-5xl md:text-6xl mb-4 font-light animate-organic-float">
                        Hopelijk
                        <br />
                        tot ziens!
                      </h3>
                      <div className="relative w-16 h-px bg-white/60 mx-auto overflow-hidden">
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></span>
                      </div>
                    </div>
                  </div>

                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-terracotta-400/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Are We Section - Interactive Elegance */}
      <section id="about" className="py-32 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-16 py-20">
          <div className="max-w-6xl mx-auto text-center">
            <h2
              className="text-8xl md:text-9xl font-elegant-heading text-elegant-dark mb-24 font-light tracking-[-0.02em] relative inline-block group"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible
                  ? "translateY(0) scale(1)"
                  : "translateY(30px) scale(0.95)",
                transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.5s",
              }}
            >
              WIE ZIJN WIJ?
              <span className="absolute inset-0 blur-3xl bg-terracotta-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></span>
            </h2>
            <div
              className="relative w-32 h-px bg-terracotta-600 mx-auto mb-32 overflow-hidden"
              style={{
                opacity: isVisible ? 1 : 0,
                transition: "opacity 0.8s ease-out 0.8s",
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-terracotta-400 to-transparent animate-pulse"></span>
            </div>

            <div
              className="bg-white/90 backdrop-blur-sm p-24 md:p-32 rounded-3xl shadow-elegant-panel hover:shadow-2xl transition-all duration-700 mb-32 group cursor-pointer transform hover:scale-105"
              style={{
                opacity: textAnimation ? 1 : 0,
                transform: textAnimation ? "translateY(0)" : "translateY(40px)",
                transition: "all 1s ease-out 0.9s",
              }}
            >
              {/* Interactive background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-terracotta-50/0 via-terracotta-100/10 to-terracotta-50/0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

              <p className="text-elegant-dark font-elegant-body text-3xl leading-relaxed mb-16 font-light max-w-4xl mx-auto relative z-10 transition-all duration-500 group-hover:text-elegant-grey-700">
                Met passie voor handwerkingsvij bij Wesley's Ambacht sorgen wij
                helesge catering en barbecues als in vroeger ... authentiek en
                ambachtelijke.
              </p>

              <div className="relative w-24 h-px bg-terracotta-600 mx-auto mb-16 overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-terracotta-400 to-transparent animate-pulse"></span>
              </div>

              <p className="text-elegant-dark font-elegant-body text-2xl leading-relaxed font-light max-w-4xl mx-auto relative z-10 transition-all duration-500 group-hover:text-elegant-grey-700">
                Wij steltens de hoogste kwaliteit ingrediënten en lokale
                leveranciers en koupt het puur en en fress voor uu.
              </p>
            </div>

            {/* Interactive Suppliers Section */}
            <div>
              <h3
                className="text-6xl font-elegant-heading text-elegant-dark mb-32 font-light tracking-[-0.02em] relative inline-block"
                style={{
                  opacity: textAnimation ? 1 : 0,
                  transform: textAnimation
                    ? "translateY(0)"
                    : "translateY(30px)",
                  transition: "all 0.8s ease-out 1.2s",
                }}
              >
                ONZE LEVERANCIERS
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
                {[
                  {
                    name: "KAASBOERDERIJ",
                    subtitle: "VAN SCHAIK",
                    delay: "1.4s",
                  },
                  {
                    name: "BAKKERIJ",
                    subtitle: "VAN HARBERDEN",
                    delay: "1.5s",
                  },
                  { name: "VISHANDEL", subtitle: "SPERLING", delay: "1.6s" },
                ].map((supplier, index) => (
                  <div
                    key={supplier.name}
                    className="text-center group cursor-pointer"
                    style={{
                      opacity: textAnimation ? 1 : 0,
                      transform: textAnimation
                        ? "translateY(0)"
                        : "translateY(20px)",
                      transition: `all 0.8s ease-out ${supplier.delay}`,
                    }}
                  >
                    <div className="relative p-8 rounded-2xl transition-all duration-500 hover:bg-terracotta-50/50 transform hover:scale-110 hover:-translate-y-2">
                      {/* Glow effect */}
                      <div className="absolute inset-0 rounded-2xl bg-terracotta-300/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                      <h4 className="text-2xl font-elegant-heading text-terracotta-600 font-light tracking-wide transition-all duration-500 group-hover:text-terracotta-700 relative z-10">
                        {supplier.name}
                        <br />
                        {supplier.subtitle}
                      </h4>

                      {/* Interactive underline */}
                      <div className="w-0 h-0.5 bg-terracotta-600 mx-auto mt-4 transition-all duration-500 group-hover:w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
