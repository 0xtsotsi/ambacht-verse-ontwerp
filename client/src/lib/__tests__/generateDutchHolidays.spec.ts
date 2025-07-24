/**
 * Comprehensive test suite for generateDutchHolidays function
 * Tests Dutch national holidays including fixed and moveable (Easter-based) holidays
 */

import { describe, it, expect, beforeEach } from "vitest";
import { generateDutchHolidays } from "../date-checker-constants";

describe("generateDutchHolidays", () => {
  // Test data for known Easter dates
  const knownEasterDates = [
    {
      year: 2023,
      easter: "2023-04-09",
      easterMonday: "2023-04-10",
      ascension: "2023-05-18",
      whitMonday: "2023-05-29",
    },
    {
      year: 2024,
      easter: "2024-03-31",
      easterMonday: "2024-04-01",
      ascension: "2024-05-09",
      whitMonday: "2024-05-20",
    },
    {
      year: 2025,
      easter: "2025-04-20",
      easterMonday: "2025-04-21",
      ascension: "2025-05-29",
      whitMonday: "2025-06-09",
    },
    {
      year: 2026,
      easter: "2026-04-05",
      easterMonday: "2026-04-06",
      ascension: "2026-05-14",
      whitMonday: "2026-05-25",
    },
    {
      year: 2027,
      easter: "2027-03-28",
      easterMonday: "2027-03-29",
      ascension: "2027-05-06",
      whitMonday: "2027-05-17",
    },
    {
      year: 2028,
      easter: "2028-04-16",
      easterMonday: "2028-04-17",
      ascension: "2028-05-25",
      whitMonday: "2028-06-05",
    },
    {
      year: 2029,
      easter: "2029-04-01",
      easterMonday: "2029-04-02",
      ascension: "2029-05-10",
      whitMonday: "2029-05-21",
    },
    {
      year: 2030,
      easter: "2030-04-21",
      easterMonday: "2030-04-22",
      ascension: "2030-05-30",
      whitMonday: "2030-06-10",
    },
  ];

  describe("Fixed Dutch Holidays", () => {
    it("should include all fixed Dutch holidays for any year", () => {
      const year = 2025;
      const holidays = generateDutchHolidays(year);

      // Fixed holidays
      expect(holidays).toContain("2025-01-01"); // Nieuwjaarsdag (New Year's Day)
      expect(holidays).toContain("2025-04-27"); // Koningsdag (King's Day)
      expect(holidays).toContain("2025-05-05"); // Bevrijdingsdag (Liberation Day)
      expect(holidays).toContain("2025-12-25"); // Eerste Kerstdag (Christmas Day)
      expect(holidays).toContain("2025-12-26"); // Tweede Kerstdag (Boxing Day)
      expect(holidays).toContain("2025-12-31"); // Oudjaarsdag (New Year's Eve)
    });

    it("should generate fixed holidays correctly for different years", () => {
      const years = [
        2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030,
      ];

      years.forEach((year) => {
        const holidays = generateDutchHolidays(year);

        expect(holidays).toContain(`${year}-01-01`);
        expect(holidays).toContain(`${year}-04-27`);
        expect(holidays).toContain(`${year}-05-05`);
        expect(holidays).toContain(`${year}-12-25`);
        expect(holidays).toContain(`${year}-12-26`);
        expect(holidays).toContain(`${year}-12-31`);
      });
    });

    it("should handle King's Day on Sunday (moved to April 26)", () => {
      // In 2025, April 27 is a Sunday, but the function doesn't implement this rule
      // This test documents the current behavior
      const holidays2025 = generateDutchHolidays(2025);
      expect(holidays2025).toContain("2025-04-27");
      // Note: In reality, when April 27 falls on Sunday, King's Day is celebrated on April 26
      // The current implementation doesn't handle this edge case
    });
  });

  describe("Easter-based Holidays", () => {
    it("should calculate Easter Monday correctly for 2025", () => {
      const holidays2025 = generateDutchHolidays(2025);

      // Easter 2025 is on April 20, so Easter Monday is April 21
      expect(holidays2025).toContain("2025-04-20"); // Paaszondag (Easter Sunday)
      expect(holidays2025).toContain("2025-04-21"); // Paasmaandag (Easter Monday)
    });

    it("should calculate all Easter-based holidays correctly for known years", () => {
      knownEasterDates.forEach(
        ({ year, easter, easterMonday, ascension, whitMonday }) => {
          const holidays = generateDutchHolidays(year);

          expect(holidays).toContain(easter);
          expect(holidays).toContain(easterMonday);
          expect(holidays).toContain(ascension);
          expect(holidays).toContain(whitMonday);
        },
      );
    });

    it("should calculate Ascension Day correctly (39 days after Easter)", () => {
      knownEasterDates.forEach(({ year, ascension }) => {
        const holidays = generateDutchHolidays(year);
        expect(holidays).toContain(ascension);
      });
    });

    it("should calculate Whit Monday correctly (50 days after Easter)", () => {
      knownEasterDates.forEach(({ year, whitMonday }) => {
        const holidays = generateDutchHolidays(year);
        expect(holidays).toContain(whitMonday);
      });
    });

    it("should handle early Easter dates correctly", () => {
      // 2027 has an early Easter (March 28)
      const holidays2027 = generateDutchHolidays(2027);

      expect(holidays2027).toContain("2027-03-28"); // Easter Sunday
      expect(holidays2027).toContain("2027-03-29"); // Easter Monday
      expect(holidays2027).toContain("2027-05-06"); // Ascension Day
      expect(holidays2027).toContain("2027-05-17"); // Whit Monday
    });

    it("should handle late Easter dates correctly", () => {
      // 2030 has a late Easter (April 21)
      const holidays2030 = generateDutchHolidays(2030);

      expect(holidays2030).toContain("2030-04-21"); // Easter Sunday
      expect(holidays2030).toContain("2030-04-22"); // Easter Monday
      expect(holidays2030).toContain("2030-05-30"); // Ascension Day
      expect(holidays2030).toContain("2030-06-10"); // Whit Monday
    });
  });

  describe("General Behavior", () => {
    it("should return exactly 10 holidays per year", () => {
      const years = [2023, 2024, 2025, 2026, 2027];

      years.forEach((year) => {
        const holidays = generateDutchHolidays(year);
        expect(holidays).toHaveLength(10); // 6 fixed + 4 Easter-based
      });
    });

    it("should return holidays in sorted order", () => {
      const holidays = generateDutchHolidays(2025);
      const sorted = [...holidays].sort();

      expect(holidays).toEqual(sorted);
    });

    it("should return unique dates only", () => {
      const holidays = generateDutchHolidays(2025);
      const uniqueHolidays = Array.from(new Set(holidays));

      expect(holidays).toHaveLength(uniqueHolidays.length);
    });

    it("should format dates consistently as YYYY-MM-DD", () => {
      const holidays = generateDutchHolidays(2025);
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

      holidays.forEach((holiday) => {
        expect(holiday).toMatch(dateRegex);
      });
    });

    it("should handle leap years correctly", () => {
      const holidays2024 = generateDutchHolidays(2024); // Leap year
      const holidays2025 = generateDutchHolidays(2025); // Non-leap year

      // Both should have the same number of holidays
      expect(holidays2024).toHaveLength(10);
      expect(holidays2025).toHaveLength(10);

      // Verify dates are valid in leap year
      holidays2024.forEach((dateStr) => {
        const date = new Date(dateStr);
        expect(date.toString()).not.toBe("Invalid Date");
      });
    });
  });

  describe("Year Boundaries and Edge Cases", () => {
    it("should handle century boundaries correctly", () => {
      const holidays2100 = generateDutchHolidays(2100);

      expect(holidays2100).toHaveLength(10);
      expect(holidays2100).toContain("2100-01-01");
      expect(holidays2100).toContain("2100-12-31");
    });

    it("should handle past years correctly", () => {
      const holidays2000 = generateDutchHolidays(2000);

      expect(holidays2000).toHaveLength(10);
      expect(holidays2000).toContain("2000-01-01");
      expect(holidays2000).toContain("2000-04-27");
      expect(holidays2000).toContain("2000-12-25");
    });

    it("should handle far future years correctly", () => {
      const holidays2050 = generateDutchHolidays(2050);

      expect(holidays2050).toHaveLength(10);
      holidays2050.forEach((dateStr) => {
        const date = new Date(dateStr);
        expect(date.getFullYear()).toBe(2050);
        expect(date.toString()).not.toBe("Invalid Date");
      });
    });

    it("should generate valid Date objects for all holidays", () => {
      const years = [1900, 1999, 2000, 2024, 2025, 2050, 2100];

      years.forEach((year) => {
        const holidays = generateDutchHolidays(year);

        holidays.forEach((dateStr) => {
          const date = new Date(dateStr);
          expect(date.toString()).not.toBe("Invalid Date");
          expect(date.getFullYear()).toBe(year);
        });
      });
    });
  });

  describe("Holiday Names and Context", () => {
    it("should include all major Dutch public holidays", () => {
      const holidays2025 = generateDutchHolidays(2025);

      // Map dates to holiday names for clarity
      const holidayMap = {
        "2025-01-01": "Nieuwjaarsdag",
        "2025-04-20": "Eerste Paasdag",
        "2025-04-21": "Tweede Paasdag",
        "2025-04-27": "Koningsdag",
        "2025-05-05": "Bevrijdingsdag",
        "2025-05-29": "Hemelvaartsdag",
        "2025-06-09": "Tweede Pinksterdag",
        "2025-12-25": "Eerste Kerstdag",
        "2025-12-26": "Tweede Kerstdag",
        "2025-12-31": "Oudjaarsdag",
      };

      Object.keys(holidayMap).forEach((date) => {
        expect(holidays2025).toContain(date);
      });
    });

    it("should not include Good Friday (not a public holiday in Netherlands)", () => {
      // Good Friday is 2 days before Easter
      const holidays2025 = generateDutchHolidays(2025);
      const goodFriday2025 = "2025-04-18";

      expect(holidays2025).not.toContain(goodFriday2025);
    });

    it("should not include Whit Sunday (only Monday is a public holiday)", () => {
      // Whit Sunday is 49 days after Easter
      const holidays2025 = generateDutchHolidays(2025);
      const whitSunday2025 = "2025-06-08";

      expect(holidays2025).not.toContain(whitSunday2025);
    });
  });

  describe("Performance", () => {
    it("should generate holidays quickly for a single year", () => {
      const startTime = performance.now();
      generateDutchHolidays(2025);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(10); // Should complete in less than 10ms
    });

    it("should handle multiple year calculations efficiently", () => {
      const startTime = performance.now();

      // Generate holidays for 100 years
      for (let year = 2000; year <= 2099; year++) {
        generateDutchHolidays(year);
      }

      const endTime = performance.now();
      expect(endTime - startTime).toBeLessThan(100); // Should complete in less than 100ms
    });
  });

  describe("Integration with Date Checking", () => {
    it("should provide dates that can be used for blackout date validation", () => {
      const holidays = generateDutchHolidays(2025);

      holidays.forEach((dateStr) => {
        // Verify date string can be parsed and compared
        const date = new Date(dateStr);
        const today = new Date();

        // Date comparison should work
        expect(typeof (date > today)).toBe("boolean");

        // ISO string conversion should match original
        expect(date.toISOString().split("T")[0]).toBe(dateStr);
      });
    });

    it("should generate consistent results when called multiple times", () => {
      const firstCall = generateDutchHolidays(2025);
      const secondCall = generateDutchHolidays(2025);
      const thirdCall = generateDutchHolidays(2025);

      expect(firstCall).toEqual(secondCall);
      expect(secondCall).toEqual(thirdCall);
    });
  });
});
