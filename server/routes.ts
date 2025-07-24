import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema, insertQuoteSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Availability API routes
  app.get("/api/availability", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const slots = await storage.getAvailabilitySlots(
        startDate as string, 
        endDate as string
      );
      res.json(slots);
    } catch (error) {
      console.error("Error getting availability:", error);
      res.status(500).json({ error: "Failed to fetch availability" });
    }
  });

  app.get("/api/availability/:date", async (req, res) => {
    try {
      const { date } = req.params;
      const slots = await storage.getAvailableTimeSlots(date);
      res.json(slots);
    } catch (error) {
      console.error("Error getting available time slots:", error);
      res.status(500).json({ error: "Failed to fetch available time slots" });
    }
  });

  app.post("/api/availability/check", async (req, res) => {
    try {
      const { date, time } = req.body;
      const available = await storage.checkAvailability(date, time);
      res.json({ available });
    } catch (error) {
      console.error("Error checking availability:", error);
      res.status(500).json({ error: "Failed to check availability" });
    }
  });

  // Booking API routes
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid booking data", details: error.errors });
      } else {
        console.error("Error creating booking:", error);
        res.status(500).json({ error: "Failed to create booking" });
      }
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const booking = await storage.getBooking(id);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      console.error("Error getting booking:", error);
      res.status(500).json({ error: "Failed to fetch booking" });
    }
  });

  app.patch("/api/bookings/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, ...additionalUpdates } = req.body;
      const booking = await storage.updateBookingStatus(id, status, additionalUpdates);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.json(booking);
    } catch (error) {
      console.error("Error updating booking status:", error);
      res.status(500).json({ error: "Failed to update booking status" });
    }
  });

  app.get("/api/bookings", async (req, res) => {
    try {
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({ error: "Email parameter is required" });
      }
      const bookings = await storage.getBookingsByEmail(email as string);
      res.json(bookings);
    } catch (error) {
      console.error("Error getting bookings by email:", error);
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  // Quote API routes
  app.post("/api/quotes", async (req, res) => {
    try {
      const quoteData = insertQuoteSchema.parse(req.body);
      const quote = await storage.createQuote(quoteData);
      res.status(201).json(quote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid quote data", details: error.errors });
      } else {
        console.error("Error creating quote:", error);
        res.status(500).json({ error: "Failed to create quote" });
      }
    }
  });

  app.get("/api/quotes/booking/:bookingId", async (req, res) => {
    try {
      const { bookingId } = req.params;
      const quotes = await storage.getQuotesForBooking(bookingId);
      res.json(quotes);
    } catch (error) {
      console.error("Error getting quotes for booking:", error);
      res.status(500).json({ error: "Failed to fetch quotes" });
    }
  });

  app.patch("/api/quotes/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const quote = await storage.updateQuoteStatus(id, status);
      if (!quote) {
        return res.status(404).json({ error: "Quote not found" });
      }
      res.json(quote);
    } catch (error) {
      console.error("Error updating quote status:", error);
      res.status(500).json({ error: "Failed to update quote status" });
    }
  });

  // Add-on services API routes
  app.get("/api/add-on-services", async (req, res) => {
    try {
      const { category } = req.query;
      let services;
      if (category) {
        services = await storage.getAddOnServicesByCategory(category as string);
      } else {
        services = await storage.getAddOnServices();
      }
      res.json(services);
    } catch (error) {
      console.error("Error getting add-on services:", error);
      res.status(500).json({ error: "Failed to fetch add-on services" });
    }
  });

  app.post("/api/bookings/:bookingId/add-ons", async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { addOns } = req.body;
      const bookingAddOns = await storage.addBookingAddOns(bookingId, addOns);
      res.status(201).json(bookingAddOns);
    } catch (error) {
      console.error("Error adding booking add-ons:", error);
      res.status(500).json({ error: "Failed to add booking add-ons" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
