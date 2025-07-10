import { Outlet } from 'react-router-dom';
import { AppSidebar } from './app-sidebar';
import { SidebarProvider, SidebarInset } from './ui/sidebar';

const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="p-6 overflow-y-auto h-full">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;