"use client";
import { ActiveLinkOptions } from "@/types";
import React, { createContext, ReactNode, useCallback, useContext, useState } from "react";

type ThemeContextProps = {
  isDarkMode: boolean;
  isSidebarOpen: boolean;
  activeLink: ActiveLinkOptions;
  toggleTheme: () => void;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveLink: React.Dispatch<React.SetStateAction<ActiveLinkOptions>> ;
};

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      return savedTheme === "dark";
    }
    return false;
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [activeLink, setActiveLink] = useState<ActiveLinkOptions>("client");

  const toggleTheme = useCallback(() => {
    setIsDarkMode(prevMode => {
      console.log("clicked")
      const newMode = !prevMode;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      activeLink,
      isSidebarOpen, 
      toggleTheme, 
      setActiveLink,
      setIsSidebarOpen,
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

export default ThemeProvider;