"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const HEARTBEAT_INTERVAL = 15000; // 15 seconds

export function usePresence() {
  const { user, isLoaded } = useUser();
  const setOnline = useMutation(api.presence.setPresenceOnline);
  const setOffline = useMutation(api.presence.setPresenceOffline);
  const touch = useMutation(api.presence.touchPresence);

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    const clerkId = user.id;

    // Set online immediately
    setOnline({ clerkId }).catch(console.error);

    // Start heartbeat
    intervalRef.current = window.setInterval(() => {
      touch({ clerkId }).catch(console.error);
    }, HEARTBEAT_INTERVAL);

    function handleBeforeUnload() {
      // best-effort set offline
      try {
        // synchronous navigator.sendBeacon could be used; best-effort here
        setOffline({ clerkId });
      } catch (e) {
        // noop
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        setOffline({ clerkId }).catch(() => {});
      } else {
        setOnline({ clerkId }).catch(() => {});
      }
    });

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      try {
        setOffline({ clerkId });
      } catch (e) {}
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isLoaded, user, setOnline, setOffline, touch]);
}
