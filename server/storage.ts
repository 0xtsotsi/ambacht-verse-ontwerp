import { eq, gte, lte, and, desc, asc, sql } from "drizzle-orm";
import { db } from "./db";
import {
  users,
  bookings,
  quotes,
  availabilitySlots,
  addOnServices,
  bookingAddOns,
  type User,
  type InsertUser,
  type Booking,
  type InsertBooking,
  type Quote,
  type InsertQuote,
  type AvailabilitySlot,
  type InsertAvailabilitySlot,
  type AddOnService,
  type BookingAddOn,
  type InsertBookingAddOn,
  type BookingStatus,
  type QuoteStatus,
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Booking methods
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(id: string): Promise<Booking | undefined>;
  updateBookingStatus(id: string, status: BookingStatus, additionalUpdates?: Partial<Booking>): Promise<Booking | undefined>;
  getBookingsByEmail(email: string): Promise<Booking[]>;

  // Availability methods
  getAvailabilitySlots(startDate?: string, endDate?: string): Promise<AvailabilitySlot[]>;
  getAvailableTimeSlots(date: string): Promise<AvailabilitySlot[]>;
  checkAvailability(date: string, time: string): Promise<boolean>;
  reserveTimeSlot(date: string, time: string): Promise<boolean>;
  releaseTimeSlot(date: string, time: string): Promise<boolean>;

  // Quote methods
  createQuote(quote: InsertQuote): Promise<Quote>;
  getQuotesForBooking(bookingId: string): Promise<Quote[]>;
  updateQuoteStatus(id: string, status: QuoteStatus): Promise<Quote | undefined>;

  // Add-on services
  getAddOnServices(): Promise<AddOnService[]>;
  getAddOnServicesByCategory(category: string): Promise<AddOnService[]>;
  addBookingAddOns(bookingId: string, addOns: InsertBookingAddOn[]): Promise<BookingAddOn[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Booking methods
  async createBooking(booking: InsertBooking): Promise<Booking> {
    // First check availability
    const isAvailable = await this.checkAvailability(booking.eventDate, booking.eventTime);
    if (!isAvailable) {
      throw new Error("Selected time slot is not available");
    }

    const result = await db.insert(bookings).values(booking).returning();
    
    // Reserve the time slot
    await this.reserveTimeSlot(booking.eventDate, booking.eventTime);
    
    return result[0];
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const result = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
    return result[0];
  }

  async updateBookingStatus(id: string, status: BookingStatus, additionalUpdates?: Partial<Booking>): Promise<Booking | undefined> {
    const updates: any = { status, ...additionalUpdates };
    
    // Add timestamp fields based on status
    if (status === "confirmed") {
      updates.confirmedAt = new Date();
    } else if (status === "cancelled") {
      updates.cancelledAt = new Date();
    }

    const result = await db.update(bookings).set(updates).where(eq(bookings.id, id)).returning();
    
    // If cancelling, release the time slot
    if (status === "cancelled" && result[0]) {
      await this.releaseTimeSlot(result[0].eventDate, result[0].eventTime);
    }

    return result[0];
  }

  async getBookingsByEmail(email: string): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.customerEmail, email)).orderBy(desc(bookings.createdAt));
  }

  // Availability methods
  async getAvailabilitySlots(startDate?: string, endDate?: string): Promise<AvailabilitySlot[]> {
    const conditions = [];
    if (startDate) conditions.push(gte(availabilitySlots.date, startDate));
    if (endDate) conditions.push(lte(availabilitySlots.date, endDate));
    
    if (conditions.length > 0) {
      return await db.select().from(availabilitySlots)
        .where(and(...conditions))
        .orderBy(asc(availabilitySlots.date), asc(availabilitySlots.timeSlot));
    } else {
      return await db.select().from(availabilitySlots)
        .orderBy(asc(availabilitySlots.date), asc(availabilitySlots.timeSlot));
    }
  }

  async getAvailableTimeSlots(date: string): Promise<AvailabilitySlot[]> {
    return await db.select()
      .from(availabilitySlots)
      .where(and(
        eq(availabilitySlots.date, date),
        sql`${availabilitySlots.currentBookings} < ${availabilitySlots.maxBookings}`,
        eq(availabilitySlots.isBlocked, false)
      ))
      .orderBy(asc(availabilitySlots.timeSlot));
  }

  async checkAvailability(date: string, time: string): Promise<boolean> {
    const result = await db.select({ 
      available: sql`${availabilitySlots.currentBookings} < ${availabilitySlots.maxBookings} AND NOT ${availabilitySlots.isBlocked}` 
    })
    .from(availabilitySlots)
    .where(and(
      eq(availabilitySlots.date, date),
      eq(availabilitySlots.timeSlot, time)
    ))
    .limit(1);
    
    return Boolean(result[0]?.available);
  }

  async reserveTimeSlot(date: string, time: string): Promise<boolean> {
    const result = await db.update(availabilitySlots)
      .set({ currentBookings: sql`${availabilitySlots.currentBookings} + 1` })
      .where(and(
        eq(availabilitySlots.date, date),
        eq(availabilitySlots.timeSlot, time),
        sql`${availabilitySlots.currentBookings} < ${availabilitySlots.maxBookings}`,
        eq(availabilitySlots.isBlocked, false)
      ))
      .returning({ id: availabilitySlots.id });
    
    return result.length > 0;
  }

  async releaseTimeSlot(date: string, time: string): Promise<boolean> {
    const result = await db.update(availabilitySlots)
      .set({ currentBookings: sql`GREATEST(0, ${availabilitySlots.currentBookings} - 1)` })
      .where(and(
        eq(availabilitySlots.date, date),
        eq(availabilitySlots.timeSlot, time)
      ))
      .returning({ id: availabilitySlots.id });
    
    return result.length > 0;
  }

  // Quote methods
  async createQuote(quote: InsertQuote): Promise<Quote> {
    const result = await db.insert(quotes).values(quote).returning();
    return result[0];
  }

  async getQuotesForBooking(bookingId: string): Promise<Quote[]> {
    return await db.select().from(quotes).where(eq(quotes.bookingId, bookingId)).orderBy(desc(quotes.createdAt));
  }

  async updateQuoteStatus(id: string, status: QuoteStatus): Promise<Quote | undefined> {
    const updates: any = { status };
    
    // Add timestamp fields based on status
    if (status === "sent") {
      updates.sentAt = new Date();
    } else if (status === "accepted") {
      updates.acceptedAt = new Date();
    }

    const result = await db.update(quotes).set(updates).where(eq(quotes.id, id)).returning();
    return result[0];
  }

  // Add-on services
  async getAddOnServices(): Promise<AddOnService[]> {
    return await db.select().from(addOnServices).where(eq(addOnServices.isActive, true)).orderBy(asc(addOnServices.category), asc(addOnServices.name));
  }

  async getAddOnServicesByCategory(category: string): Promise<AddOnService[]> {
    return await db.select().from(addOnServices).where(and(eq(addOnServices.category, category), eq(addOnServices.isActive, true))).orderBy(asc(addOnServices.name));
  }

  async addBookingAddOns(bookingId: string, addOns: InsertBookingAddOn[]): Promise<BookingAddOn[]> {
    const result = await db.insert(bookingAddOns).values(addOns).returning();
    return result;
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private bookings: Map<string, Booking>;
  private quotes: Map<string, Quote>;
  private availabilitySlots: Map<string, AvailabilitySlot>;
  private addOnServices: Map<string, AddOnService>;
  private bookingAddOns: Map<string, BookingAddOn>;
  currentUserId: number;

  constructor() {
    this.users = new Map();
    this.bookings = new Map();
    this.quotes = new Map();
    this.availabilitySlots = new Map();
    this.addOnServices = new Map();
    this.bookingAddOns = new Map();
    this.currentUserId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Booking methods - simplified in-memory implementation
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = crypto.randomUUID();
    const newBooking: Booking = {
      ...booking,
      id,
      customerPhone: booking.customerPhone || null,
      companyName: booking.companyName || null,
      serviceTier: booking.serviceTier || "premium",
      status: booking.status || "pending",
      specialRequests: booking.specialRequests || null,
      dietaryRestrictions: booking.dietaryRestrictions || null,
      estimatedTotal: booking.estimatedTotal || null,
      finalTotal: booking.finalTotal || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      confirmedAt: null,
      cancelledAt: null,
    };
    this.bookings.set(id, newBooking);
    return newBooking;
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async updateBookingStatus(id: string, status: BookingStatus, additionalUpdates?: Partial<Booking>): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;

    const updates: any = { status, ...additionalUpdates, updatedAt: new Date() };
    
    if (status === "confirmed") {
      updates.confirmedAt = new Date();
    } else if (status === "cancelled") {
      updates.cancelledAt = new Date();
    }

    const updatedBooking = { ...booking, ...updates };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  async getBookingsByEmail(email: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => booking.customerEmail === email);
  }

  // Simplified availability methods for in-memory
  async getAvailabilitySlots(): Promise<AvailabilitySlot[]> {
    return Array.from(this.availabilitySlots.values());
  }

  async getAvailableTimeSlots(date: string): Promise<AvailabilitySlot[]> {
    return Array.from(this.availabilitySlots.values()).filter(slot => 
      slot.date === date && slot.currentBookings < slot.maxBookings && !slot.isBlocked
    );
  }

  async checkAvailability(date: string, time: string): Promise<boolean> {
    const slot = Array.from(this.availabilitySlots.values()).find(s => s.date === date && s.timeSlot === time);
    return slot ? slot.currentBookings < slot.maxBookings && !slot.isBlocked : false;
  }

  async reserveTimeSlot(date: string, time: string): Promise<boolean> {
    const slot = Array.from(this.availabilitySlots.values()).find(s => s.date === date && s.timeSlot === time);
    if (slot && slot.currentBookings < slot.maxBookings && !slot.isBlocked) {
      slot.currentBookings++;
      return true;
    }
    return false;
  }

  async releaseTimeSlot(date: string, time: string): Promise<boolean> {
    const slot = Array.from(this.availabilitySlots.values()).find(s => s.date === date && s.timeSlot === time);
    if (slot && slot.currentBookings > 0) {
      slot.currentBookings--;
      return true;
    }
    return false;
  }

  // Quote methods
  async createQuote(quote: InsertQuote): Promise<Quote> {
    const id = crypto.randomUUID();
    const newQuote: Quote = {
      ...quote,
      id,
      bookingId: quote.bookingId || null,
      status: quote.status || "draft",
      selectedAddOns: quote.selectedAddOns || "[]",
      createdAt: new Date(),
      updatedAt: new Date(),
      sentAt: null,
      acceptedAt: null,
    };
    this.quotes.set(id, newQuote);
    return newQuote;
  }

  async getQuotesForBooking(bookingId: string): Promise<Quote[]> {
    return Array.from(this.quotes.values()).filter(quote => quote.bookingId === bookingId);
  }

  async updateQuoteStatus(id: string, status: QuoteStatus): Promise<Quote | undefined> {
    const quote = this.quotes.get(id);
    if (!quote) return undefined;

    const updates: any = { status, updatedAt: new Date() };
    
    if (status === "sent") {
      updates.sentAt = new Date();
    } else if (status === "accepted") {
      updates.acceptedAt = new Date();
    }

    const updatedQuote = { ...quote, ...updates };
    this.quotes.set(id, updatedQuote);
    return updatedQuote;
  }

  // Add-on services
  async getAddOnServices(): Promise<AddOnService[]> {
    return Array.from(this.addOnServices.values()).filter(service => service.isActive);
  }

  async getAddOnServicesByCategory(category: string): Promise<AddOnService[]> {
    return Array.from(this.addOnServices.values()).filter(service => service.category === category && service.isActive);
  }

  async addBookingAddOns(bookingId: string, addOns: InsertBookingAddOn[]): Promise<BookingAddOn[]> {
    const results: BookingAddOn[] = [];
    for (const addOn of addOns) {
      const id = crypto.randomUUID();
      const newBookingAddOn: BookingAddOn = {
        ...addOn,
        id,
        bookingId: addOn.bookingId || bookingId,
        addOnServiceId: addOn.addOnServiceId || "",
        quantity: addOn.quantity || 1,
        createdAt: new Date(),
      };
      this.bookingAddOns.set(id, newBookingAddOn);
      results.push(newBookingAddOn);
    }
    return results;
  }
}

// Use in-memory storage for development without database
export const storage = new MemStorage();
