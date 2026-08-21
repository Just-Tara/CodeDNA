import { notFound } from "next/navigation";
import { BackButton } from "@/components/ui/Primitives";
import { ProjectCard } from "@/components/ProjectCard";
import { getProjectDetail, listProjects } from "@/lib/service";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getProjectDetail(id);
  if (!detail) return { title: "Project not found — CodeDNA" };
  return { title: `Compare ${detail.project.name} — CodeDNA` };
}

export default async function CompareSelectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [detail, allProjects] = await Promise.all([getProjectDetail(id), listProjects()]);
  if (!detail) notFound();

  const candidates = allProjects.filter((p) => p.id !== id);

  return (
    <div className="max-w-2xl mx-auto px-6 pt-12 pb-32">
      <BackButton href={`/projects/${id}`} />
      <div className="text-xs uppercase tracking-wide mb-1 text-muted-dim">
        Compare {detail.project.name} with
      </div>
      <h1 className="text-2xl font-semibold mb-8 text-ink">Choose a project</h1>
      <div className="grid sm:grid-cols-2 gap-3">
        {candidates.map((p) => (
          <ProjectCard key={p.id} project={p} href={`/compare?a=${id}&b=${p.id}`} />
        ))}
      </div>
    </div>
  );
}
