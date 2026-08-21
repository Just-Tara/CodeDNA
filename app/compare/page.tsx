import { notFound } from "next/navigation";
import { BackButton } from "@/components/ui/Primitives";
import { ComparisonTable } from "@/components/ComparisonTable";
import { compareProjects } from "@/lib/service";
import { allConcepts, allFeatures, allTechnologies } from "@/lib/service";

export const metadata = { title: "Compare Projects — CodeDNA" };

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const { a: aId, b: bId } = await searchParams;
  if (!aId || !bId) notFound();

  const data = await compareProjects(aId, bId);
  if (!data) notFound();
  const { a, b, similarity } = data;

  const allTech = allTechnologies.filter(
    (t) => a.techIds.includes(t.id) || b.techIds.includes(t.id)
  );
  const allConcept = allConcepts.filter(
    (c) => a.conceptIds.includes(c.id) || b.conceptIds.includes(c.id)
  );
  const allFeature = allFeatures.filter(
    (f) => a.featureIds.includes(f.id) || b.featureIds.includes(f.id)
  );

  return (
    <div className="max-w-3xl mx-auto px-6 pt-12 pb-32">
      <BackButton href={`/projects/${a.id}`} />
      <h1 className="text-2xl font-semibold mb-1 text-ink">
        {a.name} <span className="font-normal text-muted-dim">vs</span> {b.name}
      </h1>

      <div className="p-6 my-8 text-center bg-surface border border-border rounded-2xl">
        <div className="text-xs uppercase tracking-wide mb-2 text-muted-dim">DNA Similarity</div>
        <div className="text-5xl font-semibold mb-3 text-accent">{similarity.percent}%</div>
        <div className="text-sm text-muted">
          Both projects share {similarity.sharedTechIds.length} technolog
          {similarity.sharedTechIds.length === 1 ? "y" : "ies"} and {similarity.sharedConceptIds.length}{" "}
          concept{similarity.sharedConceptIds.length === 1 ? "" : "s"}.
        </div>
      </div>

      <ComparisonTable title="Technologies" a={a} b={b} allEntities={allTech} idKey="techIds" />
      <ComparisonTable title="Concepts" a={a} b={b} allEntities={allConcept} idKey="conceptIds" />
      <ComparisonTable title="Features" a={a} b={b} allEntities={allFeature} idKey="featureIds" />
    </div>
  );
}
