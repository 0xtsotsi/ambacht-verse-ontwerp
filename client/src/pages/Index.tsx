import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { SopranosNavigation } from "@/components/SopranosNavigation";
import { Hero } from "@/components/Hero";
import { SopranoServicesSection } from "@/components/SopranoServicesSection";
import { CateringMenuCarousel } from "@/components/CateringMenuCarousel";
import { CTASection } from "@/components/CTASection";
import { EnhancedCTA } from "@/components/EnhancedCTA";
import { StatsSection } from "@/components/CounterAnimation";
import { PerformanceMonitor } from "@/components/PerformanceOptimizations";
import { SEOHead, CateringBusinessSchema } from "@/components/SEOOptimizations";
import { SkipLink } from "@/components/AccessibilityEnhancements";
import { FeatureSection } from "@/components/FeatureSection";
import { Services } from "@/components/Services";
import { Footer } from "@/components/Footer";
import { FloatingBookingWidget } from "@/components/FloatingBookingWidget";
import { DateCheckerModal } from "@/components/DateCheckerModal";
import { StepByStepQuoteCalculator } from "@/components/variations/quote-calculator-001-step-by-step";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ScrollTextReveal } from "@/components/ScrollProgress";
import { useToast } from "@/hooks/use-toast";
import type { QuoteBreakdown, QuoteInput } from "@/lib/quote-calculations";

const Index = () => {
  const { toast } = useToast();
  const [dateCheckerOpen, setDateCheckerOpen] = useState(false);
  const [quoteCalculatorOpen, setQuoteCalculatorOpen] = useState(false);

  const scrollToBooking = () => {
    setDateCheckerOpen(true);
  };

  const handlePhoneClick = () => {
    navigator.clipboard
      .writeText("+31 20 123 4567")
      .then(() => {
        toast({
          title: "Telefoonnummer Gekopieerd",
          description: "+31 20 123 4567 is naar uw klembord gekopieerd.",
          duration: 4000,
        });
      })
      .catch(() => {
        toast({
          title: "Bel Wesley's Ambacht",
          description: "+31 20 123 4567 - Beschikbaar ma-vr 9:00-18:00",
          duration: 6000,
        });
      });
  };

  const handleDateCheckerConfirm = (
    date: Date,
    time: string,
    guests: number,
  ) => {
    toast({
      title: "Reserveringsaanvraag Ontvangen!",
      description: `${guests} gasten op ${date.toLocaleDateString("nl-NL")} om ${time}. We bevestigen binnen 24 uur.`,
      duration: 5000,
    });
  };

  const handleOpenQuoteCalculator = (guestCount?: number) => {
    setQuoteCalculatorOpen(true);
    setDateCheckerOpen(false);
  };

  const handleQuoteRequest = (quote: QuoteBreakdown, input: QuoteInput) => {
    console.log("Quote requested:", { quote, input });

    toast({
      title: "Offerte Aangevraagd!",
      description: `Uw offerte voor ${input.guestCount} gasten (€${quote.finalTotal.toFixed(2)}) wordt binnen 2 uur verstuurd.`,
      duration: 5000,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Wesley's Ambacht - Premium Catering Stellendam"
        description="Professionele catering service in Stellendam. Specialiteit in zakelijke evenementen, bruiloften en sociale gelegenheden. Verse lokale ingrediënten, ervaren team. Bel 06 212 226 58."
        keywords={["catering", "Stellendam", "bruiloft", "zakelijk evenement", "BBQ", "lokale ingrediënten"]}
        canonical="https://ambachtbijwesley.nl"
        ogImage="/images/hero-wesley-ambacht.jpg"
      />
      <CateringBusinessSchema />
      <PerformanceMonitor />
      <SkipLink />
      <ScrollProgress />
      <Navigation />
      <Hero />
      <main id="main-content">
        <SopranosNavigation />
      <SopranoServicesSection />
      <CateringMenuCarousel />
      <ScrollTextReveal>
        <EnhancedCTA />
      </ScrollTextReveal>
      <StatsSection />
      <FeatureSection />
        <Services />
      </main>
      <Footer />

      {/* Dynamic Booking Widget */}
      <FloatingBookingWidget />

      {/* DateChecker Modal */}
      <DateCheckerModal
        open={dateCheckerOpen}
        onOpenChange={setDateCheckerOpen}
        onConfirm={handleDateCheckerConfirm}
        onOpenQuoteCalculator={handleOpenQuoteCalculator}
      />

      {/* Quote Calculator Modal */}
      <StepByStepQuoteCalculator
        open={quoteCalculatorOpen}
        onOpenChange={setQuoteCalculatorOpen}
        onRequestDetailedQuote={handleQuoteRequest}
      />
    </div>
  );
};

export default Index;
