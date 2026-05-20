"use client"
import Link from "next/link";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toggleLandStatus } from "./action";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import React from "react";
import { toast } from "sonner"

export interface FieldsCardProps {
    id: any
    name: any;
    foreman: any;
    area: any;
    image: any;
    isActive: boolean;
}

export default function FieldsCard({
    id,
    name,
    foreman,
    area,
    image,
    isActive,
}: FieldsCardProps) {
    const handleToggleStatus = (id: any, currentStatus: boolean) => {
        const newStatus = !currentStatus;
        const actionWord = newStatus ? "mengaktifkan" : "menonaktifkan";
        
        toast.promise(toggleLandStatus(id, newStatus), {
            loading: `Sedang ${actionWord} lahan...`,
            success: `Lahan berhasil di${newStatus ? "aktifkan" : "nonaktifkan"}!`,
            error: `Gagal ${actionWord} lahan`,
            position: "top-right"
        });
    }

    return (
        <div className={`border bg-card rounded-2xl p-3 flex flex-col gap-3 hover:border-neutral-700 transition-all cursor-pointer group relative ${!isActive ? 'opacity-60 grayscale' : ''}`}>
            {!isActive && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-black/70 text-white px-4 py-2 rounded-lg font-bold">
                    TIDAK AKTIF
                </div>
            )}
            <div className="flex flex-row justify-between">
                <h2 className=" text-base font-bold ">
                    {name}
                </h2>
                <DropdownMenu>
                    {/* Gunakan render prop untuk menghindari <button> di dalam <button> */}
                    <DropdownMenuTrigger
                        render={(props) => (
                            <Button
                                {...props}
                                variant={"ghost"}

                                className="rounded-4xl px-2 p-0 hover:bg-accent justify-center"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        )}
                    />

                    <DropdownMenuContent align="end" className="w-40">
                        {/* FIX: Bungkus label dengan Group */}
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleToggleStatus(id, isActive)}>
                            {isActive ? "Nonaktifkan Lahan" : "Aktifkan Lahan"}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <Link href={`/owner/dashboard/lands/${id}`} className="w-full aspect-4/3 overflow-hidden rounded-xl ">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </Link>

            {/* 3. Footer Data (Mandor & Luas) */}
            <div className="flex items-center justify-between px-1 mt-1">
                {/* Mandor Section */}
                <div className="flex items-center gap-1.5">
                    <span className="text-sm" role="img" aria-label="foreman">👨‍🌾</span>
                    <span className="  text-sm">
                        {foreman}
                    </span>
                </div>

                <div className="flex items-center gap-1.5">
                    <span className="text-sm" role="img" aria-label="area">📐</span>
                    <span className=" text-sm">
                        {area}
                    </span>
                </div>
            </div>
        </div>

    )
}


