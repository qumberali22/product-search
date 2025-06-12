# Product Search Application

A modern, responsive product search application built with Next.js 15, featuring advanced search capabilities, filtering, and sorting functionality.

## Features

- **Advanced Search**: Search by product name, vendor, description, and SEO tags
- **Smart Filtering**: Filter by vendor, product type, price range, and stock status
- **Multiple Sort Options**: Sort by relevance, name, price, and date
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Results**: Instant search results as you type
- **CSV Data Support**: Designed to work with CSV product data
- **API Routes**: RESTful API endpoints for search functionality

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **Icons**: Lucide React
- **TypeScript**: Full type safety
- **State Management**: React hooks (useState, useEffect, useMemo)

## Project Structure

\`\`\`
src/
├── app/
│ ├── (main)/
│ │ ├── layout.tsx # Main layout with header/footer
│ │ └── page.tsx # Homepage with search interface
│ └── globals.css # Global styles and utilities
├── components/
│ ├── upload/
│ │ └── CsvUpload.tsx # CSV file upload modal
│ ├── search/
│ │ ├── SearchBar.tsx # Search input with sorting
│ │ ├── Filters.tsx # Filter sidebar
│ │ ├── ViewToggle.tsx # Grid/table view toggle
│ │ ├── ProductCard.tsx # Grid view product cards
│ │ ├── ProductTable.tsx # Table view with pagination
│ │ └── ResultsGrid.tsx # Grid layout wrapper
│ └── product/
│ └── ProductDetailsModal.tsx # Detailed product modal
├── lib/
│ ├── data.ts # CSV parsing and data handling
│ └── search.ts # Search and filtering logic
└── types/
└── product.d.ts # TypeScript type definitions
\`\`\`

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone <repository-url>
   cd product-search-app
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install

# or

yarn install
\`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev

# or

yarn dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### GET /api/search

Search products with query parameters:

- \`q\`: Search query
- \`vendor\`: Filter by vendor
- \`productType\`: Filter by product type
- \`minPrice\`: Minimum price
- \`maxPrice\`: Maximum price
- \`inStock\`: Filter in-stock items only
- \`sortBy\`: Sort order (relevance, name, price-asc, price-desc, date)

### POST /api/search

Search products with request body containing search parameters.

## CSV Data Format

The application expects CSV data with the following columns:

- \`ID\`: Unique product identifier
- \`TITLE\`: Product name
- \`HANDLE\`: URL-friendly product identifier
- \`DESCRIPTION\`: Product description
- \`VENDOR\`: Product vendor/brand
- \`PRODUCT_TYPE\`: Category of the product
- \`STATUS\`: Product status (ACTIVE, ARCHIVED, DRAFT)
- \`FEATURED_IMAGE\`: URL to product image
- \`PRICE_MIN\`: Minimum price
- \`PRICE_MAX\`: Maximum price
- \`CURRENCY\`: Currency code
- \`TOTAL_INVENTORY\`: Stock quantity
- \`HAS_OUT_OF_STOCK_VARIANTS\`: Boolean for stock status
- \`CREATED_AT\`: Creation timestamp
- \`UPDATED_AT\`: Last update timestamp
- \`SEO_TAGS\`: Comma-separated tags for SEO

## Search Features

### Text Search

- Searches across product title, description, vendor, and SEO tags
- Supports multi-word queries
- Case-insensitive matching

### Filters

- **Vendor**: Filter by specific brands/vendors
- **Product Type**: Filter by product categories
- **Price Range**: Adjustable price range slider
- **Stock Status**: Show only in-stock items

### Sorting Options

- **Relevance**: Default sorting based on search relevance
- **Name A-Z**: Alphabetical sorting
- **Price**: Low to high or high to low
- **Date**: Newest products first

## Customization

### Adding New Product Fields

1. Update the \`Product\` interface in \`src/types/product.d.ts\`
2. Modify the CSV parsing logic in \`src/lib/data.ts\`
3. Update the product card component to display new fields

### Modifying Search Logic

The search logic is contained in \`src/lib/search.ts\`. You can:

- Adjust search scoring algorithms
- Add new filter types
- Implement fuzzy search improvements

### Styling Customization

- Global styles: \`src/app/globals.css\`
- Component styles: Individual component files using Tailwind classes
- Theme customization: \`tailwind.config.ts\`

## Performance Considerations

- **Memoization**: Search results are memoized using \`useMemo\`
- **API Routes**: Server-side search processing
- **Debouncing**: Consider adding search debouncing for large datasets
- **Pagination**: Implement pagination for datasets with 1000+ products
- **Virtual Scrolling**: For very large product lists

## Deployment

The application can be deployed to any platform that supports Next.js:

- **Vercel**: Recommended for Next.js applications
- **Netlify**: Static site deployment
- **AWS/Google Cloud**: Container deployment
- **Self-hosted**: Node.js server deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
\`\`\`


# clone the project
# git@github.com:qumberali22/product-search.git
# after cloning the project just go to the product-search directory and run this command
# docker compose up --build