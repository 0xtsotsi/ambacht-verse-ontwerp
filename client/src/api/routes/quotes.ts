/**
 * Quotes API Routes
 * REST endpoints for quote generation and management
 *
 * Endpoints:
 * - POST /api/v3/quotes - Generate new quote
 * - GET /api/v3/quotes/booking/:bookingId - Get quotes for booking
 * - PATCH /api/v3/quotes/:id/status - Update quote status
 * - GET /api/v3/quotes/:id - Get quote details
 * - POST /api/v3/quotes/calculate - Calculate quote without saving
 */

import { Router } from "express";
import {
  createQuote,
  getQuotesForBooking,
  updateQuoteStatus,
  getBooking,
  type Quote,
  type QuoteInsert,
  type QuoteStatus,
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

export const quoteRoutes = Router();

const businessService = BusinessLogicService.getInstance();

/**
 * POST /api/v3/quotes - Generate new quote
 *
 * Request body:
 * {
 *   "booking_id": "booking-uuid",
 *   "service_category": "corporate",
 *   "service_tier": "premium",
 *   "guest_count": 50,
 *   "add_ons": ["drinks-package", "appetizer-selection"],
 *   "notes": "Special dietary requirements"
 * }
 */
quoteRoutes.post(
  "/quotes",
  validateRequest((data) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!data.booking_id) {
      errors.push("booking_id is required");
    }

    if (!data.service_category) {
      errors.push("service_category is required");
    } else {
      const validCategories = ["corporate", "social", "wedding", "custom"];
      if (!validCategories.includes(data.service_category)) {
        errors.push(
          `service_category must be one of: ${validCategories.join(", ")}`,
        );
      }
    }

    if (!data.service_tier) {
      errors.push("service_tier is required");
    } else {
      const validTiers = ["basis", "premium", "luxe"];
      if (!validTiers.includes(data.service_tier)) {
        errors.push(`service_tier must be one of: ${validTiers.join(", ")}`);
      }
    }

    if (!data.guest_count) {
      errors.push("guest_count is required");
    } else {
      const count = parseInt(data.guest_count);
      if (isNaN(count) || count < 1) {
        errors.push("guest_count must be a positive number");
      }
    }

    // Add-ons validation
    if (data.add_ons && !Array.isArray(data.add_ons)) {
      errors.push("add_ons must be an array");
    }

    if (data.add_ons && data.add_ons.length > 10) {
      warnings.push("Large number of add-ons may affect quote processing time");
    }

    return { isValid: errors.length === 0, errors, warnings };
  }),
  asyncHandler(async (req: RequestContext, res) => {
    const {
      booking_id,
      service_category,
      service_tier,
      guest_count,
      add_ons = [],
      notes,
    } = req.body;

    try {
      // Verify booking exists
      const booking = await getBooking(booking_id);
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

      // Calculate quote using business service
      const quoteCalculation = businessService.calculateQuote(
        service_category,
        service_tier,
        parseInt(guest_count),
        add_ons,
      );

      // Create quote record
      const quoteData: QuoteInsert = {
        booking_id,
        service_category,
        service_tier,
        guest_count: parseInt(guest_count),
        base_price: quoteCalculation.basePrice,
        add_ons_total: quoteCalculation.addOnTotal,
        tax_amount: quoteCalculation.tax,
        total_price: quoteCalculation.total,
        per_person_price: quoteCalculation.perPerson,
        add_ons: add_ons,
        quote_details: {
          breakdown: quoteCalculation.breakdown,
          calculation_timestamp: new Date().toISOString(),
        },
        notes: notes || null,
        status: "draft",
      };

      const quote = await createQuote(quoteData);

      if (!quote) {
        throw new Error("Failed to create quote");
      }

      SafeLogger.info("Quote created successfully", {
        quoteId: quote.id,
        bookingId: booking_id,
        totalPrice: quoteCalculation.total,
        requestId: req.requestId,
      });

      const responseData = {
        quote,
        calculation: quoteCalculation,
        estimatedDeliveryTime: businessService.calculateDeliveryTime(
          parseInt(guest_count),
          service_category === "custom" ? "complex" : "standard",
        ),
        warnings: req.validationWarnings,
      };

      res.status(201).json(createSuccessResponse(responseData, req.requestId));
    } catch (error) {
      throw error;
    }
  }),
);

/**
 * POST /api/v3/quotes/calculate - Calculate quote without saving
 *
 * Request body:
 * {
 *   "service_category": "corporate",
 *   "service_tier": "premium",
 *   "guest_count": 50,
 *   "add_ons": ["drinks-package", "appetizer-selection"]
 * }
 */
quoteRoutes.post(
  "/quotes/calculate",
  validateRequest((data) => {
    const errors: string[] = [];

    if (!data.service_category || !data.service_tier || !data.guest_count) {
      errors.push(
        "service_category, service_tier, and guest_count are required",
      );
    }

    const count = parseInt(data.guest_count);
    if (isNaN(count) || count < 1) {
      errors.push("guest_count must be a positive number");
    }

    return { isValid: errors.length === 0, errors, warnings: [] };
  }),
  asyncHandler(async (req: RequestContext, res) => {
    const {
      service_category,
      service_tier,
      guest_count,
      add_ons = [],
    } = req.body;

    try {
      const calculation = businessService.calculateQuote(
        service_category,
        service_tier,
        parseInt(guest_count),
        add_ons,
      );

      const responseData = {
        calculation,
        priceBreakdown: {
          basePrice: calculation.basePrice,
          addOnsTotal: calculation.addOnTotal,
          tax: calculation.tax,
          total: calculation.total,
          perPerson: calculation.perPerson,
        },
        estimatedDeliveryTime: businessService.calculateDeliveryTime(
          parseInt(guest_count),
          service_category === "custom" ? "complex" : "standard",
        ),
        validUntil: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000,
        ).toISOString(), // 7 days
      };

      res.json(createSuccessResponse(responseData, req.requestId));
    } catch (error) {
      throw error;
    }
  }),
);

