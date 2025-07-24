import {
  SERVICE_CATEGORIES,
  SERVICE_TIERS,
  ADD_ON_SERVICES,
  VOLUME_DISCOUNTS,
  type ServiceCategory,
  type ServiceTier,
  type AddOnService,
} from "./pricing-constants";

export interface QuoteInput {
  serviceCategory: string;
  serviceTier: string;
  guestCount: number;
  selectedAddOns: string[];
  eventDate?: Date;
}

export interface QuoteBreakdown {
  basePrice: number;
  basePricePerPerson: number;
  tierMultiplier: number;
  subtotal: number;
  addOns: AddOnBreakdown[];
  addOnsTotal: number;
  volumeDiscount: VolumeDiscount | null;
  finalTotal: number;
  pricePerPerson: number;
}

export interface AddOnBreakdown {
  id: string;
  name: string;
  pricePerPerson?: number;
  flatRate?: number;
  total: number;
}

export interface VolumeDiscount {
  minGuests: number;
  discount: number;
  discountAmount: number;
  label: string;
}

/**
 * Calculate a detailed quote breakdown based on user selections
 */
export function calculateQuote(input: QuoteInput): QuoteBreakdown {
  const category = SERVICE_CATEGORIES.find(
    (cat) => cat.id === input.serviceCategory,
  );
  const tier = SERVICE_TIERS.find((t) => t.id === input.serviceTier);

  if (!category || !tier) {
    throw new Error("Invalid service category or tier");
  }

  // Base pricing calculation
  const basePricePerPerson = category.basePrice;
  const tierMultiplier = tier.priceMultiplier;
  const adjustedPricePerPerson = basePricePerPerson * tierMultiplier;
  const basePrice = adjustedPricePerPerson * input.guestCount;

  // Add-ons calculation
  const addOns = calculateAddOns(input.selectedAddOns, input.guestCount);
  const addOnsTotal = addOns.reduce((total, addon) => total + addon.total, 0);

  // Subtotal before discounts
  const subtotal = basePrice + addOnsTotal;

  // Volume discount calculation
  const volumeDiscount = calculateVolumeDiscount(input.guestCount, subtotal);
  const discountAmount = volumeDiscount?.discountAmount || 0;

  // Final totals
  const finalTotal = subtotal - discountAmount;
  const finalPricePerPerson = finalTotal / input.guestCount;

  return {
    basePrice,
    basePricePerPerson: adjustedPricePerPerson,
    tierMultiplier,
    subtotal,
    addOns,
    addOnsTotal,
    volumeDiscount,
    finalTotal,
    pricePerPerson: finalPricePerPerson,
  };
}

/**
 * Calculate add-on services pricing
 */
function calculateAddOns(
  selectedAddOnIds: string[],
  guestCount: number,
): AddOnBreakdown[] {
  return selectedAddOnIds
    .map((id) => {
      const addon = ADD_ON_SERVICES.find((service) => service.id === id);
      if (!addon) return null;

      let total = 0;
      if (addon.pricePerPerson) {
        total = addon.pricePerPerson * guestCount;
      } else if (addon.flatRate) {
        total = addon.flatRate;
      }

      return {
        id: addon.id,
        name: addon.name,
        pricePerPerson: addon.pricePerPerson,
        flatRate: addon.flatRate,
        total,
      };
    })
    .filter((addon): addon is AddOnBreakdown => addon !== null);
}

/**
 * Calculate volume discount based on guest count
 */
function calculateVolumeDiscount(
  guestCount: number,
  subtotal: number,
): VolumeDiscount | null {
  // Find the highest applicable discount
  const applicableDiscount = VOLUME_DISCOUNTS.filter(
    (discount) => guestCount >= discount.minGuests,
  ).sort((a, b) => b.discount - a.discount)[0];

  if (!applicableDiscount) {
    return null;
  }

  return {
    minGuests: applicableDiscount.minGuests,
    discount: applicableDiscount.discount,
    discountAmount: subtotal * applicableDiscount.discount,
    label: applicableDiscount.label,
  };
}

/**
 * Get price range for a service category and tier combination
 */
export function getPriceRange(
  categoryId: string,
  tierId: string,
): { min: number; max: number } {
  const category = SERVICE_CATEGORIES.find((cat) => cat.id === categoryId);
  const tier = SERVICE_TIERS.find((t) => t.id === tierId);

  if (!category || !tier) {
    return { min: 0, max: 0 };
  }

  const min = category.minPrice * tier.priceMultiplier;
  const max = category.maxPrice * tier.priceMultiplier;

  return { min, max };
}

/**
 * Format currency in Dutch locale
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

/**
 * Calculate estimated total for quick display (simplified version)
 */
export function calculateEstimatedTotal(
  categoryId: string,
  tierId: string,
  guestCount: number,
): number {
  const category = SERVICE_CATEGORIES.find((cat) => cat.id === categoryId);
  const tier = SERVICE_TIERS.find((t) => t.id === tierId);

  if (!category || !tier) {
    return 0;
  }

  return category.basePrice * tier.priceMultiplier * guestCount;
}

/**
 * Get service category by ID
 */
export function getServiceCategory(id: string): ServiceCategory | undefined {
  return SERVICE_CATEGORIES.find((cat) => cat.id === id);
}

/**
 * Get service tier by ID
 */
export function getServiceTier(id: string): ServiceTier | undefined {
  return SERVICE_TIERS.find((tier) => tier.id === id);
}

/**
 * Get add-on service by ID
 */
export function getAddOnService(id: string): AddOnService | undefined {
  return ADD_ON_SERVICES.find((addon) => addon.id === id);
}

/**
 * Validate quote input
 */
export function validateQuoteInput(input: QuoteInput): string[] {
  const errors: string[] = [];

  if (!getServiceCategory(input.serviceCategory)) {
    errors.push("Ongeldige service categorie geselecteerd");
  }

  if (!getServiceTier(input.serviceTier)) {
    errors.push("Ongeldige service tier geselecteerd");
  }

  if (input.guestCount < 10) {
    errors.push("Minimum aantal gasten is 10");
  }

  if (input.guestCount > 500) {
    errors.push("Maximum aantal gasten is 500");
  }

  // Validate all selected add-ons exist
  for (const addonId of input.selectedAddOns) {
    if (!getAddOnService(addonId)) {
      errors.push(`Onbekende add-on service: ${addonId}`);
    }
  }

  return errors;
}
