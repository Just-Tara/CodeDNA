import { Sparkles } from "lucide-react";
import { SearchExperience } from "@/components/SearchBar";
import { EcosystemPreview } from "@/components/EcosystemPreview";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionLabel, Stat } from "@/components/ui/Primitives";
import { getEcosystemStats, listProjects } from "@/lib/service";

export default async function HomePage() {
  const [stats, projects] = await Promise.all([getEcosystemStats(), listProjects()]);

  return (
    <div className="max-w-5xl mx-auto px-6 pt-20 pb-32">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-6 border border-border text-accent">
          <Sparkles size={12} />
          <span className="text-xs font-medium tracking-wide">Graph-powered project explorer</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-4 text-ink">
          Project <span className="text-accent">DNA</span>
        </h1>
        <p className="text-lg max-w-xl mx-auto text-muted">
          Explore what makes software projects connected.
        </p>
        <p className="text-sm max-w-md mx-auto mt-2 text-muted-dim">
          Discover the technologies, concepts, features, and people behind the code.
        </p>
      </div>

      <div className="mb-6">
        <SearchExperience />
      </div>

      <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 mb-20 mt-10">
        <Stat value={stats.projects} label="Projects" href="/projects" />
        <Stat value={stats.technologies} label="Technologies" href="/technologies" />
        <Stat value={stats.concepts} label="Concepts" />
        <Stat value={stats.developers} label="Developers" href="/developers" />
      </div>

      <SectionLabel>Explore the ecosystem</SectionLabel>
      <div className="p-6 mt-3 bg-surface border border-border rounded-2xl">
        <EcosystemPreview />
      </div>

      <div className="mt-14">
        <SectionLabel>Recently mapped projects</SectionLabel>
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          {projects.slice(0, 6).map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
