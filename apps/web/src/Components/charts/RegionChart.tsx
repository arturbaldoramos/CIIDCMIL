import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { RegionData } from "@/types/city"

interface RegionChartProps {
  data: RegionData[]
}

export const RegionChart = ({ data }: RegionChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Barreiras por Região</CardTitle>
        <CardDescription>Distribuição de barreiras identificadas por região do Brasil</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="barriers" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
