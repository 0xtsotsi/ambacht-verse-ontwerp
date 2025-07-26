import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroSectionEnhanced } from "@/components/HeroSectionEnhanced";
import { NavigationPills } from "@/components/NavigationPills";

import { ServicesEnhanced } from "@/components/ServicesEnhanced";
import { GalleryEnhanced } from "@/components/GalleryEnhanced";
import { TestimonialsEnhanced } from "@/components/TestimonialsEnhanced";
import { CTASectionEnhanced } from "@/components/CTASectionEnhanced";
import { Footer } from "@/components/Footer";
import { FloatingBookingWidget } from "@/components/FloatingBookingWidget";
import { DateCheckerModal } from "@/components/DateCheckerModal";
import { StepByStepQuoteCalculator } from "@/components/variations/quote-calculator-001-step-by-step";
import { useToast } from "@/hooks/use-toast";
import type { QuoteBreakdown, QuoteInput } from "@/lib/quote-calculations";

const Index = () => {
  const { toast } = useToast();
  const [dateCheckerOpen, setDateCheckerOpen] = useState(false);
  const [quoteCalculatorOpen, setQuoteCalculatorOpen] = useState(false);
  const [bookingWizardOpen, setBookingWizardOpen] = useState(false);

  const scrollToBooking = () => {
    setBookingWizardOpen(true);
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
    <div className="min-h-screen">
      <Navigation />
      <HeroSectionEnhanced />
      <NavigationPills />
      <ServicesEnhanced />
      <GalleryEnhanced />
      <TestimonialsEnhanced />
      <CTASectionEnhanced />
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
