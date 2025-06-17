
import { Hero } from "@/components/Hero";
import { Navigation } from "@/components/Navigation";
import { Services } from "@/components/Services";
import { About } from "@/components/About";
import { Gallery } from "@/components/Gallery";
import { Testimonials } from "@/components/Testimonials";
import { BookingForm } from "@/components/BookingForm";
import { LocalSuppliers } from "@/components/LocalSuppliers";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-warm-cream">
      <Navigation />
      <Hero />
      <About />
      <Services />
      <Gallery />
      <BookingForm />
      <Footer />
    </div>
  );
};

export default Index;
