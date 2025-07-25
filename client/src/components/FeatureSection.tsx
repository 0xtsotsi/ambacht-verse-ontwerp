import { Button } from "@/components/ui/button";
import { Heart, Star, Users, Award, Sparkles, ChefHat } from "lucide-react";

export const FeatureSection = () => {
  const features = [
    {
      title: "BRUILOFTEN",
      description: "We kunnen niet blijer zijn dat u overweegt om ons uw bruiloft te laten verzorgen. Onze chefs begrijpen het belang van uw trouwdag en zullen nauw met u samenwerken om ervoor te zorgen dat elk detail wordt overwogen en elke verwachting wordt overtroffen.",
      image: "/attached_assets/1000005722_1753439577481.jpg",
      buttonText: "Bruiloft Menu's",
      icon: <Heart className="w-8 h-8" />,
      gradient: "from-rose-500 to-pink-500"
    },
    {
      title: "VERS & GEÏNSPIREERD",
      description: "Culinaire innovatie en onberispelijke service is de hoeksteen van Wesley's Ambacht. We zijn toegewijd aan het opbouwen van langdurige relaties gebaseerd op persoonlijke service en uitzonderlijke kwaliteit.",
      image: "/attached_assets/1000005886_1753439577476.jpg",
      buttonText: "Sociale Evenementen",
      icon: <Star className="w-8 h-8" />,
      gradient: "from-amber-500 to-orange-500"
    },
    {
      title: "SERVICE STIJLEN",
      description: "Wesley's Ambacht maakt catering gemakkelijk met verschillende service-opties. Van ophalen en afleveren tot volledige service bezorging, er is een optie geschikt voor elke gelegenheid.",
      image: "/attached_assets/1000005880_1753439577477.jpg",
      buttonText: "Service Opties",
      icon: <Users className="w-8 h-8" />,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "KWALITEIT & AMBACHT",
      description: "We werken hartstochtelijk samen met talloze mensen en bedrijven die onze passie voor excellentie delen. Hieronder vindt u een aantal partners die we trots aanbevelen op basis van onze gedeelde ervaring.",
      image: "/attached_assets/1000005693_1753439577478.jpg",
      buttonText: "Onze Partners",
      icon: <Award className="w-8 h-8" />,
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <section className="section-spacing bg-gradient-to-br from-gray-50 via-orange-50/30 to-amber-50/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-100/10 to-amber-100/10"></div>
      <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-orange-300/20 to-amber-300/20 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="container-main relative z-10">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-orange-500 mr-3 animate-bounce" />
            <h2 className="text-5xl font-bold text-gray-800">ONZE SPECIALITEITEN</h2>
            <Sparkles className="w-8 h-8 text-orange-500 ml-3 animate-bounce" />
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`flex flex-col lg:flex-row items-center gap-8 group ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image */}
              <div className="flex-1 relative overflow-hidden rounded-2xl shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:from-black/60 transition-all duration-500"></div>
                <div className={`absolute top-4 left-4 bg-gradient-to-r ${feature.gradient} text-white p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="mb-6">
                  <h3 className="text-3xl font-bold text-gray-800 mb-4 group-hover:text-orange-600 transition-colors duration-300">{feature.title}</h3>
                  <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto lg:mx-0 rounded-full group-hover:w-24 transition-all duration-300"></div>
                </div>
                
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  {feature.description}
                </p>

                <Button className={`bg-gradient-to-r ${feature.gradient} hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-white px-8 py-3 rounded-full`}>
                  {feature.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Promise Section */}
        <div className="mt-24 text-center">
          <div className="bg-secondary py-16 px-8 rounded-lg">
            <h3 className="text-subheading text-muted mb-4">WE ARE HERE TO SERVE YOU</h3>
            <p className="text-body text-muted max-w-3xl mx-auto leading-relaxed">
              We can prepare a quote for you for just a few pans of food for a small get together or help plan your next big celebration. We have relationships with all the area's best event vendors and can act as your one-stop-shop for anything event related. Contact our event specialists today to see if your date is available. We look forward to hearing more about your event!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};