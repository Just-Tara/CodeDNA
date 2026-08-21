import {
  concepts as allConcepts,
  developers as allDevelopers,
  features as allFeatures,
  technologies as allTechnologies,
  projects as allProjects,
} from "./data";

import * as graph from "./graph";
import { runQuery } from "./cognodb";

import type {
  Concept,
  Developer,
  Feature,
  ProjectDetail,
  Technology,
  Project,
  Contributor,
  SimilarProjectResult,
} from "./types";

// Ecosystem Stats
export async function getEcosystemStats() {
  const query = `
    RETURN
      count { MATCH (p:Project) } AS projects,
      count { MATCH (t:Technology) } AS technologies,
      count { MATCH (c:Concept) } AS concepts,
      count { MATCH (d:Developer) } AS developers
  `;

  try {
    const res = await runQuery(query);

    if (res.length > 0) {
      return {
        projects: Number(res[0].projects),
        technologies: Number(res[0].technologies),
        concepts: Number(res[0].concepts),
        developers: Number(res[0].developers),
      };
    }
  } catch (error) {
    console.error("Failed to fetch ecosystem stats:", error);
  }

  return graph.ecosystemStats();
}

// List Projects

export async function listProjects(): Promise<Project[]> {
  const query = `
    MATCH (p:Project)
    
    OPTIONAL MATCH (p)-[:USES]->(t:Technology)
    WITH p, collect(DISTINCT t.id) AS techIds

    OPTIONAL MATCH (p)-[:INVOLVES]->(c:Concept)
    WITH p, techIds, collect(DISTINCT c.id) AS conceptIds

    OPTIONAL MATCH (p)-[:HAS_FEATURE]->(f:Feature)
    WITH p, techIds, conceptIds, collect(DISTINCT f.id) AS featureIds

    OPTIONAL MATCH (d:Developer)-[r:CONTRIBUTED_TO]->(p)
    WITH p, techIds, conceptIds, featureIds, 
         collect(DISTINCT { devId: d.id, role: r.role }) AS contributors

    RETURN 
      p.id AS id, 
      p.name AS name, 
      p.tagline AS tagline,
      p.githubUrl AS githubUrl, 
      p.demoUrl AS demoUrl,
      techIds,
      conceptIds,
      featureIds,
      contributors
    ORDER BY p.name
  `;
  try {
    const res = await runQuery(query);

    return res.map((row: any) => ({
      id: row.id,
      name: row.name,
      tagline: row.tagline,
      githubUrl: row.githubUrl || undefined,
      demoUrl: row.demoUrl || undefined,

      techIds: (row.techIds || []).filter(Boolean),
      conceptIds: (row.conceptIds || []).filter(Boolean),
      featureIds: (row.featureIds || []).filter(Boolean),

      contributors: (row.contributors || []).filter(
        (c: Contributor) => Boolean(c?.devId)
      ),
    }));
  } catch (error) {
    console.error("Failed to fetch projects:", error);

    return allProjects;
  }
}

// process the results of a query to fetch a project and its related entities from the database

