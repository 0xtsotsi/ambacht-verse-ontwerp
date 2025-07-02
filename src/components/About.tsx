
import { Card, CardContent } from "@/components/ui/card";

export const About = () => {
  return (
    <>
      {/* Main About Section - Minimalist Luxury */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center min-h-screen">
              {/* Left Side - Clean Content */}
              <div className="flex items-center justify-center">
                <div className="max-w-lg text-center">
                  
                  <h2 className="text-7xl md:text-8xl font-elegant-heading text-elegant-dark mb-20 font-light tracking-[-0.02em] leading-none">
                    <span className="text-terracotta-600">
                      AMBACHTELIJK
                    </span><br />
                    EN VERS
                  </h2>
                  
                  <div className="w-24 h-px bg-terracotta-600 mx-auto mb-16"></div>
                  
                  <p className="text-elegant-dark font-elegant-body text-2xl leading-relaxed font-light">
                    Of u nu een broodjeslunch op de zaak wilt, een BBQ om het seizoen af te sluiten of een buffet om uw verjaardag te vieren. Wij staan voor u klaar!
                  </p>
                </div>
              </div>

              {/* Right Side - Clean Image */}
              <div className="relative">
                <div 
                  className="h-[800px] bg-cover bg-center bg-no-repeat transition-all duration-300"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=2074')"
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end justify-center p-16">
                    <div className="text-center">
                      <h3 className="text-white font-elegant-script text-5xl md:text-6xl mb-4 font-light">
                        Hopelijk<br />
                        tot ziens!
                      </h3>
                      <div className="w-16 h-px bg-white/60 mx-auto"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Are We Section - Minimalist Luxury */}
      <section id="about" className="py-32 bg-gray-50">
        <div className="container mx-auto px-16 py-20">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-8xl md:text-9xl font-elegant-heading text-elegant-dark mb-24 font-light tracking-[-0.02em]">
              WIE ZIJN WIJ?
            </h2>
            <div className="w-32 h-px bg-terracotta-600 mx-auto mb-32"></div>
            
            <div className="bg-white p-24 md:p-32 border-0 shadow-none mb-32">
              <p className="text-elegant-dark font-elegant-body text-3xl leading-relaxed mb-16 font-light max-w-4xl mx-auto">
                Met passie voor handwerkingsvij bij Wesley's Ambacht sorgen wij
                helesge catering en barbecues als in vroeger ... authentiek en
                ambachtelijke.
              </p>
              
              <div className="w-24 h-px bg-terracotta-600 mx-auto mb-16"></div>
              
              <p className="text-elegant-dark font-elegant-body text-2xl leading-relaxed font-light max-w-4xl mx-auto">
                Wij steltens de hoogste kwaliteit ingrediënten en lokale leveranciers
                en koupt het puur en en fress voor uu.
              </p>
            </div>

            {/* Clean Suppliers Section */}
            <div>
              <h3 className="text-6xl font-elegant-heading text-elegant-dark mb-32 font-light tracking-[-0.02em]">
                ONZE LEVERANCIERS
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
                {/* Kaasboerderij */}
                <div className="text-center">
                  <h4 className="text-2xl font-elegant-heading text-terracotta-600 font-light tracking-wide">
                    KAASBOERDERIJ<br />
                    VAN SCHAIK
                  </h4>
                </div>

                {/* Bakkerij */}
                <div className="text-center">
                  <h4 className="text-2xl font-elegant-heading text-terracotta-600 font-light tracking-wide">
                    BAKKERIJ<br />
                    VAN HARBERDEN
                  </h4>
                </div>

                {/* Vishandel */}
                <div className="text-center">
                  <h4 className="text-2xl font-elegant-heading text-terracotta-600 font-light tracking-wide">
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
