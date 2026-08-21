import { EmptyState } from "@/components/ui/States";

export default function GlobalNotFound() {
  return (
    <div className="max-w-md mx-auto px-6 pt-32">
      <EmptyState
        title="Page not found"
        message="That page doesn't exist in the graph."
        actionHref="/"
        actionLabel="Back to Explore"
      />
    </div>
  );
}
