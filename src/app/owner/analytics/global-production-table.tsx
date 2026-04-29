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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

export type GlobalHarvestRow = {
    id: string
    totalWeight: number
    harvestDate: Date
    notes: string | null
    createdAt: Date
    land: {
        landName: string
        mandor: {
            fullName: string
        }
    }
}

export const harvestColumns: ColumnDef<GlobalHarvestRow>[] = [
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
        accessorFn: (row) => row.land.landName,
        id: "landName",
        header: "Lahan",
        cell: ({ row }) => (
            <span className="font-medium text-sm">
                {row.original.land.landName}
            </span>
        ),
    },
    {
        accessorFn: (row) => row.land.mandor.fullName,
        id: "mandorName",
        header: "Mandor",
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">
                {row.original.land.mandor.fullName}
            </span>
        ),
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
            <span className="text-sm text-muted-foreground line-clamp-1 max-w-[200px]">
                {row.original.notes || "-"}
            </span>
        ),
    },
]

export function GlobalProductionTable({ data }: { data: GlobalHarvestRow[] }) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [sorting, setSorting] = useState<SortingState>([{ id: "harvestDate", desc: true }])

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
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Data Panen Global</CardTitle>
                <CardDescription>Rincian seluruh hasil panen dari semua lahan.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between gap-3">
                        <Input
                            placeholder="Cari lahan..."
                            value={(table.getColumn("landName")?.getFilterValue() as string) ?? ""}
                            onChange={(e) => table.getColumn("landName")?.setFilterValue(e.target.value)}
                            className="max-w-xs h-9"
                        />
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
            </CardContent>
        </Card>
    )
}
