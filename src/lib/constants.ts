export const PRODUCT_TYPES = [
  "Vitamins & Supplements",
  "Stress Tablets",
  "Minerals",
  "Probiotics",
  "Herbal Supplements",
  "Protein Powders",
  "Essential Oils",
] as const;

export const VENDORS = [
  "Thorne",
  "Nordic Naturals",
  "Life Extension",
  "Pure Encapsulations",
  "Garden of Life",
  "NOW Foods",
  "Solgar",
] as const;

export const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "name", label: "Name A-Z" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "date", label: "Newest First" },
] as const;
