import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawIds = searchParams.get("icaos");

  if (!rawIds) {
    return NextResponse.json({ error: "No ICAO codes provided" }, { status: 400 });
  }

  const ids = [...new Set(rawIds.split(",").map((id) => id.trim().toUpperCase()))];
  if (
    ids.length === 0 ||
    ids.length > 3 ||
    ids.some((id) => !/^[A-Z0-9]{4}$/.test(id))
  ) {
    return NextResponse.json({ error: "Invalid ICAO codes provided" }, { status: 400 });
  }

  const noaaUrl = new URL("https://aviationweather.gov/api/data/metar");
  noaaUrl.searchParams.set("ids", ids.join(","));
  noaaUrl.searchParams.set("format", "json");

  try {
    // Keep the NOAA request server-side so browser clients avoid its CORS policy.
    const response = await fetch(noaaUrl, {
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

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