// API client for Wesley's Ambacht catering service

export interface AvailabilitySlot {
  id: string;
  date: string;
  timeSlot: string;
  maxBookings: number;
  currentBookings: number;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  companyName?: string;
  eventDate: string;
  eventTime: string;
  guestCount: number;
  serviceCategory: "corporate" | "private" | "wedding" | "celebration";
  serviceTier: "essential" | "premium" | "luxury";
  status: "pending" | "confirmed" | "cancelled" | "completed";
  specialRequests?: string;
  dietaryRestrictions?: string;
  estimatedTotal?: number;
  finalTotal?: number;
  createdAt: Date;
  updatedAt: Date;
  confirmedAt?: Date;
  cancelledAt?: Date;
}

export interface Quote {
  id: string;
  bookingId?: string;
  serviceDetails: any;
  pricingBreakdown: any;
  totalAmount: number;
  status: "draft" | "sent" | "accepted" | "rejected" | "expired";
  validUntil: string;
  selectedAddOns: any[];
  createdAt: Date;
  updatedAt: Date;
  sentAt?: Date;
  acceptedAt?: Date;
}

export interface AddOnService {
  id: string;
  name: string;
  description?: string;
  category: string;
  pricePerPerson?: number;
  flatRate?: number;
  isActive: boolean;
  createdAt: Date;
}

class ApiClient {
  private baseUrl = '';

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || `API error: ${response.statusText}`);
    }
    return response.json();
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || `API error: ${response.statusText}`);
    }
    return response.json();
  }

  // Availability methods
  async getAvailabilitySlots(startDate?: string, endDate?: string): Promise<AvailabilitySlot[]> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const query = params.toString() ? `?${params}` : '';
    return this.get<AvailabilitySlot[]>(`/api/availability${query}`);
  }

  async getAvailableTimeSlots(date: string): Promise<AvailabilitySlot[]> {
    return this.get<AvailabilitySlot[]>(`/api/availability/${date}`);
  }

  async checkAvailability(date: string, time: string): Promise<{ available: boolean }> {
    return this.post<{ available: boolean }>('/api/availability/check', { date, time });
  }

  // Booking methods
  async createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt' | 'confirmedAt' | 'cancelledAt'>): Promise<Booking> {
    return this.post<Booking>('/api/bookings', booking);
  }

  async getBooking(id: string): Promise<Booking> {
    return this.get<Booking>(`/api/bookings/${id}`);
  }

  async updateBookingStatus(id: string, status: Booking['status'], additionalUpdates?: Partial<Booking>): Promise<Booking> {
    return this.patch<Booking>(`/api/bookings/${id}/status`, { status, ...additionalUpdates });
  }

  async getBookingsByEmail(email: string): Promise<Booking[]> {
    return this.get<Booking[]>(`/api/bookings?email=${encodeURIComponent(email)}`);
  }

  // Quote methods
  async createQuote(quote: Omit<Quote, 'id' | 'createdAt' | 'updatedAt' | 'sentAt' | 'acceptedAt'>): Promise<Quote> {
    return this.post<Quote>('/api/quotes', quote);
  }

  async getQuotesForBooking(bookingId: string): Promise<Quote[]> {
    return this.get<Quote[]>(`/api/quotes/booking/${bookingId}`);
  }

  async updateQuoteStatus(id: string, status: Quote['status']): Promise<Quote> {
    return this.patch<Quote>(`/api/quotes/${id}/status`, { status });
  }

  // Add-on services
  async getAddOnServices(category?: string): Promise<AddOnService[]> {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return this.get<AddOnService[]>(`/api/add-on-services${query}`);
  }

  async addBookingAddOns(bookingId: string, addOns: any[]): Promise<any[]> {
    return this.post<any[]>(`/api/bookings/${bookingId}/add-ons`, { addOns });
  }

  // Utility functions for compatibility
  mapAvailabilityToDateChecker(slots: AvailabilitySlot[]) {
    const dateMap = new Map<string, AvailabilitySlot[]>();

    slots.forEach((slot) => {
      const dateKey = slot.date;
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, []);
      }
      dateMap.get(dateKey)!.push(slot);
    });

    return {
      dates: {
        booked: Array.from(dateMap.entries())
          .filter(([_, slots]) =>
            slots.every((s) => s.currentBookings >= s.maxBookings),
          )
          .map(([date]) => new Date(date)),
        limited: Array.from(dateMap.entries())
          .filter(([_, slots]) =>
            slots.some(
              (s) =>
                s.currentBookings >= s.maxBookings - 1 &&
                s.currentBookings < s.maxBookings,
            ),
          )
          .map(([date]) => new Date(date)),
      },
      timeSlots: {
        morning: slots
          .filter((s) => s.timeSlot >= "10:00" && s.timeSlot < "12:00")
          .map((s) => s.timeSlot),
        afternoon: slots
          .filter((s) => s.timeSlot >= "12:00" && s.timeSlot < "16:00")
          .map((s) => s.timeSlot),
        evening: slots
          .filter((s) => s.timeSlot >= "16:00" && s.timeSlot <= "20:00")
          .map((s) => s.timeSlot),
      },
    };
  }
}

export const apiClient = new ApiClient();