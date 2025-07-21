
import { useState } from "react";
import { Hero } from "@/components/Hero";
import { Navigation } from "@/components/Navigation";
import { Services } from "@/components/Services";
import { About } from "@/components/About";
import { Gallery } from "@/components/Gallery";
import { Testimonials } from "@/components/Testimonials";
import { BookingForm } from "@/components/BookingForm";
import { LocalSuppliers } from "@/components/LocalSuppliers";
import { Footer } from "@/components/Footer";
import { ServiceTierSystem } from "@/components/ServiceTierSystem";
import { FloatingBookingWidget } from "@/components/variations/floating-widget-002-mobile-adaptive";
import { DateCheckerModal } from "@/components/DateCheckerModal";
import { StepByStepQuoteCalculator } from "@/components/variations/quote-calculator-001-step-by-step";
import { useToast } from "@/hooks/use-toast";
import type { QuoteBreakdown, QuoteInput } from "@/lib/quote-calculations";

const Index = () => {
  const { toast } = useToast();
  const [dateCheckerOpen, setDateCheckerOpen] = useState(false);
  const [quoteCalculatorOpen, setQuoteCalculatorOpen] = useState(false);

  const scrollToBooking = () => {
    // Open DateChecker modal instead of scrolling
    setDateCheckerOpen(true);
  };

  const handlePhoneClick = () => {
    // Copy phone number to clipboard for desktop users
    navigator.clipboard.writeText('+31 20 123 4567').then(() => {
      toast({
        title: "Telefoonnummer Gekopieerd",
        description: "+31 20 123 4567 is naar uw klembord gekopieerd.",
        duration: 4000,
      });
    }).catch(() => {
      // Fallback: show phone number in toast
      toast({
        title: "Bel Wesley's Ambacht",
        description: "+31 20 123 4567 - Beschikbaar ma-vr 9:00-18:00",
        duration: 6000,
      });
    });
  };

  const handleDateCheckerConfirm = (date: Date, time: string, guests: number) => {
    toast({
      title: "Reserveringsaanvraag Ontvangen!",
      description: `${guests} gasten op ${date.toLocaleDateString('nl-NL')} om ${time}. We bevestigen binnen 24 uur.`,
      duration: 5000,
    });
  };

  const handleOpenQuoteCalculator = (guestCount?: number) => {
    setQuoteCalculatorOpen(true);
    // Optionally close the DateChecker modal when opening quote calculator
    setDateCheckerOpen(false);
  };

  const handleQuoteRequest = (quote: QuoteBreakdown, input: QuoteInput) => {
    // Here you would typically send the quote request to your backend
    console.log('Quote requested:', { quote, input });
    
    toast({
      title: "Offerte Aangevraagd!",
      description: `Uw offerte voor ${input.guestCount} gasten (€${quote.finalTotal.toFixed(2)}) wordt binnen 2 uur verstuurd.`,
      duration: 5000,
    });
  };

  return (
    <div className="min-h-screen bg-warm-cream">
      <Navigation />
      <Hero />
      <About />
      <Services />
      <ServiceTierSystem />
      <Gallery />
      <BookingForm />
      <Footer />
      
      {/* Floating Booking Widget */}
      <FloatingBookingWidget
        onBookingClick={scrollToBooking}
        onPhoneClick={handlePhoneClick}
        onQuoteCalculatorClick={handleOpenQuoteCalculator}
      />
      
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
