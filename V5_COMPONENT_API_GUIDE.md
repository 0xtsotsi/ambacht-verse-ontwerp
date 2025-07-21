# 🔧 **V5 Interactive Elegance - Component API Guide**

## Technical Documentation for Developers

---

## 📋 **Overview**

This document provides comprehensive API documentation for all V5 Interactive Elegance components, hooks, and systems implemented in Wesley's Ambacht catering website.

**Target Audience**: Developers, Technical Teams, Future Maintainers  
**Documentation Level**: Technical Implementation Details  
**Last Updated**: July 21, 2025

---

## 🎨 **Animation System API**

### **Core Animation Classes**

#### **Interactive Shimmer (`animate-interactive-shimmer`)**

```css
@keyframes interactive-shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-interactive-shimmer {
  animation: interactive-shimmer 2s ease-in-out infinite;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  width: 100%;
  height: 100%;
}
```

**Usage**: Premium text animations  
**Performance**: GPU-accelerated with `will-change: transform`  
**Accessibility**: Respects `prefers-reduced-motion`

#### **Interactive Bounce (`animate-interactive-bounce`)**

```css
@keyframes interactive-bounce {
  0%,
  100% {
    transform: translateY(0) scale(1);
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  50% {
    transform: translateY(-5px) scale(1.05);
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
}

.animate-interactive-bounce {
  animation: interactive-bounce 2s ease-in-out infinite;
}
```

**Usage**: CTA buttons and important interactive elements  
**Performance**: Optimized with `transform` only  
**Behavior**: Pauses on hover for better UX

#### **Interactive Pulse Glow (`animate-interactive-pulse-glow`)**

```css
@keyframes interactive-pulse-glow {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(224, 138, 79, 0.3);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 40px rgba(224, 138, 79, 0.6);
    transform: scale(1.02);
  }
}

.animate-interactive-pulse-glow {
  animation: interactive-pulse-glow 3s ease-in-out infinite;
}
```

