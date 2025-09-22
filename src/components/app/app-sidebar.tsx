'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  BarChart,
  FileText,
  Fish,
  Handshake,
  Landmark,
  LayoutDashboard,
  Settings,
  Users,
} from 'lucide-react';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/lib/types';
import { Button } from '@/components/ui/button';

const useActivePath = () => {
  const pathname = usePathname();
  return (path: string) => pathname === path;
};

export function AppSidebar() {
  const isActive = useActivePath();
  const navItems: NavItem[] = [
    { title: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard /> },
    { title: 'Buyers', href: '/buyers', icon: <Users /> },
    { title: 'Sellers', href: '/sellers', icon: <Users /> },
    { title: 'Invoices', href: '/invoices', icon: <FileText /> },
    { title: 'Loans', href: '/loans', icon: <Landmark /> },
    { title: 'Financing', href: '/financing', icon: <Handshake /> },
    { title: 'AI Overview', href: '/overview', icon: <BarChart /> },
  ];

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Fish className="h-8 w-8 text-primary" />
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold tracking-tight">
              AquaTrade CRM
            </h2>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={isActive(item.href)}
                  tooltip={item.title}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/settings" legacyBehavior passHref>
              <SidebarMenuButton
                isActive={isActive('/settings')}
                tooltip="Settings"
              >
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
