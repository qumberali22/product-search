import type { Product, SearchFilters } from "@/types/product";

export function searchProducts(
  products: Product[],
  query: string,
  filters: SearchFilters,
  sortBy: "price-asc" | "price-desc" | "name" | "date" | "date-asc"
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
    const minPrice = product.priceRange.minVariantPrice.amount;
    const maxPrice = product.priceRange.maxVariantPrice.amount;
    return (
      minPrice >= filters.priceRange.min && maxPrice <= filters.priceRange.max
    );
  });

  // Apply sorting
  filtered.sort((a, b) => {
    switch (sortBy) {
      case "name":
        // Sort by product title alphabetically
        return a.title.localeCompare(b.title);

      case "price-asc":
        // Sort by minimum price (low to high)
        const minPriceA = a.priceRange?.minVariantPrice.amount || 0;
        const minPriceB = b.priceRange?.minVariantPrice.amount || 0;
        return minPriceA - minPriceB;

      case "price-desc":
        // Sort by maximum price (high to low)
        const maxPriceA = a.priceRange?.maxVariantPrice.amount || 0;
        const maxPriceB = b.priceRange?.maxVariantPrice.amount || 0;
        return maxPriceB - maxPriceA;

      case "date":
        // Sort by creation date (newest first)
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;

      case "date-asc":
        // Sort by creation date (oldest first)
        const dateAscA = new Date(a.createdAt || 0).getTime();
        const dateAscB = new Date(b.createdAt || 0).getTime();
        return dateAscA - dateAscB;

      default:
        return 0;
    }
  });

  return filtered;
}
