"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import React from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import styles from "./app-sidebar.module.css";
import { useAuthContext } from "@/contexts/AuthProvider";
import { useClientContext } from "@/contexts/ClientProvider";
import { useProductContext } from "@/contexts/ProductProvider";
import { useInvoiceContext } from "@/contexts/InvoiceProvider";

interface SidebarLinkProps {
  label: string;
  icon: string;
  href: string;
  count?: number;
}

const SidebarLink: React.FC<SidebarLinkProps> = React.memo(({ label, icon, href, count = 0 }) => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = pathname === href;

  const handleClick = () => {
    router.push(href);
  };

  return (
    <li
      onClick={handleClick}
      className={styles[isActive ? "app-sidebar-link-active" : "app-sidebar-link"]}
    >
      <span className="material-symbols-outlined">{icon}</span>
      <span className="title">{label}</span>

      <span 
        className="ml-auto bg-main text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
      >
        {count}
      </span>
    </li>
  );
 
  SidebarLink.displayName = "SidebarLink";
});

const AppSidebar: React.FC = () => {
  const { userInfo } = useAuthContext();
  const { clients } = useClientContext();
  const { products } = useProductContext();
  const { invoices } = useInvoiceContext();

  return (
    <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
      {/* Header */}
      <SidebarHeader>
        <h3 className="text-[20px] text-main p-2 sm:py-5 font-extrabold font-serif">
          {"HH Men's Wear"}
        </h3>
      </SidebarHeader>

      {/* Links */}
      <SidebarContent>
        <SidebarGroup style={{ padding: 0 }}>
          <h4 className="text-1xl text-secondary-text font-bold px-3 pt-6">
            General
          </h4>
          <ul className="text-primary-text gap-2 flex flex-col">
            <SidebarLink label="Clients" icon="groups" href="/dashboard" count={clients.length} />
            <SidebarLink label="Products" icon="inventory_2" href="/dashboard/product" count={products.length} />
            <SidebarLink label="Invoices" icon="receipt_long" href="/dashboard/invoice" count={invoices.length} />
          </ul>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <span className="px-3">Version 1.0</span>

        <div className="flex items-center gap-3 p-3">
          <Image
            src={userInfo?.photoURL || "/assets/No-Profile.webp"}
            alt="HH"
            width={40}
            height={40}
            className="rounded-full object-cover border"
          />
          <div>
            <h1 className="text-primary-text font-medium">
              {userInfo?.providerData?.[0]?.displayName || "Hamza Hussnain"}
            </h1>
            <span className="text-secondary-text text-sm">
              {userInfo?.email?.split("@")?.[0] || "hamza"}
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;