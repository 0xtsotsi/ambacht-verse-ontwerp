import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 },
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer className="bg-[#2C2C2C] text-white" ref={footerRef}>
      {/* Main Footer Content - matching Soprano's clean layout */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* About Column */}
            <div
              className={`transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <h3
                className="text-3xl mb-4"
                style={{
                  fontFamily: "Great Vibes, cursive",
                  color: "#D4AF37",
                }}
              >
                Wesley's Ambacht
              </h3>
              <p
                className="text-gray-300 leading-relaxed mb-6"
                style={{
                  fontFamily: "Open Sans, sans-serif",
                  fontSize: "14px",
                  lineHeight: "1.8",
                }}
              >
                Van het handmatig selecteren van onze eigen producten
                rechtstreeks van de lokale markt, tot het maken van onze eigen
                salades en dressings, Wesley's Ambacht doet alles op de oude
                manier! Bij Wesley's Ambacht garanderen we dat u zult genieten
                van ons uitstekende eten, professionele service en
                concurrerende prijzen.
              </p>
            </div>

            {/* Quick Links Column */}
            <div
              className={`transition-all duration-1000 delay-200 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <h4
                className="text-xl font-semibold mb-6 text-white"
                style={{
                  fontFamily: "Open Sans, sans-serif",
                  letterSpacing: "0.05em",
                }}
              >
                QUICK LINKS
              </h4>
              <ul className="space-y-3">
                {[
                  "Home",
                  "Corporate Events",
                  "Social Events",
                  "Bruiloften",
                  "Grill & BBQ",
                  "Bij Het Dienblad",
                  "Contact",
                ].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-[#E86C32] transition-colors duration-300"
                      style={{
                        fontFamily: "Open Sans, sans-serif",
                        fontSize: "14px",
                      }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Column */}
            <div
              className={`transition-all duration-1000 delay-400 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <h4
                className="text-xl font-semibold mb-6 text-white"
                style={{
                  fontFamily: "Open Sans, sans-serif",
                  letterSpacing: "0.05em",
                }}
              >
                CONTACT INFO
              </h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-[#E86C32] mt-0.5" />
                  <div>
                    <p
                      className="text-gray-300"
                      style={{
                        fontFamily: "Open Sans, sans-serif",
                        fontSize: "14px",
                      }}
                    >
                      06 212 226 58
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-[#E86C32] mt-0.5" />
                  <div>
                    <p
                      className="text-gray-300"
                      style={{
                        fontFamily: "Open Sans, sans-serif",
                        fontSize: "14px",
                      }}
                    >
                      info@wesleyambacht.nl
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#E86C32] mt-0.5" />
                  <div>
                    <p
                      className="text-gray-300"
                      style={{
                        fontFamily: "Open Sans, sans-serif",
                        fontSize: "14px",
                      }}
                    >
                      Nieuweweg 79<br />
                      3251 AS Stellendam
                    </p>
                  </div>
                </div>

                {/* Social Media Icons */}
                <div className="flex space-x-4 mt-6">
                  <a
                    href="#"
                    className="w-10 h-10 bg-[#E86C32] rounded-full flex items-center justify-center hover:bg-[#D85A1A] transition-all duration-300 transform hover:scale-110"
                  >
                    <Facebook className="w-5 h-5 text-white" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-[#E86C32] rounded-full flex items-center justify-center hover:bg-[#D85A1A] transition-all duration-300 transform hover:scale-110"
                  >
                    <Instagram className="w-5 h-5 text-white" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p
                className="text-gray-400 text-sm mb-4 md:mb-0"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                © 2024 Wesley's Ambacht Catering. Alle rechten voorbehouden.
              </p>
              <div className="flex space-x-6">
                {["Privacy Beleid", "Algemene Voorwaarden"].map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="text-gray-400 hover:text-[#E86C32] text-sm transition-colors duration-300"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};