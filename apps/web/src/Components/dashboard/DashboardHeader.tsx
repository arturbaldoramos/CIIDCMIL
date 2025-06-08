import { Button } from "@/Components/ui/button"
import { MenuIcon, Plus } from "lucide-react"
import { SidebarTrigger } from "../ui/sidebar"
import { Separator } from "../ui/separator"
import { userInfo } from "node:os"

export const DashboardHeader = () => {
  return (
    <div className="flex sticky top-0 pt-2 items-center justify-between pb-4 border-b backdrop-blur-md z-10">
      <div className="flex justify-start items-center">
        <SidebarTrigger>
          <MenuIcon />
        </SidebarTrigger>
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-7"
        />
        <h1 className="text-3xl font-bold">Painel de Administração</h1>
      </div>
      <div className="flex justify-end">
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Cidade
        </Button>
      </div>
    </div>
  )
}