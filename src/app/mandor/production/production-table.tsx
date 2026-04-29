"use client"

import React, { useState } from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    MoreHorizontal,
    Pencil,
    Trash2,
    ArrowUpDown,
    Plus,
} from "lucide-react"
import { toast } from "sonner"
import { deleteHarvest } from "./action"
import { EditProductionForm } from "./production-form"
import { AddProductionForm } from "./production-form"

export type HarvestRow = {
    id: string
    totalWeight: number
    harvestDate: Date
    notes: string | null
    createdAt: Date
}

function ActionsCell({ harvest }: { harvest: HarvestRow }) {
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)

    const handleDelete = () => {
        toast.promise(deleteHarvest(harvest.id), {
            loading: "Menghapus data panen...",
            success: "Data panen berhasil dihapus.",
            error: (err) => err.message,
        })
        setDeleteOpen(false)
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuGroup>
                    <DropdownMenuTrigger
                        render={(props) => (
                            <Button {...props} variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Buka menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        )}
                    />
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setEditOpen(true)} className="gap-2 cursor-pointer">
                            <Pencil className="size-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                            onClick={() => setDeleteOpen(true)}
                        >
                            <Trash2 className="size-4" /> Hapus
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenuGroup>

            </DropdownMenu >

            {/* Edit Dialog */}
            < Dialog open={editOpen} onOpenChange={setEditOpen} >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Data Panen</DialogTitle>
                        <DialogDescription>Perbarui informasi hasil panen ini.</DialogDescription>
                    </DialogHeader>
                    <EditProductionForm harvest={harvest} onSuccess={() => setEditOpen(false)} />
                </DialogContent>
            </Dialog >

            {/* Delete Confirm */}
            < AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen} >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Data Panen?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Data panen seberat <b>{harvest.totalWeight} Kg</b> pada tanggal{" "}
                            <b>{new Date(harvest.harvestDate).toLocaleDateString("id-ID")}</b> akan dihapus permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90"
                            onClick={handleDelete}
                        >
                            Ya, Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog >
        </>
    )
}

export const harvestColumns: ColumnDef<HarvestRow>[] = [
    {
        accessorKey: "harvestDate",
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 gap-1 -ml-2"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Tanggal Panen
                <ArrowUpDown className="size-3" />
            </Button>
        ),
        cell: ({ row }) => (
            <span className="text-sm">
                {new Date(row.original.harvestDate).toLocaleDateString("id-ID", {
                    day: "numeric", month: "long", year: "numeric",
                })}
            </span>
        ),
        sortingFn: "datetime",
    },
    {
        accessorKey: "totalWeight",
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 gap-1 -ml-2"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Berat (Kg)
                <ArrowUpDown className="size-3" />
            </Button>
        ),
        cell: ({ row }) => (
            <span className="font-semibold text-sm text-emerald-600 dark:text-emerald-400">
                {row.original.totalWeight.toLocaleString("id-ID")} Kg
            </span>
        ),
        sortingFn: "basic",
    },
    {
        accessorKey: "notes",
        header: "Catatan",
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground line-clamp-1 max-w-xs">
                {row.original.notes || "-"}
            </span>
        ),
    },
    {
        accessorKey: "createdAt",
        header: "Dicatat Pada",
        cell: ({ row }) => (
            <span className="text-xs text-muted-foreground">
                {new Date(row.original.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric", month: "short", year: "numeric",
                })}
            </span>
        ),
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => <ActionsCell harvest={row.original} />,
    },
]

export function ProductionTable({ data, landId }: { data: HarvestRow[]; landId: string }) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [sorting, setSorting] = useState<SortingState>([{ id: "harvestDate", desc: true }])
    const [addOpen, setAddOpen] = useState(false)

    const table = useReactTable({
        data,
        columns: harvestColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onSortingChange: setSorting,
        state: { columnFilters, sorting },
        initialState: { pagination: { pageSize: 10 } },
    })

    return (
        <div className="flex flex-col gap-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3">
                <Input
                    placeholder="Cari catatan..."
                    value={(table.getColumn("notes")?.getFilterValue() as string) ?? ""}
                    onChange={(e) => table.getColumn("notes")?.setFilterValue(e.target.value)}
                    className="max-w-xs h-9"
                />
                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                    <DialogTrigger render={
                        <Button size="sm" className="gap-2 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground">
                            <Plus className="size-4" /> Tambah Produksi
                        </Button>
                    } />
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Catat Hasil Panen</DialogTitle>
                            <DialogDescription>Masukkan data hasil panen untuk lahan ini.</DialogDescription>
                        </DialogHeader>
                        <AddProductionForm landId={landId} onSuccess={() => setAddOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Table */}
            <div className="rounded-xl border overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/40">
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id}>
                                {hg.headers.map((header) => (
                                    <TableHead key={header.id} className="text-xs">
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="hover:bg-muted/30">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={harvestColumns.length} className="h-24 text-center text-sm text-muted-foreground">
                                    Belum ada data panen tercatat.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-1">
                <p className="text-sm text-muted-foreground">
                    {table.getFilteredRowModel().rows.length} entri
                </p>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Per halaman</span>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(v) => table.setPageSize(Number(v))}
                        >
                            <SelectTrigger className="h-8 w-16">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 50].map((s) => (
                                    <SelectItem key={s} value={`${s}`}>{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <span className="text-xs text-muted-foreground">
                        Hal {table.getState().pagination.pageIndex + 1} / {Math.max(1, table.getPageCount())}
                    </span>
                    <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" className="size-8" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                            <ChevronsLeft className="size-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="size-8" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                            <ChevronLeft className="size-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="size-8" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                            <ChevronRight className="size-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="size-8" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
                            <ChevronsRight className="size-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
