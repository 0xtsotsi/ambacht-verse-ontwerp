
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
    <nav className="fixed top-0 w-full bg-elegant-light z-50 shadow-elegant-subtle animate-elegant-fade-in">
      <div className="container mx-auto px-8 py-6">
        <div className="flex items-center justify-center">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-16">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-elegant-nav hover:text-elegant-terracotta transition-colors duration-300 font-elegant-nav font-medium text-base tracking-wide"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-elegant-nav"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-6 pb-4 border-t border-elegant-nav/20">
            <div className="flex flex-col space-y-6 pt-6 text-center">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-elegant-nav hover:text-elegant-terracotta transition-colors duration-300 font-elegant-nav font-medium text-base"
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
