// Dashboard.tsx
"use client"

import { AppSidebar } from "@/Components/app-sidebar"
import { BarrierTypeChart } from "@/Components/charts/BarrierTypeChart"
import { MonthlyChart } from "@/Components/charts/MontlhyChart"
import { RegionChart } from "@/Components/charts/RegionChart"
import { CitiesTable } from "@/Components/dashboard/CitiesTable"
import { ComparisonBar } from "@/Components/dashboard/ComparsionBar"
import { ComparisonModal } from "@/Components/dashboard/ComparsionModal"
import { DashboardHeader } from "@/Components/dashboard/DashboardHeader"
import { FilterSection } from "@/Components/dashboard/FilterSection"
import { MetricsCards } from "@/Components/dashboard/MetricCards"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card"
import { SidebarProvider, SidebarInset } from "@/Components/ui/sidebar" // Importe SidebarInset e SidebarTrigger
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

  const totalCities = mockCities.length
  const totalBarriers = mockCities.reduce((sum, city) => sum + city.totalBarriers, 0)
  const avgBarriers = (totalBarriers / totalCities).toFixed(1)
  const analyzedCities = mockCities.filter((city) => city.status === "Analisado").length


  return (
    <SidebarProvider>
      {/* Aqui a AppSidebar é renderizada diretamente dentro do SidebarProvider */}
      <AppSidebar />
      <SidebarInset className="p-3">

        {/* Todo o conteúdo principal da página deve ser encapsulado por SidebarInset */}

        <div className="max-w grow mx-8 space-y-6">
          {/* Adicione um trigger para a sidebar, se quiser que ela possa ser recolhida/expandida */}
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
                {/* Ranking de Regiões */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ranking por Região</CardTitle>
                    <CardDescription>Regiões com maior média de barreiras por cidade</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {regionData
                        .sort((a, b) => b.avg - a.avg)
                        .map((region, index) => (
                          <div key={region.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-medium">{region.name}</p>
                                <p className="text-sm text-muted-foreground">{region.cities} cidades</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{region.avg}</p>
                              <p className="text-sm text-muted-foreground">média</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Estatísticas Detalhadas */}
                <Card>
                  <CardHeader>
                    <CardTitle>Estatísticas Detalhadas</CardTitle>
                    <CardDescription>Análise detalhada dos dados coletados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Maior número de barreiras:</span>
                        <span className="font-bold">18 (Salvador)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Menor número de barreiras:</span>
                        <span className="font-bold">5 (Curitiba)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Cidade mais populosa analisada:</span>
                        <span className="font-bold">São Paulo</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Taxa de conclusão:</span>
                        <span className="font-bold">{((analyzedCities / totalCities) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Barreiras sociais (total):</span>
                        <span className="font-bold">35</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Barreiras religiosas (total):</span>
                        <span className="font-bold">29</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Barreiras culturais (total):</span>
                        <span className="font-bold">26</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}