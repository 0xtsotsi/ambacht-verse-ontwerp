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
import { useApiLoggerQuery } from './useApiLogger';
import { logApiError } from '@/lib/apiLogger';

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
  const [error, setError] = useState<string | null>(null);
  
  const startDate = format(new Date(), 'yyyy-MM-dd');
  const endDate = format(addDays(new Date(), daysAhead), 'yyyy-MM-dd');

  // Enhanced query with logging
  const availabilityQuery = useApiLoggerQuery({
    queryKey: ['availability', startDate, endDate],
    queryFn: () => getAvailabilitySlots(startDate, endDate),
    endpoint: 'availability_slots',
    method: 'GET',
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });

  // Process availability data when query succeeds
  useEffect(() => {
    if (availabilityQuery.data) {
      const mappedData = mapAvailabilityToDateChecker(availabilityQuery.data);
      setAvailability(mappedData);
      setError(null);
    }
    if (availabilityQuery.error) {
      logApiError('availability_slots', availabilityQuery.error as Error, { 
        method: 'GET', 
        payload: { startDate, endDate } 
      });
      setError(availabilityQuery.error.message);
    }
  }, [availabilityQuery.data, availabilityQuery.error, startDate, endDate]);

  const getTimeSlotsForDate = useCallback(async (date: Date): Promise<AvailabilitySlot[]> => {
    try {
      const dateString = format(date, 'yyyy-MM-dd');
      return await getAvailableTimeSlots(dateString);
    } catch (err) {
      logApiError('availability_slots/available', err as Error, { 
        method: 'GET', 
        payload: { date: dateString } 
      });
      return [];
    }
  }, []);

  const isDateAvailable = useCallback((date: Date): boolean => {
    const dateString = format(date, 'yyyy-MM-dd');
    return availabilityQuery.data?.some(slot => 
      slot.date === dateString && 
      slot.current_bookings < slot.max_bookings && 
      !slot.is_blocked
    ) || false;
  }, [availabilityQuery.data]);

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
      logApiError('rpc/check_availability', err as Error, { 
        method: 'POST', 
        payload: { date: dateString, time } 
      });
      return false;
    }
  }, []);

  // Refresh function for manual refetch
  const refresh = useCallback(() => {
    availabilityQuery.refetch();
  }, [availabilityQuery]);

  // Set up real-time subscription
  useEffect(() => {
    if (!enableRealTime) return;

    const channel = subscribeToAvailabilityChanges((payload) => {
      console.log('Availability changed:', payload);
      // Refresh availability data when changes occur
      availabilityQuery.refetch();
    });

    return () => {
      channel.unsubscribe();
    };
  }, [enableRealTime, availabilityQuery]);

  return {
    availability,
    availableSlots: availabilityQuery.data || [],
    loading: availabilityQuery.isLoading,
    error,
    refresh,
    getTimeSlotsForDate,
    isDateAvailable,
    isDateBooked,
    isDateLimited,
    checkSlotAvailability
  };
}