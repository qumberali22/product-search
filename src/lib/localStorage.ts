import type { Product } from "@/types/product";

const STORAGE_KEY = "product_search_data";
const STORAGE_VERSION = "1.0";

interface StoredData {
  version: string;
  products: Product[];
  timestamp: number;
  filename?: string;
}

export function saveProductsToStorage(
  products: Product[],
  filename?: string
): void {
  try {
    const data: StoredData = {
      version: STORAGE_VERSION,
      products,
      timestamp: Date.now(),
      filename,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    console.log(`Saved ${products.length} products to localStorage`);
  } catch (error) {
    console.error("Failed to save products to localStorage:", error);
  }
}

export function loadProductsFromStorage(): {
  products: Product[];
  filename?: string;
} | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data: StoredData = JSON.parse(stored);

    // Check version compatibility
    if (data.version !== STORAGE_VERSION) {
      console.warn("Storage version mismatch, clearing old data");
      clearProductsFromStorage();
      return null;
    }

    // Check if data is not too old (optional: 7 days)
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    if (Date.now() - data.timestamp > maxAge) {
      console.warn("Stored data is too old, clearing");
      clearProductsFromStorage();
      return null;
    }

    console.log(`Loaded ${data.products.length} products from localStorage`);
    return {
      products: data.products,
      filename: data.filename,
    };
  } catch (error) {
    console.error("Failed to load products from localStorage:", error);
    clearProductsFromStorage();
    return null;
  }
}

export function clearProductsFromStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log("Cleared products from localStorage");
  } catch (error) {
    console.error("Failed to clear localStorage:", error);
  }
}

export function getStorageInfo(): {
  hasData: boolean;
  productCount: number;
  timestamp?: number;
  filename?: string;
} {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { hasData: false, productCount: 0 };

    const data: StoredData = JSON.parse(stored);
    return {
      hasData: true,
      productCount: data.products.length,
      timestamp: data.timestamp,
      filename: data.filename,
    };
  } catch (error) {
    console.log(error);
    return { hasData: false, productCount: 0 };
  }
}
