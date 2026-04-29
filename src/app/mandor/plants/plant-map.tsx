"use client"

import dynamic from "next/dynamic"

const MapDensity = dynamic(
    () => import("@/app/owner/dashboard/lands/[slug]/map-plant-density"),
    {
        ssr: false,
        loading: () => (
            <div className="h-[420px] w-full rounded-xl bg-muted animate-pulse flex items-center justify-center text-muted-foreground text-sm">
                Memuat peta...
            </div>
        ),
    }
)

export function PlantMap({ plants, land }: { plants: any[]; land: any }) {
    return (
        <div className="w-full rounded-xl overflow-hidden border">
            <MapDensity plants={plants} land={land} />
        </div>
    )
}
