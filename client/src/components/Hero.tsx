import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Phone, Instagram, Facebook, ChevronDown } from "lucide-react";
import heroImage from "@assets/1000005907_1753439577476.jpg";

export const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark Overlay - matching Soprano's style */}
      <div className="hero-overlay" />

      {/* Main Content - exactly like Soprano's layout */}
      <div className={`relative z-10 text-center text-white px-4 transition-all duration-1000 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Script Welcome Text - golden color like Soprano's */}
          <p className="text-script mb-4" style={{ color: '#D4AF37', fontSize: '2.5rem' }}>
            Welkom bij
          </p>

          {/* Main Title - bold white like Soprano's */}
          <h1 className="text-white mb-6" style={{ 
            fontSize: '4.5rem', 
            fontWeight: '900', 
            lineHeight: '1.1',
            fontFamily: 'Playfair Display, serif',
            textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
            letterSpacing: '0.02em'
          }}>
            WESLEY'S AMBACHT
          </h1>

          {/* Subtitle - matching Soprano's paragraph style */}
          <p className="max-w-2xl mx-auto text-white leading-relaxed mb-8" style={{
            fontSize: '1.1rem',
            fontFamily: 'Open Sans, sans-serif',
            fontWeight: '400',
            lineHeight: '1.6',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          }}>
            Van handmatig selecteren van onze eigen producten rechtstreeks van de lokale markt, tot het maken van onze eigen saladedressing - Wesley's Ambacht doet alles op de ambachtelijke manier. Bij Wesley's Ambacht garanderen wij dat u zult genieten van ons uitstekende eten, professionele service en concurrerende prijzen.
          </p>

          {/* CTA Button - matching Soprano's orange button */}
          <Button
            className="px-8 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #E86C32 0%, #FF6B35 100%)',
              border: 'none',
              fontFamily: 'Open Sans, sans-serif'
            }}
            onClick={() => scrollToSection('contact')}
          >
            Contact Ons
          </Button>
        </div>
      </div>

      {/* Phone number - bottom left like Soprano's */}
      <div className="absolute bottom-8 left-8 text-white flex items-center space-x-3 bg-black/40 backdrop-blur-sm rounded-full px-6 py-3 group hover:bg-[#E86C32]/90 transition-all duration-300">
        <Phone className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
        <span className="text-lg font-semibold" style={{ fontFamily: 'Open Sans, sans-serif' }}>
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

      {/* Scroll Arrow - exact Soprano's style */}
      <div 
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer group animate-bounce"
        onClick={() => {
          const servicesSection = document.querySelector('[data-section="services"]');
          if (servicesSection) {
            servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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