async function fetchProjectFromDatabase(id: string): Promise<ProjectDetail | null> {
  const query = `
    MATCH (p:Project {id: $id})

    OPTIONAL MATCH (p)-[:USES]->(t:Technology)
    WITH p, collect(DISTINCT t) AS technologies

    OPTIONAL MATCH (p)-[:INVOLVES]->(c:Concept)
    WITH p, technologies, collect(DISTINCT c) AS concepts

    OPTIONAL MATCH (p)-[:HAS_FEATURE]->(f:Feature)
    WITH p, technologies, concepts, collect(DISTINCT f) AS features

    OPTIONAL MATCH (d:Developer)-[r:CONTRIBUTED_TO]->(p)
    WITH p, technologies, concepts, features, 
         collect(DISTINCT { developer: d, role: r.role }) AS contributors

    RETURN 
      p,
      technologies,
      concepts,
      features,
      contributors
  `;

  const res = await runQuery(query, { id });

  if (res.length === 0 || !res[0].p) {
    return null;
  }

  const p = res[0].p.properties || res[0].p;

  const technologies: Technology[] = (res[0].technologies || [])
    .map((t: any) => (t?.properties || t) as Technology)
    .filter((t: Technology) => Boolean(t?.id));

  const concepts: Concept[] = (res[0].concepts || [])
    .map((c: any) => (c?.properties || c) as Concept)
    .filter((c: Concept) => Boolean(c?.id));

  const features: Feature[] = (res[0].features || [])
    .map((f: any) => (f?.properties || f) as Feature)
    .filter((f: Feature) => Boolean(f?.id));

  const contributors: {
    developer: Developer;
    role: string;
  }[] = (res[0].contributors || [])
    .map((item: any) => ({
      developer: (item?.developer?.properties ||
        item?.developer) as Developer,
      role: item?.role || "Contributor",
    }))
    .filter(
      (item: { developer: Developer; role: string }) =>
        Boolean(item?.developer?.id)
    );

  const project: Project = {
    id: p.id,
    name: p.name,
    tagline: p.tagline,
    githubUrl: p.githubUrl || undefined,
    demoUrl: p.demoUrl || undefined,

    techIds: technologies.map((t) => t.id),
    conceptIds: concepts.map((c) => c.id),
    featureIds: features.map((f) => f.id),

    contributors: contributors.map((c) => ({
      devId: c.developer.id,
      role: c.role,
    })),
  };

  return {
    project,
    technologies,
    concepts,
    features,
    contributors,
    connectedProjects: [],
  };
}

// Project Detail
 
export async function getProjectDetail(
  id: string
): Promise<ProjectDetail | null> {
  try {
    const projectDetail = await fetchProjectFromDatabase(id);

    if (!projectDetail) {
      return null;
    }

    const similarData = await getSimilarProjects(id);

    return {
      ...projectDetail,
      connectedProjects: similarData?.results.slice(0, 4) ?? [],
    };
  } catch (error) {
    console.error("Failed to fetch project detail:", error);

    return null;
  }
}


export async function getSimilarProjects(id: string) {
  try {
    // Get the current project
    const currentProject = await fetchProjectFromDatabase(id);

    if (!currentProject) {
      return null;
    }

    // Find other projects connected through shared
    // technologies, concepts, or features.
    const query = `
      MATCH (p:Project {id: $id})

      OPTIONAL MATCH (p)-[:USES]->(t:Technology)<-[:USES]-(otherTech:Project)
      OPTIONAL MATCH (p)-[:INVOLVES]->(c:Concept)<-[:INVOLVES]-(otherConcept:Project)
      OPTIONAL MATCH (p)-[:HAS_FEATURE]->(f:Feature)<-[:HAS_FEATURE]-(otherFeature:Project)

      WITH p,
           collect(DISTINCT otherTech) +
           collect(DISTINCT otherConcept) +
           collect(DISTINCT otherFeature) AS candidates

      UNWIND candidates AS other

      WITH p, other
      WHERE other IS NOT NULL
        AND other.id <> p.id

      RETURN DISTINCT other
    `;

    const res = await runQuery(query, { id });

    const results: SimilarProjectResult[] = [];

    for (const row of res) {
      const other = row.other?.properties || row.other;

      if (!other?.id) {
        continue;
      }

      const otherProject = await fetchProjectFromDatabase(other.id);

      if (!otherProject) {
        continue;
      }

      const similarity = graph.similarity(
        currentProject.project,
        otherProject.project
      );

      results.push({
        project: otherProject.project,
        percent: similarity.percent,
        sharedTechIds: similarity.sharedTechIds,
        sharedConceptIds: similarity.sharedConceptIds,
        sharedFeatureIds: similarity.sharedFeatureIds,
      });
    }

    // Highest similarity first
    results.sort((a, b) => b.percent - a.percent);

    return {
      project: currentProject.project,
      results,
    };
  } catch (error) {
    console.error("Failed to find similar projects:", error);
    return null;
  }
}

