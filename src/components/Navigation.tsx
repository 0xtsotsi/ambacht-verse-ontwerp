
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
    <nav className="fixed top-0 w-full bg-white/95 z-50 backdrop-blur-sm border-0">
      <div className="container mx-auto px-16 py-8">
        <div className="flex items-center justify-center">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-20">
            {menuItems.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                className="text-elegant-dark hover:text-terracotta-600 transition-all duration-300 font-elegant-nav font-medium text-sm tracking-[0.1em] uppercase relative group py-2"
              >
                {item.name}
                <span className="absolute -bottom-2 left-0 w-0 h-px bg-terracotta-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-elegant-dark hover:text-terracotta-600 transition-all duration-300 p-4"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-16 pb-8">
            <div className="flex flex-col space-y-8 text-center">
              {menuItems.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-elegant-dark hover:text-terracotta-600 transition-all duration-300 font-elegant-nav font-medium text-sm tracking-[0.1em] uppercase py-2"
                  onClick={() => setIsOpen(false)}
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
