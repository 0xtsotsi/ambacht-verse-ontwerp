/**
 * Availability API Routes
 * REST endpoints for availability management
 *
 * Endpoints:
 * - GET /api/v3/availability - Get availability slots
 * - GET /api/v3/availability/:date - Get availability for specific date
 * - POST /api/v3/availability/check - Batch availability checking
 * - POST /api/v3/availability/reserve - Reserve time slot temporarily
 */

import { Router } from "express";
import {
  getAvailabilitySlots,
  getAvailableTimeSlots,
  checkAvailability,
  mapAvailabilityToDateChecker,
  type AvailabilitySlot,
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

export const availabilityRoutes = Router();

const businessService = BusinessLogicService.getInstance();

/**
 * GET /api/v3/availability - Get availability slots
 *
 * Query parameters:
 * - start_date: Start date (ISO format)
 * - end_date: End date (ISO format)
 * - format: Response format (slots|calendar) - defaults to 'slots'
 */
availabilityRoutes.get(
  "/availability",
  validateRequest((data) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Date validation if provided
    if (data.start_date) {
      const startDate = new Date(data.start_date);
      if (isNaN(startDate.getTime())) {
        errors.push(
          "Invalid start_date format. Use ISO date format (YYYY-MM-DD)",
        );
      }
    }

    if (data.end_date) {
      const endDate = new Date(data.end_date);
      if (isNaN(endDate.getTime())) {
        errors.push(
          "Invalid end_date format. Use ISO date format (YYYY-MM-DD)",
        );
      }
    }

    // Date range validation
    if (data.start_date && data.end_date) {
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);
      if (startDate > endDate) {
        errors.push("start_date must be before end_date");
      }

      // Warn for large date ranges
      const diffDays =
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays > 90) {
        warnings.push("Large date range requested - response may be slow");
      }
    }

    // Format validation
    if (data.format && !["slots", "calendar"].includes(data.format)) {
      errors.push('Format must be either "slots" or "calendar"');
    }

    return { isValid: errors.length === 0, errors, warnings };
  }),
  asyncHandler(async (req: RequestContext, res) => {
    const { start_date, end_date, format = "slots" } = req.query;

    try {
      const availabilitySlots = await getAvailabilitySlots(
        start_date as string,
        end_date as string,
      );

      let responseData;

      if (format === "calendar") {
        // Transform for frontend date checker component
        responseData = {
          ...mapAvailabilityToDateChecker(availabilitySlots),
          totalSlots: availabilitySlots.length,
          dateRange: {
            start: start_date || null,
            end: end_date || null,
          },
        };
      } else {
        // Return raw slots with additional metadata
        responseData = {
          slots: availabilitySlots,
          totalSlots: availabilitySlots.length,
          dateRange: {
            start: start_date || null,
            end: end_date || null,
          },
          summary: {
            availableDates: [
              ...new Set(
                availabilitySlots
                  .filter(
                    (slot) =>
                      slot.current_bookings < slot.max_bookings &&
                      !slot.is_blocked,
                  )
                  .map((slot) => slot.date),
              ),
            ].length,
            totalAvailableSlots: availabilitySlots.filter(
              (slot) =>
                slot.current_bookings < slot.max_bookings && !slot.is_blocked,
            ).length,
          },
        };
      }

      SafeLogger.info("Availability retrieved", {
        requestId: req.requestId,
        startDate: start_date,
        endDate: end_date,
        format,
        slotsCount: availabilitySlots.length,
      });

      res.json(
        createSuccessResponse(responseData, req.requestId, {
          warnings: req.validationWarnings,
        }),
      );
    } catch (error) {
      throw error;
    }
  }),
);

/**
 * GET /api/v3/availability/:date - Get availability for specific date
 */
