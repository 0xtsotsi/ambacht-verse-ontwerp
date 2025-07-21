
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const menuItems = useMemo(() => [
    { name: "HOME", href: "#home" },
    { name: "WIE ZIJN WIJ?", href: "#about" },
    { name: "GALERIJ", href: "#gallery" },
    { name: "GASTENBOEK", href: "#testimonials" },
    { name: "CONTACT", href: "#contact" },
  ], []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Update active section based on scroll position
      const sections = menuItems.map(item => item.href.slice(1));
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (currentSection) setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuItems]);

  return (
    <nav className={`fixed top-0 w-full z-50 backdrop-blur-md border-0 transition-all duration-700 ${
      scrolled 
        ? "bg-white/90 shadow-elegant-panel py-6" 
        : "bg-white/80 py-8"
    }`}>
      <div className="container mx-auto px-16">
        <div className="flex items-center justify-center">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-20">
            {menuItems.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                className={`font-elegant-nav font-medium text-sm tracking-[0.1em] uppercase relative group py-3 px-1 transition-all duration-500 transform hover:scale-105 ${
                  activeSection === item.href.slice(1)
                    ? "text-terracotta-600"
                    : "text-elegant-dark hover:text-terracotta-600"
                }`}
                style={{
                  transitionDelay: `${index * 50}ms`
                }}
              >
                {item.name}
                {/* Elegant underline with glow effect */}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-terracotta-500 to-terracotta-600 transition-all duration-500 transform origin-left ${
                  activeSection === item.href.slice(1)
                    ? "w-full animate-elegant-glow"
                    : "w-0 group-hover:w-full"
                }`}>
                  <span className="absolute inset-0 blur-sm bg-terracotta-500/50"></span>
                </span>
                {/* Hover glow effect */}
                <span className="absolute inset-0 rounded-lg transition-all duration-500 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-terracotta-100/0 via-terracotta-100/20 to-terracotta-100/0"></span>
              </a>
            ))}
          </div>

          {/* Mobile Menu Button with interactive animation */}
          <button
            className="md:hidden relative text-elegant-dark hover:text-terracotta-600 transition-all duration-500 p-4 group"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="absolute inset-0 rounded-full bg-terracotta-100/0 group-hover:bg-terracotta-100/30 transition-all duration-500 transform scale-0 group-hover:scale-110"></span>
            <span className="relative">
              {isOpen ? (
                <X className="w-5 h-5 transition-all duration-500 transform rotate-0 hover:rotate-90" />
              ) : (
                <Menu className="w-5 h-5 transition-all duration-500 transform hover:scale-110" />
              )}
            </span>
          </button>
        </div>

        {/* Mobile Menu with elegant slide animation */}
        <div className={`md:hidden overflow-hidden transition-all duration-700 transform ${
          isOpen ? "max-h-96 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-4"
        }`}>
          <div className="flex flex-col space-y-6 text-center mt-8 pb-8">
            {menuItems.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                className={`font-elegant-nav font-medium text-sm tracking-[0.1em] uppercase py-3 px-4 rounded-lg transition-all duration-500 transform hover:scale-105 hover:bg-terracotta-50/50 ${
                  activeSection === item.href.slice(1)
                    ? "text-terracotta-600 bg-terracotta-50/30"
                    : "text-elegant-dark hover:text-terracotta-600"
                }`}
                onClick={() => setIsOpen(false)}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: isOpen ? "interactive-slide-up 0.6s ease-out forwards" : "none"
                }}
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
