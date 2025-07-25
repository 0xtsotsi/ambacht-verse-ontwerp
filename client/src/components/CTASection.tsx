import { Button } from "@/components/ui/button";
import { Phone, Calendar, Clock, Users, Sparkles, Star } from "lucide-react";

export const CTASection = () => {
  return (
    <section
      className="section-spacing relative overflow-hidden bg-gradient-to-br from-gray-900 via-orange-900/50 to-amber-900/50"
      style={{
        backgroundImage: `url('/attached_assets/1000005686_1753439577482.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Enhanced Dark Overlay with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-orange-900/50 to-black/70"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>



      <div className="container-main relative z-10 text-center text-white">
        <p className="text-script mb-6 text-2xl text-[#FF6B35]">Reserveer Vandaag</p>
        
        <h2 className="text-display text-white mb-8">CONTROLEER UW DATUM</h2>
        
        <p className="text-body max-w-3xl mx-auto text-white/90 leading-relaxed mb-12 text-lg">
          Neem vandaag contact met ons op om onze evenementenplanning te controleren en uw data te reserveren. 
          We bespreken graag al uw behoeften en ontwerpen een pakket dat geschikt is voor u en uw speciale evenement.
        </p>



        <Button className="btn-primary text-xl px-12 py-4">
          Neem Contact Op
        </Button>
      </div>
    </section>
  );
};