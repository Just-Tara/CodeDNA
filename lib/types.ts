/**
 * Data model for CodeDNA.
 *
 * These types mirror the node/relationship shapes described in the
 * product spec. They are deliberately backend-agnostic:
 * the same interfaces are used whether the data comes from `lib/data.ts`
 * (mock, in-memory), Next.js API routes backed by the
 * Neo4j driver against CognoDB.
 */

export interface Project {
  id: string;
  name: string;
  tagline: string;
  githubUrl?: string;
  demoUrl?: string;
  /** Technology[] ids — Project -USES-> Technology */
  techIds: string[];
  /** Concept[] ids — Project -INVOLVES-> Concept */
  conceptIds: string[];
  /** Feature[] ids — Project -HAS_FEATURE-> Feature */
  featureIds: string[];
  contributors: Contributor[];
}

export interface Contributor {
  devId: string;
  /** Relationship metadata on Developer -CONTRIBUTED_TO-> Project */
  role: string;
}

export interface Technology {
  id: string;
  name: string;
  category: string;
}

export interface Concept {
  id: string;
  name: string;
  description?: string;
}

export interface Feature {
  id: string;
  name: string;
  description?: string;
}

export interface Developer {
  id: string;
  name: string;
  githubUsername?: string;
  avatarUrl?: string;
}

/** A node in the radial graph view, decoupled from its underlying entity. */
export type GraphEntityType = "project" | "technology" | "concept" | "feature" | "developer";

export interface GraphNode {
  id: string;
  label: string;
  type: GraphEntityType;
}

export interface GraphRing {
  radius: number;
  angleOffset?: number;
  items: GraphNode[];
}

/** Result of comparing two CodeDNA profiles. */
export interface SimilarityResult {
  percent: number;
  sharedTechIds: string[];
  sharedConceptIds: string[];
  sharedFeatureIds: string[];
}

export interface SimilarProjectResult extends SimilarityResult {
  project: Project;
}

export interface TechAffinity {
  tech: Technology;
  count: number;
}

/** Fully resolved view of a project, with related entities hydrated. */
export interface ProjectDetail {
  project: Project;
  technologies: Technology[];
  concepts: Concept[];
  features: Feature[];
  contributors: { developer: Developer; role: string }[];
  connectedProjects: SimilarProjectResult[];
}
