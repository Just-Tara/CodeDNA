import { BackButton, Badge } from "@/components/ui/Primitives";
import { listProjects, allConcepts } from "@/lib/service";

export const metadata = {
  title: "All Concepts — CodeDNA",
};

export default async function ConceptsPage() {
  const projects = await listProjects();

  const counts = new Map<string, number>();

  for (const project of projects) {
    for (const id of project.conceptIds || []) {
      counts.set(id, (counts.get(id) || 0) + 1);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 pt-12 pb-32">
      <BackButton href="/" />

      <h1 className="text-2xl font-semibold mb-1 text-ink">
        All Concepts
      </h1>

      <p className="text-sm mb-8 text-muted-dim">
        {allConcepts.length} concepts across the ecosystem
      </p>

      <div className="flex flex-wrap gap-2">
        {allConcepts.map((concept) => (
          <Badge
            key={concept.id}
            type="concept"
            href={`/concepts/${concept.id}`}
          >
            {concept.name}
            <span className="text-muted-dim">
              {" "}· {counts.get(concept.id) || 0}
            </span>
          </Badge>
        ))}
      </div>
    </div>
  );
}