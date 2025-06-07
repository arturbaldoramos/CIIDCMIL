"use client"

import { useState } from "react"
import type { City } from "@/types/city"

export const useCityComparison = (cities: City[]) => {
  const [selectedCities, setSelectedCities] = useState<number[]>([])
  const [showComparison, setShowComparison] = useState(false)

  const handleCitySelection = (cityId: number, checked: boolean) => {
    if (checked) {
      setSelectedCities((prev) => [...prev, cityId])
    } else {
      setSelectedCities((prev) => prev.filter((id) => id !== cityId))
    }
  }

  const handleSelectAll = (cityIds: number[], checked: boolean) => {
    if (checked) {
      setSelectedCities(cityIds)
    } else {
      setSelectedCities([])
    }
  }

  const getSelectedCitiesData = () => {
    return cities.filter((city) => selectedCities.includes(city.id))
  }

  const clearSelection = () => {
    setSelectedCities([])
    setShowComparison(false)
  }

  return {
    selectedCities,
    showComparison,
    setShowComparison,
    handleCitySelection,
    handleSelectAll,
    getSelectedCitiesData,
    clearSelection,
  }
}
