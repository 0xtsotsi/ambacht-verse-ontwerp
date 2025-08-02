import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Phone, Instagram, Facebook, ChevronDown } from "lucide-react";
import { ScrollIndicator } from "./LuxuryAnimations";
import heroImage from "@assets/1000005907_1753439577476.jpg";

export const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark Overlay - matching Soprano's style */}
      <div className="hero-overlay" />

      {/* Main Content - exactly like Soprano's layout */}
      <div
        className={`relative z-10 text-center text-white px-4 transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Script Text - exactly like Soprano's "Welcome to" */}
          <p
            className="text-script mb-4"
            style={{
              color: "#D4AF37",
              fontSize: "3.5rem",
              fontFamily: "var(--font-script)",
              fontWeight: "400",
            }}
          >
            Welkom bij
          </p>

          {/* Main Title - exactly like Soprano's "SOPRANO'S CATERING" */}
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white tracking-wider"
            style={{
              fontFamily: "var(--font-heading)",
              textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
              letterSpacing: "0.1em",
              fontWeight: "700",
            }}
          >
            WESLEY'S AMBACHT CATERING
          </h1>

          {/* Description - matching Soprano's exact style */}
          <p
            className="max-w-3xl mx-auto text-lg md:text-xl text-white leading-relaxed mb-10"
            style={{
              fontFamily: "var(--font-body)",
              textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
              fontWeight: "400",
              lineHeight: "1.7",
            }}
          >
            Van het handmatig selecteren van onze eigen producten rechtstreeks
            van de lokale markt, tot het maken van onze eigen salades en
            dressings, Wesley's Ambacht doet alles op de oude manier! Bij
            Wesley's Ambacht garanderen we dat u zult genieten van ons
            uitstekende eten, professionele service en concurrerende prijzen.
          </p>

          {/* CTA Button - exact match to Soprano's "Contact Us" button */}
          <Button
            className="px-10 py-4 rounded-full text-white font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 border-transparent hover:border-white/20"
            style={{
              background: "#E86C32",
              fontFamily: "var(--font-body)",
              fontWeight: "700",
              letterSpacing: "0.02em",
            }}
            onClick={() => scrollToSection("contact")}
          >
            Contact Ons
          </Button>
        </div>
      </div>

      {/* Phone number - bottom left like Soprano's */}
      <div className="absolute bottom-8 left-8 text-white flex items-center space-x-3 bg-black/40 backdrop-blur-sm rounded-full px-6 py-3 group hover:bg-[#E86C32]/90 transition-all duration-300">
        <Phone className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
        <span
          className="text-lg font-semibold"
          style={{ fontFamily: "var(--font-body)" }}
        >
          06 212 226 58
        </span>
      </div>

      {/* Social media icons - bottom right like Soprano's */}
      <div className="absolute bottom-8 right-8 flex space-x-4">
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-[#E86C32]/90 transition-all duration-300 cursor-pointer group">
          <Facebook className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
        </div>
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-[#E86C32]/90 transition-all duration-300 cursor-pointer group">
          <Instagram className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
        </div>
      </div>

      {/* Scroll Arrow - mathematically perfect centering */}
      <div
        className="absolute z-20 cursor-pointer group animate-bounce"
        style={{
          bottom: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
        }}
        onClick={() => {
          const servicesSection = document.querySelector(
            '[data-section="services"]',
          );
          if (servicesSection) {
            servicesSection.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }}
      >
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 shadow-lg group-hover:scale-110">
          <ChevronDown className="w-6 h-6 text-white group-hover:text-[#E86C32] transition-colors duration-300" />
        </div>
      </div>
    </section>
  );
};