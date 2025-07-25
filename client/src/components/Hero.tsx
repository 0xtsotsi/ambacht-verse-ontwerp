import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

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
        backgroundImage: `url('https://images.unsplash.com/photo-1576867757603-05b134ebc379?q=80&w=2070')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark Overlay */}
      <div className="hero-overlay" />

      {/* Main Content */}
      <div className={`relative z-10 text-center text-white px-4 transition-all duration-1000 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Script Welcome Text */}
          <p className="text-script mb-4">Welcome to</p>

          {/* Main Title */}
          <h1 className="text-display text-white mb-6">
            WESLEY'S AMBACHT
          </h1>

          {/* Subtitle */}
          <p className="text-body max-w-2xl mx-auto text-white/90 leading-relaxed mb-8">
            Van het handmatig selecteren van onze eigen producten rechtstreeks van de Oosterse markten tot het maken van onze eigen saladedressing, Wesley's doet alles op de oude manier! Bij Wesley's garanderen we dat je zult genieten van ons uitstekende eten, professionele service en concurrerende prijzen.
          </p>

          {/* CTA Button */}
          <Button
            className="btn-primary text-lg"
            onClick={() => scrollToSection('contact')}
          >
            Contact Us
          </Button>
        </div>
      </div>

      {/* Phone Number at Bottom */}
      <div className="absolute bottom-6 left-6 text-white flex items-center space-x-2">
        <span className="text-lg font-semibold">06 212 226 58</span>
      </div>
    </section>
  );
};