import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get("userid") || searchParams.get("username");

  if (!input) {
    return NextResponse.json(
      { error: "Pilot ID or Username is required" },
      { status: 400 }
    );
  }

  const isNumeric = /^\d+$/.test(input.trim());
  const paramKey = isNumeric ? "userid" : "username";

  const simbriefUrl = `https://www.simbrief.com/api/xml.fetcher.php?${paramKey}=${encodeURIComponent(
    input.trim()
  )}&json=1`;

  try {
    const response = await fetch(simbriefUrl);
    const textData = await response.text();

    // Safely attempt to parse the response as JSON
    try {
      const data = JSON.parse(textData);

      // Handle errors returned inside SimBrief's JSON response
      if (data.status && typeof data.status === "string" && data.status.toLowerCase().includes("error")) {
        return NextResponse.json({ error: data.status }, { status: 400 });
      }

      return NextResponse.json(data);
    } catch {
      // SimBrief returned XML when the pilot ID is invalid or no OFP exists
      return NextResponse.json(
        { error: "No active flight plan found or invalid SimBrief Pilot ID." },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to connect to SimBrief API" },
      { status: 500 }
    );
  }
}