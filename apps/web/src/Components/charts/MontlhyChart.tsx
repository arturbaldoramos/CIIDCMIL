import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { MonthlyData } from "@/types/city"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

interface MonthlyChartProps {
  data: MonthlyData[]
}

export const MonthlyChart = ({ data }: MonthlyChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução Mensal de Barreiras</CardTitle>
        <CardDescription>Número de barreiras identificadas por mês</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="barriers" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
