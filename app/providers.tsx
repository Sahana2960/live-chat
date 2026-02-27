"use client";

import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { usePresence } from "@/lib/hooks/usePresence";
import { useSyncUserToConvex } from "@/lib/hooks/useSyncUserToConvex";

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL || ""
);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <ConvexProvider client={convex}>
        <AppRunners>{children}</AppRunners>
      </ConvexProvider>
    </ClerkProvider>
  );
}

function AppRunners({ children }: { children: ReactNode }) {
  // 1) Ensure the signed-in Clerk user exists in Convex `users`
  useSyncUserToConvex();

  // 2) Presence heartbeat for online/offline
  usePresence();
  return <>{children}</>;
}
