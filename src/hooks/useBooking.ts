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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  const submitBooking = useCallback(async (bookingData: CreateBookingData): Promise<Booking> => {
    try {
      setLoading(true);
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

      const booking = await createBooking(bookingInsert);
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
      console.error('Error submitting booking:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create booking';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = useCallback(async (
    bookingId: string, 
    status: BookingStatus
  ): Promise<Booking> => {
    try {
      setLoading(true);
      setError(null);

      const updatedBooking = await updateBookingStatus(bookingId, status);
      if (!updatedBooking) {
        throw new Error('Failed to update booking status');
      }

      if (currentBooking?.id === bookingId) {
        setCurrentBooking(updatedBooking);
      }

      return updatedBooking;
    } catch (err) {
      console.error('Error updating booking status:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update booking status';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentBooking]);

  const generateQuote = useCallback(async (
    bookingId: string, 
    quoteData: QuoteData
  ): Promise<Quote> => {
    try {
      setLoading(true);
      setError(null);

      const quoteInsert: QuoteInsert = {
        booking_id: bookingId,
        service_details: quoteData.serviceDetails,
        pricing_breakdown: quoteData.pricingBreakdown,
        total_amount: quoteData.totalAmount,
        valid_until: format(quoteData.validUntil, 'yyyy-MM-dd'),
        selected_add_ons: quoteData.selectedAddOns || []
      };

      const quote = await createQuote(quoteInsert);
      if (!quote) {
        throw new Error('Failed to create quote');
      }

      return quote;
    } catch (err) {
      console.error('Error generating quote:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate quote';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getBookingQuotes = useCallback(async (bookingId: string): Promise<Quote[]> => {
    try {
      setError(null);
      return await getQuotesForBooking(bookingId);
    } catch (err) {
      console.error('Error fetching booking quotes:', err);
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
    loading,
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