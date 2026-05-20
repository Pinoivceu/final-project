"use client"

import { MapContainer, TileLayer, Polygon, CircleMarker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "@geoman-io/leaflet-geoman-free"
import { Plant, Land } from "../../../../../../client/generated/prisma/client"
import "leaflet/dist/leaflet.css"
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import { useEffect, useMemo } from "react";

function MapFitBounds({ coords }: { coords: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [10, 10] });
    }
  }, [coords, map]);
  return null;
}

export default function MapDensity({ plants, land }: { plants: Plant[], land: Land | null }) {
  // Parsing land coordinates
  const polygonCoords = useMemo(() => {
    const result: [number, number][] = [];
    if (land?.coordinates) {
      try {
        const data = land.coordinates as any;

        // Handle GeoJSON Feature format
        if (data && data.type === 'Feature' && data.geometry?.type === 'Polygon' && Array.isArray(data.geometry.coordinates)) {
          // The first array represents the exterior ring
          const ring = data.geometry.coordinates[0];
          if (Array.isArray(ring)) {
            for (const coord of ring) {
              if (Array.isArray(coord) && coord.length >= 2) {
                const lng = coord[0];
                const lat = coord[1];
                if (typeof lat === 'number' && typeof lng === 'number') {
                  result.push([lat, lng]);
                }
              }
            }
          }
        }
        // Handle direct GeoJSON Polygon format
        else if (data && data.type === 'Polygon' && Array.isArray(data.coordinates)) {
          const ring = data.coordinates[0];
          if (Array.isArray(ring)) {
            for (const coord of ring) {
              if (Array.isArray(coord) && coord.length >= 2) {
                const lng = coord[0];
                const lat = coord[1];
                if (typeof lat === 'number' && typeof lng === 'number') {
                  result.push([lat, lng]);
                }
              }
            }
          }
        }
        // Handle array of {lat, lng} format
        else if (Array.isArray(data)) {
          const flatCoords = data.flat(Infinity);
          for (const c of flatCoords) {
            if (c && typeof c.lat === 'number' && typeof c.lng === 'number') {
              result.push([c.lat, c.lng]);
            }
          }
        }
      } catch (e) {
        console.error("Failed to parse land coordinates", e);
      }
    }
    return result;
  }, [land]);

  return (
    <div className="h-[400px] w-full rounded-md border overflow-hidden relative z-0">
      <MapContainer
        center={[-3.729425736085605, 102.63329254770554]}
        zoom={13}
        maxZoom={24}
        style={{ height: "100%", width: "100%", zIndex: 1 }}
      >
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
          maxNativeZoom={19}
          maxZoom={30}
        />

        {polygonCoords.length > 0 && (
          <>
            <Polygon positions={polygonCoords} pathOptions={{ color: '#ffffff', fillColor: '#10b981', fillOpacity: 0.5, weight: 2 }} />
            <MapFitBounds coords={polygonCoords} />
          </>
        )}

        {plants && plants.map((plant) => {
          if (plant.locationCoordinate) {
            const loc = plant.locationCoordinate as { lat: number, lng: number };
            if (typeof loc.lat === 'number' && typeof loc.lng === 'number') {
              return (
                <CircleMarker
                  key={plant.id}
                  center={[loc.lat, loc.lng]}
                  radius={3}
                  pathOptions={{ color: '#ffffff', fillColor: '#f59e0b', fillOpacity: 1, weight: 1 }}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong>ID:</strong> {plant.id} <br />
                      <strong>Varietas:</strong> {plant.variety} <br />
                      <strong>Status:</strong> {plant.status}
                    </div>
                  </Popup>
                </CircleMarker>
              )
            }
          }
          return null;
        })}
      </MapContainer>
    </div>
  );
}