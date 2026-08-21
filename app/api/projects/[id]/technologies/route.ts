import { NextResponse } from "next/server";

import { runQuery } from "@/lib/cognodb";
import { GET_PROJECTS_BY_TECHNOLOGY } from "@/lib/queries";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const results = await runQuery(GET_PROJECTS_BY_TECHNOLOGY, {
      technologyId: id,
    });

    const projects = results
      .map((row: any) => row.p?.properties || row.p)
      .filter((project: any) => project?.id);

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Failed to fetch projects by technology:", error);

    return NextResponse.json(
      { error: "Unable to fetch projects" },
      { status: 503 }
    );
  }
}