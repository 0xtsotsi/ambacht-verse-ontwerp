/**
 * Bookings API Routes
 * REST endpoints for booking management
 *
 * Endpoints:
 * - POST /api/v3/bookings - Create new booking
 * - GET /api/v3/bookings/:id - Get booking details
 * - PATCH /api/v3/bookings/:id - Update booking
 * - DELETE /api/v3/bookings/:id - Cancel booking
 * - GET /api/v3/bookings/:id/status - Get booking status
 */

import { Router } from "express";
import {
  createBooking,
  getBooking,
  updateBookingStatus,
  type Booking,
  type BookingInsert,
  type BookingStatus,
} from "@/integrations/supabase/database";
import { BusinessLogicService } from "@/services/BusinessLogicService";
import {
  asyncHandler,
  createSuccessResponse,
  createErrorResponse,
  validateRequest,
  type RequestContext,
} from "./index";
import { SafeLogger } from "@/lib/LoggerUtils";

export const bookingRoutes = Router();

const businessService = BusinessLogicService.getInstance();

/**
 * POST /api/v3/bookings - Create new booking
 *
 * Request body:
 * {
 *   "customer_name": "John Doe",
 *   "customer_email": "john@example.com",
 *   "customer_phone": "+31612345678",
 *   "service_category": "corporate",
 *   "service_tier": "premium",
 *   "event_date": "2024-03-15",
 *   "event_time": "18:00",
 *   "guest_count": 50,
 *   "special_requests": "Vegetarian options needed"
 * }
 */
bookingRoutes.post(
  "/bookings",
  validateRequest((data) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required field validation
    const requiredFields = [
      "customer_name",
      "customer_email",
      "customer_phone",
      "service_category",
      "service_tier",
      "event_date",
      "event_time",
      "guest_count",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        errors.push(`${field} is required`);
      }
    }

    // Email validation
    if (
      data.customer_email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.customer_email)
    ) {
      errors.push("Invalid email format");
    }

    // Date validation
    if (data.event_date) {
      const eventDate = new Date(data.event_date);
      if (isNaN(eventDate.getTime())) {
        errors.push("Invalid event date format");
      } else if (eventDate <= new Date()) {
        errors.push("Event date must be in the future");
      }
    }

    // Time validation
    if (data.event_time && !/^\d{2}:\d{2}$/.test(data.event_time)) {
      errors.push("Invalid time format. Use HH:MM");
    }

    // Guest count validation
    if (data.guest_count) {
      const count = parseInt(data.guest_count);
      if (isNaN(count) || count < 1) {
        errors.push("Guest count must be a positive number");
      }
    }

    return { isValid: errors.length === 0, errors, warnings };
  }),
  asyncHandler(async (req: RequestContext, res) => {
    const bookingData: BookingInsert = {
      customer_name: req.body.customer_name,
      customer_email: req.body.customer_email,
      customer_phone: req.body.customer_phone,
      service_category: req.body.service_category,
      service_tier: req.body.service_tier,
      event_date: req.body.event_date,
      event_time: req.body.event_time,
      guest_count: parseInt(req.body.guest_count),
      special_requests: req.body.special_requests || null,
      status: "pending",
    };

    // Business rules validation
    const businessValidation = businessService.validateBookingRules(
      bookingData.service_category,
      bookingData.service_tier,
      bookingData.guest_count,
      new Date(bookingData.event_date),
      bookingData.event_time,
    );

    if (!businessValidation.isValid) {
      return res.status(400).json(
        createErrorResponse(
          businessValidation.errors.join(", "),
          "BUSINESS_RULES_VIOLATION",
          req.requestId,
          {
            errors: businessValidation.errors,
            warnings: businessValidation.warnings,
          },
        ),
      );
    }

    try {
      const booking = await createBooking(bookingData);

      if (!booking) {
        throw new Error("Failed to create booking");
      }

      SafeLogger.info("Booking created successfully", {
        bookingId: booking.id,
        requestId: req.requestId,
        customerEmail: booking.customer_email,
      });

      const responseData = {
        booking,
        warnings:
          businessValidation.warnings.length > 0
            ? businessValidation.warnings
            : undefined,
        estimatedDeliveryTime: businessService.calculateDeliveryTime(
          booking.guest_count,
          "standard",
        ),
      };

      res.status(201).json(createSuccessResponse(responseData, req.requestId));
    } catch (error) {
      const errorResponse = req.errorService.handleError(error as Error, {
        componentName: "BookingAPI",
        action: "create_booking",
        additionalData: { bookingData },
      });

      throw error; // Re-throw to be caught by global error handler
    }
  }),
);

/**
 * GET /api/v3/bookings/:id - Get booking details
 */
bookingRoutes.get(
  "/bookings/:id",
  validateRequest((data) => {
    const errors: string[] = [];
    if (!data.id || typeof data.id !== "string") {
      errors.push("Valid booking ID is required");
    }
    return { isValid: errors.length === 0, errors, warnings: [] };
  }),
  asyncHandler(async (req: RequestContext, res) => {
    const bookingId = req.params.id;

    try {
      const booking = await getBooking(bookingId);

      if (!booking) {
        return res
          .status(404)
          .json(
            createErrorResponse(
              "Booking not found",
              "BOOKING_NOT_FOUND",
              req.requestId,
            ),
          );
      }

      const responseData = {
        booking,
        availabilityStatus: businessService.checkAvailability(
          new Date(booking.event_date),
          booking.event_time,
        ),
      };

      res.json(createSuccessResponse(responseData, req.requestId));
    } catch (error) {
      throw error; // Will be caught by global error handler
    }
  }),
);

