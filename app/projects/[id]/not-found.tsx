import { EmptyState } from "@/components/ui/States";

export default function ProjectNotFound() {
  return (
    <div className="max-w-md mx-auto px-6 pt-32">
      <EmptyState
        title="Project not found"
        message="This project may have been removed from the graph, or the link is out of date."
        actionHref="/projects"
        actionLabel="Browse all projects"
      />
    </div>
  );
}
