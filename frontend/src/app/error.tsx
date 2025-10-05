"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, RefreshCcwIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("Error:", error);
  }, [error]);
const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center space-y-4">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="text-gray-500">{error.message || "Please try again later."}</p>
      <div className="flex justify-center items-center gap-4">
        <Button
          onClick={() => router.back()}
          className="hover:text-white"
          variant={"outline"}
        >
          <ArrowLeftIcon className="size-4" />
          Go back
        </Button>
      <Button
        onClick={() => reset()}
        variant={"default"}
      >
        <RefreshCcwIcon className="size-4" />
        Try again
      </Button>
      </div>
    </div>
  );
}
