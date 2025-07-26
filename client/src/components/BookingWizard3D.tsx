import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Calendar, Users, Utensils, Package, User, Check, 
  ChevronRight, ChevronLeft, MapPin, Clock, DollarSign,
  Phone, Mail, MessageSquare, Sparkles, Info, X
} from 'lucide-react';
// import DatePicker from 'react-datepicker';
// import "react-datepicker/dist/react-datepicker.css";

// Form validation schemas
const eventDetailsSchema = z.object({
  eventType: z.string().min(1, 'Selecteer een evenement type'),
  eventDate: z.date().min(new Date(), 'Evenement datum moet in de toekomst zijn'),
  eventTime: z.string().min(1, 'Selecteer een tijd'),
  guestCount: z.number().min(10, 'Minimaal 10 gasten').max(1000, 'Maximaal 1000 gasten'),
  venue: z.string().min(1, 'Geef locatie details'),
  eventDuration: z.string().min(1, 'Selecteer evenement duur')
});

const menuSelectionSchema = z.object({
  menuStyle: z.string().min(1, 'Selecteer een menu stijl'),
  courses: z.array(z.string()).min(1, 'Selecteer minimaal één gang'),
  dietaryRestrictions: z.array(z.string()).optional(),
  specialRequests: z.string().optional()
});

const contactInfoSchema = z.object({
  firstName: z.string().min(2, 'Voornaam is verplicht'),
  lastName: z.string().min(2, 'Achternaam is verplicht'),
  email: z.string().email('Ongeldig e-mailadres'),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Ongeldig telefoonnummer'),
  company: z.string().optional(),
  howHeard: z.string().optional()
});

// Booking steps configuration
const bookingSteps = [
  {
    id: 'event-type',
    title: 'Evenement Type',
    subtitle: 'Wat gaan we vieren?',
    icon: <Calendar className="w-6 h-6" />
  },
  {
    id: 'event-details',
    title: 'Evenement Details',
    subtitle: 'Vertel ons over uw evenement',
    icon: <Users className="w-6 h-6" />
  },
  {
    id: 'menu-selection',
    title: 'Menu Selectie',
    subtitle: 'Kies uw culinaire ervaring',
    icon: <Utensils className="w-6 h-6" />
  },
  {
    id: 'additional-services',
    title: 'Extra Diensten',
    subtitle: 'Verbeter uw evenement',
    icon: <Package className="w-6 h-6" />
  },
  {
    id: 'contact-info',
    title: 'Contact Informatie',
    subtitle: 'Hoe kunnen we u bereiken?',
    icon: <User className="w-6 h-6" />
  },
  {
    id: 'review',
    title: 'Controleer & Verstuur',
    subtitle: 'Bevestig uw details',
    icon: <Check className="w-6 h-6" />
  }
];

interface BookingWizard3DProps {
  onClose: () => void;
}

