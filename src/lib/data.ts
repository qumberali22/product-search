import type { Product } from "@/types/product";

export function parseCSVData(csvContent: string): Product[] {
  const lines = csvContent.split("\n").filter((line) => line.trim());
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);

  const columnIndices = {
    id: findColumnIndex(headers, ["ID"]),
    title: findColumnIndex(headers, ["TITLE"]),
    handle: findColumnIndex(headers, ["HANDLE"]),
    vendor: findColumnIndex(headers, ["VENDOR"]),
    productType: findColumnIndex(headers, ["PRODUCT_TYPE"]),
    priceRange: findColumnIndex(headers, ["PRICE_RANGE"]),
    totalInventory: findColumnIndex(headers, ["TOTAL_INVENTORY"]),
    hasOutOfStock: findColumnIndex(headers, ["HAS_OUT_OF_STOCK_VARIANTS"]),
    createdAt: findColumnIndex(headers, ["CREATED_AT"]),
    updatedAt: findColumnIndex(headers, ["UPDATED_AT"]),
    tags: findColumnIndex(headers, ["TAGS"]),
    status: findColumnIndex(headers, ["STATUS"]),
  };

  const products: Product[] = [];
  let successCount = 0;
  let errorCount = 0;

  for (let i = 1; i < lines.length; i++) {
    try {
      const values = parseCSVLine(lines[i]);

      const getValue = (index: number, fieldName: string = ""): string => {
        if (index < 0) {
          return "";
        }

        const value = values[index]?.trim() || "";
        if (i === 1 && fieldName) {
        }
        return value;
      };
      const id = getValue(columnIndices.id, "ID");
      const title = getValue(columnIndices.title, "TITLE");
      const handle = getValue(columnIndices.handle, "HANDLE");
      const vendor = getValue(columnIndices.vendor, "VENDOR");
      const productType = getValue(columnIndices.productType, "PRODUCT_TYPE");
      const priceRangeStr = getValue(columnIndices.priceRange, "PRICE_RANGE");
      const totalInventoryStr = getValue(
        columnIndices.totalInventory,
        "TOTAL_INVENTORY"
      );
      const hasOutOfStockStr = getValue(
        columnIndices.hasOutOfStock,
        "HAS_OUT_OF_STOCK"
      );
      const createdAt = getValue(columnIndices.createdAt, "CREATED_AT");
      const updatedAt = getValue(columnIndices.updatedAt, "UPDATED_AT");
      const tagsStr = getValue(columnIndices.tags, "TAGS");
      const status = getValue(columnIndices.status, "STATUS");

      if (!title) {
        console.log(`❌ Row ${i}: No title found, skipping`);
        errorCount++;
        continue;
      }

      // Parse price range
      let priceRange;
      if (priceRangeStr) {
        try {
          const priceData = JSON.parse(priceRangeStr);
          console.log("The price data parse: ", priceData);
          priceRange = {
            minVariantPrice: {
              amount: Number.parseFloat(
                priceData.min_variant_price?.amount || "24.00"
              ),
              currencyCode: priceData.min_variant_price?.currency_code || "USD",
            },
            maxVariantPrice: {
              amount: Number.parseFloat(
                priceData.max_variant_price?.amount || "28.00"
              ),
              currencyCode: priceData.max_variant_price?.currency_code || "USD",
            },
          };
        } catch (e) {
          console.log(`⚠️  Failed to parse price range JSON: ${e}`);
          const min_price =
            Number.parseFloat(priceRangeStr.replace(/[^0-9.]/g, "")) || 24.0;
          const max_price =
            Number.parseFloat(priceRangeStr.replace(/[^0-9.]/g, "")) || 28.0;
          priceRange = {
            minVariantPrice: { amount: min_price, currencyCode: "USD" },
            maxVariantPrice: { amount: max_price, currencyCode: "USD" },
          };
        }
      }

      const seoTags = tagsStr
        ? tagsStr
            .split(/[,|]/)
            .map((tag) => tag.trim())
            .filter(Boolean)
            .filter((tag) => tag.length > 0 && tag.length < 50)
            .slice(0, 10)
        : [];

      const totalInventory = totalInventoryStr
        ? Number.parseInt(totalInventoryStr) || 0
        : 0;
      const hasOutOfStockVariants = hasOutOfStockStr?.toUpperCase() === "TRUE";

      const productStatus = ["ACTIVE", "ARCHIVED", "DRAFT"].includes(
        status?.toUpperCase()
      )
        ? (status.toUpperCase() as "ACTIVE" | "ARCHIVED" | "DRAFT")
        : "ACTIVE";

      const product: Product = {
        id: id || String(i),
        title: title.trim(),
        handle:
          handle ||
          title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, ""),
        vendor: vendor || "Unknown",
        productType: productType || "Uncategorized",
        status: productStatus,
        featuredImage: "/placeholder.svg?height=400&width=400",
        priceRange,
        totalInventory,
        hasOutOfStockVariants,
        createdAt,
        updatedAt,
        seoTags,
      };

      products.push(product);
      successCount++;
      console.log(successCount);
    } catch (error) {
      console.error(`❌ Error parsing row ${i}:`, error);
      errorCount++;
      console.log(errorCount);
      continue;
    }
  }

  console.log("The product data: ", products);

  return products;
}

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let currentValue = "";
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];
    const nextChar = i + 1 < line.length ? line[i + 1] : null;

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentValue += '"';
        i += 2;
      } else {
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === "," && !inQuotes) {
      values.push(currentValue);
      currentValue = "";
      i++;
    } else {
      currentValue += char;
      i++;
    }
  }

  values.push(currentValue);

  return values;
}

function findColumnIndex(headers: string[], possibleNames: string[]): number {
  for (const name of possibleNames) {
    const index = headers.findIndex(
      (h) => h.toUpperCase().trim() === name.toUpperCase().trim()
    );
    if (index >= 0) {
      return index;
    }
  }
  return -1;
}

export async function loadProducts(): Promise<Product[]> {
  return [];
}
