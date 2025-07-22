import { SafeLogger } from "@/lib/LoggerUtils";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ValidationRule<T> {
  name: string;
  validate: (value: T) => boolean;
  message: string;
  severity: "error" | "warning";
}

// Type definitions for validation
type BookingData = {
  date: Date;
  time: string;
  guestCount: number;
};

type FormDataValue = string | number | boolean | Date | null | undefined;
type FormData = Record<string, FormDataValue>;

export interface FormValidationResult {
  isValid: boolean;
  sanitizedData: FormData;
  errors: string[];
  warnings: string[];
}

/**
 * Centralized validation service
 * Provides consistent validation logic across the application
 */
export class ValidationService {
  private static instance: ValidationService;

  private constructor() {}

  static getInstance(): ValidationService {
    if (!ValidationService.instance) {
      ValidationService.instance = new ValidationService();
    }
    return ValidationService.instance;
  }

  /**
   * Validate a value against multiple rules
   */
  validateValue<T>(value: T, rules: ValidationRule<T>[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      for (const rule of rules) {
        const isValid = rule.validate(value);
        if (!isValid) {
          if (rule.severity === "error") {
            errors.push(rule.message);
          } else {
            warnings.push(rule.message);
          }
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    } catch (error) {
      SafeLogger.error("Validation error:", error, {
        value,
        rules: rules.map((r) => r.name),
      });
      return {
        isValid: false,
        errors: ["Validation system error"],
        warnings: [],
      };
    }
  }

  /**
   * Validate booking data
   */
  validateBookingData(data: BookingData): ValidationResult {
    const rules: ValidationRule<BookingData>[] = [
      {
        name: "date_required",
        validate: (d) => d.date instanceof Date && !isNaN(d.date.getTime()),
        message: "Een geldige datum is vereist",
        severity: "error",
      },
      {
        name: "date_future",
        validate: (d) => d.date > new Date(),
        message: "De datum moet in de toekomst zijn",
        severity: "error",
      },
      {
        name: "time_required",
        validate: (d) => typeof d.time === "string" && d.time.length > 0,
        message: "Een tijd is vereist",
        severity: "error",
      },
      {
        name: "time_format",
        validate: (d) => /^\\d{2}:\\d{2}$/.test(d.time),
        message: "Tijd moet in HH:MM formaat zijn",
        severity: "error",
      },
      {
        name: "guest_count_required",
        validate: (d) => typeof d.guestCount === "number" && d.guestCount > 0,
        message: "Aantal gasten is vereist",
        severity: "error",
      },
      {
        name: "guest_count_minimum",
        validate: (d) => d.guestCount >= 10,
        message: "Minimum 10 gasten vereist",
        severity: "error",
      },
      {
        name: "guest_count_maximum",
        validate: (d) => d.guestCount <= 200,
        message: "Maximum 200 gasten toegestaan",
        severity: "error",
      },
    ];

    return this.validateValue(data, rules);
  }

  /**
   * Validate email address
   */
  validateEmail(email: string): ValidationResult {
    const rules: ValidationRule<string>[] = [
      {
        name: "email_required",
        validate: (value) =>
          typeof value === "string" && value.trim().length > 0,
        message: "E-mailadres is vereist",
        severity: "error",
      },
      {
        name: "email_format",
        validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: "Voer een geldig e-mailadres in",
        severity: "error",
      },
      {
        name: "email_length",
        validate: (value) => value.length <= 254,
        message: "E-mailadres is te lang",
        severity: "error",
      },
    ];

    return this.validateValue(email, rules);
  }

  /**
   * Validate phone number
   */
  validatePhoneNumber(phone: string): ValidationResult {
    const rules: ValidationRule<string>[] = [
      {
        name: "phone_required",
        validate: (value) =>
          typeof value === "string" && value.trim().length > 0,
        message: "Telefoonnummer is vereist",
        severity: "error",
      },
      {
        name: "phone_format",
        validate: (value) =>
          /[+]?[0-9\s\-()]{10,}$/.test(value.replace(/\s/g, "")),
        message: "Voer een geldig telefoonnummer in",
        severity: "error",
      },
    ];

    return this.validateValue(phone, rules);
  }

  /**
   * Validate guest count
   */
  validateGuestCount(
    count: number,
    serviceType: string = "corporate",
  ): ValidationResult {
    const minGuests = serviceType === "social" ? 5 : 10;
    const maxGuests = serviceType === "custom" ? 500 : 200;

    const rules: ValidationRule<number>[] = [
      {
        name: "guest_count_required",
        validate: (value) => typeof value === "number" && !isNaN(value),
        message: "Aantal gasten is vereist",
        severity: "error",
      },
      {
        name: "guest_count_minimum",
        validate: (value) => value >= minGuests,
        message: `Minimum ${minGuests} gasten vereist voor ${serviceType}`,
        severity: "error",
      },
      {
        name: "guest_count_maximum",
        validate: (value) => value <= maxGuests,
        message: `Maximum ${maxGuests} gasten toegestaan voor ${serviceType}`,
        severity: "error",
      },
    ];

    return this.validateValue(count, rules);
  }

  /**
   * Sanitize string input
   */
  sanitizeString(input: string): string {
    if (typeof input !== "string") return "";

    return input
      .trim()
      .replace(/[<>]/g, "") // Remove potential XSS characters
      .substring(0, 1000); // Limit length
  }

  /**
   * Validate and sanitize form data
   */
  validateFormData(data: Record<string, unknown>): {
    isValid: boolean;
    sanitizedData: Record<string, unknown>;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const sanitizedData: Record<string, unknown> = {};

    try {
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === "string") {
          sanitizedData[key] = this.sanitizeString(value);
        } else {
          sanitizedData[key] = value;
        }
      }

      return {
        isValid: errors.length === 0,
        sanitizedData,
        errors,
        warnings,
      };
    } catch (error) {
      SafeLogger.error("Form validation error:", error, { data });
      return {
        isValid: false,
        sanitizedData: {},
        errors: ["Form validation error"],
        warnings: [],
      };
    }
  }
}
