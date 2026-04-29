"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

export const treatmentLogsColumns: ColumnDef<any>[] = [
  {
    accessorKey: "title",
    header: "Judul Perawatan",
    cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
  },
  {
    accessorKey: "activityType",
    header: "Jenis Aktivitas",
    cell: ({ row }) => <Badge variant="secondary">{row.original.activityType}</Badge>,
  },
  {
    accessorKey: "mandor.fullName",
    header: "Dikerjakan Oleh",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.mandor?.fullName || "Anonim"}</span>,
  },
  {
    accessorKey: "completedAt",
    header: "Tanggal Selesai",
    cell: ({ row }) => {
      const date = row.original.completedAt;
      if (!date) return <span className="text-muted-foreground">-</span>;
      return (
        <span>
          {new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric"
          })}
        </span>
      );
    }
  },
  {
    accessorKey: "description",
    header: "Catatan Pelaksanaan",
    cell: ({ row }) => {
        const desc = row.original.description;
        return <span className="text-muted-foreground truncate max-w-[200px] inline-block" title={desc}>{desc || "Tidak ada catatan"}</span>;
    }
  }
]
