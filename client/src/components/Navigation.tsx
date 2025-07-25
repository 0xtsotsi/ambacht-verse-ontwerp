import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Users, Image, Heart, Flame, Phone, ChefHat } from "lucide-react";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const menuItems = [
    { name: "HOME", href: "#home", icon: <Home className="w-4 h-4" /> },
    { name: "SERVICES", href: "#services", icon: <ChefHat className="w-4 h-4" /> },
    { name: "GALERIJ", href: "#gallery", icon: <Image className="w-4 h-4" /> },
    { name: "EVENEMENTEN", href: "#events", icon: <Users className="w-4 h-4" /> },
    { name: "BBQ CATERING", href: "#bbq", icon: <Flame className="w-4 h-4" /> },
    { name: "CONTACT", href: "#contact", icon: <Phone className="w-4 h-4" /> },
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
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-gradient-to-r from-white/95 via-cream-50/95 to-white/95 backdrop-blur-md shadow-lg py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container-main">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#FF8A5B] rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground group-hover:text-[#FF6B35] transition-colors duration-300" style={{ fontFamily: 'Dancing Script, cursive' }}>
                Wesley's Ambacht
              </h1>
              <p className="text-xs text-gray-500 -mt-1" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                Ambachtelijk • Vers • Zoals vroeger
              </p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-nav text-foreground hover:text-accent transition-all duration-300 tracking-wide flex items-center space-x-2 group relative"
                style={{ fontFamily: 'Open Sans, sans-serif' }}
              >
                <span className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                  {item.icon}
                </span>
                <span className="relative">
                  {item.name}
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 group-hover:w-full transition-all duration-300"></div>
                </span>
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-foreground hover:text-accent transition-colors duration-300"
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
          <div className="flex flex-col space-y-4 py-6 bg-card rounded-lg shadow-lg">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-semibold text-foreground hover:text-accent transition-colors duration-300 px-6 py-2"
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