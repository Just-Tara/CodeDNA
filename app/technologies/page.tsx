import { BackButton, Badge, SectionLabel } from "@/components/ui/Primitives";
import { listTechnologies, listProjects } from "@/lib/service";

export const metadata = { title: "All Technologies — CodeDNA" };

export default async function TechnologiesIndexPage() {
  const [groups, projects] = await Promise.all([
    listTechnologies(),
    listProjects(),
  ]);
  const total = groups.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <div className="max-w-4xl mx-auto px-6 pt-12 pb-32">
      <BackButton href="/" />
      <h1 className="text-2xl font-semibold mb-1 text-ink">All Technologies</h1>
      <p className="text-sm mb-8 text-muted-dim">{total} technologies across the ecosystem</p>

      <div className="space-y-8">
        {groups.map(({ category, items }) => (
          <div key={category}>
            <SectionLabel>{category}</SectionLabel>
            <div className="flex flex-wrap gap-2 mt-3">
              {items.map((t) => (
                <Badge key={t.id} type="tech" href={`/technologies/${t.id}`}>
                 {t.name}{" "}
                  <span className="text-muted-dim">
                    · {projects.filter((p) => p.techIds.includes(t.id)).length}
                  </span>
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
