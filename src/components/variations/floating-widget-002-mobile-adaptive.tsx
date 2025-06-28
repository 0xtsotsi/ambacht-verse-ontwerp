import React, { useState, useEffect } from 'react';
import { Calendar, ChefHat, Phone, ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FloatingBookingWidgetProps {
  className?: string;
  onBookingClick?: () => void;
  onPhoneClick?: () => void;
}

export function FloatingBookingWidget({ 
  className, 
  onBookingClick,
  onPhoneClick 
}: FloatingBookingWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport and scroll behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleScroll = () => {
      // Show widget after scrolling 200px on mobile, 100px on desktop
      const threshold = isMobile ? 200 : 100;
      setIsVisible(window.scrollY > threshold);
    };

    checkMobile();
    handleScroll();

    window.addEventListener('resize', checkMobile);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile]);

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleBookingClick = () => {
    onBookingClick?.();
    if (isMobile) {
      setIsExpanded(false);
    }
  };

  const handlePhoneClick = () => {
    if (isMobile) {
      window.location.href = 'tel:+31201234567';
    } else {
      onPhoneClick?.();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed z-50 transition-all duration-500 ease-out",
        // Mobile positioning - bottom center for thumb reach
        "md:right-6 md:bottom-6",
        "bottom-4 left-1/2 -translate-x-1/2 md:translate-x-0",
        // Mobile width optimization
        "w-auto md:w-auto",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >
      <Card
        className={cn(
          "bg-gradient-to-br from-[#CC5D00] to-[#BB3A3C] text-white shadow-2xl border-0",
          "transition-all duration-300 ease-out",
          // Mobile-first responsive sizing
          isExpanded 
            ? "w-72 md:w-80" 
            : "w-auto",
          // Enhanced mobile touch targets
          "min-h-[60px] md:min-h-[56px]",
          // Mobile-optimized rounded corners
          "rounded-2xl md:rounded-xl",
          // Touch-friendly hover states
          "hover:shadow-3xl hover:scale-[1.02] active:scale-[0.98]"
        )}
      >
        {isExpanded ? (
          // Expanded mobile-optimized view
          <div className="p-4 md:p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-[#FFEFDA]" />
                <span className="font-semibold text-sm md:text-base text-[#FFEFDA]">
                  Wesley's Ambacht
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleExpanded}
                className="text-white hover:bg-white/10 p-1 h-auto w-auto rounded-full"
                aria-label="Sluit widget"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <p className="text-[#FFEFDA] text-sm md:text-base font-medium leading-relaxed">
                Reserveer uw culinaire ervaring
              </p>

              {/* Mobile-optimized large touch buttons */}
              <div className="space-y-2 md:space-y-3">
                <Button
                  onClick={handleBookingClick}
                  className={cn(
                    "w-full bg-white text-[#CC5D00] hover:bg-[#FFEFDA] font-semibold",
                    "h-12 md:h-11 text-base md:text-sm", // Larger touch target on mobile
                    "rounded-xl md:rounded-lg",
                    "shadow-lg hover:shadow-xl transition-all duration-200",
                    "active:scale-[0.98]" // Mobile tap feedback
                  )}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Beschikbaarheid Checken
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <Button
                  onClick={handlePhoneClick}
                  variant="outline"
                  className={cn(
                    "w-full border-white/30 text-white hover:bg-white/10",
                    "h-12 md:h-10 text-base md:text-sm", // Larger on mobile
                    "rounded-xl md:rounded-lg",
                    "active:scale-[0.98]" // Mobile tap feedback
                  )}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  {isMobile ? "Bel Direct" : "020 123 4567"}
                </Button>
              </div>

              {/* Mobile trust indicator */}
              <div className="text-center pt-2">
                <p className="text-[#FFEFDA]/80 text-xs">
                  Premium catering • 15+ jaar ervaring
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Collapsed mobile-optimized view
          <Button
            onClick={handleToggleExpanded}
            className={cn(
              "bg-transparent hover:bg-white/10 text-white border-0 shadow-none",
              "h-[60px] md:h-14 px-4 md:px-5", // Larger touch target on mobile
              "rounded-2xl md:rounded-xl",
              "active:scale-[0.98]", // Mobile tap feedback
              "transition-all duration-200"
            )}
          >
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-1.5 bg-white/15 rounded-full">
                <Calendar className="w-5 h-5 md:w-4 md:h-4 text-[#FFEFDA]" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm md:text-base">
                  Reserveer Vandaag
                </div>
                <div className="text-[#FFEFDA] text-xs opacity-90 hidden md:block">
                  Beschikbaarheid checken
                </div>
              </div>
              <ArrowRight className="w-4 h-4 ml-1 md:ml-2 text-[#FFEFDA]" />
            </div>
          </Button>
        )}
      </Card>

      {/* Mobile-specific scroll hint (only on very small screens) */}
      {isMobile && !isExpanded && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-center">
          <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-md">
            Tik voor reserveren
          </div>
        </div>
      )}
    </div>
  );
}

export default FloatingBookingWidget;