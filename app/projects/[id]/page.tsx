import { notFound } from "next/navigation";
import { ExternalLink, GitCompare, Network } from "lucide-react";
import { ActionButton, BackButton } from "@/components/ui/Primitives";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { GraphView } from "@/components/GraphView";
import { Badge } from "@/components/ui/Primitives";
import { DeveloperRow } from "@/components/DeveloperRow";
import { ProjectCard } from "@/components/ProjectCard";
import { getProjectDetail } from "@/lib/service";
import type { GraphRing } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getProjectDetail(id);
  if (!detail) return { title: "Project not found — CodeDNA" };
  return { title: `${detail.project.name} — CodeDNA`, description: detail.project.tagline };
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getProjectDetail(id);
  if (!detail) notFound();

  const { project, technologies, concepts, features, contributors, connectedProjects } = detail;

  const rings: GraphRing[] = [
    { radius: 130, items: technologies.map((t) => ({ id: t.id, label: t.name, type: "technology" as const })) },
    { radius: 190, angleOffset: 0.4, items: concepts.map((c) => ({ id: c.id, label: c.name, type: "concept" as const })) },
    { radius: 250, angleOffset: 0.8, items: features.map((f) => ({ id: f.id, label: f.name, type: "feature" as const })) },
  ];

  const hrefForType = { technology: "/technologies", concept: "/concepts" };

  return (
    <div className="max-w-5xl mx-auto px-6 pt-12 pb-32">
      <BackButton href="/" />

      <div className="text-xs font-semibold tracking-widest uppercase mb-2 text-accent">
        {project.name}
      </div>
      <h1 className="text-3xl font-semibold tracking-tight mb-2 text-ink">{project.name}</h1>
      <p className="text-base mb-6 max-w-lg text-muted">{project.tagline}</p>

      <div className="flex flex-wrap gap-2 mb-10">
        <ActionButton icon={Network} primary>Explore DNA</ActionButton>
        <ActionButton icon={GitCompare} href={`/projects/${project.id}/similar`}>Find Similar</ActionButton>
        <ActionButton icon={GitCompare} href={`/projects/${project.id}/compare`}>Compare</ActionButton>
        {project.githubUrl && (
          <ActionButton icon={ExternalLink} href={project.githubUrl} external>GitHub</ActionButton>
        )}
      </div>

      <GraphView center={{ label: project.name }} rings={rings} hrefForType={hrefForType} />

      <div className="mt-12">
        <CollapsibleSection title="Technologies" count={technologies.length} defaultOpen>
          <div className="flex flex-wrap gap-2">
            {technologies.map((t) => (
              <Badge key={t.id} type="tech" href={`/technologies/${t.id}`}>{t.name}</Badge>
            ))}
          </div>
        </CollapsibleSection>

        <div className="mt-8">
          <CollapsibleSection title="Concepts" count={concepts.length} defaultOpen>
            <div className="flex flex-wrap gap-2">
              {concepts.map((c) => (
                <Badge key={c.id} type="concept" href={`/concepts/${c.id}`}>{c.name}</Badge>
              ))}
            </div>
          </CollapsibleSection>
        </div>

        <div className="mt-8">
          <CollapsibleSection title="Features" count={features.length} defaultOpen={false}>
            <div className="flex flex-wrap gap-2">
              {features.map((f) => (
                <Badge key={f.id} type="feature">{f.name}</Badge>
              ))}
            </div>
          </CollapsibleSection>
        </div>

        <div className="mt-8">
          <CollapsibleSection title="Contributors" count={contributors.length} defaultOpen={false}>
            <div className="grid sm:grid-cols-2 gap-2">
              {contributors.map((c) => (
                <DeveloperRow key={c.developer.id} developer={c.developer} role={c.role} />
              ))}
            </div>
          </CollapsibleSection>
        </div>

        {connectedProjects.length > 0 && (
          <div className="mt-8">
            <CollapsibleSection title="Connected projects" defaultOpen={false}>
              <div className="grid sm:grid-cols-2 gap-3">
                {connectedProjects.map((r) => (
                  <ProjectCard key={r.project.id} project={r.project} />
                ))}
              </div>
            </CollapsibleSection>
          </div>
        )}
      </div>
    </div>
  );
}
