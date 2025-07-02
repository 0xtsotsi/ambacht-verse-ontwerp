
import { Button } from "@/components/ui/button";

export const Hero = () => {
  console.log("Hero component loaded - testing save functionality");
  console.log("Current timestamp:", new Date().toISOString());
  console.log("Component rendering successfully");
  
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-elegant-light via-terracotta-50/30 to-elegant-light">
      {/* Modern Background with Geometric Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "linear-gradient(135deg, rgba(224,138,79,0.8), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1576867757603-05b134ebc379?q=80&w=2070')"
        }}
      ></div>

      {/* Geometric Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(30deg, transparent 48%, rgba(224,138,79,0.1) 49%, rgba(224,138,79,0.1) 51%, transparent 52%),
              linear-gradient(90deg, transparent 48%, rgba(224,138,79,0.05) 49%, rgba(224,138,79,0.05) 51%, transparent 52%)
            `,
            backgroundSize: '80px 80px'
          }}
        ></div>
      </div>

      {/* Main Content - Modern Fusion Card */}
      <div className="relative z-10 container mx-auto px-6 text-center animate-elegant-fade-in">
        <div className="max-w-4xl mx-auto">
          {/* Modern Fusion Welcome Card */}
          <div className="relative bg-gradient-to-br from-elegant-light/95 via-elegant-light/90 to-terracotta-50/80 backdrop-blur-sm rounded-2xl p-12 md:p-16 shadow-elegant-panel max-w-3xl mx-auto border border-terracotta-200/50 transform hover:scale-[1.02] transition-all duration-500">
            {/* Decorative Elements */}
            <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-terracotta-400 to-terracotta-600 rounded-full opacity-80"></div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-br from-terracotta-500 to-terracotta-700 rounded-full opacity-80"></div>
            
            {/* Welcome Text */}
            <div className="space-y-8">
              <h2 className="text-terracotta-500 font-elegant-script text-4xl md:text-5xl mb-6 animate-elegant-glow">
                Welkom bij
              </h2>
              
              <h1 className="text-elegant-dark font-elegant-heading text-6xl md:text-7xl font-bold leading-tight tracking-tight">
                WESLEY'S<br />
                <span className="bg-gradient-to-r from-terracotta-500 via-terracotta-600 to-terracotta-700 bg-clip-text text-transparent">
                  AMBACHT
                </span>
              </h1>
              
              <div className="w-24 h-1 bg-gradient-to-r from-terracotta-400 to-terracotta-600 mx-auto rounded-full"></div>
              
              <p className="text-elegant-dark font-elegant-body text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed mt-8 font-medium">
                Wij proberen ons op een ieder te richten!<br />
                Kijk eens rustig rond om inspiratie op<br />
                te doen.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
                <Button 
                  variant="elegant"
                  size="elegant-lg"
                  className="bg-gradient-to-r from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700 text-white font-semibold px-8 py-4 rounded-xl shadow-elegant-button hover:shadow-elegant-button-hover transform hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                  onClick={() => console.log("Button clicked - changes are working!")}
                >
                  Contacteer Ons
                </Button>
                
                <Button 
                  variant="outline"
                  size="elegant-lg"
                  className="border-2 border-terracotta-400 text-terracotta-600 hover:bg-terracotta-50 font-semibold px-8 py-4 rounded-xl transform hover:scale-105 transition-all duration-300"
                >
                  Bekijk Galerij
                </Button>
              </div>
            </div>
          </div>
          
          {/* Modern Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mt-12 animate-elegant-fade-in" style={{ animationDelay: '0.5s' }}>
            {['Premium Catering', 'Lokale Ingrediënten', 'Persoonlijke Service'].map((feature, index) => (
              <div 
                key={feature}
                className="bg-elegant-light/90 backdrop-blur-sm px-6 py-3 rounded-full border border-terracotta-200/50 shadow-elegant-subtle text-elegant-dark font-medium hover:bg-terracotta-50/80 hover:border-terracotta-300 transition-all duration-300 transform hover:scale-105"
                style={{ animationDelay: `${0.7 + index * 0.1}s` }}
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
