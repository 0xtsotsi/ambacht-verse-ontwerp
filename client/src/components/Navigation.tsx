import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const menuItems = useMemo(
    () => [
      { name: "Home", href: "#home" },
      { name: "Wie zijn wij", href: "#about" },
      { name: "Services", href: "#services" },
      { name: "Galerij", href: "#gallery" },
      { name: "Contact", href: "#contact" },
    ],
    [],
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Update active section based on scroll position
      const sections = menuItems.map((item) => item.href.slice(1));
      const currentSection = sections.find((section) => {
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
    <nav
      className={`fixed top-0 w-full z-50 backdrop-blur-md transition-all duration-300 ${
        scrolled ? "bg-card/90 shadow-sm py-4" : "bg-card/80 py-6"
      }`}
    >
      <div className="container-main">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-heading text-charcoal font-semibold">
              Wesley's Ambacht
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-body font-medium transition-all duration-300 hover:text-accent-orange relative group ${
                  activeSection === item.href.slice(1)
                    ? "text-accent-orange"
                    : "text-charcoal"
                }`}
              >
                {item.name}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-accent-orange transition-all duration-300 origin-left ${
                    activeSection === item.href.slice(1)
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                />
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden relative text-charcoal hover:text-accent-orange transition-all duration-300 p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isOpen
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col space-y-4 text-center mt-6 pb-6">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-body font-medium py-2 px-4 rounded-lg transition-all duration-300 ${
                  activeSection === item.href.slice(1)
                    ? "text-accent-orange bg-cream-light"
                    : "text-charcoal hover:text-accent-orange"
                }`}
                onClick={() => setIsOpen(false)}
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
