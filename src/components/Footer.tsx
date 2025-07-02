
import { Heart, Phone, Mail, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-forest-green text-warm-cream">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-12 h-12 bg-burnt-orange rounded-full flex items-center justify-center">
                  <span className="text-clean-white font-serif font-bold text-xl">W</span>
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-bold">Wesley's Ambacht</h3>
                  <p className="text-sm italic text-warm-cream/80">Ambachtelijk en vers... zoals vroeger</p>
                </div>
              </div>
              
              <p className="text-warm-cream/90 leading-relaxed mb-6 max-w-md">
                Met passie en vakmanschap creëren wij onvergetelijke culinaire ervaringen. 
                Van traditionele smoking technieken tot moderne catering concepten - 
                altijd met respect voor ambachtelijkheid en kwaliteit.
              </p>
              
              <div className="flex items-center space-x-2 text-sm">
                <Heart className="w-4 h-4 text-burnt-orange" />
                <span className="text-warm-cream/80">Gemaakt met liefde in Nederland</span>
              </div>
            </div>

            {/* Contact Column */}
            <div>
              <h4 className="font-serif text-lg font-semibold mb-4">Contact</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-burnt-orange" />
                  <span className="text-warm-cream/90">0639581128</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-burnt-orange" />
                  <span className="text-warm-cream/90">info@wesleysambacht.nl</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-burnt-orange mt-1" />
                  <span className="text-warm-cream/90">Gelderland, Nederland</span>
                </div>
              </div>
            </div>

            {/* Services Column */}
            <div>
              <h4 className="font-serif text-lg font-semibold mb-4">Onze Diensten</h4>
              <ul className="space-y-2 text-warm-cream/90">
                <li className="hover:text-burnt-orange transition-colors cursor-pointer">
                  Kantoor Catering
                </li>
                <li className="hover:text-burnt-orange transition-colors cursor-pointer">
                  BBQ Services
                </li>
                <li className="hover:text-burnt-orange transition-colors cursor-pointer">
                  Evenement Buffets
                </li>
                <li className="hover:text-burnt-orange transition-colors cursor-pointer">
                  Smoking Specialiteiten
                </li>
                <li className="hover:text-burnt-orange transition-colors cursor-pointer">
                  Maatwerk Catering
                </li>
              </ul>
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-warm-cream/20 my-8"></div>

          {/* Partners Section */}
          <div className="text-center mb-8">
            <h4 className="font-serif text-lg font-semibold mb-4">Onze Partners</h4>
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-warm-cream/80">
              <span>Kaasboerderij van Schaik</span>
              <span>•</span>
              <span>Bakkerij van Harberden</span>
              <span>•</span>
              <span>Vishandel Sperling</span>
            </div>
          </div>

          {/* Quality Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-warm-cream/10 rounded-lg">
              <div className="text-sm font-medium text-warm-cream mb-1">Kwaliteit Gegarandeerd</div>
              <div className="text-xs text-warm-cream/80">Lokale ingrediënten • Minimale E-nummers</div>
            </div>
            <div className="text-center p-4 bg-warm-cream/10 rounded-lg">
              <div className="text-sm font-medium text-warm-cream mb-1">Duurzaam</div>
              <div className="text-xs text-warm-cream/80">Milieubewust • Seizoensproducten</div>
            </div>
            <div className="text-center p-4 bg-warm-cream/10 rounded-lg">
              <div className="text-sm font-medium text-warm-cream mb-1">Betrouwbaar</div>
              <div className="text-xs text-warm-cream/80">15+ jaar ervaring • 500+ tevreden klanten</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-elegant-light/20 py-6">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-elegant-light/80 font-elegant-body">
            <div className="mb-4 md:mb-0">
              © 2024 Wesley's Ambacht. Alle rechten voorbehouden.
            </div>
            <div className="flex space-x-6">
              <span className="hover:text-elegant-light transition-colors cursor-pointer">
                Privacy Beleid
              </span>
              <span className="hover:text-elegant-light transition-colors cursor-pointer">
                Algemene Voorwaarden
              </span>
              <span className="hover:text-elegant-light transition-colors cursor-pointer">
                Cookies
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
