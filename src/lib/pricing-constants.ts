// Pricing constants for Wesley's Ambacht catering services
// Based on existing ServicePricingCard component and DateChecker preliminary pricing

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
  category: "beverage" | "equipment" | "staff" | "extras";
}

// Service Categories (from existing pricing card)
export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "corporate",
    name: "Zakelijke Catering",
    description:
      "Professionele catering voor bedrijfsevenementen en zakelijke bijeenkomsten",
    basePrice: 23.0,
    minPrice: 18.5,
    maxPrice: 27.5,
    features: [
      "Professionele presentatie",
      "Flexibele menuopties",
      "Gediplomeerde chefs",
      "Premium ingrediënten",
      "Volledige service",
    ],
    popularFeatures: ["Meest gekozen door Fortune 500", "Gediplomeerde chefs"],
  },
  {
    id: "social",
    name: "Sociale Evenementen",
    description:
      "Verfijnde catering voor privé feesten en sociale gelegenheden",
    basePrice: 20.15,
    minPrice: 15.75,
    maxPrice: 24.5,
    features: [
      "Creatieve menusamenstelling",
      "Seizoensgebonden specialiteiten",
      "Ambachtelijke preparatie",
      "Lokale leveranciers",
      "Persoonlijke service",
    ],
    popularFeatures: ["Seizoensgebonden specialiteiten", "Lokale leveranciers"],
  },
  {
    id: "wedding",
    name: "Bruiloft Catering",
    description: "Exclusieve culinaire ervaring voor uw perfecte dag",
    basePrice: 28.5,
    minPrice: 22.0,
    maxPrice: 35.0,
    features: [
      "Gepersonaliseerde menu's",
      "Uitgebreide proeverij",
      "Exclusieve locatie service",
      "Bruiloft specialisten",
      "Premium presentatie",
    ],
    popularFeatures: ["Gepersonaliseerde menu's", "Uitgebreide proeverij"],
  },
  {
    id: "custom",
    name: "Maatwerk Service",
    description:
      "Volledig op maat gemaakte culinaire concepten voor unieke evenementen",
    basePrice: 27.5,
    minPrice: 12.5,
    maxPrice: 42.5,
    features: [
      "Volledig maatwerk concept",
      "Persoonlijke chef consultant",
      "Unieke menu creatie",
      "Exclusieve ingrediënten",
      "White-glove service",
    ],
    popularFeatures: [
      "Volledig maatwerk concept",
      "Persoonlijke chef consultant",
    ],
  },
];

// Service Tiers
export const SERVICE_TIERS: ServiceTier[] = [
  {
    id: "essential",
    name: "Essential",
    description: "Hoogwaardige basis catering met alle essentials",
    priceMultiplier: 0.85,
    features: [
      "Standaard menuopties",
      "Basis presentatie",
      "Kwaliteitsingrediënten",
      "Professionele service",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    description: "Uitgebreide service met premium ingrediënten en presentatie",
    priceMultiplier: 1.0,
    features: [
      "Premium ingrediënten",
      "Uitgebreide menuopties",
      "Elegante presentatie",
      "Persoonlijke service",
      "Inclusief servies",
    ],
  },
  {
    id: "luxury",
    name: "Luxury",
    description: "Exclusieve luxe catering met white-glove service",
    priceMultiplier: 1.35,
    features: [
      "Exclusieve ingrediënten",
      "Chef-designed menu's",
      "Premium presentatie",
      "Dedicated service team",
      "Inclusief premium servies",
      "Persoonlijke chef consultant",
    ],
  },
];

// Add-on Services
export const ADD_ON_SERVICES: AddOnService[] = [
  // Beverage Services
  {
    id: "open_bar",
    name: "Open Bar Service",
    description: "Volledig voorziene bar met gediplomeerde bartender",
    pricePerPerson: 15.5,
    category: "beverage",
  },
  {
    id: "wine_pairing",
    name: "Wijn Arrangement",
    description: "Geselecteerde wijnen passend bij het menu",
    pricePerPerson: 8.75,
    category: "beverage",
  },
  {
    id: "champagne_reception",
    name: "Champagne Ontvangst",
    description: "Welkomstdrankje met premium champagne",
    pricePerPerson: 6.5,
    category: "beverage",
  },

  // Equipment & Setup
  {
    id: "premium_linens",
    name: "Premium Tafellinnen",
    description: "Hoogwaardige tafelkleden en servetten",
    flatRate: 125.0,
    category: "equipment",
  },
  {
    id: "ambient_lighting",
    name: "Sfeerverlichting",
    description: "Professionele LED verlichting voor ambiance",
    flatRate: 275.0,
    category: "equipment",
  },
  {
    id: "sound_system",
    name: "Geluidsinstallatie",
    description: "Professioneel geluidssysteem met microfoons",
    flatRate: 185.0,
    category: "equipment",
  },

  // Additional Staff
  {
    id: "extra_waitstaff",
    name: "Extra Bediening",
    description: "Aanvullend bedieningspersoneel",
    pricePerPerson: 3.25,
    category: "staff",
  },
  {
    id: "dedicated_server",
    name: "Persoonlijke Gastheer/Dame",
    description: "Dedicated service voor VIP behandeling",
    flatRate: 185.0,
    category: "staff",
  },

  // Extra Services
  {
    id: "live_cooking",
    name: "Live Cooking Station",
    description: "Chef bereidt ter plekke gerechten",
    flatRate: 375.0,
    category: "extras",
  },
  {
    id: "dessert_station",
    name: "Dessert Station",
    description: "Uitgebreide dessert bar met verschillende opties",
    pricePerPerson: 4.5,
    category: "extras",
  },
  {
    id: "late_night_snacks",
    name: "Late Night Snacks",
    description: "Hartige snacks voor het late uur",
    pricePerPerson: 7.25,
    category: "extras",
  },
];

// Guest count presets for quick selection
export const GUEST_COUNT_PRESETS = [20, 50, 100, 150, 200];

// Minimum and maximum guest counts
export const MIN_GUEST_COUNT = 10;
export const MAX_GUEST_COUNT = 500;

// Popular guest count ranges with descriptions
export const GUEST_COUNT_RANGES = [
  {
    min: 10,
    max: 25,
    label: "Intiem",
    description: "Perfect voor kleine groepen",
  },
  {
    min: 26,
    max: 50,
    label: "Gezellig",
    description: "Ideaal voor familiefeesten",
  },
  { min: 51, max: 100, label: "Feestelijk", description: "Groot feest sfeer" },
  { min: 101, max: 200, label: "Groots", description: "Uitgebreide viering" },
  {
    min: 201,
    max: 500,
    label: "Spectaculair",
    description: "Grote evenementen",
  },
];

// Discount tiers based on guest count
export const VOLUME_DISCOUNTS = [
  { minGuests: 100, discount: 0.05, label: "5% korting bij 100+ gasten" },
  { minGuests: 200, discount: 0.08, label: "8% korting bij 200+ gasten" },
  { minGuests: 300, discount: 0.12, label: "12% korting bij 300+ gasten" },
];
