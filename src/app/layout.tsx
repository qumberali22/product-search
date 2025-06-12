import type { ReactNode } from "react"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Product Search App",
  description: "Advanced product search with filtering and sorting",
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="w-full px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">ProductSearch</h1>
              
            </div>
          </div>
        </header>

        <main className="min-h-screen bg-gray-50 w-full">{children}</main>
      </body>
    </html>
  )
}
