
import { Badge } from "@/components/ui/badge";
import { Leaf, MapPin, Heart } from "lucide-react";

export const LocalSuppliers = () => {
  const suppliers = [
    {
      name: "Kaasboerderij van Schaik",
      specialty: "Ambachtelijke kazen",
      location: "Gelderland",
      badge: "Biologisch",
      description: "Al generaties lang traditionele kaasproductie"
    },
    {
      name: "Bakkerij van Harberden", 
      specialty: "Vers brood & gebak",
      location: "Overijssel",
      badge: "Dagvers",
      description: "Handgemaakt brood volgens eeuwenoude recepten"
    },
    {
      name: "Vishandel Sperling",
      specialty: "Verse vis & zeevruchten",
      location: "Noordzee",
      badge: "Duurzaam",
      description: "Direct van de boot naar uw bord"
    }
  ];

  return (
    <section className="py-20 bg-clean-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-forest-green/10 border border-forest-green/20 rounded-full mb-6">
              <Leaf className="w-4 h-4 text-forest-green mr-2" />
              <span className="text-forest-green font-medium text-sm">Lokale Samenwerking</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-forest-green mb-4">
              Onze Trouwe Partners
            </h2>
            <div className="w-24 h-1 bg-burnt-orange mx-auto mb-6"></div>
            <p className="text-xl text-natural-brown max-w-3xl mx-auto">
              Kwaliteit begint bij de bron. Daarom werken wij samen met de beste lokale leveranciers 
              die net als wij geloven in ambachtelijkheid en vers, duurzaam voedsel.
            </p>
          </div>

          {/* Suppliers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {suppliers.map((supplier, index) => (
              <div key={index} className="group">
                <div className="bg-warm-cream rounded-lg p-6 h-full hover:shadow-lg transition-all duration-300 wood-texture">
                  {/* Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <Badge className="bg-forest-green text-warm-cream px-3 py-1">
                      {supplier.badge}
                    </Badge>
                    <div className="flex items-center text-natural-brown text-sm">
                      <MapPin className="w-3 h-3 mr-1" />
                      {supplier.location}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-serif text-forest-green mb-2 group-hover:text-burnt-orange transition-colors">
                    {supplier.name}
                  </h3>
                  <p className="text-burnt-orange font-medium mb-3">
                    {supplier.specialty}
                  </p>
                  <p className="text-natural-brown text-sm leading-relaxed">
                    {supplier.description}
                  </p>

                  {/* Quality Indicator */}
                  <div className="mt-6 pt-4 border-t border-beige">
                    <div className="flex items-center text-forest-green text-sm">
                      <Heart className="w-4 h-4 mr-2 text-burnt-orange" />
                      <span>Vertrouwde kwaliteit sinds jaren</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sustainability Statement */}
          <div className="bg-forest-green rounded-xl p-8 md:p-12 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="w-16 h-16 bg-warm-cream rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf className="w-8 h-8 text-forest-green" />
              </div>
              <h3 className="text-2xl md:text-3xl font-serif text-warm-cream mb-4">
                Minimale E-nummers, Maximale Smaak
              </h3>
              <p className="text-warm-cream/90 text-lg leading-relaxed mb-6">
                Wij geloven in eerlijk eten. Daarom kiezen wij bewust voor ingrediënten met minimale 
                toevoegingen en maximale smaak. Wat de natuur ons geeft, is vaak het beste.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-serif text-burnt-orange mb-2">95%</div>
                  <div className="text-warm-cream/80">Lokale Ingrediënten</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-serif text-burnt-orange mb-2">0</div>
                  <div className="text-warm-cream/80">Kunstmatige Kleurstoffen</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-serif text-burnt-orange mb-2">100%</div>
                  <div className="text-warm-cream/80">Verse Bereiding</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
