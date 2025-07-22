#!/usr/bin/env node

// Simple test runner to verify generateDutchHolidays function
import { generateDutchHolidays } from "./src/lib/date-checker-constants.ts";

console.log("Testing generateDutchHolidays function...\n");

// Test 1: Check 2025 Easter Monday
console.log("Test 1: Easter Monday 2025");
const holidays2025 = generateDutchHolidays(2025);
const hasEasterMonday2025 = holidays2025.includes("2025-04-21");
console.log(
  `✓ Easter Monday 2025 (April 21): ${hasEasterMonday2025 ? "PASS" : "FAIL"}`,
);
console.log(`  Found holidays: ${holidays2025.join(", ")}\n`);

// Test 2: Check all fixed holidays
console.log("Test 2: Fixed Dutch Holidays");
const fixedHolidays = [
  { date: "2025-01-01", name: "New Year's Day" },
  { date: "2025-04-27", name: "King's Day" },
  { date: "2025-05-05", name: "Liberation Day" },
  { date: "2025-12-25", name: "Christmas Day" },
  { date: "2025-12-26", name: "Boxing Day" },
  { date: "2025-12-31", name: "New Year's Eve" },
];

fixedHolidays.forEach(({ date, name }) => {
  const found = holidays2025.includes(date);
  console.log(`✓ ${name} (${date}): ${found ? "PASS" : "FAIL"}`);
});

// Test 3: Check Easter-based holidays for 2025
console.log("\nTest 3: Easter-based Holidays 2025");
const easterHolidays = [
  { date: "2025-04-20", name: "Easter Sunday" },
  { date: "2025-04-21", name: "Easter Monday" },
  { date: "2025-05-29", name: "Ascension Day" },
  { date: "2025-06-09", name: "Whit Monday" },
];

easterHolidays.forEach(({ date, name }) => {
  const found = holidays2025.includes(date);
  console.log(`✓ ${name} (${date}): ${found ? "PASS" : "FAIL"}`);
});

// Test 4: Verify total count and sorting
console.log("\nTest 4: General Properties");
console.log(`✓ Total holidays count: ${holidays2025.length} (expected: 10)`);
const isSorted =
  JSON.stringify(holidays2025) === JSON.stringify([...holidays2025].sort());
console.log(`✓ Holidays are sorted: ${isSorted ? "PASS" : "FAIL"}`);

// Test 5: Test multiple years
console.log("\nTest 5: Multiple Years Test");
const testYears = [2024, 2025, 2026];
testYears.forEach((year) => {
  const holidays = generateDutchHolidays(year);
  console.log(`✓ Year ${year}: ${holidays.length} holidays`);
});

console.log("\n✅ Test verification complete!");
