import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Image, Camera, Sparkles, ZoomIn, X } from "lucide-react";
import { FloatingBookingWidget } from "@/components/FloatingBookingWidget";

// Import all gallery images
import image1 from "@assets/1000005684_1753439577478.jpg";
import image2 from "@assets/1000005686_1753439577482.jpg";
import image3 from "@assets/1000005690_1753439577479.jpg";
import image4 from "@assets/1000005693_1753439577478.jpg";
import image5 from "@assets/1000005705_1753439577479.jpg";
import image6 from "@assets/1000005722_1753439577481.jpg";
import image7 from "@assets/1000005723_1753439577480.jpg";
import image8 from "@assets/1000005727_1753439577481.jpg";
import image9 from "@assets/1000005737_1753439577482.jpg";
import image10 from "@assets/1000005739_1753439577480.jpg";
import image11 from "@assets/1000005760_1753439577478.jpg";
import image12 from "@assets/1000005871_1753439577475.jpg";
import image13 from "@assets/1000005880_1753439577477.jpg";
import image14 from "@assets/1000005886_1753439577476.jpg";
import image15 from "@assets/1000005907_1753439577476.jpg";
import image16 from "@assets/1000005916_1753439577477.jpg";
import image17 from "@assets/1000005931_1753439577477.jpg";

