import { Button } from "@/components/ui/button";

export const FeatureSection = () => {
  const features = [
    {
      title: "WEDDINGS",
      description: "We couldn't be happier that you're considering us to cater your wedding. Our chefs understand the importance of your wedding day and will work closely with you to ensure every detail is considered and every expectation exceeded.",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070",
      buttonText: "Wedding Menus"
    },
    {
      title: "FRESH & INSPIRED",
      description: "Culinary innovation and impeccable service is the cornerstone of Soprano's Catering. We are committed to building long term relationships based on personal service and exceptional quality. Choose from one of our menu options or let our chefs design a menu specifically for you.",
      image: "https://images.unsplash.com/photo-1543362906-acfc16c67564?q=80&w=2065",
      buttonText: "Social Events"
    },
    {
      title: "SERVICE STYLES",
      description: "Soprano's makes catering easy with several service style options. From pick up and drop off, to full service delivery, there is an option suited for any occasion.",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2071",
      buttonText: "Service Styles"
    },
    {
      title: "VENUES & VENDORS",
      description: "We passionately work with countless people and businesses who share our passion for excellence. When we do, we're happy to recommend them to our clients. Below you'll find a few partners we are proud to recommend based on our shared experience.",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2070",
      buttonText: "Venues & Vendors"
    }
  ];

  return (
    <section className="section-spacing bg-background">
      <div className="container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`flex flex-col lg:flex-row items-center gap-8 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image */}
              <div className="flex-1">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-80 object-cover rounded-lg shadow-lg"
                />
              </div>

              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="mb-6">
                  <h3 className="text-heading text-foreground mb-4">{feature.title}</h3>
                </div>
                
                <p className="text-body text-muted leading-relaxed mb-6">
                  {feature.description}
                </p>

                <Button className="btn-primary">
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