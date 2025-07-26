import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Calendar, Users, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  
  // Parallax effects
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    const timer = setTimeout(() => setHeroLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(@assets/1000005907_1753439577476.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Parallax Background Overlay */}
      <motion.div 
        className="absolute inset-0 bg-black/50"
        style={{ opacity: useTransform(scrollY, [0, 300], [0.5, 0.8]) }}
      />

      {/* Floating 3D Elements */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <motion.div
          className="absolute left-10 top-20 w-32 h-32 bg-[#D4AF37]/20 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute right-10 bottom-20 w-40 h-40 bg-[#CC7A00]/20 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute left-1/2 top-1/3 w-24 h-24 bg-[#8B4513]/20 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <motion.div 
        className="relative z-20 text-center text-white px-4"
        style={{ y, opacity }}
      >
        <div className={`transition-all duration-1000 ${
          heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Badge */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-[#D4AF37] font-medium tracking-widest uppercase text-sm">
              Exclusieve Catering Sinds 2008
            </span>
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          </div>

          <h1 className="text-white mb-8" style={{ 
            fontSize: '5rem', 
            fontWeight: '900', 
            lineHeight: '1.1',
            fontFamily: 'Playfair Display, serif',
            textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
            letterSpacing: '0.02em'
          }}>
            WESLEY'S AMBACHT CATERING
          </h1>
          
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Van intieme bijeenkomsten tot grootse vieringen, wij brengen de authentieke smaak 
            van Wesley's Ambacht naar uw speciale momenten
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              className="px-8 py-4 bg-gradient-to-r from-[#CC7A00] to-[#D4AF37] text-white rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#D4AF37]/25"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Reserveer Uw Evenement
            </Button>
            
            <Button 
              variant="outline" 
              className="px-8 py-4 border-2 border-white/30 text-white rounded-full font-semibold text-lg backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-gray-900 hover:scale-105"
            >
              <Users className="w-5 h-5 mr-2" />
              Bekijk Onze Diensten
            </Button>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <span className="text-[#D4AF37] text-2xl">★★★★★</span>
              <span>500+ Vijf Sterren Reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <span>Beste Cateraar 2023</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">👨‍🍳</span>
              <span>Ervaren Chefs</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 text-white cursor-pointer group"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          onClick={() => {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
          }}
        >
          <span className="text-sm font-medium opacity-70 group-hover:opacity-100 transition-opacity">
            Ontdek Onze Diensten
          </span>
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>

      {/* Additional Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#CC7A00]/10 rounded-full blur-3xl animate-pulse delay-1000" />
    </section>
  );
};

export default HeroSection;