import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, Phone, Mail, MapPin, Clock, Send, CheckCircle2, Star, ChefHat } from "lucide-react";
import { FloatingBookingWidget } from "@/components/FloatingBookingWidget";
import { Navigation } from "@/components/Navigation";
import contactHeroImage from "@assets/1000005907_1753439577476.jpg";

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    guestCount: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHeroLoaded(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const scrollToContact = () => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <FloatingBookingWidget />
      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${contactHeroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        
        <div className={`relative z-10 text-center text-white px-4 transition-all duration-1000 ${
          heroLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="flex items-center justify-center gap-3 mb-6">
            <ChefHat className="w-8 h-8 text-[#D4AF37]" />
            <p className="text-script text-2xl" style={{ color: '#D4AF37', fontFamily: 'Great Vibes, cursive' }}>
              Laten We Verbinden
            </p>
          </div>
          <h1 className="text-white mb-8" style={{ 
            fontSize: '5rem', 
            fontWeight: '900', 
            lineHeight: '1.1',
            fontFamily: 'Playfair Display, serif',
            textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
            letterSpacing: '0.02em'
          }}>
            CONTACT
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Klaar om uw perfecte evenement te plannen? Neem contact met ons op voor een 
            persoonlijke consultatie en laat ons uw culinaire dromen werkelijkheid maken.
          </p>
        </div>

        {/* Scroll Arrow */}
        <div 
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer group"
          onClick={scrollToContact}
        >
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 shadow-lg group-hover:scale-110">
            <ChevronDown className="w-6 h-6 text-white group-hover:text-[#E86C32] transition-colors duration-300" />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-[#F9F6F1]" ref={sectionRef}>
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className={`max-w-4xl mx-auto text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-4xl font-bold mb-8 text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              NEEM CONTACT MET ONS OP
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#E86C32] to-[#D4B170] mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 leading-relaxed" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              Wesley en Marjoleine Kreeft staan klaar om uw evenement onvergetelijk te maken. 
              Neem vandaag nog contact op voor een persoonlijke consultatie.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              
              {/* Contact Information */}
              <div className={`transition-all duration-1000 delay-300 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}>
                <h3 className="text-2xl font-bold mb-8 text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                  CONTACT INFORMATIE
                </h3>

                {/* Contact Cards */}
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#E86C32] to-[#D4B170] rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                          Telefoon
                        </h4>
                        <p className="text-[#E86C32] font-semibold text-lg">06 212 226 58</p>
                        <p className="text-gray-600 text-sm">Bereikbaar ma-za 08:00-20:00</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#E86C32] to-[#D4B170] rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                          Email
                        </h4>
                        <p className="text-[#E86C32] font-semibold">info@ambachtbijwesley.nl</p>
                        <p className="text-gray-600 text-sm">Response binnen 24 uur</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#E86C32] to-[#D4B170] rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                          Adres
                        </h4>
                        <p className="text-gray-700">Nieuweweg 79</p>
                        <p className="text-gray-700">3251 LJ Stellendam</p>
                        <p className="text-gray-600 text-sm">Zuid-Holland, Nederland</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#E86C32] to-[#D4B170] rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                          Openingstijden
                        </h4>
                        <div className="space-y-1 text-gray-700">
                          <p>Maandag - Vrijdag: 08:00 - 20:00</p>
                          <p>Zaterdag: 09:00 - 18:00</p>
                          <p>Zondag: Op afspraak</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="mt-8 p-6 bg-gradient-to-r from-[#E86C32] to-[#D4B170] rounded-lg text-white">
                  <h4 className="font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Waarom Kiezen Voor Wesley's Ambacht?
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>15+ jaar ervaring in luxury catering</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>500+ succesvolle evenementen</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>100% tevredenheidsgarantie</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Volledig verzekerd en gecertificeerd</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className={`transition-all duration-1000 delay-500 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}>
                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                    OFFERTE AANVRAGEN
                  </h3>

                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h4 className="text-xl font-bold text-green-600 mb-2">Bedankt voor uw aanvraag!</h4>
                      <p className="text-gray-600">We nemen binnen 24 uur contact met u op.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Naam *
                          </label>
                          <Input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email *
                          </label>
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Telefoon
                          </label>
                          <Input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Event Type *
                          </label>
                          <select
                            name="eventType"
                            value={formData.eventType}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E86C32] focus:border-transparent"
                            required
                          >
                            <option value="">Selecteer event type</option>
                            <option value="wedding">Bruiloft</option>
                            <option value="corporate">Corporate Event</option>
                            <option value="social">Sociale Gelegenheid</option>
                            <option value="bbq">BBQ Catering</option>
                            <option value="other">Anders</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Event Datum
                          </label>
                          <Input
                            type="date"
                            name="eventDate"
                            value={formData.eventDate}
                            onChange={handleInputChange}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Aantal Gasten
                          </label>
                          <Input
                            type="number"
                            name="guestCount"
                            value={formData.guestCount}
                            onChange={handleInputChange}
                            className="w-full"
                            placeholder="bv. 50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bericht
                        </label>
                        <Textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          className="w-full h-32"
                          placeholder="Vertel ons meer over uw event wensen..."
                        />
                      </div>

                      <Button 
                        type="submit"
                        className="w-full px-6 py-3 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105"
                        style={{
                          background: 'linear-gradient(135deg, #E86C32 0%, #D4B170 100%)',
                          border: 'none'
                        }}
                      >
                        <Send className="w-5 h-5 mr-2" />
                        Verstuur Aanvraag
                      </Button>
                    </form>
                  )}
                </div>

                {/* Review Snippet */}
                <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-3">
                    "Wesley en zijn team hebben onze bruiloft perfect verzorgd. Het eten was heerlijk 
                    en de service was onberispelijk. Echt een 10!"
                  </p>
                  <p className="text-sm text-gray-600">- Sandra & Mark, Bruiloft 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};