import { NextResponse } from "next/server";
import { getSimilarProjects } from "@/lib/service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await getSimilarProjects(id);

    if (!result) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to find similar projects:", error);

    return NextResponse.json(
      { error: "Unable to find similar projects" },
      { status: 503 }
    );
  }
}