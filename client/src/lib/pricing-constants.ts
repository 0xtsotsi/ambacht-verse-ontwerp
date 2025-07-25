// Pricing constants for Wesley's Ambacht catering service

export const MIN_GUEST_COUNT = 10;
export const MAX_GUEST_COUNT = 500;

export const GUEST_COUNT_PRESETS = [12, 25, 40, 60, 100, 200] as const;

export const BASE_PRICE_PER_PERSON = 25;

export const SERVICE_TIERS = {
  essential: {
    name: "Essential",
    description: "Basis catering service",
    priceMultiplier: 0.8,
    features: ["Standaard menu", "Basis service", "2 uur service"]
  },
  premium: {
    name: "Premium", 
    description: "Uitgebreide catering service",
    priceMultiplier: 1.0,
    features: ["Uitgebreid menu", "Professionele service", "4 uur service", "Drankenpakket"]
  },
  luxury: {
    name: "Luxury",
    description: "Exclusieve catering service", 
    priceMultiplier: 1.4,
    features: ["Luxe menu", "Dedicated service", "6 uur service", "Premium drankenpakket", "Live cooking"]
  }
} as const;

export const SERVICE_CATEGORIES = {
  corporate: {
    name: "Zakelijk",
    description: "Bedrijfsevents en zakelijke bijeenkomsten",
    basePrice: 25,
    multiplier: 1.1
  },
  private: {
    name: "Privé",
    description: "Privé feesten en familiebijeenkomsten", 
    basePrice: 25,
    multiplier: 1.0
  },
  wedding: {
    name: "Bruiloft",
    description: "Trouwfeesten en huwelijksrecepties",
    basePrice: 25,
    multiplier: 1.3
  },
  celebration: {
    name: "Viering",
    description: "Verjaardag, jubileum en andere vieringen",
    basePrice: 25,
    multiplier: 1.15
  }
} as const;

export type ServiceTier = typeof SERVICE_TIERS[keyof typeof SERVICE_TIERS] & { id: keyof typeof SERVICE_TIERS };
export type ServiceCategory = typeof SERVICE_CATEGORIES[keyof typeof SERVICE_CATEGORIES] & { id: keyof typeof SERVICE_CATEGORIES };

// Helper functions to get objects with IDs
export const getServiceTierWithId = (tierId: keyof typeof SERVICE_TIERS): ServiceTier => ({
  ...SERVICE_TIERS[tierId],
  id: tierId
});

export const getServiceCategoryWithId = (categoryId: keyof typeof SERVICE_CATEGORIES): ServiceCategory => ({
  ...SERVICE_CATEGORIES[categoryId],
  id: categoryId
});

export const getAllServiceTiers = (): ServiceTier[] => 
  Object.keys(SERVICE_TIERS).map(id => getServiceTierWithId(id as keyof typeof SERVICE_TIERS));

export const getAllServiceCategories = (): ServiceCategory[] => 
  Object.keys(SERVICE_CATEGORIES).map(id => getServiceCategoryWithId(id as keyof typeof SERVICE_CATEGORIES));

export const VOLUME_DISCOUNTS = [
  { minGuests: 50, discount: 0.05, label: "5% korting vanaf 50 gasten" },
  { minGuests: 100, discount: 0.08, label: "8% korting vanaf 100 gasten" },
  { minGuests: 200, discount: 0.12, label: "12% korting vanaf 200 gasten" },
] as const;

export const ADD_ON_SERVICES = [
  {
    id: "premium-drinks",
    name: "Premium Drankenservice", 
    description: "Uitgebreide selectie wijnen, bieren en frisdranken",
    category: "beverage",
    pricePerPerson: 8.50,
    flatRate: null
  },
  {
    id: "coffee-tea",
    name: "Koffie & Thee Service",
    description: "Onbeperkte koffie en thee tijdens evenement", 
    category: "beverage",
    pricePerPerson: 3.75,
    flatRate: null
  },
  {
    id: "welcome-drink",
    name: "Welkomstdrankje",
    description: "Prosecco of speciaal welkomstdrankje bij aankomst",
    category: "beverage", 
    pricePerPerson: 4.25,
    flatRate: null
  },
  {
    id: "premium-wine",
    name: "Premium Wijnpakket",
    description: "Geselecteerde wijnen passend bij het menu",
    category: "beverage",
    pricePerPerson: 12.00,
    flatRate: null
  },
  {
    id: "linen-upgrade",
    name: "Linnen & Servies Upgrade",
    description: "Premium tafellinnen en servies",
    category: "equipment",
    pricePerPerson: null,
    flatRate: 150.00
  },
  {
    id: "av-system", 
    name: "Audio/Video Systeem",
    description: "Professionele geluids- en beeldapparatuur",
    category: "equipment",
    pricePerPerson: null,
    flatRate: 275.00
  },
  {
    id: "decoration",
    name: "Decoratie Pakket", 
    description: "Seizoensgebonden tafeldecoratie en bloemen",
    category: "equipment",
    pricePerPerson: null,
    flatRate: 125.00
  },
  {
    id: "tent-heating",
    name: "Tent & Verwarming",
    description: "Professionele tent met verwarming (outdoor events)",
    category: "equipment", 
    pricePerPerson: null,
    flatRate: 450.00
  },
  {
    id: "extra-staff",
    name: "Extra Bediening",
    description: "Aanvullend servicepersoneel",
    category: "staff",
    pricePerPerson: 12.50,
    flatRate: null
  },
  {
    id: "sommelier",
    name: "Sommelier Service", 
    description: "Professionele wijnadvies en -service",
    category: "staff",
    pricePerPerson: null,
    flatRate: 200.00
  },
  {
    id: "event-coordinator",
    name: "Event Coordinator",
    description: "Dedicated eventcoördinator ter plaatse", 
    category: "staff",
    pricePerPerson: null,
    flatRate: 300.00
  },
  {
    id: "live-cooking",
    name: "Live Cooking Station",
    description: "Chef die live gerechten bereidt",
    category: "extras", 
    pricePerPerson: 15.00,
    flatRate: null
  },
  {
    id: "cheese-platter",
    name: "Kaasplank Service",
    description: "Traditionele Nederlandse kaasplank",
    category: "extras",
    pricePerPerson: 6.75,
    flatRate: null
  },
  {
    id: "dessert-upgrade",
    name: "Dessert Upgrade",
    description: "Premium dessertbuffet",
    category: "extras",
    pricePerPerson: 7.50,
    flatRate: null
  },
  {
    id: "midnight-snack", 
    name: "Midnight Snack",
    description: "Late avond hapjes service",
    category: "extras",
    pricePerPerson: 8.25,
    flatRate: null
  }
] as const;