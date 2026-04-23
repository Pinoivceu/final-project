"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export interface AggregatedHarvest {
  period: string; // e.g. "Jan 2024"
  sortKey: string; // "2024-01" for sorting
  totalWeight: number;
}

export default function GlobalProductionChart({ data }: { data: AggregatedHarvest[] }) {
  // We want to sort chronologically for the chart
  const chartData = [...data].sort((a, b) => a.sortKey.localeCompare(b.sortKey));

  return (
    <Card className="col-span-1 xl:col-span-2">
      <CardHeader>
        <CardTitle>Tren Produksi Global</CardTitle>
        <CardDescription>Total akumulasi hasil panen kopi (Kg) dari seluruh lahan per bulan</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="period" 
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                  tickFormatter={(value) => {
                    // Split "Jan 2024" -> "Jan"
                    return value.split(' ')[0] || value;
                  }}
                />
                <YAxis 
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
                  tickFormatter={(value) => `${value.toLocaleString()}`}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card text-card-foreground border rounded-lg shadow-sm p-3">
                          <p className="font-semibold text-sm mb-1">{payload[0].payload.period}</p>
                          <p className="text-primary font-bold">{Number(payload[0].value).toLocaleString()} Kg</p>
                        </div>
                      )
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="totalWeight" 
                  fill="hsl(142.1, 76.2%, 36.3%)" // green-600 equivalent
                  radius={[4, 4, 0, 0]} 
                  barSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
              Belum ada data panen untuk ditampilkan.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
