import neo4j, { Driver, Session } from "neo4j-driver";

let driver: Driver;

export function getDriver(): Driver {
    if (!driver) {
        const uri = process.env.COGNODB_URI;
        const username = process.env.COGNODB_USERNAME;
        const password = process.env.COGNODB_PASSWORD;

        if (!uri || !username || !password) {
            throw new Error("Missing required environment variables for Neo4j connection.");
        }

        driver = neo4j.driver(uri, neo4j.auth.basic(username, password), {
            maxConnectionPoolSize: 50, 
            connectionTimeout: 30000,
        });

    }
    return driver;
}

export async function runQuery<T = any>(
    cypher: string,
    params: Record<string, any> = {}
): Promise<T[]> {
    const session: Session = getDriver().session();
    try {
        const result = await session.run(cypher, params);
        return result.records.map(record => record.toObject() as T);
    } finally {
        await session.close();
    }
}