availabilityRoutes.get(
  "/availability/:date",
  validateRequest((data) => {
    const errors: string[] = [];

    if (!data.date) {
      errors.push("Date parameter is required");
    } else {
      const date = new Date(data.date);
      if (isNaN(date.getTime())) {
        errors.push("Invalid date format. Use ISO date format (YYYY-MM-DD)");
      } else if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
        errors.push("Cannot check availability for past dates");
      }
    }

    return { isValid: errors.length === 0, errors, warnings: [] };
  }),
  asyncHandler(async (req: RequestContext, res) => {
    const date = req.params.date;

    try {
      const availableSlots = await getAvailableTimeSlots(date);

      // Add business logic validation for each slot
      const enhancedSlots = availableSlots.map((slot) => {
        const businessCheck = businessService.checkAvailability(
          new Date(slot.date),
          slot.time_slot,
        );

        return {
          ...slot,
          businessStatus: businessCheck.status,
          businessReason: businessCheck.reason,
          isRecommended: businessCheck.status === "available",
        };
      });

      const responseData = {
        date,
        totalSlots: enhancedSlots.length,
        availableSlots: enhancedSlots.filter(
          (slot) => slot.current_bookings < slot.max_bookings,
        ),
        limitedSlots: enhancedSlots.filter(
          (slot) => slot.current_bookings === slot.max_bookings - 1,
        ),
        timeSlotGroups: {
          morning: enhancedSlots.filter((slot) => {
            const hour = parseInt(slot.time_slot.split(":")[0]);
            return hour >= 10 && hour < 12;
          }),
          afternoon: enhancedSlots.filter((slot) => {
            const hour = parseInt(slot.time_slot.split(":")[0]);
            return hour >= 12 && hour < 16;
          }),
          evening: enhancedSlots.filter((slot) => {
            const hour = parseInt(slot.time_slot.split(":")[0]);
            return hour >= 16 && hour <= 20;
          }),
        },
        recommendations: {
          bestTimes: enhancedSlots
            .filter((slot) => slot.businessStatus === "available")
            .slice(0, 3)
            .map((slot) => slot.time_slot),
          peakTimes: enhancedSlots
            .filter((slot) => slot.businessStatus === "limited")
            .map((slot) => slot.time_slot),
        },
      };

      res.json(createSuccessResponse(responseData, req.requestId));
    } catch (error) {
      throw error;
    }
  }),
);

/**
 * POST /api/v3/availability/check - Batch availability checking
 *
 * Request body:
 * {
 *   "requests": [
 *     { "date": "2024-03-15", "time": "18:00" },
 *     { "date": "2024-03-16", "time": "19:00" }
 *   ]
 * }
 */
availabilityRoutes.post(
  "/availability/check",
  validateRequest((data) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!data.requests || !Array.isArray(data.requests)) {
      errors.push("requests array is required");
      return { isValid: false, errors, warnings };
    }

    if (data.requests.length === 0) {
      errors.push("At least one availability request is required");
      return { isValid: false, errors, warnings };
    }

    if (data.requests.length > 50) {
      errors.push("Maximum 50 availability requests per batch");
      return { isValid: false, errors, warnings };
    }

    // Validate each request
    data.requests.forEach((request: any, index: number) => {
      if (!request.date) {
        errors.push(`Request ${index + 1}: date is required`);
      } else if (isNaN(new Date(request.date).getTime())) {
        errors.push(`Request ${index + 1}: invalid date format`);
      }

      if (!request.time) {
        errors.push(`Request ${index + 1}: time is required`);
      } else if (!/^\d{2}:\d{2}$/.test(request.time)) {
        errors.push(`Request ${index + 1}: invalid time format (use HH:MM)`);
      }
    });

    if (data.requests.length > 10) {
      warnings.push("Large batch request - response may take longer");
    }

    return { isValid: errors.length === 0, errors, warnings };
  }),
  asyncHandler(async (req: RequestContext, res) => {
    const { requests } = req.body;

    try {
      const results = await Promise.allSettled(
        requests.map(async (request: { date: string; time: string }) => {
          const isAvailable = await checkAvailability(
            request.date,
            request.time,
          );
          const businessCheck = businessService.checkAvailability(
            new Date(request.date),
            request.time,
          );

          return {
            date: request.date,
            time: request.time,
            available: isAvailable,
            businessStatus: businessCheck.status,
            reason: businessCheck.reason || null,
          };
        }),
      );

      const successfulResults = results
        .filter(
          (result): result is PromiseFulfilledResult<any> =>
            result.status === "fulfilled",
        )
        .map((result) => result.value);

      const failedResults = results
        .filter(
          (result): result is PromiseRejectedResult =>
            result.status === "rejected",
        )
        .map((result, index) => ({
          index,
          error: result.reason.message,
        }));

      const responseData = {
        results: successfulResults,
        summary: {
          total: requests.length,
          successful: successfulResults.length,
          failed: failedResults.length,
          available: successfulResults.filter(
            (r) => r.available && r.businessStatus === "available",
          ).length,
          limited: successfulResults.filter(
            (r) => r.businessStatus === "limited",
          ).length,
          unavailable: successfulResults.filter(
            (r) => !r.available || r.businessStatus === "unavailable",
          ).length,
        },
        errors: failedResults.length > 0 ? failedResults : undefined,
      };

      SafeLogger.info("Batch availability check completed", {
        requestId: req.requestId,
        totalRequests: requests.length,
        successful: successfulResults.length,
        failed: failedResults.length,
      });

      res.json(
        createSuccessResponse(responseData, req.requestId, {
          warnings: req.validationWarnings,
        }),
      );
    } catch (error) {
      throw error;
    }
  }),
);

