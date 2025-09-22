
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Fish,
  Handshake,
  Landmark,
  LayoutDashboard,
  Settings,
  Users,
  ShoppingCart,
  ShoppingBag,
  Package,
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

const useActivePath = () => {
  const pathname = usePathname();
  return (path: string) => pathname.startsWith(path) && (path === '/' ? pathname === '/' : true);
};

export function AppSidebar() {
  const isActive = useActivePath();
  const navItems: NavItem[] = [
    { title: 'لوحة التحكم', href: '/dashboard', icon: <LayoutDashboard /> },
    { title: 'بيع', href: '/sell', icon: <ShoppingBag /> },
    { title: 'شراء', href: '/buy', icon: <ShoppingCart /> },
    { title: 'الأطراف', href: '/parties', icon: <Users /> },
    { title: 'المنتجات', href: '/products', icon: <Package /> },
    { title: 'الأسماك المشتراة', href: '/tracability', icon: <Package /> },
    { title: 'القروض', href: '/loans', icon: <Landmark /> },
    { title: 'التمويل', href: '/financing', icon: <Handshake /> },
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
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={item.title}
              >
                <Link href={item.href}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
              <SidebarMenuButton
                  asChild
                  isActive={isActive('/settings')}
                  tooltip="الإعدادات"
              >
                <Link href="/settings">
                  <Settings />
                  <span>الإعدادات</span>
                </Link>
              </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
