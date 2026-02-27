# TECH STACK REFERENCE

## Core Dependencies

### Framework
- **Next.js 16.1.6** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript 5** - Type safety

### Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **Post CSS 4** - CSS preprocessing

### Authentication (TO BE ADDED - STEP 2)
- **@clerk/nextjs** - Authentication provider
- **@clerk/react** - Clerk React components

### Backend & Database (TO BE ADDED - STEP 2)
- **convex** - Backend, database, and real-time subscriptions
- **convex/react** - React hooks for Convex

### UI Components (OPTIONAL - Can use shadcn/ui)
- Install individual components when needed
- Command: `npx shadcn-ui@latest add button`

### Additional Tools
- **ESLint 9** - Code linting
- **Node.js 20.18+** - Runtime

## Package.json Scripts

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run ESLint
```

## Environment Variables

### Clerk (Authentication)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Public key
- `CLERK_SECRET_KEY` - Secret key
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` - Sign in page route
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL` - Sign up page route
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` - Redirect after sign in
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` - Redirect after sign up

### Convex (Backend)
- `NEXT_PUBLIC_CONVEX_URL` - Your Convex deployment URL
- `CONVEX_DEPLOYMENT` - Deployment name (dev/prod)

### Application
- `NEXT_PUBLIC_APP_URL` - App URL for redirects

## Key Commands (STEP 2)

```bash
# Install Clerk
npm install @clerk/nextjs

# Install Convex
npm install convex
npx convex init

# Initialize Convex in project
npx convex dev
```

## Folder Structure Summary
- `app/` - Next.js App Router pages and layouts
- `app/components/` - Reusable React components
- `lib/` - Utilities and custom hooks
- `types/` - TypeScript type definitions
- `convex/` - Backend schema, queries, and mutations
- `public/` - Static files

## Deployment
- Target: Vercel (free tier supports deployment)
- Database: Convex (cloud-hosted)
- Authentication: Clerk (managed service)
- All required services have generous free tiers
