"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel"
import { 
  Award, 
  Star, 
  Users, 
  TrendingUp, 
  Shield, 
  Clock,
  MapPin,
  Quote
} from "lucide-react"

interface TrustSignalSectionProps {
  className?: string;
}

interface Award {
  id: string;
  title: string;
  organization: string;
  year: number;
  description: string;
  icon: React.ReactNode;
  category: "quality" | "service" | "sustainability" | "innovation";
}

interface Testimonial {
  id: string;
  content: string;
  author: string;
  company: string;
  role: string;
  rating: number;
  event: string;
  location: string;
}

interface Supplier {
  id: string;
  name: string;
  category: string;
  partnership: string;
  location: string;
  certification?: string;
}

interface Statistic {
  id: string;
  value: string;
  label: string;
  icon: React.ReactNode;
  trend?: "up" | "stable";
}

const awards: Award[] = [
  {
    id: "1",
    title: "Gouden Lepel Award",
    organization: "Nederlandse Horeca Vereniging",
    year: 2024,
    description: "Uitmuntendheid in cateringservices en gastvrijheid",
    icon: <Award className="h-8 w-8 text-[#CC5D00]" />,
    category: "quality"
  },
  {
    id: "2", 
    title: "Duurzame Catering Certificaat",
    organization: "Milieu Centraal",
    year: 2023,
    description: "Erkend voor duurzame inkoop en afvalvermindering",
    icon: <Shield className="h-8 w-8 text-[#2B4040]" />,
    category: "sustainability"
  },
  {
    id: "3",
    title: "Beste Zakelijke Caterer",
    organization: "Corporate Event Awards",
    year: 2024,
    description: "Winnaar in de categorie innovatieve bedrijfscatering",
    icon: <TrendingUp className="h-8 w-8 text-[#3D6160]" />,
    category: "innovation"
  },
  {
    id: "4",
    title: "5-Sterren Service Certificaat",
    organization: "EventPro Nederland",
    year: 2024,
    description: "Hoogste waardering voor klantenservice en betrouwbaarheid",
    icon: <Star className="h-8 w-8 text-[#CC5D00]" />,
    category: "service"
  }
];

const testimonials: Testimonial[] = [
  {
    id: "1",
    content: "Wesley's Ambacht heeft ons corporate event naar een hoger niveau getild. De kwaliteit van het eten en de professionele uitstraling waren werkelijk uitzonderlijk. Onze internationale gasten waren zeer onder de indruk.",
    author: "Dr. Maria van den Berg",
    company: "TechnoVision B.V.",
    role: "Directeur Zakelijke Relaties",
    rating: 5,
    event: "Annual Tech Summit",
    location: "Amsterdam"
  },
  {
    id: "2",
    content: "Voor onze bruiloft zochten wij een caterer die zowel traditie als moderne elegantie kon combineren. Wesley's team heeft onze verwachtingen overtroffen met hun authentieke Nederlandse gerechten en onberispelijke service.",
    author: "Jeroen & Sophie Hendricks",
    company: "Particuliere klant",
    role: "Bruidspaar",
    rating: 5,
    event: "Huwelijksfeest",
    location: "Utrecht"
  },
  {
    id: "3",
    content: "Als onderdeel van onze ESG-strategie kozen wij bewust voor Wesley's Ambacht vanwege hun duurzame aanpak. De transparantie in hun leveranciersketen en de lokale focus passen perfect bij onze bedrijfswaarden.",
    author: "Drs. Peter Janssen",
    company: "Sustainable Finance Group",
    role: "Chief Sustainability Officer", 
    rating: 5,
    event: "ESG Conference",
    location: "Den Haag"
  }
];

