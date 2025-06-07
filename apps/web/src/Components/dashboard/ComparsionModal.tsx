import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/Components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"
import type { City } from "@/types/city"
import { getBarrierLevel, getBarrierLevelColor, getStatusColor } from "@/utils/CityHelpers"

interface ComparisonModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cities: City[]
}

export const ComparisonModal = ({ open, onOpenChange, cities }: ComparisonModalProps) => {
  // Handle the case where cities array might be empty
  if (!cities || cities.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Comparação de Cidades</DialogTitle>
            <DialogDescription>Selecione cidades para comparação.</DialogDescription>
          </DialogHeader>
          <div className="p-4 text-center text-muted-foreground">
            Nenhuma cidade selecionada para comparação.
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const chartData = cities.map((city) => ({
    name: city.name,
    Religiosas: city.religiousBarriers,
    Sociais: city.socialBarriers,
    Culturais: city.culturalBarriers,
  }))

  const maxCity = cities.reduce((max, city) => (city.totalBarriers > max.totalBarriers ? city : max), cities[0])
  const minCity = cities.reduce((min, city) => (city.totalBarriers < min.totalBarriers ? city : min), cities[0])
  const avgBarriers = (cities.reduce((sum, city) => sum + city.totalBarriers, 0) / cities.length).toFixed(1)

  const generateInsights = () => {
    const insights = []
    const max = Math.max(...cities.map((c) => c.totalBarriers))
    const min = Math.min(...cities.map((c) => c.totalBarriers))

    if (max - min > 10) {
      insights.push(`Há uma grande variação no número de barreiras (diferença de ${max - min} barreiras).`)
    }

    const regions = [...new Set(cities.map((c) => c.region))]
    if (regions.length > 1) {
      insights.push(`As cidades selecionadas representam ${regions.length} regiões diferentes: ${regions.join(", ")}.`)
    }

    const avgPop = cities.reduce((sum, c) => sum + c.population, 0) / cities.length
    if (avgPop > 3000000) {
      insights.push("O grupo é composto principalmente por grandes centros urbanos.")
    }

    const avgSocial = cities.reduce((sum, c) => sum + c.socialBarriers, 0) / cities.length
    if (avgSocial > 4) {
      insights.push("Barreiras sociais são predominantes neste grupo de cidades.")
    }

    return insights
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Comparação de Cidades</DialogTitle>
          <DialogDescription>Análise comparativa entre {cities.length} cidades selecionadas</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Gráfico Comparativo de Barreiras */}
          <Card>
            <CardHeader>
              <CardTitle>Comparação de Barreiras por Tipo</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Religiosas" fill="#ef4444" />
                  <Bar dataKey="Sociais" fill="#f97316" />
                  <Bar dataKey="Culturais" fill="#eab308" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Tabela Comparativa */}
          <Card>
            <CardHeader>
              <CardTitle>Comparação Detalhada</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Métrica</TableHead>
                    {cities.map((city) => (
                      <TableHead key={city.id} className="text-center">
                        {city.name}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">População</TableCell>
                    {cities.map((city) => (
                      <TableCell key={city.id} className="text-center">
                        {city.population.toLocaleString()}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Região</TableCell>
                    {cities.map((city) => (
                      <TableCell key={city.id} className="text-center">
                        {city.region}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Barreiras Religiosas</TableCell>
                    {cities.map((city) => (
                      <TableCell key={city.id} className="text-center">
                        <Badge variant="destructive">{city.religiousBarriers}</Badge>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Barreiras Sociais</TableCell>
                    {cities.map((city) => (
                      <TableCell key={city.id} className="text-center">
                        <Badge variant="secondary">{city.socialBarriers}</Badge>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Barreiras Culturais</TableCell>
                    {cities.map((city) => (
                      <TableCell key={city.id} className="text-center">
                        <Badge variant="outline">{city.culturalBarriers}</Badge>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="bg-gray-50">
                    <TableCell className="font-bold">Total de Barreiras</TableCell>
                    {cities.map((city) => (
                      <TableCell key={city.id} className="text-center">
                        <Badge className="bg-blue-100 text-blue-800 font-bold">{city.totalBarriers}</Badge>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Nível de Barreiras</TableCell>
                    {cities.map((city) => (
                      <TableCell key={city.id} className="text-center">
                        <Badge className={getBarrierLevelColor(city.totalBarriers)}>
                          {getBarrierLevel(city.totalBarriers)}
                        </Badge>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Status</TableCell>
                    {cities.map((city) => (
                      <TableCell key={city.id} className="text-center">
                        <Badge className={getStatusColor(city.status)}>{city.status}</Badge>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Última Atualização</TableCell>
                    {cities.map((city) => (
                      <TableCell key={city.id} className="text-center">
                        {city.lastUpdate}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Análise Comparativa */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Maior Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{maxCity.totalBarriers}</p>
                  <p className="text-sm text-muted-foreground">{maxCity.name}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Menor Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{minCity.totalBarriers}</p>
                  <p className="text-sm text-muted-foreground">{minCity.name}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Média do Grupo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{avgBarriers}</p>
                  <p className="text-sm text-muted-foreground">barreiras</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Insights da Comparação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {generateInsights().map((insight, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <p className="text-sm">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}