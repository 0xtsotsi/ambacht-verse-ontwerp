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

      {/* Enhanced Floating 3D Food Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 text-[#8B4513]/30"
          animate={{
            ...floatingAnimation,
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{
            y: floatingAnimation.transition,
            rotate: { duration: 15, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.20-1.10-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
          </svg>
        </motion.div>

        <motion.div
          className="absolute bottom-20 right-20 text-[#D4AF37]/30"
          animate={{
            ...floatingAnimation,
            x: [0, 20, 0],
            rotate: [0, -15, 15, 0],
            transition: { 
              ...floatingAnimation.transition, 
              delay: 1,
              x: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }
          }}
        >
          <Utensils size={70} />
        </motion.div>

        <motion.div
          className="absolute top-1/3 right-1/4 text-[#CC7A00]/30"
          animate={{
            ...floatingAnimation,
            scale: [1, 1.3, 0.9, 1],
            rotateY: [0, 180, 360],
            transition: { 
              ...floatingAnimation.transition, 
              delay: 2,
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              rotateY: { duration: 8, repeat: Infinity, ease: "easeInOut" }
            }
          }}
        >
          <ChefHat size={60} />
        </motion.div>

        {/* Additional 3D Elements */}
        <motion.div
          className="absolute top-1/2 left-1/4 text-[#8B4513]/20"
          animate={{
            y: [0, -15, 0],
            x: [0, 10, 0],
            rotate: [0, 90, 180, 270, 360],
            scale: [0.8, 1.1, 0.8]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          <motion.div 
            className="w-16 h-16 bg-gradient-to-br from-[#D4AF37]/30 to-[#CC7A00]/30 rounded-full blur-sm"
            animate={{
              boxShadow: [
                "0 0 20px rgba(212, 175, 55, 0.3)",
                "0 0 40px rgba(204, 122, 0, 0.5)",
                "0 0 20px rgba(212, 175, 55, 0.3)"
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 left-1/3 text-[#D4AF37]/25"
          animate={{
            y: [0, 25, 0],
            rotateZ: [0, -30, 30, 0],
            scale: [1, 0.7, 1.3, 1]
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }}
        >
          <motion.div
            className="w-12 h-12 border-4 border-dashed border-[#CC7A00]/40 rounded-lg"
            animate={{
              borderRadius: ["12px", "50%", "12px"],
              borderColor: [
                "rgba(204, 122, 0, 0.4)",
                "rgba(212, 175, 55, 0.6)",
                "rgba(204, 122, 0, 0.4)"
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
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
          {/* Enhanced Large 404 with 3D Effects */}
          <motion.div 
            className="relative mb-8"
            variants={itemVariants}
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y * 0.1}deg) rotateY(${mousePosition.x * 0.1}deg)`
            }}
          >
            <motion.h1 
              className="text-[150px] md:text-[200px] font-bold leading-none relative"
              style={{
                background: 'linear-gradient(45deg, #2F2F2F, #5F5F5F, #2F2F2F)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: `drop-shadow(${mousePosition.x * 0.5}px ${mousePosition.y * 0.5}px 10px rgba(0,0,0,0.3))`
              }}
            >
              <motion.span
                animate={{ 
                  textShadow: [
                    "5px 5px 0px rgba(212, 175, 55, 0.3)",
                    "10px 10px 0px rgba(204, 122, 0, 0.3)",
                    "5px 5px 0px rgba(212, 175, 55, 0.3)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                4
              </motion.span>
              <motion.span
                className="inline-block relative mx-4"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 0.9, 1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  transform: `rotateX(${mousePosition.y * 0.2}deg) rotateY(${mousePosition.x * 0.2}deg)`
                }}
              >
                <span className="relative z-10">0</span>
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <motion.div 
                    className="w-24 h-24 md:w-32 md:h-32 border-8 border-dashed rounded-full"
                    animate={{
                      borderColor: [
                        "rgba(212, 175, 55, 0.3)",
                        "rgba(204, 122, 0, 0.6)",
                        "rgba(139, 69, 19, 0.4)",
                        "rgba(212, 175, 55, 0.3)"
                      ],
                      scale: [1, 1.2, 0.8, 1]
                    }}
                    transition={{
                      borderColor: { duration: 4, repeat: Infinity },
                      scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                    }}
                  />
                </motion.div>
                
                {/* Floating particles around the 0 */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-[#D4AF37] rounded-full"
                    animate={{
                      x: [0, Math.cos(i * 60 * Math.PI / 180) * 40],
                      y: [0, Math.sin(i * 60 * Math.PI / 180) * 40],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </motion.span>
              <motion.span
                animate={{ 
                  textShadow: [
                    "5px 5px 0px rgba(212, 175, 55, 0.3)",
                    "10px 10px 0px rgba(204, 122, 0, 0.3)",
                    "5px 5px 0px rgba(212, 175, 55, 0.3)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              >
                4
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[#CC7A00] font-medium text-lg tracking-widest uppercase"
              animate={{ 
                opacity: [0.5, 1, 0.5],
                y: [0, -5, 0],
                textShadow: [
                  "0 0 10px rgba(204, 122, 0, 0.3)",
                  "0 0 20px rgba(212, 175, 55, 0.6)",
                  "0 0 10px rgba(204, 122, 0, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                transform: `translateX(-50%) rotateX(${mousePosition.y * 0.1}deg)`
              }}
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

          {/* Enhanced Action Buttons with 3D Effects */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={itemVariants}
          >
            <Link href="/" className="group relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#CC7A00] to-[#D4AF37] text-white rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#D4AF37]/25 perspective-1000 transform-gpu">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#CC7A00] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                whileHover={{
                  rotateX: 5,
                  rotateY: 5,
                  transition: { duration: 0.2 }
                }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
              />
              <Home className="w-5 h-5 transition-transform group-hover:-translate-x-1 relative z-10" />
              <span className="relative z-10">Terug naar Home</span>
            </Link>

            <Link href="/services" className="group relative flex items-center gap-3 px-8 py-4 border-2 border-[#2F2F2F]/20 text-[#2F2F2F] rounded-full font-semibold text-lg backdrop-blur-sm transition-all duration-300 hover:bg-[#2F2F2F] hover:text-white hover:scale-105 perspective-1000 transform-gpu">
              <motion.div
                className="absolute inset-0 bg-[#2F2F2F] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                whileHover={{
                  rotateX: -5,
                  rotateY: -5,
                  transition: { duration: 0.2 }
                }}
              />
              <motion.div
                className="absolute inset-0 border-2 border-[#D4AF37] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0, 0.5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <Search className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Bekijk Diensten</span>
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