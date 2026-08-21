"use client";

import { useRouter } from "next/navigation";
import { allProjects, allTechnologies } from "@/lib/service";

export function EcosystemPreview() {
  const router = useRouter();
  const sample = [allProjects[0], allProjects[1], allProjects[3]];
  const sharedTech = allTechnologies.find((t) => t.id === "t3")!; 

  return (
    <div className="flex items-center justify-center py-6">
      <svg viewBox="0 0 600 220" width="100%" height="220" style={{ maxWidth: 560 }}>
        <circle cx="300" cy="110" r="22" fill="var(--color-accent)" opacity={0.9} />
        <text x="300" y="150" textAnchor="middle" fill="var(--color-ink)" fontSize="12">
          {sharedTech.name}
        </text>
        {sample.map((p, i) => {
          const x = 120 + i * 180;
          const y = i % 2 === 0 ? 40 : 190;
          return (
            <g key={p.id} style={{ cursor: "pointer" }} onClick={() => router.push(`/projects/${p.id}`)}>
              <line x1={300} y1={110} x2={x} y2={y} stroke="var(--color-border)" strokeWidth={1} />
              <circle cx={x} cy={y} r={16} fill="var(--color-elevated)" stroke="var(--color-muted-dim)" />
              <text x={x} y={y - 24} textAnchor="middle" fill="var(--color-muted)" fontSize="12">
                {p.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
