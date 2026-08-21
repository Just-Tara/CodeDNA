import { EmptyState } from "@/components/ui/States";

export default function DeveloperNotFound() {
  return (
    <div className="max-w-md mx-auto px-6 pt-32">
      <EmptyState
        title="Developer not found"
        message="This contributor isn't in the graph, or the link is out of date."
        actionHref="/developers"
        actionLabel="Browse all developers"
      />
    </div>
  );
}
