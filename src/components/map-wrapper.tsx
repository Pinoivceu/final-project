"use client"
import dynamic from 'next/dynamic';
import { Plant, Land } from '@prisma/client';

const MapDensity = dynamic(() => import('@/app/owner/dashboard/lands/[slug]/map-plant-density'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-muted animate-pulse" />
});

export default function DensityMap({ plants, land }: { plants: Plant[], land: Land | null }) {
  return (
    <div className="w-full p-6 bg-card rounded-lg">
      <MapDensity plants={plants} land={land} />
    </div>
  );
}