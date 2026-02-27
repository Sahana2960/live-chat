# Live Chat App

Real-time one-on-one chat built with **Next.js (App Router)**, **TypeScript**, **Convex**, **Clerk**, and **Tailwind CSS**.

---

## How to run

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Create a `.env.local` in the project root with:

```env
# Clerk (get from https://dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# Convex (get after step 3)
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

For production (e.g. Vercel), also set:

```env
CLERK_WEBHOOK_SECRET=whsec_...
```

### 3. Convex

- Install Convex CLI if needed: `npm install -g convex`
- Log in: `npx convex login`
- Create/link a Convex project: `npx convex dev` (creates project if needed and prints the deployment URL)
- Copy the Convex URL into `.env.local` as `NEXT_PUBLIC_CONVEX_URL`

### 4. Clerk webhook (so users sync to Convex)

- In [Clerk Dashboard](https://dashboard.clerk.com) → Webhooks: add endpoint  
  - **URL**: `https://your-domain.com/api/webhooks/clerk` (for local dev use a tunnel like ngrok)
  - **Events**: `user.created`, `user.updated`, `user.deleted`
- Set the signing secret as `CLERK_WEBHOOK_SECRET` in `.env.local`

Without the webhook, new sign-ups won’t appear in Convex until you configure it (or you can sync users another way).

### 5. Run the app

**Terminal 1 – Convex (schema + functions):**

```bash
npx convex dev
```

**Terminal 2 – Next.js:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up or sign in, then use “Discover Users” to start a conversation.

### 6. Deploy to Vercel

- Push to GitHub and import the repo in Vercel.
- Add env vars: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CONVEX_URL`, `CLERK_WEBHOOK_SECRET`.
- Set Clerk webhook URL to `https://your-app.vercel.app/api/webhooks/clerk`.
- Deploy. Convex is already deployed separately via `npx convex dev` (or `npx convex deploy` for prod).

---

## Verification checklist

Use this to confirm all required behavior:

- [ ] **Auth**: Sign up, sign in, sign out work; name/avatar shown (e.g. via `UserButton`).
- [ ] **User list**: All users except current user; live search by name; clicking a user opens or creates a conversation.
- [ ] **Real-time chat**: Messages appear live (no refresh); conversation list shows last message preview.
- [ ] **Timestamps**: Today = time only (e.g. 2:34 PM); same year = “Feb 15, 2:34 PM”; other year = “Feb 15, 2024, 2:34 PM”.
- [ ] **Empty states**: No blank screens — “No conversations yet”, “No messages yet”, “No users found” where relevant.
- [ ] **Layout**: Desktop = sidebar (conversations) + main area; mobile = chat full screen with Back to list.
- [ ] **Presence**: Green dot when user is online; updates when app is opened/closed.
- [ ] **Typing**: “Someone is typing…” (or similar); shows on keypress; hides after ~2s inactivity and on send.
- [ ] **Unread**: Badge per conversation; increments when new message arrives; resets when conversation is opened.

---

## Loom video suggestions

- **Best feature to explain**: **Real-time flow** — show Convex subscriptions (e.g. `useQuery` for messages and conversations), how the UI updates without refresh when the other user sends a message or types, and briefly how presence/typing work.
- **Small live demo**: Add a “last seen” under the green dot (e.g. “Last seen 2m ago”) using `presence.lastSeen` and `formatTimestamp`, or change the typing text to “Alice is typing…” by resolving the typing user’s name from `users` and `typing.userId` (clerkId).
