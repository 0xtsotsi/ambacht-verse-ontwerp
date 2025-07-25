import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock, Star, Award } from "lucide-react";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const MagneticButton = ({ children, className, onClick, style }: MagneticButtonProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * 0.15;
    const deltaY = (e.clientY - centerY) * 0.15;
    
    setMousePosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.button
      className={className}
      style={style}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
        scale: isHovered ? 1.05 : 1
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

export const EnhancedCTA = () => {
  const features = [
    {
      icon: Star,
      title: "Premium Kwaliteit",
      description: "Exclusieve ingrediënten van lokale leveranciers"
    },
    {
      icon: Award,
      title: "Professionele Service",
      description: "Ervaren team met oog voor detail"
    },
    {
      icon: Clock,
      title: "Flexibele Planning",
      description: "Aangepaste menu's voor elk evenement"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-[#FAF8F5] via-white to-[#F5E6D3] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16"
          >
            <div className="inline-block">
              <h2 
                className="text-4xl md:text-5xl font-bold text-[#2F2F2F] mb-6"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Klaar voor uw Perfect
                <span className="block bg-gradient-to-r from-[#CC7A00] to-[#D4AF37] bg-clip-text text-transparent">
                  Culinaire Ervaring?
                </span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#CC7A00] to-[#D4AF37] mx-auto rounded-full" />
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#CC7A00] to-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 
                  className="text-xl font-semibold text-[#2F2F2F] mb-3"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {feature.title}
                </h3>
                <p 
                  className="text-[#5F5F5F] leading-relaxed"
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <MagneticButton
              className="px-8 py-4 rounded-full text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #CC7A00 0%, #D4AF37 100%)',
                fontFamily: 'Open Sans, sans-serif'
              }}
              onClick={() => window.open('tel:+31621222658', '_self')}
            >
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5" />
                <span>Bel Nu: 06 212 226 58</span>
              </div>
            </MagneticButton>

            <MagneticButton
              className="px-8 py-4 rounded-full border-2 border-[#CC7A00] text-[#CC7A00] font-semibold text-lg hover:bg-[#CC7A00] hover:text-white transition-all duration-300"
              style={{ fontFamily: 'Open Sans, sans-serif' }}
              onClick={() => window.open('mailto:info@ambachtbijwesley.nl', '_self')}
            >
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5" />
                <span>E-mail Offerte</span>
              </div>
            </MagneticButton>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-8 text-[#5F5F5F]"
            style={{ fontFamily: 'Open Sans, sans-serif' }}
          >
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-[#CC7A00]" />
              <span>Nieuweweg 79, Stellendam</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-[#CC7A00]" />
              <span>info@ambachtbijwesley.nl</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-[#CC7A00]" />
              <span>Ma-Vr: 9:00-18:00</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};