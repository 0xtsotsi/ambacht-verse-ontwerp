
import { Button } from "@/components/ui/button";
import { ChefHat, Flame } from "lucide-react";

export const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with meat imagery style */}
      <div className="absolute inset-0 bg-gradient-to-br from-natural-brown/20 via-deep-teal/10 to-forest-green/20"></div>
      <div className="absolute inset-0 rustic-pattern opacity-30"></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-forest-green/10 border border-forest-green/20 rounded-full mb-6">
            <ChefHat className="w-4 h-4 text-forest-green mr-2" />
            <span className="text-forest-green font-medium text-sm">Ambachtelijke Catering Specialist</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-serif text-forest-green mb-6 leading-tight">
            Wesley's
            <span className="block text-burnt-orange font-script text-6xl md:text-8xl -mt-2">
              Ambacht
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-natural-brown mb-4 font-light">
            Ambachtelijk en vers... zoals vroeger
          </p>

          {/* Description */}
          <p className="text-lg text-forest-green/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Van handgemaakte broodjes tot perfecte BBQ-ervaringen. Wij brengen de authentieke smaak van 
            traditioneel vakmanschap naar uw evenement, met de service die u verdient.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-burnt-orange hover:bg-burnt-orange/90 text-clean-white px-8 py-6 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Flame className="w-5 h-5 mr-2" />
              Bekijk Onze Diensten
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-forest-green text-forest-green hover:bg-forest-green hover:text-warm-cream px-8 py-6 text-lg font-semibold rounded-lg transition-all duration-300"
            >
              Galerij Bekijken
            </Button>
          </div>

          {/* Quick Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center p-4 bg-clean-white/50 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-serif text-forest-green font-bold">15+</div>
              <div className="text-natural-brown">Jaar Ervaring</div>
            </div>
            <div className="text-center p-4 bg-clean-white/50 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-serif text-forest-green font-bold">500+</div>
              <div className="text-natural-brown">Tevreden Klanten</div>
            </div>
            <div className="text-center p-4 bg-clean-white/50 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-serif text-forest-green font-bold">100%</div>
              <div className="text-natural-brown">Lokale Ingrediënten</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-warm-cream to-transparent"></div>
    </section>
  );
};
