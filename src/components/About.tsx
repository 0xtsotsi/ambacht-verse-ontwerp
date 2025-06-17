
import { Award, Heart, Users } from "lucide-react";

export const About = () => {
  return (
    <section id="about" className="py-20 bg-clean-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-forest-green mb-4">
              Welkom bij Wesley's Ambacht
            </h2>
            <div className="w-24 h-1 bg-burnt-orange mx-auto mb-6"></div>
            <p className="text-xl text-natural-brown max-w-3xl mx-auto">
              Wat leuk dat u een bezoekje op de website neemt! 
              Neem eens een kijkje in de galerij wat wij afgelopen jaar allemaal mochten realiseren.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Text Content */}
            <div className="space-y-6">
              <h3 className="text-2xl font-serif text-forest-green mb-4">
                Ons Verhaal
              </h3>
              <p className="text-natural-brown leading-relaxed">
                Wesley's Ambacht staat voor traditioneel vakmanschap met een moderne touch. 
                Sinds jaar en dag zijn wij gespecialiseerd in het leveren van authentieke, 
                ambachtelijke catering die de smaak van vroeger terugbrengt.
              </p>
              <p className="text-natural-brown leading-relaxed">
                Of u nou een broodjeslunch op de zaak wilt, een BBQ om het seizoen af te sluiten 
                of een Buffet om uw verjaardag te vieren. Wij staan voor u klaar!
              </p>
              <p className="text-natural-brown leading-relaxed">
                Kijk eens rustig rond om inspiratie op te doen. Gebruik het contactformulier 
                als u contact met ons wilt opnemen.
              </p>
            </div>

            {/* Image Placeholder with Rustic Styling */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-beige to-natural-brown/20 rounded-lg overflow-hidden rustic-pattern">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 bg-forest-green rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-12 h-12 text-warm-cream" />
                    </div>
                    <h4 className="text-xl font-serif text-forest-green mb-2">Met Liefde Gemaakt</h4>
                    <p className="text-natural-brown">Elke maaltijd wordt bereid met passie en vakmanschap</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-warm-cream rounded-lg">
              <div className="w-16 h-16 bg-forest-green rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-warm-cream" />
              </div>
              <h4 className="text-xl font-serif text-forest-green mb-3">Kwaliteit</h4>
              <p className="text-natural-brown">
                Alleen de beste ingrediënten van lokale leveranciers voor de authentieke smaak
              </p>
            </div>

            <div className="text-center p-6 bg-warm-cream rounded-lg">
              <div className="w-16 h-16 bg-burnt-orange rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-clean-white" />
              </div>
              <h4 className="text-xl font-serif text-forest-green mb-3">Passie</h4>
              <p className="text-natural-brown">
                Elke maaltijd wordt bereid met dezelfde liefde en aandacht als voor eigen familie
              </p>
            </div>

            <div className="text-center p-6 bg-warm-cream rounded-lg">
              <div className="w-16 h-16 bg-deep-teal rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-clean-white" />
              </div>
              <h4 className="text-xl font-serif text-forest-green mb-3">Service</h4>
              <p className="text-natural-brown">
                Persoonlijke service en maatwerk voor elk evenement, groot of klein
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
