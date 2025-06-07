"use client"

import { BarrierTypeChart } from "@/Components/charts/BarrierTypeChart"
import { MonthlyChart } from "@/Components/charts/MontlhyChart"
import { RegionChart } from "@/Components/charts/RegionChart"
import { CitiesTable } from "@/Components/dashboard/CitiesTable"
import { ComparisonBar } from "@/Components/dashboard/ComparsionBar"
import { ComparisonModal } from "@/Components/dashboard/ComparsionModal"
import { DashboardHeader } from "@/Components/dashboard/DashboardHeader"
import { FilterSection } from "@/Components/dashboard/FilterSection"
import { MetricsCards } from "@/Components/dashboard/MetricCards"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { barrierTypeData, mockCities, monthlyData, regionData } from "@/data/MockData"
import { useCityComparison } from "@/hooks/useCityComparsion"
import { useCityFilters } from "@/hooks/useCityFilters"



export const Dashboard = () => {
  const {
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
    filteredCities,
    clearFilters,
  } = useCityFilters(mockCities)

  const {
    selectedCities,
    showComparison,
    setShowComparison,
    handleCitySelection,
    handleSelectAll,
    getSelectedCitiesData,
    clearSelection,
  } = useCityComparison(mockCities)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardHeader />
        <MetricsCards cities={mockCities} />

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="cities">Cidades</TabsTrigger>
            <TabsTrigger value="analytics">Análises</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RegionChart data={regionData} />
              <BarrierTypeChart data={barrierTypeData} />
            </div>
            <MonthlyChart data={monthlyData} />
          </TabsContent>

          <TabsContent value="cities" className="space-y-6">
            <FilterSection
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              selectedPopulation={selectedPopulation}
              setSelectedPopulation={setSelectedPopulation}
              selectedDateRange={selectedDateRange}
              setSelectedDateRange={setSelectedDateRange}
              selectedBarrierLevel={selectedBarrierLevel}
              setSelectedBarrierLevel={setSelectedBarrierLevel}
              clearFilters={clearFilters}
              filteredCount={filteredCities.length}
              totalCount={mockCities.length}
            />

            <CitiesTable
              cities={filteredCities}
              selectedCities={selectedCities}
              onCitySelection={handleCitySelection}
              onSelectAll={handleSelectAll}
              totalCount={mockCities.length}
            />

            <ComparisonBar
              selectedCities={selectedCities}
              cities={mockCities}
              onCompare={() => setShowComparison(true)}
              onClear={clearSelection}
            />

            <ComparisonModal open={showComparison} onOpenChange={setShowComparison} cities={getSelectedCitiesData()} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Ranking de Regiões e Estatísticas podem ser componentizados também */}
              {/* Por brevidade, mantendo inline aqui */}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
