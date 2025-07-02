
import { Card, CardContent } from "@/components/ui/card";

export const About = () => {
  return (
    <>
      {/* Main About Section */}
      <section className="py-0 bg-elegant-light">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
              {/* Left Side - Content */}
              <div className="flex items-center justify-center p-8 lg:p-16">
                <div className="max-w-md">
                  {/* Traditional House Illustration */}
                  <div className="mb-8 flex justify-center">
                    <div className="w-48 h-32 bg-gradient-to-br from-natural-brown/30 to-burnt-orange/20 rounded-lg flex items-center justify-center">
                      <div className="text-6xl">🏠</div>
                    </div>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-elegant-heading text-elegant-dark mb-10 text-center">
                    AMBACHTELIJK<br />
                    EN VERS
                  </h2>
                  
                  <p className="text-elegant-dark font-elegant-body text-lg leading-relaxed text-center">
                    Of u nu een broodjeslunch op de zaak wilt, een BBQ om het seizoen af te sluiten of een buffet om uw verjaardag te vieren. Wij staan voor u klaar!
                  </p>
                </div>
              </div>

              {/* Right Side - Image */}
              <div className="relative">
                <div 
                  className="h-full bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=2074')"
                  }}
                >
                  {/* Overlay Text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-elegant-dark/80 to-transparent flex items-end justify-center p-8">
                    <h3 className="text-elegant-terracotta font-elegant-script text-4xl md:text-5xl text-center">
                      Hopelijk<br />
                      tot ziens!
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Are We Section */}
      <section id="about" className="py-20 bg-elegant-light">
        <div 
          className="relative min-h-screen bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url('https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=2077')"
          }}
        >
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-5xl md:text-6xl font-elegant-heading text-elegant-dark mb-16">
                WIE ZIJN WIJ?
              </h2>
              
              <div className="bg-elegant-light/95 rounded-elegant p-10 md:p-16 shadow-elegant-panel backdrop-blur-sm mb-16">
                <p className="text-elegant-dark font-elegant-body text-xl leading-relaxed mb-8">
                  Met passie voor handwerkingsvij bij Wesley's Ambacht sorgen wij
                  helesge catering en barbecues als in vroeger ... authentiek en
                  ambachtelijke.
                </p>
                
                <p className="text-elegant-dark font-elegant-body text-lg leading-relaxed">
                  Wij steltens de hoogste kwaliteit ingrediënten en lokale leveranciers
                  en koupt het puur en en fress voor uu.
                </p>
              </div>

              {/* Suppliers Section */}
              <h3 className="text-4xl font-elegant-heading text-elegant-dark mb-16">
                ONZE LEVERANCIERS
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Kaasboerderij */}
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-elegant-terracotta/20 to-elegant-terracotta/10 rounded-elegant flex items-center justify-center shadow-elegant-subtle">
                    <div className="text-4xl">🏠</div>
                  </div>
                  <h4 className="text-xl font-elegant-heading text-elegant-terracotta mb-2">
                    KAASBOERDERIJ<br />
                    VAN SCHAIK
                  </h4>
                </div>

                {/* Bakkerij */}
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-elegant-terracotta/20 to-elegant-terracotta/10 rounded-elegant flex items-center justify-center shadow-elegant-subtle">
                    <div className="text-4xl">⚙️</div>
                  </div>
                  <h4 className="text-xl font-elegant-heading text-elegant-terracotta mb-2">
                    BAKKERIJ<br />
                    VAN HARBERDEN
                  </h4>
                </div>

                {/* Vishandel */}
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-elegant-terracotta/20 to-elegant-terracotta/10 rounded-elegant flex items-center justify-center shadow-elegant-subtle">
                    <div className="text-4xl">🐟</div>
                  </div>
                  <h4 className="text-xl font-elegant-heading text-elegant-terracotta mb-2">
                    VISHANDEL<br />
                    SPERLING
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
