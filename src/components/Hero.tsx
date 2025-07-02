
import { Button } from "@/components/ui/button";

export const Hero = () => {
  console.log("Hero component loaded - testing save functionality");
  console.log("Current timestamp:", new Date().toISOString());
  console.log("Component rendering successfully");
  
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-elegant-light">
      {/* Background Image - Charcuterie Board */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1576867757603-05b134ebc379?q=80&w=2070')"
        }}
      ></div>

      {/* Main Content - Classic Card */}
      <div className="relative z-10 container mx-auto px-6 text-center animate-elegant-fade-in">
        <div className="max-w-3xl mx-auto">
          {/* Classic Welcome Card */}
          <div className="relative bg-elegant-light rounded-elegant p-16 md:p-20 shadow-elegant-panel max-w-2xl mx-auto">
            {/* Welcome Text */}
            <div className="space-y-6">
              <h2 className="text-elegant-terracotta font-elegant-script text-3xl md:text-4xl mb-4">
                Welkom bij
              </h2>
              
              <h1 className="text-elegant-dark font-elegant-heading text-5xl md:text-6xl font-bold leading-tight">
                WESLEY'S<br />
                AMBACHT
              </h1>
              
              <p className="text-elegant-dark font-elegant-body text-lg md:text-xl max-w-md mx-auto leading-relaxed mt-8">
                Wij proberen ons op een ieder te richten!<br />
                Kijk eens rustig rond om inspiratie op<br />
                te doen.
              </p>
              
              <Button 
                variant="elegant"
                size="elegant-lg"
                className="mt-10"
                onClick={() => console.log("Button clicked - changes are working!")}
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
