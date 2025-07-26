import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/lib/animations";
import { MagneticButton } from "./MagneticButton";
import { ProgressiveImage } from "./ProgressiveImage";

interface ServiceCardProps {
  service: {
    id: string;
    name: string;
    description: string;
    image: string;
    placeholder?: string;
    category: string;
    icon: React.ComponentType<{ className?: string }>;
    features: string[];
  };
  index: number;
}

export const ServiceCard = ({ service, index }: ServiceCardProps) => {
  const { ref, animation } = useScrollReveal();
  
  return (
    <motion.article
      ref={ref}
      {...animation}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg"
      style={{ transformStyle: "preserve-3d" }}
      whileHover={{
        rotateY: 5,
        rotateX: 5,
        scale: 1.02,
        boxShadow: "0 25px 50px rgba(0,0,0,0.15)"
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Background Image */}
      <div className="relative h-64 overflow-hidden">
        <ProgressiveImage
          src={service.image}
          placeholder={service.placeholder}
          alt={service.name}
          className="group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-elegant-charcoal/60 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="p-8">
        <motion.div
          className="flex items-center gap-3 mb-4"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-3 bg-heritage-orange/10 rounded-full">
            <service.icon className="w-6 h-6 text-heritage-orange" />
          </div>
          <span className="text-sm font-semibold text-heritage-orange uppercase tracking-wider">
            {service.category}
          </span>
        </motion.div>
        
        <h3 className="text-2xl font-bold text-craft-charcoal mb-3">
          {service.name}
        </h3>
        
        <p className="text-craft-charcoal/70 mb-6 leading-relaxed">
          {service.description}
        </p>
        
        {/* Features */}
        <ul className="space-y-2 mb-6">
          {service.features.map((feature, idx) => (
            <motion.li
              key={idx}
              className="flex items-center gap-3 text-sm text-craft-charcoal/80"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + (idx * 0.1) }}
            >
              <Check className="w-4 h-4 text-fresh-sage" />
              {feature}
            </motion.li>
          ))}
        </ul>
        
        {/* CTA */}
        <MagneticButton
          variant="outline"
          size="lg"
          className="w-full group-hover:bg-heritage-orange group-hover:text-white transition-colors duration-300"
        >
          Meer Informatie
          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
        </MagneticButton>
      </div>
    </motion.article>
  );
};