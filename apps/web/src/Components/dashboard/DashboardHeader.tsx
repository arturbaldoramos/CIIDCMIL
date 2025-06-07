import { Button } from "@/Components/ui/button"
import { Plus } from "lucide-react"

export const DashboardHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">Painel de Administração</h1>
        <p className="text-muted-foreground mt-1">Pesquisa sobre Barreiras em Sites de Prefeituras</p>
      </div>
      <Button className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Nova Cidade
      </Button>
    </div>
  )
}
