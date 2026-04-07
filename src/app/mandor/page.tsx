"use client"
import { Card } from '@/components/ui/card';
import { Flower2, Sprout } from 'lucide-react';
import dynamic from 'next/dynamic';

export default function Home() {
  const stats = [
    { label: "Luas Lahan", value: "1,2 Ha" },
    { label: "Populasi Tanaman", value: "1250 Batang" },
    { label: "Estimasi Produksi", value: "1200 Kg" },
    { label: "Ketinggian Lahan", value: "400 MDPL" },
  ];

  const MapView = dynamic(() => import('@/components/map'), {
    ssr: false,
    loading: () => <p>Loading Map...</p>
  })

  return (
    <Card className="w-full max-w-4xl m-24  p-6">
      <h2 className="text-xl font-bold mb-6">Summary Card</h2>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="rounded-xl p-4 text-center"
          >
            <p className="text-lg font-bold">{item.value}</p>
            <p className="text-xs mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Map Container */}
      <div className="relative rounded-2xl overflow-hidden aspect-video mb-6 border border-zinc-800">
        <MapView />

        {/* Legend Productivity (Overlay Kanan Bawah) */}
        <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-3 w-20 flex flex-col items-center gap-2">
          <span className="text-[10px] text-white/70">Good</span>
          <div className="w-3 h-24 bg-linear-to-t from-red-600 via-yellow-400 to-green-500 rounded-full" />
          <span className="text-[10px] text-white/70">Bad</span>
        </div>

      </div>

     
    </Card>
  );
}
