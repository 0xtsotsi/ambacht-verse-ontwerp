import { supabase } from './client';
import type { Database } from './types';
import { withSupabaseLogging, withSupabaseRpcLogging, logApiError } from '@/lib/apiLogger';

// Type aliases for easier use
export type Booking = Database['public']['Tables']['bookings']['Row'];
export type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
export type BookingUpdate = Database['public']['Tables']['bookings']['Update'];

export type AvailabilitySlot = Database['public']['Tables']['availability_slots']['Row'];
export type Quote = Database['public']['Tables']['quotes']['Row'];
export type QuoteInsert = Database['public']['Tables']['quotes']['Insert'];

export type AddOnService = Database['public']['Tables']['add_on_services']['Row'];
export type BookingAddOn = Database['public']['Tables']['booking_add_ons']['Row'];

export type ServiceCategory = Database['public']['Enums']['service_category'];
export type ServiceTier = Database['public']['Enums']['service_tier'];
export type BookingStatus = Database['public']['Enums']['booking_status'];
export type QuoteStatus = Database['public']['Enums']['quote_status'];

// Availability functions
export async function checkAvailability(date: string, time: string): Promise<boolean> {
  try {
    return await withSupabaseRpcLogging(
      () => supabase.rpc('check_availability', { p_date: date, p_time: time }),
      'check_availability',
      { p_date: date, p_time: time }
    ) ?? false;
  } catch (error) {
    logApiError('rpc/check_availability', error as Error, { 
      method: 'POST', 
      payload: { p_date: date, p_time: time } 
    });
    return false;
  }
}

export async function getAvailabilitySlots(
  startDate?: string,
  endDate?: string
): Promise<AvailabilitySlot[]> {
  try {
    let query = supabase
      .from('availability_slots')
      .select('*')
      .order('date', { ascending: true })
      .order('time_slot', { ascending: true });

    if (startDate) {
      query = query.gte('date', startDate);
    }
    
    if (endDate) {
      query = query.lte('date', endDate);
    }

    return await withSupabaseLogging(
      query,
      'availability_slots',
      'GET'
    ) ?? [];
  } catch (error) {
    logApiError('availability_slots', error as Error, { 
      method: 'GET', 
      payload: { startDate, endDate } 
    });
    return [];
  }
}

export async function getAvailableTimeSlots(date: string): Promise<AvailabilitySlot[]> {
  try {
    const query = supabase
      .from('availability_slots')
      .select('*')
      .eq('date', date)
      .lt('current_bookings', supabase.sql`max_bookings`)
      .eq('is_blocked', false)
      .order('time_slot', { ascending: true });

    return await withSupabaseLogging(
      query,
      'availability_slots/available',
      'GET'
    ) ?? [];
  } catch (error) {
    logApiError('availability_slots/available', error as Error, { 
      method: 'GET', 
      payload: { date } 
    });
    return [];
  }
}

// Booking functions
export async function createBooking(booking: BookingInsert): Promise<Booking | null> {
  try {
    // First check availability
    const isAvailable = await checkAvailability(booking.event_date, booking.event_time);
    if (!isAvailable) {
      throw new Error('Selected time slot is not available');
    }

    const query = supabase
      .from('bookings')
      .insert(booking)
      .select()
      .single();

    const data = await withSupabaseLogging(
      query,
      'bookings',
      'POST'
    );

    // Reserve the time slot
    await withSupabaseRpcLogging(
      () => supabase.rpc('reserve_time_slot', {
        p_date: booking.event_date,
        p_time: booking.event_time
      }),
      'reserve_time_slot',
      { p_date: booking.event_date, p_time: booking.event_time }
    );
    
    return data;
  } catch (error) {
    logApiError('bookings', error as Error, { 
      method: 'POST', 
      payload: booking 
    });
    throw error;
  }
}

export async function getBooking(id: string): Promise<Booking | null> {
  try {
    const query = supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    return await withSupabaseLogging(
      query,
      'bookings/get',
      'GET'
    );
  } catch (error) {
    logApiError('bookings/get', error as Error, { 
      method: 'GET', 
      payload: { id } 
    });
    return null;
  }
}

export async function updateBookingStatus(
  id: string, 
  status: BookingStatus,
  additionalUpdates?: Partial<BookingUpdate>
): Promise<Booking | null> {
  try {
    const updates: BookingUpdate = {
      status,
      ...additionalUpdates
    };

    // Add timestamp fields based on status
    if (status === 'confirmed') {
      updates.confirmed_at = new Date().toISOString();
    } else if (status === 'cancelled') {
      updates.cancelled_at = new Date().toISOString();
    }

    const query = supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    const data = await withSupabaseLogging(
      query,
      'bookings/update',
      'PATCH'
    );

    // If cancelling, release the time slot
    if (status === 'cancelled' && data) {
      await withSupabaseRpcLogging(
        () => supabase.rpc('release_time_slot', {
          p_date: data.event_date,
          p_time: data.event_time
        }),
        'release_time_slot',
        { p_date: data.event_date, p_time: data.event_time }
      );
    }
    
    return data;
  } catch (error) {
    logApiError('bookings/update', error as Error, { 
      method: 'PATCH', 
      payload: { id, status, additionalUpdates } 
    });
    throw error;
  }
}

