import { Button } from "@/components/ui/button";
import { Phone, Calendar, Clock, Users, Sparkles, Star } from "lucide-react";

export const CTASection = () => {
  return (
    <section
      className="section-spacing relative overflow-hidden bg-gradient-to-br from-gray-900 via-orange-900/50 to-amber-900/50"
      style={{
        backgroundImage: `url('/attached_assets/1000005905_1753439577476.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Enhanced Dark Overlay with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-orange-900/50 to-black/70"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>

      {/* Floating decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div className="container-main relative z-10 text-center text-white">
        <div className="flex items-center justify-center mb-6">
          <Star className="w-8 h-8 text-amber-400 mr-3 animate-bounce" />
          <p className="text-script mb-0 text-2xl text-amber-300">Reserveer Vandaag</p>
          <Star className="w-8 h-8 text-amber-400 ml-3 animate-bounce" />
        </div>
        
        <h2 className="text-display text-white mb-8 relative">
          CONTROLEER UW DATUM
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
        </h2>
        
        <p className="text-body max-w-3xl mx-auto text-white/90 leading-relaxed mb-12 text-lg">
          Neem vandaag contact met ons op om onze evenementenplanning te controleren en uw data te reserveren. 
          We bespreken graag al uw behoeften en ontwerpen een pakket dat geschikt is voor u en uw speciale evenement.
        </p>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
          <div className="flex items-center justify-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-4 group hover:bg-orange-500/80 transition-all duration-300">
            <Phone className="w-6 h-6 text-orange-400 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
            <span className="text-white font-semibold group-hover:scale-105 transition-transform duration-300">Direct Contact</span>
          </div>
          <div className="flex items-center justify-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-4 group hover:bg-amber-500/80 transition-all duration-300">
            <Calendar className="w-6 h-6 text-amber-400 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
            <span className="text-white font-semibold group-hover:scale-105 transition-transform duration-300">Flexibele Planning</span>
          </div>
          <div className="flex items-center justify-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-4 group hover:bg-orange-500/80 transition-all duration-300">
            <Users className="w-6 h-6 text-orange-400 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
            <span className="text-white font-semibold group-hover:scale-105 transition-transform duration-300">Maatwerk Service</span>
          </div>
        </div>

        <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xl px-12 py-4 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 relative overflow-hidden group">
          <span className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span className="relative z-10 flex items-center space-x-3">
            <Phone className="w-6 h-6" />
            <span>Neem Contact Op</span>
          </span>
        </Button>
      </div>
    </section>
  );
};