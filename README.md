# Wheelswise Next.js Frontend

This is the Next JS frontend of the Wheelswise frontend

## Project Overview

This project uses Next.js, Tailwind and TypeScript and pnpm as a package manager.

## Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Run the development server:
```bash
pnpm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_API_BASE_URL=your_api_base_url
```

## Build and Deploy

```bash
# Build for production
pnpm run build

# Start production server
pnpm start
```

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Framer Motion** - Animation library
- **Axios** - HTTP client for API calls