// Project Connections
export async function getProjectConnections(id: string) {
  const query = `
    MATCH (p:Project {id: $id})-[r]->(connected)
    RETURN
      p,
      type(r) AS relationship,
      connected
  `;

  try {
    const res = await runQuery(query, { id });

    return res.map((row: any) => ({
      project: row.p?.properties || row.p,
      relationship: row.relationship,
      connected: row.connected?.properties || row.connected,
    }));
  } catch (error) {
    console.error("Failed to fetch project connections:", error);
    return [];
  }
}

 // Compare Projects
 
export async function compareProjects(
  aId: string,
  bId: string
) {
  const a = await fetchProjectFromDatabase(aId);
  const b = await fetchProjectFromDatabase(bId);

  if (!a || !b) {
    return null;
  }

  return {
    a: a.project,
    b: b.project,
    similarity: graph.similarity(a.project, b.project),
  };
}

//  Technologies
export async function listTechnologies() {
  const query = `
    MATCH (t:Technology)
    RETURN t
    ORDER BY t.category, t.name
  `;

  try {
    const res = await runQuery(query);

    const technologies: Technology[] = res
      .map((row: any) => (row.t?.properties || row.t) as Technology)
      .filter((t: Technology) => Boolean(t?.id));

    const byCategory = new Map<string, Technology[]>();

    for (const technology of technologies) {
      const list = byCategory.get(technology.category) ?? [];

      list.push(technology);

      byCategory.set(technology.category, list);
    }

    return Array.from(byCategory.entries()).map(
      ([category, items]) => ({
        category,
        items,
      })
    );
  } catch (error) {
    console.error("Failed to fetch technologies:", error);

    // Temporary fallback while migration is still in progress.
     
    const byCategory = new Map<string, Technology[]>();

    for (const technology of allTechnologies) {
      const list = byCategory.get(technology.category) ?? [];

      list.push(technology);

      byCategory.set(technology.category, list);
    }

    return Array.from(byCategory.entries()).map(
      ([category, items]) => ({
        category,
        items,
      })
    );
  }
}

// Technology Detail
 
export async function getTechnologyDetail(id: string) {
  const query = `
    MATCH (t:Technology {id: $id})

    OPTIONAL MATCH (p:Project)-[:USES]->(t)
    WITH t, collect(DISTINCT p) AS projects

    OPTIONAL MATCH (p2:Project)-[:USES]->(t2:Technology)
    WHERE t2.id <> t.id
      AND EXISTS {
        MATCH (p2)-[:USES]->(t)
      }
    WITH t, projects, t2, count(DISTINCT p2) AS count
    ORDER BY count DESC

    RETURN
      t,
      projects,
      collect(
        CASE
          WHEN t2 IS NOT NULL
          THEN { tech: t2, count: count }
          ELSE null
        END
      ) AS oftenUsedWith
  `;

  try {
    const res = await runQuery(query, { id });

    if (res.length === 0 || !res[0].t) {
      return null;
    }

    const technology = (
      res[0].t?.properties || res[0].t
    ) as Technology;

   const usedBy: Project[] = [];

    for (const rawProject of res[0].projects || []) {
      const project = rawProject?.properties || rawProject;

      if (!project?.id) continue;

      const fullProject = await fetchProjectFromDatabase(project.id);

      if (fullProject) {
        usedBy.push(fullProject.project);
      }
    }
    const oftenUsedWith = (res[0].oftenUsedWith || [])
      .filter(Boolean)
      .map((item: any) => ({
        tech: (item.tech?.properties || item.tech) as Technology,
        count:
          typeof item.count === "object"
            ? Number(item.count.low)
            : Number(item.count),
      }))
      .filter(
        (item: { tech: Technology; count: number }) =>
          Boolean(item.tech?.id)
      );

    return {
      technology,
      usedBy,
      oftenUsedWith,
    };
  } catch (error) {
    console.error("Failed to fetch technology:", error);
    return null;
  }
}

// Concepts
 
export async function getConceptDetail(id: string) {
  const query = `
    MATCH (c:Concept {id: $id})

    OPTIONAL MATCH (p:Project)-[:INVOLVES]->(c)

    RETURN
      c,
      collect(DISTINCT p) AS projects
  `;

  try {
    const res = await runQuery(query, { id });

    if (res.length === 0 || !res[0].c) {
      return null;
    }

    const concept = (
      res[0].c?.properties || res[0].c
    ) as Concept;

    const usedBy: Project[] = (res[0].projects || [])
      .map((p: any) => (p?.properties || p) as Project)
      .filter((p: Project) => Boolean(p?.id));

    return {
      concept,
      usedBy,
    };
  } catch (error) {
    console.error("Failed to fetch concept:", error);

    return null;
  }
}

