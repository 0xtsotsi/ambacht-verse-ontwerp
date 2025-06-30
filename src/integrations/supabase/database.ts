import { supabase } from './client';
import type { Database } from './types';

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
  const { data, error } = await supabase.rpc('check_availability', {
    p_date: date,
    p_time: time
  });
  
  if (error) {
    console.error('Error checking availability:', error);
    return false;
  }
  
  return data ?? false;
}

export async function getAvailabilitySlots(
  startDate?: string,
  endDate?: string
): Promise<AvailabilitySlot[]> {
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

  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching availability slots:', error);
    return [];
  }
  
  return data ?? [];
}

export async function getAvailableTimeSlots(date: string): Promise<AvailabilitySlot[]> {
  const { data, error } = await supabase
    .from('availability_slots')
    .select('*')
    .eq('date', date)
    .lt('current_bookings', supabase.sql`max_bookings`)
    .eq('is_blocked', false)
    .order('time_slot', { ascending: true });
  
  if (error) {
    console.error('Error fetching available time slots:', error);
    return [];
  }
  
  return data ?? [];
}

// Booking functions
export async function createBooking(booking: BookingInsert): Promise<Booking | null> {
  // First check availability
  const isAvailable = await checkAvailability(booking.event_date, booking.event_time);
  if (!isAvailable) {
    throw new Error('Selected time slot is not available');
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert(booking)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating booking:', error);
    throw error;
  }

  // Reserve the time slot
  await supabase.rpc('reserve_time_slot', {
    p_date: booking.event_date,
    p_time: booking.event_time
  });
  
  return data;
}

export async function getBooking(id: string): Promise<Booking | null> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching booking:', error);
    return null;
  }
  
  return data;
}

export async function updateBookingStatus(
  id: string, 
  status: BookingStatus,
  additionalUpdates?: Partial<BookingUpdate>
): Promise<Booking | null> {
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

  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }

  // If cancelling, release the time slot
  if (status === 'cancelled' && data) {
    await supabase.rpc('release_time_slot', {
      p_date: data.event_date,
      p_time: data.event_time
    });
  }
  
  return data;
}

// Quote functions
export async function createQuote(quote: QuoteInsert): Promise<Quote | null> {
  const { data, error } = await supabase
    .from('quotes')
    .insert(quote)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating quote:', error);
    throw error;
  }
  
  return data;
}

export async function getQuotesForBooking(bookingId: string): Promise<Quote[]> {
  const { data, error } = await supabase
    .from('quotes')
    .select('*')
    .eq('booking_id', bookingId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching quotes:', error);
    return [];
  }
  
  return data ?? [];
}

export async function updateQuoteStatus(
  id: string, 
  status: QuoteStatus
): Promise<Quote | null> {
  const updates: Partial<Quote> = { status };

  // Add timestamp fields based on status
  if (status === 'sent') {
    updates.sent_at = new Date().toISOString();
  } else if (status === 'accepted') {
    updates.accepted_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('quotes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating quote status:', error);
    throw error;
  }
  
  return data;
}

// Add-on services
export async function getAddOnServices(): Promise<AddOnService[]> {
  const { data, error } = await supabase
    .from('add_on_services')
    .select('*')
    .eq('is_active', true)
    .order('category', { ascending: true })
    .order('name', { ascending: true });
  
  if (error) {
    console.error('Error fetching add-on services:', error);
    return [];
  }
  
  return data ?? [];
}

export async function getAddOnServicesByCategory(category: string): Promise<AddOnService[]> {
  const { data, error } = await supabase
    .from('add_on_services')
    .select('*')
    .eq('category', category)
    .eq('is_active', true)
    .order('name', { ascending: true });
  
  if (error) {
    console.error('Error fetching add-on services by category:', error);
    return [];
  }
  
  return data ?? [];
}

// Booking add-ons
export async function addBookingAddOns(
  bookingId: string, 
  addOnServices: { serviceId: string; quantity?: number }[]
): Promise<BookingAddOn[]> {
  // Get the booking to calculate prices
  const booking = await getBooking(bookingId);
  if (!booking) {
    throw new Error('Booking not found');
  }

  // Get the add-on service details
  const serviceIds = addOnServices.map(a => a.serviceId);
  const { data: services, error: servicesError } = await supabase
    .from('add_on_services')
    .select('*')
    .in('id', serviceIds);

  if (servicesError) {
    throw servicesError;
  }

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

  const { data, error } = await supabase
    .from('booking_add_ons')
    .insert(inserts)
    .select();
  
  if (error) {
    console.error('Error adding booking add-ons:', error);
    throw error;
  }
  
  return data ?? [];
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