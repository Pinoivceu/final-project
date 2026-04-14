"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, FeatureGroup, useMap } from "react-leaflet"
import L from "leaflet"
import "@geoman-io/leaflet-geoman-free"
import "leaflet/dist/leaflet.css"
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import * as turf from "@turf/turf"


// Komponen internal untuk menangkap instance peta
function GeomanControls({ onSave }: { onSave: (geojson: any, area: number) => void }) {
  const map = useMap();

  // Fungsi pembantu agar logika perhitungan luas tidak ditulis berulang kali
  const handleGeometryChange = (layer: L.Polygon) => {
    const geojson = layer.toGeoJSON();

    // MENGHITUNG LUAS (dalam meter persegi)
    // Pastikan @turf/turf sudah diimport sebagai: import * as turf from "@turf/turf"
    const areaInMeters = turf.area(geojson);

    // Kirim data GeoJSON dan Luas ke parent (Dua Argumen)
    onSave(geojson, areaInMeters);
  };

  useEffect(() => {
    if (!map) return;

    map.pm.addControls({
      drawPolygon: true,
      editMode: true,
      removalMode: true,
      drawMarker: false, // Mematikan fitur lain agar fokus ke polygon
      drawPolyline: false,
    });

    map.on("pm:create", (e) => {
      const layer = e.layer as L.Polygon;

      // PERBAIKAN: Gunakan fungsi handleGeometryChange agar argumen onSave terpenuhi
      handleGeometryChange(layer);

      // Listener saat titik-titik polygon ditarik/diedit
      layer.on("pm:edit", (ev) => {
        handleGeometryChange(ev.target as L.Polygon);
      });

      // Listener saat polygon dihapus
      layer.on("pm:remove", () => {
        onSave(null, 0); // Reset data di parent jika dihapus
      });
    });

    return () => {
      map.pm.removeControls();
      map.off("pm:create"); // Bersihkan event listener
    };
  }, [map, onSave]);

  return null;
}

export default function MapEditor({ onSave }: { onSave: (geojson: any, area: number) => void }) {
  return (
    <div className="h-100 w-full rounded-md border overflow-hidden">
      <MapContainer
        center={[-3.729425736085605, 102.63329254770554]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
        <FeatureGroup>
          <GeomanControls onSave={onSave} />
        </FeatureGroup>
      </MapContainer>
    </div>
  );
}