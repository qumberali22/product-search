import type { Product } from "@/types/product";

// Sample data based on your CSV structure
const sampleProducts: Product[] = [
  {
    id: "8121622593775",
    title: "Craving and Stress Support",
    handle:
      "thorne-craving-and-stress-support-formerly-relora-plus-60-capsules",
    description:
      "Key Benefits: Reduces stress, Improves sleep quality, Keeps your mental focus intact. Thorne's PharmaGABA is centred around the natural form of gamma-aminobutyric acid (GABA), a crucial neurotransmitter.",
    vendor: "Thorne",
    productType: "Stress Tablets",
    status: "ACTIVE",
    featuredImage: "/placeholder.svg?height=300&width=300",
    priceRange: {
      minVariantPrice: { amount: 18.55, currencyCode: "USD" },
      maxVariantPrice: { amount: 18.55, currencyCode: "USD" },
    },
    totalInventory: 30,
    hasOutOfStockVariants: false,
    createdAt: "2023-09-25T15:52:45.000Z",
    updatedAt: "2025-03-21T13:10:43.000Z",
    seoTags: ["stress", "supplements", "health"],
  },
  {
    id: "8121623478511",
    title: "PharmaGABA-100",
    handle: "thorne-pharmagaba-100-60-capsules",
    description:
      "Clinical studies have shown that PharmaGABA can reduce stress-related beta waves in the brain and simultaneously boost the production of alpha-waves. In addition, this natural GABA variant has been found to have a positive impact on sleep quality.",
    vendor: "Thorne",
    productType: "Vitamins & Supplements",
    status: "ACTIVE",
    featuredImage: "/placeholder.svg?height=300&width=300",
    priceRange: {
      minVariantPrice: { amount: 24.49, currencyCode: "USD" },
      maxVariantPrice: { amount: 24.49, currencyCode: "USD" },
    },
    totalInventory: 25,
    hasOutOfStockVariants: false,
    createdAt: "2023-09-25T15:52:51.000Z",
    updatedAt: "2025-03-21T13:10:44.000Z",
    seoTags: ["sleep", "gaba", "supplements"],
  },
  {
    id: "3",
    title: "Omega-3 Fish Oil",
    handle: "omega-3-fish-oil",
    description:
      "High-quality omega-3 fatty acids for heart and brain health. Sourced from wild-caught fish.",
    vendor: "Nordic Naturals",
    productType: "Vitamins & Supplements",
    status: "ACTIVE",
    featuredImage: "/placeholder.svg?height=300&width=300",
    priceRange: {
      minVariantPrice: { amount: 32.99, currencyCode: "USD" },
      maxVariantPrice: { amount: 32.99, currencyCode: "USD" },
    },
    totalInventory: 50,
    hasOutOfStockVariants: false,
    seoTags: ["omega-3", "fish-oil", "heart-health"],
  },
  {
    id: "4",
    title: "Vitamin D3 + K2",
    handle: "vitamin-d3-k2",
    description:
      "Synergistic combination of Vitamin D3 and K2 for optimal bone health and calcium absorption.",
    vendor: "Life Extension",
    productType: "Vitamins & Supplements",
    status: "ACTIVE",
    featuredImage: "/placeholder.svg?height=300&width=300",
    priceRange: {
      minVariantPrice: { amount: 19.95, currencyCode: "USD" },
      maxVariantPrice: { amount: 19.95, currencyCode: "USD" },
    },
    totalInventory: 0,
    hasOutOfStockVariants: true,
    seoTags: ["vitamin-d", "vitamin-k", "bone-health"],
  },
  {
    id: "5",
    title: "Magnesium Glycinate",
    handle: "magnesium-glycinate",
    description:
      "Highly bioavailable form of magnesium for muscle relaxation and better sleep quality.",
    vendor: "Pure Encapsulations",
    productType: "Minerals",
    status: "ACTIVE",
    featuredImage: "/placeholder.svg?height=300&width=300",
    priceRange: {
      minVariantPrice: { amount: 28.5, currencyCode: "USD" },
      maxVariantPrice: { amount: 28.5, currencyCode: "USD" },
    },
    totalInventory: 40,
    hasOutOfStockVariants: false,
    seoTags: ["magnesium", "sleep", "muscle-health"],
  },
  {
    id: "6",
    title: "Probiotics Complex",
    handle: "probiotics-complex",
    description:
      "Multi-strain probiotic formula to support digestive health and immune function.",
    vendor: "Garden of Life",
    productType: "Probiotics",
    status: "ACTIVE",
    featuredImage: "/placeholder.svg?height=300&width=300",
    priceRange: {
      minVariantPrice: { amount: 45.99, currencyCode: "USD" },
      maxVariantPrice: { amount: 45.99, currencyCode: "USD" },
    },
    totalInventory: 20,
    hasOutOfStockVariants: false,
    seoTags: ["probiotics", "digestive-health", "immune-support"],
  },
];

