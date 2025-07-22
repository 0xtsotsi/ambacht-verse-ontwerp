import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  getAvailabilitySlots,
  getAvailableTimeSlots,
  checkAvailability,
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

interface CachedAvailabilityData {
  data: AvailabilityData;
  slotsHash: string;
}

// Helper function to create a hash of availability slots for comparison
function createSlotsHash(slots: AvailabilitySlot[]): string {
  return slots
    .map(
      (s) => `${s.date}_${s.time_slot}_${s.current_bookings}_${s.max_bookings}`,
    )
    .join("|");
}

// Optimized version of mapAvailabilityToDateChecker that reuses arrays when possible
function mapAvailabilityToDateCheckerOptimized(
  slots: AvailabilitySlot[],
  previousData?: CachedAvailabilityData,
): CachedAvailabilityData {
  const slotsHash = createSlotsHash(slots);

  // If the data hasn't changed, return the previous result
  if (previousData && previousData.slotsHash === slotsHash) {
    return previousData;
  }

  // Use a Map for O(1) lookups
  const dateMap = new Map<string, AvailabilitySlot[]>();

  slots.forEach((slot) => {
    const dateKey = slot.date;
    if (!dateMap.has(dateKey)) {
      dateMap.set(dateKey, []);
    }
    dateMap.get(dateKey)!.push(slot);
  });

  // Pre-calculate booked and limited dates
  const bookedDates: Date[] = [];
  const limitedDates: Date[] = [];

  dateMap.forEach((slots, date) => {
    const allBooked = slots.every((s) => s.current_bookings >= s.max_bookings);
    const someLimited = slots.some(
      (s) =>
        s.current_bookings >= s.max_bookings - 1 &&
        s.current_bookings < s.max_bookings,
    );

    if (allBooked) {
      bookedDates.push(new Date(date));
    } else if (someLimited) {
      limitedDates.push(new Date(date));
    }
  });

  // Pre-categorize time slots
  const morningSlots: string[] = [];
  const afternoonSlots: string[] = [];
  const eveningSlots: string[] = [];

  // Use a Set to avoid duplicates
  const uniqueTimeSlots = new Set<string>();

  slots.forEach((s) => {
    if (!uniqueTimeSlots.has(s.time_slot)) {
      uniqueTimeSlots.add(s.time_slot);

      if (s.time_slot >= "10:00" && s.time_slot < "12:00") {
        morningSlots.push(s.time_slot);
      } else if (s.time_slot >= "12:00" && s.time_slot < "16:00") {
        afternoonSlots.push(s.time_slot);
      } else if (s.time_slot >= "16:00" && s.time_slot <= "20:00") {
        eveningSlots.push(s.time_slot);
      }
    }
  });

  return {
    data: {
      dates: {
        booked: bookedDates,
        limited: limitedDates,
      },
      timeSlots: {
        morning: morningSlots,
        afternoon: afternoonSlots,
        evening: eveningSlots,
      },
    },
    slotsHash,
  };
}

