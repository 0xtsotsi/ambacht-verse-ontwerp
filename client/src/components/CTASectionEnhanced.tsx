import { motion } from "framer-motion";
import { ArrowRight, Phone, Mail, Calendar } from "lucide-react";
import { MagneticButton } from "./MagneticButton";
import { premiumAnimations, fadeInUp, useParallax } from "@/lib/animations";

// Import a nice background image
import CTABackground from "@assets/1000005931_1753544636356.jpg";

export function CTASectionEnhanced() {
  const parallaxY = useParallax(100);

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background with parallax */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: parallaxY }}
      >
        <img
          src={CTABackground}
          alt="Wesley's Ambacht Catering"
          className="w-full h-[120%] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-heritage-orange/90 to-warm-gold/90" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-8">
        <motion.div {...premiumAnimations.staggerContainer}>
          <motion.div className="text-center max-w-4xl mx-auto" {...fadeInUp()}>
            <p className="font-script text-3xl text-white/90 mb-6">
              Begin Uw Culnaire Reis
            </p>
            
            <h2 className="text-6xl font-display font-bold text-white mb-8 leading-tight">
              LATEN WE UW EVENEMENT <br />
              ONVERGETELIJK MAKEN
            </h2>
            
            <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Van intieme diners tot grootschalige evenementen, Wesley's Ambacht levert 
              uitzonderlijke catering die uw gasten zullen onthouden. Neem vandaag contact 
              met ons op voor een persoonlijk advies.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <MagneticButton
                size="xl"
                variant="primary"
                className="bg-white text-heritage-orange hover:bg-sophisticated-cream"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Reserveer Nu
                <ArrowRight className="w-5 h-5 ml-2" />
              </MagneticButton>
              
              <MagneticButton
                size="xl"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-heritage-orange"
              >
                <Phone className="w-5 h-5 mr-2" />
                06 212 226 58
              </MagneticButton>
            </div>

            {/* Contact info */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
              {...fadeInUp(0.4)}
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">Bel Ons</h3>
                <p className="text-white/80">06 212 226 58</p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">Email</h3>
                <p className="text-white/80">info@ambachtbijwesley.nl</p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">Beschikbaar</h3>
                <p className="text-white/80">7 dagen per week</p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}