/**
 * POST /api/v3/availability/reserve - Temporarily reserve time slot
 *
 * Request body:
 * {
 *   "date": "2024-03-15",
 *   "time": "18:00",
 *   "duration_minutes": 30
 * }
 */
availabilityRoutes.post(
  "/availability/reserve",
  validateRequest((data) => {
    const errors: string[] = [];

    if (!data.date) {
      errors.push("date is required");
    } else {
      const date = new Date(data.date);
      if (isNaN(date.getTime())) {
        errors.push("Invalid date format");
      } else if (date <= new Date()) {
        errors.push("Cannot reserve slots for past dates");
      }
    }

    if (!data.time) {
      errors.push("time is required");
    } else if (!/^\d{2}:\d{2}$/.test(data.time)) {
      errors.push("Invalid time format (use HH:MM)");
    }

    if (
      data.duration_minutes &&
      (typeof data.duration_minutes !== "number" ||
        data.duration_minutes < 5 ||
        data.duration_minutes > 60)
    ) {
      errors.push("duration_minutes must be between 5 and 60 minutes");
    }

    return { isValid: errors.length === 0, errors, warnings: [] };
  }),
  asyncHandler(async (req: RequestContext, res) => {
    const { date, time, duration_minutes = 15 } = req.body;

    try {
      // Check if slot is available
      const isAvailable = await checkAvailability(date, time);
      if (!isAvailable) {
        return res
          .status(409)
          .json(
            createErrorResponse(
              "Time slot is not available",
              "SLOT_UNAVAILABLE",
              req.requestId,
            ),
          );
      }

      // Business logic validation
      const businessCheck = businessService.checkAvailability(
        new Date(date),
        time,
      );
      if (businessCheck.status === "unavailable") {
        return res
          .status(409)
          .json(
            createErrorResponse(
              businessCheck.reason || "Time slot is not available for booking",
              "BUSINESS_RULES_VIOLATION",
              req.requestId,
            ),
          );
      }

      // Create temporary reservation (this would typically involve a separate reservations table)
      const reservationId = `tmp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const expiresAt = new Date(Date.now() + duration_minutes * 60 * 1000);

      // Note: In a full implementation, you'd store this reservation in a database
      // For now, we'll just return the reservation details

      const responseData = {
        reservationId,
        date,
        time,
        status: "reserved",
        expiresAt: expiresAt.toISOString(),
        durationMinutes: duration_minutes,
        businessStatus: businessCheck.status,
        message:
          businessCheck.status === "limited"
            ? "Slot reserved but has limited availability"
            : "Slot reserved successfully",
      };

      SafeLogger.info("Temporary reservation created", {
        reservationId,
        date,
        time,
        requestId: req.requestId,
      });

      res.status(201).json(createSuccessResponse(responseData, req.requestId));
    } catch (error) {
      throw error;
    }
  }),
);
