import { BackButton } from "@/components/ui/Primitives";
import { DeveloperRow } from "@/components/DeveloperRow";
import { listDevelopers } from "@/lib/service";

export const metadata = { title: "All Developers — CodeDNA" };

export default async function DevelopersIndexPage() {
  const developers = await listDevelopers();

  return (
    <div className="max-w-4xl mx-auto px-6 pt-12 pb-32">
      <BackButton href="/" />
      <h1 className="text-2xl font-semibold mb-1 text-ink">All Developers</h1>
      <p className="text-sm mb-8 text-muted-dim">{developers.length} contributors across the ecosystem</p>
      <div className="grid sm:grid-cols-2 gap-2">
        {developers.map((d) => (
          <DeveloperRow
            key={d.id}
            developer={d}
            role="Contributor"
          />
        ))}
      </div>
    </div>
  );
}
