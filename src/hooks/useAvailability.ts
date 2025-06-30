import { useState, useEffect, useCallback } from 'react';
import { 
  getAvailabilitySlots, 
  getAvailableTimeSlots, 
  checkAvailability,
  mapAvailabilityToDateChecker,
  subscribeToAvailabilityChanges,
  type AvailabilitySlot 
} from '@/integrations/supabase/database';
import { addDays, format } from 'date-fns';

interface UseAvailabilityOptions {
  daysAhead?: number;
  enableRealTime?: boolean;
}

interface AvailabilityData {
  dates: {
    booked: Date[];
    limited: Date[];
  };
  timeSlots: {
    morning: string[];
    afternoon: string[];
    evening: string[];
  };
}

export function useAvailability(options: UseAvailabilityOptions = {}) {
  const { daysAhead = 180, enableRealTime = true } = options;
  
  const [availability, setAvailability] = useState<AvailabilityData>({
    dates: { booked: [], limited: [] },
    timeSlots: { morning: [], afternoon: [], evening: [] }
  });
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailability = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const startDate = format(new Date(), 'yyyy-MM-dd');
      const endDate = format(addDays(new Date(), daysAhead), 'yyyy-MM-dd');
      
      const slots = await getAvailabilitySlots(startDate, endDate);
      setAvailableSlots(slots);
      
      const mappedData = mapAvailabilityToDateChecker(slots);
      setAvailability(mappedData);
    } catch (err) {
      console.error('Error fetching availability:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch availability');
    } finally {
      setLoading(false);
    }
  }, [daysAhead]);

  const getTimeSlotsForDate = useCallback(async (date: Date): Promise<AvailabilitySlot[]> => {
    try {
      const dateString = format(date, 'yyyy-MM-dd');
      return await getAvailableTimeSlots(dateString);
    } catch (err) {
      console.error('Error fetching time slots for date:', err);
      return [];
    }
  }, []);

  const isDateAvailable = useCallback((date: Date): boolean => {
    const dateString = format(date, 'yyyy-MM-dd');
    return availableSlots.some(slot => 
      slot.date === dateString && 
      slot.current_bookings < slot.max_bookings && 
      !slot.is_blocked
    );
  }, [availableSlots]);

  const isDateBooked = useCallback((date: Date): boolean => {
    return availability.dates.booked.some(
      bookedDate => format(date, 'yyyy-MM-dd') === format(bookedDate, 'yyyy-MM-dd')
    );
  }, [availability.dates.booked]);

  const isDateLimited = useCallback((date: Date): boolean => {
    return availability.dates.limited.some(
      limitedDate => format(date, 'yyyy-MM-dd') === format(limitedDate, 'yyyy-MM-dd')
    );
  }, [availability.dates.limited]);

  const checkSlotAvailability = useCallback(async (date: Date, time: string): Promise<boolean> => {
    try {
      const dateString = format(date, 'yyyy-MM-dd');
      return await checkAvailability(dateString, time);
    } catch (err) {
      console.error('Error checking slot availability:', err);
      return false;
    }
  }, []);

  // Initialize data
  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  // Set up real-time subscription
  useEffect(() => {
    if (!enableRealTime) return;

    const channel = subscribeToAvailabilityChanges((payload) => {
      console.log('Availability changed:', payload);
      // Refresh availability data when changes occur
      fetchAvailability();
    });

    return () => {
      channel.unsubscribe();
    };
  }, [enableRealTime, fetchAvailability]);

  return {
    availability,
    availableSlots,
    loading,
    error,
    refresh: fetchAvailability,
    getTimeSlotsForDate,
    isDateAvailable,
    isDateBooked,
    isDateLimited,
    checkSlotAvailability
  };
}