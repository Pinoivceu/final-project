"use client"

import React, { useState } from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
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
import { Badge } from "@/components/ui/badge"
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
    ToggleLeft,
} from "lucide-react"
import { toast } from "sonner"
import { deletePlant, togglePlantStatus } from "./action"
import { EditPlantForm } from "./plant-form"

export type PlantRow = {
    id: number
    variety: string
    status: string
    plantedAt: Date | null
    locationCoordinate: any
    landId: string
}

function ActionsCell({ plant }: { plant: PlantRow }) {
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)

    const handleDelete = () => {
        toast.promise(deletePlant(plant.id), {
            loading: "Menghapus tanaman...",
            success: "Tanaman berhasil dihapus.",
            error: (err) => err.message,
        })
        setDeleteOpen(false)
    }

    const handleToggle = () => {
        toast.promise(togglePlantStatus(plant.id, plant.status), {
            loading: "Mengubah status...",
            success: `Status diubah ke ${plant.status === "active" ? "Tidak Aktif" : "Aktif"}`,
            error: (err) => err.message,
        })
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
                    <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setEditOpen(true)} className="gap-2 cursor-pointer">
                            <Pencil className="size-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleToggle} className="gap-2 cursor-pointer">
                            <ToggleLeft className="size-4" />
                            {plant.status === "active" ? "Nonaktifkan" : "Aktifkan"}
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
            </DropdownMenu>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Tanaman #{plant.id}</DialogTitle>
                        <DialogDescription>Perbarui informasi tanaman ini.</DialogDescription>
                    </DialogHeader>
                    <EditPlantForm plant={plant} onSuccess={() => setEditOpen(false)} />
                </DialogContent>
            </Dialog>

            {/* Delete Confirm */}
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Tanaman?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tanaman <b>{plant.variety}</b> (#{plant.id}) akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
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
            </AlertDialog>
        </>
    )
}

export const plantColumns: ColumnDef<PlantRow>[] = [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
            <span className="font-mono text-xs text-muted-foreground">#{row.original.id}</span>
        ),
    },
    {
        accessorKey: "variety",
        header: "Varietas",
        cell: ({ row }) => (
            <span className="font-medium text-sm">{row.original.variety}</span>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            row.original.status === "active"
                ? <Badge className="bg-primary text-primary-foreground text-xs">Aktif</Badge>
                : <Badge variant="secondary" className="text-xs">Tidak Aktif</Badge>
        ),
    },
    {
        accessorKey: "plantedAt",
        header: "Ditanam",
        cell: ({ row }) => {
            const d = row.original.plantedAt
            if (!d) return <span className="text-xs text-muted-foreground">-</span>
            return (
                <span className="text-xs">
                    {new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                </span>
            )
        },
    },
    {
        accessorKey: "locationCoordinate",
        header: "Koordinat",
        cell: ({ row }) => {
            const loc = row.original.locationCoordinate as { lat?: number; lng?: number } | null
            if (!loc?.lat || !loc?.lng) return <span className="text-xs text-muted-foreground">-</span>
            return (
                <span className="text-xs font-mono text-muted-foreground">
                    {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                </span>
            )
        },
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => <ActionsCell plant={row.original} />,
    },
]

export function PlantsTable({ data, landId }: { data: PlantRow[]; landId: string }) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [addOpen, setAddOpen] = useState(false)

    const table = useReactTable({
        data,
        columns: plantColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: { columnFilters },
        initialState: { pagination: { pageSize: 10 } },
    })

    return (
        <div className="flex flex-col gap-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3">
                <Input
                    placeholder="Cari varietas..."
                    value={(table.getColumn("variety")?.getFilterValue() as string) ?? ""}
                    onChange={(e) => table.getColumn("variety")?.setFilterValue(e.target.value)}
                    className="max-w-xs h-9"
                />
                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                    <DialogTrigger render={
                        <Button size="sm" className="gap-2 shrink-0">
                            + Tambah Tanaman
                        </Button>
                    } />
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Tambah Tanaman Baru</DialogTitle>
                            <DialogDescription>Daftarkan tanaman baru ke lahan ini.</DialogDescription>
                        </DialogHeader>
                        {/* Import AddPlantForm inline to avoid circular deps */}
                        <AddPlantFormInline landId={landId} onSuccess={() => setAddOpen(false)} />
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
                                <TableCell colSpan={plantColumns.length} className="h-24 text-center text-sm text-muted-foreground">
                                    Belum ada tanaman di lahan ini.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-1">
                <p className="text-sm text-muted-foreground">
                    {table.getFilteredRowModel().rows.length} tanaman
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

// Inline AddPlantForm to avoid circular import issue
function AddPlantFormInline({ landId, onSuccess }: { landId: string; onSuccess?: () => void }) {
    const [Form, setForm] = React.useState<any>(null)
    React.useEffect(() => {
        import("./plant-form").then((m) => setForm(() => m.AddPlantForm))
    }, [])
    if (!Form) return <div className="py-8 text-center text-muted-foreground text-sm">Memuat form...</div>
    return <Form landId={landId} onSuccess={onSuccess} />
}
