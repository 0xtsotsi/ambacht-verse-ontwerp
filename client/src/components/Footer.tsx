import { Heart, Phone, Mail, MapPin } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const footerRef = useRef<HTMLDivElement>(null);

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

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer className="bg-gray-900 text-white overflow-hidden" ref={footerRef}>
      {/* Interactive Main Footer */}
      <div className="container mx-auto px-16 py-32 relative">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/95 to-gray-900/90 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-24">
            {/* Interactive Brand Column */}
            <div
              className="md:col-span-2 group cursor-pointer"
              onMouseEnter={() => setHoveredSection("brand")}
              onMouseLeave={() => setHoveredSection(null)}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(30px)",
                transition: "all 1s ease-out",
              }}
            >
              <div className="mb-16">
                <h3 className="font-elegant-heading text-4xl font-light text-white mb-4 transition-all duration-700 group-hover:text-terracotta-600 relative inline-block">
                  Wesley's Ambacht
                  <span className="absolute inset-0 blur-3xl bg-terracotta-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></span>
                </h3>
                <p className="text-gray-400 font-elegant-script text-xl font-light transition-all duration-500 group-hover:text-gray-300">
                  Ambachtelijk en vers... zoals vroeger
                </p>
              </div>

              <p className="text-gray-300 leading-relaxed mb-16 max-w-lg text-lg font-elegant-body font-light transition-all duration-700 group-hover:text-white transform group-hover:translate-x-2">
                Wij zijn Wesley en Marjoleine Kreeft, beiden met een mooi horecaverleden. 
                Wesley's Ambacht staat voor vers en zo min mogelijk E-nummers. 
                Van broodjeslunch tot BBQ events - altijd ambachtelijk en vers, zoals vroeger.
              </p>

              <div className="flex items-center space-x-4 transition-all duration-500 group-hover:scale-105">
                <Heart className="w-5 h-5 text-terracotta-600 animate-pulse" />
                <span className="text-gray-400 font-elegant-body font-light group-hover:text-terracotta-200 transition-colors duration-500">
                  Gemaakt met liefde in Nederland
                </span>
              </div>
            </div>

            {/* Interactive Contact Column */}
            <div
              className="group"
              onMouseEnter={() => setHoveredSection("contact")}
              onMouseLeave={() => setHoveredSection(null)}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(30px)",
                transition: "all 1.2s ease-out 0.2s",
              }}
            >
              <h4 className="font-elegant-heading text-2xl font-light mb-12 text-white transition-all duration-700 group-hover:text-terracotta-600">
                Contact
              </h4>
              <div className="space-y-8">
                {[
                  { icon: Phone, text: "06 212 226 58" },
                  { icon: Mail, text: "info@ambachtbijwesley.nl" },
                  { icon: MapPin, text: "Nieuweweg 79, 3251 AS Stellendam", mt: true },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 transition-all duration-500 hover:translate-x-2 hover:scale-105 group/item cursor-pointer"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      animation:
                        hoveredSection === "contact"
                          ? "elegant-fade-in 0.6s ease-out forwards"
                          : "none",
                    }}
                  >
                    <item.icon
                      className={`w-5 h-5 text-terracotta-600 transition-all duration-500 group-hover/item:scale-125 ${item.mt ? "mt-0.5" : ""}`}
                    />
                    <span className="text-gray-300 font-elegant-body font-light group-hover/item:text-white transition-colors duration-500">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Services Column */}
            <div
              className="group"
              onMouseEnter={() => setHoveredSection("services")}
              onMouseLeave={() => setHoveredSection(null)}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(30px)",
                transition: "all 1.4s ease-out 0.4s",
              }}
            >
              <h4 className="font-elegant-heading text-2xl font-light mb-12 text-white transition-all duration-700 group-hover:text-terracotta-600">
                Onze Diensten
              </h4>
              <ul className="space-y-6">
                {[
                  "Broodjes Lunch",
                  "BBQ Catering",
                  "Familiedagen",
                  "Buffet Services", 
                  "Corporate Events",
                ].map((service, index) => (
                  <li
                    key={service}
                    className="text-gray-300 hover:text-terracotta-600 transition-all duration-500 cursor-pointer font-elegant-body font-light transform hover:translate-x-2 hover:scale-105 relative group/service"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      animation:
                        hoveredSection === "services"
                          ? "elegant-fade-in 0.6s ease-out forwards"
                          : "none",
                    }}
                  >
                    <span className="relative z-10">{service}</span>
                    <span className="absolute inset-0 bg-terracotta-600/10 rounded-lg opacity-0 group-hover/service:opacity-100 transition-opacity duration-500 transform scale-0 group-hover/service:scale-110"></span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Interactive Separator */}
          <div
            className="relative w-full h-px bg-gray-800 my-24 overflow-hidden"
            style={{
              opacity: isVisible ? 1 : 0,
              transition: "opacity 1.5s ease-out 0.6s",
            }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-terracotta-600 to-transparent animate-pulse"></span>
          </div>

          {/* Interactive Partners Section */}
          <div
            className="text-center mb-24"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transition: "all 1.6s ease-out 0.8s",
            }}
          >
            <h4 className="font-elegant-heading text-3xl font-light mb-16 text-white relative inline-block group">
              Onze Partners
              <span className="absolute inset-0 blur-3xl bg-terracotta-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></span>
            </h4>
            <div className="flex flex-wrap justify-center items-center gap-16 text-gray-400">
              {[
                "Kaasboerderij van Schaik",
                "Bakkerij van Harberden",
                "Vishandel Sperling",
              ].map((partner, index) => (
                <span
                  key={partner}
                  className="font-elegant-body font-light hover:text-terracotta-600 transition-all duration-500 cursor-pointer transform hover:scale-110 hover:-translate-y-1 relative group"
                  style={{
                    animationDelay: `${index * 0.2}s`,
                    animation: isVisible
                      ? "elegant-fade-in 1s ease-out forwards"
                      : "none",
                  }}
                >
                  <span className="relative z-10">{partner}</span>
                  <span className="absolute inset-0 bg-terracotta-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Bottom Bar */}
      <div className="border-t border-gray-800 py-16 bg-black/90 backdrop-blur-sm">
        <div className="container mx-auto px-16">
          <div
            className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-gray-400 font-elegant-body"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transition: "all 1.8s ease-out 1s",
            }}
          >
            <div className="mb-6 md:mb-0 font-light transition-all duration-500 hover:text-white">
              © 2024 Wesley's Ambacht. Alle rechten voorbehouden.
            </div>
            <div className="flex space-x-12">
              {["Privacy Beleid", "Algemene Voorwaarden", "Cookies"].map(
                (link, index) => (
                  <span
                    key={link}
                    className="hover:text-terracotta-600 transition-all duration-500 cursor-pointer font-light transform hover:scale-110 hover:-translate-y-0.5 relative group"
                  >
                    <span className="relative z-10">{link}</span>
                    <span className="absolute inset-0 bg-terracotta-600/10 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
