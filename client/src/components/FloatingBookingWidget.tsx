import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Phone, X } from "lucide-react";

export const FloatingBookingWidget = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isExpanded ? (
        <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              Snel Boeken
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-3">
            <Button 
              className="w-full bg-gradient-to-r from-[#E86C32] to-[#D4B170] text-white hover:scale-105 transition-all duration-300"
              onClick={() => window.location.href = '/contact'}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Offerte Aanvragen
            </Button>
            
            <Button 
              variant="outline"
              className="w-full border-[#E86C32] text-[#E86C32] hover:bg-[#E86C32] hover:text-white"
              onClick={() => window.location.href = 'tel:06212226580'}
            >
              <Phone className="w-4 h-4 mr-2" />
              Direct Bellen
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 mt-3 text-center">
            Beschikbaar ma-za 08:00-20:00
          </p>
        </div>
      ) : (
        <Button
          onClick={() => setIsExpanded(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-[#E86C32] to-[#D4B170] text-white shadow-lg hover:scale-110 transition-all duration-300"
        >
          <Calendar className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
};