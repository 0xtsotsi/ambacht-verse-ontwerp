import { motion } from "framer-motion";
import { Link } from "wouter";
import { Building2, Users, Heart, Flame, ChefHat } from "lucide-react";
import { premiumAnimations } from "@/lib/animations";

const services = [
  { id: 'corporate', label: 'Corporate Events', href: '/corporate', icon: Building2 },
  { id: 'social', label: 'Social Events', href: '/social', icon: Users },
  { id: 'weddings', label: 'Bruiloften', href: '/bruiloften', icon: Heart },
  { id: 'bbq', label: 'Grill & BBQ', href: '/bbq', icon: Flame },
  { id: 'tray', label: 'By The Tray', href: '/tray', icon: ChefHat }
];

export function NavigationPills() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 bg-sophisticated-cream/95 backdrop-blur-lg border-b border-warm-gold/20"
    >
      <div className="container mx-auto px-8 py-6">
        <div className="flex flex-wrap justify-center gap-4">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index, type: "spring", stiffness: 300 }}
            >
              <Link href={service.href}>
                <motion.button
                  className="group flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg bg-white text-craft-charcoal hover:bg-heritage-orange hover:text-white"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <service.icon className="w-5 h-5" />
                  {service.label}
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}