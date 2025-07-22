/**
 * Tests for LoggerUtils sanitization functionality
 * Validates data sanitization and safe logging mechanisms
 */

import { describe, it, expect, vi } from "vitest";
import {
  sanitizeData,
  sanitizeError,
  sanitizeInteractionData,
  SafeLogger,
} from "../LoggerUtils";

describe("LoggerUtils", () => {
  describe("sanitizeData", () => {
    it("should sanitize sensitive string data", () => {
      const sensitiveData = {
        email: "user@example.com",
        phone: "+1234567890",
        creditCard: "1234-5678-9012-3456",
        normalData: "This is fine",
      };

      const sanitized = sanitizeData(sensitiveData);

      expect(sanitized.email).toBe("us*****@example.com");
      expect(sanitized.phone).toBe("12******90");
      expect(sanitized.creditCard).toBe("1234****3456");
      expect(sanitized.normalData).toBe("This is fine");
    });

    it("should completely remove sensitive fields", () => {
      const sensitiveData = {
        password: "secret123",
        token: "abc123token",
        apiKey: "key-123-secret",
        publicData: "visible",
      };

      const sanitized = sanitizeData(sensitiveData);

      expect(sanitized.password).toBe("[REMOVED]");
      expect(sanitized.token).toBe("[REMOVED]");
      expect(sanitized.apiKey).toBe("[REMOVED]");
      expect(sanitized.publicData).toBe("visible");
    });

    it("should handle nested objects recursively", () => {
      const nestedData = {
        user: {
          name: "John Doe",
          email: "john@example.com",
          credentials: {
            password: "secret",
            apiKey: "key123",
          },
        },
        metadata: {
          phone: "555-1234",
        },
      };

      const sanitized = sanitizeData(nestedData);

      expect(sanitized.user.name).toBe("John Doe");
      expect(sanitized.user.email).toBe("jo****@example.com");
      expect(sanitized.user.credentials.password).toBe("[REMOVED]");
      expect(sanitized.user.credentials.apiKey).toBe("[REMOVED]");
      expect(sanitized.metadata.phone).toBe("55****34");
    });

    it("should handle arrays correctly", () => {
      const arrayData = [
        { email: "user1@test.com", name: "User 1" },
        { email: "user2@test.com", password: "secret" },
        "normal string",
      ];

      const sanitized = sanitizeData(arrayData);

      expect(sanitized[0].email).toBe("us***@test.com");
      expect(sanitized[0].name).toBe("User 1");
      expect(sanitized[1].email).toBe("us***@test.com");
      expect(sanitized[1].password).toBe("[REMOVED]");
      expect(sanitized[2]).toBe("normal string");
    });

    it("should handle primitive values correctly", () => {
      expect(sanitizeData("normal string")).toBe("normal string");
      expect(sanitizeData(123)).toBe(123);
      expect(sanitizeData(true)).toBe(true);
      expect(sanitizeData(null)).toBe(null);
      expect(sanitizeData(undefined)).toBe(undefined);
    });

    it("should handle Date objects", () => {
      const date = new Date("2023-12-25T10:00:00Z");
      const sanitized = sanitizeData(date);
      expect(sanitized).toBe(date.toISOString());
    });

    it("should handle Error objects", () => {
      const error = new Error("Test error message");
      error.stack = "Error stack trace...";

      const sanitized = sanitizeData(error);

      expect(sanitized.name).toBe("Error");
      expect(sanitized.message).toBe("Test error message");
      expect(sanitized.stack).toBe("[Stack trace available]");
    });

    it("should respect max depth limit", () => {
      const deepObject = {
        level1: {
          level2: {
            level3: {
              level4: {
                tooDeep: "should be truncated",
              },
            },
          },
        },
      };

      const sanitized = sanitizeData(deepObject, { maxDepth: 3 });
      expect(sanitized.level1.level2.level3).toBe("[Max depth reached]");
    });

    it("should handle custom remove and mask fields", () => {
      const data = {
        customSecret: "secret123",
        customSensitive: "sensitive@email.com",
        normal: "normal data",
      };

      const sanitized = sanitizeData(data, {
        removeFields: ["customSecret"],
        maskFields: ["customSensitive"],
      });

      expect(sanitized.customSecret).toBe("[REMOVED]");
      expect(sanitized.customSensitive).toBe("[MASKED]");
      expect(sanitized.normal).toBe("normal data");
    });
  });

  describe("email detection and masking", () => {
    it("should detect and mask various email formats", () => {
      const emails = [
        "simple@test.com",
        "long.email.address@domain.co.uk",
        "short@a.b",
      ];

      emails.forEach((email) => {
        const sanitized = sanitizeData(email);
        expect(sanitized).toMatch(/\*+@/);
        expect(sanitized).not.toBe(email);
      });
    });

    it("should preserve domain in email masking", () => {
      const email = "testuser@example.com";
      const sanitized = sanitizeData(email);
      expect(sanitized).toContain("@example.com");
    });
  });

  describe("phone number detection and masking", () => {
    it("should detect and mask phone numbers", () => {
      const phones = [
        "+1234567890",
        "555-123-4567",
        "(555) 123-4567",
        "555 123 4567",
      ];

      phones.forEach((phone) => {
        const sanitized = sanitizeData(phone);
        expect(sanitized).toMatch(/\d{2}\*+\d{2}/);
      });
    });
  });

  describe("credit card detection and masking", () => {
    it("should detect and mask credit card numbers", () => {
      const cards = [
        "1234567890123456",
        "1234-5678-9012-3456",
        "1234 5678 9012 3456",
      ];

      cards.forEach((card) => {
        const sanitized = sanitizeData(card);
        expect(sanitized).toMatch(/\d{4}\*+\d{4}/);
      });
    });
  });

  describe("sanitizeError", () => {
    it("should sanitize Error objects", () => {
      const error = new Error("Database connection failed");
      const context = {
        userId: "user123",
        email: "user@test.com",
        password: "secret123",
      };

      const sanitized = sanitizeError(error, context);

      expect(sanitized.name).toBe("Error");
      expect(sanitized.message).toBe("Database connection failed");
      expect(sanitized.context.userId).toBe("user123");
      expect(sanitized.context.email).toBe("us**@test.com");
      expect(sanitized.context.password).toBe("[REMOVED]");
      expect(sanitized.timestamp).toBeDefined();
      expect(sanitized.type).toBe("error");
    });

    it("should handle string errors", () => {
      const sanitized = sanitizeError("Simple error message");

      expect(sanitized.message).toBe("Simple error message");
      expect(sanitized.timestamp).toBeDefined();
      expect(sanitized.type).toBe("error");
    });

    it("should handle non-Error objects", () => {
      const errorObj = {
        code: "AUTH_FAILED",
        details: {
          email: "failed@login.com",
          password: "wrong123",
        },
      };

      const sanitized = sanitizeError(errorObj);

      expect(sanitized.error.code).toBe("AUTH_FAILED");
      expect(sanitized.error.details.email).toBe("fa****@login.com");
      expect(sanitized.error.details.password).toBe("[REMOVED]");
    });
  });

  describe("sanitizeInteractionData", () => {
    it("should sanitize interaction data", () => {
      const data = {
        action: "user_login",
        userData: {
          email: "user@test.com",
          token: "auth-token-123",
        },
        timestamp: new Date(),
      };

      const sanitized = sanitizeInteractionData("login", "AuthComponent", data);

      expect(sanitized.eventType).toBe("login");
      expect(sanitized.component).toBe("AuthComponent");
      expect(sanitized.data.action).toBe("user_login");
      expect(sanitized.data.userData.email).toBe("us**@test.com");
      expect(sanitized.data.userData.token).toBe("[REMOVED]");
      expect(sanitized.timestamp).toBeDefined();
    });

    it("should handle undefined data", () => {
      const sanitized = sanitizeInteractionData("click", "Button");

      expect(sanitized.eventType).toBe("click");
      expect(sanitized.component).toBe("Button");
      expect(sanitized.data).toBeUndefined();
      expect(sanitized.timestamp).toBeDefined();
    });
  });

  describe("SafeLogger", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should log safely with data sanitization", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const data = {
        message: "User action",
        user: {
          email: "user@test.com",
          password: "secret123",
        },
      };

      SafeLogger.log("Test message", data);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Test message",
        expect.objectContaining({
          message: "User action",
          user: expect.objectContaining({
            email: "us**@test.com",
            password: "[REMOVED]",
          }),
        }),
      );

      consoleSpy.mockRestore();
    });

    it("should log errors safely", () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const error = new Error("Test error");
      const context = {
        email: "error@test.com",
        apiKey: "secret-key",
      };

      SafeLogger.error("Error occurred", error, context);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error occurred",
        expect.objectContaining({
          name: "Error",
          message: "Test error",
          context: expect.objectContaining({
            email: "er****@test.com",
            apiKey: "[REMOVED]",
          }),
        }),
      );

      consoleSpy.mockRestore();
    });

    it("should handle logging without data", () => {
      const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});

      SafeLogger.info("Simple message");

      expect(consoleSpy).toHaveBeenCalledWith("Simple message", "");

      consoleSpy.mockRestore();
    });
  });

  describe("performance and edge cases", () => {
    it("should handle large objects efficiently", () => {
      const largeObject = {
        items: Array.from({ length: 1000 }, (_, i) => ({
          id: i,
          email: `user${i}@test.com`,
          password: `password${i}`,
        })),
      };

      const startTime = performance.now();
      const sanitized = sanitizeData(largeObject);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // Should complete within 100ms
      expect(sanitized.items).toHaveLength(1000);
      expect(sanitized.items[0].email).toMatch(/\*+@test\.com/);
      expect(sanitized.items[0].password).toBe("[REMOVED]");
    });

    it("should handle circular references gracefully", () => {
      const circularObj: { name: string; self?: unknown } = { name: "test" };
      circularObj.self = circularObj;

      // Should not throw an error due to maxDepth limit
      expect(() => sanitizeData(circularObj)).not.toThrow();
    });

    it("should handle complex nested structures", () => {
      const complexData = {
        users: [
          {
            profile: {
              personal: {
                email: "user1@test.com",
                contacts: {
                  phone: "555-1234",
                  emergency: {
                    phone: "555-5678",
                  },
                },
              },
              security: {
                password: "secret1",
                apiKeys: ["key1", "key2"],
              },
            },
          },
        ],
      };

      const sanitized = sanitizeData(complexData);

      expect(sanitized.users[0].profile.personal.email).toMatch(
        /\*+@test\.com/,
      );
      expect(sanitized.users[0].profile.personal.contacts.phone).toMatch(
        /\d{2}\*+\d{2}/,
      );
      expect(sanitized.users[0].profile.security.password).toBe("[REMOVED]");
    });
  });
});
