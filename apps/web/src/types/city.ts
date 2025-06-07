export interface City {
  id: number
  name: string
  state: string
  region: string
  population: number
  religiousBarriers: number
  socialBarriers: number
  culturalBarriers: number
  totalBarriers: number
  status: string
  lastUpdate: string
}

export interface RegionData {
  name: string
  cities: number
  barriers: number
  avg: number
}

export interface BarrierTypeData {
  name: string
  value: number
  color: string
}

export interface MonthlyData {
  month: string
  barriers: number
}

export type PopulationFilter = "all" | "small" | "medium" | "large" | "metropolis"
export type DateRangeFilter = "all" | "7days" | "30days" | "90days" | "older"
export type BarrierLevelFilter = "all" | "low" | "medium" | "high"
