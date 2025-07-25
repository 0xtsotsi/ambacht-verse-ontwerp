import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Phone, Mail, Instagram, Facebook, Star, Award } from "lucide-react";

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
        backgroundImage: `url('/attached_assets/1000005907_1753439577476.jpg')`,
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
            Ambachtelijk en vers... zoals vroeger. Wij zijn Wesley en Marjoleine Kreeft, beiden met een mooi horecaverleden. Wesley's Ambacht staat voor vers en zo min mogelijk E-nummers. Of u nou een broodjeslunch op de zaak wilt, een BBQ om het seizoen af te sluiten of een Buffet om uw verjaardag te vieren - wij staan voor u klaar!
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

      {/* Contact Info at Bottom */}
      <div className="absolute bottom-6 left-6 text-white flex items-center space-x-3 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 group hover:bg-[#FF6B35]/80 transition-all duration-300">
        <Phone className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
        <span className="text-lg font-semibold">06 212 226 58</span>
      </div>


    </section>
  );
};