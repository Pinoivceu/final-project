"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import React from "react"
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
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup
} from "@/components/ui/dropdown-menu"
import { deleteUser, updateUserStatus } from "./action"
import { toast } from "sonner"
export type Users = {
    id: any
    fullName: any
    image: any
    phoneNumber: any
    role: any
    status: any
}



export const columns: ColumnDef<Users>[] = [
    {
        accessorKey: "fullName",
        header: "User",
        cell: ({ row }) => {
            const user = row.original;
            return (
                <div className="flex items-center gap-3">
                    <img
                        src={user.image || "/default-avatar.png"} // Fallback jika foto kosong
                        alt={user.fullName}
                        className="h-8 w-8 rounded-full object-cover border"
                    />
                    <span className="font-medium">{user.fullName}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "phoneNumber",
        header: "Phone Number",
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
            <span className="capitalize">{row.getValue("role")}</span>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <div className={`px-2 py-1 rounded-full text-xs w-fit ${status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                    {status}
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original;
            const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
            const handleDelete = (id: any) => {
                toast.promise(deleteUser(id), {
                    loading: 'Sedang menghapus user...',
                    success: (data) => {
                        setShowDeleteDialog(false);
                        return 'User berhasil dihapus!';
                    },
                    error: (err) => {
                        return 'Gagal menghapus user: ' + (err.message || 'Terjadi kesalahan');
                    },
                    position: "top-right"
                });
            }
            const handleDisable = (id: any) => {
                toast.promise(updateUserStatus(id), {
                    loading: 'Mengubah status user...',
                    success: (data) => {
                        return 'Status berhasil diubah!';
                    },
                    error: (err) => {
                        return 'Gagal mengubah status: ' + (err.message || 'Terjadi kesalahan');
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
                                Delete User
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => handleDisable(user.id)}>
                                Nonaktifkan
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Hapus User</DialogTitle>
                                <DialogDescription>
                                    Apakah Anda yakin ingin menghapus <strong>{user.fullName}</strong>?
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
                                        handleDelete(user.id)
                                        setShowDeleteDialog(false);
                                    }}
                                >
                                    Delete
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                </>
            );
        },
    },
]