/**
 * PATCH /api/v3/bookings/:id - Update booking status
 *
 * Request body:
 * {
 *   "status": "confirmed|cancelled|pending",
 *   "cancellation_reason": "Optional cancellation reason"
 * }
 */
bookingRoutes.patch(
  "/bookings/:id",
  validateRequest((data) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!data.id || typeof data.id !== "string") {
      errors.push("Valid booking ID is required");
    }

    if (!data.status) {
      errors.push("Status is required");
    } else {
      const validStatuses = ["pending", "confirmed", "cancelled"];
      if (!validStatuses.includes(data.status)) {
        errors.push(`Status must be one of: ${validStatuses.join(", ")}`);
      }
    }

    if (data.status === "cancelled" && !data.cancellation_reason) {
      warnings.push(
        "Cancellation reason is recommended for cancelled bookings",
      );
    }

    return { isValid: errors.length === 0, errors, warnings };
  }),
  asyncHandler(async (req: RequestContext, res) => {
    const bookingId = req.params.id;
    const { status, cancellation_reason, ...additionalUpdates } = req.body;

    try {
      // First check if booking exists
      const existingBooking = await getBooking(bookingId);
      if (!existingBooking) {
        return res
          .status(404)
          .json(
            createErrorResponse(
              "Booking not found",
              "BOOKING_NOT_FOUND",
              req.requestId,
            ),
          );
      }

      // Add cancellation reason if provided
      const updates = cancellation_reason
        ? { ...additionalUpdates, cancellation_reason }
        : additionalUpdates;

      const updatedBooking = await updateBookingStatus(
        bookingId,
        status as BookingStatus,
        updates,
      );

      if (!updatedBooking) {
        throw new Error("Failed to update booking");
      }

      SafeLogger.info("Booking updated successfully", {
        bookingId: updatedBooking.id,
        newStatus: status,
        requestId: req.requestId,
      });

      const responseData = {
        booking: updatedBooking,
        statusChanged: existingBooking.status !== status,
        previousStatus: existingBooking.status,
      };

      res.json(createSuccessResponse(responseData, req.requestId));
    } catch (error) {
      throw error;
    }
  }),
);

/**
 * DELETE /api/v3/bookings/:id - Cancel booking
 */
bookingRoutes.delete(
  "/bookings/:id",
  validateRequest((data) => {
    const errors: string[] = [];
    if (!data.id || typeof data.id !== "string") {
      errors.push("Valid booking ID is required");
    }
    return { isValid: errors.length === 0, errors, warnings: [] };
  }),
  asyncHandler(async (req: RequestContext, res) => {
    const bookingId = req.params.id;
    const cancellationReason = req.body.reason || "Customer cancellation";

    try {
      const existingBooking = await getBooking(bookingId);
      if (!existingBooking) {
        return res
          .status(404)
          .json(
            createErrorResponse(
              "Booking not found",
              "BOOKING_NOT_FOUND",
              req.requestId,
            ),
          );
      }

      if (existingBooking.status === "cancelled") {
        return res
          .status(409)
          .json(
            createErrorResponse(
              "Booking is already cancelled",
              "BOOKING_ALREADY_CANCELLED",
              req.requestId,
            ),
          );
      }

      const cancelledBooking = await updateBookingStatus(
        bookingId,
        "cancelled",
        { cancellation_reason: cancellationReason },
      );

      SafeLogger.info("Booking cancelled successfully", {
        bookingId,
        reason: cancellationReason,
        requestId: req.requestId,
      });

      const responseData = {
        booking: cancelledBooking,
        message: "Booking cancelled successfully",
        timeSlotReleased: true,
      };

      res.json(createSuccessResponse(responseData, req.requestId));
    } catch (error) {
      throw error;
    }
  }),
);

/**
 * GET /api/v3/bookings/:id/status - Get booking status
 */
bookingRoutes.get(
  "/bookings/:id/status",
  validateRequest((data) => {
    const errors: string[] = [];
    if (!data.id || typeof data.id !== "string") {
      errors.push("Valid booking ID is required");
    }
    return { isValid: errors.length === 0, errors, warnings: [] };
  }),
  asyncHandler(async (req: RequestContext, res) => {
    const bookingId = req.params.id;

    try {
      const booking = await getBooking(bookingId);

      if (!booking) {
        return res
          .status(404)
          .json(
            createErrorResponse(
              "Booking not found",
              "BOOKING_NOT_FOUND",
              req.requestId,
            ),
          );
      }

      const statusInfo = {
        id: booking.id,
        status: booking.status,
        created_at: booking.created_at,
        confirmed_at: booking.confirmed_at,
        cancelled_at: booking.cancelled_at,
        cancellation_reason: booking.cancellation_reason,
        event_date: booking.event_date,
        event_time: booking.event_time,
      };

      res.json(createSuccessResponse(statusInfo, req.requestId));
    } catch (error) {
      throw error;
    }
  }),
);