//  Developers

export async function listDevelopers() {
  const query = `
    MATCH (d:Developer)

    RETURN d
    ORDER BY d.name
  `;

  try {
    const res = await runQuery(query);

    return res
      .map((row: any) => (row.d?.properties || row.d) as Developer)
      .filter((d: Developer) => Boolean(d?.id));
  } catch (error) {
    console.error("Failed to fetch developers:", error);

    return allDevelopers;
  }
}

export async function getDeveloperDetail(id: string) {
  const query = `
    MATCH (d:Developer {id: $id})

    OPTIONAL MATCH (d)-[r:CONTRIBUTED_TO]->(p:Project)
    WITH d, collect(DISTINCT { project: p, role: r.role }) AS contributions

    OPTIONAL MATCH (d)-[:CONTRIBUTED_TO]->(:Project)-[:USES]->(t:Technology)
    WITH d, contributions, collect(DISTINCT t) AS technologies

    RETURN 
      d,
      contributions,
      technologies
  `;

  try {
    const res = await runQuery(query, { id });

    if (res.length === 0 || !res[0].d) {
      return null;
    }

    const developer = (
      res[0].d?.properties || res[0].d
    ) as Developer;

    const projects: Project[] = [];

    for (const item of res[0].contributions || []) {
      const project = item?.project?.properties || item?.project;

      if (!project?.id) {
        continue;
      }

      projects.push({
        id: project.id,
        name: project.name,
        tagline: project.tagline,
        githubUrl: project.githubUrl || undefined,
        demoUrl: project.demoUrl || undefined,
        techIds: [],
        conceptIds: [],
        featureIds: [],
        contributors: [],
      });
    }

    const technologies: Technology[] = (res[0].technologies || [])
      .map((t: any) => (t?.properties || t) as Technology)
      .filter((t: Technology) => Boolean(t?.id));

    return {
      developer,
      projects,
      technologies,
    };
  } catch (error) {
    console.error("Failed to fetch developer:", error);

    return null;
  }
}

// Instant Search

export async function searchEcosystem(query: string) {
  const q = query.trim();

  if (!q) {
    return null;
  }

  const cypher = `
    CALL {
      MATCH (p:Project)
      WHERE toLower(p.name) CONTAINS toLower($query)
      RETURN "project" AS type, p AS node

      UNION ALL

      MATCH (t:Technology)
      WHERE toLower(t.name) CONTAINS toLower($query)
      RETURN "technology" AS type, t AS node

      UNION ALL

      MATCH (c:Concept)
      WHERE toLower(c.name) CONTAINS toLower($query)
      RETURN "concept" AS type, c AS node

      UNION ALL

      MATCH (d:Developer)
      WHERE toLower(d.name) CONTAINS toLower($query)
      RETURN "developer" AS type, d AS node
    }

    RETURN type, node
    LIMIT 20
  `;

  try {
    const res = await runQuery(cypher, {
      query: q,
    });

    const results = {
      projects: [] as Project[],
      technologies: [] as Technology[],
      concepts: [] as Concept[],
      developers: [] as Developer[],
    };

    for (const row of res) {
      const node = row.node?.properties || row.node;

      if (!node?.id) {
        continue;
      }

      switch (row.type) {
        case "project":
          results.projects.push(node as Project);
          break;

        case "technology":
          results.technologies.push(node as Technology);
          break;

        case "concept":
          results.concepts.push(node as Concept);
          break;

        case "developer":
          results.developers.push(node as Developer);
          break;
      }
    }

    return results;
  } catch (error) {
    console.error("Failed to search ecosystem:", error);

    return graph.search(q);
  }
}

export {
  allConcepts,
  allDevelopers,
  allTechnologies,
  allProjects,
  allFeatures,
};