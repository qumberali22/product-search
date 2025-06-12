import type { Product } from "@/types/product";
import { toast } from "sonner";

export function parseCSVData(csvContent: string): Product[] {
  try {
    const lines = csvContent.split("\n").filter((line) => line.trim());
    if (lines.length < 2) {
      toast.error("CSV file is empty or has no data rows");
      return [];
    }

    const headers = parseCSVLine(lines[0]);

    const requiredColumns = [
      {
        key: "title",
        names: ["TITLE", "NAME", "PRODUCT NAME"],
        required: true,
      },
      {
        key: "priceRange",
        names: ["PRICE_RANGE", "PRICE", "PRICES"],
        required: true,
      },
    ];

    const optionalColumns = [
      { key: "id", names: ["ID", "PRODUCT_ID"], required: false },
      { key: "handle", names: ["HANDLE", "SLUG"], required: false },
      { key: "vendor", names: ["VENDOR", "BRAND"], required: false },
      {
        key: "productType",
        names: ["PRODUCT_TYPE", "TYPE", "CATEGORY"],
        required: false,
      },
      {
        key: "totalInventory",
        names: ["TOTAL_INVENTORY", "INVENTORY", "STOCK"],
        required: false,
      },
      {
        key: "hasOutOfStock",
        names: ["HAS_OUT_OF_STOCK_VARIANTS", "OUT_OF_STOCK"],
        required: false,
      },
      { key: "createdAt", names: ["CREATED_AT", "CREATED"], required: false },
      { key: "updatedAt", names: ["UPDATED_AT", "UPDATED"], required: false },
      { key: "tags", names: ["TAGS", "TAG"], required: false },
      { key: "status", names: ["STATUS"], required: false },
    ];

    const allColumns = [...requiredColumns, ...optionalColumns];

    const missingRequiredColumns = requiredColumns.filter(
      (col) => findColumnIndex(headers, col.names) === -1
    );

    if (missingRequiredColumns.length > 0) {
      const missingNames = missingRequiredColumns
        .map((col) => col.names[0])
        .join(", ");
      toast.error(`Missing required columns: ${missingNames}`);
      return [];
    }
    const columnIndices = Object.fromEntries(
      allColumns.map((col) => [col.key, findColumnIndex(headers, col.names)])
    ) as Record<string, number>;
    if (columnIndices.id === -1) {
      toast.warning("ID column not found - temporary IDs will be generated");
    }

    const products: Product[] = [];
    let successCount = 0;
    let errorCount = 0;
    let emptyFieldCount = 0;
    const emptyFieldsReport: Record<string, number> = {};

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCSVLine(lines[i]);
        const emptyFields: string[] = [];

        const getValue = (key: string, possibleNames: string[]): string => {
          const index = columnIndices[key];
          if (index === -1 || index >= values.length) {
            emptyFields.push(possibleNames[0]);
            return "";
          }
          const value = values[index]?.trim();
          if (!value) emptyFields.push(possibleNames[0]);
          return value || "";
        };

        const id =
          columnIndices.id >= 0 && values[columnIndices.id]?.trim()
            ? values[columnIndices.id].trim()
            : `temp-${i}-${Date.now()}`;

        const title = getValue("title", ["TITLE"]);
        if (!title) {
          toast.error(`Row ${i}: Missing required title, skipping`);
          errorCount++;
          continue;
        }

        const priceRangeStr = getValue("priceRange", ["PRICE_RANGE"]);
        if (!priceRangeStr) {
          toast.error(`Row ${i}: Missing required price range, skipping`);
          errorCount++;
          continue;
        }
        const handle =
          getValue("handle", ["HANDLE"]) ||
          title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
        let priceRange;
        try {
          const priceData = priceRangeStr ? JSON.parse(priceRangeStr) : {};
          priceRange = {
            minVariantPrice: {
              amount: parseFloat(priceData.min_variant_price?.amount || "0"),
              currencyCode: priceData.min_variant_price?.currency_code || "USD",
            },
            maxVariantPrice: {
              amount: parseFloat(priceData.max_variant_price?.amount || "0"),
              currencyCode: priceData.max_variant_price?.currency_code || "USD",
            },
          };
        } catch {
          const prices = priceRangeStr.match(/\d+\.?\d*/g) || ["0", "0"];
          priceRange = {
            minVariantPrice: {
              amount: parseFloat(prices[0]),
              currencyCode: "USD",
            },
            maxVariantPrice: {
              amount: parseFloat(prices[1]),
              currencyCode: "USD",
            },
          };
        }

        const tagsStr = getValue("tags", ["TAGS"]);
        const seoTags = tagsStr
          ? tagsStr
              .split(/[,|]/)
              .map((tag) => tag.trim())
              .filter((tag) => tag.length > 0 && tag.length < 50)
              .slice(0, 10)
          : [];

        if (emptyFields.length > 0) {
          emptyFields.forEach((field) => {
            emptyFieldsReport[field] = (emptyFieldsReport[field] || 0) + 1;
          });
          emptyFieldCount++;
        }

        const product: Product = {
          id,
          title: title.trim(),
          handle,
          vendor: getValue("vendor", ["VENDOR"]) || "Unknown",
          productType:
            getValue("productType", ["PRODUCT_TYPE"]) || "Uncategorized",
          status: ["ACTIVE", "ARCHIVED", "DRAFT"].includes(
            getValue("status", ["STATUS"]).toUpperCase()
          )
            ? (getValue("status", ["STATUS"]).toUpperCase() as
                | "ACTIVE"
                | "ARCHIVED"
                | "DRAFT")
            : "ACTIVE",
          featuredImage: "/placeholder.svg?height=400&width=400",
          priceRange,
          totalInventory:
            parseInt(getValue("totalInventory", ["TOTAL_INVENTORY"])) || 0,
          hasOutOfStockVariants:
            getValue("hasOutOfStock", ["HAS_OUT_OF_STOCK"]).toUpperCase() ===
            "TRUE",
          createdAt:
            getValue("createdAt", ["CREATED_AT"]) || new Date().toISOString(),
          updatedAt:
            getValue("updatedAt", ["UPDATED_AT"]) || new Date().toISOString(),
          seoTags,
        };

        products.push(product);
        successCount++;
      } catch (error) {
        toast.error(
          `Error parsing row ${i}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        errorCount++;
      }
    }
    let summaryMessage = `Processed ${
      lines.length - 1
    } rows: ${successCount} successful`;
    if (errorCount > 0) summaryMessage += `, ${errorCount} failed`;
    if (emptyFieldCount > 0)
      summaryMessage += `, ${emptyFieldCount} with empty fields`;

    if (Object.keys(emptyFieldsReport).length > 0) {
      const emptyDetails = Object.entries(emptyFieldsReport)
        .map(([field, count]) => `${field} (${count})`)
        .join(", ");
      toast.warning(`Empty fields detected: ${emptyDetails}`);
    }

    if (errorCount > 0) {
      toast.error(summaryMessage);
    } else if (emptyFieldCount > 0) {
      toast.warning(summaryMessage);
    } else {
      toast.success(summaryMessage);
    }

    return products;
  } catch (error) {
    toast.error(
      `Failed to parse CSV: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    return [];
  }
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
  return values.map((v) => v.trim());
}

function findColumnIndex(headers: string[], possibleNames: string[]): number {
  const headerSet = new Set(headers.map((h) => h.toUpperCase().trim()));
  console.log(headerSet);
  for (const name of possibleNames) {
    const index = headers.findIndex(
      (h) => h.toUpperCase().trim() === name.toUpperCase().trim()
    );
    if (index >= 0) return index;
  }
  return -1;
}
export async function loadProducts(): Promise<Product[]> {
  return [];
}
