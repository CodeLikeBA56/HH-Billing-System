import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar";
import React from "react";
import Image from "next/image";
import { ActiveLinkOptions } from "@/types";
import styles from "./app-sidebar.module.css";
import { useAuthContext } from "@/contexts/AuthProvider";
import { useTheme } from "@/contexts/ThemeProvider";
  
interface SidebarLinkProps {
    label: string;
    icon: string;
    name: ActiveLinkOptions;
}
  
const SidebarLink: React.FC<SidebarLinkProps> = ({ label, icon, name, }) => {
    const { activeLink, setActiveLink } = useTheme();
    const isActive = activeLink === name;
  
    return (
      <li
        onClick={() => setActiveLink(name)}
        className={styles[isActive ? "app-sidebar-link-active" : "app-sidebar-link"]}
      >
        <span className="material-symbols-outlined">{icon}</span>
        <span className="title">{label}</span>
      </li>
    );
  };
  
  const AppSidebar: React.FC = () => {
    const { userInfo } = useAuthContext();
    console.log(userInfo)
  
    return (
      <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
        <SidebarHeader>
          <h3 className="text-[20px] text-main p-2 sm:py-5 font-extrabold font-serif">
            {"HH Men's Wear"}
          </h3>
        </SidebarHeader>
  
        <SidebarContent>
          <SidebarGroup style={{ padding: 0 }}>
            <h4 className="text-1xl text-secondary-text font-bold px-3 pt-6">General</h4>
            <ul className="text-primary-text gap-2 flex flex-col">
              <SidebarLink
                label="Clients"
                icon="groups"
                name="client"
              />
              <SidebarLink
                label="Products"
                icon="inventory_2"
                name="product"
              />
              <SidebarLink
                label="Invoices"
                icon="receipt_long"
                name="invoice"
              />
            </ul>
          </SidebarGroup>
        </SidebarContent>
  
        <SidebarFooter>
          <span className="px-3">Version 1.0</span>

          <div className="flex items-center gap-3 p-3">
            <Image
              src={userInfo?.photoURL || "/default-avatar.png"}
              alt="HH"
              width={40}
              height={40}
              className="rounded-full object-cover border"
            />
            <div>
              <h1 className="text-primary-text font-medium">
                {userInfo?.providerData[0].displayName || "Hamza Hussnain"}
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