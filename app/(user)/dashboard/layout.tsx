"use client";
import { ReactNode } from "react";
import AppSidebar from "@/components/app-sidebar";
import { useTheme } from "@/contexts/ThemeProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { toggleTheme } = useTheme();

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto bg-background">
            <nav className="flex items-center p-4 sm:p-5 border-b border-border-color">
                <SidebarTrigger />

                <h3 className="text-2xl text-main font-extrabold font-serif mx-auto">
                {"HH Men's Wear"}
                </h3>

                <button
                type="button"
                onClick={toggleTheme}
                className="rounded-full hover:bg-accent p-2 transition"
                >
                <span className="material-symbols-outlined">dark_mode</span>
                </button>
            </nav>

            {children}
        </main>
      </div>
    </SidebarProvider>
  );
}