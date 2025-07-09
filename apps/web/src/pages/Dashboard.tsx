import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export function Dashboard() {

  return (
    <SidebarProvider>
      <AppSidebar />
    </SidebarProvider>
  );
}