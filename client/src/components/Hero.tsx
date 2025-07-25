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

      {/* Phone Number at Bottom */}
      <div className="absolute bottom-6 left-6 text-white flex items-center space-x-3 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 group hover:bg-orange-500/80 transition-all duration-300">
        <Phone className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
        <span className="text-lg font-semibold">06 212 226 58</span>
      </div>

      {/* Social Icons at Bottom Right */}
      <div className="absolute bottom-6 right-6 flex space-x-4">
        <a href="mailto:info@ambachtbijwesley.nl" className="text-white hover:text-orange-400 transition-all duration-300 bg-black/30 backdrop-blur-sm rounded-full p-3 group hover:bg-orange-500/80">
          <Mail className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
        </a>
        <a href="#" className="text-white hover:text-blue-400 transition-all duration-300 bg-black/30 backdrop-blur-sm rounded-full p-3 group hover:bg-blue-500/80">
          <Facebook className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
        </a>
        <a href="#" className="text-white hover:text-pink-400 transition-all duration-300 bg-black/30 backdrop-blur-sm rounded-full p-3 group hover:bg-pink-500/80">
          <Instagram className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
        </a>
      </div>

      {/* Quality Badges */}
      <div className="absolute top-6 right-6 flex flex-col space-y-3">
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full px-4 py-2 flex items-center space-x-2 shadow-lg animate-pulse">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm font-semibold">Premium Kwaliteit</span>
        </div>
        <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full px-4 py-2 flex items-center space-x-2 shadow-lg animate-pulse">
          <Award className="w-4 h-4 fill-current" />
          <span className="text-sm font-semibold">Ambachtelijk</span>
        </div>
      </div>
    </section>
  );
};