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
import { deleteLand } from "./action";
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
}

export default function FieldsCard({
    id,
    name,
    foreman,
    area,
    image,
}: FieldsCardProps) {
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

    const handleDelete = (id: any) => {
        toast.promise(deleteLand(id), {
            loading: 'Sedang menghapus lahan...',
            success: (data) => {
                setShowDeleteDialog(false);
                return 'Lahan berhasil dihapus!';
            },
            error: (err:any) => {
                return 'Gagal menghapus lahan: ' + (err.message || 'Terjadi kesalahan');
            },
            position: "top-right"
        });
    }

    function handleDisable(id: any): void {
        throw new Error("Function not implemented.");
    }

    return (
        <div className="border bg-card rounded-2xl p-3 flex flex-col gap-3 hover:border-neutral-700 transition-all cursor-pointer group">
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
                        <DropdownMenuItem
                            className="text-destructive cursor-pointer"
                            onClick={() => setShowDeleteDialog(true)}
                        >
                            Delete Land
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => handleDisable(id)}>
                            Nonaktifkan
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Hapus User</DialogTitle>
                            <DialogDescription>
                                Apakah Anda yakin ingin menghapus?
                                Tindakan ini tidak dapat dibatalkan.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant={"default"}
                                onClick={() => setShowDeleteDialog(false)}
                            >
                                Batal
                            </Button>
                            <Button variant={"destructive"}
                                onClick={() => {
                                    handleDelete(id)
                                    setShowDeleteDialog(false);
                                }}
                            >
                                Delete
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
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


