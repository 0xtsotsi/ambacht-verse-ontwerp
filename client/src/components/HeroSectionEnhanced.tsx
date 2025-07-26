import { motion, useScroll, useTransform } from "framer-motion";
import { MagneticButton } from "./MagneticButton";
import { revealAnimation, useParallax } from "@/lib/animations";
import { useEffect, useState } from "react";

// Import the background image from attached assets
import HeroBackground from "@assets/1000005877_1753544636357.jpg";

export function HeroSectionEnhanced() {
  const { scrollY } = useScroll();
  const heroParallaxY = useTransform(scrollY, [0, 500], [0, 150]);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = HeroBackground;
    img.onload = () => setImageLoaded(true);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Parallax Background with Performance Optimization */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: heroParallaxY }}
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: imageLoaded ? 1 : 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={HeroBackground}
          alt="Elegant Dutch artisanal dining"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-craft-charcoal/40 via-transparent to-craft-charcoal/60" />
      </motion.div>
      
      {/* Typography EXACTLY matching Soprano's */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white max-w-4xl px-8">
          <motion.p
            className="font-script text-3xl lg:text-4xl text-golden-honey mb-6"
            {...revealAnimation({ delay: 0.5 })}
          >
            Reserveer Vandaag
          </motion.p>
          
          <motion.h1
            className="font-display text-6xl lg:text-8xl font-bold tracking-tight mb-8 leading-none"
            {...revealAnimation({ delay: 0.7 })}
          >
            CONTROLEER UW DATUM
          </motion.h1>
          
          <motion.p
            className="text-xl lg:text-2xl max-w-3xl mx-auto mb-10 leading-relaxed font-light"
            {...revealAnimation({ delay: 0.9 })}
          >
            Neem vandaag contact met ons op om onze evenementenplanning te controleren en 
            uw data te reserveren. We ontwerpen een pakket dat perfect past bij uw speciale evenement.
          </motion.p>
          
          <motion.div {...revealAnimation({ delay: 1.1 })}>
            <MagneticButton
              size="xl"
              className="bg-heritage-orange hover:bg-heritage-orange/90 text-white px-12 py-6 text-xl font-semibold rounded-full shadow-2xl"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Contact Ons
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}