const BookingWizard3D: React.FC<BookingWizard3DProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [bookingData, setBookingData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get current schema based on step
  const getCurrentSchema = () => {
    switch (currentStep) {
      case 1: return eventDetailsSchema;
      case 2: return menuSelectionSchema;
      case 4: return contactInfoSchema;
      default: return z.object({});
    }
  };

  const form = useForm({
    resolver: zodResolver(getCurrentSchema()),
    mode: 'onChange'
  });

  const handleNext = async (data: any) => {
    const isValid = await form.trigger();
    if (isValid) {
      setBookingData({ ...bookingData, ...data });
      if (currentStep < bookingSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Submit booking data to API
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      console.log('Booking submitted:', bookingData);
      // Show success message or redirect
      onClose();
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden"
        >
          {/* Header with 3D gradient effect */}
          <div className="relative bg-gradient-to-r from-[#CC7A00] to-[#D4AF37] p-6 text-white overflow-hidden">
            {/* 3D floating elements */}
            <motion.div
              className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>Reserveer Uw Evenement</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Progress Steps with 3D effect */}
              <div className="flex items-center justify-between">
                {bookingSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <motion.div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                        index <= currentStep 
                          ? 'bg-white text-[#CC7A00] border-white shadow-lg' 
                          : 'bg-transparent text-white/60 border-white/40'
                      }`}
                      animate={{
                        scale: index === currentStep ? 1.1 : 1,
                        boxShadow: index === currentStep ? "0 10px 30px rgba(0,0,0,0.3)" : "0 0px 0px rgba(0,0,0,0)"
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {index < currentStep ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-bold">{index + 1}</span>
                      )}
                    </motion.div>
                    {index < bookingSteps.length - 1 && (
                      <div className={`w-full h-0.5 mx-2 transition-all ${
                        index < currentStep ? 'bg-white' : 'bg-white/30'
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Current Step Info */}
              <div className="mt-6 flex items-center gap-3">
                {bookingSteps[currentStep].icon}
                <div>
                  <h3 className="text-xl font-semibold">{bookingSteps[currentStep].title}</h3>
                  <p className="text-white/80 text-sm">{bookingSteps[currentStep].subtitle}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 0 && <EventTypeStep form={form} />}
                {currentStep === 1 && <EventDetailsStep form={form} />}
                {currentStep === 2 && <MenuSelectionStep form={form} />}
                {currentStep === 3 && <AdditionalServicesStep form={form} />}
                {currentStep === 4 && <ContactInfoStep form={form} />}
                {currentStep === 5 && <ReviewStep bookingData={bookingData} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                currentStep === 0 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md hover:shadow-lg'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Vorige
            </button>

            {currentStep < bookingSteps.length - 1 ? (
              <button
                onClick={form.handleSubmit(handleNext)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#CC7A00] to-[#D4AF37] text-white rounded-lg font-medium hover:shadow-xl transition-all"
              >
                Volgende
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all shadow-md hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Versturen...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Verstuur Reservering
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Step Components (simplified for brevity)
const EventTypeStep = ({ form }: any) => {
  const eventTypes = [
    {
      id: 'corporate',
      title: 'Zakelijk Evenement',
      description: 'Zakelijke bijeenkomsten, conferenties, team building',
      icon: '🏢',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'wedding',
      title: 'Bruiloft',
      description: 'Uw speciale dag verdient uitzonderlijke catering',
      icon: '💑',
      color: 'from-pink-500 to-rose-600'
    },
    {
      id: 'social',
      title: 'Sociale Bijeenkomst',
      description: 'Verjaardagen, jubilea, vieringen',
      icon: '🎉',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      id: 'bbq',
      title: 'BBQ & Outdoor',
      description: 'Grillen, picknicks, outdoor evenementen',
      icon: '🔥',
      color: 'from-orange-500 to-red-600'
    }
  ];

  const [selectedType, setSelectedType] = useState('');

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        {eventTypes.map((type) => (
          <motion.div
            key={type.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <label className="cursor-pointer">
              <input
                type="radio"
                name="eventType"
                value={type.id}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  form.setValue('eventType', e.target.value);
                }}
                className="sr-only"
              />
              <div className={`relative p-6 rounded-xl border-2 transition-all transform ${
                selectedType === type.id 
                  ? 'border-[#CC7A00] shadow-xl scale-[1.02]' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-5 rounded-xl`} />
                <div className="relative">
                  <span className="text-4xl mb-4 block">{type.icon}</span>
                  <h3 className="text-xl font-semibold mb-2">{type.title}</h3>
                  <p className="text-gray-600">{type.description}</p>
                </div>
                {selectedType === type.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-[#CC7A00] to-[#D4AF37] rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Check className="w-5 h-5 text-white" />
                  </motion.div>
                )}
              </div>
            </label>
          </motion.div>
        ))}
      </div>

      {/* Quick Info */}
      <div className="bg-[#FAF8F5] border border-[#D4AF37]/30 rounded-lg p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#CC7A00] mt-0.5" />
        <div className="text-sm text-[#5F5F5F]">
          <p className="font-medium mb-1">Weet u niet welk type bij uw evenement past?</p>
          <p>Geen zorgen! Ons team helpt u graag bij het kiezen van de perfecte catering oplossing.</p>
        </div>
      </div>
    </div>
  );
};

// Placeholder for other step components
const EventDetailsStep = ({ form }: any) => <div>Event Details Form</div>;
const MenuSelectionStep = ({ form }: any) => <div>Menu Selection Form</div>;
const AdditionalServicesStep = ({ form }: any) => <div>Additional Services Form</div>;
const ContactInfoStep = ({ form }: any) => <div>Contact Info Form</div>;
const ReviewStep = ({ bookingData }: any) => <div>Review and Submit</div>;

export default BookingWizard3D;