import { useState, useCallback } from 'react';
import { 
  createBooking, 
  updateBookingStatus,
  createQuote,
  getQuotesForBooking,
  addBookingAddOns,
  subscribeToBookingUpdates,
  type Booking,
  type BookingInsert,
  type BookingStatus,
  type Quote,
  type QuoteInsert,
  type ServiceCategory,
  type ServiceTier
} from '@/integrations/supabase/database';
import { format } from 'date-fns';
import { useApiLoggerMutation } from './useApiLogger';
import { logApiError } from '@/lib/apiLogger';

interface CreateBookingData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  companyName?: string;
  eventDate: Date;
  eventTime: string;
  guestCount: number;
  serviceCategory: ServiceCategory;
  serviceTier?: ServiceTier;
  specialRequests?: string;
  dietaryRestrictions?: string;
  selectedAddOns?: string[];
}

interface QuoteData {
  serviceDetails: any;
  pricingBreakdown: any;
  totalAmount: number;
  validUntil: Date;
  selectedAddOns?: string[];
}

export function useBooking() {
  const [error, setError] = useState<string | null>(null);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  // Enhanced mutation hooks with logging
  const bookingMutation = useApiLoggerMutation({
    mutationFn: createBooking,
    endpoint: 'bookings',
    method: 'POST'
  });

  const statusUpdateMutation = useApiLoggerMutation({
    mutationFn: ({ id, status }: { id: string; status: BookingStatus }) => 
      updateBookingStatus(id, status),
    endpoint: 'bookings/status',
    method: 'PATCH'
  });

  const quoteMutation = useApiLoggerMutation({
    mutationFn: createQuote,
    endpoint: 'quotes',
    method: 'POST'
  });

  const submitBooking = useCallback(async (bookingData: CreateBookingData): Promise<Booking> => {
    try {
      setError(null);

      const bookingInsert: BookingInsert = {
        customer_name: bookingData.customerName,
        customer_email: bookingData.customerEmail,
        customer_phone: bookingData.customerPhone || null,
        company_name: bookingData.companyName || null,
        event_date: format(bookingData.eventDate, 'yyyy-MM-dd'),
        event_time: bookingData.eventTime,
        guest_count: bookingData.guestCount,
        service_category: bookingData.serviceCategory,
        service_tier: bookingData.serviceTier || 'premium',
        special_requests: bookingData.specialRequests || null,
        dietary_restrictions: bookingData.dietaryRestrictions || null
      };

      const booking = await bookingMutation.mutateAsync(bookingInsert);
      if (!booking) {
        throw new Error('Failed to create booking');
      }

      // Add selected add-ons if any
      if (bookingData.selectedAddOns && bookingData.selectedAddOns.length > 0) {
        const addOnData = bookingData.selectedAddOns.map(serviceId => ({
          serviceId,
          quantity: 1
        }));
        await addBookingAddOns(booking.id, addOnData);
      }

      setCurrentBooking(booking);
      return booking;
    } catch (err) {
      logApiError('bookings/submit', err as Error, { 
        method: 'POST', 
        payload: bookingData 
      });
      const errorMessage = err instanceof Error ? err.message : 'Failed to create booking';
      setError(errorMessage);
      throw err;
    }
  }, [bookingMutation]);

  const updateStatus = useCallback(async (
    bookingId: string, 
    status: BookingStatus
  ): Promise<Booking> => {
    try {
      setError(null);

      const updatedBooking = await statusUpdateMutation.mutateAsync({ id: bookingId, status });
      if (!updatedBooking) {
        throw new Error('Failed to update booking status');
      }

      if (currentBooking?.id === bookingId) {
        setCurrentBooking(updatedBooking);
      }

      return updatedBooking;
    } catch (err) {
      logApiError('bookings/status', err as Error, { 
        method: 'PATCH', 
        payload: { bookingId, status } 
      });
      const errorMessage = err instanceof Error ? err.message : 'Failed to update booking status';
      setError(errorMessage);
      throw err;
    }
  }, [statusUpdateMutation, currentBooking]);

  const generateQuote = useCallback(async (
    bookingId: string, 
    quoteData: QuoteData
  ): Promise<Quote> => {
    try {
      setError(null);

      const quoteInsert: QuoteInsert = {
        booking_id: bookingId,
        service_details: quoteData.serviceDetails,
        pricing_breakdown: quoteData.pricingBreakdown,
        total_amount: quoteData.totalAmount,
        valid_until: format(quoteData.validUntil, 'yyyy-MM-dd'),
        selected_add_ons: quoteData.selectedAddOns || []
      };

      const quote = await quoteMutation.mutateAsync(quoteInsert);
      if (!quote) {
        throw new Error('Failed to create quote');
      }

      return quote;
    } catch (err) {
      logApiError('quotes/generate', err as Error, { 
        method: 'POST', 
        payload: { bookingId, quoteData } 
      });
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate quote';
      setError(errorMessage);
      throw err;
    }
  }, [quoteMutation]);

  const getBookingQuotes = useCallback(async (bookingId: string): Promise<Quote[]> => {
    try {
      setError(null);
      return await getQuotesForBooking(bookingId);
    } catch (err) {
      logApiError('quotes/booking', err as Error, { 
        method: 'GET', 
        payload: { bookingId } 
      });
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch quotes';
      setError(errorMessage);
      return [];
    }
  }, []);

  const subscribeToUpdates = useCallback((
    bookingId: string, 
    callback: (booking: Booking) => void
  ) => {
    return subscribeToBookingUpdates(bookingId, (payload) => {
      if (payload.eventType === 'UPDATE' && payload.new) {
        callback(payload.new as Booking);
        if (currentBooking?.id === bookingId) {
          setCurrentBooking(payload.new as Booking);
        }
      }
    });
  }, [currentBooking]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearBooking = useCallback(() => {
    setCurrentBooking(null);
  }, []);

  return {
    loading: bookingMutation.isPending || statusUpdateMutation.isPending || quoteMutation.isPending,
    error,
    currentBooking,
    submitBooking,
    updateStatus,
    generateQuote,
    getBookingQuotes,
    subscribeToUpdates,
    clearError,
    clearBooking
  };
}