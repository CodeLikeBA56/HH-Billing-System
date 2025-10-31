"use client";
import React, { ReactNode, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeProvider";
import NotificationStack from "@/components/NotificationStack/NotificationStack";

interface AppProps {
  children: ReactNode;
}

const App: React.FC<AppProps> = ({ children }) => {
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  return (
    <>
      {children}
      <NotificationStack />
    </>
  );
};

export default App;