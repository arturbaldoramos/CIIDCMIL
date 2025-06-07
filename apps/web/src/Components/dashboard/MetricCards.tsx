import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { MapPin, Users, AlertTriangle, CheckCircle } from "lucide-react"
import type { City } from "@/types/city"

interface MetricsCardsProps {
  cities: City[]
}

export const MetricsCards = ({ cities }: MetricsCardsProps) => {
  const totalCities = cities.length
  const totalBarriers = cities.reduce((sum, city) => sum + city.totalBarriers, 0)
  const avgBarriers = (totalBarriers / totalCities).toFixed(1)
  const analyzedCities = cities.filter((city) => city.status === "Analisado").length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Cidades</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCities}</div>
          <p className="text-xs text-muted-foreground">Cadastradas no sistema</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Barreiras</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBarriers}</div>
          <p className="text-xs text-muted-foreground">Identificadas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Média por Cidade</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgBarriers}</div>
          <p className="text-xs text-muted-foreground">Barreiras por cidade</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cidades Analisadas</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analyzedCities}</div>
          <p className="text-xs text-muted-foreground">De {totalCities} cadastradas</p>
        </CardContent>
      </Card>
    </div>
  )
}
