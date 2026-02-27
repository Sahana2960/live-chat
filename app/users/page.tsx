"use client";

import React from "react";
import { UserButton } from "@clerk/nextjs";
import UserList from "@/app/components/chat/UserList";
import ConversationList from "@/app/components/chat/ConversationList";

export default function UsersPage() {
  return (
    <div className="min-h-screen flex bg-white dark:bg-black">
      <ConversationList />
      <div className="flex-1 flex flex-col">
        <header className="border-b border-gray-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-black dark:text-white">Discover Users</h2>
          <UserButton afterSignOutUrl="/sign-in" />
        </header>
        <main className="flex-1 overflow-auto">
          <UserList />
        </main>
      </div>
    </div>
  );
}
