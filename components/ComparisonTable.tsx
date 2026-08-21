import { SectionLabel, Check } from "@/components/ui/Primitives";
import type { Project } from "@/lib/types";

export function ComparisonTable<T extends { id: string; name: string }>({
  title,
  a,
  b,
  allEntities,
  idKey,
}: {
  title: string;
  a: Project;
  b: Project;
  allEntities: T[];
  idKey: "techIds" | "conceptIds" | "featureIds";
}) {
  if (allEntities.length === 0) return null;
  return (
    <div className="mb-8">
      <SectionLabel>{title}</SectionLabel>
      <div className="border border-border rounded-xl overflow-hidden mt-2.5">
        <div className="grid grid-cols-[1fr_60px_60px] px-4 py-2 text-xs uppercase tracking-wide border-b border-border bg-elevated text-muted-dim">
          <div>{title}</div>
          <div className="text-center">{a.name}</div>
          <div className="text-center">{b.name}</div>
        </div>
        {allEntities.map((entity) => {
          const inA = a[idKey].includes(entity.id);
          const inB = b[idKey].includes(entity.id);
          return (
            <div
              key={entity.id}
              className="grid grid-cols-[1fr_60px_60px] px-4 py-2.5 text-sm items-center border-b border-border-soft last:border-b-0 text-ink"
            >
              <div>{entity.name}</div>
              <div className="text-center"><Check active={inA} /></div>
              <div className="text-center"><Check active={inB} /></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
