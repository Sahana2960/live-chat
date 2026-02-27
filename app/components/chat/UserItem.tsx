"use client";

import React from "react";
import Image from "next/image";

interface Props {
  name: string;
  email?: string;
  avatar?: string | null;
  onClick: () => void;
  online?: boolean;
}

export default function UserItem({ name, email, avatar, onClick, online }: Props) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-zinc-900 rounded-md text-left"
    >
      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-zinc-800 overflow-hidden relative">
        {avatar ? (
          <Image src={avatar} alt={name} width={40} height={40} />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center text-sm text-gray-600 dark:text-gray-300">{name?.[0]}</div>
        )}
        {typeof online !== "undefined" ? (
          <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ${online ? 'bg-green-400 ring-2 ring-white dark:ring-zinc-900' : 'bg-gray-400 ring-2 ring-white dark:ring-zinc-900'}`} />
        ) : null}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-900 dark:text-white">{name}</div>
        {email && <div className="text-xs text-gray-500 dark:text-gray-400">{email}</div>}
      </div>
    </button>
  );
}
