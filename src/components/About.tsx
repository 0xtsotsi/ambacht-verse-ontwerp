
import { Card, CardContent } from "@/components/ui/card";

export const About = () => {
  return (
    <>
      {/* Main About Section - Organic Sophistication */}
      <section className="py-0 bg-gradient-to-br from-elegant-light via-terracotta-50/40 to-terracotta-100/20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
              {/* Left Side - Organic Content */}
              <div className="flex items-center justify-center p-8 lg:p-20 relative">
                {/* Organic Background */}
                <div className="absolute inset-0 opacity-15">
                  <div 
                    className="w-full h-full"
                    style={{
                      backgroundImage: `
                        radial-gradient(ellipse 400px 300px at 40% 60%, rgba(224,138,79,0.2) 0%, transparent 70%),
                        radial-gradient(ellipse 300px 200px at 70% 30%, rgba(224,138,79,0.15) 0%, transparent 60%),
                        radial-gradient(ellipse 200px 150px at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)
                      `,
                      backgroundSize: '600px 500px, 500px 400px, 300px 250px',
                      filter: 'blur(1px)'
                    }}
                  ></div>
                </div>
                
                <div className="max-w-lg relative z-10 animate-organic-grow">
                  {/* Organic Illustration */}
                  <div className="mb-16 flex justify-center">
                    <div className="relative">
                      <div className="w-64 h-48 bg-gradient-to-br from-terracotta-400/25 via-terracotta-500/15 to-terracotta-600/25 rounded-3xl flex items-center justify-center shadow-organic-floating border border-terracotta-200/40 backdrop-blur-sm transform hover:scale-105 transition-all duration-700 animate-organic-breathe">
                        <div className="text-8xl transform hover:rotate-6 transition-all duration-500 animate-organic-float">🏠</div>
                      </div>
                      {/* Organic Floating Elements */}
                      <div className="absolute -top-4 -right-4 w-10 h-8 bg-gradient-to-br from-terracotta-400/60 to-terracotta-600/60 rounded-full animate-organic-float"></div>
                      <div className="absolute -bottom-4 -left-4 w-8 h-6 bg-gradient-to-br from-terracotta-500/50 to-terracotta-700/50 rounded-full animate-organic-float" style={{ animationDelay: '1s' }}></div>
                      <div className="absolute top-4 left-4 w-6 h-6 bg-gradient-to-br from-terracotta-300/40 to-terracotta-500/40 rounded-full animate-organic-float" style={{ animationDelay: '2s' }}></div>
                    </div>
                  </div>
                  
                  <h2 className="text-5xl md:text-6xl font-elegant-heading text-elegant-dark mb-14 text-center font-bold tracking-tight">
                    <span className="bg-gradient-to-br from-terracotta-600 via-terracotta-700 to-terracotta-800 bg-clip-text text-transparent">
                      AMBACHTELIJK
                    </span><br />
                    EN VERS
                  </h2>
                  
                  <div className="w-28 h-2 bg-gradient-to-r from-terracotta-400 via-terracotta-500 to-terracotta-600 mx-auto mb-10 rounded-full opacity-90"></div>
                  
                  <p className="text-elegant-dark font-elegant-body text-xl leading-relaxed text-center font-medium">
                    Of u nu een broodjeslunch op de zaak wilt, een BBQ om het seizoen af te sluiten of een buffet om uw verjaardag te vieren. Wij staan voor u klaar!
                  </p>
                </div>
              </div>

              {/* Right Side - Enhanced Image */}
              <div className="relative group">
                <div 
                  className="h-full bg-cover bg-center bg-no-repeat rounded-l-3xl lg:rounded-l-none transform group-hover:scale-[1.02] transition-all duration-500"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=2074')"
                  }}
                >
                  {/* Modern Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-terracotta-900/90 via-terracotta-800/40 to-transparent flex items-end justify-center p-12 rounded-l-3xl lg:rounded-l-none">
                    <div className="text-center transform group-hover:-translate-y-2 transition-all duration-300">
                      <h3 className="text-terracotta-200 font-elegant-script text-5xl md:text-6xl mb-4 animate-elegant-glow">
                        Hopelijk<br />
                        tot ziens!
                      </h3>
                      <div className="w-16 h-0.5 bg-gradient-to-r from-terracotta-300 to-terracotta-400 mx-auto rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Are We Section - Modern Fusion */}
      <section id="about" className="py-20 bg-gradient-to-br from-elegant-light via-terracotta-50/20 to-elegant-light">
        <div 
          className="relative min-h-screen bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "linear-gradient(135deg, rgba(224,138,79,0.15), rgba(0,0,0,0.2)), url('https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=2077')"
          }}
        >
          {/* Modern Pattern Overlay */}
          <div className="absolute inset-0 opacity-15">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 25% 25%, rgba(224,138,79,0.3) 0%, transparent 50%),
                  radial-gradient(circle at 75% 75%, rgba(224,138,79,0.2) 0%, transparent 50%),
                  linear-gradient(45deg, transparent 30%, rgba(224,138,79,0.1) 50%, transparent 70%)
                `,
                backgroundSize: '300px 300px, 250px 250px, 80px 80px'
              }}
            ></div>
          </div>

          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              <div className="animate-elegant-fade-in">
                <h2 className="text-6xl md:text-7xl font-elegant-heading text-elegant-dark mb-8 font-bold tracking-tight">
                  WIE ZIJN WIJ?
                </h2>
                <div className="w-32 h-1 bg-gradient-to-r from-terracotta-400 to-terracotta-600 mx-auto mb-20 rounded-full"></div>
              </div>
              
              <div className="bg-gradient-to-br from-elegant-light/95 via-elegant-light/90 to-terracotta-50/80 backdrop-blur-md rounded-3xl p-12 md:p-20 shadow-elegant-panel border border-terracotta-200/50 mb-20 transform hover:scale-[1.02] transition-all duration-500">
                <p className="text-elegant-dark font-elegant-body text-2xl leading-relaxed mb-10 font-medium">
                  Met passie voor handwerkingsvij bij Wesley's Ambacht sorgen wij
                  helesge catering en barbecues als in vroeger ... authentiek en
                  ambachtelijke.
                </p>
                
                <div className="w-16 h-0.5 bg-gradient-to-r from-terracotta-400 to-terracotta-600 mx-auto mb-10 rounded-full"></div>
                
                <p className="text-elegant-dark font-elegant-body text-xl leading-relaxed font-medium">
                  Wij steltens de hoogste kwaliteit ingrediënten en lokale leveranciers
                  en koupt het puur en en fress voor uu.
                </p>
              </div>

              {/* Modern Suppliers Section */}
              <div className="animate-elegant-fade-in" style={{ animationDelay: '0.3s' }}>
                <h3 className="text-5xl font-elegant-heading text-elegant-dark mb-20 font-bold">
                  ONZE LEVERANCIERS
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {/* Kaasboerderij */}
                  <div className="text-center group">
                    <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-terracotta-400/30 via-terracotta-500/20 to-terracotta-600/30 rounded-3xl flex items-center justify-center shadow-elegant-panel border border-terracotta-200/50 backdrop-blur-sm transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <div className="text-5xl transform group-hover:scale-110 transition-all duration-300">🏠</div>
                    </div>
                    <h4 className="text-2xl font-elegant-heading text-terracotta-600 mb-2 font-bold group-hover:text-terracotta-700 transition-colors duration-300">
                      KAASBOERDERIJ<br />
                      VAN SCHAIK
                    </h4>
                  </div>

                  {/* Bakkerij */}
                  <div className="text-center group">
                    <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-terracotta-400/30 via-terracotta-500/20 to-terracotta-600/30 rounded-3xl flex items-center justify-center shadow-elegant-panel border border-terracotta-200/50 backdrop-blur-sm transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                      <div className="text-5xl transform group-hover:scale-110 transition-all duration-300">⚙️</div>
                    </div>
                    <h4 className="text-2xl font-elegant-heading text-terracotta-600 mb-2 font-bold group-hover:text-terracotta-700 transition-colors duration-300">
                      BAKKERIJ<br />
                      VAN HARBERDEN
                    </h4>
                  </div>

                  {/* Vishandel */}
                  <div className="text-center group">
                    <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-terracotta-400/30 via-terracotta-500/20 to-terracotta-600/30 rounded-3xl flex items-center justify-center shadow-elegant-panel border border-terracotta-200/50 backdrop-blur-sm transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <div className="text-5xl transform group-hover:scale-110 transition-all duration-300">🐟</div>
                    </div>
                    <h4 className="text-2xl font-elegant-heading text-terracotta-600 mb-2 font-bold group-hover:text-terracotta-700 transition-colors duration-300">
                      VISHANDEL<br />
                      SPERLING
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
