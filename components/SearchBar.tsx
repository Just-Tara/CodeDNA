"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Cpu, Hash, Layers, Search, User, X } from "lucide-react";
import { EmptyState } from "@/components/ui/States";

export function SearchExperience() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error("Search failed:", error);
        setResults(null);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-surface border border-border">
        <Search size={18} className="text-muted" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects, technologies, concepts, or developers…"
          className="flex-1 outline-none text-sm bg-transparent text-ink placeholder:text-muted-dim"
        />
        {query && (
          <button onClick={() => setQuery("")} aria-label="Clear search" className="text-muted-dim">
            <X size={16} />
          </button>
        )}
      </div>

      {results && <SearchResults results={results} onClear={() => setQuery("")} />}
    </div>
  );
}

type SearchResultData = {
  projects: Array<{ id: string; name: string; tagline: string }>;
  technologies: Array<{ id: string; name: string; category: string }>;
  concepts: Array<{ id: string; name: string }>;
  developers: Array<{ id: string; name: string }>;
};

function SearchResults({
  results,
  onClear,
}: {
  results: SearchResultData;
  onClear: () => void;
}) {
  const total =
    results.projects.length +
    results.technologies.length +
    results.concepts.length +
    results.developers.length;

  if (total === 0) {
    return (
      <div className="mt-4">
        <EmptyState
          title="No results found."
          message="Try searching for another project, technology, or concept."
        />
        <div className="text-center -mt-8">
          <button onClick={onClear} className="text-sm text-accent hover:opacity-80 transition-opacity">
            Clear search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-8 text-left">
      <ResultGroup title="Projects" icon={Layers}>
        {results.projects.map((p: { id: string; name: string; tagline: string }) => (
          <ResultRow key={p.id} href={`/projects/${p.id}`} label={p.name} sub={p.tagline} />
        ))}
      </ResultGroup>
      <ResultGroup title="Technologies" icon={Cpu}>
        {results.technologies.map((t: { id: string; name: string; category: string }) =>
          t ? <ResultRow key={t.id} href={`/technologies/${t.id}`} label={t.name} sub={t.category} /> : null
        )}
      </ResultGroup>
      <ResultGroup title="Concepts" icon={Hash}>
        {results.concepts.map((c: { id: string; name: string }) =>
          c ? (
            <ResultRow
              key={c.id}
              href={`/concepts/${c.id}`}
              label={c.name}
            />
          ) : null
        )}
      </ResultGroup>
      <ResultGroup title="Developers" icon={User}>
        {results.developers.map((d: { id: string; name: string }) =>
          d ? (
            <ResultRow
              key={d.id}
              href={`/developers/${d.id}`}
              label={d.name}
            />
          ) : null
        )}
      </ResultGroup>
    </div>
  );
}

function ResultGroup({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Layers;
  children: React.ReactNode;
}) {
  const items = Array.isArray(children) ? children.filter(Boolean) : children;
  const count = Array.isArray(items) ? items.length : items ? 1 : 0;
  if (count === 0) return null;
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <Icon size={12} className="text-muted-dim" />
        <span className="text-xs uppercase tracking-wide font-medium text-muted-dim">{title}</span>
      </div>
      <div className="border border-border rounded-xl overflow-hidden">{items}</div>
    </div>
  );
}

function ResultRow({ href, label, sub }: { href: string; label: string; sub?: string }) {
  return (
    <Link
      href={href}
      className="w-full flex items-center justify-between px-4 py-3 hover:opacity-80 transition-opacity text-left border-b border-border-soft last:border-b-0"
    >
      <div>
        <div className="text-sm font-medium text-ink">{label}</div>
        {sub && <div className="text-xs mt-0.5 text-muted-dim">{sub}</div>}
      </div>
      <ChevronRight size={14} className="text-muted-dim" />
    </Link>
  );
}
