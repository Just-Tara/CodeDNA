import { EmptyState } from "@/components/ui/States";

export default function TechNotFound() {
  return (
    <div className="max-w-md mx-auto px-6 pt-32">
      <EmptyState
        title="Technology not found"
        message="This technology isn't in the graph, or the link is out of date."
        actionHref="/technologies"
        actionLabel="Browse all technologies"
      />
    </div>
  );
}
