"use client"

import { Scale, BarChart3 } from "lucide-react"
import type { City } from "@/types/city"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"

interface ComparisonBarProps {
  selectedCities: number[]
  cities: City[]
  onCompare: () => void
  onClear: () => void
}

export const ComparisonBar = ({ selectedCities, cities, onCompare, onClear }: ComparisonBarProps) => {

  const selectedCitiesData = cities.filter((city) => selectedCities.includes(city.id))

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Scale className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">
                {selectedCities.length} cidade{selectedCities.length > 1 ? "s" : ""} selecionada
                {selectedCities.length > 1 ? "s" : ""}
              </p>
              <p className="text-sm text-blue-700">{selectedCitiesData.map((city) => city.name).join(", ")}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="flex items-center gap-2" disabled={selectedCities.length < 2} onClick={onCompare}>
              <BarChart3 className="h-4 w-4" />
              Comparar Cidades
            </Button>
            <Button variant="outline" onClick={onClear}>
              Limpar Seleção
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
