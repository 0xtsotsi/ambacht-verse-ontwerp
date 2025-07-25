import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, animate } from "framer-motion";

interface CounterAnimationProps {
  from?: number;
  to: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export const CounterAnimation = ({ 
  from = 0, 
  to, 
  duration = 2,
  suffix = "",
  className = ""
}: CounterAnimationProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(from);
  
  useEffect(() => {
    if (isInView) {
      const controls = animate(from, to, {
        duration,
        ease: "easeOut",
        onUpdate: (value) => setCount(Math.floor(value))
      });
      return controls.stop;
    }
  }, [isInView, from, to, duration]);
  
  return (
    <span ref={ref} className={className}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

// Stats section with animated counters
export const StatsSection = () => {
  const stats = [
    { number: 500, suffix: "+", label: "Tevreden Klanten" },
    { number: 15, suffix: " jaar", label: "Ervaring" },
    { number: 1000, suffix: "+", label: "Evenementen" },
    { number: 24, suffix: "/7", label: "Service" }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-[#2F2F2F] to-[#5D3A00] text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="text-center"
            >
              <div 
                className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-[#D4AF37] to-[#CC7A00] bg-clip-text text-transparent"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                <CounterAnimation to={stat.number} suffix={stat.suffix} />
              </div>
              <p 
                className="text-white/80 text-sm md:text-base"
                style={{ fontFamily: 'Open Sans, sans-serif' }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};