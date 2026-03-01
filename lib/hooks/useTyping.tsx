"use client";

import { useCallback, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const TYPING_TIMEOUT = 3000; // 3 seconds

export function useTyping() {
  const setTyping = useMutation(api.typing.setTyping);
  const clearTyping = useMutation(api.typing.clearTyping);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const startTyping = useCallback(
    (conversationId: Id<"conversations">, userId: string) => {
      // Clear existing timeout
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }

      // Set typing status with expiration
      setTyping({
        conversationId,
        clerkId: userId,
        expiresAt: Date.now() + TYPING_TIMEOUT,
      });

      // Set timeout to clear typing status
      typingTimeout.current = setTimeout(() => {
        clearTyping({
          conversationId,
          clerkId: userId,
        });
      }, TYPING_TIMEOUT);
    },
    [setTyping, clearTyping]
  );

  const stopTyping = useCallback(
    (conversationId: Id<"conversations">, userId: string) => {
      // Clear timeout
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }

      // Immediately clear typing status
      clearTyping({
        conversationId,
        clerkId: userId,
      });
    },
    [clearTyping]
  );

  return { startTyping, stopTyping };
}
