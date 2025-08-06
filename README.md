# Fusion Starter

A production-ready full-stack React application template with integrated Express server, featuring React Router 6 SPA mode, TypeScript, Vitest, Zod and modern tooling.

## Tech Stack

- **Frontend**: React 18 + React Router 6 (SPA) + TypeScript + Vite + TailwindCSS 3
- **Backend**: Express server integrated with Vite dev server
- **Testing**: Vitest
- **UI**: Radix UI + TailwindCSS 3 + Lucide React icons
- **State Management**: @tanstack/react-query
- **Form Handling**: react-hook-form + Zod validation
- **3D Support**: @react-three/fiber + drei
- **Animation**: framer-motion

## Project Structure

```
.
├── client/                   # React SPA frontend
│   ├── pages/                # Route components
│   ├── components/           # Reusable components
│   │   └── ui/               # Pre-built UI component library
│   ├── lib/                  # Utility functions
│   ├── hooks/                # Custom hooks
│   ├── App.tsx               # App entry point
│   └── global.css            # TailwindCSS theming and global styles
├── server/                   # Express API backend
│   ├── routes/               # API handlers
│   └── index.ts              # Main server setup
├── shared/                   # Types used by both client & server
│   └── api.ts                # Shared API interfaces
├── netlify/                  # Netlify configuration
│   └── functions/            # Serverless functions
├── public/                   # Static assets
└── tests/                    # Test files (Vitest)
```

## Key Features

### SPA Routing System
Powered by React Router 6:
```tsx
// client/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

<Routes>
  <Route path="/" element={<Index />} />
  <Route path="/chat" element={<Chat />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

### Styling System
- TailwindCSS 3 utility classes
- Theme configured in `client/global.css`
- Pre-built UI components in `client/components/ui/`
- `cn()` utility for conditional classes:
```ts
import { cn } from "@/lib/utils"

className={cn(
  "base-classes",
  { "conditional-class": condition },
  props.className
)}
```

### Express Server Integration
- Single port (8080) for both frontend/backend
- Hot reload for client and server code
- API endpoints prefixed with `/api/`

Example API route:
```ts
// server/routes/demo.ts
import { RequestHandler } from "express";
import { DemoResponse } from "@shared/api";

export const handleDemo: RequestHandler = (_, res) => {
  const response: DemoResponse = { message: "Hello from demo endpoint!" };
  res.json(response);
};
```

### Shared Types
Type-safe API communication:
```ts
// shared/api.ts
export interface DemoResponse {
  message: string;
}
```

Path aliases configured in `tsconfig.json`:
- `@/*` → `client/*`
- `@shared/*` → `shared/*`

## Development Commands

```bash
npm run dev        # Start dev server (client + server)
npm run build      # Production build
npm run start      # Start production server
npm test           # Run Vitest tests
npm run typecheck  # TypeScript validation
npm run format.fix # Format code with Prettier
```

## Adding Features

### New API Route
1. Create shared interface (optional):
```ts
// shared/api.ts
export interface MyRouteResponse {
  data: string;
}
```

2. Create route handler:
```ts
// server/routes/my-route.ts
import { RequestHandler } from "express";
import { MyRouteResponse } from "@shared/api";

export const handleMyRoute: RequestHandler = (_, res) => {
  const response: MyRouteResponse = { data: "New endpoint" };
  res.json(response);
};
```

3. Register route in `server/index.ts`:
```ts
import { handleMyRoute } from "./routes/my-route";

app.get("/api/my-route", handleMyRoute);
```

4. Use in React component:
```tsx
import { MyRouteResponse } from '@shared/api';

const fetchData = async () => {
  const res = await fetch('/api/my-route');
  const data: MyRouteResponse = await res.json();
  return data;
};
```

### New Page
1. Create component in `client/pages/NewPage.tsx`
2. Add route in `client/App.tsx`:
```tsx
<Route path="/new-page" element={<NewPage />} />
```

### Add Theme Colors
1. Add colors to `tailwind.config.ts`:
```ts
theme: {
  extend: {
    colors: {
      brand: {
        primary: '#0066ff',
        secondary: '#5c6ac4'
      }
    }
  }
}
```

2. Add CSS variables in `client/global.css`:
```css
:root {
  --brand-primary: #0066ff;
  --brand-secondary: #5c6ac4;
}
```

## Production Deployment

### Netlify Deployment
The project includes preconfigured Netlify settings:
- `netlify.toml` with build settings
- Serverless functions in `netlify/functions/`

Deploy by connecting your repository to Netlify.

### Standard Deployment
```bash
npm run build  # Build client and server
npm start      # Start production server
```

## Architecture Notes
- Single-port development with Vite + Express integration
- TypeScript throughout (client, server, shared)
- Full hot reload for rapid development
- Comprehensive UI component library included (Radix UI)
- Type-safe API communication via shared interfaces
- Netlify serverless functions support
- 3D visualization with Three.js