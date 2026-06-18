export type Package = {
  id: string;
  name: string;
  blurb: string;
  totes: number;
  dollies: number;
  weeks: number; // weeks included in the base price
  price: number; // base price for the included weeks
  extraWeekPrice: number; // charged per additional week beyond the included weeks
  popular?: boolean;
  bestFor: string;
  features: string[];
};

// NOTE: Prices/quantities below are sensible placeholders.
// Edit them to match your real Stack'd Totes packages.
export const PACKAGES: Package[] = [
  {
    id: "small",
    name: "Small Move",
    blurb: "Perfect for apartments and smaller moves.",
    totes: 20,
    dollies: 1,
    weeks: 2,
    price: 109,
    extraWeekPrice: 25, // PLACEHOLDER — set your real per-extra-week rate
    bestFor: "Studio or 1-bed move",
    features: [
      "20 heavy-duty totes",
      "1 dolly included",
      "2-week rental",
      "Door-to-door delivery & free pickup",
      "Sanitized between every use",
    ],
  },
  {
    id: "medium",
    name: "Medium Move",
    blurb: "Our most popular package for growing households.",
    totes: 40,
    dollies: 2,
    weeks: 2,
    price: 185,
    extraWeekPrice: 35, // PLACEHOLDER — set your real per-extra-week rate
    popular: true,
    bestFor: "2-3 bedroom move",
    features: [
      "40 heavy-duty totes",
      "2 dollies included",
      "2-week rental",
      "Door-to-door delivery & free pickup",
      "Sanitized between every use",
    ],
  },
  {
    id: "large",
    name: "Large Move",
    blurb: "Everything a full-house move needs.",
    totes: 60,
    dollies: 3,
    weeks: 2,
    price: 239,
    extraWeekPrice: 45, // PLACEHOLDER — set your real per-extra-week rate
    bestFor: "4+ bedroom move",
    features: [
      "60 heavy-duty totes",
      "3 dollies included",
      "2-week rental",
      "Door-to-door delivery & priority scheduling",
      "Sanitized between every use",
    ],
  },
];

export function getPackage(id: string): Package | null {
  return PACKAGES.find((p) => p.id === id) ?? null;
}

export const SERVICE_AREA = ["Butler", "Hamilton", "Preble", "Warren"];
