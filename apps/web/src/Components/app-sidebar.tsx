import {
  LayoutDashboard,
  BarChart3,
  Settings,
  MoreVertical,
  LogOut,
  ClipboardList,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarGroupContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/context/UserProvider";
import { NavLink, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "./ui/avatar";
import api from "@/lib/api";

// Hook customizado para verificar se a rota está ativa
const useIsActive = (path: string) => {
  if (path === "/dashboard") {
    return location.pathname === "/dashboard"
  }
  return location.pathname.startsWith(path)
};

const NavItem = ({ to, icon: Icon, children }: { to: string, icon: React.ElementType, children: React.ReactNode }) => {
  const isActive = useIsActive(to);
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <NavLink to={to}>
          <Icon />
          <span>{children}</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export function AppSidebar() {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem('accessToken');
      navigate('/login');
    }
  };

  const getInitials = (name: string = '') => {
    if (!name) return '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="p-6 border-b border-sidebar-border">
              <h1 className={`font-bold text-xl text-sidebar-primary`}>
                CIIDCMIL
              </h1>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              <NavItem to="/dashboard" icon={LayoutDashboard}>Dashboard</NavItem>
              <NavItem to="/dashboard/questionnaires" icon={ClipboardList}>Questionarios</NavItem>
              <NavItem to="/dashboard/analytics" icon={BarChart3}>Análise</NavItem>
              <NavItem to="/dashboard/settings" icon={Settings}>Configurações</NavItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">{getInitials(user?.name)}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user?.name || 'Usuário'}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {user?.email || 'email@exemplo.com'}
                    </span>
                  </div>
                  <MoreVertical className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" side="top" align="start">
                <DropdownMenuItem variant="destructive" onSelect={handleLogout}>
                  <LogOut className="mr-2 size-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
