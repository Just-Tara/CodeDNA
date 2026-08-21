import { notFound } from "next/navigation";
import Link from "next/link";
import { GitBranch, ChevronRight } from "lucide-react";
import { BackButton, Badge, SectionLabel } from "@/components/ui/Primitives";
import { getDeveloperDetail } from "@/lib/service";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getDeveloperDetail(id);
  if (!detail) return { title: "Developer not found — CodeDNA" };
  return { title: `${detail.developer.name} — CodeDNA` };
}

export default async function DeveloperPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const detail = await getDeveloperDetail(id);
  if (!detail) notFound();
  const { developer, projects, technologies } = detail;

  return (
    <div className="max-w-3xl mx-auto px-6 pt-12 pb-32">
      <BackButton href="/developers" />
      <div className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-semibold bg-elevated text-accent border border-border">
          {developer.name[0]}
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-ink">{developer.name}</h1>
          {developer.githubUsername && (
            <div className="text-sm flex items-center gap-1 mt-0.5 text-muted-dim">
              <GitBranch size={13} /> @{developer.githubUsername}
            </div>
          )}
        </div>
      </div>

      <SectionLabel count={projects.length}>Projects</SectionLabel>
      <div className="space-y-2 mb-10 mt-3">
        {projects.map((p) => {
          const role = p.contributors.find((c) => c.devId === id)?.role;
          return (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="w-full flex items-center justify-between p-4 rounded-xl text-left bg-surface border border-border hover:opacity-85 transition-opacity"
            >
              <div>
                <div className="text-sm font-medium text-ink">{p.name}</div>
                <div className="text-xs mt-0.5 text-muted-dim">{role}</div>
              </div>
              <ChevronRight size={14} className="text-muted-dim" />
            </Link>
          );
        })}
      </div>

      <SectionLabel count={technologies.length}>Technologies used</SectionLabel>
      <div className="flex flex-wrap gap-2 mt-3">
        {technologies.map((t) => (
          <Badge key={t.id} type="tech" href={`/technologies/${t.id}`}>{t.name}</Badge>
        ))}
      </div>
    </div>
  );
}
