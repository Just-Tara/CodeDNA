export const GET_PROJECT_DNA = `
  MATCH (p:Project {id: $projectId})

  OPTIONAL MATCH (p)-[:USES]->(t:Technology)
  OPTIONAL MATCH (p)-[:INVOLVES]->(c:Concept)
  OPTIONAL MATCH (p)-[:HAS_FEATURE]->(f:Feature)
  OPTIONAL MATCH (d:Developer)-[:CONTRIBUTED_TO]->(p)

  RETURN
    p,
    collect(DISTINCT t) AS technologies,
    collect(DISTINCT c) AS concepts,
    collect(DISTINCT f) AS features,
    collect(DISTINCT d) AS developers
`;

export const GET_PROJECT_CONNECTIONS = `
  MATCH (p:Project {id: $projectId})

  OPTIONAL MATCH (p)-[r]->(connected)
  WITH p, collect({
    relationship: type(r),
    connected: connected
  }) AS outgoing

  OPTIONAL MATCH (developer:Developer)-[cr:CONTRIBUTED_TO]->(p)
  WITH p, outgoing, collect({
    relationship: type(cr),
    connected: developer
  }) AS incoming

  UNWIND outgoing + incoming AS connection

  WITH p, connection
  WHERE connection.connected IS NOT NULL

  RETURN
    p,
    connection.relationship AS relationship,
    connection.connected AS connected
`;

export const GET_SIMILAR_PROJECTS = `
  MATCH (p:Project {id: $projectId})

  MATCH (p)-[:USES|INVOLVES|HAS_FEATURE]->(shared)
        <-[:USES|INVOLVES|HAS_FEATURE]-(similar:Project)

  WHERE similar.id <> p.id

  WITH
    similar,
    collect(DISTINCT shared) AS sharedEntities

  RETURN
    similar,
    size(sharedEntities) AS sharedConnections,
    [x IN sharedEntities WHERE x:Technology | x.id] AS sharedTechIds,
    [x IN sharedEntities WHERE x:Concept | x.id] AS sharedConceptIds,
    [x IN sharedEntities WHERE x:Feature | x.id] AS sharedFeatureIds

  ORDER BY sharedConnections DESC
  LIMIT 10
`;

export const GET_PROJECTS_BY_TECHNOLOGY = `
  MATCH (t:Technology {id: $technologyId})<-[:USES]-(p:Project)
  RETURN p
`;

export const GET_ALL_PROJECTS = `
  MATCH (p:Project)
  RETURN p
  ORDER BY p.name
`;