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

  const normalizedInput = input.trim();
  if (!normalizedInput || normalizedInput.length > 100 || /[\u0000-\u001F\u007F]/.test(normalizedInput)) {
    return NextResponse.json({ error: "Invalid Pilot ID or Username" }, { status: 400 });
  }

  const isNumeric = /^\d+$/.test(normalizedInput);
  const paramKey = isNumeric ? "userid" : "username";

  const simbriefUrl = `https://www.simbrief.com/api/xml.fetcher.php?${paramKey}=${encodeURIComponent(
    normalizedInput
  )}&json=1`;

  try {
    const response = await fetch(simbriefUrl, {
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "SimBrief returned an unavailable response" },
        { status: 502 }
      );
    }

    const textData = await response.text();

    // SimBrief may return XML for invalid IDs, so parse JSON without assuming the response format.
    try {
      const data: unknown = JSON.parse(textData);
      if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw new Error("Unexpected SimBrief response");
      }

      // SimBrief can encode request failures in a successful HTTP response.
      const status = "status" in data && typeof data.status === "string" ? data.status : null;
      if (status?.toLowerCase().includes("error")) {
        return NextResponse.json({ error: status }, { status: 400 });
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