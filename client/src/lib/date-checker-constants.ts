// Date checker constants for Wesley's Ambacht catering service

export const BASE_PRICE_PER_PERSON = 25;
export const SERVICE_TIER_MULTIPLIERS = {
  essential: 0.8,
  premium: 1.0,
  luxury: 1.4,
} as const;

export const SERVICE_CATEGORY_MULTIPLIERS = {
  corporate: 1.1,
  private: 1.0,
  wedding: 1.3,
  celebration: 1.15,
} as const;

export function calculateEstimatedPrice(
  guestCount: number,
  serviceTier: keyof typeof SERVICE_TIER_MULTIPLIERS = 'premium',
  serviceCategory: keyof typeof SERVICE_CATEGORY_MULTIPLIERS = 'private'
): number {
  const baseTotal = guestCount * BASE_PRICE_PER_PERSON;
  const tierMultiplier = SERVICE_TIER_MULTIPLIERS[serviceTier];
  const categoryMultiplier = SERVICE_CATEGORY_MULTIPLIERS[serviceCategory];
  
  return Math.round(baseTotal * tierMultiplier * categoryMultiplier);
}