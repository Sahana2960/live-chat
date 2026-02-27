"use client";

import { useRef, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const TYPING_TIMEOUT = 2000; // 2 seconds

export function useTyping() {
  const setTyping = useMutation(api.typing.setTyping);
  const clearTyping = useMutation(api.typing.clearTyping);
  const timeoutRef = useRef<number | null>(null);

  const startTyping = useCallback(
    (conversationId: string, clerkId: string) => {
      if (!conversationId || !clerkId) return;
      const expiresAt = Date.now() + TYPING_TIMEOUT;
      // send typing event
      setTyping({ conversationId, clerkId, expiresAt }).catch(() => {});

      // reset local timeout to clear typing after inactivity
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        clearTyping({ conversationId, clerkId }).catch(() => {});
        timeoutRef.current = null;
      }, TYPING_TIMEOUT + 200);
    },
    [setTyping, clearTyping]
  );

  const stopTyping = useCallback((conversationId: string, clerkId: string) => {
    if (!conversationId || !clerkId) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    clearTyping({ conversationId, clerkId }).catch(() => {});
  }, [clearTyping]);

  return { startTyping, stopTyping };
}