const suppliers: Supplier[] = [
  {
    id: "1",
    name: "Boerderij 't Groene Veld",
    category: "Biologische groenten",
    partnership: "Exclusieve leverancier sinds 2018",
    location: "Waterland",
    certification: "EKO-keurmerk"
  },
  {
    id: "2",
    name: "Kaasmakerij Van der Berg",
    category: "Ambachtelijke kazen",
    partnership: "Traditionele partner sinds 2016",
    location: "Noord-Holland",
    certification: "Streekproduct erkend"
  },
  {
    id: "3",
    name: "Verse Vis Utrecht",
    category: "Duurzame vis & zeevruchten",
    partnership: "MSC-gecertificeerde leverancier",
    location: "IJsselmeer regio",
    certification: "MSC Sustainable"
  },
  {
    id: "4",
    name: "Lokale Bakkerij Tradition",
    category: "Artisanaal brood & gebak",
    partnership: "Dagverse leveringen sinds 2019",
    location: "Utrecht Centrum",
    certification: "Ambachtelijk Bakker"
  }
];

const statistics: Statistic[] = [
  {
    id: "1",
    value: "2,400+",
    label: "Succesvolle evenementen",
    icon: <Users className="h-6 w-6" />,
    trend: "up"
  },
  {
    id: "2", 
    value: "98%",
    label: "Klanttevredenheid",
    icon: <Star className="h-6 w-6" />,
    trend: "stable"
  },
  {
    id: "3",
    value: "15+",
    label: "Jaar ervaring",
    icon: <Clock className="h-6 w-6" />,
    trend: "up"
  },
  {
    id: "4",
    value: "50+",
    label: "Lokale partners",
    icon: <MapPin className="h-6 w-6" />,
    trend: "up"
  }
];

