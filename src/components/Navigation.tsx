
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Home", href: "#home" },
    { name: "Over Ons", href: "#about" },
    { name: "Diensten", href: "#services" },
    { name: "Galerij", href: "#gallery" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-clean-white/95 backdrop-blur-sm z-50 border-b border-beige/30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-forest-green rounded-full flex items-center justify-center">
              <span className="text-warm-cream font-serif font-bold text-lg">W</span>
            </div>
            <div>
              <h1 className="font-serif text-xl text-forest-green font-bold">Wesley's Ambacht</h1>
              <p className="text-xs text-natural-brown italic">Ambachtelijk en vers... zoals vroeger</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-forest-green hover:text-burnt-orange transition-colors duration-300 font-medium"
              >
                {item.name}
              </a>
            ))}
            <Button className="bg-burnt-orange hover:bg-burnt-orange/90 text-clean-white px-6">
              <Phone className="w-4 h-4 mr-2" />
              0639581128
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-forest-green"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-beige/30">
            <div className="flex flex-col space-y-3 pt-4">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-forest-green hover:text-burnt-orange transition-colors duration-300 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <Button className="bg-burnt-orange hover:bg-burnt-orange/90 text-clean-white w-fit">
                <Phone className="w-4 h-4 mr-2" />
                0639581128
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
