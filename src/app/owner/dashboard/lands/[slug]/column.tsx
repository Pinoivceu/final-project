"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Plants = {
    id: any
    variety: any
    activeBranches: any
    locationCoordinate: any
    status: any
}

export const columns: ColumnDef<Plants>[] = [
    {
        accessorKey: "id",
        header: "Plants Id",
    },
    {
        accessorKey: "variety",
        header: "Variety",
    },
    {
        accessorKey: "activeBranches",
        header: "Branches",
    },
        {
        accessorKey: "plantedAt",
        header: "Planted At",
    },

    {
        accessorKey: "status",
        header: "Status",
    },
     {
    id: "actions",
    cell: ({ row }) => {
      const plants = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger >
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(plants.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]