export function useAvailability(options: UseAvailabilityOptions = {}) {
  const { daysAhead = 180, enableRealTime = true } = options;

  // Enhanced cache structure with better organization
  const cacheRef = useRef({
    // Cache for date availability checks
    dateAvailability: new Map<string, boolean>(),
    // Cache for date booked status
    dateBooked: new Map<string, boolean>(),
    // Cache for date limited status
    dateLimited: new Map<string, boolean>(),
    // Cache for time slots by date
    timeSlots: new Map<string, AvailabilitySlot[]>(),
    // Cache for formatted dates to avoid repeated formatting
    formattedDates: new Map<Date, string>(),
    // Cache for the processed availability data
    processedData: null as CachedAvailabilityData | null,
    // Map of date strings to availability slots for quick lookup
    slotsByDate: new Map<string, AvailabilitySlot[]>(),
  });

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

  // Helper function to format dates with caching
  const formatDateCached = useCallback((date: Date): string => {
    const cache = cacheRef.current.formattedDates;
    if (cache.has(date)) {
      return cache.get(date)!;
    }
    const formatted = format(date, "yyyy-MM-dd");
    cache.set(date, formatted);
    return formatted;
  }, []);

  // Process availability data when query succeeds
  useEffect(() => {
    if (availabilityQuery.data) {
      // Process data with optimization
      const processedData = mapAvailabilityToDateCheckerOptimized(
        availabilityQuery.data,
        cacheRef.current.processedData,
      );

      cacheRef.current.processedData = processedData;
      setAvailability(processedData.data);
      setError(null);

      // Build slots by date map for quick lookups
      const slotsByDate = new Map<string, AvailabilitySlot[]>();
      availabilityQuery.data.forEach((slot) => {
        if (!slotsByDate.has(slot.date)) {
          slotsByDate.set(slot.date, []);
        }
        slotsByDate.get(slot.date)!.push(slot);
      });
      cacheRef.current.slotsByDate = slotsByDate;

      // Only clear caches that are invalidated by the new data
      // Keep formatted dates cache as it's always valid
      cacheRef.current.dateAvailability.clear();
      cacheRef.current.dateBooked.clear();
      cacheRef.current.dateLimited.clear();
      // Only clear time slots cache for dates that have changed
      const oldDates = new Set(cacheRef.current.timeSlots.keys());
      const newDates = new Set(slotsByDate.keys());
      oldDates.forEach((date) => {
        if (!newDates.has(date)) {
          cacheRef.current.timeSlots.delete(date);
        }
      });
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
      const dateString = formatDateCached(date);
      const cache = cacheRef.current.timeSlots;

      // Check cache first
      if (cache.has(dateString)) {
        return cache.get(dateString)!;
      }

      try {
        const slots = await getAvailableTimeSlots(dateString);
        // Cache the result
        cache.set(dateString, slots);
        return slots;
      } catch (err) {
        logApiError("availability_slots/available", err as Error, {
          method: "GET",
          payload: { date: dateString },
        });
        return [];
      }
    },
    [formatDateCached],
  );

  const isDateAvailable = useCallback(
    (date: Date): boolean => {
      const dateString = formatDateCached(date);
      const cache = cacheRef.current.dateAvailability;

      // Check cache first
      if (cache.has(dateString)) {
        return cache.get(dateString)!;
      }

      // Use the pre-built slots map for O(1) lookup
      const slots = cacheRef.current.slotsByDate.get(dateString);
      const isAvailable =
        slots?.some(
          (slot) =>
            slot.current_bookings < slot.max_bookings && !slot.is_blocked,
        ) || false;

      // Cache the result
      cache.set(dateString, isAvailable);
      return isAvailable;
    },
    [formatDateCached],
  );

  const isDateBooked = useCallback(
    (date: Date): boolean => {
      const dateString = formatDateCached(date);
      const cache = cacheRef.current.dateBooked;

      // Check cache first
      if (cache.has(dateString)) {
        return cache.get(dateString)!;
      }

      // Use pre-processed data for O(1) lookup instead of array iteration
      const processedData = cacheRef.current.processedData;
      if (!processedData) return false;

      // Create a Set for O(1) lookups if not already cached
      if (!cacheRef.current.bookedDatesSet) {
        cacheRef.current.bookedDatesSet = new Set(
          processedData.data.dates.booked.map((d) => format(d, "yyyy-MM-dd")),
        );
      }

      const isBooked = cacheRef.current.bookedDatesSet.has(dateString);

      // Cache the result
      cache.set(dateString, isBooked);
      return isBooked;
    },
    [formatDateCached],
  );

  const isDateLimited = useCallback(
    (date: Date): boolean => {
      const dateString = formatDateCached(date);
      const cache = cacheRef.current.dateLimited;

      // Check cache first
      if (cache.has(dateString)) {
        return cache.get(dateString)!;
      }

      // Use pre-processed data for O(1) lookup instead of array iteration
      const processedData = cacheRef.current.processedData;
      if (!processedData) return false;

      // Create a Set for O(1) lookups if not already cached
      if (!cacheRef.current.limitedDatesSet) {
        cacheRef.current.limitedDatesSet = new Set(
          processedData.data.dates.limited.map((d) => format(d, "yyyy-MM-dd")),
        );
      }

      const isLimited = cacheRef.current.limitedDatesSet.has(dateString);

      // Cache the result
      cache.set(dateString, isLimited);
      return isLimited;
    },
    [formatDateCached],
  );

  const checkSlotAvailability = useCallback(
    async (date: Date, time: string): Promise<boolean> => {
      try {
        const dateString = formatDateCached(date);
        return await checkAvailability(dateString, time);
      } catch (err) {
        logApiError("rpc/check_availability", err as Error, {
          method: "POST",
          payload: { date: formatDateCached(date), time },
        });
        return false;
      }
    },
    [formatDateCached],
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
