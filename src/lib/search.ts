import type { Product, SearchFilters } from "@/types/product";

export function searchProducts(
  products: Product[],
  query: string,
  filters: SearchFilters,
  sortBy: "relevance" | "price-asc" | "price-desc" | "name" | "date"
): Product[] {
  let filtered = products;

  // Apply text search
  if (query.trim()) {
    const searchTerms = query.toLowerCase().split(" ");
    filtered = filtered.filter((product) => {
      const searchableText = [
        product.title,
        product.description,
        product.vendor,
        product.productType,
        ...(product.seoTags || []),
      ]
        .join(" ")
        .toLowerCase();

      return searchTerms.every((term) => searchableText.includes(term));
    });
  }

  // Apply filters
  if (filters.vendor) {
    filtered = filtered.filter((product) => product.vendor === filters.vendor);
  }

  if (filters.productType) {
    filtered = filtered.filter(
      (product) => product.productType === filters.productType
    );
  }

  if (filters.inStock) {
    filtered = filtered.filter(
      (product) =>
        product.totalInventory &&
        product.totalInventory > 0 &&
        !product.hasOutOfStockVariants
    );
  }

  // Apply price range filter
  filtered = filtered.filter((product) => {
    if (!product.priceRange) return true;
    const price = product.priceRange.minVariantPrice.amount;
    return price >= filters.priceRange.min && price <= filters.priceRange.max;
  });

  // Apply sorting
  filtered.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.title.localeCompare(b.title);

      case "price-asc":
        const priceA = a.priceRange?.minVariantPrice.amount || 0;
        const priceB = b.priceRange?.minVariantPrice.amount || 0;
        return priceA - priceB;

      case "price-desc":
        const priceA2 = a.priceRange?.minVariantPrice.amount || 0;
        const priceB2 = b.priceRange?.minVariantPrice.amount || 0;
        return priceB2 - priceA2;

      case "date":
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;

      case "relevance":
      default:
        // For relevance, we could implement a scoring system
        // For now, just return as-is
        return 0;
    }
  });

  return filtered;
}

// Fuzzy search implementation for better search results
export function fuzzySearch(text: string, query: string): number {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();

  if (textLower.includes(queryLower)) {
    return 1; // Exact match gets highest score
  }

  // Simple fuzzy matching - count matching characters
  let matches = 0;
  let queryIndex = 0;

  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      matches++;
      queryIndex++;
    }
  }

  return matches / queryLower.length;
}
