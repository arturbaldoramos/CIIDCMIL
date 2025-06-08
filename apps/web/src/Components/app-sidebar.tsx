"use client"

import * as React from "react"
import {
    BookIcon,
    BookOpen,
    Bot,
    ChartBar,
    ChartBarIcon,
    ChartBarStacked,
    ChartLine,
    Command, // Import Command for default icon
    Frame,
    GitGraph,
    Icon,
    icons,
    LifeBuoy,
    Map,
    PieChart,
    Send,
    Settings2,
    SquareTerminal,
    TagIcon,
    User2Icon,
    UserCheck2,
    UserRoundSearch,
    UserRoundX,
} from "lucide-react"

import { NavMain } from "@/Components/nav-main"
import { NavProjects } from "@/Components/nav-projects"
import { NavSecondary } from "@/Components/nav-secondary"
import { NavUser } from "@/Components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from "@/Components/ui/sidebar"

const data = {
    user: {
        name: "NÍCOLAS",
        email: "nicolas@gmail.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Gráficos",
            url: "#/admin/analytics",
            icon: ChartLine,
            isActive: true,
            items: [
                {
                    title: "Região",
                    url: "#/admin/analytics/region",
                    icon: Map // Changed from 'Icon' to 'icon' and assigned a relevant icon
                },
                {
                    title: "Estado",
                    url: "#/admin/analytics/state",
                    icon: TagIcon, // Added missing 'icon' property
                },
                {
                    title: "Cidade",
                    url: "#/admin/analytics/city",
                    icon: BookIcon, // Added missing 'icon' property
                },
            ],
        },
        {
            title: "Usuários",
            url: "#/admin/users",
            icon: User2Icon,
            items: [
                {
                    title: "Ativos",
                    url: "#/admin/users",
                    icon: UserCheck2
                },
                {
                    title: "Explorer",
                    url: "#/admin/pendingUsers",
                    icon: UserRoundSearch
                },
                {
                    title: "Suspensos",
                    url: "#/admin/suspendedUsers",
                    icon: UserRoundX
                },
            ],
        },
        {
            title: "Documentation",
            url: "#",
            icon: BookOpen,
            items: [
                {
                    title: "Introduction",
                    url: "#",
                    icon: Command, // Added missing 'icon' property
                },
                {
                    title: "Get Started",
                    url: "#",
                    icon: Command, // Added missing 'icon' property
                },
                {
                    title: "Tutorials",
                    url: "#",
                    icon: Command, // Added missing 'icon' property
                },
                {
                    title: "Changelog",
                    url: "#",
                    icon: Command, // Added missing 'icon' property
                },
            ],
        }, 
    ],
    navSecondary: [
        {
            title: "Supporte",
            url: "#",
            icon: LifeBuoy,
        },
        {
            title: "Feedback",
            url: "#",
            icon: Send,
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "#/settings",
                    icon: Command, // Added missing 'icon' property
                },
                {
                    title: "Team",
                    url: "#",
                    icon: Command, // Added missing 'icon' property
                },
                {
                    title: "Billing",
                    url: "#",
                    icon: Command, // Added missing 'icon' property
                },
                {
                    title: "Limits",
                    url: "#",
                    icon: Command, // Added missing 'icon' property
                },
            ],
        },
    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarGroupLabel className="font-bold">
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <a href="#">
                                <span className="text-base font-semibold">Dashboard</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarGroupLabel>
                    <SidebarSeparator className="mt-3" />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavProjects projects={data.projects} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    )
}