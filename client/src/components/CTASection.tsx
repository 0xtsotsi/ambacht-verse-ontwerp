import { Button } from "@/components/ui/button";

export const CTASection = () => {
  return (
    <section
      className="section-spacing relative overflow-hidden"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark Overlay */}
      <div className="hero-overlay" />

      <div className="container-main relative z-10 text-center text-white">
        <p className="text-script mb-4">Reserve Today</p>
        <h2 className="text-display text-white mb-6">CHECK YOUR DATE</h2>
        
        <p className="text-body max-w-2xl mx-auto text-white/90 leading-relaxed mb-8">
          Contact us today to check our schedule of events and reserve your dates. We are happy to discuss all of your needs and design a package that is right for you and your special event.
        </p>

        <Button className="btn-primary text-lg">
          Contact Us
        </Button>
      </div>
    </section>
  );
};