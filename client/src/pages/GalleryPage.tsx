import { Navigation } from "@/components/Navigation";
import { FloatingBookingWidget } from "@/components/FloatingBookingWidget";
import { SEOHead } from "@/components/SEOOptimizations";
import AdvancedGallery from "@/components/AdvancedGallery";
import { Footer } from "@/components/Footer";

export const GalleryPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Galerij - Wesley's Ambacht Catering"
        description="Bekijk onze portfolio van prachtig verzorgde evenementen. Van bruiloften tot zakelijke events, laat u inspireren door onze culinaire creaties."
        keywords={["catering galerij", "event fotografie", "bruiloft catering", "zakelijk catering", "bbq events"]}
        canonical="https://ambachtbijwesley.nl/gallery"
        ogImage="/images/gallery-hero.jpg"
      />
      <Navigation />
      <main>
        <AdvancedGallery />
      </main>
      <Footer />
      <FloatingBookingWidget />
    </div>
  );
};