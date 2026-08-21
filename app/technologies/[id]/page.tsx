import { notFound } from "next/navigation";
import { BackButton, Badge } from "@/components/ui/Primitives";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { GraphView } from "@/components/GraphView";
import { ProjectCard } from "@/components/ProjectCard";
import { getTechnologyDetail } from "@/lib/service";
import type { GraphRing } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getTechnologyDetail(id);
  if (!detail) return { title: "Technology not found — CodeDNA" };
  return { title: `${detail.technology.name} — CodeDNA` };
}

export default async function TechnologyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getTechnologyDetail(id);
  if (!detail) notFound();
  const { technology, usedBy, oftenUsedWith } = detail;

  const rings: GraphRing[] = [
    { radius: 190, items: usedBy.map((p) => ({ id: p.id, label: p.name, type: "project" as const })) },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 pt-12 pb-32">
      <BackButton href="/technologies" />
      <div className="text-xs font-semibold tracking-widest uppercase mb-2 text-accent">
        {technology.category}
      </div>
      <h1 className="text-3xl font-semibold tracking-tight mb-2 text-ink">{technology.name}</h1>
      <p className="text-sm mb-10 text-muted">
        Used by {usedBy.length} project{usedBy.length === 1 ? "" : "s"}
      </p>

      <GraphView
        center={{ label: technology.name }}
        rings={rings}
        height={360}
        hrefForType={{ project: "/projects" }}
      />

      <div className="mt-12">
        <CollapsibleSection title="Used by" count={usedBy.length} defaultOpen>
          <div className="grid sm:grid-cols-2 gap-3">
            {usedBy.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </CollapsibleSection>

        {oftenUsedWith.length > 0 && (
          <div className="mt-8">
            <CollapsibleSection title="Commonly used with" count={oftenUsedWith.length} defaultOpen>
              <div className="flex flex-wrap gap-2">
                {oftenUsedWith.map(({ tech, count }: { tech: typeof oftenUsedWith[0]['tech']; count: number }) => (
                  <Badge key={tech.id} type="tech" href={`/technologies/${tech.id}`}>
                    {tech.name} <span className="text-muted-dim">· {count}</span>
                  </Badge>
                ))}
              </div>
            </CollapsibleSection>
          </div>
        )}
      </div>
    </div>
  );
}
