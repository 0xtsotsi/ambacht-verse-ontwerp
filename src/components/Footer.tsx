
import { Heart, Phone, Mail, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-16 py-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-24">
            {/* Clean Brand Column */}
            <div className="md:col-span-2">
              <div className="mb-16">
                <h3 className="font-elegant-heading text-4xl font-light text-white mb-4">Wesley's Ambacht</h3>
                <p className="text-gray-400 font-elegant-script text-xl font-light">Ambachtelijk en vers... zoals vroeger</p>
              </div>
              
              <p className="text-gray-300 leading-relaxed mb-16 max-w-lg text-lg font-elegant-body font-light">
                Met passie en vakmanschap creëren wij onvergetelijke culinaire ervaringen. 
                Van traditionele smoking technieken tot moderne catering concepten - 
                altijd met respect voor ambachtelijkheid en kwaliteit.
              </p>
              
              <div className="flex items-center space-x-4">
                <Heart className="w-5 h-5 text-terracotta-600" />
                <span className="text-gray-400 font-elegant-body font-light">Gemaakt met liefde in Nederland</span>
              </div>
            </div>

            {/* Clean Contact Column */}
            <div>
              <h4 className="font-elegant-heading text-2xl font-light mb-12 text-white">Contact</h4>
              <div className="space-y-8">
                <div className="flex items-center space-x-4">
                  <Phone className="w-5 h-5 text-terracotta-600" />
                  <span className="text-gray-300 font-elegant-body font-light">0639581128</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="w-5 h-5 text-terracotta-600" />
                  <span className="text-gray-300 font-elegant-body font-light">info@wesleysambacht.nl</span>
                </div>
                <div className="flex items-start space-x-4">
                  <MapPin className="w-5 h-5 text-terracotta-600 mt-0.5" />
                  <span className="text-gray-300 font-elegant-body font-light">Gelderland, Nederland</span>
                </div>
              </div>
            </div>

            {/* Clean Services Column */}
            <div>
              <h4 className="font-elegant-heading text-2xl font-light mb-12 text-white">Onze Diensten</h4>
              <ul className="space-y-6">
                {[
                  "Kantoor Catering",
                  "BBQ Services", 
                  "Evenement Buffets",
                  "Smoking Specialiteiten",
                  "Maatwerk Catering"
                ].map((service, index) => (
                  <li 
                    key={service}
                    className="text-gray-300 hover:text-terracotta-600 transition-all duration-300 cursor-pointer font-elegant-body font-light"
                  >
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Clean Separator */}
          <div className="w-full h-px bg-gray-800 my-24"></div>

          {/* Clean Partners Section */}
          <div className="text-center mb-24">
            <h4 className="font-elegant-heading text-3xl font-light mb-16 text-white">Onze Partners</h4>
            <div className="flex flex-wrap justify-center items-center gap-16 text-gray-400">
              {[
                "Kaasboerderij van Schaik",
                "Bakkerij van Harberden", 
                "Vishandel Sperling"
              ].map((partner, index) => (
                <span key={partner} className="font-elegant-body font-light hover:text-terracotta-600 transition-colors duration-300 cursor-pointer">
                  {partner}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Clean Bottom Bar */}
      <div className="border-t border-gray-800 py-16 bg-black">
        <div className="container mx-auto px-16">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-gray-400 font-elegant-body">
            <div className="mb-6 md:mb-0 font-light">
              © 2024 Wesley's Ambacht. Alle rechten voorbehouden.
            </div>
            <div className="flex space-x-12">
              {["Privacy Beleid", "Algemene Voorwaarden", "Cookies"].map((link, index) => (
                <span 
                  key={link}
                  className="hover:text-terracotta-600 transition-all duration-300 cursor-pointer font-light"
                >
                  {link}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
