"use client";
import React, { useState } from "react";
import { useTheme } from "@/contexts/ThemeProvider";
import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Home() {
    const { toggleTheme, isSidebarOpen, setIsSidebarOpen } = useTheme();
    const [open, setIsOpen] = useState<boolean>(true);

    return (
        <SidebarProvider open={isSidebarOpen} onOpenChange={open => setIsSidebarOpen(open)}>
            <AppSidebar />
            <main className="flex-1">
                <nav className="flex items-center p-4 sm:p-5 border-b border-border-color">
                    <SidebarTrigger />

                    <h3 className="text-2xl text-main font-extrabold font-serif ml-auto mr-auto">{"HH Men's Wear"}</h3>

                    <button 
                        type="button" 
                        onClick={toggleTheme}
                        className='rounded-full'
                    >
                        <span className="material-symbols-outlined">dark_mode</span>
                    </button>
                </nav>

                <section className="h-full flex p-4">
                    <h1 className="text-3xl font-extrabold">Clients</h1>
                </section>
            </main>
        </SidebarProvider>
    )
}

