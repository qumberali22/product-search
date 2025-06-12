import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner"; // or "react-hot-toast"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Product Search App",
  description: "Advanced product search with filtering and sorting",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                Product Search
              </h1>
            </div>
          </div>
        </header>

        <main>{children}</main>

        {/* Toast provider */}
        <Toaster position="top-right" richColors expand={true} />

        <footer className="bg-gray-900 text-white">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">ProductSearch</h3>
                <p className="text-gray-400">
                  Find the perfect products from our extensive catalog.
                </p>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-400">
              <p>&copy; 2025 ProductSearch. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
