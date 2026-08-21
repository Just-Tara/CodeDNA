import "dotenv/config";
import { runQuery, getDriver } from "../lib/cognodb";
import {
  projects,
  technologies,
  concepts,
  features,
  developers,
} from "../lib/data";
import type { Contributor } from "../lib/types";

async function seed() {
  console.log(" Seeding CognoDB with CodeDNA dataset...");

  try {
    // 1. Constraints
    await runQuery(`CREATE CONSTRAINT project_id IF NOT EXISTS FOR (p:Project) REQUIRE p.id IS UNIQUE`);
    await runQuery(`CREATE CONSTRAINT tech_id IF NOT EXISTS FOR (t:Technology) REQUIRE t.id IS UNIQUE`);
    await runQuery(`CREATE CONSTRAINT concept_id IF NOT EXISTS FOR (c:Concept) REQUIRE c.id IS UNIQUE`);
    await runQuery(`CREATE CONSTRAINT feature_id IF NOT EXISTS FOR (f:Feature) REQUIRE f.id IS UNIQUE`);
    await runQuery(`CREATE CONSTRAINT dev_id IF NOT EXISTS FOR (d:Developer) REQUIRE d.id IS UNIQUE`);

    // 2. Technologies
    for (const t of technologies) {
      await runQuery(
        `MERGE (node:Technology {id: $id})
         SET node.name = $name,
             node.category = $category`,
        { id: t.id, name: t.name, category: t.category }
      );
    }

    // 3. Concepts
    for (const c of concepts) {
      await runQuery(
        `MERGE (node:Concept {id: $id})
         SET node.name = $name,
             node.description = $description`,
        { id: c.id, name: c.name, description: c.description ?? "" }
      );
    }

    // 4. Features
    for (const f of features) {
      await runQuery(
        `MERGE (node:Feature {id: $id})
         SET node.name = $name,
             node.description = $description`,
        { id: f.id, name: f.name, description: f.description ?? "" }
      );
    }

    // 5. Developers
    for (const d of developers) {
      await runQuery(
        `MERGE (node:Developer {id: $id})
         SET node.name = $name,
             node.githubUsername = $githubUsername,
             node.avatarUrl = $avatarUrl`,
        {
          id: d.id,
          name: d.name,
          githubUsername: d.githubUsername ?? "",
          avatarUrl: d.avatarUrl ?? "",
        }
      );
    }

    // 6. Projects & Relationships
    for (const p of projects) {
      await runQuery(
        `MERGE (proj:Project {id: $id})
         SET proj.name = $name,
             proj.tagline = $tagline,
             proj.githubUrl = $githubUrl,
             proj.demoUrl = $demoUrl`,
        {
          id: p.id,
          name: p.name,
          tagline: p.tagline,
          githubUrl: p.githubUrl ?? "",
          demoUrl: p.demoUrl ?? "",
        }
      );

      // (Project)-[:USES]->(Technology)
      for (const tid of p.techIds) {
        await runQuery(
          `MATCH (proj:Project {id: $pid}), (t:Technology {id: $tid})
           MERGE (proj)-[:USES]->(t)`,
          { pid: p.id, tid }
        );
      }

      // (Project)-[:INVOLVES]->(Concept)
      for (const cid of p.conceptIds) {
        await runQuery(
          `MATCH (proj:Project {id: $pid}), (c:Concept {id: $cid})
           MERGE (proj)-[:INVOLVES]->(c)`,
          { pid: p.id, cid }
        );
      }

      // (Project)-[:HAS_FEATURE]->(Feature)
      for (const fid of p.featureIds) {
        await runQuery(
          `MATCH (proj:Project {id: $pid}), (f:Feature {id: $fid})
           MERGE (proj)-[:HAS_FEATURE]->(f)`,
          { pid: p.id, fid }
        );
      }

      // (Developer)-[:CONTRIBUTED_TO]->(Project)
      for (const c of p.contributors as Contributor[]) {
        await runQuery(
           `MATCH (proj:Project {id: $pid})
            MATCH (d:Developer {id: $did})
            MERGE (d)-[r:CONTRIBUTED_TO]->(proj)
            SET r.role = $role`,
          { pid: p.id, did: c.devId, role: c.role }
        );
      }
    }

    console.log("Seed completed successfully with zero schema errors!");
  } catch (error) {
    console.error(" Seeding failed:", error);
  } finally {
    const driver = getDriver();
    if (driver) await driver.close();
  }
}

seed();