export function TrustSignalSection({ className }: TrustSignalSectionProps) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className={cn("py-24 bg-gradient-to-b from-[#FEFEFE] to-[#FFEFDA]", className)}>
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-[#CC5D00]/10 text-[#CC5D00] border-[#CC5D00]/20">
            Vertrouwen & Kwaliteit
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-[#2C2C2C] mb-6">
            <span className="font-serif">Erkende excellentie</span>
            <br />
            <span className="text-[#CC5D00] font-serif">in cateringservices</span>
          </h2>
          <p className="text-lg text-[#2B4040] max-w-3xl mx-auto leading-relaxed">
            Ontdek waarom Nederlandse bedrijven en particulieren hun belangrijkste evenementen 
            toevertrouwen aan Wesley's Ambacht. Onze awards, klantbeoordelingen en 
            duurzame partnerships spreken voor zich.
          </p>
        </div>

        {/* Statistics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {statistics.map((stat) => (
            <Card key={stat.id} className="text-center border-[#CC5D00]/20 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex justify-center mb-3 text-[#CC5D00]">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-[#2C2C2C] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-[#2B4040] font-medium">
                  {stat.label}
                </div>
                {stat.trend === "up" && (
                  <TrendingUp className="h-4 w-4 text-green-600 mx-auto mt-2" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Awards Carousel Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-[#2C2C2C] mb-4 font-serif">
              Erkende kwaliteit
            </h3>
            <p className="text-[#2B4040] max-w-2xl mx-auto">
              Onze toewijding aan excellentie wordt erkend door toonaangevende 
              organisaties in de Nederlandse horeca- en evenementenbranche.
            </p>
          </div>

          <Carousel className="max-w-5xl mx-auto">
            <CarouselContent>
              {awards.map((award) => (
                <CarouselItem key={award.id} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full border-[#CC5D00]/20 bg-white hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-8 h-full flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex-shrink-0">
                          {award.icon}
                        </div>
                        <Badge 
                          variant="outline" 
                          className="text-xs border-[#CC5D00]/30 text-[#CC5D00]"
                        >
                          {award.year}
                        </Badge>
                      </div>
                      
                      <h4 className="text-xl font-bold text-[#2C2C2C] mb-2 group-hover:text-[#CC5D00] transition-colors">
                        {award.title}
                      </h4>
                      
                      <p className="text-sm font-medium text-[#3D6160] mb-3">
                        {award.organization}
                      </p>
                      
                      <p className="text-sm text-[#2B4040] leading-relaxed flex-grow">
                        {award.description}
                      </p>
                      
                      <Badge 
                        className="mt-4 w-fit bg-[#FFEFDA] text-[#CC5D00] border-[#CC5D00]/20"
                        variant="outline"
                      >
                        {award.category === "quality" && "Kwaliteit"}
                        {award.category === "service" && "Service"}
                        {award.category === "sustainability" && "Duurzaamheid"}
                        {award.category === "innovation" && "Innovatie"}
                      </Badge>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="border-[#CC5D00]/30 text-[#CC5D00] hover:bg-[#CC5D00] hover:text-white" />
            <CarouselNext className="border-[#CC5D00]/30 text-[#CC5D00] hover:bg-[#CC5D00] hover:text-white" />
          </Carousel>
        </div>

        {/* Testimonials Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-[#2C2C2C] mb-4 font-serif">
              Klantbeoordelingen
            </h3>
            <p className="text-[#2B4040] max-w-2xl mx-auto">
              Lees wat onze klanten zeggen over hun ervaring met Wesley's Ambacht 
              en ontdek waarom zij ons aanbevelen.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-[#CC5D00]/20 bg-white/95 backdrop-blur-sm shadow-xl">
              <CardContent className="p-12">
                <div className="text-center mb-8">
                  <Quote className="h-12 w-12 text-[#CC5D00] mx-auto mb-6" />
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-[#CC5D00] fill-current" />
                    ))}
                  </div>
                </div>

                <blockquote className="text-lg text-[#2C2C2C] leading-relaxed text-center mb-8 font-medium">
                  "{testimonials[activeTestimonial].content}"
                </blockquote>

                <div className="text-center border-t border-[#CC5D00]/20 pt-6">
                  <div className="font-bold text-[#2C2C2C] text-lg mb-1">
                    {testimonials[activeTestimonial].author}
                  </div>
                  <div className="text-[#CC5D00] font-medium mb-2">
                    {testimonials[activeTestimonial].role}
                  </div>
                  <div className="text-sm text-[#2B4040]">
                    {testimonials[activeTestimonial].company} • {testimonials[activeTestimonial].event}
                  </div>
                  <div className="text-xs text-[#3D6160] mt-1">
                    {testimonials[activeTestimonial].location}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial Navigation */}
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={cn(
                    "h-3 w-3 rounded-full transition-all duration-300",
                    index === activeTestimonial 
                      ? "bg-[#CC5D00] w-8" 
                      : "bg-[#CC5D00]/30 hover:bg-[#CC5D00]/50"
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Supplier Partnership Section */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-[#2C2C2C] mb-4 font-serif">
              Lokale partnerships
            </h3>
            <p className="text-[#2B4040] max-w-2xl mx-auto">
              Wij werken samen met de beste lokale leveranciers om u verse, 
              duurzame en authentieke Nederlandse producten te garanderen.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {suppliers.map((supplier) => (
              <Card key={supplier.id} className="border-[#CC5D00]/20 bg-white hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h4 className="font-bold text-[#2C2C2C] group-hover:text-[#CC5D00] transition-colors mb-1">
                      {supplier.name}
                    </h4>
                    <p className="text-sm text-[#CC5D00] font-medium">
                      {supplier.category}
                    </p>
                  </div>
                  
                  <div className="text-sm text-[#2B4040] mb-3">
                    {supplier.partnership}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#3D6160] flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {supplier.location}
                    </span>
                    {supplier.certification && (
                      <Badge 
                        variant="outline" 
                        className="text-xs border-green-200 text-green-700 bg-green-50"
                      >
                        {supplier.certification}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto border-[#CC5D00]/20 bg-gradient-to-r from-[#CC5D00]/5 to-[#2B4040]/5">
            <CardContent className="p-8">
              <h4 className="text-2xl font-bold text-[#2C2C2C] mb-4 font-serif">
                Ervaar zelf ons vakmanschap
              </h4>
              <p className="text-[#2B4040] mb-6">
                Ontdek waarom meer dan 2,400 klanten ons hun vertrouwen hebben geschonken. 
                Vraag vandaag nog uw persoonlijke offerte aan.
              </p>
              <Button 
                size="lg"
                className="bg-[#CC5D00] hover:bg-[#CC5D00]/90 text-white px-8 py-6 text-lg font-medium"
              >
                Reserveer uw datum
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}