import { notFound } from "next/navigation";
import { BackButton } from "@/components/ui/Primitives";
import { getSimilarProjects } from "@/lib/service";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getSimilarProjects(id);
  if (!data) return { title: "Project not found — CodeDNA" };
  return { title: `Similar to ${data.project.name} — CodeDNA` };
}

export default async function SimilarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getSimilarProjects(id);
  if (!data) notFound();
  const { project, results } = data;

  return (
    <div className="max-w-3xl mx-auto px-6 pt-12 pb-32">
      <BackButton href={`/projects/${project.id}`} />
      <div className="text-xs uppercase tracking-wide mb-1 text-muted-dim">Projects similar to</div>
      <h1 className="text-2xl font-semibold mb-8 text-ink">{project.name}</h1>

      <div className="space-y-3">
        {results.length === 0 && (
          <div className="text-sm text-muted-dim">No related projects found yet.</div>
        )}
        {results.map((r) => (
          <a
            key={r.project.id}
            href={`/projects/${r.project.id}`}
            className="w-full text-left p-5 rounded-xl block bg-surface border border-border hover:opacity-85 transition-opacity"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-base font-semibold text-ink">{r.project.name}</div>
              <div className="text-sm font-semibold text-accent">{r.percent}% similar</div>
            </div>
            <div className="text-xs text-muted-dim">
              {r.sharedTechIds.length} shared technolog{r.sharedTechIds.length === 1 ? "y" : "ies"} ·{" "}
              {r.sharedConceptIds.length} shared concept{r.sharedConceptIds.length === 1 ? "" : "s"} ·{" "}
              {r.sharedFeatureIds.length} shared feature{r.sharedFeatureIds.length === 1 ? "" : "s"}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
