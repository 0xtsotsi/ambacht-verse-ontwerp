import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Phone, X } from "lucide-react";

export const FloatingBookingWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="btn-primary shadow-2xl w-16 h-16 rounded-full flex items-center justify-center group"
        >
          <Calendar className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
        </Button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <Button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center p-0"
            >
              <X className="w-5 h-5 text-gray-600" />
            </Button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B35] to-[#FF8A5B] rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Boek Uw Evenement</h3>
              <p className="text-gray-600">Neem contact op voor beschikbaarheid</p>
            </div>

            <div className="space-y-4">
              <a 
                href="tel:0621222658"
                className="flex items-center justify-center space-x-3 w-full bg-gradient-to-r from-[#FF6B35] to-[#FF8A5B] text-white py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
              >
                <Phone className="w-5 h-5" />
                <span>Bel Direct: 06 212 226 58</span>
              </a>
              
              <a 
                href="mailto:info@ambachtbijwesley.nl"
                className="flex items-center justify-center w-full bg-white border-2 border-[#FF6B35] text-[#FF6B35] py-4 rounded-full font-semibold hover:bg-[#FF6B35] hover:text-white transition-all duration-300"
              >
                E-mail Versturen
              </a>
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Wesley & Marjoleine Kreeft</p>
              <p>Nieuweweg 79, 3251 AS Stellendam</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};