// Quote functions
export async function createQuote(quote: QuoteInsert): Promise<Quote | null> {
  try {
    const query = supabase
      .from('quotes')
      .insert(quote)
      .select()
      .single();

    return await withSupabaseLogging(
      query,
      'quotes',
      'POST'
    );
  } catch (error) {
    logApiError('quotes', error as Error, { 
      method: 'POST', 
      payload: quote 
    });
    throw error;
  }
}

export async function getQuotesForBooking(bookingId: string): Promise<Quote[]> {
  try {
    const query = supabase
      .from('quotes')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: false });

    return await withSupabaseLogging(
      query,
      'quotes/booking',
      'GET'
    ) ?? [];
  } catch (error) {
    logApiError('quotes/booking', error as Error, { 
      method: 'GET', 
      payload: { bookingId } 
    });
    return [];
  }
}

export async function updateQuoteStatus(
  id: string, 
  status: QuoteStatus
): Promise<Quote | null> {
  try {
    const updates: Partial<Quote> = { status };

    // Add timestamp fields based on status
    if (status === 'sent') {
      updates.sent_at = new Date().toISOString();
    } else if (status === 'accepted') {
      updates.accepted_at = new Date().toISOString();
    }

    const query = supabase
      .from('quotes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return await withSupabaseLogging(
      query,
      'quotes/update',
      'PATCH'
    );
  } catch (error) {
    logApiError('quotes/update', error as Error, { 
      method: 'PATCH', 
      payload: { id, status } 
    });
    throw error;
  }
}

// Add-on services
export async function getAddOnServices(): Promise<AddOnService[]> {
  try {
    const query = supabase
      .from('add_on_services')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    return await withSupabaseLogging(
      query,
      'add_on_services',
      'GET'
    ) ?? [];
  } catch (error) {
    logApiError('add_on_services', error as Error, { method: 'GET' });
    return [];
  }
}

export async function getAddOnServicesByCategory(category: string): Promise<AddOnService[]> {
  try {
    const query = supabase
      .from('add_on_services')
      .select('*')
      .eq('category', category)
      .eq('is_active', true)
      .order('name', { ascending: true });

    return await withSupabaseLogging(
      query,
      'add_on_services/category',
      'GET'
    ) ?? [];
  } catch (error) {
    logApiError('add_on_services/category', error as Error, { 
      method: 'GET', 
      payload: { category } 
    });
    return [];
  }
}

// Booking add-ons
export async function addBookingAddOns(
  bookingId: string, 
  addOnServices: { serviceId: string; quantity?: number }[]
): Promise<BookingAddOn[]> {
  try {
    // Get the booking to calculate prices
    const booking = await getBooking(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Get the add-on service details
    const serviceIds = addOnServices.map(a => a.serviceId);
    const servicesQuery = supabase
      .from('add_on_services')
      .select('*')
      .in('id', serviceIds);

    const services = await withSupabaseLogging(
      servicesQuery,
      'add_on_services/batch',
      'GET'
    );

    // Calculate prices and prepare inserts
    const inserts = addOnServices.map(({ serviceId, quantity = 1 }) => {
      const service = services?.find(s => s.id === serviceId);
      if (!service) {
        throw new Error(`Add-on service ${serviceId} not found`);
      }

      const calculatedPrice = service.price_per_person 
        ? service.price_per_person * booking.guest_count * quantity
        : (service.flat_rate || 0) * quantity;

      return {
        booking_id: bookingId,
        add_on_service_id: serviceId,
        quantity,
        calculated_price: calculatedPrice
      };
    });

    const insertQuery = supabase
      .from('booking_add_ons')
      .insert(inserts)
      .select();

    return await withSupabaseLogging(
      insertQuery,
      'booking_add_ons',
      'POST'
    ) ?? [];
  } catch (error) {
    logApiError('booking_add_ons', error as Error, { 
      method: 'POST', 
      payload: { bookingId, addOnServices } 
    });
    throw error;
  }
}

// Real-time subscriptions
export function subscribeToAvailabilityChanges(
  callback: (payload: any) => void
) {
  return supabase
    .channel('availability_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'availability_slots'
      },
      callback
    )
    .subscribe();
}

export function subscribeToBookingUpdates(
  bookingId: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel(`booking_${bookingId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bookings',
        filter: `id=eq.${bookingId}`
      },
      callback
    )
    .subscribe();
}

// Utility functions for integration with existing components
export function mapAvailabilityToDateChecker(slots: AvailabilitySlot[]) {
  const dateMap = new Map<string, AvailabilitySlot[]>();
  
  slots.forEach(slot => {
    const dateKey = slot.date;
    if (!dateMap.has(dateKey)) {
      dateMap.set(dateKey, []);
    }
    dateMap.get(dateKey)!.push(slot);
  });

  return {
    dates: {
      booked: Array.from(dateMap.entries())
        .filter(([_, slots]) => slots.every(s => s.current_bookings >= s.max_bookings))
        .map(([date]) => new Date(date)),
      limited: Array.from(dateMap.entries())
        .filter(([_, slots]) => slots.some(s => s.current_bookings >= s.max_bookings - 1 && s.current_bookings < s.max_bookings))
        .map(([date]) => new Date(date))
    },
    timeSlots: {
      morning: slots.filter(s => s.time_slot >= '10:00' && s.time_slot < '12:00').map(s => s.time_slot),
      afternoon: slots.filter(s => s.time_slot >= '12:00' && s.time_slot < '16:00').map(s => s.time_slot),
      evening: slots.filter(s => s.time_slot >= '16:00' && s.time_slot <= '20:00').map(s => s.time_slot)
    }
  };
}