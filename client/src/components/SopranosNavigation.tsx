import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export const SopranosNavigation = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [location] = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const services = [
    { id: 'corporate', label: 'Corporate Events', href: '/corporate' },
    { id: 'social', label: 'Social Events', href: '/social' },
    { id: 'weddings', label: 'Weddings', href: '/wedding' },
    { id: 'bbq', label: 'Grill & BBQ', href: '/bbq' },
    { id: 'gallery', label: 'Galerij', href: '/gallery' }
  ];

  // Set active tab based on current location
  useEffect(() => {
    const currentIndex = services.findIndex(service => service.href === location);
    if (currentIndex !== -1) {
      setActiveTab(currentIndex);
    }
  }, [location]);

  return (
    <section className="py-8 bg-gradient-to-b from-[#FAF8F5] to-white">
      <div className="container mx-auto px-4">
        <div className={`flex flex-wrap justify-center gap-4 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`transition-all duration-500 delay-${index * 100}`}
              style={{
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                opacity: isVisible ? 1 : 0,
                transitionDelay: `${index * 0.1}s`
              }}
            >
              <Link href={service.href}>
                <Button
                  variant="ghost"
                  className={`px-6 py-3 rounded-full font-medium text-base transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 hover:-translate-y-1 ${
                    location === service.href
                      ? 'bg-gradient-to-r from-[#CC7A00] to-[#D4AF37] text-white shadow-xl'
                      : 'bg-white text-[#2F2F2F] hover:bg-gradient-to-r hover:from-[#D4AF37]/10 hover:to-[#CC7A00]/10 hover:text-[#CC7A00] border border-[#CC7A00]/20'
                  }`}
                  style={{
                    fontFamily: 'Open Sans, sans-serif',
                    fontWeight: '500',
                    letterSpacing: '0.025em'
                  }}
                  onMouseEnter={() => setActiveTab(index)}
                >
                  {service.label}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};