"use client";

import { useState } from "react";

export default function Home() {
  const [pilotId, setPilotId] = useState("");
  const [flightData, setFlightData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Call internal SimBrief proxy API
  const handleFetchFlight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pilotId) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/simbrief?userid=${pilotId}`);
      const data = await res.json();
      console.log("SimBrief Data:", data);

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch flight plan");
      }

      setFlightData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-300 font-mono p-6 flex flex-col items-center">
      <div className="w-full max-w-xl border border-zinc-800 bg-zinc-900 p-6 rounded-sm shadow-2xl mt-10">
        
        {/* EFB Header */}
        <div className="border-b border-zinc-800 pb-4 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-white font-bold tracking-wider text-lg">ELEVATEX // EFB</h1>
            <p className="text-xs text-zinc-500">FLIGHT DATA INITIALIZATION</p>
          </div>
          <div className="text-xs px-2 py-1 bg-zinc-800 text-zinc-400 rounded">
            SYS ONLINE
          </div>
        </div>

        {/* Pilot ID Search Form */}
        <form onSubmit={handleFetchFlight} className="space-y-4">
          <div>
            <label className="block text-xs text-zinc-400 mb-2 uppercase tracking-wide">
              SimBrief Pilot ID / Username
            </label>
            <input
              type="text"
              value={pilotId}
              onChange={(e) => setPilotId(e.target.value)}
              placeholder="Enter ID..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white focus:outline-none focus:border-zinc-600 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase tracking-widest py-3 rounded transition duration-200 disabled:opacity-50"
          >
            {loading ? "Fetching OFP..." : "Load Flight Plan"}
          </button>
        </form>

        {/* Error Notification */}
        {error && (
          <div className="mt-4 p-3 bg-red-950/40 border border-red-900 text-red-400 text-xs rounded">
            ERROR: {error}
          </div>
        )}

        {/* Flight Summary Card */}
        {flightData && (
          <div className="mt-6 border-t border-zinc-800 pt-4 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Flight Briefing</h2>
              <span className="text-xs text-emerald-400 font-bold">OFP LOADED</span>
            </div>

            {/* Route Summary */}
            <div className="bg-zinc-950 p-4 rounded border border-zinc-800 flex justify-between items-center">
              <div>
                <p className="text-xs text-zinc-500 uppercase">Origin</p>
                <p className="text-xl font-bold text-white">{flightData.origin?.icao_code || "N/A"}</p>
              </div>
              <div className="text-zinc-600 text-lg">---&gt;</div>
              <div className="text-right">
                <p className="text-xs text-zinc-500 uppercase">Destination</p>
                <p className="text-xl font-bold text-white">{flightData.destination?.icao_code || "N/A"}</p>
              </div>
            </div>

            {/* Aircraft & Flight Details */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-zinc-950 p-3 rounded border border-zinc-800">
                <span className="text-zinc-500 block">Aircraft</span>
              <span className="text-white font-bold">{flightData.aircraft?.icao_code || "N/A"}</span>              </div>
              <div className="bg-zinc-950 p-3 rounded border border-zinc-800">
                <span className="text-zinc-500 block">Flight Number</span>
                <span className="text-white font-bold">{flightData.general?.flight_number || "N/A"}</span>
              </div>
            </div>

            {/* Route Details */}
            <div className="bg-zinc-950 p-3 rounded border border-zinc-800">
              <span className="text-zinc-500 text-xs block mb-1">Route</span>
              <p className="text-xs text-zinc-300 font-mono break-all">
                {flightData.general?.route || "No route specified"}
              </p>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}