"use client"

import { useState, useMemo } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface HarvestData {
  id: string
  totalWeight: number
  harvestDate: Date
}

const chartConfig = {
  total: {
    label: "Total Panen (Kg)",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ProductionLineChart({ data }: { data: HarvestData[] }) {
  // Get unique years from the data for the filter
  const availableYears = useMemo(() => {
    const years = new Set(data.map((d) => new Date(d.harvestDate).getFullYear()))
    return Array.from(years).sort((a, b) => b - a)
  }, [data])

  const [selectedYear, setSelectedYear] = useState<string>("all")

  // Filter data based on selected year
  const filteredData = useMemo(() => {
    if (selectedYear === "all") return data
    return data.filter((d) => new Date(d.harvestDate).getFullYear().toString() === selectedYear)
  }, [data, selectedYear])

  // Group by month
  const chartData = useMemo(() => {
    const grouped = filteredData?.reduce((acc: any, curr) => {
      const date = new Date(curr.harvestDate)
      // Format like "Jan 2024" or just "Jan" if a specific year is selected
      const key = selectedYear === "all" 
        ? date.toLocaleString("id-ID", { month: "short", year: "numeric" })
        : date.toLocaleString("id-ID", { month: "long" })
      
      if (!acc[key]) acc[key] = { month: key, total: 0, _date: date.getTime() }
      acc[key].total += curr.totalWeight
      return acc
    }, {})

    // Sort by actual date
    return Object.values(grouped || {}).sort((a: any, b: any) => a._date - b._date)
  }, [filteredData, selectedYear])

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Grafik Produksi</CardTitle>
          <CardDescription>
            Menampilkan total berat panen {selectedYear === "all" ? "sepanjang waktu" : `pada tahun ${selectedYear}`}
          </CardDescription>
        </div>
        <div className="flex items-center px-6 py-4 sm:py-6 sm:border-l">
          <div className="flex flex-col gap-1.5 w-full sm:w-[150px]">
            <label className="text-xs text-muted-foreground font-medium">Filter Tahun</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="h-8">
                <SelectValue placeholder="Pilih Tahun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Waktu</SelectItem>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          {chartData.length > 0 ? (
            <LineChart
              data={chartData}
              margin={{
                left: 12,
                right: 12,
                top: 12,
                bottom: 12,
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `${value} Kg`}
                width={60}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel={false}
                    formatter={(value) => (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{value}</span>
                        <span className="text-muted-foreground">Kg</span>
                      </div>
                    )}
                  />
                }
              />
              <Line
                dataKey="total"
                type="monotone"
                stroke="var(--color-total)"
                strokeWidth={2}
                dot={{
                  fill: "var(--color-total)",
                }}
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Belum ada data panen untuk ditampilkan.
            </div>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
