
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Mail, Phone, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const BookingForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    eventDate: "",
    guestCount: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Aanvraag Verzonden!",
      description: "Bedankt voor uw interesse. Wij nemen binnen 24 uur contact met u op.",
    });
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      serviceType: "",
      eventDate: "",
      guestCount: "",
      message: ""
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contact" className="py-20 bg-warm-cream">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-forest-green mb-4">
              Plan Uw Evenement
            </h2>
            <div className="w-24 h-1 bg-burnt-orange mx-auto mb-6"></div>
            <p className="text-xl text-natural-brown max-w-3xl mx-auto">
              Klaar om uw evenement onvergetelijk te maken? Vul het contactformulier in en 
              wij nemen snel contact met u op voor een persoonlijk advies.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <Card className="bg-forest-green text-warm-cream border-0 h-fit">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">
                    Neem Contact Op
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-burnt-orange" />
                    <div>
                      <div className="font-medium">Telefoon</div>
                      <div className="text-warm-cream/80">0639581128</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-burnt-orange" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-warm-cream/80">info@wesleysambacht.nl</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-burnt-orange" />
                    <div>
                      <div className="font-medium">Beschikbaarheid</div>
                      <div className="text-warm-cream/80">7 dagen per week</div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-warm-cream/20">
                    <h4 className="font-serif text-lg mb-3">Onze Belofte</h4>
                    <ul className="space-y-2 text-sm text-warm-cream/90">
                      <li>• Reactie binnen 24 uur</li>
                      <li>• Vrijblijvende offerte</li>
                      <li>• Persoonlijk advies</li>
                      <li>• Flexibele planning</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-2">
              <Card className="bg-clean-white border-beige/30 wood-texture">
                <CardHeader>
                  <CardTitle className="font-serif text-2xl text-forest-green flex items-center">
                    <MessageSquare className="w-6 h-6 mr-3 text-burnt-orange" />
                    Aanvraag Formulier
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-forest-green font-medium">
                          Naam *
                        </Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          className="border-beige focus:border-forest-green"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-forest-green font-medium">
                          Email *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          className="border-beige focus:border-forest-green"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-forest-green font-medium">
                          Telefoon *
                        </Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          className="border-beige focus:border-forest-green"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="serviceType" className="text-forest-green font-medium">
                          Type Service *
                        </Label>
                        <Select onValueChange={(value) => handleChange("serviceType", value)}>
                          <SelectTrigger className="border-beige focus:border-forest-green">
                            <SelectValue placeholder="Kies een service" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kantoor">Kantoor Catering</SelectItem>
                            <SelectItem value="bbq">BBQ Service</SelectItem>
                            <SelectItem value="buffet">Evenement Buffet</SelectItem>
                            <SelectItem value="anders">Anders</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="eventDate" className="text-forest-green font-medium">
                          Gewenste Datum
                        </Label>
                        <Input
                          id="eventDate"
                          type="date"
                          value={formData.eventDate}
                          onChange={(e) => handleChange("eventDate", e.target.value)}
                          className="border-beige focus:border-forest-green"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="guestCount" className="text-forest-green font-medium">
                          Aantal Gasten
                        </Label>
                        <Select onValueChange={(value) => handleChange("guestCount", value)}>
                          <SelectTrigger className="border-beige focus:border-forest-green">
                            <SelectValue placeholder="Aantal personen" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-10">1-10 personen</SelectItem>
                            <SelectItem value="11-25">11-25 personen</SelectItem>
                            <SelectItem value="26-50">26-50 personen</SelectItem>
                            <SelectItem value="51-100">51-100 personen</SelectItem>
                            <SelectItem value="100+">100+ personen</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-forest-green font-medium">
                        Bericht
                      </Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        placeholder="Vertel ons meer over uw evenement, speciale wensen, diëten, etc."
                        className="border-beige focus:border-forest-green min-h-[120px]"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <Button 
                        type="submit"
                        size="lg"
                        className="w-full bg-burnt-orange hover:bg-burnt-orange/90 text-clean-white py-6 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Verstuur Aanvraag
                      </Button>
                    </div>

                    <p className="text-xs text-natural-brown text-center">
                      * Verplichte velden. Wij respecteren uw privacy en delen uw gegevens niet met derden.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
