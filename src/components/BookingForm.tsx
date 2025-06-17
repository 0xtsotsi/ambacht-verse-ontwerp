
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export const BookingForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Bericht Verzonden!",
      description: "Bedankt voor uw bericht. Wij nemen snel contact met u op.",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contact" className="py-0">
      <div 
        className="relative min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=2070')"
        }}
      >
        {/* Circular Booking Form */}
        <div className="relative z-10 max-w-md mx-auto px-4">
          <div className="bg-warm-cream rounded-full p-8 md:p-12 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-serif text-forest-green mb-4">
                BOEKINGS<br />
                AANVRAAG
              </h2>
              <p className="text-forest-green text-sm leading-relaxed">
                Vul jeje hieg on details en perfeebingxen<br />
                te zubmiet jow resservaterrnnrsje utraast
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Naam"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-4 py-3 rounded-full border-2 border-forest-green/20 focus:border-forest-green bg-white"
                required
              />
              
              <Input
                type="email"
                placeholder="E-mailadres"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-4 py-3 rounded-full border-2 border-forest-green/20 focus:border-forest-green bg-white"
                required
              />
              
              <Textarea
                placeholder="Bericht"
                value={formData.message}
                onChange={(e) => handleChange("message", e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-forest-green/20 focus:border-forest-green bg-white min-h-[100px] resize-none"
                required
              />
              
              <Button 
                type="submit"
                className="w-full bg-burnt-orange hover:bg-burnt-orange/90 text-warm-cream py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Versturen
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Arrow */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-12 h-12 bg-forest-green rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-warm-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="py-20 bg-warm-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Illustration */}
              <div className="flex justify-center">
                <div className="w-80 h-60 bg-gradient-to-br from-natural-brown/20 to-burnt-orange/10 rounded-lg flex items-center justify-center">
                  <div className="text-8xl">👨‍🍳</div>
                </div>
              </div>

              {/* Content */}
              <div>
                <h2 className="text-4xl md:text-5xl font-serif text-forest-green mb-8">
                  ONS VERHAAL
                </h2>
                <div className="text-forest-green text-lg leading-relaxed space-y-4">
                  <p>
                    Wesley's Ambacht smoken opstreds traditionele technieken en rijjen logae 
                    ingredienten voor de verkoop en frese. In vorms ommen kombaarkaas, hegema-
                    gemaakte brooden en vart visen Minimaal E-numreken gemiddels 
                    en we er gaan vred je handelaagr.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};
