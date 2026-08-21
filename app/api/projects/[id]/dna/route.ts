import { NextResponse } from "next/server";

import { runQuery } from "@/lib/cognodb";
import { GET_PROJECT_DNA } from "@/lib/queries";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const results = await runQuery(GET_PROJECT_DNA, {
      projectId: id,
    });

    if (results.length === 0 || !results[0].p) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    const row = results[0];

    const project = row.p?.properties || row.p;

    const technologies = (row.technologies || [])
      .map((item: any) => item?.properties || item)
      .filter((item: any) => item?.id);

    const concepts = (row.concepts || [])
      .map((item: any) => item?.properties || item)
      .filter((item: any) => item?.id);

    const features = (row.features || [])
      .map((item: any) => item?.properties || item)
      .filter((item: any) => item?.id);

    const developers = (row.developers || [])
      .map((item: any) => item?.properties || item)
      .filter((item: any) => item?.id);

    return NextResponse.json({
      project,
      technologies,
      concepts,
      features,
      developers,
    });
  } catch (error) {
    console.error("Failed to fetch project DNA:", error);

    return NextResponse.json(
      { error: "Unable to fetch project DNA" },
      { status: 503 }
    );
  }
}