
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Flame, Calendar, Utensils } from "lucide-react";

export const Services = () => {
  const services = [
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Kantoor Catering",
      description: "Verse broodjes en lunch voor op kantoor. Dagelijks vers bereid met ambachtelijke zorg.",
      features: ["Dagverse broodjes", "Seizoensalades", "Warme maaltijden", "Speciale diëten"],
      color: "bg-forest-green"
    },
    {
      icon: <Flame className="w-8 h-8" />,
      title: "BBQ Services",
      description: "Professionele BBQ catering met ons eigen smoking expertise voor onvergetelijke momenten.",
      features: ["Slow-cooked specialiteiten", "Eigen rook technieken", "Complete BBQ setup", "Live cooking"],
      color: "bg-burnt-orange"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Evenement Buffets",
      description: "Uitgebreide buffetten voor verjaardagen, bruiloften en bedrijfsfeesten.",
      features: ["Thematische buffetten", "Lokale specialiteiten", "Vegetarische opties", "Maatwerk menu's"],
      color: "bg-deep-teal"
    }
  ];

  return (
    <section id="services" className="py-20 bg-warm-cream">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-forest-green mb-4">
              Onze Diensten
            </h2>
            <div className="w-24 h-1 bg-burnt-orange mx-auto mb-6"></div>
            <p className="text-xl text-natural-brown max-w-3xl mx-auto">
              Wij proberen ons op elke ieder te richten! Of u nou een broodjeslunch op de zaak wilt, 
              een BBQ om het seizoen af te sluiten of een Buffet om uw verjaardag te vieren.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 overflow-hidden bg-clean-white border-beige/30">
                <CardContent className="p-0">
                  {/* Icon Header */}
                  <div className={`${service.color} text-clean-white p-6 text-center`}>
                    <div className="flex justify-center mb-4">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-serif font-bold">{service.title}</h3>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <p className="text-natural-brown mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    
                    {/* Features */}
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-forest-green">
                          <div className="w-2 h-2 bg-burnt-orange rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-2 border-forest-green text-forest-green hover:bg-forest-green hover:text-warm-cream transition-all duration-300"
                    >
                      Meer Informatie
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Speciality Section */}
          <div className="bg-clean-white rounded-xl p-8 md:p-12 delft-pattern">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-burnt-orange/10 border border-burnt-orange/20 rounded-full mb-4">
                <Utensils className="w-4 h-4 text-burnt-orange mr-2" />
                <span className="text-burnt-orange font-medium text-sm">Onze Specialiteit</span>
              </div>
              <h3 className="text-3xl font-serif text-forest-green mb-4">Smoking Expertise</h3>
              <p className="text-natural-brown text-lg max-w-2xl mx-auto">
                Met jarenlange ervaring in het roken van vlees brengen wij authenticiteit en smaak 
                die u nergens anders zult vinden. Elke bereiding is een kunstwerk op zich.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-xl font-serif text-forest-green">Onze Rook Technieken</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-natural-brown">
                    <span className="w-2 h-2 bg-burnt-orange rounded-full mr-3"></span>
                    Low & slow smoking tot 16 uur
                  </li>
                  <li className="flex items-center text-natural-brown">
                    <span className="w-2 h-2 bg-burnt-orange rounded-full mr-3"></span>
                    Hickory en eiken houtsoorten
                  </li>
                  <li className="flex items-center text-natural-brown">
                    <span className="w-2 h-2 bg-burnt-orange rounded-full mr-3"></span>
                    Temperatuurcontrole met precisie
                  </li>
                  <li className="flex items-center text-natural-brown">
                    <span className="w-2 h-2 bg-burnt-orange rounded-full mr-3"></span>
                    Traditionele dry rubs en marinades
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-xl font-serif text-forest-green">Populaire Gerechten</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-natural-brown">
                    <span className="w-2 h-2 bg-burnt-orange rounded-full mr-3"></span>
                    Pulled pork sandwiches
                  </li>
                  <li className="flex items-center text-natural-brown">
                    <span className="w-2 h-2 bg-burnt-orange rounded-full mr-3"></span>
                    Brisket met huisgemaakte BBQ saus
                  </li>
                  <li className="flex items-center text-natural-brown">
                    <span className="w-2 h-2 bg-burnt-orange rounded-full mr-3"></span>
                    Gerookte zalm en forel
                  </li>
                  <li className="flex items-center text-natural-brown">
                    <span className="w-2 h-2 bg-burnt-orange rounded-full mr-3"></span>
                    Vegetarische rook specialiteiten
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
