"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { Search, Download } from "lucide-react"
import type { PopulationFilter, DateRangeFilter, BarrierLevelFilter } from "@/types/city"

interface FilterSectionProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  selectedRegion: string
  setSelectedRegion: (value: string) => void
  selectedStatus: string
  setSelectedStatus: (value: string) => void
  selectedPopulation: PopulationFilter
  setSelectedPopulation: (value: PopulationFilter) => void
  selectedDateRange: DateRangeFilter
  setSelectedDateRange: (value: DateRangeFilter) => void
  selectedBarrierLevel: BarrierLevelFilter
  setSelectedBarrierLevel: (value: BarrierLevelFilter) => void
  clearFilters: () => void
  filteredCount: number
  totalCount: number
}

export const FilterSection = ({
  searchTerm,
  setSearchTerm,
  selectedRegion,
  setSelectedRegion,
  selectedStatus,
  setSelectedStatus,
  selectedPopulation,
  setSelectedPopulation,
  selectedDateRange,
  setSelectedDateRange,
  selectedBarrierLevel,
  setSelectedBarrierLevel,
  clearFilters,
  filteredCount,
  totalCount,
}: FilterSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros Avançados</CardTitle>
        <CardDescription>Use os filtros abaixo para refinar sua busca</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Primeira linha de filtros */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar cidade ou estado..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full lg:w-48">
              <label className="text-sm font-medium mb-2 block">Região</label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="Região" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Regiões</SelectItem>
                  <SelectItem value="Norte">Norte</SelectItem>
                  <SelectItem value="Nordeste">Nordeste</SelectItem>
                  <SelectItem value="Centro-Oeste">Centro-Oeste</SelectItem>
                  <SelectItem value="Sudeste">Sudeste</SelectItem>
                  <SelectItem value="Sul">Sul</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full lg:w-48">
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="Analisado">Analisado</SelectItem>
                  <SelectItem value="Em Análise">Em Análise</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Segunda linha de filtros */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-48">
              <label className="text-sm font-medium mb-2 block">População</label>
              <Select value={selectedPopulation} onValueChange={setSelectedPopulation}>
                <SelectTrigger>
                  <SelectValue placeholder="Tamanho" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tamanhos</SelectItem>
                  <SelectItem value="small">Pequena (&lt; 500k)</SelectItem>
                  <SelectItem value="medium">Média (500k - 1.5M)</SelectItem>
                  <SelectItem value="large">Grande (1.5M - 5M)</SelectItem>
                  <SelectItem value="metropolis">Metrópole (&gt; 5M)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full lg:w-48">
              <label className="text-sm font-medium mb-2 block">Data de Análise</label>
              <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Períodos</SelectItem>
                  <SelectItem value="7days">Últimos 7 dias</SelectItem>
                  <SelectItem value="30days">Últimos 30 dias</SelectItem>
                  <SelectItem value="90days">Últimos 90 dias</SelectItem>
                  <SelectItem value="older">Mais de 90 dias</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full lg:w-48">
              <label className="text-sm font-medium mb-2 block">Nível de Barreiras</label>
              <Select value={selectedBarrierLevel} onValueChange={setSelectedBarrierLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Níveis</SelectItem>
                  <SelectItem value="low">Baixo (≤ 7)</SelectItem>
                  <SelectItem value="medium">Médio (8-14)</SelectItem>
                  <SelectItem value="high">Alto (&gt; 14)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters} className="w-full lg:w-auto">
                Limpar Filtros
              </Button>
            </div>
          </div>

          {/* Terceira linha - Ações */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2 border-t">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar Resultados
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                Mostrando {filteredCount} de {totalCount} cidades
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
