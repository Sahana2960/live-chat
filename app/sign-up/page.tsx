"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <SignUp
        routing="hash"
        appearance={{
          elements: {
            card: "bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800",
            formField: "mt-4",
            formFieldLabel: "text-sm font-medium text-gray-700 dark:text-gray-300",
            formFieldInput:
              "mt-1 w-full rounded-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-gray-900 dark:text-white placeholder-gray-400",
            submitButton:
              "w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors",
          },
        }}
      />
    </div>
  );
}
