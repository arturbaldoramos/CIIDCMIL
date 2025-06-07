export const getPopulationCategory = (population: number): string => {
  if (population < 500000) return "Pequena"
  if (population < 1500000) return "Média"
  if (population < 5000000) return "Grande"
  return "Metrópole"
}

export const getBarrierLevel = (barriers: number): string => {
  if (barriers <= 7) return "Baixo"
  if (barriers <= 14) return "Médio"
  return "Alto"
}

export const getBarrierLevelColor = (barriers: number): string => {
  if (barriers <= 7) return "bg-green-100 text-green-800"
  if (barriers <= 14) return "bg-yellow-100 text-yellow-800"
  return "bg-red-100 text-red-800"
}

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "Analisado":
      return "bg-green-100 text-green-800"
    case "Em Análise":
      return "bg-yellow-100 text-yellow-800"
    case "Pendente":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getDaysAgo = (dateString: string): number => {
  const cityDate = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - cityDate.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
