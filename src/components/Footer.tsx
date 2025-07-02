
import { Heart, Phone, Mail, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-elegant-grey-800 via-elegant-grey-700 to-elegant-grey-900 text-elegant-light relative overflow-hidden rounded-t-3xl">
      {/* Organic Natural Background */}
      <div className="absolute inset-0 opacity-15">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(ellipse 500px 350px at 30% 70%, rgba(224,138,79,0.25) 0%, transparent 60%),
              radial-gradient(ellipse 400px 280px at 70% 30%, rgba(224,138,79,0.2) 0%, transparent 55%),
              radial-gradient(ellipse 300px 200px at 50% 90%, rgba(255,255,255,0.08) 0%, transparent 50%)
            `,
            backgroundSize: '800px 600px, 700px 500px, 500px 350px',
            filter: 'blur(1.5px)'
          }}
        ></div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Organic Brand Column */}
            <div className="md:col-span-2 animate-organic-grow">
              <div className="flex items-center space-x-4 mb-10">
                <div className="w-18 h-18 bg-gradient-to-br from-terracotta-500 to-terracotta-700 rounded-3xl flex items-center justify-center shadow-organic-natural transform hover:scale-110 transition-all duration-500 animate-organic-breathe">
                  <span className="text-white font-elegant-heading font-bold text-2xl">W</span>
                </div>
                <div>
                  <h3 className="font-elegant-heading text-3xl font-bold text-elegant-light">Wesley's Ambacht</h3>
                  <p className="text-terracotta-300 font-elegant-script text-lg animate-organic-float">Ambachtelijk en vers... zoals vroeger</p>
                </div>
              </div>
              
              <p className="text-elegant-light/90 leading-relaxed mb-10 max-w-lg text-lg font-elegant-body">
                Met passie en vakmanschap creëren wij onvergetelijke culinaire ervaringen. 
                Van traditionele smoking technieken tot moderne catering concepten - 
                altijd met respect voor ambachtelijkheid en kwaliteit.
              </p>
              
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-terracotta-400 to-terracotta-600 rounded-full flex items-center justify-center animate-organic-float">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <span className="text-elegant-light/80 font-elegant-body font-medium">Gemaakt met liefde in Nederland</span>
              </div>
            </div>

            {/* Organic Contact Column */}
            <div className="animate-organic-grow" style={{ animationDelay: '0.2s' }}>
              <h4 className="font-elegant-heading text-xl font-bold mb-8 text-elegant-light">Contact</h4>
              <div className="space-y-6">
                <div className="flex items-center space-x-4 group hover:translate-x-3 transition-all duration-500">
                  <div className="w-10 h-10 bg-gradient-to-br from-terracotta-500 to-terracotta-600 rounded-full flex items-center justify-center group-hover:shadow-organic-natural transition-all duration-500 animate-organic-breathe">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-elegant-light/90 font-elegant-body">0639581128</span>
                </div>
                <div className="flex items-center space-x-4 group hover:translate-x-3 transition-all duration-500">
                  <div className="w-10 h-10 bg-gradient-to-br from-terracotta-500 to-terracotta-600 rounded-full flex items-center justify-center group-hover:shadow-organic-natural transition-all duration-500 animate-organic-breathe" style={{ animationDelay: '0.3s' }}>
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-elegant-light/90 font-elegant-body">info@wesleysambacht.nl</span>
                </div>
                <div className="flex items-start space-x-4 group hover:translate-x-3 transition-all duration-500">
                  <div className="w-10 h-10 bg-gradient-to-br from-terracotta-500 to-terracotta-600 rounded-full flex items-center justify-center group-hover:shadow-organic-natural transition-all duration-500 mt-0.5 animate-organic-breathe" style={{ animationDelay: '0.6s' }}>
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-elegant-light/90 font-elegant-body">Gelderland, Nederland</span>
                </div>
              </div>
            </div>

            {/* Organic Services Column */}
            <div className="animate-organic-grow" style={{ animationDelay: '0.4s' }}>
              <h4 className="font-elegant-heading text-xl font-bold mb-8 text-elegant-light">Onze Diensten</h4>
              <ul className="space-y-4">
                {[
                  "Kantoor Catering",
                  "BBQ Services", 
                  "Evenement Buffets",
                  "Smoking Specialiteiten",
                  "Maatwerk Catering"
                ].map((service, index) => (
                  <li 
                    key={service}
                    className="text-elegant-light/90 hover:text-terracotta-300 transition-all duration-500 cursor-pointer font-elegant-body hover:translate-x-3 transform flex items-center space-x-3 group"
                    style={{
                      animationDelay: `${index * 0.15}s`,
                      animation: 'organic-grow 0.8s ease-out forwards'
                    }}
                  >
                    <div className="w-2 h-2 bg-gradient-to-br from-terracotta-400 to-terracotta-600 rounded-full group-hover:w-3 group-hover:h-3 transition-all duration-500 animate-organic-breathe"></div>
                    <span className="relative">
                      {service}
                      <span className="absolute -bottom-1 left-0 w-0 h-1 bg-gradient-to-r from-terracotta-400 to-terracotta-600 transition-all duration-500 group-hover:w-full rounded-full"></span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Organic Separator */}
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-terracotta-400/60 to-transparent my-16 rounded-full"></div>

          {/* Organic Partners Section */}
          <div className="text-center mb-16 animate-organic-grow" style={{ animationDelay: '0.6s' }}>
            <h4 className="font-elegant-heading text-2xl font-bold mb-10 text-elegant-light">Onze Partners</h4>
            <div className="flex flex-wrap justify-center items-center gap-10 text-elegant-light/80">
              {[
                "Kaasboerderij van Schaik",
                "Bakkerij van Harberden", 
                "Vishandel Sperling"
              ].map((partner, index) => (
                <div key={partner} className="flex items-center gap-10">
                  <span className="font-elegant-body font-medium hover:text-terracotta-300 transition-colors duration-500 cursor-pointer px-4 py-2 rounded-full hover:bg-terracotta-500/10">
                    {partner}
                  </span>
                  {index < 2 && <div className="w-3 h-3 bg-gradient-to-br from-terracotta-400 to-terracotta-600 rounded-full animate-organic-breathe"></div>}
                </div>
              ))}
            </div>
          </div>

          {/* Organic Quality Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
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
                className="text-center p-8 bg-gradient-to-br from-elegant-light/10 via-elegant-light/5 to-terracotta-50/10 backdrop-blur-sm rounded-3xl border border-terracotta-200/20 hover:border-terracotta-300/40 transition-all duration-500 transform hover:scale-105 shadow-organic-soft hover:shadow-organic-natural animate-organic-breathe"
                style={{
                  animationDelay: `${0.8 + index * 0.3}s`,
                  animation: 'organic-grow 0.8s ease-out forwards'
                }}
              >
                <div className="font-elegant-heading font-bold text-elegant-light mb-3">{badge.title}</div>
                <div className="text-sm text-elegant-light/80 font-elegant-body">{badge.subtitle}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Organic Bottom Bar */}
      <div className="border-t border-gradient-to-r from-transparent via-terracotta-400/40 to-transparent py-10 bg-elegant-grey-900/60 backdrop-blur-sm rounded-t-2xl">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-elegant-light/80 font-elegant-body">
            <div className="mb-6 md:mb-0 font-medium">
              © 2024 Wesley's Ambacht. Alle rechten voorbehouden.
            </div>
            <div className="flex space-x-10">
              {["Privacy Beleid", "Algemene Voorwaarden", "Cookies"].map((link, index) => (
                <span 
                  key={link}
                  className="hover:text-terracotta-300 transition-all duration-500 cursor-pointer font-medium relative group px-3 py-2 rounded-full hover:bg-terracotta-500/10"
                  style={{
                    animationDelay: `${1.5 + index * 0.2}s`,
                    animation: 'organic-grow 0.6s ease-out forwards'
                  }}
                >
                  {link}
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-terracotta-400 to-terracotta-600 transition-all duration-500 group-hover:w-6 rounded-full"></span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
