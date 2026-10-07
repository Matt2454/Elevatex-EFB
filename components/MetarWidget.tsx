'use client';

import { startTransition, useEffect, useState } from "react";
import { fetchMetar, FLIGHT_CAT_COLORS } from "@/lib/metar";
import type { MetarData } from "@/lib/metar";

interface MetarWidgetProps {
  depIcao?: string;
  arrIcao?: string;
  altIcao?: string;
}

export function MetarWidget({ depIcao, arrIcao, altIcao }: MetarWidgetProps) {
  const [metars, setMetars] = useState<Record<string, MetarData>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const icaos = [depIcao, arrIcao, altIcao].filter(Boolean) as string[];
    if (icaos.length === 0) return;

    startTransition(() => {
      setLoading(true);
      setError(null);
    });

    fetchMetar(icaos)
      .then((data) => {
        if (Object.keys(data).length === 0) {
          setError("Timeout or no weather data received");
        }
        setMetars(data);
      })
      .catch(() => setError("Network error fetching METAR"))
      .finally(() => setLoading(false));
  }, [depIcao, arrIcao, altIcao]);

  const airports = [
    { label: "DEP", icao: depIcao },
    { label: "ARR", icao: arrIcao },
    ...(altIcao ? [{ label: "ALT", icao: altIcao }] : [])
  ];

  if (!depIcao && !arrIcao) return null;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 font-mono text-xs text-zinc-300 space-y-3">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
        <span className="font-bold text-zinc-400 tracking-wider">METAR & FLIGHT CONDITIONS</span>
        {loading && <span className="text-zinc-500 animate-pulse">updating...</span>}
      </div>

      {error && !loading && (
        <div className="text-red-400 bg-red-950/30 p-2 rounded border border-red-900/50">
          SYS MSG: {error}
        </div>
      )}

      <div className="space-y-2">
        {airports.map(({ label, icao }) => {
          if (!icao) return null;
          
          // SimBrief values can contain whitespace or lowercase codes; normalize them for lookup and display.
          const safeIcao = icao.trim().toUpperCase();
          const metar = metars[safeIcao];
          
          const cat = metar?.fltcat || "VFR";
          const style = FLIGHT_CAT_COLORS[cat] || FLIGHT_CAT_COLORS.VFR;

          return (
            <div key={safeIcao} className="bg-zinc-950/60 p-2.5 rounded border border-zinc-800/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 font-bold">{label}</span>
                  <span className="text-sm font-bold text-zinc-100">{safeIcao}</span>
                </div>
                {metar ? (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${style.bg} ${style.text} ${style.border}`}>
                    {cat}
                  </span>
                ) : (
                  <span className="text-zinc-600 text-[10px]">N/A</span>
                )}
              </div>

              {metar ? (
                <p className="text-zinc-400 text-[11px] leading-relaxed break-all font-mono">
                  {metar.rawOb}
                </p>
              ) : (
                <p className="text-zinc-600 italic text-[11px]">
                  {loading ? "Fetching METAR..." : "Data unavailable."}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}