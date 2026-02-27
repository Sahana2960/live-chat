# PROJECT STRUCTURE DOCUMENTATION

## Folder Layout

```
tars/
├── app/                           # Next.js App Router
│   ├── components/
│   │   ├── ui/                   # Reusable UI components (Button, Input, etc.)
│   │   └── chat/                 # Chat-specific components
│   ├── chat/                     # Chat page routes (e.g., [conversationId])
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Home page
│   ├── globals.css               # Global styles
│   └── favicon.ico
├── lib/
│   ├── hooks/                    # Custom React hooks (useMessages, usePresence, etc.)
│   └── utils/                    # Utility functions (date formatting, etc.)
├── types/                        # TypeScript type definitions
├── convex/                       # Convex backend code (schema, functions, actions)
├── public/                       # Static assets
├── .env.example                  # Environment variable template
├── .env.local                    # Local environment variables (NOT in git)
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── postcss.config.mjs            # PostCSS configuration
├── package.json
└── README.md
```

## Design Decisions

### 1. **app/ Directory (Next.js App Router)**
- Uses Next.js App Router (not Pages Router) for better performance and modern features
- `components/` subdirectory keeps UI organized
- `chat/` subdirectory for chat-related routes (will use dynamic routes later)
- Server Components by default (better performance), Client Components only where needed

### 2. **lib/ Directory**
- Contains reusable logic separate from components
- `hooks/`: Custom hooks for fetching data, managing subscriptions, presence tracking
- `utils/`: Pure functions (date formatting, message filtering, etc.)
- This keeps components clean and logic testable

### 3. **types/ Directory**
- All TypeScript interfaces in one place for consistency
- Single source of truth for data shapes
- Easy to reference across the app

### 4. **convex/ Directory**
- Backend database schema and functions
- Queries (fetch data)
- Mutations (create/update/delete)
- Actions (long-running tasks, external APIs)
- Subscriptions (real-time, reactive data)

### 5. **Component Organization**
- `ui/` : Presentational components (Button, Input, Modal)
- `chat/` : Feature components (ConversationList, MessageList, etc.)
- Each component is self-contained with props only, no direct data fetching

### 6. **Styling Strategy**
- Tailwind CSS for all styling (no CSS-in-JS)
- Global styles in `globals.css` for resets
- Component styles inline or with Tailwind classes
- shadcn/ui ready (copy/paste component library)

### 7. **Environment Variables**
- `.env.local` for development (NEVER committed)
- `.env.example` as template for team
- `NEXT_PUBLIC_*` prefix for client-side variables only
- Convex and Clerk keys stored securely

## Why This Structure?

✅ **Scalability**: Easy to add new features without cluttering root
✅ **Maintainability**: Clear separation of concerns
✅ **Testability**: Logic in `lib/` is easy to test independently
✅ **Clean Imports**: Path aliases with `@/` make imports readable
✅ **Team Communication**: New team members understand the structure immediately

## Next Steps (STEP 2)
- Install Clerk for authentication
- Install Convex SDK
- Set up environment variables
- Create Clerk authentication UI
