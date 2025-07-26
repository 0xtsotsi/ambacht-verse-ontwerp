import { motion } from "framer-motion";
import { ChefHat, Utensils, Wine, Coffee, Truck, Cake } from "lucide-react";
import { ServiceCard } from "./ServiceCard";
import { premiumAnimations, fadeInUp } from "@/lib/animations";

// Import authentic images from attached assets
import CorporateImg from "@assets/1000005931_1753544636356.jpg";
import WeddingImg from "@assets/1000005712_1753544636365.jpg";
import BBQImg from "@assets/1000005877_1753544636357.jpg";
import CousImg from "@assets/1000005688_1753544636360.jpg";
import SandwichImg from "@assets/1000005752_1753544636358.jpg";
import BurgersImg from "@assets/1000005693_1753544636361.jpg";

const services = [
  {
    id: "corporate",
    name: "Zakelijke Evenementen",
    description: "Professionele catering voor vergaderingen, conferenties en bedrijfsfeesten met verse, ambachtelijke gerechten.",
    image: CorporateImg,
    category: "Corporate",
    icon: Utensils,
    features: [
      "Buffet en à la carte opties",
      "Professionele presentatie",
      "Flexibele planning",
      "Volledig verzorgd"
    ]
  },
  {
    id: "weddings",
    name: "Bruiloft Catering",
    description: "Maak uw trouwdag onvergetelijk met onze elegante catering services en persoonlijke touch.",
    image: WeddingImg,
    category: "Bruiloften",
    icon: Cake,
    features: [
      "Persoonlijke menu planning",
      "Decoratie en styling",
      "Complete day-of coördinatie",
      "Fotografievriendelijke presentatie"
    ]
  },
  {
    id: "bbq",
    name: "Grill & BBQ",
    description: "Authentieke BBQ ervaring met onze professionele grillmeesters en verse ingrediënten.",
    image: BBQImg,
    category: "BBQ",
    icon: Coffee,
    features: [
      "Live grill stations",
      "Premium vlees selectie",
      "Vegetarische opties",
      "Complete BBQ pakketten"
    ]
  },
  {
    id: "buffets",
    name: "Luxe Buffetten",
    description: "Uitgebreide buffetten met diverse internationale keukens en seizoensgebonden specialiteiten.",
    image: CousImg,
    category: "Buffetten",
    icon: Wine,
    features: [
      "Internationale keukens",
      "Live cooking stations",
      "Dieetwensen mogelijk",
      "Premium ingrediënten"
    ]
  },
  {
    id: "lunch",
    name: "Lunch Service",
    description: "Verse broodjes, salades en warme gerechten perfect voor zakelijke lunches en events.",
    image: SandwichImg,
    category: "Lunch",
    icon: ChefHat,
    features: [
      "Dagverse bereiding",
      "Gezonde opties",
      "Snelle levering",
      "Eco-vriendelijke verpakking"
    ]
  },
  {
    id: "streetfood",
    name: "Street Food",
    description: "Trendy street food concepten met ambachtelijke burgers, wraps en wereldse hapjes.",
    image: BurgersImg,
    category: "Street Food",
    icon: Truck,
    features: [
      "Food truck service",
      "Live bereiding",
      "Moderne presentatie",
      "Festival catering"
    ]
  }
];

export function ServicesEnhanced() {
  return (
    <section className="py-24 bg-sophisticated-cream">
      <div className="container mx-auto px-8">
        <motion.div {...premiumAnimations.staggerContainer}>
          <motion.div className="text-center mb-16" {...fadeInUp()}>
            <p className="font-script text-3xl text-heritage-orange mb-4">
              Onze Diensten
            </p>
            <h2 className="text-5xl font-display font-bold text-craft-charcoal mb-6">
              CULINAIRE EXCELLENTIE
            </h2>
            <p className="text-xl text-craft-charcoal/70 max-w-3xl mx-auto">
              Van intieme diners tot grootschalige evenementen, Wesley's Ambacht 
              levert maatwerk catering met passie voor smaak en presentatie.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}