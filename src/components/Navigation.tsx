
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "HOME", href: "#home" },
    { name: "WIE ZIJN WIJ?", href: "#about" },
    { name: "GALERIJ", href: "#gallery" },
    { name: "GASTENBOEK", href: "#testimonials" },
    { name: "CONTACT", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-gradient-to-br from-elegant-light/85 via-terracotta-50/30 to-elegant-light/90 z-50 shadow-organic-natural backdrop-blur-md animate-organic-grow border-b border-terracotta-200/30 rounded-b-3xl">
      <div className="container mx-auto px-8 py-6">
        <div className="flex items-center justify-center">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                className="relative text-elegant-nav hover:text-terracotta-600 transition-all duration-500 font-elegant-nav font-semibold text-base tracking-wide group px-4 py-2 rounded-full hover:bg-terracotta-50/60 transform hover:scale-105"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: 'organic-grow 0.8s ease-out forwards'
                }}
              >
                {item.name}
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-terracotta-400 to-terracotta-600 transition-all duration-500 group-hover:w-8 rounded-full"></span>
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-elegant-nav hover:text-terracotta-600 transition-all duration-500 p-3 rounded-full hover:bg-terracotta-100/60 shadow-organic-soft hover:shadow-organic-natural transform hover:scale-110 animate-organic-breathe"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-6 pb-4 border-t border-terracotta-200/30 rounded-b-2xl">
            <div className="flex flex-col space-y-4 pt-6 text-center">
              {menuItems.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-elegant-nav hover:text-terracotta-600 transition-all duration-500 font-elegant-nav font-semibold text-base py-3 px-6 rounded-full hover:bg-terracotta-100/60 transform hover:scale-105 shadow-organic-soft hover:shadow-organic-natural mx-4"
                  onClick={() => setIsOpen(false)}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: 'organic-grow 0.6s ease-out forwards'
                  }}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
