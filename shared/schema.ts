import { pgTable, text, serial, integer, boolean, uuid, date, time, decimal, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const bookingStatusEnum = pgEnum("booking_status", ["pending", "confirmed", "cancelled", "completed"]);
export const serviceCategoryEnum = pgEnum("service_category", ["corporate", "private", "wedding", "celebration"]);
export const serviceTierEnum = pgEnum("service_tier", ["essential", "premium", "luxury"]);
export const quoteStatusEnum = pgEnum("quote_status", ["draft", "sent", "accepted", "rejected", "expired"]);

// Users table (keeping for compatibility)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Availability slots table
export const availabilitySlots = pgTable("availability_slots", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: date("date").notNull(),
  timeSlot: time("time_slot").notNull(),
  maxBookings: integer("max_bookings").notNull().default(1),
  currentBookings: integer("current_bookings").notNull().default(0),
  isBlocked: boolean("is_blocked").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Bookings table
export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  companyName: text("company_name"),
  eventDate: date("event_date").notNull(),
  eventTime: time("event_time").notNull(),
  guestCount: integer("guest_count").notNull(),
  serviceCategory: serviceCategoryEnum("service_category").notNull(),
  serviceTier: serviceTierEnum("service_tier").default("premium"),
  status: bookingStatusEnum("status").default("pending"),
  specialRequests: text("special_requests"),
  dietaryRestrictions: text("dietary_restrictions"),
  estimatedTotal: decimal("estimated_total", { precision: 10, scale: 2 }),
  finalTotal: decimal("final_total", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  confirmedAt: timestamp("confirmed_at"),
  cancelledAt: timestamp("cancelled_at"),
});

// Quotes table
export const quotes = pgTable("quotes", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id").references(() => bookings.id),
  serviceDetails: text("service_details", { mode: "json" }).notNull(),
  pricingBreakdown: text("pricing_breakdown", { mode: "json" }).notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: quoteStatusEnum("status").default("draft"),
  validUntil: date("valid_until").notNull(),
  selectedAddOns: text("selected_add_ons", { mode: "json" }).default("[]"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  sentAt: timestamp("sent_at"),
  acceptedAt: timestamp("accepted_at"),
});

// Add-on services table
export const addOnServices = pgTable("add_on_services", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  pricePerPerson: decimal("price_per_person", { precision: 8, scale: 2 }),
  flatRate: decimal("flat_rate", { precision: 8, scale: 2 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Booking add-ons junction table
export const bookingAddOns = pgTable("booking_add_ons", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id").references(() => bookings.id),
  addOnServiceId: uuid("add_on_service_id").references(() => addOnServices.id),
  quantity: integer("quantity").default(1),
  calculatedPrice: decimal("calculated_price", { precision: 8, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  confirmedAt: true,
  cancelledAt: true,
});

export const insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  sentAt: true,
  acceptedAt: true,
});

export const insertAvailabilitySlotSchema = createInsertSchema(availabilitySlots).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAddOnServiceSchema = createInsertSchema(addOnServices).omit({
  id: true,
  createdAt: true,
});

export const insertBookingAddOnSchema = createInsertSchema(bookingAddOns).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = z.infer<typeof insertQuoteSchema>;

export type AvailabilitySlot = typeof availabilitySlots.$inferSelect;
export type InsertAvailabilitySlot = z.infer<typeof insertAvailabilitySlotSchema>;

export type AddOnService = typeof addOnServices.$inferSelect;
export type InsertAddOnService = z.infer<typeof insertAddOnServiceSchema>;

export type BookingAddOn = typeof bookingAddOns.$inferSelect;
export type InsertBookingAddOn = z.infer<typeof insertBookingAddOnSchema>;

export type ServiceCategory = typeof serviceCategoryEnum.enumValues[number];
export type ServiceTier = typeof serviceTierEnum.enumValues[number];
export type BookingStatus = typeof bookingStatusEnum.enumValues[number];
export type QuoteStatus = typeof quoteStatusEnum.enumValues[number];
