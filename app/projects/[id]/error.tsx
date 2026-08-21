"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/States";

export default function ProjectError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      message="Something went wrong. Please try again."
      onRetry={reset}
    />
  );
}