export async function loadProducts(): Promise<Product[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Return sample data
  return sampleProducts;
}

// Enhanced CSV parsing function that handles your specific CSV structure
export function parseCSVData(csvContent: string): Product[] {
  const lines = csvContent.split("\n").filter((line) => line.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));
  const products: Product[] = [];

  for (let i = 1; i < lines.length; i++) {
    try {
      // Handle CSV parsing with proper quote handling for complex data
      const values: string[] = [];
      let currentValue = "";
      let inQuotes = false;
      let j = 0;

      while (j < lines[i].length) {
        const char = lines[i][j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          values.push(currentValue.trim());
          currentValue = "";
          j++;
          continue;
        } else {
          currentValue += char;
        }
        j++;
      }
      values.push(currentValue.trim());

      if (values.length < headers.length) continue;

      // Helper function to get column value by name
      const getColumnValue = (columnName: string) => {
        const index = headers.findIndex((h) =>
          h.toUpperCase().includes(columnName.toUpperCase())
        );
        return index >= 0 ? values[index]?.replace(/"/g, "") || "" : "";
      };

      const id = getColumnValue("ID");
      const title = getColumnValue("TITLE");

      if (!id || !title) continue;

      // Parse price range from JSON format
      let priceRange;
      const priceRangeStr =
        getColumnValue("PRICE_RANGE_V2") || getColumnValue("PRICE_RANGE");
      if (priceRangeStr) {
        try {
          const priceData = JSON.parse(priceRangeStr);
          priceRange = {
            minVariantPrice: {
              amount: Number.parseFloat(
                priceData.min_variant_price?.amount || "0"
              ),
              currencyCode: priceData.min_variant_price?.currency_code || "USD",
            },
            maxVariantPrice: {
              amount: Number.parseFloat(
                priceData.max_variant_price?.amount || "0"
              ),
              currencyCode: priceData.max_variant_price?.currency_code || "USD",
            },
          };
        } catch {
          // Fallback for simple price format
          const price = Number.parseFloat(priceRangeStr) || 0;
          priceRange = {
            minVariantPrice: { amount: price, currencyCode: "USD" },
            maxVariantPrice: { amount: price, currencyCode: "USD" },
          };
        }
      }

      // Parse SEO tags from JSON or simple format
      let seoTags: string[] = [];
      const seoStr = getColumnValue("SEO") || getColumnValue("TAGS");
      if (seoStr) {
        try {
          const seoData = JSON.parse(seoStr);
          if (seoData.description) {
            seoTags = seoData.description
              .split(",")
              .map((tag: string) => tag.trim());
          }
        } catch {
          seoTags = seoStr
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);
        }
      }

      const product: Product = {
        id,
        title,
        handle:
          getColumnValue("HANDLE") || title.toLowerCase().replace(/\s+/g, "-"),
        description:
          getColumnValue("DESCRIPTION") ||
          getColumnValue("DESCRIPTION_HTML")?.replace(/<[^>]*>/g, ""),
        vendor: getColumnValue("VENDOR"),
        productType: getColumnValue("PRODUCT_TYPE"),
        status: (getColumnValue("STATUS") as any) || "ACTIVE",
        featuredImage:
          getColumnValue("FEATURED_IMAGE") || getColumnValue("IMAGE"),
        priceRange,
        totalInventory: Number.parseInt(getColumnValue("TOTAL_INVENTORY")) || 0,
        hasOutOfStockVariants:
          getColumnValue("HAS_OUT_OF_STOCK_VARIANTS")?.toLowerCase() === "true",
        onlineStoreUrl:
          getColumnValue("ONLINE_STORE_URL") || getColumnValue("SHOP_URL"),
        createdAt: getColumnValue("CREATED_AT"),
        updatedAt: getColumnValue("UPDATED_AT"),
        seoTags,
      };

      products.push(product);
    } catch (error) {
      console.warn(`Error parsing row ${i}:`, error);
      continue;
    }
  }

  return products;
}
