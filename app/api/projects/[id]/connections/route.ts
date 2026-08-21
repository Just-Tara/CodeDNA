import { NextResponse } from "next/server";

import { runQuery } from "@/lib/cognodb";
import { GET_PROJECT_CONNECTIONS } from "@/lib/queries";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const results = await runQuery(GET_PROJECT_CONNECTIONS, {
      projectId: id,
    });

    const formattedResults = results.map((row: any) => {
      const project = row.p?.properties || row.p;
      const connected = row.connected?.properties || row.connected;

      return {
        project,
        relationship: row.relationship,
        connected,
      };
    });

    return NextResponse.json(formattedResults);
  } catch (error) {
    console.error("Failed to fetch project connections:", error);

    return NextResponse.json(
      { error: "Unable to fetch project connections" },
      { status: 503 }
    );
  }
}