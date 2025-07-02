
import { Button } from "@/components/ui/button";

export const Hero = () => {
  console.log("Hero component loaded - testing save functionality");
  console.log("Current timestamp:", new Date().toISOString());
  console.log("Component rendering successfully");
  
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-elegant-light via-terracotta-50/40 to-terracotta-100/20">
      {/* Organic Background with Natural Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "linear-gradient(135deg, rgba(224,138,79,0.75), rgba(139,69,19,0.5), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1576867757603-05b134ebc379?q=80&w=2070')"
        }}
      ></div>

      {/* Organic Pattern Overlay - Flowing and Natural */}
      <div className="absolute inset-0 opacity-15">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 300px 200px at 20% 30%, rgba(224,138,79,0.2) 0%, transparent 70%),
              radial-gradient(ellipse 400px 250px at 80% 70%, rgba(224,138,79,0.15) 0%, transparent 60%),
              radial-gradient(ellipse 250px 180px at 60% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)
            `,
            backgroundSize: '800px 600px, 900px 700px, 500px 400px',
            filter: 'blur(1px)'
          }}
        ></div>
      </div>

      {/* Main Content - Organic Flowing Card */}
      <div className="relative z-10 container mx-auto px-6 text-center animate-organic-grow">
        <div className="max-w-4xl mx-auto">
          {/* Organic Flowing Welcome Card */}
          <div className="relative bg-gradient-to-br from-elegant-light/90 via-terracotta-50/60 to-elegant-light/85 backdrop-blur-md rounded-3xl p-12 md:p-20 shadow-organic-floating max-w-3xl mx-auto border border-terracotta-200/40 transform hover:scale-[1.02] transition-all duration-700 animate-organic-breathe overflow-hidden">
            {/* Organic Decorative Elements */}
            <div className="absolute -top-3 -left-4 w-12 h-8 bg-gradient-to-br from-terracotta-400/60 to-terracotta-600/60 rounded-full transform rotate-12 animate-organic-float"></div>
            <div className="absolute -bottom-4 -right-3 w-10 h-6 bg-gradient-to-br from-terracotta-500/50 to-terracotta-700/50 rounded-full transform -rotate-12 animate-organic-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-8 right-8 w-6 h-6 bg-gradient-to-br from-terracotta-300/40 to-terracotta-500/40 rounded-full animate-organic-float" style={{ animationDelay: '2s' }}></div>
            
            {/* Welcome Text */}
            <div className="space-y-10">
              <h2 className="text-terracotta-600 font-elegant-script text-4xl md:text-5xl mb-6 animate-organic-float" style={{ animationDelay: '0.3s' }}>
                Welkom bij
              </h2>
              
              <h1 className="text-elegant-dark font-elegant-heading text-6xl md:text-7xl font-bold leading-tight tracking-tight transform">
                WESLEY'S<br />
                <span className="bg-gradient-to-br from-terracotta-500 via-terracotta-600 to-terracotta-700 bg-clip-text text-transparent">
                  AMBACHT
                </span>
              </h1>
              
              <div className="w-32 h-2 bg-gradient-to-r from-terracotta-400 via-terracotta-500 to-terracotta-600 mx-auto rounded-full opacity-80"></div>
              
              <p className="text-elegant-dark font-elegant-body text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed mt-10 font-medium">
                Wij proberen ons op een ieder te richten!<br />
                Kijk eens rustig rond om inspiratie op<br />
                te doen.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mt-16">
                <Button 
                  variant="organic-primary"
                  size="organic-lg"
                  onClick={() => console.log("Button clicked - changes are working!")}
                >
                  Contacteer Ons
                </Button>
                
                <Button 
                  variant="organic-floating"
                  size="organic-lg"
                >
                  Bekijk Galerij
                </Button>
              </div>
            </div>
          </div>
          
          {/* Organic Feature Pills */}
          <div className="flex flex-wrap justify-center gap-6 mt-16 animate-organic-grow" style={{ animationDelay: '0.8s' }}>
            {['Premium Catering', 'Lokale Ingrediënten', 'Persoonlijke Service'].map((feature, index) => (
              <div 
                key={feature}
                className="bg-gradient-to-br from-elegant-light/85 via-terracotta-50/60 to-elegant-light/80 backdrop-blur-sm px-8 py-4 rounded-full border border-terracotta-200/40 shadow-organic-soft text-elegant-dark font-medium hover:bg-gradient-to-br hover:from-terracotta-100/70 hover:via-terracotta-150/60 hover:to-terracotta-100/70 hover:border-terracotta-300/60 hover:shadow-organic-natural transition-all duration-500 transform hover:scale-110 animate-organic-float"
                style={{ 
                  animationDelay: `${1 + index * 0.2}s`,
                  animationDuration: `${4 + index * 0.5}s`
                }}
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
