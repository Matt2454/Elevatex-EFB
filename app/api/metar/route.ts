import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("icaos");

  if (!ids) {
    return NextResponse.json({ error: "No ICAO codes provided" }, { status: 400 });
  }

  try {
    // Keep the NOAA request server-side so browser clients avoid its CORS policy.
    const response = await fetch(
      `https://aviationweather.gov/api/data/metar?ids=${ids}&format=json`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch from NOAA");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("METAR API Route Error:", error);
    return NextResponse.json({ error: "Failed to fetch METAR data" }, { status: 500 });
  }
}