export const GalleryPage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHeroLoaded(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const galleryItems = [
    { id: 1, image: image1, category: "wedding", title: "Elegant Wedding Spread", description: "Luxurious bruiloft catering met premium ingredients" },
    { id: 2, image: image2, category: "corporate", title: "Corporate Lunch", description: "Professional business lunch setup" },
    { id: 3, image: image3, category: "bbq", title: "BBQ Specialties", description: "Authentic grill specialiteiten" },
    { id: 4, image: image4, category: "social", title: "Birthday Celebration", description: "Vrolijke verjaardag catering" },
    { id: 5, image: image5, category: "wedding", title: "Wedding Appetizers", description: "Verfijnde voorgerechten voor bruiloften" },
    { id: 6, image: image6, category: "bbq", title: "Outdoor Grilling", description: "Live outdoor cooking experience" },
    { id: 7, image: image7, category: "corporate", title: "Executive Meeting", description: "High-end corporate catering" },
    { id: 8, image: image8, category: "social", title: "Family Gathering", description: "Warme familie bijeenkomst" },
    { id: 9, image: image9, category: "wedding", title: "Reception Dinner", description: "Signature bruiloft dinner service" },
    { id: 10, image: image10, category: "bbq", title: "Premium BBQ", description: "Luxury BBQ experience" },
    { id: 11, image: image11, category: "social", title: "Anniversary Party", description: "Elegant jubileum viering" },
    { id: 12, image: image12, category: "bbq", title: "Traditional Grill", description: "Klassieke BBQ specialiteiten" },
    { id: 13, image: image13, category: "corporate", title: "Conference Catering", description: "All-day conference service" },
    { id: 14, image: image14, category: "wedding", title: "Bridal Service", description: "Premium bruidspaar service" },
    { id: 15, image: image15, category: "social", title: "Holiday Celebration", description: "Feestelijke holiday catering" },
    { id: 16, image: image16, category: "corporate", title: "Business Lunch", description: "Professional lunch presentation" },
    { id: 17, image: image17, category: "wedding", title: "Wedding Desserts", description: "Artisanale bruiloft desserts" }
  ];

  const categories = [
    { key: "all", label: "ALLE FOTO'S", icon: Image },
    { key: "wedding", label: "BRUILOFTEN", icon: Sparkles },
    { key: "corporate", label: "CORPORATE", icon: Camera },
    { key: "social", label: "SOCIALE EVENTS", icon: Camera },
    { key: "bbq", label: "BBQ CATERING", icon: Camera }
  ];

  const filteredItems = activeCategory === "all" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  const scrollToGallery = () => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen">
      <FloatingBookingWidget />
      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${image14})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        
        <div className={`relative z-10 text-center text-white px-4 transition-all duration-1000 ${
          heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="flex items-center justify-center gap-3 mb-6">
            <Camera className="w-8 h-8 text-[#D4AF37]" />
            <p className="text-script text-2xl" style={{ color: '#D4AF37', fontFamily: 'Great Vibes, cursive' }}>
              Visual Stories
            </p>
          </div>
          <h1 className="text-white mb-8" style={{ 
            fontSize: '5rem', 
            fontWeight: '900', 
            lineHeight: '1.1',
            fontFamily: 'Playfair Display, serif',
            textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
            letterSpacing: '0.02em'
          }}>
            GALERIJ
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Ontdek onze culinaire kunstwerken en event momenten door de lens van professionele fotografie. 
            Elke afbeelding vertelt het verhaal van onze passie voor perfectie.
          </p>
        </div>

        {/* Scroll Arrow */}
        <div 
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer group"
          onClick={scrollToGallery}
        >
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 shadow-lg group-hover:scale-110">
            <ChevronDown className="w-6 h-6 text-white group-hover:text-[#E86C32] transition-colors duration-300" />
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-[#F9F6F1]" ref={sectionRef}>
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className={`max-w-4xl mx-auto text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-4xl font-bold mb-8 text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              ONZE CULINAIRE KUNSTWERKEN
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#E86C32] to-[#D4B170] mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 leading-relaxed" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              Van elegante bruiloften tot zakelijke evenementen - bekijk onze portfolio van 
              culinaire creaties en event momenten die onze passie voor excellentie demonstreren.
            </p>
          </div>

          {/* Category Filter */}
          <div className={`text-center mb-12 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.key}
                    onClick={() => setActiveCategory(category.key)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
                      activeCategory === category.key
                        ? 'text-white'
                        : 'bg-white text-[#E86C32] border-2 border-[#E86C32] hover:bg-[#E86C32] hover:text-white'
                    }`}
                    style={{
                      background: activeCategory === category.key ? 'linear-gradient(135deg, #E86C32 0%, #D4B170 100%)' : '',
                      border: activeCategory === category.key ? 'none' : ''
                    }}
                  >
                    <IconComponent className="w-4 h-4" />
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gallery Grid */}
          <div className={`transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item, index) => (
                <div 
                  key={item.id}
                  className={`group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-105 ${
                    index % 4 === 0 ? 'md:col-span-2 md:row-span-2' : ''
                  }`}
                  onClick={() => setSelectedImage(item.image)}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img 
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="text-center text-white p-4">
                        <ZoomIn className="w-8 h-8 mx-auto mb-2" />
                        <h4 className="text-lg font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                          {item.title}
                        </h4>
                        <p className="text-sm" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className={`mt-20 transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="text-3xl font-bold text-[#E86C32] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  500+
                </div>
                <p className="text-gray-600" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                  Succesvolle Events
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="text-3xl font-bold text-[#E86C32] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  10K+
                </div>
                <p className="text-gray-600" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                  Tevreden Gasten
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="text-3xl font-bold text-[#E86C32] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  15+
                </div>
                <p className="text-gray-600" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                  Jaar Ervaring
                </p>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className={`text-center mt-16 transition-all duration-1000 delay-900 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="bg-gradient-to-r from-[#E86C32] to-[#D4B170] text-white px-8 py-6 rounded-2xl inline-block shadow-xl">
              <h4 className="text-xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Wilt U Ook Zo'n Event?
              </h4>
              <p className="mb-4" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                Laat ons uw volgende evenement net zo memorabel maken
              </p>
              <Button 
                className="bg-white text-[#E86C32] hover:bg-gray-100 font-bold px-8 py-3 rounded-full transition-all duration-300"
              >
                Start Uw Event Planning
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-[#E86C32] transition-colors duration-300"
            >
              <X className="w-8 h-8" />
            </button>
            <img 
              src={selectedImage}
              alt="Gallery Image"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};