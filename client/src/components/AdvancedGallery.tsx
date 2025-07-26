import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, Grid, Camera } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { ProgressiveImage } from './ProgressiveImage';

const galleryCategories = [
  { id: 'all', name: 'Alle Evenementen', count: 48 },
  { id: 'weddings', name: 'Bruiloften', count: 18 },
  { id: 'corporate', name: 'Zakelijk', count: 12 },
  { id: 'social', name: 'Sociale Events', count: 10 },
  { id: 'bbq', name: 'BBQ & Grill', count: 8 }
];

const galleryImages = [
  {
    id: 1,
    src: '@assets/1000005907_1753439577476.jpg',
    category: 'weddings',
    title: 'Elegante Bruiloft Receptie',
    description: 'Prachtig gedekte tafels voor 200 gasten'
  },
  {
    id: 2,
    src: '@assets/1000005931_1753439577477.jpg',
    category: 'corporate',
    title: 'Executive Lunch Buffet',
    description: 'Premium zakelijke catering opstelling'
  },
  {
    id: 3,
    src: '@assets/1000005916_1753439577477.jpg',
    category: 'bbq',
    title: 'BBQ Extravaganza',
    description: 'Live grilling voor outdoor events'
  },
  {
    id: 4,
    src: '@assets/1000005886_1753439577476.jpg',
    category: 'social',
    title: 'Verjaardag Viering',
    description: 'Feestelijke catering voor 50 gasten'
  },
  {
    id: 5,
    src: '@assets/1000005880_1753439577477.jpg',
    category: 'weddings',
    title: 'Romantische Diner Setup',
    description: 'Intieme bruiloft setting'
  },
  {
    id: 6,
    src: '@assets/1000005871_1753439577475.jpg',
    category: 'corporate',
    title: 'Conferentie Catering',
    description: 'Professionele lunch service'
  },
  {
    id: 7,
    src: '@assets/1000005760_1753439577478.jpg',
    category: 'social',
    title: 'Jubileum Feest',
    description: '25-jarig huwelijksfeest'
  },
  {
    id: 8,
    src: '@assets/1000005739_1753439577480.jpg',
    category: 'bbq',
    title: 'Zomer BBQ Party',
    description: 'Outdoor grill evenement'
  }
];

const AdvancedGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const openLightbox = (image: any) => {
    setSelectedImage(image);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const navigateImage = (direction: 'next' | 'prev') => {
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = currentIndex === filteredImages.length - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
    }
    
    setSelectedImage(filteredImages[newIndex]);
  };

  return (
    <section ref={ref} className="py-24 bg-gradient-to-b from-[#FAF8F5] to-white">
      <div className="container mx-auto px-4">
        {/* Section Header with 3D effect */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-flex items-center gap-2 text-[#CC7A00] font-medium tracking-wider uppercase text-sm mb-4">
            <Camera className="w-5 h-5" />
            Galerij
            <Camera className="w-5 h-5" />
          </span>
          <h2 className="text-5xl md:text-6xl font-serif text-[#2F2F2F] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            Vastgelegde Momenten van Excellentie
          </h2>
          <p className="text-xl text-[#5F5F5F] max-w-3xl mx-auto" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Blader door onze portfolio van prachtig verzorgde evenementen en laat u inspireren voor uw speciale gelegenheid
          </p>
        </motion.div>

        {/* Category Filter with 3D buttons */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {galleryCategories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`relative px-6 py-3 rounded-full font-medium transition-all transform ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-[#CC7A00] to-[#D4AF37] text-white shadow-xl scale-105'
                  : 'bg-white text-[#2F2F2F] hover:bg-gray-100 shadow-md hover:shadow-lg'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {selectedCategory === category.id && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#CC7A00] rounded-full blur-xl opacity-50"
                  layoutId="categoryGlow"
                />
              )}
              <span className="relative z-10">
                {category.name}
                <span className="ml-2 text-sm opacity-70">({category.count})</span>
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Gallery Grid with 3D hover effects */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: 30 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -8,
                  rotateY: 5,
                  rotateX: 5,
                  transition: { duration: 0.3 }
                }}
                className="group cursor-pointer perspective-1000"
                onClick={() => openLightbox(image)}
              >
                <div className="relative overflow-hidden rounded-xl shadow-lg aspect-[4/3] transform-gpu">
                  <ProgressiveImage
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Gradient overlay with 3D effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Overlay Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-semibold text-lg mb-1">{image.title}</h3>
                    <p className="text-sm opacity-90">{image.description}</p>
                  </div>
                  
                  {/* 3D Zoom Icon */}
                  <motion.div 
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ZoomIn className="w-5 h-5 text-[#2F2F2F]" />
                  </motion.div>

                  {/* 3D shine effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View All Button with 3D effect */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.button 
            className="relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#2F2F2F] to-[#5F5F5F] text-white rounded-full font-semibold overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Grid className="w-5 h-5" />
              Bekijk Volledige Galerij
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#CC7A00] to-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatDelay: 2
              }}
            />
          </motion.button>
        </motion.div>
      </div>

      {/* Advanced Lightbox with 3D effects */}
      <AnimatePresence>
        {lightboxOpen && selectedImage && (
          <Lightbox
            image={selectedImage}
            onClose={closeLightbox}
            onNavigate={navigateImage}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

// Advanced Lightbox Component
const Lightbox = ({ image, onClose, onNavigate }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md"
      onClick={onClose}
    >
      <div className="relative h-full flex items-center justify-center p-4">
        {/* 3D floating background elements */}
        <motion.div
          className="absolute top-10 left-10 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Close Button with hover effect */}
        <motion.button
          onClick={onClose}
          className="absolute top-4 right-4 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors z-50"
          whileHover={{ scale: 1.1, rotate: 90 }}
          transition={{ duration: 0.2 }}
        >
          <X className="w-6 h-6" />
        </motion.button>

        {/* Navigation Buttons with 3D effect */}
        <motion.button
          onClick={(e) => { e.stopPropagation(); onNavigate('prev'); }}
          className="absolute left-4 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
          whileHover={{ scale: 1.1, x: -5 }}
        >
          <ChevronLeft className="w-6 h-6" />
        </motion.button>
        
        <motion.button
          onClick={(e) => { e.stopPropagation(); onNavigate('next'); }}
          className="absolute right-4 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors"
          whileHover={{ scale: 1.1, x: 5 }}
        >
          <ChevronRight className="w-6 h-6" />
        </motion.button>

        {/* Image Container with 3D effect */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotateY: -20 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0.8, opacity: 0, rotateY: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 150 }}
          className="relative max-w-6xl max-h-[85vh] w-full h-full perspective-1000"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={image.src}
            alt={image.title}
            className="w-full h-full object-contain rounded-lg shadow-2xl"
          />
          
          {/* Image Info with glassmorphism effect */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/50 to-transparent text-white backdrop-blur-sm rounded-b-lg"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-2xl font-semibold mb-2">{image.title}</h3>
            <p className="text-lg opacity-90">{image.description}</p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdvancedGallery;