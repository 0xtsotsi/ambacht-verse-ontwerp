import React, { Suspense, useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Calendar, Users, Sparkles } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const HeroSection3D = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const heroRef = useRef(null);
  const { scrollY } = useScroll();
  const { ref: inViewRef, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  
  // Parallax effect for background
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  // Text animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  return (
    <section ref={heroRef} className="relative h-screen overflow-hidden bg-black">
      {/* Background with Parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y }}
      >
        {/* Use existing hero image from attached_assets */}
        <div className="relative w-full h-full">
          <img
            src="@assets/1000005907_1753439577476.jpg"
            alt="Wesley's Ambacht Catering"
            className={`object-cover w-full h-full transition-opacity duration-1000 ${
              inView ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsVideoLoaded(true)}
          />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />
        
        {/* Animated Grain Texture */}
        <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay">
          <div className="absolute inset-0 bg-noise animate-grain" />
        </div>
      </motion.div>

      {/* Floating 3D-like Elements with CSS */}
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

      {/* Main Content */}
      <motion.div 
        ref={inViewRef}
        className="relative z-20 flex items-center justify-center h-full px-4"
        style={{ opacity }}
      >
        <motion.div 
          className="text-center text-white max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {/* Accent Text */}
          <motion.div 
            className="flex items-center justify-center gap-2 mb-6"
            variants={itemVariants}
          >
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <span className="text-[#D4AF37] font-medium tracking-widest uppercase text-sm">
              Exclusieve Catering Sinds 2008
            </span>
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            className="font-serif text-6xl md:text-7xl lg:text-8xl leading-tight mb-6"
            style={{ fontFamily: 'Playfair Display, serif' }}
            variants={itemVariants}
          >
            <span className="block">Culinaire Excellentie</span>
            <span className="block text-[#D4AF37]">Voor Elk Moment</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
            variants={itemVariants}
          >
            Van intieme bijeenkomsten tot grootse vieringen, wij brengen de authentieke smaak 
            van Wesley's Ambacht naar uw speciale momenten
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={itemVariants}
          >
            <button className="group relative px-8 py-4 bg-gradient-to-r from-[#CC7A00] to-[#D4AF37] text-white rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#D4AF37]/25">
              <span className="relative z-10 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Reserveer Uw Evenement
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#CC7A00] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            <button className="group px-8 py-4 border-2 border-white/30 text-white rounded-full font-semibold text-lg backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-gray-900 hover:scale-105">
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Bekijk Onze Diensten
              </span>
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            className="mt-12 flex flex-wrap justify-center items-center gap-8 text-sm text-gray-300"
            variants={itemVariants}
          >
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
          </motion.div>
        </motion.div>
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

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#CC7A00]/10 rounded-full blur-3xl animate-pulse delay-1000" />
    </section>
  );
};

export default HeroSection3D;