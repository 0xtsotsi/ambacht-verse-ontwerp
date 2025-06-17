
import { Button } from "@/components/ui/button";

export const Hero = () => {
  console.log("Hero component loaded - testing save functionality");
  
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - Charcuterie Board */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1576867757603-05b134ebc379?q=80&w=2070')"
        }}
      ></div>
      
      {/* Wood texture overlay */}
      <div className="absolute inset-0 wood-texture opacity-20"></div>

      {/* Main Content - Circular Overlay */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          {/* Circular Welcome Card */}
          <div className="relative bg-warm-cream rounded-full p-12 md:p-16 shadow-2xl max-w-lg mx-auto">
            {/* Welcome Text */}
            <div className="space-y-4">
              <h2 className="text-burnt-orange font-script text-2xl md:text-3xl mb-2">
                Welkom bij
              </h2>
              
              <h1 className="text-forest-green font-serif text-4xl md:text-5xl font-bold leading-tight">
                WESLEY'S<br />
                AMBACHT
              </h1>
              
              <p className="text-forest-green text-base md:text-lg max-w-xs mx-auto leading-relaxed mt-6">
                Wij proberen ons op een ieder te richten!<br />
                Kijk eens rustig rond om inspiratie op<br />
                te doen.
              </p>
              
              <Button 
                className="bg-burnt-orange hover:bg-burnt-orange/90 text-warm-cream px-8 py-3 rounded-full font-semibold text-lg mt-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Contacteer Ons
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
