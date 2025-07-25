import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Users, Image, Heart, Flame, Phone, ChefHat } from "lucide-react";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const menuItems = [
    { name: "HOME", href: "#home" },
    { name: "SERVICES", href: "#services" },
    { name: "GALERIJ", href: "#gallery" },
    { name: "EVENEMENTEN", href: "#events" },
    { name: "BBQ CATERING", href: "#bbq" },
    { name: "CONTACT", href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-md py-3" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo - Soprano's style script font */}
          <div className="flex items-center">
            <h1 className={`text-3xl transition-colors duration-300 ${
              scrolled ? "text-gray-800" : "text-white"
            }`} style={{ 
              fontFamily: 'Great Vibes, cursive',
              fontWeight: '400'
            }}>
              Wesley's Ambacht
            </h1>
          </div>

          {/* Desktop Menu - Soprano's style horizontal nav */}
          <div className="hidden lg:flex items-center space-x-12">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-sm font-medium tracking-widest transition-colors duration-300 relative group ${
                  scrolled ? "text-gray-700 hover:text-[#E86C32]" : "text-white hover:text-[#D4AF37]"
                }`}
                style={{ fontFamily: 'Open Sans, sans-serif' }}
              >
                {item.name}
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#E86C32] group-hover:w-full transition-all duration-300"></div>
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden transition-colors duration-300 ${
              scrolled ? "text-gray-700 hover:text-[#E86C32]" : "text-white hover:text-[#D4AF37]"
            }`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-96 opacity-100 mt-6" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col space-y-4 py-6 bg-white/95 backdrop-blur-md rounded-lg shadow-lg">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-[#E86C32] transition-colors duration-300 px-6 py-2 tracking-wide"
                onClick={() => setIsOpen(false)}
                style={{ fontFamily: 'Open Sans, sans-serif' }}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};