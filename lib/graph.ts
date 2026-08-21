import {
  concepts,
  developers,
  findConcept,
  findDeveloper,
  findFeature,
  findProject,
  findTechnology,
  projects,
  technologies,
} from "./data";
import type {
  Project,
  SimilarProjectResult,
  SimilarityResult,
  TechAffinity,
} from "./types";

// Pure, synchronous graph traversal + similarity logic.
 

export function projectsUsingTech(techId: string): Project[] {
  return projects.filter((p) => p.techIds.includes(techId));
}

export function projectsUsingConcept(conceptId: string): Project[] {
  return projects.filter((p) => p.conceptIds.includes(conceptId));
}

export function projectsForDeveloper(devId: string): Project[] {
  return projects.filter((p) => p.contributors.some((c) => c.devId === devId));
}

/** Technology -OFTEN_USED_WITH-> Technology, derived from co-occurrence. */
export function techsOftenUsedWith(techId: string): TechAffinity[] {
  const counts = new Map<string, number>();
  for (const p of projectsUsingTech(techId)) {
    for (const tid of p.techIds) {
      if (tid === techId) continue;
      counts.set(tid, (counts.get(tid) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([id, count]) => {
      const tech = findTechnology(id);
      if (!tech) return null;
      return { tech, count };
    })
    .filter((x): x is TechAffinity => x !== null);
}

/**
 * Similarity is intentionally explainable rather than a black-box score:
 * it's the Jaccard overlap across technologies + concepts + features,
 * and callers get the actual shared-entity lists to explain "why".
 */
export function similarity(a: Project, b: Project): SimilarityResult {
  const shared = (arrA: string[], arrB: string[]) =>
    arrA.filter((x) => arrB.includes(x));

  const sharedTechIds = shared(a.techIds, b.techIds);
  const sharedConceptIds = shared(a.conceptIds, b.conceptIds);
  const sharedFeatureIds = shared(a.featureIds, b.featureIds);

  const unionSize =
    new Set([...a.techIds, ...b.techIds]).size +
    new Set([...a.conceptIds, ...b.conceptIds]).size +
    new Set([...a.featureIds, ...b.featureIds]).size;

  const sharedSize =
    sharedTechIds.length + sharedConceptIds.length + sharedFeatureIds.length;

  const percent = unionSize === 0 ? 0 : Math.round((sharedSize / unionSize) * 100);

  return { percent, sharedTechIds, sharedConceptIds, sharedFeatureIds };
}

export function similarProjects(project: Project, limit = 5): SimilarProjectResult[] {
  return projects
    .filter((o) => o.id !== project.id)
    .map((o) => ({ project: o, ...similarity(project, o) }))
    .filter((r) => r.percent > 0)
    .sort((a, b) => b.percent - a.percent)
    .slice(0, limit);
}

export function ecosystemStats() {
  return {
    projects: projects.length,
    technologies: technologies.length,
    concepts: concepts.length,
    developers: developers.length,
  };
}

/* ---------- global search ---------- */

export interface SearchResults {
  projects: Project[];
  technologies: ReturnType<typeof findTechnology>[];
  concepts: ReturnType<typeof findConcept>[];
  developers: ReturnType<typeof findDeveloper>[];
}

export function search(query: string, limit = 5) {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  return {
    projects: projects.filter((p) => p.name.toLowerCase().includes(q)).slice(0, limit),
    technologies: technologies
      .filter((t) => t.name.toLowerCase().includes(q))
      .slice(0, limit),
    concepts: concepts.filter((c) => c.name.toLowerCase().includes(q)).slice(0, limit),
    developers: developers
      .filter((d) => d.name.toLowerCase().includes(q))
      .slice(0, limit),
  };
}

export { findProject, findTechnology, findConcept, findFeature, findDeveloper };
