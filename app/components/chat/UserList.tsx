"use client";

import React, { useMemo, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import UserItem from "./UserItem";
import { useRouter } from "next/navigation";

export default function UserList() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const users = useQuery(api.users.getAllUsers);
  const presences = useQuery(api.presence.getAllPresence);
  const getOrCreateConversation = useMutation(api.conversations.getOrCreateConversation);

  const [q, setQ] = useState("");

  const currentClerkId = user?.id;

  const filtered = useMemo(() => {
    if (!users) return [];
    return users
      .filter((u: any) => u.clerkId !== currentClerkId)
      .filter((u: any) => {
        if (!q) return true;
        return (u.name || "").toLowerCase().includes(q.toLowerCase());
      });
  }, [users, q, currentClerkId]);

  const presenceMap = React.useMemo(() => {
    const map: Record<string, any> = {};
    if (!presences) return map;
    for (const p of presences) {
      if (p?.clerkId) map[p.clerkId] = p;
    }
    return map;
  }, [presences]);

  async function handleClick(targetClerkId: string) {
    if (!currentClerkId) return;
    // participants are clerk IDs
    const convoId = await getOrCreateConversation({ participantIds: [currentClerkId, targetClerkId] });
    // navigate to chat page
    router.push(`/chat/${convoId}`);
  }

  if (!isLoaded) return <div>Loading user...</div>;

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search users..."
          className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-sm text-gray-500">No users found.</div>
        )}

        {filtered.map((u: any) => (
          <UserItem
            key={u._id}
            name={u.name || u.email || "Unknown"}
            email={u.email}
            avatar={u.avatar}
            online={Boolean(presenceMap[u.clerkId]?.isOnline)}
            onClick={() => handleClick(u.clerkId)}
          />
        ))}
      </div>
    </div>
  );
}
