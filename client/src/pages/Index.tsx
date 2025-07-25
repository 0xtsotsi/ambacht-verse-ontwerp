import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { ServiceSection } from "@/components/ServiceSection";
import { CTASection } from "@/components/CTASection";
import { FeatureSection } from "@/components/FeatureSection";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { BookingForm } from "@/components/BookingForm";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <ServiceSection />
      <CTASection />
      <FeatureSection />
      <About />
      <Services />
      <BookingForm />
      <Footer />
      
      {/* Floating Reserve Button - Soprano's style */}
      <FloatingCTA />
    </div>
  );
};

export default Index;
