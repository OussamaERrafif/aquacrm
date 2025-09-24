"use client"
import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Fish,
  Landmark,
  LayoutDashboard,
  Settings,
  Users,
  ShoppingCart,
  ShoppingBag,
  Package,
  ChevronDown,
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import type { NavItem } from "@/lib/types"

const useActivePath = () => {
  const pathname = usePathname()
  return (path: string) => pathname.startsWith(path) && (path === "/" ? pathname === "/" : true)
}

export function AppSidebar() {
  const isActive = useActivePath()
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  const navItems: NavItem[] = [
    { title: "لوحة التحكم", href: "/dashboard", icon: LayoutDashboard },
    {
      title: "الفواتير",
      icon: Landmark,
      items: [
        { title: "بيع", href: "/sell", icon: ShoppingBag },
        { title: "شراء", href: "/buy", icon: ShoppingCart },
        { title: "فواتير المصاريف", href: "/chargesinvoices", icon: Landmark },
      ],
    },
    {
      title: "الأطراف",
      icon: Users,
      items: [
        { title: "المشتري", href: "/buyers", icon: Users },
        { title: "البائع", href: "/sellers", icon: Users },
        { title: "المتعاون", href: "/collaborators", icon: Users },
      ],
    },
    { title: "المنتجات", href: "/products", icon: Package },
    { title: "الأسماك المشتراة", href: "/tracability", icon: Fish },
  ]

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-3 py-4">
          <Fish className="h-8 w-8 text-primary shrink-0" />
          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
            <h2 className="text-lg font-semibold tracking-tight truncate">AquaTrade CRM</h2>
            <p className="text-xs text-muted-foreground">إدارة الأسماك والتجارة</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarMenu className="gap-2">
          {navItems.map((item, index) =>
            item.items ? (
              <SidebarMenuItem key={item.title}>
                <Collapsible open={openSections[item.title]} onOpenChange={() => toggleSection(item.title)}>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className="w-full justify-between hover:bg-sidebar-accent transition-all duration-200 h-10 px-3 font-medium"
                      tooltip={item.title}
                      isActive={Boolean(item.items.some((subItem) => subItem.href && isActive(subItem.href)))}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.icon && React.createElement(item.icon, { className: "h-5 w-5 shrink-0" })}
                        <span className="truncate group-data-[collapsible=icon]:hidden text-sm">{item.title}</span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 transition-transform duration-200 group-data-[collapsible=icon]:hidden ${
                          openSections[item.title] ? "rotate-180" : ""
                        }`}
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="transition-all duration-200 ease-in-out">
                    <div className="ml-4 mt-1 border-l border-sidebar-border/50 group-data-[collapsible=icon]:hidden">
                      <SidebarMenu className="gap-1 pl-4">
                        {item.items.map((subItem) => (
                          <SidebarMenuItem key={subItem.title}>
                            <SidebarMenuButton
                              asChild
                              isActive={Boolean(subItem.href && isActive(subItem.href))}
                              tooltip={subItem.title}
                              className="w-full justify-start text-sm hover:bg-sidebar-accent/70 transition-colors duration-200 h-8 px-2"
                            >
                              <Link href={subItem.href || "#"} className="flex w-full items-center gap-2 py-1">
                                {subItem.icon &&
                                  React.createElement(subItem.icon, {
                                    className: "h-4 w-4 text-muted-foreground shrink-0",
                                  })}
                                <span className="truncate text-xs font-normal">{subItem.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
                {index < navItems.length - 1 && item.items && (
                  <div className="h-px bg-sidebar-border/30 mx-2 my-2 group-data-[collapsible=icon]:hidden" />
                )}
              </SidebarMenuItem>
            ) : (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={Boolean(item.href && isActive(item.href))}
                  tooltip={item.title}
                  className="hover:bg-sidebar-accent transition-colors duration-200 h-10 px-3 font-medium"
                >
                  <Link href={item.href || "#"} className="flex items-center gap-3">
                    {item.icon && React.createElement(item.icon, { className: "h-5 w-5 shrink-0" })}
                    <span className="truncate group-data-[collapsible=icon]:hidden text-sm">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ),
          )}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border px-2 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive("/settings")}
              tooltip="الإعدادات"
              className="hover:bg-sidebar-accent transition-colors duration-200 h-10 px-3"
            >
              <Link href="/settings" className="flex items-center gap-3">
                <Settings className="h-5 w-5 shrink-0" />
                <span className="truncate group-data-[collapsible=icon]:hidden text-sm font-medium">الإعدادات</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export function AppSidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col overflow-hidden">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-px bg-sidebar-border mx-2" />
            <h1 className="text-lg font-semibold">AquaTrade CRM</h1>
          </header>
          <main className="flex-1 overflow-auto p-4">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
