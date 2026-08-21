import { notFound } from "next/navigation";
import { BackButton, SectionLabel } from "@/components/ui/Primitives";
import { ProjectCard } from "@/components/ProjectCard";
import { getConceptDetail } from "@/lib/service";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getConceptDetail(id);
  if (!detail) return { title: "Concept not found — CodeDNA" };
  return { title: `${detail.concept.name} — CodeDNA` };
}

export default async function ConceptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getConceptDetail(id);
  if (!detail) notFound();
  const { concept, usedBy } = detail;

  return (
    <div className="max-w-3xl mx-auto px-6 pt-12 pb-32">
      <BackButton href="/" />
      <div className="text-xs font-semibold tracking-widest uppercase mb-2 text-cyan">Concept</div>
      <h1 className="text-3xl font-semibold tracking-tight mb-2 text-ink">{concept.name}</h1>
      <p className="text-sm mb-10 text-muted">
        Appears in {usedBy.length} project{usedBy.length === 1 ? "" : "s"}
      </p>
      <SectionLabel count={usedBy.length}>Projects</SectionLabel>
      <div className="grid sm:grid-cols-2 gap-3 mt-3">
        {usedBy.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </div>
  );
}
