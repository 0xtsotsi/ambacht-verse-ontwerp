
import { Heart, Phone, Mail, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-elegant-grey-800 via-elegant-grey-700 to-elegant-grey-900 text-elegant-light relative overflow-hidden">
      {/* Modern Geometric Background */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(45deg, transparent 30%, rgba(224,138,79,0.2) 50%, transparent 70%),
              radial-gradient(circle at 20% 80%, rgba(224,138,79,0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(224,138,79,0.1) 0%, transparent 50%)
            `,
            backgroundSize: '120px 120px, 400px 400px, 300px 300px'
          }}
        ></div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Modern Brand Column */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-terracotta-500 to-terracotta-700 rounded-2xl flex items-center justify-center shadow-elegant-button transform hover:scale-110 transition-all duration-300">
                  <span className="text-white font-elegant-heading font-bold text-2xl">W</span>
                </div>
                <div>
                  <h3 className="font-elegant-heading text-3xl font-bold text-elegant-light">Wesley's Ambacht</h3>
                  <p className="text-terracotta-300 font-elegant-script text-lg">Ambachtelijk en vers... zoals vroeger</p>
                </div>
              </div>
              
              <p className="text-elegant-light/90 leading-relaxed mb-8 max-w-lg text-lg font-elegant-body">
                Met passie en vakmanschap creëren wij onvergetelijke culinaire ervaringen. 
                Van traditionele smoking technieken tot moderne catering concepten - 
                altijd met respect voor ambachtelijkheid en kwaliteit.
              </p>
              
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-gradient-to-r from-terracotta-400 to-terracotta-600 rounded-full flex items-center justify-center">
                  <Heart className="w-3 h-3 text-white" />
                </div>
                <span className="text-elegant-light/80 font-elegant-body font-medium">Gemaakt met liefde in Nederland</span>
              </div>
            </div>

            {/* Modern Contact Column */}
            <div>
              <h4 className="font-elegant-heading text-xl font-bold mb-6 text-elegant-light">Contact</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 group hover:translate-x-2 transition-all duration-300">
                  <div className="w-8 h-8 bg-gradient-to-r from-terracotta-500 to-terracotta-600 rounded-lg flex items-center justify-center group-hover:shadow-elegant-button transition-all duration-300">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-elegant-light/90 font-elegant-body">0639581128</span>
                </div>
                <div className="flex items-center space-x-4 group hover:translate-x-2 transition-all duration-300">
                  <div className="w-8 h-8 bg-gradient-to-r from-terracotta-500 to-terracotta-600 rounded-lg flex items-center justify-center group-hover:shadow-elegant-button transition-all duration-300">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-elegant-light/90 font-elegant-body">info@wesleysambacht.nl</span>
                </div>
                <div className="flex items-start space-x-4 group hover:translate-x-2 transition-all duration-300">
                  <div className="w-8 h-8 bg-gradient-to-r from-terracotta-500 to-terracotta-600 rounded-lg flex items-center justify-center group-hover:shadow-elegant-button transition-all duration-300 mt-0.5">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-elegant-light/90 font-elegant-body">Gelderland, Nederland</span>
                </div>
              </div>
            </div>

            {/* Modern Services Column */}
            <div>
              <h4 className="font-elegant-heading text-xl font-bold mb-6 text-elegant-light">Onze Diensten</h4>
              <ul className="space-y-3">
                {[
                  "Kantoor Catering",
                  "BBQ Services", 
                  "Evenement Buffets",
                  "Smoking Specialiteiten",
                  "Maatwerk Catering"
                ].map((service, index) => (
                  <li 
                    key={service}
                    className="text-elegant-light/90 hover:text-terracotta-300 transition-all duration-300 cursor-pointer font-elegant-body hover:translate-x-2 transform"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      animation: 'elegant-fade-in 0.6s ease-out forwards'
                    }}
                  >
                    <span className="relative">
                      {service}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-terracotta-400 to-terracotta-600 transition-all duration-300 hover:w-full"></span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Modern Separator */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-terracotta-400/50 to-transparent my-12"></div>

          {/* Modern Partners Section */}
          <div className="text-center mb-12">
            <h4 className="font-elegant-heading text-2xl font-bold mb-8 text-elegant-light">Onze Partners</h4>
            <div className="flex flex-wrap justify-center items-center gap-8 text-elegant-light/80">
              {[
                "Kaasboerderij van Schaik",
                "Bakkerij van Harberden", 
                "Vishandel Sperling"
              ].map((partner, index) => (
                <div key={partner} className="flex items-center gap-8">
                  <span className="font-elegant-body font-medium hover:text-terracotta-300 transition-colors duration-300 cursor-pointer">
                    {partner}
                  </span>
                  {index < 2 && <div className="w-2 h-2 bg-gradient-to-r from-terracotta-400 to-terracotta-600 rounded-full"></div>}
                </div>
              ))}
            </div>
          </div>

          {/* Modern Quality Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                title: "Kwaliteit Gegarandeerd",
                subtitle: "Lokale ingrediënten • Minimale E-nummers"
              },
              {
                title: "Duurzaam",
                subtitle: "Milieubewust • Seizoensproducten"
              },
              {
                title: "Betrouwbaar", 
                subtitle: "15+ jaar ervaring • 500+ tevreden klanten"
              }
            ].map((badge, index) => (
              <div 
                key={badge.title}
                className="text-center p-6 bg-gradient-to-br from-elegant-light/10 via-elegant-light/5 to-terracotta-50/10 backdrop-blur-sm rounded-2xl border border-terracotta-200/20 hover:border-terracotta-300/40 transition-all duration-300 transform hover:scale-105"
                style={{
                  animationDelay: `${index * 0.2}s`,
                  animation: 'elegant-fade-in 0.8s ease-out forwards'
                }}
              >
                <div className="font-elegant-heading font-bold text-elegant-light mb-2">{badge.title}</div>
                <div className="text-sm text-elegant-light/80 font-elegant-body">{badge.subtitle}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modern Bottom Bar */}
      <div className="border-t border-gradient-to-r from-transparent via-terracotta-400/30 to-transparent py-8 bg-elegant-grey-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-elegant-light/80 font-elegant-body">
            <div className="mb-4 md:mb-0 font-medium">
              © 2024 Wesley's Ambacht. Alle rechten voorbehouden.
            </div>
            <div className="flex space-x-8">
              {["Privacy Beleid", "Algemene Voorwaarden", "Cookies"].map((link) => (
                <span 
                  key={link}
                  className="hover:text-terracotta-300 transition-all duration-300 cursor-pointer font-medium relative group"
                >
                  {link}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-terracotta-400 to-terracotta-600 transition-all duration-300 group-hover:w-full"></span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