/**
 * GET /api/v3/quotes/booking/:bookingId - Get quotes for booking
 */
quoteRoutes.get(
  "/quotes/booking/:bookingId",
  validateRequest((data) => {
    const errors: string[] = [];
    if (!data.bookingId || typeof data.bookingId !== "string") {
      errors.push("Valid booking ID is required");
    }
    return { isValid: errors.length === 0, errors, warnings: [] };
  }),
  asyncHandler(async (req: RequestContext, res) => {
    const bookingId = req.params.bookingId;

    try {
      // Verify booking exists
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

      const quotes = await getQuotesForBooking(bookingId);

      const responseData = {
        bookingId,
        quotes,
        totalQuotes: quotes.length,
        latestQuote: quotes.length > 0 ? quotes[0] : null,
        statusSummary: {
          draft: quotes.filter((q) => q.status === "draft").length,
          sent: quotes.filter((q) => q.status === "sent").length,
          accepted: quotes.filter((q) => q.status === "accepted").length,
          rejected: quotes.filter((q) => q.status === "rejected").length,
        },
      };

      res.json(createSuccessResponse(responseData, req.requestId));
    } catch (error) {
      throw error;
    }
  }),
);

/**
 * GET /api/v3/quotes/:id - Get quote details
 */
quoteRoutes.get(
  "/quotes/:id",
  validateRequest((data) => {
    const errors: string[] = [];
    if (!data.id || typeof data.id !== "string") {
      errors.push("Valid quote ID is required");
    }
    return { isValid: errors.length === 0, errors, warnings: [] };
  }),
  asyncHandler(async (req: RequestContext, res) => {
    const quoteId = req.params.id;

    try {
      // Note: We don't have a direct getQuote function, so we'll need to implement this
      // or fetch through a booking. For now, we'll return an error asking for booking ID
      return res
        .status(400)
        .json(
          createErrorResponse(
            "Please use /api/v3/quotes/booking/:bookingId to retrieve quotes",
            "DIRECT_QUOTE_ACCESS_NOT_IMPLEMENTED",
            req.requestId,
            { suggestion: "Use booking ID to retrieve quotes" },
          ),
        );
    } catch (error) {
      throw error;
    }
  }),
);

/**
 * PATCH /api/v3/quotes/:id/status - Update quote status
 *
 * Request body:
 * {
 *   "status": "sent|accepted|rejected",
 *   "notes": "Optional status change notes"
 * }
 */
quoteRoutes.patch(
  "/quotes/:id/status",
  validateRequest((data) => {
    const errors: string[] = [];

    if (!data.id || typeof data.id !== "string") {
      errors.push("Valid quote ID is required");
    }

    if (!data.status) {
      errors.push("Status is required");
    } else {
      const validStatuses = ["draft", "sent", "accepted", "rejected"];
      if (!validStatuses.includes(data.status)) {
        errors.push(`Status must be one of: ${validStatuses.join(", ")}`);
      }
    }

    return { isValid: errors.length === 0, errors, warnings: [] };
  }),
  asyncHandler(async (req: RequestContext, res) => {
    const quoteId = req.params.id;
    const { status, notes } = req.body;

    try {
      const updatedQuote = await updateQuoteStatus(
        quoteId,
        status as QuoteStatus,
      );

      if (!updatedQuote) {
        return res
          .status(404)
          .json(
            createErrorResponse(
              "Quote not found or update failed",
              "QUOTE_NOT_FOUND",
              req.requestId,
            ),
          );
      }

      SafeLogger.info("Quote status updated", {
        quoteId,
        newStatus: status,
        notes,
        requestId: req.requestId,
      });

      const responseData = {
        quote: updatedQuote,
        statusChanged: true,
        timestamp: new Date().toISOString(),
        notes,
      };

      res.json(createSuccessResponse(responseData, req.requestId));
    } catch (error) {
      throw error;
    }
  }),
);

/**
 * GET /api/v3/quotes/:id/pdf - Generate PDF quote (placeholder)
 *
 * This would generate a PDF version of the quote for download
 */
quoteRoutes.get(
  "/quotes/:id/pdf",
  validateRequest((data) => {
    const errors: string[] = [];
    if (!data.id || typeof data.id !== "string") {
      errors.push("Valid quote ID is required");
    }
    return { isValid: errors.length === 0, errors, warnings: [] };
  }),
  asyncHandler(async (req: RequestContext, res) => {
    const quoteId = req.params.id;

    // Placeholder implementation
    return res.status(501).json(
      createErrorResponse(
        "PDF generation not yet implemented",
        "FEATURE_NOT_IMPLEMENTED",
        req.requestId,
        {
          feature: "PDF quote generation",
          plannedRelease: "v3.1.0",
        },
      ),
    );
  }),
);
