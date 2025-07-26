import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Leaf, Wheat, Fish } from "lucide-react";

// WCAG 2.2 Compliant Components for Restaurant Applications

interface DietaryIndicatorProps {
  type: 'vegetarian' | 'vegan' | 'gluten-free' | 'contains-fish' | 'spicy';
  level?: number;
}

export const DietaryIndicator = ({ type, level }: DietaryIndicatorProps) => {
  const indicators = {
    vegetarian: { 
      icon: Leaf, 
      color: '#719408', 
      label: 'Vegetarisch',
      ariaLabel: 'Dit gerecht is geschikt voor vegetariërs'
    },
    vegan: { 
      icon: Leaf, 
      color: '#4A7C00', 
      label: 'Veganistisch',
      ariaLabel: 'Dit gerecht is geschikt voor veganisten'
    },
    'gluten-free': { 
      icon: Wheat, 
      color: '#8B4513', 
      label: 'Glutenvrij',
      ariaLabel: 'Dit gerecht bevat geen gluten'
    },
    'contains-fish': { 
      icon: Fish, 
      color: '#0066CC', 
      label: 'Bevat vis',
      ariaLabel: 'Dit gerecht bevat vis of zeevruchten'
    },
    spicy: { 
      icon: AlertTriangle, 
      color: '#FF282A', 
      label: `Pittig niveau ${level || 1}`,
      ariaLabel: `Dit gerecht is pittig, niveau ${level || 1} van 3`
    }
  };

  const indicator = indicators[type];
  const Icon = indicator.icon;

  return (
    <div 
      className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium"
      style={{ 
        backgroundColor: `${indicator.color}20`,
        color: indicator.color,
        fontFamily: 'Open Sans, sans-serif'
      }}
      role="img"
      aria-label={indicator.ariaLabel}
    >
      <Icon size={12} aria-hidden="true" />
      <span>{indicator.label}</span>
    </div>
  );
};

// Accessible Menu Navigation with proper heading hierarchy
interface MenuSectionProps {
  title: string;
  level: 2 | 3 | 4;
  children: React.ReactNode;
  id: string;
}

export const AccessibleMenuSection = ({ title, level, children, id }: MenuSectionProps) => {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <section aria-labelledby={id} className="mb-12">
      <HeadingTag
        id={id}
        className="text-3xl font-bold text-[#2F2F2F] mb-6 border-b-2 border-[#D4AF37] pb-2"
        style={{ fontFamily: 'Playfair Display, serif' }}
      >
        {title}
      </HeadingTag>
      <div role="list" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </section>
  );
};

// Enhanced form inputs with proper labeling and feedback
interface AccessibleFormFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  helpText?: string;
  id: string;
}

export const AccessibleFormField = ({
  label,
  type,
  value,
  onChange,
  error,
  required,
  helpText,
  id
}: AccessibleFormFieldProps) => {
  const hasError = !!error;
  const helpId = helpText ? `${id}-help` : undefined;
  const errorId = hasError ? `${id}-error` : undefined;

  const ariaDescribedBy = [helpId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="space-y-2">
      <label 
        htmlFor={id}
        className="block text-sm font-medium text-[#2F2F2F]"
        style={{ fontFamily: 'Open Sans, sans-serif' }}
      >
        {label}
        {required && (
          <span className="text-[#FF282A] ml-1" aria-label="verplicht">*</span>
        )}
      </label>
      
      <motion.input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        aria-invalid={hasError}
        aria-describedby={ariaDescribedBy}
        className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#CC7A00] focus:ring-offset-2 ${
          hasError 
            ? 'border-[#FF282A] bg-red-50' 
            : 'border-[#F5E6D3] focus:border-[#CC7A00]'
        }`}
        style={{ 
          fontFamily: 'Open Sans, sans-serif',
          minHeight: '48px' // WCAG 2.2 Target Size requirement
        }}
        whileFocus={{ scale: 1.01 }}
      />
      
      {helpText && (
        <p id={helpId} className="text-sm text-[#5F5F5F]" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          {helpText}
        </p>
      )}
      
      {hasError && (
        <motion.p 
          id={errorId}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-[#FF282A] flex items-center space-x-1"
          style={{ fontFamily: 'Open Sans, sans-serif' }}
          role="alert"
          aria-live="polite"
        >
          <AlertTriangle size={16} aria-hidden="true" />
          <span>{error}</span>
        </motion.p>
      )}
    </div>
  );
};

// Live region for order status updates
interface OrderStatusProps {
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
  estimatedTime?: string;
}

export const OrderStatusLiveRegion = ({ status, estimatedTime }: OrderStatusProps) => {
  const statusMessages = {
    pending: 'Uw bestelling wordt verwerkt',
    confirmed: 'Uw bestelling is bevestigd',
    preparing: 'Uw bestelling wordt bereid',
    ready: 'Uw bestelling is klaar voor ophalen',
    delivered: 'Uw bestelling is bezorgd'
  };

  const message = estimatedTime 
    ? `${statusMessages[status]}. Geschatte tijd: ${estimatedTime}`
    : statusMessages[status];

  return (
    <div 
      aria-live="polite" 
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
};

// Skip link for keyboard navigation
export const SkipLink = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-[#CC7A00] text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
    style={{ fontFamily: 'Open Sans, sans-serif' }}
  >
    Ga naar hoofdinhoud
  </a>
);

// Enhanced button with proper target size (24x24 minimum)
interface AccessibleButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

export const AccessibleButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled,
  ariaLabel,
  className
}: AccessibleButtonProps) => {
  const variants = {
    primary: 'bg-gradient-to-r from-[#CC7A00] to-[#D4AF37] text-white hover:shadow-lg',
    secondary: 'border-2 border-[#CC7A00] text-[#CC7A00] hover:bg-[#CC7A00] hover:text-white',
    ghost: 'text-[#CC7A00] hover:bg-[#CC7A00]/10'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm min-h-[32px] min-w-[32px]',
    md: 'px-6 py-3 text-base min-h-[48px] min-w-[48px]', // WCAG 2.2 compliant
    lg: 'px-8 py-4 text-lg min-h-[56px] min-w-[56px]'
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        ${variants[variant]} 
        ${sizes[size]} 
        rounded-lg font-medium transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-[#CC7A00] focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      style={{ fontFamily: 'Open Sans, sans-serif' }}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
    >
      {children}
    </motion.button>
  );
};