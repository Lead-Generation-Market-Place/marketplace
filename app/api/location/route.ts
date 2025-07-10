import { GetZipeStateCodes } from "@/actions/locations/getZipCodes";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state");

  if (!state) {
    return NextResponse.json(
      { success: false, error: "State parameter is required" },
      { status: 400 }
    );
  }

  try {
    const result = await GetZipeStateCodes();
    return NextResponse.json(result);
  } catch{
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}