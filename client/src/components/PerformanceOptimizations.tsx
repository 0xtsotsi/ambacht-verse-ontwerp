import React, { Suspense, useDeferredValue, useTransition } from "react";
import { motion } from "framer-motion";

// Advanced React 18 Patterns for Food Applications
interface MenuFilterProps {
  items: Array<{
    id: string;
    name: string;
    category: string;
    price: number;
    description: string;
  }>;
  onFilter: (items: any[]) => void;
}

export const OptimizedMenuFilter = ({ items, onFilter }: MenuFilterProps) => {
  const [filter, setFilter] = React.useState("");
  const [isPending, startTransition] = useTransition();
  const deferredFilter = useDeferredValue(filter);

  // Non-blocking filtering with React 18 concurrent features
  const filteredItems = React.useMemo(() => {
    return items.filter(item => 
      item.name.toLowerCase().includes(deferredFilter.toLowerCase()) ||
      item.category.toLowerCase().includes(deferredFilter.toLowerCase())
    );
  }, [items, deferredFilter]);

  React.useEffect(() => {
    startTransition(() => {
      onFilter(filteredItems);
    });
  }, [filteredItems, onFilter]);

  return (
    <div className="relative">
      <motion.input
        type="text"
        placeholder="Zoek gerechten, categorieën..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full px-4 py-3 border-2 border-[#F5E6D3] rounded-lg focus:border-[#CC7A00] transition-colors duration-200"
        style={{ fontFamily: 'Open Sans, sans-serif' }}
        whileFocus={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      />
      {isPending && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute right-3 top-3"
        >
          <div className="w-6 h-6 border-2 border-[#CC7A00] border-t-transparent rounded-full animate-spin" />
        </motion.div>
      )}
    </div>
  );
};

// Progressive Image Loading with AVIF support
interface OptimizedImageProps {
  src: string;
  avifSrc?: string;
  webpSrc?: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export const OptimizedFoodImage = ({ 
  src, 
  avifSrc, 
  webpSrc, 
  alt, 
  className,
  priority = false 
}: OptimizedImageProps) => {
  const [loaded, setLoaded] = React.useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <picture>
        {avifSrc && <source srcSet={avifSrc} type="image/avif" />}
        {webpSrc && <source srcSet={webpSrc} type="image/webp" />}
        <motion.img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          onLoad={() => setLoaded(true)}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ 
            opacity: loaded ? 1 : 0, 
            scale: loaded ? 1 : 1.1 
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full h-full object-cover"
        />
      </picture>
      
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#F5E6D3] to-[#FAF8F5] animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      )}
    </div>
  );
};

// Skeleton Loading States
export const MenuItemSkeleton = () => (
  <div className="bg-white rounded-xl p-6 shadow-lg animate-pulse">
    <div className="h-48 bg-gradient-to-r from-[#FAF8F5] to-[#F5E6D3] rounded-lg mb-4" />
    <div className="space-y-3">
      <div className="h-6 bg-gradient-to-r from-[#FAF8F5] to-[#F5E6D3] rounded w-3/4" />
      <div className="h-4 bg-gradient-to-r from-[#FAF8F5] to-[#F5E6D3] rounded w-full" />
      <div className="h-4 bg-gradient-to-r from-[#FAF8F5] to-[#F5E6D3] rounded w-5/6" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 bg-gradient-to-r from-[#CC7A00] to-[#D4AF37] rounded w-20" />
        <div className="h-10 bg-gradient-to-r from-[#FAF8F5] to-[#F5E6D3] rounded w-24" />
      </div>
    </div>
  </div>
);

// Performance Monitoring Component
export const PerformanceMonitor = () => {
  React.useEffect(() => {
    // Core Web Vitals monitoring
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        console.log(`${entry.name}: ${(entry as any).value || entry.duration}ms`);
        
        // Send to analytics (implement your preferred service)
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'web_vitals', {
            metric_name: entry.name,
            metric_value: (entry as any).value || entry.duration,
            metric_rating: (entry as any).rating || 'good'
          });
        }
      });
    });

    if ('observe' in observer) {
      observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
    }

    return () => observer.disconnect();
  }, []);

  return null;
};