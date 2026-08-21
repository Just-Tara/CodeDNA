import { NextResponse } from "next/server";
import { searchEcosystem } from "@/lib/service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  if (!query.trim()) {
    return NextResponse.json(null);
  }

  const results = await searchEcosystem(query);

  return NextResponse.json(results);
}