import { Button } from "@/components/ui/button";
import { useState } from "react";

export const ServiceSection = () => {
  const [activeService, setActiveService] = useState("corporate");

  const services = [
    { id: "corporate", name: "Corporate Events", icon: "🏢" },
    { id: "social", name: "Social Events", icon: "🎉" },
    { id: "weddings", name: "Weddings", icon: "💍" },
    { id: "grill", name: "Grill & BBQ", icon: "🔥" },
    { id: "bytray", name: "By The Tray", icon: "🍽️" },
  ];

  return (
    <section className="section-spacing" style={{ backgroundColor: '#F0F4F8' }}>
      <div className="container-main text-center">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-muted/20 to-muted/10 py-12 mb-16 rounded-lg">
          <h2 className="text-display text-white mb-4">NEW SPRING SPECIALS MENU</h2>
          <Button className="btn-primary">
            Spring Specials
          </Button>
        </div>

        {/* Discover Section */}
        <div className="mb-16">
          <p className="text-script mb-4">Discover</p>
          <h2 className="text-display text-foreground mb-8">OUR SERVICES</h2>
          <div className="w-16 h-0.5 bg-highlight mx-auto mb-8" />
          
          <p className="text-body max-w-4xl mx-auto text-muted leading-relaxed mb-12">
            We handle all occasions large and small, no matter what your catering needs might be, give us a call to see if your date is available. Soprano's Catering offers a wide range of pick up and drop off selections for your next catered event including: breakfast, lunch, and box lunches, appetizers, BBQ and dinner options as well as full service catering for large corporate events and weddings.
          </p>

          {/* Service Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            {services.map((service) => (
              <Button
                key={service.id}
                className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 ${
                  activeService === service.id
                    ? 'bg-accent text-white'
                    : 'bg-highlight text-white hover:bg-accent'
                }`}
                onClick={() => setActiveService(service.id)}
              >
                {service.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};