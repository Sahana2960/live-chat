"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ConversationList from "@/app/components/chat/ConversationList";
import MessageList from "@/app/components/chat/MessageList";
import MessageInput from "@/app/components/chat/MessageInput";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.conversationId;
  const conversationId = (Array.isArray(rawId) ? rawId[0] : rawId) ?? "";
  const resetUnread = useMutation(api.unreads.resetUnread);
  const { user } = useUser();

  useEffect(() => {
    if (conversationId && user) {
      resetUnread({
        conversationId: conversationId as Id<"conversations">,
        clerkId: user.id,
      }).catch(() => {});
    }
  }, [conversationId, user, resetUnread]);

  if (!conversationId) return <div>Invalid conversation</div>;

  return (
    <div className="min-h-screen flex bg-white dark:bg-black">
      <div className="hidden md:block">
        <ConversationList />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-gray-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between">
          <button onClick={() => router.push('/users')} className="text-sm text-blue-600">Back</button>
          <div className="text-sm font-semibold">Conversation</div>
          <div />
        </header>
        <MessageList conversationId={conversationId} />
        <MessageInput conversationId={conversationId} />
      </div>
    </div>
  );
}
