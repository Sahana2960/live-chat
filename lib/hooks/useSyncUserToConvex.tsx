"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useSyncUserToConvex() {
  const { user, isLoaded, isSignedIn } = useUser();
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);
  const didSyncRef = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    if (didSyncRef.current) return;

    didSyncRef.current = true;

    const email = user.primaryEmailAddress?.emailAddress ?? "";
    const name =
      user.fullName?.trim() ||
      `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
      email ||
      user.id;

    createOrUpdateUser({
      clerkId: user.id,
      email,
      name,
      avatar: user.imageUrl,
    }).catch(() => {
      // If it fails (e.g. Convex not running yet), allow retry on next render.
      didSyncRef.current = false;
    });
  }, [isLoaded, isSignedIn, user, createOrUpdateUser]);
}

