import { BackButton } from "@/components/ui/Primitives";
import { ProjectCard } from "@/components/ProjectCard";
import { EmptyState } from "@/components/ui/States";
import { listProjects } from "@/lib/service";

export const metadata = { title: "All Projects — CodeDNA" };

export default async function ProjectsIndexPage() {
  const projects = await listProjects();

  return (
    <div className="max-w-5xl mx-auto px-6 pt-12 pb-32">
      <BackButton href="/" />
      <h1 className="text-2xl font-semibold mb-1 text-ink">All Projects</h1>
      <p className="text-sm mb-8 text-muted-dim">{projects.length} projects mapped</p>

      {projects.length === 0 ? (
        <EmptyState title="No projects found" message="Try again shortly." actionHref="/" actionLabel="Back to Explore" />
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
