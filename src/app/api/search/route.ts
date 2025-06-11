import { type NextRequest, NextResponse } from "next/server";
import { loadProducts } from "@/lib/data";
import { searchProducts } from "@/lib/search";
import type { SearchFilters } from "@/types/product";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q") || "";
    const vendor = searchParams.get("vendor") || "";
    const productType = searchParams.get("productType") || "";
    const minPrice = Number.parseInt(searchParams.get("minPrice") || "0");
    const maxPrice = Number.parseInt(searchParams.get("maxPrice") || "1000");
    const inStock = searchParams.get("inStock") === "true";
    const sortBy = (searchParams.get("sortBy") || "relevance") as
      | "relevance"
      | "price-asc"
      | "price-desc"
      | "name"
      | "date";

    const filters: SearchFilters = {
      vendor,
      productType,
      priceRange: { min: minPrice, max: maxPrice },
      inStock,
    };

    const products = await loadProducts();
    const filteredProducts = searchProducts(products, query, filters, sortBy);

    return NextResponse.json({
      products: filteredProducts,
      total: filteredProducts.length,
      query,
      filters,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, filters, sortBy } = body;

    const products = await loadProducts();
    const filteredProducts = searchProducts(products, query, filters, sortBy);

    return NextResponse.json({
      products: filteredProducts,
      total: filteredProducts.length,
      query,
      filters,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to search products" },
      { status: 500 }
    );
  }
}
