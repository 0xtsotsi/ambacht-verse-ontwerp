
import { Button } from "@/components/ui/button";

export const Hero = () => {
  console.log("Hero component loaded - testing save functionality");
  console.log("Current timestamp:", new Date().toISOString());
  console.log("Component rendering successfully");
  
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-white">
      {/* Clean Background Image with Minimal Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0.6)), url('https://images.unsplash.com/photo-1576867757603-05b134ebc379?q=80&w=2070')"
        }}
      ></div>

      {/* Main Content - Clean and Minimal */}
      <div className="relative z-10 container mx-auto px-16 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Clean Welcome Card */}
          <div className="bg-white/95 backdrop-blur-sm p-24 md:p-32 max-w-4xl mx-auto border-0 shadow-none">
            
            {/* Clean Typography Hierarchy */}
            <div className="space-y-24">
              <h2 className="text-terracotta-600 font-elegant-script text-5xl md:text-6xl font-light">
                Welkom bij
              </h2>
              
              <h1 className="text-elegant-dark font-elegant-heading text-8xl md:text-9xl font-light leading-none tracking-[-0.02em]">
                WESLEY'S<br />
                <span className="text-terracotta-600">
                  AMBACHT
                </span>
              </h1>
              
              <div className="w-16 h-px bg-terracotta-600 mx-auto"></div>
              
              <p className="text-elegant-dark font-elegant-body text-2xl md:text-3xl max-w-3xl mx-auto leading-relaxed font-light">
                Wij proberen ons op een ieder te richten!<br />
                Kijk eens rustig rond om inspiratie op<br />
                te doen.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-12 justify-center items-center mt-32">
                <Button 
                  variant="luxury-primary"
                  size="luxury-lg"
                  onClick={() => console.log("Button clicked - changes are working!")}
                >
                  Contacteer Ons
                </Button>
                
                <Button 
                  variant="luxury-outline"
                  size="luxury-lg"
                >
                  Bekijk Galerij
                </Button>
              </div>
            </div>
          </div>
          
          {/* Clean Feature Pills */}
          <div className="flex flex-wrap justify-center gap-16 mt-32">
            {['Premium Catering', 'Lokale Ingrediënten', 'Persoonlijke Service'].map((feature, index) => (
              <div 
                key={feature}
                className="bg-transparent px-0 py-0 text-elegant-dark font-elegant-body font-light text-lg tracking-wide"
              >
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
