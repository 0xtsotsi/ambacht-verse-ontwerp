import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";

export const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="section-spacing bg-background" ref={sectionRef}>
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Content */}
          <div className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}>
            <div className="space-y-6">
              <h2 className="text-display text-charcoal">
                Ambachtelijk
                <span className="text-accent-orange"> & Vers</span>
              </h2>
              
              <div className="w-16 h-0.5 bg-accent-orange" />
              
              <p className="text-body text-charcoal leading-relaxed">
                Bij Wesley's Ambacht geloven wij in de kracht van traditioneel ambachtelijk werk 
                gecombineerd met moderne technieken. Elke maaltijd wordt met passie en precisie 
                bereid, waarbij we alleen de beste ingrediënten gebruiken.
              </p>
              
              <p className="text-body text-charcoal leading-relaxed">
                Onze chef-koks hebben jarenlange ervaring en een oog voor detail. We streven ernaar 
                om elke gast een onvergetelijke culinaire ervaring te bieden.
              </p>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className={`transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            <div className="card-base p-8">
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2070"
                alt="Ambachtelijke bereiding"
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className={`mt-20 transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-base p-8 text-center">
              <div className="text-3xl font-bold text-accent-orange mb-2">500+</div>
              <div className="text-body text-charcoal">Tevreden Klanten</div>
            </div>
            
            <div className="card-base p-8 text-center">
              <div className="text-3xl font-bold text-accent-orange mb-2">10+</div>
              <div className="text-body text-charcoal">Jaar Ervaring</div>
            </div>
            
            <div className="card-base p-8 text-center">
              <div className="text-3xl font-bold text-accent-orange mb-2">100%</div>
              <div className="text-body text-charcoal">Verse Ingrediënten</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};