"use client";

import React, { useMemo } from "react";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/convex/_generated/api";
import { formatTimestamp } from "@/lib/utils/formatTimestamp";

export default function ConversationList() {
  const { user, isLoaded } = useUser();
  const conversations = useQuery(api.messages.getConversationsForUser, user?.id ? { clerkId: user.id } : "skip");
  const unread = useQuery(api.unreads.getUnreadCountsForUser, user?.id ? { clerkId: user.id } : "skip");
  const presences = useQuery(api.presence.getAllPresence);
  const allUsers = useQuery(api.users.getAllUsers);

  const userMap = useMemo(() => {
    const m: Record<string, any> = {};
    if (!allUsers) return m;
    for (const u of allUsers) {
      if (u?.clerkId) m[u.clerkId] = u;
    }
    return m;
  }, [allUsers]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="w-80 border-r border-gray-200 dark:border-zinc-800 p-4">
      <h3 className="text-sm font-semibold mb-3">Conversations</h3>
      <div className="space-y-2">
        {!conversations || conversations.length === 0 ? (
          <div className="text-sm text-gray-500">No conversations yet.</div>
        ) : (
          conversations.map((c: any) => {
            const other = (c.participantIds || []).find((p: string) => p !== user?.id) || "";
            const presence = (presences || []).find((p: any) => p.clerkId === other);
            const unreadMap: Record<string, number> = (unread || []).reduce((acc: any, item: any) => {
              acc[item.conversationId] = item.count || 0;
              return acc;
            }, {} as Record<string, number>);
            const unreadCount = unreadMap[c._id] || 0;
            const otherUser = userMap[other];
            const displayName = otherUser?.name || other;
            const avatar = otherUser?.avatar;
            return (
              <Link key={c._id} href={`/chat/${c._id}`} className="block p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gray-200 dark:bg-zinc-800">
                      {avatar ? (
                        <Image src={avatar} alt={displayName} width={32} height={32} />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center text-sm text-gray-600 dark:text-gray-300">{displayName?.[0]}</div>
                      )}
                      <span className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ${presence?.isOnline ? 'bg-green-400' : 'bg-gray-400'}`} />
                    </div>
                    <div className="text-sm font-medium">{displayName}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-gray-500">{c.lastMessageAt ? formatTimestamp(c.lastMessageAt) : ""}</div>
                    {unreadCount > 0 && (
                      <div className="inline-flex items-center justify-center h-6 min-w-[24px] px-2 rounded-full bg-red-500 text-white text-xs font-semibold">
                        {unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
