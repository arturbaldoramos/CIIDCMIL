import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import type { BarrierTypeData } from "@/types/city"

interface BarrierTypeChartProps {
  data: BarrierTypeData[]
}

export const BarrierTypeChart = ({ data }: BarrierTypeChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tipos de Barreiras</CardTitle>
        <CardDescription>Distribuição por categoria de barreira identificada</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
