import { EmptyState } from "@/components/ui/States";

export default function CompareNotFound() {
  return (
    <div className="max-w-md mx-auto px-6 pt-32">
      <EmptyState
        title="Couldn't compare these projects"
        message="One or both projects couldn't be found. Try picking again."
        actionHref="/projects"
        actionLabel="Browse all projects"
      />
    </div>
  );
}
