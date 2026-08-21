import { NextResponse } from "next/server";
import { getProjectDetail } from "@/lib/service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const project = await getProjectDetail(id);

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Failed to fetch project:", error);

    return NextResponse.json(
      { error: "Unable to fetch project" },
      { status: 500 }
    );
  }
}