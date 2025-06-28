import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, Users, Sparkles, CheckCircle } from 'lucide-react';
import { format, addDays, setHours, setMinutes } from 'date-fns';
import { nl } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface DateCheckerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (date: Date, time: string, guests: number) => void;
}

// Mock availability data - replace with Supabase integration
const mockAvailability = {
  dates: {
    booked: [
      addDays(new Date(), 2),
      addDays(new Date(), 5),
      addDays(new Date(), 8),
    ],
    limited: [
      addDays(new Date(), 3),
      addDays(new Date(), 7),
    ],
  },
  timeSlots: {
    morning: ['10:00', '10:30', '11:00', '11:30'],
    afternoon: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'],
    evening: ['16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'],
  },
};

export function DateCheckerModal({ open, onOpenChange, onConfirm }: DateCheckerModalProps) {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [guestCount, setGuestCount] = useState<number[]>([20]);
  const [isChecking, setIsChecking] = useState(false);
  const [step, setStep] = useState(1);

  // Reset when modal opens
  useEffect(() => {
    if (open) {
      setSelectedDate(undefined);
      setSelectedTime('');
      setGuestCount([20]);
      setStep(1);
    }
  }, [open]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setIsChecking(true);
      // Simulate availability check
      setTimeout(() => {
        setIsChecking(false);
        setStep(2);
        toast({
          title: "Geweldige keuze!",
          description: `${format(date, 'EEEE d MMMM', { locale: nl })} heeft beschikbare tijdslots.`,
          duration: 3000,
        });
      }, 800);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(3);
  };

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onConfirm(selectedDate, selectedTime, guestCount[0]);
      toast({
        title: "Reserveringsaanvraag verzonden!",
        description: "We bevestigen uw reservering binnen 24 uur.",
        duration: 5000,
      });
      onOpenChange(false);
    }
  };

  const isDateBooked = (date: Date) => {
    return mockAvailability.dates.booked.some(
      bookedDate => format(date, 'yyyy-MM-dd') === format(bookedDate, 'yyyy-MM-dd')
    );
  };

  const isDateLimited = (date: Date) => {
    return mockAvailability.dates.limited.some(
      limitedDate => format(date, 'yyyy-MM-dd') === format(limitedDate, 'yyyy-MM-dd')
    );
  };

  const getPopularityBadge = (time: string) => {
    const popularTimes = ['18:00', '18:30', '19:00', '19:30'];
    if (popularTimes.includes(time)) {
      return <Badge variant="secondary" className="ml-2 text-xs">Populair</Badge>;
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-forest-green flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-burnt-orange" />
            Controleer Beschikbaarheid
          </DialogTitle>
          <DialogDescription className="text-forest-green/80">
            {step === 1 && "Selecteer uw gewenste datum voor uw evenement"}
            {step === 2 && "Kies het perfecte tijdstip voor uw gasten"}
            {step === 3 && "Hoeveel gasten mogen we verwelkomen?"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2">
            <div className={cn(
              "w-3 h-3 rounded-full transition-colors",
              step >= 1 ? "bg-burnt-orange" : "bg-gray-300"
            )} />
            <div className={cn(
              "w-16 h-0.5 transition-colors",
              step >= 2 ? "bg-burnt-orange" : "bg-gray-300"
            )} />
            <div className={cn(
              "w-3 h-3 rounded-full transition-colors",
              step >= 2 ? "bg-burnt-orange" : "bg-gray-300"
            )} />
            <div className={cn(
              "w-16 h-0.5 transition-colors",
              step >= 3 ? "bg-burnt-orange" : "bg-gray-300"
            )} />
            <div className={cn(
              "w-3 h-3 rounded-full transition-colors",
              step >= 3 ? "bg-burnt-orange" : "bg-gray-300"
            )} />
          </div>

          {/* Step 1: Date Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) => 
                  date < new Date() || 
                  date.getDay() === 0 || // Closed on Sundays
                  isDateBooked(date)
                }
                modifiers={{
                  booked: (date) => isDateBooked(date),
                  limited: (date) => isDateLimited(date),
                }}
                modifiersStyles={{
                  booked: { 
                    textDecoration: 'line-through',
                    opacity: 0.5 
                  },
                  limited: { 
                    backgroundColor: '#FFF3E0',
                    fontWeight: 'bold'
                  },
                }}
                className="rounded-md border mx-auto"
              />
              
              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span>Beschikbaar</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-200 rounded-full" />
                  <span>Beperkt</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-300 rounded-full" />
                  <span>Niet beschikbaar</span>
                </div>
              </div>

              {isChecking && (
                <div className="flex items-center justify-center gap-2 text-burnt-orange">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span className="text-sm">Beschikbaarheid controleren...</span>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Time Selection */}
          {step === 2 && selectedDate && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-lg font-semibold text-forest-green">
                  {format(selectedDate, 'EEEE d MMMM yyyy', { locale: nl })}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold text-forest-green flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4" />
                    Ochtend (10:00 - 12:00)
                  </Label>
                  <RadioGroup value={selectedTime} onValueChange={handleTimeSelect}>
                    <div className="grid grid-cols-4 gap-2">
                      {mockAvailability.timeSlots.morning.map((time) => (
                        <div key={time} className="flex items-center">
                          <RadioGroupItem value={time} id={time} className="peer sr-only" />
                          <Label
                            htmlFor={time}
                            className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-burnt-orange [&:has([data-state=checked])]:border-burnt-orange cursor-pointer w-full"
                          >
                            {time}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-sm font-semibold text-forest-green flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4" />
                    Middag (12:00 - 16:00)
                  </Label>
                  <RadioGroup value={selectedTime} onValueChange={handleTimeSelect}>
                    <div className="grid grid-cols-4 gap-2">
                      {mockAvailability.timeSlots.afternoon.map((time) => (
                        <div key={time} className="flex items-center">
                          <RadioGroupItem value={time} id={time} className="peer sr-only" />
                          <Label
                            htmlFor={time}
                            className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-burnt-orange [&:has([data-state=checked])]:border-burnt-orange cursor-pointer w-full"
                          >
                            {time}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-sm font-semibold text-forest-green flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4" />
                    Avond (16:00 - 20:00)
                    <Badge variant="secondary" className="text-xs">Meest gekozen</Badge>
                  </Label>
                  <RadioGroup value={selectedTime} onValueChange={handleTimeSelect}>
                    <div className="grid grid-cols-4 gap-2">
                      {mockAvailability.timeSlots.evening.map((time) => (
                        <div key={time} className="flex items-center relative">
                          <RadioGroupItem value={time} id={time} className="peer sr-only" />
                          <Label
                            htmlFor={time}
                            className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-burnt-orange [&:has([data-state=checked])]:border-burnt-orange cursor-pointer w-full"
                          >
                            {time}
                          </Label>
                          {getPopularityBadge(time)}
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <Button
                variant="ghost"
                onClick={() => setStep(1)}
                className="w-full"
              >
                Andere datum kiezen
              </Button>
            </div>
          )}

          {/* Step 3: Guest Count */}
          {step === 3 && selectedDate && selectedTime && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <p className="text-lg font-semibold text-forest-green">
                  {format(selectedDate, 'EEEE d MMMM yyyy', { locale: nl })} om {selectedTime}
                </p>
              </div>

              <div className="space-y-4">
                <Label className="text-lg font-semibold text-forest-green flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Aantal Gasten
                </Label>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Min. 10</span>
                    <span className="font-semibold text-lg text-forest-green">{guestCount[0]} gasten</span>
                    <span>Max. 200</span>
                  </div>
                  
                  <Slider
                    value={guestCount}
                    onValueChange={setGuestCount}
                    min={10}
                    max={200}
                    step={5}
                    className="w-full"
                  />
                  
                  <div className="grid grid-cols-4 gap-2 mt-4">
                    {[20, 50, 100, 150].map((count) => (
                      <Button
                        key={count}
                        variant="outline"
                        size="sm"
                        onClick={() => setGuestCount([count])}
                        className={cn(
                          "transition-colors",
                          guestCount[0] === count && "border-burnt-orange bg-burnt-orange/10"
                        )}
                      >
                        {count}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="bg-warm-cream/50 p-4 rounded-lg">
                  <p className="text-sm text-forest-green">
                    <span className="font-semibold">Geschatte prijs:</span> €{(guestCount[0] * 22.50).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    *Exacte prijs hangt af van uw menukeuzes
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1"
                >
                  Tijd wijzigen
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="flex-1 bg-burnt-orange hover:bg-burnt-orange/90"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Bevestig Aanvraag
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}