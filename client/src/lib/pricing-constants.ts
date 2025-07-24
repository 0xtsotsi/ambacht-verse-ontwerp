
export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  minPrice: number;
  maxPrice: number;
  features: string[];
  popularFeatures: string[];
}

export interface ServiceTier {
  id: string;
  name: string;
  description: string;
  priceMultiplier: number;
  features: string[];
}

export interface AddOnService {
  id: string;
  name: string;
  description: string;
  pricePerPerson?: number;
  flatRate?: number;
  popular: boolean;
}

export interface VolumeDiscount {
  minGuests: number;
  discount: number;
  label: string;
}

// Service categories
export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "buffet",
    name: "Buffet",
    description: "Complete buffet service met een breed assortiment aan gerechten",
    basePrice: 22.5,
    minPrice: 18.5,
    maxPrice: 27.5,
    features: [
      "Breed assortiment gerechten",
      "Zelf opscheppen",
      "Geschikt voor grote groepen"
    ],
    popularFeatures: [
      "Breed assortiment gerechten",
      "Geschikt voor grote groepen"
    ]
  },
  {
    id: "walking_dinner",
    name: "Walking Dinner",
    description: "Culinaire hapjes geserveerd in een informele setting",
    basePrice: 28.5,
    minPrice: 24.5,
    maxPrice: 34.5,
    features: [
      "Klein portie gerechten",
      "Informele setting",
      "Meer bewegingsvrijheid"
    ],
    popularFeatures: [
      "Informele setting",
      "Meer bewegingsvrijheid"
    ]
  },
  {
    id: "seated_dinner",
    name: "Seated Dinner",
    description: "Formeel diner aan tafel met bediening",
    basePrice: 35.0,
    minPrice: 29.5,
    maxPrice: 45.0,
    features: [
      "Formele tafelschikking",
      "Volledige bediening",
      "Meerdere gangen"
    ],
    popularFeatures: [
      "Volledige bediening",
      "Meerdere gangen"
    ]
  }
];

// Service tiers
export const SERVICE_TIERS: ServiceTier[] = [
  {
    id: "essential",
    name: "Essential",
    description: "Basis service met alle essentiële elementen",
    priceMultiplier: 1.0,
    features: [
      "Standaard servies en bestek",
      "Basis tafelinrichting",
      "Standaard menukaarten"
    ]
  },
  {
    id: "premium",
    name: "Premium",
    description: "Uitgebreide service met extra aandacht voor detail",
    priceMultiplier: 1.35,
    features: [
      "Premium servies en bestek",
      "Uitgebreide tafelinrichting",
      "Gepersonaliseerde menukaarten",
      "Meer personeelsbezetting"
    ]
  },
  {
    id: "luxury",
    name: "Luxury",
    description: "De ultieme culinaire ervaring met topkwaliteit en service",
    priceMultiplier: 1.75,
    features: [
      "Luxe servies en bestek",
      "Complete styling en decoratie",
      "Custom menukaarten",
      "Luxe servetten en tafellakens",
      "VIP personeelsbezetting",
      "Sommelier service"
    ]
  }
];

// Add-on services
export const ADD_ON_SERVICES: AddOnService[] = [
  {
    id: "live_cooking",
    name: "Live Cooking",
    description: "Chefs bereiden gerechten live voor uw gasten",
    flatRate: 350,
    popular: true
  },
  {
    id: "wine_pairing",
    name: "Wijn Arrangement",
    description: "Speciaal geselecteerde wijnen bij elk gerecht",
    pricePerPerson: 12.5,
    popular: true
  },
  {
    id: "dessert_buffet",
    name: "Dessert Buffet",
    description: "Uitgebreid buffet met diverse nagerechten",
    pricePerPerson: 8.5,
    popular: false
  },
  {
    id: "coffee_service",
    name: "Koffie Service",
    description: "Premium koffie en thee na het diner",
    pricePerPerson: 4.5,
    popular: false
  },
  {
    id: "welcome_drinks",
    name: "Welkomstdrankjes",
    description: "Feestelijke drankjes bij aankomst",
    pricePerPerson: 7.5,
    popular: true
  }
];

// Volume discounts
export const VOLUME_DISCOUNTS: VolumeDiscount[] = [
  {
    minGuests: 50,
    discount: 0.05,
    label: "5% korting vanaf 50 personen"
  },
  {
    minGuests: 100,
    discount: 0.08,
    label: "8% korting vanaf 100 personen"
  },
  {
    minGuests: 150,
    discount: 0.10,
    label: "10% korting vanaf 150 personen"
  }
];
