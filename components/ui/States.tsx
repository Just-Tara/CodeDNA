import Link from "next/link";
import { RefreshCw, SearchX, X } from "lucide-react";
import { ActionButton } from "./Primitives";

export function EmptyState({
  title = "No results found.",
  message = "Try searching for another project, technology, or concept.",
  actionHref,
  actionLabel = "Clear search",
}: {
  title?: string;
  message?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="text-center py-16">
      <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 bg-elevated border border-border">
        <SearchX size={16} className="text-muted-dim" />
      </div>
      <div className="text-base font-medium mb-1.5 text-ink">{title}</div>
      <div className="text-sm text-muted-dim mb-5">{message}</div>
      {actionHref && (
        <Link
          href={actionHref}
          className="text-sm font-medium px-4 py-2 rounded-lg inline-flex items-center gap-1.5 bg-accent text-bg hover:opacity-85 transition-opacity"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

//component for error state

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this entity's DNA. Please try again.",
  onRetry,
  homeHref = "/",
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
  homeHref?: string;
}) {
  return (
    <div className="max-w-md mx-auto px-6 pt-32 text-center">
      <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5 bg-danger/10 border border-danger/30">
        <X size={18} className="text-danger" />
      </div>
      <div className="text-base font-medium mb-2 text-ink">{title}</div>
      <div className="text-sm text-muted-dim mb-6">{message}</div>
      <div className="flex items-center justify-center gap-2">
        {onRetry && <ActionButton icon={RefreshCw} primary onClick={onRetry}>Retry</ActionButton>}
        <Link
          href={homeHref}
          className="text-sm font-medium px-4 py-2 rounded-lg border border-border text-ink hover:opacity-85 transition-opacity"
        >
          Back to Explore
        </Link>
      </div>
    </div>
  );
}
