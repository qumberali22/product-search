"use client";

import type React from "react";
import { Upload, X, CheckCircle, AlertTriangle } from "lucide-react";
import { useState, useRef } from "react";
import type { Product } from "@/types/product";
import { parseCSVData } from "@/lib/data";
import { saveProductsToStorage } from "@/lib/localStorage";

interface CsvUploadProps {
  onDataLoaded: (products: Product[], filename?: string) => void;
  onClose: () => void;
}

export function CsvUpload({ onDataLoaded, onClose }: CsvUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [processingStats, setProcessingStats] = useState<{
    totalRows: number;
    processedRows: number;
    validProducts: number;
    vendors: string[];
    productTypes: string[];
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setErrorMessage("Please select a CSV file");
      setUploadStatus("error");
      return;
    }

    setIsProcessing(true);
    setFileName(file.name);
    setUploadStatus("idle");
    setProcessingStats(null);

    try {
      const text = await file.text();
      console.log("CSV file loaded, size:", text.length, "characters");

      const products = parseCSVData(text);
      const lines = text.split("\n").filter((line) => line.trim());

      const uniqueVendors = [
        ...new Set(products.map((p) => p.vendor).filter(Boolean)),
      ] as string[];
      const uniqueProductTypes = [
        ...new Set(products.map((p) => p.productType).filter(Boolean)),
      ] as string[];

      setProcessingStats({
        totalRows: lines.length - 1,
        processedRows: lines.length - 1,
        validProducts: products.length,
        vendors: uniqueVendors.slice(0, 5),
        productTypes: uniqueProductTypes.slice(0, 5),
      });

      if (products.length === 0) {
        setErrorMessage(
          "No valid products found in the CSV file. Please check the file format."
        );
        setUploadStatus("error");
      } else {
        console.log(`Successfully parsed ${products.length} products`);

        // Save to localStorage
        saveProductsToStorage(products, file.name);

        setUploadStatus("success");
        setTimeout(() => {
          onDataLoaded(products, file.name);
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("CSV parsing error:", error);
      setErrorMessage(
        `Error reading the CSV file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setUploadStatus("error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Upload CSV File</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? "border-blue-400 bg-blue-50"
              : uploadStatus === "success"
              ? "border-green-400 bg-green-50"
              : uploadStatus === "error"
              ? "border-red-400 bg-red-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isProcessing ? (
            <div className="space-y-3">
              <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto" />
              <p className="text-sm text-gray-600">Processing {fileName}...</p>
              {processingStats && (
                <div className="text-xs text-gray-500">
                  <p>Total rows: {processingStats.totalRows}</p>
                  <p>Valid products: {processingStats.validProducts}</p>
                </div>
              )}
            </div>
          ) : uploadStatus === "success" ? (
            <div className="space-y-2">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
              <p className="text-sm text-green-600 font-medium">
                CSV uploaded successfully!
              </p>
              {processingStats && (
                <div className="text-xs text-green-600 space-y-1">
                  <p>✓ {processingStats.validProducts} products loaded</p>
                  <p>
                    ✓ {processingStats.vendors.length} vendors:{" "}
                    {processingStats.vendors.join(", ")}
                  </p>
                  <p>
                    ✓ {processingStats.productTypes.length} product types:{" "}
                    {processingStats.productTypes.join(", ")}
                  </p>
                  <p className="text-blue-600">
                    💾 Data saved to browser storage
                  </p>
                </div>
              )}
              <p className="text-xs text-gray-500">Loading products...</p>
            </div>
          ) : uploadStatus === "error" ? (
            <div className="space-y-2">
              <X className="h-8 w-8 text-red-600 mx-auto" />
              <p className="text-sm text-red-600">{errorMessage}</p>
              <button
                onClick={() => {
                  setUploadStatus("idle");
                  setErrorMessage("");
                  setProcessingStats(null);
                }}
                className="text-xs text-blue-600 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Drop your CSV file here
                </p>
                <p className="text-xs text-gray-500">or click to browse</p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Choose File
              </button>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="mt-4 space-y-3">
          <div className="text-xs text-gray-500">
            <p className="font-medium mb-1">
              Your CSV should include these columns:
            </p>
            <p className="text-xs">
              ID, TITLE, VENDOR, PRODUCT_TYPE, PRICE_RANGE_V2, TOTAL_INVENTORY,
              HAS_OUT_OF_STOCK_VARIANTS, etc.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-800">
                <p className="font-medium">Data Persistence:</p>
                <p>
                  Your uploaded data will be saved in browser storage and
                  persist across page refreshes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
