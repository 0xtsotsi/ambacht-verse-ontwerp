
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
    <nav className="fixed top-0 w-full bg-forest-green z-50 shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-center">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-12">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-warm-cream hover:text-burnt-orange transition-colors duration-300 font-medium text-lg letter-spacing-wide"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-warm-cream"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-warm-cream/30">
            <div className="flex flex-col space-y-4 pt-4 text-center">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-warm-cream hover:text-burnt-orange transition-colors duration-300 font-medium text-lg"
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
