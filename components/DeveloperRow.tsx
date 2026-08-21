import Link from "next/link";
import type { Developer } from "@/lib/types";

export function DeveloperRow({ developer, role }: { developer: Developer; role: string }) {
  return (
    <Link
      href={`/developers/${developer.id}`}
      className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border hover:opacity-85 transition-opacity"
    >
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 bg-elevated text-accent border border-border">
        {developer.name[0]}
      </div>
      <div>
        <div className="text-sm font-medium text-ink">{developer.name}</div>
        <div className="text-xs text-muted-dim">{role}</div>
      </div>
    </Link>
  );
}
