import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ChefHat, Users, Heart, Star, Calendar, Phone, MapPin, Clock } from "lucide-react";

// Import images
import weddingHero from "@assets/1000005907_1753439577476.jpg";
import freshInspiredImg from "@assets/1000005886_1753439577476.jpg";
import servicesImg from "@assets/1000005880_1753439577477.jpg";
import venuesImg from "@assets/1000005916_1753439577477.jpg";
import weddingTable from "@assets/1000005871_1753439577475.jpg";
import chefImg from "@assets/1000005931_1753439577477.jpg";

const BruiloftenPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 500], [0, 150]);

  useEffect(() => {
    setIsLoaded(true);
    window.scrollTo(0, 0);
  }, []);

  // Reveal animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section - Soprano's Style */}
      <motion.section
        className="relative h-[70vh] overflow-hidden"
        style={{ y: heroParallax }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${weddingHero})`,
            filter: 'brightness(0.7)'
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative h-full flex items-center justify-center text-center text-white z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="max-w-4xl px-4"
          >
            <h1 className="text-7xl md:text-8xl font-bold mb-6" style={{
              fontFamily: 'Playfair Display, serif',
              letterSpacing: '0.15em'
            }}>
              BRUILOFTEN
            </h1>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto" />
          </motion.div>
        </div>
      </motion.section>

      {/* Weddings Introduction - Soprano's Style */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Image */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInLeft}
              className="relative overflow-hidden rounded-lg shadow-2xl"
            >
              <img 
                src={weddingTable} 
                alt="Wedding Table Setting" 
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </motion.div>

            {/* Right Content */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInRight}
              className="text-center md:text-left"
            >
              <div className="flex items-center justify-center md:justify-start mb-6">
                <div className="w-16 h-16 bg-[#F9F6F1] rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-[#D4AF37]" />
                </div>
              </div>
              
              <h2 className="text-5xl font-bold mb-6" style={{
                fontFamily: 'Playfair Display, serif',
                color: '#2C2C2C'
              }}>
                WEDDINGS
              </h2>
              
              <div className="w-20 h-1 bg-[#D4AF37] mb-8" />
              
              <p className="text-gray-600 leading-relaxed mb-8" style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '1.1rem'
              }}>
                We couldn't be happier that you're considering us to cater your wedding. Our chefs understand the importance of your wedding day and will work closely with you to ensure every detail is considered and every expectation exceeded.
              </p>
              
              <Button
                className="px-8 py-4 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #CC7A00 0%, #D4AF37 100%)',
                  fontFamily: 'Open Sans, sans-serif'
                }}
              >
                Wedding Menus
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Fresh & Inspired Section - Exact Soprano's Style */}
      <section className="py-24 bg-[#F9F6F1]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInLeft}
              className="text-center md:text-left order-2 md:order-1"
            >
              <div className="flex items-center justify-center md:justify-start mb-6">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <ChefHat className="w-8 h-8 text-[#CC7A00]" />
                </div>
              </div>
              
              <h2 className="text-5xl font-bold mb-6" style={{
                fontFamily: 'Playfair Display, serif',
                color: '#2C2C2C'
              }}>
                FRESH & INSPIRED
              </h2>
              
              <div className="w-20 h-1 bg-[#CC7A00] mb-8" />
              
              <p className="text-gray-600 leading-relaxed mb-8" style={{
                fontFamily: 'Open Sans, sans-serif',
                fontSize: '1.1rem'
              }}>
                Culinaire innovatie en onberispelijke service is het fundament van Wesley's Ambacht. Wij zijn toegewijd aan het bouwen van langdurige relaties gebaseerd op persoonlijke service en uitzonderlijke kwaliteit. Kies uit een van onze menu-opties of laat onze chefs een menu speciaal voor u ontwerpen.
              </p>
              
              <Button
                className="px-8 py-4 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #CC7A00 0%, #D4AF37 100%)',
                  fontFamily: 'Open Sans, sans-serif'
                }}
              >
                Social Events
              </Button>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInRight}
              className="relative overflow-hidden rounded-lg shadow-2xl order-1 md:order-2"
            >
              <img 
                src={freshInspiredImg} 
                alt="Fresh & Inspired" 
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Service Styles & Venues Section - Soprano's Style */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Service Styles */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInLeft}
              className="relative h-[500px] overflow-hidden rounded-lg group cursor-pointer"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${servicesImg})` }}
              />
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-300" />
              
              <div className="relative h-full flex flex-col items-center justify-center text-white text-center p-8 z-10">
                <h2 className="text-4xl font-bold mb-6" style={{
                  fontFamily: 'Playfair Display, serif',
                  letterSpacing: '0.1em'
                }}>
                  SERVICE STYLES
                </h2>
                
                <p className="max-w-md mx-auto mb-8 text-lg" style={{
                  fontFamily: 'Open Sans, sans-serif'
                }}>
                  Wesley's Ambacht maakt catering gemakkelijk met verschillende service style opties. Van afhalen en afleveren tot full service pakketten, er is een optie die geschikt is voor elke speciale gelegenheid.
                </p>
                
                <Button
                  className="px-8 py-3 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white text-white font-semibold hover:bg-white hover:text-[#CC7A00] transition-all duration-300"
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                >
                  Service Styles
                </Button>
              </div>
            </motion.div>

            {/* Venues & Vendors */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInRight}
              className="relative h-[500px] overflow-hidden rounded-lg group cursor-pointer"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${venuesImg})` }}
              />
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-colors duration-300" />
              
              <div className="relative h-full flex flex-col items-center justify-center text-white text-center p-8 z-10">
                <h2 className="text-4xl font-bold mb-6" style={{
                  fontFamily: 'Playfair Display, serif',
                  letterSpacing: '0.1em'
                }}>
                  VENUES & VENDORS
                </h2>
                
                <p className="max-w-md mx-auto mb-8 text-lg" style={{
                  fontFamily: 'Open Sans, sans-serif'
                }}>
                  Af en toe komen we mensen en bedrijven tegen die onze passie voor uitmuntendheid delen. Als we dat doen, zijn we blij om ze aan onze klanten aan te bevelen. Hieronder vindt u een paar partners waar we trots op zijn om te delen met u.
                </p>
                
                <Button
                  className="px-8 py-3 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white text-white font-semibold hover:bg-white hover:text-[#CC7A00] transition-all duration-300"
                  style={{ fontFamily: 'Open Sans, sans-serif' }}
                >
                  Venues & Vendors
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* We Are Here To Serve You Section */}
      <section className="py-24 bg-[#F9F6F1] relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#CC7A00]" />
        
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-5xl font-bold mb-8" style={{
              fontFamily: 'Playfair Display, serif',
              color: '#2C2C2C',
              letterSpacing: '0.05em'
            }}>
              WE ARE HERE TO SERVE YOU
            </h2>
            
            <p className="text-gray-600 leading-relaxed mb-8" style={{
              fontFamily: 'Open Sans, sans-serif',
              fontSize: '1.2rem'
            }}>
              We kunnen een offerte voor u voorbereiden voor slechts een paar pannen met eten voor een kleine bijeenkomst of helpen bij het plannen van uw volgende grote viering. We hebben relaties met alle beste leveranciers van evenementen in het gebied en kunnen fungeren als uw one-stop-shop voor alles wat met evenementen te maken heeft. Neem vandaag contact op met onze evenementenspecialisten om te zien of uw datum beschikbaar is. We kijken ernaar uit om meer over uw evenement te horen!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#CC7A00] to-[#D4AF37] text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
            className="text-center"
          >
            <h2 className="text-5xl font-bold mb-8" style={{
              fontFamily: 'Playfair Display, serif'
            }}>
              Begin Met Het Plannen Van Uw Perfecte Dag
            </h2>
            
            <p className="text-xl mb-12 max-w-2xl mx-auto" style={{
              fontFamily: 'Open Sans, sans-serif'
            }}>
              Laat ons helpen om uw droombruiloft werkelijkheid te maken met onze uitzonderlijke catering services.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-[#CC7A00] hover:bg-gray-100 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105"
              >
                <Phone className="mr-2 h-5 w-5" />
                Bel Ons Nu
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#CC7A00] px-8 py-4 rounded-full font-semibold transition-all duration-300"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Check Beschikbaarheid
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BruiloftenPage;