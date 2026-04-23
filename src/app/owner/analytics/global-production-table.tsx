"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AggregatedHarvest } from "./global-production-chart"

export default function GlobalProductionTable({ data }: { data: AggregatedHarvest[] }) {
  // Sort descending (newest first) for the table
  const tableData = [...data].sort((a, b) => b.sortKey.localeCompare(a.sortKey));

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Data Panen Bulanan</CardTitle>
        <CardDescription>Rincian tabel produksi gabungan dari bulan ke bulan.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border h-[350px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background/95 backdrop-blur z-10">
              <TableRow>
                <TableHead>Periode</TableHead>
                <TableHead className="text-right">Total Panen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.length > 0 ? (
                tableData.map((row) => (
                  <TableRow key={row.sortKey}>
                    <TableCell className="font-medium">{row.period}</TableCell>
                    <TableCell className="text-right font-semibold text-green-600 dark:text-green-500">
                      {row.totalWeight.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">Kg</span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                    Belum ada data.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
