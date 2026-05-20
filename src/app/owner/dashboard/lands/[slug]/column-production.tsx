"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { deleteProduction } from "./action"
import React from "react"

export type Production = {
    id: any
    harvestDate: any
    totalWeight: any
    variety: any
    notes: any
    landId: any
}

export const productionColumns: ColumnDef<Production>[] = [
   {
        accessorKey: "harvestDate",
        header: "Tanggal Panen",
        cell: ({ row }) => {
            const date = new Date(row.getValue("harvestDate"))
            return <div>{date.toLocaleDateString('id-ID', { 
                day: '2-digit', 
                month: 'long', 
                year: 'numeric' 
            })}</div>
        }
    },

    {
        accessorKey: "totalWeight",
        header: "Total Berat (Kg)",
        cell: ({ row }) => {
            const weight = parseFloat(row.getValue("totalWeight"))
            return <div className="font-medium">{weight.toFixed(2)} Kg</div>
        }
    },
    {
        accessorKey: "variety",
        header: "Varietas",
        cell: ({ row }) => (
            <div>{row.getValue("variety") || "-"}</div>
        )
    },
    {
        accessorKey: "notes",
        header: "Catatan",
        cell: ({ row }) => (
            <div className="max-w-50 truncate text-muted-foreground italic">
                {row.getValue("notes") || "-"}
            </div>
        )
    },
{
        id: "actions",
        cell: ({ row }) => {
            const plants = row.original

            const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
            const handleDelete = (id: any) => {
                toast.promise(deleteProduction(id), {
                    loading: 'Sedang menghapus ..',
                    success: (data) => {
                        setShowDeleteDialog(false);
                        return 'berhasil dihapus!';
                    },
                    error: (err) => {
                        return 'Gagal menghapus  ' + (err.message || 'Terjadi kesalahan');
                    },
                    position: "top-right"
                });
            }
            

            return (
                <>
                    <DropdownMenu>
                        {/* Gunakan render prop untuk menghindari <button> di dalam <button> */}
                        <DropdownMenuTrigger
                            render={(props) => (
                                <Button
                                    {...props}
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                >
                                    <span className="sr-only">Open menu</span>
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
                                Delete
                            </DropdownMenuItem>

                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Hapus plant</DialogTitle>
                                <DialogDescription>
                                    Apakah Anda yakin ingin menghapus 
                                    Tindakan ini tidak dapat dibatalkan.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowDeleteDialog(false)}
                                >
                                    Batal
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => {
                                        handleDelete(plants.id)
                                        setShowDeleteDialog(false);
                                    }}
                                >
                                    Delete
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </>
            )
        },
    },
]