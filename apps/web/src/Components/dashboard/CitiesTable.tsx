
import type { City } from "@/types/city"
import {
  getPopulationCategory,
  getBarrierLevel,
  getBarrierLevelColor,
  getStatusColor,
  getDaysAgo,
} from "@/utils/CityHelpers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { Badge } from "@/Components/ui/badge"
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from "@/Components/ui/table"
import { Checkbox } from "@/Components/ui/checkbox"

interface CitiesTableProps {
  cities: City[]
  selectedCities: number[]
  onCitySelection: (cityId: number, checked: boolean) => void
  onSelectAll: (cityIds: number[], checked: boolean) => void
  totalCount: number
}

export const CitiesTable = ({ cities, selectedCities, onCitySelection, onSelectAll, totalCount }: CitiesTableProps) => {
  const allSelected = selectedCities.length === cities.length && cities.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cidades Cadastradas</CardTitle>
        <CardDescription>
          {cities.length} de {totalCount} cidades
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(checked) => {
                    onSelectAll(
                      cities.map((city) => city.id),
                      checked as boolean,
                    )
                  }}
                />
              </TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead>Região</TableHead>
              <TableHead>População</TableHead>
              <TableHead>Religiosas</TableHead>
              <TableHead>Sociais</TableHead>
              <TableHead>Culturais</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Última Atualização</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cities.map((city) => (
              <TableRow key={city.id} className={selectedCities.includes(city.id) ? "bg-blue-50" : ""}>
                <TableCell>
                  <Checkbox
                    checked={selectedCities.includes(city.id)}
                    onCheckedChange={(checked) => onCitySelection(city.id, checked as boolean)}
                    />
                </TableCell>
                <TableCell className="font-medium">
                  <div>
                    <div>
                      {city.name}, {city.state}
                    </div>
                    <div className="text-xs text-muted-foreground">{getPopulationCategory(city.population)}</div>
                  </div>
                </TableCell>
                <TableCell>{city.region}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{city.population.toLocaleString()}</div>
                    <Badge variant="outline" className="text-xs">
                      {getPopulationCategory(city.population)}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="destructive">{city.religiousBarriers}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{city.socialBarriers}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{city.culturalBarriers}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge className="bg-blue-100 text-blue-800">{city.totalBarriers}</Badge>
                    <Badge className={getBarrierLevelColor(city.totalBarriers)} variant="outline">
                      {getBarrierLevel(city.totalBarriers)}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(city.status)}>{city.status}</Badge>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{city.lastUpdate}</div>
                    <div className="text-xs text-muted-foreground">{getDaysAgo(city.lastUpdate)} dias atrás</div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