**Usage**: Attention-drawing elements  
**Colors**: Terracotta theme (#E08A4F)  
**Performance**: Combines `transform` and `box-shadow`

#### **Interactive Slide Up (`animate-interactive-slide-up`)**

```css
@keyframes interactive-slide-up {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-interactive-slide-up {
  animation: interactive-slide-up 0.6s ease-out forwards;
}
```

**Usage**: Content entrance animations  
**Performance**: Single-use animation with `forwards`  
**Timing**: Can be staggered with `animation-delay`

---

## 🧩 **Core Components API**

### **Hero Component**

```typescript
interface HeroProps {
  // No props required - fully self-contained
}

export const Hero = memo(() => {
  // Implementation includes:
  // - Dynamic parallax background with mouse tracking
  // - Interactive shimmer effects on brand name
  // - Bounce animations on CTA buttons
  // - Progressive image loading with placeholders
  // - Performance monitoring with usePerformanceLogger
});
```

#### **Key Features**

- **Mouse Tracking**: `useOptimizedMouseTracking(true, 20)` with 20ms throttling
- **Performance Monitoring**: Built-in render time tracking
- **Image Optimization**: Progressive loading with fallbacks
- **Responsive Design**: Mobile-first with desktop enhancements

#### **Performance Metrics**

- **Target Render Time**: <16ms (60fps)
- **Memory Tracking**: Enabled for optimization
- **GPU Acceleration**: `transform3d` and `will-change` properties

### **InteractiveMenuSystem Component**

```typescript
interface MenuItemProps {
  title: string;
  description: string;
  price: string;
  category: string;
  cookingTime?: string;
  servings?: string;
}

interface InteractiveMenuSystemProps {
  onBack?: () => void;
}

export const InteractiveMenuSystem = memo(
  ({ onBack }: InteractiveMenuSystemProps) => {
    // State management for category filtering and hover effects
    const [activeCategory, setActiveCategory] = useState("soepen");
    const [hoveredItem, setHoveredItem] = useState<number | null>(null);

    // Optimized callbacks with useCallback
    const handleCategoryChange = useCallback((categoryId: string) => {
      setActiveCategory(categoryId);
    }, []);
  },
);
```

#### **Data Structure**

```typescript
const menuData: Record<string, MenuItemProps[]> = {
  soepen: [...],
  hapjes: [...],
  buffets: [...]
};

const categoryInfo = {
  soepen: { name: "Soepen & Warme Happen", icon: "🍲", color: "bg-terracotta-500" },
  hapjes: { name: "Ambachtelijke Hapjes", icon: "🧀", color: "bg-terracotta-600" },
  buffets: { name: "Buffet Specialiteiten", icon: "🎉", color: "bg-terracotta-700" }
};
```

#### **Interactive Features**

- **Category Filtering**: Smooth transitions between menu sections
- **Hover Effects**: Individual item highlighting with glow effects
- **Responsive Cards**: Touch-optimized for mobile devices
- **Staggered Animations**: Sequential item appearance

### **Services Component**

```typescript
interface ServiceTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlight?: boolean;
}

interface ServicesProps {
  showQuoteCalculator?: boolean;
}

export const Services = memo(
  ({ showQuoteCalculator = true }: ServicesProps) => {
    // Component handles service tier presentation and quote calculation
  },
);
```

#### **Service Tier Structure**

```typescript
const serviceTiers: ServiceTier[] = [
  {
    name: "Basis Catering",
    price: "€12.50",
    description: "Perfect voor informele bijeenkomsten",
    features: ["Ambachtelijke soep", "Broodjes assortiment", "..."],
    highlight: false,
  },
  // ... additional tiers
];
```

### **Gallery Component**

```typescript
interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description?: string;
}

interface GalleryProps {
  items?: GalleryItem[];
  categories?: string[];
  showFilters?: boolean;
}

export const Gallery = memo(
  ({
    items = defaultGalleryItems,
    categories = defaultCategories,
    showFilters = true,
  }: GalleryProps) => {
    // Implements filterable image gallery with smooth transitions
  },
);
```

#### **Gallery Features**

- **Category Filtering**: Dynamic category-based filtering
- **Hover Effects**: Image overlay animations
- **Lazy Loading**: Progressive image loading for performance
- **Modal Support**: Full-size image viewing capability

---

## 🪝 **Custom Hooks API**

### **useOptimizedMouseTracking**

```typescript
interface MousePosition {
  x: number;
  y: number;
}

export const useOptimizedMouseTracking = (
  enabled: boolean = true,
  throttleMs: number = 16,
): MousePosition => {
  // Returns throttled mouse position for performance
  // Automatically handles enable/disable based on prefers-reduced-motion
};
```

**Usage**: Parallax effects and interactive backgrounds  
**Performance**: Throttled to prevent excessive re-renders  
**Accessibility**: Auto-disables for motion-sensitive users

### **usePerformanceLogger**

```typescript
interface PerformanceConfig {
  componentName: string;
  slowRenderThreshold?: number;
  enableMemoryTracking?: boolean;
}

interface PerformanceStats {
  averageRenderTime: number;
  slowRenderCount: number;
  memoryUsage?: number;
}

export const usePerformanceLogger = (config: PerformanceConfig) => {
  const getPerformanceStats = (): PerformanceStats => {
    // Returns current performance metrics
  };

  return { getPerformanceStats };
};
```

**Usage**: Component performance monitoring  
**Metrics**: Render times, memory usage, slow render detection  
**Production**: Automatically optimized for production builds

### **useAnimationOptimization**

```typescript
export const useAnimationOptimization = (
  elementRef: RefObject<HTMLElement>,
  animationType: "transform" | "opacity" | "mixed" = "mixed",
) => {
  // Optimizes animations based on device capabilities
  // Automatically reduces animation complexity on low-end devices
};
```

**Usage**: Dynamic animation optimization  
**Device Detection**: CPU/GPU capability assessment  
**Fallbacks**: Graceful degradation for older devices

---

## 🎛️ **Button System API**

### **Button Variants**

```typescript
const buttonVariants = cva("base-button-classes", {
  variants: {
    variant: {
      "interactive-primary": [
        "bg-terracotta-600 text-white",
        "hover:bg-terracotta-700 hover:scale-105",
        "focus:ring-2 focus:ring-terracotta-500",
        "transition-all duration-300",
      ],
      "interactive-outline": [
        "border-2 border-terracotta-600 text-terracotta-600",
        "hover:bg-terracotta-600 hover:text-white",
        "focus:ring-2 focus:ring-terracotta-500",
      ],
      "interactive-glass": [
        "bg-white/10 backdrop-blur-md border border-white/20",
        "hover:bg-white/20 hover:scale-105",
        "text-white",
      ],
    },
    size: {
      "elegant-lg": "px-8 py-4 text-lg font-medium rounded-2xl",
      "luxury-xl": "px-12 py-6 text-xl font-medium rounded-3xl",
    },
  },
});
```

### **Usage Examples**

```typescript
// Primary CTA Button
<Button
  variant="interactive-primary"
  size="elegant-lg"
  className="animate-interactive-bounce hover:animate-none"
>
  <span className="relative z-10">Contacteer Ons</span>
</Button>

// Outline Button with Glass Effect
<Button
  variant="interactive-outline"
  size="luxury-xl"
  className="group"
>
  <span className="relative z-10 group-hover:text-white transition-colors duration-500">
    Bekijk Galerij
  </span>
</Button>
```

---

## 🎨 **Design System Tokens**

### **Color Palette**

```css
:root {
  /* Primary Terracotta Scheme */
  --terracotta-50: #fdf6f0;
  --terracotta-100: #fbe8d4;
  --terracotta-200: #f7d1a8;
  --terracotta-300: #f0b570;
  --terracotta-400: #e8994d;
  --terracotta-500: #e08a4f; /* Primary Brand Color */
  --terracotta-600: #c6703d;
  --terracotta-700: #a55a32;
  --terracotta-800: #854a2b;
  --terracotta-900: #6d3e26;

  /* Elegant Neutrals */
  --elegant-dark: #2c3e50;
  --elegant-grey-500: #64748b;
  --elegant-grey-600: #475569;
  --elegant-grey-700: #334155;
  --elegant-white: #ffffff;
}
```

### **Typography System**

```css
:root {
  /* Font Families */
  --font-elegant-heading: "Inter", system-ui, sans-serif;
  --font-elegant-body: "Open Sans", system-ui, sans-serif;
  --font-elegant-script: "Great Vibes", cursive;

  /* Font Sizes */
  --text-elegant-xs: 0.75rem;
  --text-elegant-sm: 0.875rem;
  --text-elegant-base: 1rem;
  --text-elegant-lg: 1.125rem;
  --text-elegant-xl: 1.25rem;
  --text-elegant-2xl: 1.5rem;
  --text-elegant-3xl: 1.875rem;
  --text-elegant-4xl: 2.25rem;
  --text-elegant-5xl: 3rem;
}
```

### **Shadow System**

```css
:root {
  --shadow-elegant-soft:
    0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-elegant-panel:
    0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  --shadow-elegant-deep:
    0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
  --shadow-elegant-glow: 0 0 20px rgba(224, 138, 79, 0.3);
}
```

---

## 📱 **Responsive Design System**

### **Breakpoint System**

```css
/* Mobile First Approach */
@media (min-width: 640px) {
  /* sm */
}
@media (min-width: 768px) {
  /* md */
}
@media (min-width: 1024px) {
  /* lg */
}
@media (min-width: 1280px) {
  /* xl */
}
@media (min-width: 1536px) {
  /* 2xl */
}
```

### **Responsive Animation Adjustments**

```css
/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .animate-interactive-shimmer,
  .animate-interactive-bounce,
  .animate-interactive-pulse-glow {
    animation: none;
  }

  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}

/* High refresh rate displays */
@media (min-resolution: 120dpi) {
  .animate-interactive-bounce {
    animation-duration: 1.5s; /* Smoother on high-refresh displays */
  }
}
```

---

## ⚡ **Performance Optimization API**

### **Image Optimization System**

```typescript
interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  priority?: boolean;
}

export const OptimizedImage = ({
  src,
  alt,
  className,
  loading = "lazy",
  priority = false,
}: OptimizedImageProps) => {
  // Implements progressive loading with multiple sizes
  // Includes WebP support with fallbacks
  // Handles loading states and error boundaries
};
```

### **Bundle Optimization**

```typescript
// Code splitting implementation
const Gallery = lazy(() => import('./Gallery'));
const InteractiveMenuSystem = lazy(() => import('./InteractiveMenuSystem'));

// Usage with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Gallery />
</Suspense>
```

### **Memory Management**

```typescript
// Automatic cleanup for animation observers
useEffect(() => {
  const observer = new IntersectionObserver(callback, options);

  return () => {
    observer.disconnect(); // Automatic cleanup
  };
}, []);
```

---

## 🧪 **Testing API**

### **Component Testing Utilities**

```typescript
// Test helpers for V5 components
export const renderWithAnimations = (component: ReactElement) => {
  return render(
    <AnimationProvider>
      {component}
    </AnimationProvider>
  );
};

// Animation testing utilities
export const waitForAnimationComplete = async (element: HTMLElement) => {
  return new Promise((resolve) => {
    element.addEventListener('animationend', resolve, { once: true });
  });
};

// Performance testing helpers
export const measureRenderTime = (component: ReactElement) => {
  const startTime = performance.now();
  render(component);
  return performance.now() - startTime;
};
```

### **Accessibility Testing**

```typescript
// A11y testing utilities
export const checkAnimationAccessibility = (element: HTMLElement) => {
  // Verifies animation respects prefers-reduced-motion
  // Checks for proper focus management
  // Validates color contrast ratios
};
```

---

## 🔧 **Configuration API**

### **Animation Configuration**

```typescript
interface AnimationConfig {
  enableShimmer: boolean;
  enableBounce: boolean;
  enablePulseGlow: boolean;
  enableSlideUp: boolean;
  respectMotionPreferences: boolean;
  performanceMode: "auto" | "high" | "medium" | "low";
}

export const configureAnimations = (config: AnimationConfig) => {
  // Globally configures animation system
  // Allows runtime performance adjustments
  // Handles accessibility preferences
};
```

### **Performance Configuration**

```typescript
interface PerformanceConfig {
  targetFrameRate: 60 | 30;
  enableGPUAcceleration: boolean;
  memoryThreshold: number;
  enablePerformanceMonitoring: boolean;
}

export const configurePerformance = (config: PerformanceConfig) => {
  // Sets global performance parameters
  // Adjusts animation complexity based on device capabilities
  // Configures monitoring and reporting
};
```

---

## 📊 **Monitoring & Analytics API**

### **Performance Metrics**

```typescript
interface PerformanceMetrics {
  averageRenderTime: number;
  frameDrops: number;
  memoryUsage: number;
  animationPerformance: {
    shimmer: number;
    bounce: number;
    pulseGlow: number;
    slideUp: number;
  };
}

export const getPerformanceMetrics = (): PerformanceMetrics => {
  // Returns comprehensive performance data
  // Includes animation-specific metrics
  // Memory usage and frame rate information
};
```

### **User Interaction Tracking**

```typescript
interface InteractionMetrics {
  buttonClicks: Record<string, number>;
  animationTriggers: Record<string, number>;
  componentLoadTimes: Record<string, number>;
  errorBoundaryTriggers: number;
}

export const trackInteraction = (type: string, data: any) => {
  // Tracks user interactions with V5 components
  // Monitors animation performance in real-world usage
  // Provides data for optimization decisions
};
```

---

## 🚀 **Deployment Configuration**

### **Build Configuration**

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          animations: ["./src/animations/index.ts"],
          components: ["./src/components/index.ts"],
          utils: ["./src/lib/utils.ts"],
        },
      },
    },
    cssCodeSplit: true,
    sourcemap: process.env.NODE_ENV === "development",
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
    exclude: ["@vite/client", "@vite/env"],
  },
});
```

### **Production Optimizations**

```typescript
// Production-only optimizations
if (process.env.NODE_ENV === "production") {
  // Disable console logging
  console.log = () => {};
  console.warn = () => {};

  // Enable service worker for caching
  registerServiceWorker();

  // Configure performance monitoring
  configureProductionMonitoring();
}
```

---

## 📚 **API Reference Summary**

### **Core Components**

- `Hero` - Main landing section with interactive animations
- `InteractiveMenuSystem` - Filterable menu browser
- `Services` - Service tier presentation
- `Gallery` - Image gallery with category filtering

### **Animation System**

- 4 signature animations: shimmer, bounce, pulse-glow, slide-up
- Performance-optimized with GPU acceleration
- Accessibility-compliant with motion preferences

### **Custom Hooks**

- `useOptimizedMouseTracking` - Throttled mouse position
- `usePerformanceLogger` - Component performance monitoring
- `useAnimationOptimization` - Dynamic animation adjustment

### **Design System**

- Comprehensive color palette with terracotta theme
- Typography system with elegant font pairings
- Shadow system for depth and elevation

### **Performance Features**

- Code splitting and lazy loading
- Image optimization with progressive loading
- Memory management and cleanup
- Real-time performance monitoring

---

## 🔗 **Related Documentation**

- `CLIENT_HANDOVER_PACKAGE_V5.md` - Client-facing documentation
- `V5_TRAINING_MATERIALS.md` - User training guide
- `V5_MAINTENANCE_GUIDE.md` - Maintenance procedures
- `ANIMATION_SYSTEMS_TECHNICAL_SPEC.md` - Detailed animation specifications

---

**V5 Interactive Elegance Component API Guide - Complete Technical Reference**

_Last Updated: July 21, 2025_  
_Version: 1.0.0_  
_Documentation Status: ✅ Complete_
