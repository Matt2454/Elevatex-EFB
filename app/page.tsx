"client";
"use client";

import {useState } from "react"; 

export default function Home() {
  const [pilotid, setPilotid] = useState("");
  const [flightdata, setflightdata] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //call our internal API
  const hadlefetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pilotid) return;

    setLoading(true);
    setError("");
    
    try {
      const response = await fetch(`/api/simbrief?pilotid=${pilotid}`);
      const data = await res.json();

      if (res.ok) {
        throw new Error(data.message || "Failed fetch flight data");
      }

      setflightdata(data);
      catch (error: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    return (
    <main className="min-h-screen bg-zinc-950 text-zinc-300 font-mono p-6 flex flex-col items-center">
      <div className="w-full max-w-xl border border-zinc-800 bg-zinc-900 p-6 rounded-sm shadow-2xl mt-10">
        
        {/* Header dell'EFB */}
        <div className="border-b border-zinc-800 pb-4 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-white font-bold tracking-wider text-lg">ELEVATEX // EFB</h1>
            <p className="text-xs text-zinc-500">FLIGHT DATA INITIALIZATION</p>
          </div>
          <div className="text-xs px-2 py-1 bg-zinc-800 text-zinc-400 rounded">
            SYS ONLINE
          </div>
        </div>

        {/* Form di inserimento ID */}
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

        {/* Gestione Errori */}
        {error && (
          <div className="mt-4 p-3 bg-red-950/40 border border-red-900 text-red-400 text-xs rounded">
            ERROR: {error}
          </div>
        )}

        {/* Preview dei dati grezzi ricevuti */}
        {flightData && (
          <div className="mt-6 border-t border-zinc-800 pt-4">
            <h2 className="text-xs font-bold text-zinc-400 mb-2 uppercase">OFP Loaded Successfully</h2>
            <div className="bg-zinc-950 p-3 rounded border border-zinc-800 text-xs text-zinc-400 overflow-x-auto max-h-40">
              <pre>{JSON.stringify(flightData, null, 2)}</pre>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}