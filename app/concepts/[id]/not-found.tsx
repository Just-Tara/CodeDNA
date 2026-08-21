import { EmptyState } from "@/components/ui/States";

export default function ConceptNotFound() {
  return (
    <div className="max-w-md mx-auto px-6 pt-32">
      <EmptyState
        title="Concept not found"
        message="This concept isn't in the graph, or the link is out of date."
        actionHref="/"
        actionLabel="Back to Explore"
      />
    </div>
  );
}
