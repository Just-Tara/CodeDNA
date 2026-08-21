"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/States";

export default function TechnologyError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorState message="We couldn't load this technology's DNA. Please try again." onRetry={reset} />;
}
