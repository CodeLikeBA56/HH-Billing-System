"use client";
import { auth } from "@/lib/firebase";
import { signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useNotification } from "./NotificationProvider";
import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";

interface AuthContextType {
  userInfo: User | null;
  logout: () => Promise<void>;
  setUserInfo: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const Router = useRouter();
  const { pushNotification } = useNotification();

  const [userInfo, setUserInfo] = useState(() => {
    try {
      const storedUser = localStorage.getItem("userInfo");
      const user = storedUser ? JSON.parse(storedUser) : null;
      return user;
    } catch {
      return null;
    }
  });
  
  useEffect(() => {
    if (!userInfo) return;
    
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  }, [userInfo]);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("userInfo");
      setUserInfo(null);
      pushNotification("info", "Logged out successfully!");
      Router.push("/sign-in");
    } catch (error: unknown | any) {
      pushNotification("error", `Logout failed: ${error.response?.data || error.message}`);
    }
  }, [pushNotification, Router]);

  return (
    <AuthContext.Provider
      value={{ 
        userInfo, setUserInfo, logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType | undefined => useContext(AuthContext);

export default AuthProvider;