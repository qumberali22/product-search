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

## Getting Started

### Prerequisites

- Node.js 18+
- Docker (for containerized setup)

### Installation

#### Option 1: Docker Setup (Recommended)

\`\`\`bash
git clone git@github.com:qumberali22/product-search.git
cd product-search
docker compose up --build
\`\`\`

#### Option 2: Local Development

Clone the repository:

\`\`\`bash
git clone <repository-url>
cd product-search-app
\`\`\`

Install dependencies:

\`\`\`bash
npm install

# or

yarn install
\`\`\`

Run the development server:

\`\`\`bash
npm run dev

# or

yarn dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## CSV Data Format

The application expects CSV data with the following columns:

- **ID**: Unique product identifier
- **TITLE**: Product name
- **HANDLE**: URL-friendly product identifier
- **DESCRIPTION**: Product description
- **VENDOR**: Product vendor/brand
- **PRODUCT_TYPE**: Category of the product
- **STATUS**: Product status (ACTIVE, ARCHIVED, DRAFT)
- **FEATURED_IMAGE**: URL to product image
- **PRICE_MIN**: Minimum price
- **PRICE_MAX**: Maximum price
- **CURRENCY**: Currency code
- **TOTAL_INVENTORY**: Stock quantity
- **HAS_OUT_OF_STOCK_VARIANTS**: Boolean for stock status
- **CREATED_AT**: Creation timestamp
- **UPDATED_AT**: Last update timestamp
- **TAGS**: Comma-separated tags for SEO

## Search Features

### Text Search

- Searches across product title, vendor, and tags
- Supports multi-word queries
- Case-insensitive matching

### Filters

- **Vendor**: Filter by specific brands/vendors
- **Product Type**: Filter by product categories
- **Price Range**: Adjustable price range slider
- **Stock Status**: Show only in-stock items

### Sorting Options

- **Title A–Z**: Alphabetical sorting
- **Price: Low to High**: Sort by ascending price
- **Price: High to Low**: Low to high or high to low
- **Oldest First**: Sort by oldest products

## Overview of Search Implementation

### Implemented Search Functionality

- Title
- Vendor

### Additional Features

- **Sorting**: Organize data efficiently
- **Filters**:
  - Price
  - Vendor
  - Keyword Search
- **Delete Button**: Clears all loaded data to reset the dashboard

## Technical Decisions and Trade-offs

### Frontend Framework (React with Next.js)

- **Decision**: Used Next.js for building the UI
- **Reason**: Component-based architecture makes the app modular and maintainable
- **Trade-off**: Requires more setup (state management, hooks) than simpler frameworks, but offers better scalability

### Search Implementation

- **Decision**: Implemented client-side search for Title and Vendor fields
- **Benefit**: Instant feedback without API calls
- **Trade-off**: May not scale well for large datasets. Server-side search with pagination is recommended for larger data

### Docker for Local Setup

- **Decision**: Used Docker Compose for containerizing the application
- **Benefit**: Ensures consistent setup across environments
- **Trade-off**: Adds some initial complexity during setup

## Screenshots / Demo

Watch the demo video

## Customization

### Adding New Product Fields

1. Update the `Product` interface in `src/types/product.d.ts`
2. Modify the CSV parsing logic in `src/lib/data.ts`
3. Update the product card component to display new fields

### Modifying Search Logic

The search logic is contained in `src/lib/search.ts`. You can:

- Adjust search scoring algorithms
- Add new filter types
- Implement fuzzy search improvements

### Styling Customization

- Global styles: `src/app/globals.css`
- Component styles: Individual component files using Tailwind classes
- Theme customization: `tailwind.config.ts`


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
