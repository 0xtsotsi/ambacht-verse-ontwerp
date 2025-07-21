
// V5 Interactive Elegance - Hero Component with Advanced Mouse Tracking
// Hook testing: Animation system integration validation
import { Button } from "@/components/ui/button";
import { useState, useEffect, memo } from "react";
import { useOptimizedMouseTracking } from "@/hooks/useAnimationOptimization";
import { usePerformanceLogger } from "@/hooks/useComponentLogger";

export const Hero = memo(() => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Optimized mouse tracking with 16ms throttling for 60fps
  const mousePosition = useOptimizedMouseTracking(true, 20);
  
  // Performance monitoring
  const { getPerformanceStats } = usePerformanceLogger({
    componentName: 'Hero',
    slowRenderThreshold: 16, // 60fps threshold
    enableMemoryTracking: true
  });

  useEffect(() => {
    setIsLoaded(true);
    
    // Preload the background image
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.src = 'https://images.unsplash.com/photo-1576867757603-05b134ebc379?q=80&w=2070';
  }, []);
  
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
      {/* Interactive Background with Parallax Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0.6)), url('https://images.unsplash.com/photo-1576867757603-05b134ebc379?q=80&w=2070')`,
          transform: `translate3d(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px, 0) scale(1.1)`,
          willChange: 'transform',
          opacity: imageLoaded ? 1 : 0
        }}
      >
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-terracotta-100/0 via-terracotta-200/10 to-terracotta-100/0 animate-pulse"></div>
      </div>
      
      {/* Loading state for background */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-terracotta-100 via-terracotta-200 to-terracotta-100 animate-pulse"></div>
      )}

      {/* Floating particles - optimized with GPU acceleration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-terracotta-400/20 rounded-full animate-organic-float"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + i}s`,
              willChange: 'transform',
              transform: 'translate3d(0, 0, 0)' // Force GPU layer
            }}
          />
        ))}
      </div>

      {/* Main Content with Interactive Elements */}
      <div className="relative z-10 container mx-auto px-16 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Interactive Welcome Card */}
          <div 
            className="bg-white/90 backdrop-blur-md p-24 md:p-32 max-w-4xl mx-auto rounded-3xl shadow-elegant-panel transition-all duration-700 hover:shadow-2xl hover:bg-white/95 group"
            style={{
              transform: isLoaded ? 'translate3d(0, 0, 0)' : 'translate3d(0, 50px, 0)',
              opacity: isLoaded ? 1 : 0,
              transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
              willChange: 'transform, opacity'
            }}
          >
            
            {/* Interactive Typography */}
            <div className="space-y-24">
              <h2 
                className="text-terracotta-600 font-elegant-script text-5xl md:text-6xl font-light transition-all duration-700 transform group-hover:scale-105"
                style={{
                  animationDelay: '0.2s',
                  animation: isLoaded ? 'elegant-fade-in 1s ease-out forwards' : 'none'
                }}
              >
                Welkom bij
              </h2>
              
              <h1 
                className="text-elegant-dark font-elegant-heading text-8xl md:text-9xl font-light leading-none tracking-[-0.02em] relative overflow-hidden"
                style={{
                  animationDelay: '0.4s',
                  animation: isLoaded ? 'elegant-fade-in 1s ease-out forwards' : 'none'
                }}
              >
                <span className="inline-block transition-transform duration-700 hover:scale-105 hover:-translate-y-1 relative overflow-hidden">
                  WESLEY'S
                  {/* Interactive shimmer effect */}
                  <span className="absolute inset-0 -top-full -bottom-full bg-gradient-to-r from-transparent via-white/30 to-transparent w-full animate-interactive-shimmer opacity-0 group-hover:opacity-100"></span>
                </span>
                <br />
                <span className="text-terracotta-600 inline-block transition-all duration-700 hover:scale-105 hover:-translate-y-1 relative overflow-hidden">
                  AMBACHT
                  {/* Interactive shimmer effect */}
                  <span className="absolute inset-0 -top-full -bottom-full bg-gradient-to-r from-transparent via-terracotta-200/50 to-transparent w-full animate-interactive-shimmer opacity-0 group-hover:opacity-100" style={{ animationDelay: '0.2s' }}></span>
                  <span className="absolute inset-0 blur-2xl bg-terracotta-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></span>
                </span>
              </h1>
              
              <div 
                className="relative w-16 h-px bg-terracotta-600 mx-auto overflow-hidden"
                style={{
                  animationDelay: '0.6s',
                  animation: isLoaded ? 'elegant-fade-in 1s ease-out forwards' : 'none'
                }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-terracotta-400 to-transparent animate-pulse"></span>
              </div>
              
              <p 
                className="text-elegant-dark font-elegant-body text-2xl md:text-3xl max-w-3xl mx-auto leading-relaxed font-light transition-all duration-700 group-hover:text-elegant-grey-700"
                style={{
                  animationDelay: '0.8s',
                  animation: isLoaded ? 'elegant-fade-in 1s ease-out forwards' : 'none'
                }}
              >
                Wij proberen ons op een ieder te richten!<br />
                Kijk eens rustig rond om inspiratie op<br />
                te doen.
              </p>
              
              <div 
                className="flex flex-col sm:flex-row gap-12 justify-center items-center mt-32"
                style={{
                  animationDelay: '1s',
                  animation: isLoaded ? 'elegant-fade-in 1s ease-out forwards' : 'none'
                }}
              >
                <Button 
                  variant="interactive-primary"
                  size="elegant-lg"
                  className="group animate-interactive-bounce hover:animate-none"
                  onClick={() => console.log("Button clicked - interactive elegance!")}
                >
                  <span className="relative z-10">Contacteer Ons</span>
                </Button>
                
                <Button 
                  variant="interactive-outline"
                  size="elegant-lg"
                  className="group animate-interactive-bounce hover:animate-none"
                  style={{ animationDelay: '0.5s' }}
                >
                  <span className="relative z-10 group-hover:text-white transition-colors duration-500">Bekijk Galerij</span>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Interactive Feature Pills */}
          <div className="flex flex-wrap justify-center gap-16 mt-32">
            {['Premium Catering', 'Lokale Ingrediënten', 'Persoonlijke Service'].map((feature, index) => (
              <div 
                key={feature}
                className="relative px-8 py-4 text-elegant-dark font-elegant-body font-light text-lg tracking-wide transition-all duration-500 hover:text-terracotta-600 group cursor-pointer animate-interactive-pulse-glow"
                style={{
                  animationDelay: `${1.2 + index * 0.1}s`,
                  animation: isLoaded ? 'elegant-fade-in 1s ease-out forwards' : 'none'
                }}
              >
                {/* Hover background effect */}
                <span className="absolute inset-0 bg-terracotta-50/0 group-hover:bg-terracotta-50/50 rounded-full transition-all duration-500 transform scale-0 group-hover:scale-110"></span>
                {/* Enhanced glow effect */}
                <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl bg-terracotta-300/20"></span>
                <span className="relative">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});
