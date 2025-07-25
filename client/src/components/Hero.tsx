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
      className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1576867757603-05b134ebc379?q=80&w=2070')`,
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-card/60 to-background/80" />

      {/* Main Content */}
      <div className={`relative z-10 container-main text-center transition-all duration-1000 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="space-y-8">
          {/* Welcome text */}
          <p className="text-body text-accent-orange font-medium tracking-wide">
            Welkom bij
          </p>

          {/* Main title */}
          <h1 className="text-display text-charcoal leading-tight">
            Wesley's 
            <span className="text-accent-orange"> Ambacht</span>
          </h1>

          {/* Decorative line */}
          <div className="w-16 h-0.5 bg-accent-orange mx-auto" />

          {/* Subtitle */}
          <p className="text-heading text-charcoal max-w-3xl mx-auto leading-relaxed">
            Wij proberen ons op een ieder te richten!<br />
            Kijk eens rustig rond om inspiratie op te doen.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
            <Button
              className="btn-primary"
              onClick={() => scrollToSection('contact')}
            >
              Contacteer Ons
            </Button>

            <Button
              className="btn-secondary"
              onClick={() => scrollToSection('services')}
            >
              Onze Services
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};