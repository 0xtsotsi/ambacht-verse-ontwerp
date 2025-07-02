
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
    <nav className="fixed top-0 w-full bg-gradient-to-r from-elegant-light via-elegant-light/95 to-elegant-light z-50 shadow-elegant-soft backdrop-blur-sm animate-elegant-fade-in border-b border-terracotta-100">
      <div className="container mx-auto px-8 py-6">
        <div className="flex items-center justify-center">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-12">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="relative text-elegant-nav hover:text-terracotta-500 transition-all duration-300 font-elegant-nav font-semibold text-base tracking-wide group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-terracotta-400 to-terracotta-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-elegant-nav hover:text-terracotta-500 transition-all duration-300 p-2 rounded-lg hover:bg-terracotta-50"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-6 pb-4 border-t border-terracotta-200/50">
            <div className="flex flex-col space-y-6 pt-6 text-center">
              {menuItems.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-elegant-nav hover:text-terracotta-500 transition-all duration-300 font-elegant-nav font-semibold text-base py-3 px-4 rounded-lg hover:bg-terracotta-50 transform hover:scale-105"
                  onClick={() => setIsOpen(false)}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animation: 'elegant-fade-in 0.5s ease-out forwards'
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
