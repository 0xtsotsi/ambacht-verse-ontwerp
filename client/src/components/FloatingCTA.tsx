import { Button } from "@/components/ui/button";

export const FloatingCTA = () => {
  const handleReservation = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Button
        onClick={handleReservation}
        className="px-6 py-3 bg-accent text-white rounded-full shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
        style={{ fontFamily: 'Open Sans, sans-serif' }}
      >
        📅 Reserveer Vandaag →
      </Button>
    </div>
  );
};