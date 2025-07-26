import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { premiumAnimations, fadeInUp } from "@/lib/animations";

const testimonials = [
  {
    id: 1,
    name: "Sophie van der Berg",
    role: "Bruiloft, Juni 2024",
    text: "Wesley en zijn team hebben onze bruiloft tot een culinair hoogtepunt gemaakt. De presentatie was adembenemend en de smaken waren perfect afgestemd. Onze gasten praten er nog steeds over!",
    rating: 5,
    highlight: "Perfecte service"
  },
  {
    id: 2,
    name: "Mark Jansen",
    role: "Bedrijfsevenement",
    text: "Professioneel, flexibel en altijd met een glimlach. Wesley's Ambacht heeft ons jaarlijkse bedrijfsevent naar een hoger niveau getild. De BBQ stations waren een groot succes.",
    rating: 5,
    highlight: "Uitstekende kwaliteit"
  },
  {
    id: 3,
    name: "Emma de Vries",
    role: "50ste Verjaardag",
    text: "Van begin tot eind een fantastische ervaring. De aandacht voor detail, de verse ingrediënten en de persoonlijke touch maken Wesley's Ambacht echt bijzonder.",
    rating: 5,
    highlight: "Onvergetelijk"
  }
];

export function TestimonialsEnhanced() {
  return (
    <section className="py-24 bg-gradient-to-br from-sophisticated-cream to-white">
      <div className="container mx-auto px-8">
        <motion.div {...premiumAnimations.staggerContainer}>
          <motion.div className="text-center mb-16" {...fadeInUp()}>
            <p className="font-script text-3xl text-heritage-orange mb-4">
              Wat Onze Klanten Zeggen
            </p>
            <h2 className="text-5xl font-display font-bold text-craft-charcoal mb-6">
              TESTIMONIALS
            </h2>
            <p className="text-xl text-craft-charcoal/70 max-w-3xl mx-auto">
              Ontdek waarom klanten kiezen voor Wesley's Ambacht voor hun speciale momenten
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="relative"
                {...fadeInUp(index * 0.1)}
              >
                <motion.div
                  className="bg-white rounded-2xl p-8 shadow-lg h-full relative overflow-hidden"
                  whileHover={{
                    y: -10,
                    boxShadow: "0 25px 50px rgba(0,0,0,0.15)"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Background gradient */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-heritage-orange/10 to-warm-gold/10 rounded-full transform translate-x-16 -translate-y-16" />
                  
                  {/* Quote icon */}
                  <Quote className="w-10 h-10 text-heritage-orange/20 mb-6" />
                  
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-warm-gold text-warm-gold" />
                    ))}
                  </div>

                  {/* Highlight */}
                  <span className="inline-block px-3 py-1 bg-heritage-orange/10 text-heritage-orange text-sm font-semibold rounded-full mb-4">
                    {testimonial.highlight}
                  </span>

                  {/* Text */}
                  <p className="text-craft-charcoal/80 mb-6 leading-relaxed italic">
                    "{testimonial.text}"
                  </p>

                  {/* Author */}
                  <div className="border-t border-warm-gold/20 pt-4">
                    <p className="font-semibold text-craft-charcoal">{testimonial.name}</p>
                    <p className="text-sm text-craft-charcoal/60">{testimonial.role}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}