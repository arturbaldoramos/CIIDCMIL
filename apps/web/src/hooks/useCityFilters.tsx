"use client"

import { useState, useMemo } from "react"
import type { City, PopulationFilter, DateRangeFilter, BarrierLevelFilter } from "@/types/city"
import { getDaysAgo } from "@/utils/CityHelpers"

export const useCityFilters = (cities: City[]) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedPopulation, setSelectedPopulation] = useState<PopulationFilter>("all")
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangeFilter>("all")
  const [selectedBarrierLevel, setSelectedBarrierLevel] = useState<BarrierLevelFilter>("all")

  const filteredCities = useMemo(() => {
    return cities.filter((city) => {
      const matchesSearch =
        city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.state.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRegion = selectedRegion === "all" || city.region === selectedRegion
      const matchesStatus = selectedStatus === "all" || city.status === selectedStatus

      // Filtro por população
      let matchesPopulation = true
      if (selectedPopulation !== "all") {
        switch (selectedPopulation) {
          case "small":
            matchesPopulation = city.population < 500000
            break
          case "medium":
            matchesPopulation = city.population >= 500000 && city.population < 1500000
            break
          case "large":
            matchesPopulation = city.population >= 1500000 && city.population < 5000000
            break
          case "metropolis":
            matchesPopulation = city.population >= 5000000
            break
        }
      }

      // Filtro por data de análise
      let matchesDate = true
      if (selectedDateRange !== "all") {
        const diffDays = getDaysAgo(city.lastUpdate)

        switch (selectedDateRange) {
          case "7days":
            matchesDate = diffDays <= 7
            break
          case "30days":
            matchesDate = diffDays <= 30
            break
          case "90days":
            matchesDate = diffDays <= 90
            break
          case "older":
            matchesDate = diffDays > 90
            break
        }
      }

      // Filtro por nível de barreiras
      let matchesBarrierLevel = true
      if (selectedBarrierLevel !== "all") {
        switch (selectedBarrierLevel) {
          case "low":
            matchesBarrierLevel = city.totalBarriers <= 7
            break
          case "medium":
            matchesBarrierLevel = city.totalBarriers > 7 && city.totalBarriers <= 14
            break
          case "high":
            matchesBarrierLevel = city.totalBarriers > 14
            break
        }
      }

      return matchesSearch && matchesRegion && matchesStatus && matchesPopulation && matchesDate && matchesBarrierLevel
    })
  }, [cities, searchTerm, selectedRegion, selectedStatus, selectedPopulation, selectedDateRange, selectedBarrierLevel])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedRegion("all")
    setSelectedStatus("all")
    setSelectedPopulation("all")
    setSelectedDateRange("all")
    setSelectedBarrierLevel("all")
  }

  return {
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
  }
}
