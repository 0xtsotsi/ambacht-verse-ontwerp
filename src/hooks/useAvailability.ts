import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  getAvailabilitySlots,
  getAvailableTimeSlots,
  checkAvailability,
  mapAvailabilityToDateChecker,
  subscribeToAvailabilityChanges,
  type AvailabilitySlot,
} from "@/integrations/supabase/database";
import { addDays, format } from "date-fns";
import { useApiLoggerQuery } from "./useApiLogger";
import { logApiError } from "@/lib/apiLogger";

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

  // Cache for expensive computations
  const availabilityCache = useRef<Map<string, AvailabilityData>>(new Map());
  const timeSlotsCache = useRef<Map<string, AvailabilitySlot[]>>(new Map());

  const [availability, setAvailability] = useState<AvailabilityData>({
    dates: { booked: [], limited: [] },
    timeSlots: { morning: [], afternoon: [], evening: [] },
  });
  const [error, setError] = useState<string | null>(null);

  // Memoize date calculations
  const { startDate, endDate } = useMemo(
    () => ({
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: format(addDays(new Date(), daysAhead), "yyyy-MM-dd"),
    }),
    [daysAhead],
  );

  // Enhanced query with logging
  const availabilityQuery = useApiLoggerQuery({
    queryKey: ["availability", startDate, endDate],
    queryFn: () => getAvailabilitySlots(startDate, endDate),
    endpoint: "availability_slots",
    method: "GET",
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Process availability data when query succeeds
  useEffect(() => {
    if (availabilityQuery.data) {
      const mappedData = mapAvailabilityToDateChecker(availabilityQuery.data);
      setAvailability(mappedData);
      setError(null);

      // Clear caches when availability data changes
      availabilityCache.current.clear();
      timeSlotsCache.current.clear();
    }
    if (availabilityQuery.error) {
      logApiError("availability_slots", availabilityQuery.error as Error, {
        method: "GET",
        payload: { startDate, endDate },
      });
      setError(availabilityQuery.error.message);
    }
  }, [availabilityQuery.data, availabilityQuery.error, startDate, endDate]);

  const getTimeSlotsForDate = useCallback(
    async (date: Date): Promise<AvailabilitySlot[]> => {
      const dateString = format(date, "yyyy-MM-dd");

      // Check cache first
      if (timeSlotsCache.current.has(dateString)) {
        return timeSlotsCache.current.get(dateString)!;
      }

      try {
        const slots = await getAvailableTimeSlots(dateString);
        // Cache the result
        timeSlotsCache.current.set(dateString, slots);
        return slots;
      } catch (err) {
        logApiError("availability_slots/available", err as Error, {
          method: "GET",
          payload: { date: dateString },
        });
        return [];
      }
    },
    [],
  );

  const isDateAvailable = useCallback(
    (date: Date): boolean => {
      const dateString = format(date, "yyyy-MM-dd");
      return (
        availabilityQuery.data?.some(
          (slot) =>
            slot.date === dateString &&
            slot.current_bookings < slot.max_bookings &&
            !slot.is_blocked,
        ) || false
      );
    },
    [availabilityQuery.data],
  );

  const isDateBooked = useCallback(
    (date: Date): boolean => {
      const dateString = format(date, "yyyy-MM-dd");
      const cacheKey = `booked-${dateString}`;

      // Check cache first
      if (availabilityCache.current.has(cacheKey)) {
        return availabilityCache.current.get(cacheKey);
      }

      const isBooked = availability.dates.booked.some(
        (bookedDate) => format(bookedDate, "yyyy-MM-dd") === dateString,
      );

      // Cache the result
      availabilityCache.current.set(cacheKey, isBooked);
      return isBooked;
    },
    [availability.dates.booked],
  );

  const isDateLimited = useCallback(
    (date: Date): boolean => {
      const dateString = format(date, "yyyy-MM-dd");
      const cacheKey = `limited-${dateString}`;

      // Check cache first
      if (availabilityCache.current.has(cacheKey)) {
        return availabilityCache.current.get(cacheKey);
      }

      const isLimited = availability.dates.limited.some(
        (limitedDate) => format(limitedDate, "yyyy-MM-dd") === dateString,
      );

      // Cache the result
      availabilityCache.current.set(cacheKey, isLimited);
      return isLimited;
    },
    [availability.dates.limited],
  );

  const checkSlotAvailability = useCallback(
    async (date: Date, time: string): Promise<boolean> => {
      try {
        const dateString = format(date, "yyyy-MM-dd");
        return await checkAvailability(dateString, time);
      } catch (err) {
        logApiError("rpc/check_availability", err as Error, {
          method: "POST",
          payload: { date: dateString, time },
        });
        return false;
      }
    },
    [],
  );

  // Refresh function for manual refetch
  const refresh = useCallback(() => {
    availabilityQuery.refetch();
  }, [availabilityQuery]);

  // Set up real-time subscription
  useEffect(() => {
    if (!enableRealTime) return;

    const channel = subscribeToAvailabilityChanges((payload) => {
      console.log("Availability changed:", payload);
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
    checkSlotAvailability,
  };
}
