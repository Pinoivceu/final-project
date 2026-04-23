"use client"
import dynamic from 'next/dynamic';

export interface GlobalMapLand {
  id: string;
  name: string;
  coordinates: any;
  areaSize: number;
  plantCount: number;
  density: number; 
  totalProduction: number;
  productivity: number; 
}

const GlobalMap = dynamic(() => import('./global-map'), {
  ssr: false,
  loading: () => <div className="h-[calc(100vh-100px)] w-full bg-muted animate-pulse rounded-lg flex items-center justify-center">Loading Map...</div>
});

export default function GlobalMapWrapper({ lands }: { lands: GlobalMapLand[] }) {
  return (
    <div className="w-full h-[calc(100vh-120px)] bg-card rounded-lg overflow-hidden border shadow-sm relative">
      <GlobalMap lands={lands} />
    </div>
  );
}
