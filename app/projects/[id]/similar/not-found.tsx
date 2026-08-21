import { EmptyState } from "@/components/ui/States";

export default function SimilarNotFound() {
  return (
    <div className="max-w-md mx-auto px-6 pt-32">
      <EmptyState
        title="Project not found"
        message="We can't find similar projects for a project that doesn't exist."
        actionHref="/projects"
        actionLabel="Browse all projects"
      />
    </div>
  );
}
