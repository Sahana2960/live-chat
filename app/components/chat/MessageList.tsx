"use client";

import React, { useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { formatTimestamp } from "@/lib/utils/formatTimestamp";

export default function MessageList({ conversationId }: { conversationId: string }) {
  const messages = useQuery(api.messages.getMessagesByConversation, { conversationId });
  const { user } = useUser();
  const ref = useRef<HTMLDivElement | null>(null);
  const typing = useQuery(api.typing.getTypingForConversation, { conversationId });

  useEffect(() => {
    // scroll to bottom on new messages
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={ref} className="flex-1 overflow-auto p-4 space-y-3">
      {!messages || messages.length === 0 ? (
        <div className="text-sm text-gray-500">No messages yet. Say hello 👋</div>
      ) : (
        messages.map((m: any) => {
          const mine = m.senderId === user?.id;
          return (
            <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`${mine ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white"} rounded-lg px-3 py-2 max-w-[70%]`}>
                <div className="text-sm">{m.text}</div>
                <div className="text-xs text-gray-400 mt-1 text-right">{formatTimestamp(m.createdAt)}</div>
              </div>
            </div>
          );
        })
      )}
      {typing && typing.length > 0 && (
        <div className="px-4 py-2">
          <div className="text-sm text-gray-500">Someone is typing…</div>
        </div>
      )}
    </div>
  );
}
