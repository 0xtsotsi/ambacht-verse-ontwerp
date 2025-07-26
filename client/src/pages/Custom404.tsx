import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Home, ChefHat, ArrowLeft, Utensils, Search } from 'lucide-react';

const Custom404 = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-white to-[#F5E6D3] overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -left-20 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * 2,
            y: mousePosition.y * 2,
            scale: [1, 1.1, 1],
          }}
          transition={{
            x: { type: "spring", stiffness: 50 },
            y: { type: "spring", stiffness: 50 },
            scale: { duration: 5, repeat: Infinity }
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#CC7A00]/10 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x * -2,
            y: mousePosition.y * -2,
            scale: [1, 1.2, 1],
          }}
          transition={{
            x: { type: "spring", stiffness: 50 },
            y: { type: "spring", stiffness: 50 },
            scale: { duration: 7, repeat: Infinity }
          }}
        />
      </div>

      {/* Floating Food Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 text-[#8B4513]/20"
          animate={floatingAnimation}
        >
          <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
        </motion.div>

        <motion.div
          className="absolute bottom-20 right-20 text-[#D4AF37]/20"
          animate={{
            ...floatingAnimation,
            transition: { ...floatingAnimation.transition, delay: 1 }
          }}
        >
          <Utensils size={50} />
        </motion.div>

        <motion.div
          className="absolute top-1/3 right-1/4 text-[#CC7A00]/20"
          animate={{
            ...floatingAnimation,
            transition: { ...floatingAnimation.transition, delay: 2 }
          }}
        >
          <ChefHat size={40} />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Large 404 */}
          <motion.div 
            className="relative mb-8"
            variants={itemVariants}
          >
            <h1 className="text-[150px] md:text-[200px] font-bold text-[#2F2F2F] leading-none">
              4
              <motion.span
                className="inline-block relative"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="relative z-10">0</span>
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-24 h-24 md:w-32 md:h-32 border-8 border-dashed border-[#D4AF37]/30 rounded-full" />
                </motion.div>
              </motion.span>
              4
            </h1>
            <motion.p 
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[#CC7A00] font-medium text-lg tracking-widest uppercase"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Oeps!
            </motion.p>
          </motion.div>

          {/* Message */}
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-3xl md:text-4xl font-serif text-[#2F2F2F] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Deze Pagina is Verdwaald
            </h2>
            <p className="text-lg text-[#5F5F5F] max-w-2xl mx-auto" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              Het lijkt erop dat deze pagina net zo verloren is als een soufflé zonder recept. 
              Maar geen zorgen, we helpen u graag terug naar onze heerlijke catering diensten!
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={itemVariants}
          >
            <Link href="/" className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#CC7A00] to-[#D4AF37] text-white rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#D4AF37]/25">
              <Home className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              Terug naar Home
            </Link>

            <Link href="/services" className="group flex items-center gap-3 px-8 py-4 border-2 border-[#2F2F2F]/20 text-[#2F2F2F] rounded-full font-semibold text-lg backdrop-blur-sm transition-all duration-300 hover:bg-[#2F2F2F] hover:text-white hover:scale-105">
              <Search className="w-5 h-5" />
              Bekijk Diensten
            </Link>
          </motion.div>

          {/* Helpful Links */}
          <motion.div 
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={itemVariants}
          >
            {[
              { icon: <Utensils />, title: "Menu's", link: "/menus" },
              { icon: <ChefHat />, title: "Over Ons", link: "/about" },
              { icon: <Home />, title: "Contact", link: "/contact" }
            ].map((item, index) => (
              <Link key={index} href={item.link} className="group p-6 bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-[#CC7A00]/10 to-[#D4AF37]/10 rounded-xl text-[#CC7A00] group-hover:scale-110 transition-transform">
                    {React.cloneElement(item.icon, { size: 24 })}
                  </div>
                  <span className="font-medium text-[#2F2F2F]">{item.title}</span>
                </div>
              </Link>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#8B4513]/5 to-transparent pointer-events-none" />
    </div>
  );
};

export default Custom404;