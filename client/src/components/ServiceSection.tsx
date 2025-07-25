import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Building2, PartyPopper, Heart, Flame, UtensilsCrossed, Sparkles } from "lucide-react";

export const ServiceSection = () => {
  const [activeService, setActiveService] = useState("corporate");

  const services = [
    { id: "corporate", name: "Corporate Events", icon: <Building2 className="w-6 h-6" />, gradient: "from-blue-500 to-cyan-500" },
    { id: "social", name: "Social Events", icon: <PartyPopper className="w-6 h-6" />, gradient: "from-purple-500 to-pink-500" },
    { id: "weddings", name: "Bruiloften", icon: <Heart className="w-6 h-6" />, gradient: "from-rose-500 to-pink-500" },
    { id: "grill", name: "BBQ Catering", icon: <Flame className="w-6 h-6" />, gradient: "from-orange-500 to-red-500" },
    { id: "bytray", name: "Lunch Service", icon: <UtensilsCrossed className="w-6 h-6" />, gradient: "from-green-500 to-emerald-500" },
  ];

  return (
    <section className="section-spacing" style={{ backgroundColor: '#F0F4F8' }}>
      <div className="container-main text-center">
        {/* Header Banner */}
        <div className="bg-[#FF6B35]/10 backdrop-blur-sm py-16 mb-20 rounded-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-display text-gray-800 mb-6">LENTE SPECIALS MENU</h2>
            <Button className="bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
              Bekijk Specials
            </Button>
          </div>
        </div>

        {/* Discover Section */}
        <div className="mb-16">
          <p className="text-script mb-4">Discover</p>
          <h2 className="text-display text-foreground mb-8">OUR SERVICES</h2>
          <div className="w-16 h-0.5 bg-highlight mx-auto mb-8" />
          
          <p className="text-body max-w-4xl mx-auto text-muted leading-relaxed mb-12">
            Wij verzorgen alle gelegenheden, groot en klein. Ongeacht uw cateringbehoeften, bel ons om te zien of uw datum beschikbaar is. Wesley's Ambacht biedt een breed scala aan ophaal- en bezorgopties voor uw volgende catered evenement, inclusief: ontbijt, lunch en lunchpakketten, hapjes, BBQ en dineropties evenals volledige service catering voor grote bedrijfsevenementen en bruiloften.
          </p>

          {/* Service Buttons */}
          <div className="flex flex-wrap justify-center gap-6">
            {services.map((service) => (
              <Button
                key={service.id}
                className={`px-8 py-6 rounded-2xl font-semibold transition-all duration-500 flex items-center space-x-3 group relative overflow-hidden ${
                  activeService === service.id
                    ? 'bg-[#FF6B35] text-white shadow-2xl scale-105'
                    : 'bg-white text-gray-700 hover:text-white border border-gray-200 hover:border-transparent shadow-lg hover:shadow-2xl hover:scale-105 hover:bg-[#FF6B35]'
                }`}
                onClick={() => setActiveService(service.id)}
              >
                <div className="absolute inset-0 bg-[#FF6B35] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </span>
                <span className="relative z-10">{service.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};