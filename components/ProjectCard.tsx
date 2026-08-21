import Link from "next/link";
import { findTechnology } from "@/lib/graph";
import type { Project } from "@/lib/types";

export function ProjectCard({ project, href }: { project: Project; href?: string }) {
  return (
    <Link
      href={href ?? `/projects/${project.id}`}
      className="text-left p-4 rounded-xl block bg-surface border border-border hover:opacity-85 transition-opacity"
    >
      <div className="text-sm font-semibold mb-1 text-ink">{project.name}</div>
      <div className="text-xs leading-relaxed mb-3 text-muted-dim">{project.tagline}</div>
      <div className="flex flex-wrap gap-1.5">
        {(project.techIds ?? []).slice(0, 3).map((tid) => {
          const t = findTechnology(tid);
          if (!t) return null;
          return (
            <span key={tid} className="text-[11px] px-2 py-0.5 rounded-full bg-elevated text-muted">
              {t.name}
            </span>
          );
        })}
        {(project.techIds ?? []).length > 3 && (
          <span className="text-[11px] px-1 py-0.5 text-muted-dim">
            +{(project.techIds ?? []).length - 3}
          </span>
        )}
      </div>
    </Link>
  );
}
