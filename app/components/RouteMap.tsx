"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Polyline, CircleMarker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface RouteMapProps {
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
}

function MapBounds({ bounds }: { bounds: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length === 2) {
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [map, bounds]);
  return null;
}

export default function RouteMap({ originLat, originLng, destLat, destLng }: RouteMapProps) {
  const originCoords: [number, number] = [originLat, originLng];
  const destCoords: [number, number] = [destLat, destLng];
  const routeLine: [number, number][] = [originCoords, destCoords];

  return (
    <div className="w-full h-64 rounded border border-zinc-800 overflow-hidden relative">
      <MapContainer
        center={originCoords}
        zoom={4}
        className="w-full h-full bg-zinc-950"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        />

        <Polyline
          positions={routeLine}
          pathOptions={{ color: "#06b6d4", weight: 3, opacity: 0.8, dashArray: "6, 8" }}
        />

        <CircleMarker
          center={originCoords}
          radius={6}
          pathOptions={{ color: "#10b981", fillColor: "#10b981", fillOpacity: 0.9 }}
        />

        <CircleMarker
          center={destCoords}
          radius={6}
          pathOptions={{ color: "#ef4444", fillColor: "#ef4444", fillOpacity: 0.9 }}
        />

        <MapBounds bounds={routeLine} />
      </MapContainer>
    </div>
  );
}