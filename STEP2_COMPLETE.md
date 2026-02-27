# ✅ STEP 2: AUTHENTICATION & BACKEND - COMPLETE

## What Was Done

### 1. **Clerk Installation & Setup**
✅ Installed `@clerk/nextjs`
✅ Created `app/providers.tsx` with Clerk + Convex providers
✅ Wrap app with `<ClerkProvider>` at root level
✅ Created sign-in page: `app/sign-in/page.tsx`
✅ Created sign-up page: `app/sign-up/page.tsx`

### 2. **Convex Installation & Database Schema**
✅ Installed `convex` package
✅ Created `convex/schema.ts` with 5 tables:
   - **users** - Store user profiles from Clerk
   - **conversations** - Track one-on-one chat rooms
   - **messages** - Store all messages with sender/context
   - **presence** - Track online/offline status
   - **typing** - Track who's typing in what conversation

### 3. **Convex Backend Functions**
✅ Created `convex/users.ts` with:
   - `getUserByClerkId()` - Query single user
   - `getAllUsers()` - Get all users for discovery
   - `createOrUpdateUser()` - Sync user from Clerk
   - `deleteUser()` - Clean up when user deletes account

### 4. **Clerk Webhook Handler**
✅ Created `app/api/webhooks/clerk/route.ts`
✅ Auto-syncs user data to Convex when:
   - User signs up (`user.created`)
   - User updates profile (`user.updated`)
   - User deletes account (`user.deleted`)
✅ Installed `svix` for webhook verification

### 5. **Home Page with Auth Check**
✅ Updated `app/page.tsx` with:
   - Show sign-in/sign-up buttons if not logged in
   - Show user's name and UserButton if logged in
   - Display dashboard scaffold

### 6. **UI Components**
✅ Created `app/components/ui/button.tsx` - Reusable button with variants

### 7. **Environment Variables**
✅ Updated `.env.example` with all required keys including webhook secret

## Architecture Explanation

### **How Clerk + Convex Work Together**

```
User Signs Up
    ↓
Clerk creates user + sends webhook
    ↓
Webhook handler receives event
    ↓
Call convex.mutation("users:createOrUpdateUser", {...})
    ↓
User data stored in Convex database
    ↓
App queries users from Convex (not Clerk)
```

**Why this architecture?**
- Clerk = Authentication (sign-in/sign-up/sessions/security)
- Convex = Database (real-time subscriptions, relationships with messages)
- Webhooks = Sync mechanism (one-way flow from Clerk → Convex)

### **Key Files & Their Purposes**

| File | Purpose | Key Concept |
|------|---------|-------------|
| `app/providers.tsx` | Wraps app with Clerk & Convex | Client-side context providers |
| `app/sign-in/page.tsx` | Clerk's pre-built sign-in UI | No custom auth logic needed |
| `app/sign-up/page.tsx` | Clerk's pre-built sign-up UI | Triggers webhook on success |
| `convex/schema.ts` | Database table definitions | Tables are auto-created |
| `convex/users.ts` | User queries & mutations | Safe server-side operations |
| `app/api/webhooks/clerk/route.ts` | Listens for Clerk events | Syncs data to Convex |

## Code Logic Breakdown

### **Schema - Why These Tables?**

```typescript
// Users table
{
  clerkId: string,        // Link to Clerk account
  email: string,          // For search
  name: string,           // Display name
  avatar: string,         // Profile picture URL
  createdAt: number       // Timestamp
}

// Conversations table
{
  participantIds: [],     // Array of 2 user IDs (one-on-one)
  createdAt: number,      // When conversation started
  lastMessageAt: number   // For sorting in UI
}

// Messages table
{
  conversationId: id,     // Which conversation
  senderId: id,           // Who sent it
  text: string,           // Message content
  createdAt: number       // When sent
}

// Presence table (real-time status)
{
  userId: id,             // Which user
  isOnline: boolean,      // Online/offline
  lastSeen: number        // Last activity timestamp
}

// Typing table (real-time indicators)
{
  conversationId: id,     // Which conversation
  userId: id,             // Who's typing
  expiresAt: number       // Auto-delete after 2 seconds
}
```

### **Why Indexes?**
Queries like "get user by clerkId" are slow without indexes. We add:
- `.index("by_clerkId", ["clerkId"])` - Fast lookup by Clerk ID
- `.index("by_participants", ["participantIds"])` - Find conversation between 2 users
- `.index("by_conversationId", ["conversationId"])` - Get all messages in a chat

### **Webhook Handler Logic**

```typescript
// 1. Verify signature (security - ensure it's really Clerk)
const evt = wh.verify(body, {headers}) // Throws if invalid

// 2. Extract user data from event
const { id, email, first_name, image_url } = evt.data

// 3. Call Convex mutation to sync
convex.mutation("users:createOrUpdateUser", {
  clerkId: id,
  email: email,
  name: first_name,
  avatar: image_url
})

// Why? User data now lives in Convex, allowing real-time subscriptions
```

## Setup Required (You Must Do This)

### 1. **Clerk Setup**
- Go to https://clerk.com
- Create account & new application
- Copy keys to `.env.local`:
  ```
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
  CLERK_SECRET_KEY=sk_live_...
  CLERK_WEBHOOK_SECRET=whsec_...
  ```
- Add webhook endpoint: `https://yourapp.com/api/webhooks/clerk`

### 2. **Convex Setup**
- Go to https://convex.dev
- Create account & new project
- Copy URL to `.env.local`:
  ```
  NEXT_PUBLIC_CONVEX_URL=https://...convex.cloud
  ```
- Run `npx convex deploy --cmd 'npm run dev'` to push schema

### 3. **.env.local File**
```bash
# Copy from .env.example and fill in your keys
cp .env.example .env.local
# Edit .env.local with real values from Clerk & Convex
```

## Testing

1. Start dev server: `npm run dev`
2. Visit `http://localhost:3000`
3. Click "Sign Up"
4. Enter email, password, name
5. Should redirect to home page
6. Should see your name (from Clerk)
7. In Clerk dashboard → Users, should see your account
8. In Convex dashboard → Data, should see your user in the `users` table

## What Changed in Dependencies

```json
{
  "dependencies": {
    "@clerk/nextjs": "^5.8.0",   // NEW - Authentication
    "convex": "^1.14.0",          // NEW - Backend
    "svix": "^1.17.0"             // NEW - Webhook verification
  }
}
```

## Next (STEP 3)

We now have:
✅ Users can sign up/sign in
✅ User profiles stored in Convex
✅ Authentication session management

Next step: **User Discovery & Friend List**
- Show all users except yourself
- Search by name
- Click to start conversation

---

**Status**: ✅ **STEP 2 COMPLETE**  
**Ready for**: STEP 3 - User List & Search

---
