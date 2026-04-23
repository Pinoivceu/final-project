"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface HarvestData {
  id: string;
  totalWeight: number;
  harvestDate: Date;
}

export function ProductionChart({ data }: { data: HarvestData[] }) {
  // Group by month
  const groupedData = data?.reduce((acc: any, curr: HarvestData) => {
    const date = new Date(curr.harvestDate);
    const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    
    if (!acc[monthYear]) {
      acc[monthYear] = { name: monthYear, total: 0 };
    }
    acc[monthYear].total += curr.totalWeight;
    return acc;
  }, {});

  const chartData = Object.values(groupedData || {}).sort((a: any, b: any) => {
    const dateA = new Date(a.name);
    const dateB = new Date(b.name);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Grafik Produksi</CardTitle>
        <CardDescription>
          Total panen bulanan berdasarkan data yang tercatat.
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[350px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value} Kg`}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value} Kg`, "Total Panen"]}
                  cursor={{ fill: 'hsl(var(--muted))' }}
                />
                <Bar
                  dataKey="total"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Belum ada data panen untuk ditampilkan.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
