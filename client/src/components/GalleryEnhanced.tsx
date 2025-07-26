import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { premiumAnimations, fadeInUp } from "@/lib/animations";
import { ProgressiveImage } from "./ProgressiveImage";

// Import all authentic food images
import img1 from "@assets/1000005688_1753544636360.jpg";
import img2 from "@assets/1000005693_1753544636361.jpg";
import img3 from "@assets/1000005709_1753544636364.jpg";
import img4 from "@assets/1000005712_1753544636365.jpg";
import img5 from "@assets/1000005717_1753544636364.jpg";
import img6 from "@assets/1000005723_1753544636366.jpg";
import img7 from "@assets/1000005727_1753544636367.jpg";
import img8 from "@assets/1000005729_1753544636365.jpg";
import img9 from "@assets/1000005702_1753544636365.jpg";
import img10 from "@assets/1000005752_1753544636358.jpg";
import img11 from "@assets/1000005756_1753544636368.jpg";
import img12 from "@assets/1000005762_1753544636358.jpg";
import img13 from "@assets/1000005877_1753544636357.jpg";
import img14 from "@assets/1000005895_1753544636357.jpg";
import img15 from "@assets/1000005931_1753544636356.jpg";
import img16 from "@assets/1000005744_1753544636359.jpg";
import img17 from "@assets/1000005749_1753544636359.jpg";
import img18 from "@assets/1000005686_1753544636367.jpg";

const galleryImages = [
  { id: 1, src: img1, alt: "Couscous salade met verse groenten", category: "Salades" },
  { id: 2, src: img2, alt: "Artisanale burger broodjes", category: "Brood" },
  { id: 3, src: img3, alt: "Wesley's Ambacht burger broodjes", category: "Brood" },
  { id: 4, src: img4, alt: "Luxe broodje rosbief", category: "Lunch" },
  { id: 5, src: img5, alt: "Diverse lunch gerechten", category: "Lunch" },
  { id: 6, src: img6, alt: "Parmezaanse kaas topping", category: "Toppings" },
  { id: 7, src: img7, alt: "Professionele catering service", category: "Service" },
  { id: 8, src: img8, alt: "Verse ingrediënten", category: "Ingrediënten" },
  { id: 9, src: img9, alt: "Catering presentatie", category: "Presentatie" },
  { id: 10, src: img10, alt: "Broodje rosbief deluxe", category: "Lunch" },
  { id: 11, src: img11, alt: "Catering voorbereiding", category: "Service" },
  { id: 12, src: img12, alt: "Gerookte zalm sandwich", category: "Lunch" },
  { id: 13, src: img13, alt: "Wesley bij de BBQ", category: "BBQ" },
  { id: 14, src: img14, alt: "Gift voucher Wesley's Ambacht", category: "Cadeaubon" },
  { id: 15, src: img15, alt: "Outdoor catering service", category: "Events" },
  { id: 16, src: img16, alt: "Broodje met mosterdmayo", category: "Lunch" },
  { id: 17, src: img17, alt: "Luxe zalm sandwich", category: "Lunch" },
  { id: 18, src: img18, alt: "Buffet presentatie", category: "Buffet" }
];

const categories = ["Alle", "Lunch", "BBQ", "Salades", "Brood", "Service", "Events", "Buffet"];

export function GalleryEnhanced() {
  const [selectedCategory, setSelectedCategory] = useState("Alle");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const filteredImages = selectedCategory === "Alle" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const handlePrevious = () => {
    if (selectedImage !== null) {
      const currentIndex = filteredImages.findIndex(img => img.id === selectedImage);
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1;
      setSelectedImage(filteredImages[prevIndex].id);
    }
  };

  const handleNext = () => {
    if (selectedImage !== null) {
      const currentIndex = filteredImages.findIndex(img => img.id === selectedImage);
      const nextIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0;
      setSelectedImage(filteredImages[nextIndex].id);
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-8">
        <motion.div {...premiumAnimations.staggerContainer}>
          <motion.div className="text-center mb-16" {...fadeInUp()}>
            <p className="font-script text-3xl text-heritage-orange mb-4">
              Portfolio
            </p>
            <h2 className="text-5xl font-display font-bold text-craft-charcoal mb-6">
              CULINAIRE CREATIES
            </h2>
            <p className="text-xl text-craft-charcoal/70 max-w-3xl mx-auto">
              Ontdek onze passie voor ambachtelijke catering in elke foto
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-12"
            {...fadeInUp(0.2)}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-heritage-orange text-white shadow-lg"
                    : "bg-white text-craft-charcoal border-2 border-warm-gold/30 hover:border-heritage-orange"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Gallery Grid */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            {...premiumAnimations.staggerContainer}
          >
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                className="aspect-square cursor-pointer group relative overflow-hidden rounded-lg"
                onClick={() => setSelectedImage(image.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                {...fadeInUp(index * 0.05)}
              >
                <ProgressiveImage
                  src={image.src}
                  alt={image.alt}
                  className="rounded-lg overflow-hidden"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-sm font-semibold">{image.category}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Lightbox */}
          <AnimatePresence>
            {selectedImage !== null && (
              <motion.div
                className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedImage(null)}
              >
                <button
                  className="absolute top-8 right-8 text-white hover:text-heritage-orange transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(null);
                  }}
                >
                  <X size={32} />
                </button>
                
                <button
                  className="absolute left-8 top-1/2 -translate-y-1/2 text-white hover:text-heritage-orange transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevious();
                  }}
                >
                  <ChevronLeft size={48} />
                </button>
                
                <button
                  className="absolute right-8 top-1/2 -translate-y-1/2 text-white hover:text-heritage-orange transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                >
                  <ChevronRight size={48} />
                </button>

                <motion.img
                  src={galleryImages.find(img => img.id === selectedImage)?.src}
                  alt={galleryImages.find(img => img.id === selectedImage)?.alt}
                  className="max-w-full max-h-full object-contain"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={(e) => e.stopPropagation()}
                />
                
                <motion.div
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-center"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-lg">{galleryImages.find(img => img.id === selectedImage)?.alt}</p>
                  <p className="text-sm text-heritage-orange">{galleryImages.find(img => img.id === selectedImage)?.category}</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}