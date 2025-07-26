import React, { useState, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Calendar, Users, Utensils, Flame, Sparkles, ChefHat, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'wouter';
import { ProgressiveImage } from './ProgressiveImage';

const services = [
  {
    id: 'corporate',
    title: 'Zakelijke Evenementen',
    subtitle: 'Professionele Excellentie',
    description: 'Verhef uw zakelijke bijeenkomsten met onze premium catering oplossingen',
    image: '@assets/1000005686_1753439577482.jpg',
    icon: <Users className="w-6 h-6" />,
    features: [
      'Executive Ontbijt & Lunch',
      'Cocktail Recepties',
      'Team Building Events',
      'Conferentie Catering'
    ],
    stats: { events: '500+', satisfaction: '98%' },
    color: 'from-blue-600 to-indigo-700',
    link: '/corporate'
  },
  {
    id: 'weddings',
    title: 'Bruiloften',
    subtitle: 'Uw Perfecte Dag',
    description: 'Creëer onvergetelijke herinneringen met onze exquise bruiloft catering',
    image: '@assets/1000005907_1753439577476.jpg',
    icon: <Sparkles className="w-6 h-6" />,
    features: [
      'Fine Dining',
      'Elegante Buffetten',
      'Cocktail Uren',
      'Custom Menu Design'
    ],
    stats: { couples: '1000+', rating: '5.0★' },
    color: 'from-pink-600 to-rose-700',
    link: '/wedding'
  },
  {
    id: 'social',
    title: 'Sociale Evenementen',
    subtitle: 'Vier in Stijl',
    description: 'Van intieme bijeenkomsten tot grote vieringen, wij maken elk moment speciaal',
    image: '@assets/1000005931_1753439577477.jpg',
    icon: <Utensils className="w-6 h-6" />,
    features: [
      'Verjaardagsfeesten',
      'Jubilea',
      'Diploma-uitreikingen',
      'Feestdagen'
    ],
    stats: { guests: '50K+', venues: '200+' },
    color: 'from-purple-600 to-indigo-700',
    link: '/social'
  },
  {
    id: 'bbq',
    title: 'BBQ & Grill',
    subtitle: 'Authentieke Smaken',
    description: 'Ervaar de ultieme outdoor dining met onze premium BBQ catering',
    image: '@assets/1000005916_1753439577477.jpg',
    icon: <Flame className="w-6 h-6" />,
    features: [
      'Live Grill Stations',
      'Gerookte Specialiteiten',
      'Vegetarische Opties',
      'Traditionele Bijgerechten'
    ],
    stats: { meats: '15+', experience: '30jr' },
    color: 'from-orange-600 to-red-700',
    link: '/bbq'
  }
];

const AdvancedServiceGrid = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-b from-[#FAF8F5] to-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-flex items-center gap-2 text-[#CC7A00] font-medium tracking-wider uppercase text-sm mb-4">
            <ChefHat className="w-5 h-5" />
            Onze Diensten
            <ChefHat className="w-5 h-5" />
          </span>
          <h2 className="text-5xl md:text-6xl font-serif text-[#2F2F2F] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Catering Oplossingen voor Elke Gelegenheid
          </h2>
          <p className="text-xl text-[#5F5F5F] max-w-3xl mx-auto" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Van boardroom tot balzaal, achtertuin tot strand, wij brengen culinaire excellentie 
            en onberispelijke service naar uw speciale evenementen
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link href="/services" className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#CC7A00] to-[#D4AF37] text-white rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            Ontdek Alle Diensten
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// Individual Service Card Component
const ServiceCard = ({ service, index, isInView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  
  // Mouse position tracking for parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring animation for mouse movement
  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);
  
  // Transform values for 3D effect
  const rotateX = useTransform(y, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-5, 5]);
  
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const normalizedX = (e.clientX - centerX) / rect.width;
    const normalizedY = (e.clientY - centerY) / rect.height;
    
    mouseX.set(normalizedX);
    mouseY.set(normalizedY);
  };
  
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative group"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        rotateX,
        rotateY
      }}
    >
      <Link href={service.link}>
          <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl transition-all duration-500 group-hover:shadow-2xl">
            {/* Background Image */}
            <div className="absolute inset-0">
              <ProgressiveImage
                src={service.image}
                alt={service.title}
                className="w-full h-full"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-80 group-hover:opacity-90 transition-opacity duration-500`} />
            </div>

            

            {/* Decorative Elements */}
            <motion.div
              className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"
              animate={isHovered ? { scale: 1.5, opacity: 0.3 } : { scale: 1, opacity: 0.1 }}
              transition={{ duration: 0.5 }}
            />
            <motion.div
              className="absolute bottom-4 left-4 w-32 h-32 bg-white/10 rounded-full blur-3xl"
              animate={isHovered ? { scale: 1.3, opacity: 0.3 } : { scale: 1, opacity: 0.1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
      </Link>
    </motion.div>
  );
};

export default AdvancedServiceGrid;