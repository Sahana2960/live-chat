"use client";

import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTyping } from "@/lib/hooks/useTyping";

export default function MessageInput({ conversationId }: { conversationId: string }) {
  const { user } = useUser();
  const createMessage = useMutation(api.messages.createMessage);
  const [text, setText] = useState("");
  const { startTyping, stopTyping } = useTyping();

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    if (!text.trim() || !user) return;
    await createMessage({ conversationId, senderClerkId: user.id, text: text.trim() });
    setText("");
    // clear typing state on send
    stopTyping(conversationId, user.id);
  }

  return (
    <form onSubmit={handleSend} className="border-t border-gray-200 dark:border-zinc-800 p-4 flex gap-2">
      <input
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          // emit typing on keypress
          if (user) startTyping(conversationId, user.id);
        }}
        placeholder="Type a message"
        className="flex-1 rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-white">Send</button>
    </form>
  );
}
