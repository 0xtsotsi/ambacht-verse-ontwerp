import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, Building2, Users, Coffee, Calendar, Clock, CheckCircle2, Briefcase, Target } from "lucide-react";
import { FloatingBookingWidget } from "@/components/FloatingBookingWidget";
import corporateHeroImage from "@assets/1000005907_1753439577476.jpg";
import meetingImage from "@assets/1000005722_1753439577481.jpg";
import lunchImage from "@assets/1000005705_1753439577479.jpg";
import conferenceImage from "@assets/1000005727_1753439577481.jpg";

export const CorporatePage = () => {
  const [activeService, setActiveService] = useState("meetings");
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

  const corporateServices = {
    meetings: {
      title: "Executive Meetings",
      subtitle: "BOARDROOM CATERING",
      price: "€25",
      image: meetingImage,
      description: "Professional catering voor executive meetings en boardroom sessies met premium kwaliteit en discrete service",
      features: [
        "Discrete setup en afbraak tijdens pauzes",
        "Premium koffie en thee service",
        "Healthy lunch opties voor lange meetings",
        "Flexibele tijdschema's voor last-minute changes",
        "Allergen-vriendelijke menu labeling",
        "Professional presentatie met bedrijfsstandaarden"
      ],
      menuHighlights: [
        "Gourmet sandwiches en wraps",
        "Fresh fruit en vegetable platters", 
        "Premium coffee service met specialty drinks",
        "Healthy breakfast pastries",
        "Interactive salad stations"
      ]
    },
    conferences: {
      title: "Conference Catering",
      subtitle: "ALL-DAY EVENTS",
      price: "€45",
      image: conferenceImage,
      description: "Complete all-day conference catering van ontbijt tot dinner met energizing food choices voor optimale productiviteit",
      features: [
        "Complete dag service (breakfast, lunch, dinner)",
        "Energizing snacks voor tussen sessies",
        "Multiple dietary accommodations",
        "Live cooking stations voor networking events",
        "Self-serve stations voor efficiency",
        "Full cleanup en waste management"
      ],
      menuHighlights: [
        "Interactive taco en burger stations",
        "Asian fusion lunch options",
        "Build-your-own salad bars", 
        "Premium cheese en charcuterie displays",
        "Dessert walls en brownie stacks"
      ]
    },
    office: {
      title: "Office Dining",
      subtitle: "DAILY CATERING",
      price: "€18",
      image: lunchImage,
      description: "Dagelijkse office catering service voor team lunches, employee events en kantoor dining programs",
      features: [
        "Recurring service programs beschikbaar",
        "Cost-effective pricing voor regular orders",
        "Variety rotatie om menu fresh te houden", 
        "Quick setup voor lunch breaks",
        "Eco-friendly packaging options",
        "Team building meal experiences"
      ],
      menuHighlights: [
        "Comfort food met gourmet twists",
        "Regional specialties en ethnic cuisines",
        "Plant-based power bowls",
        "Street food style opties",
        "Customizable individual meal boxes"
      ]
    }
  };

  const scrollToServices = () => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen">
      <FloatingBookingWidget />
      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${corporateHeroImage})`,
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
            <Building2 className="w-8 h-8 text-[#D4AF37]" />
            <p className="text-script text-2xl" style={{ color: '#D4AF37', fontFamily: 'Great Vibes, cursive' }}>
              Business Excellence
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
            CORPORATE CATERING
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Professionele catering oplossingen voor executive meetings, conferences en office dining. 
            Verhoog productiviteit met premium food experiences.
          </p>
        </div>

        {/* Scroll Arrow */}
        <div 
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer group"
          onClick={scrollToServices}
        >
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 shadow-lg group-hover:scale-110">
            <ChevronDown className="w-6 h-6 text-white group-hover:text-[#E86C32] transition-colors duration-300" />
          </div>
        </div>
      </section>

      {/* Corporate Services Section */}
      <section className="py-20 bg-[#F9F6F1]" ref={sectionRef}>
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className={`max-w-4xl mx-auto text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <Briefcase className="w-6 h-6 text-[#E86C32]" />
              <p className="text-script text-2xl" style={{ color: '#D4AF37', fontFamily: 'Great Vibes, cursive' }}>
                Professional Services
              </p>
            </div>
            <h2 className="text-4xl font-bold mb-8 text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              ZAKELIJKE CATERING OPLOSSINGEN
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#E86C32] to-[#D4B170] mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 leading-relaxed" style={{ fontFamily: 'Open Sans, sans-serif' }}>
              Van executive boardroom meetings tot multi-dag conferences - wij leveren catering die uw business doelen ondersteunt 
              met premium kwaliteit, professionele service en flexibiliteit die past bij uw schema.
            </p>
          </div>

          {/* Corporate Benefits */}
          <div className={`grid md:grid-cols-3 gap-8 mb-16 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <Target className="w-12 h-12 text-[#E86C32] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                Productiviteit Focus
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                Energizing menu choices die focus en productiviteit behouden tijdens lange werkdagen en meetings.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <Clock className="w-12 h-12 text-[#E86C32] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                Flexibele Service
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                Aanpasbare tijdschema's en last-minute changes voor de dynamische natuur van business operations.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <Users className="w-12 h-12 text-[#E86C32] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
                Professional Image
              </h3>
              <p className="text-gray-600" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                Premium presentatie die uw bedrijfsstandaarden reflecteert en indruk maakt op clients en partners.
              </p>
            </div>
          </div>

          {/* Service Selection */}
          <div className={`transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
                SELECTEER UW CORPORATE SERVICE
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {Object.entries(corporateServices).map(([key, service]) => (
                  <button
                    key={key}
                    onClick={() => setActiveService(key)}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 ${
                      activeService === key
                        ? 'text-white'
                        : 'bg-white text-[#E86C32] border-2 border-[#E86C32] hover:bg-[#E86C32] hover:text-white'
                    }`}
                    style={{
                      background: activeService === key ? 'linear-gradient(135deg, #E86C32 0%, #D4B170 100%)' : '',
                      border: activeService === key ? 'none' : ''
                    }}
                  >
                    {service.subtitle}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Service Details */}
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="grid lg:grid-cols-2 gap-0">
                  {/* Image */}
                  <div className="relative h-96 lg:h-auto overflow-hidden">
                    <img 
                      src={corporateServices[activeService as keyof typeof corporateServices].image}
                      alt={corporateServices[activeService as keyof typeof corporateServices].subtitle}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-6 right-6 bg-gradient-to-r from-[#E86C32] to-[#D4B170] text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                      {corporateServices[activeService as keyof typeof corporateServices].price}/persoon
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <Coffee className="w-6 h-6 text-[#E86C32]" />
                      <span className="text-[#E86C32] font-semibold text-sm uppercase tracking-wide">
                        {corporateServices[activeService as keyof typeof corporateServices].subtitle}
                      </span>
                    </div>

                    <h3 className="text-3xl font-bold mb-4 text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {corporateServices[activeService as keyof typeof corporateServices].title}
                    </h3>

                    <p className="text-gray-600 leading-relaxed mb-6" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                      {corporateServices[activeService as keyof typeof corporateServices].description}
                    </p>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Service Features:</h4>
                      <div className="space-y-2">
                        {corporateServices[activeService as keyof typeof corporateServices].features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#E86C32] mt-1 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-8">
                      <h4 className="font-semibold text-gray-900 mb-3">Menu Highlights:</h4>
                      <div className="flex flex-wrap gap-2">
                        {corporateServices[activeService as keyof typeof corporateServices].menuHighlights.map((item, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-[#F5E6D3] text-[#E86C32] text-sm rounded-full font-medium"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button 
                        className="flex-1 px-6 py-3 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105"
                        style={{
                          background: 'linear-gradient(135deg, #E86C32 0%, #D4B170 100%)',
                          border: 'none'
                        }}
                      >
                        Request Quote
                      </Button>
                      <Button 
                        variant="outline"
                        className="px-6 py-3 rounded-full border-2 border-[#E86C32] text-[#E86C32] hover:bg-[#E86C32] hover:text-white transition-all duration-300"
                      >
                        View Menu
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className={`text-center mt-16 transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="bg-gradient-to-r from-[#E86C32] to-[#D4B170] text-white px-8 py-6 rounded-2xl inline-block shadow-xl">
              <h4 className="text-xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                Corporate Account Programs Beschikbaar
              </h4>
              <p className="mb-4" style={{ fontFamily: 'Open Sans, sans-serif' }}>
                Recurring service discounts • Dedicated account management • Priority booking
              </p>
              <Button 
                className="bg-white text-[#E86C32] hover:bg-gray-100 font-bold px-8 py-3 rounded-full transition-all duration-300"
              >
                Setup Corporate Account
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};