"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/users");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <main className="flex flex-col items-center justify-center text-center gap-6 py-32 px-16">
          <h1 className="text-4xl font-bold text-black dark:text-white">
            🚀 Live Chat App
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md">
            Real-time one-on-one messaging with Clerk, Convex, and Next.js.
          </p>
          <div className="flex gap-4">
            <Link href="/sign-in">
              <Button>Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="outline">Sign Up</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return null;
}
