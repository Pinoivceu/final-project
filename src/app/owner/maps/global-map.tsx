"use client"
import { useEffect, useState, useMemo } from 'react'
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { GlobalMapLand } from './global-map-wrapper'
import { Layers, Sprout, Activity, Map as MapIcon } from 'lucide-react'
import { formatAreaDisplay } from "@/lib/definitions"

// Fix standard Leaflet icon issues in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const parseCoordinates = (land: GlobalMapLand) => {
  // If it's a GeoJSON Polygon
  if (land.coordinates?.geometry?.coordinates?.[0]) {
    return land.coordinates.geometry.coordinates[0].map((c: number[]) => [c[1], c[0]] as [number, number]);
  }
  // If it's an array of {lat, lng}
  if (Array.isArray(land.coordinates)) {
    const validCoords = land.coordinates.filter(c => c.lat !== undefined && c.lng !== undefined);
    if (validCoords.length > 0) {
      return validCoords.map(c => [c.lat, c.lng] as [number, number]);
    }

    // If it's an array of [lng, lat]
    if (land.coordinates.length > 0 && Array.isArray(land.coordinates[0])) {
      return land.coordinates.map(c => [c[1], c[0]] as [number, number]);
    }
  }
  return [];
};

// Component to auto-fit map bounds to a specific land or all lands
function ZoomController({ lands, selectedLandId }: { lands: GlobalMapLand[], selectedLandId: string }) {
  const map = useMap();
  useEffect(() => {
    if (lands.length === 0) return;

    if (selectedLandId === 'all') {
      const allCoords: [number, number][] = [];
      lands.forEach(land => {
        allCoords.push(...parseCoordinates(land));
      });
      if (allCoords.length > 0) {
        map.fitBounds(L.latLngBounds(allCoords), { padding: [50, 50] });
      }
    } else {
      const land = lands.find(l => l.id === selectedLandId);
      if (land) {
        const coords = parseCoordinates(land);
        if (coords.length > 0) {
          map.fitBounds(L.latLngBounds(coords), { padding: [20, 20], maxZoom: 18 });
        }
      }
    }
  }, [lands, selectedLandId, map]);
  return null;
}

type LayerMode = 'default' | 'density' | 'productivity';

export default function GlobalMap({ lands }: { lands: GlobalMapLand[] }) {
  const [layerMode, setLayerMode] = useState<LayerMode>('default');
  const [selectedLandId, setSelectedLandId] = useState<string>('all');

  // Calculate min/max for color scaling
  const maxDensity = useMemo(() => Math.max(...lands.map(l => l.density), 1), [lands]);
  const maxProductivity = useMemo(() => Math.max(...lands.map(l => l.productivity), 1), [lands]);

  const getPolygonColor = (land: GlobalMapLand) => {
    if (layerMode === 'density') {
      // Scale from Red (0) to Green (120) based on density
      const ratio = land.density / maxDensity;
      const hue = ratio * 120;
      return `hsl(${hue}, 90%, 45%)`;
    }

    if (layerMode === 'productivity') {
      // Scale from Red (0) to Green (120) based on productivity
      const ratio = land.productivity / maxProductivity;
      const hue = ratio * 120;
      return `hsl(${hue}, 90%, 45%)`;
    }

    return '#3b82f6'; // Default blue
  };

  return (
    <div className="w-full h-full relative">
      {/* Layer Control Panel */}
      <div className="absolute top-4 right-4 z-[400] bg-card text-card-foreground rounded-lg shadow-md p-3 flex flex-col gap-2 min-w-[200px]">
        <div className="flex items-center gap-2 mb-1 border-b pb-2">
          <Layers className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold text-sm">Layer Options</h3>
        </div>

        <button
          onClick={() => setLayerMode('default')}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${layerMode === 'default' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 font-medium' : 'hover:bg-accent hover:text-accent-foreground'}`}
        >
          <MapIcon className="w-4 h-4" /> Default
        </button>

        <button
          onClick={() => setLayerMode('density')}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${layerMode === 'density' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 font-medium' : 'hover:bg-accent hover:text-accent-foreground'}`}
        >
          <Sprout className="w-4 h-4" /> Kepadatan Tanaman
        </button>

        <button
          onClick={() => setLayerMode('productivity')}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${layerMode === 'productivity' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200 font-medium' : 'hover:bg-accent hover:text-accent-foreground'}`}
        >
          <Activity className="w-4 h-4" /> Produktivitas
        </button>

        <div className="flex flex-col gap-1 mt-3 pt-3 border-t">
          <label className="text-xs font-semibold text-muted-foreground">Fokus Lokasi:</label>
          <select
            value={selectedLandId}
            onChange={(e) => setSelectedLandId(e.target.value)}
            className="w-full text-sm border rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground"
          >
            <option value="all">Semua Lahan</option>
            {lands.map(l => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Map Legend */}
      {layerMode !== 'default' && (
        <div className="absolute bottom-6 right-4 z-[400] bg-card text-card-foreground rounded-lg shadow-md p-3 text-xs">
          <div className="font-semibold mb-2">
            {layerMode === 'density' ? 'Kepadatan (Phn/Ha)' : 'Produktivitas (Kg/Phn)'}
          </div>
          <div className="flex items-center gap-2">
            <span>Rendah</span>
            <div className="w-24 h-3 rounded-full bg-gradient-to-r from-[hsl(0,90%,45%)] to-[hsl(120,90%,45%)]"></div>
            <span>Tinggi</span>
          </div>
        </div>
      )}

      <MapContainer
        center={[-3.7295, 102.6314]} // Default center (Bengkulu roughly)
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', zIndex: 10 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.google.com/intl/en_us/help/terms_maps/">Google</a>'
          url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
        />
        <ZoomController lands={lands} selectedLandId={selectedLandId} />

        {lands.map((land) => {
          const polyCoords = parseCoordinates(land);
          if (!polyCoords || polyCoords.length === 0) return null;

          const color = getPolygonColor(land);

          return (
            <Polygon
              key={land.id}
              positions={polyCoords}
              pathOptions={{
                color: '#ffffff',
                fillColor: color,
                fillOpacity: layerMode === 'default' ? 0.5 : 0.8,
                weight: 2
              }}
            >
              <Popup>
                <div className="min-w-[150px]">
                  <h3 className="font-bold text-lg border-b pb-1 mb-2">{land.name}</h3>
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Luas:</span>
                      <span className="font-medium">{formatAreaDisplay(land.areaSize)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pohon:</span>
                      <span className="font-medium">{land.plantCount}</span>
                    </div>
                    <div className="flex justify-between mt-1 pt-1 border-t">
                      <span className="text-muted-foreground text-xs">Kepadatan:</span>
                      <span className="font-semibold text-green-600">{land.density.toFixed(1)} <span className="text-xs font-normal">Phn/Ha</span></span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-xs">Produktivitas:</span>
                      <span className="font-semibold text-orange-600">{land.productivity.toFixed(2)} <span className="text-xs font-normal">Kg/Phn</span></span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Polygon>
          );
        })}
      </MapContainer>
    </div>
  );
}
