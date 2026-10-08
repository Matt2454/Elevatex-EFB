export interface MetarData {
  icaoId: string;
  rawOb: string;
  name?: string;
  temp?: number;
  dewp?: number;
  wspd?: number;
  wgst?: number;
  wdir?: number;
  visib?: string | number;
  fltcat?: 'VFR' | 'MVFR' | 'IFR' | 'LIFR';
  receiptTime?: string;
}

export const FLIGHT_CAT_COLORS = {
  VFR: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  MVFR: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  IFR: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30" },
  LIFR: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
};

export async function fetchMetar(
  icaos: string[],
  signal?: AbortSignal
): Promise<Record<string, MetarData>> {
  // SimBrief can provide padded or lowercase ICAOs; normalize them before querying NOAA.
  const validIcaos = icaos
    .map((icao) => icao.trim().toUpperCase())
    .filter((icao) => /^[A-Z0-9]{4}$/.test(icao));
  if (validIcaos.length === 0) {
    return {};
  }

  try {
    // Use the internal route as a browser-safe proxy for NOAA's CORS restrictions.
    const response = await fetch(
      `/api/metar?icaos=${encodeURIComponent(validIcaos.join(","))}`,
      { signal }
    );

    if (!response.ok) throw new Error('Failed to fetch METAR data');

    const data = await response.json();

    if (!Array.isArray(data)) return {};

    return data.reduce((acc, item) => {
      if (item && typeof item.icaoId === "string" && item.icaoId.trim()) {
        acc[item.icaoId.trim().toUpperCase()] = {
          ...item,
          fltcat: item.fltcat ?? item.fltCat,
        };
      }
      return acc;
    }, {} as Record<string, MetarData>);
  } catch (error) {
    if (signal?.aborted) {
      throw error;
    }
    console.error("Error fetching METAR data:", error);
    return {};
  }
}