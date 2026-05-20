"use client"

import { useMemo } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface HarvestData {
  id: string
  totalWeight: number
  harvestDate: Date
}

const chartConfig = {
  total: {
    label: "Total Panen Global (Kg)",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function GlobalProductionChart({ data }: { data: HarvestData[] }) {
  // Group by year
  const chartData = useMemo(() => {
    const grouped = data?.reduce((acc: any, curr) => {
      const date = new Date(curr.harvestDate)
      const key = date.getFullYear().toString()
      
      if (!acc[key]) acc[key] = { year: key, total: 0, _date: date.getFullYear() }
      acc[key].total += curr.totalWeight
      return acc
    }, {})

    // Sort by actual date
    return Object.values(grouped || {}).sort((a: any, b: any) => a._date - b._date)
  }, [data])

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Tren Produksi Global Tahunan</CardTitle>
          <CardDescription>
            Total akumulasi hasil panen dari seluruh lahan per tahun
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6 mt-4">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
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
                dataKey="year"
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
                width={80}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel={false}
                    formatter={(value) => (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{Number(value).toFixed(1)}</span>
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
