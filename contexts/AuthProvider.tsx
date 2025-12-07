"use client";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useNotification } from "./NotificationProvider";
import { signOut, User, updateProfile, updateEmail, updatePassword } from "firebase/auth";
import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";

interface AdminProps {
  name?: string;
  email?: string;
  password?: string;
}

interface AuthContextType {
  userInfo: User | null;
  logout: () => Promise<void>;
  setUserInfo: React.Dispatch<React.SetStateAction<User | null>>;
  updateAdmin: (data: AdminProps) => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const Router = useRouter();
  const { pushNotification } = useNotification();

  const [userInfo, setUserInfo] = useState(() => {
    try {
      const storedUser = localStorage.getItem("userInfo");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });
  
  useEffect(() => {
    if (!userInfo) return;
   
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
  }, [userInfo]);

  const updateAdmin = useCallback(async ({ name, email, password } : AdminProps) => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        pushNotification("error", "No user is logged in");
        return;
      }

      try {
        if (name) await updateProfile(currentUser, { displayName: name });
        if (email) await updateEmail(currentUser, email);
        if (password) await updatePassword(currentUser, password);

        // Reload user to get updated information
        await currentUser.reload();
        
        // Update userInfo with the reloaded user
        setUserInfo(auth.currentUser);

        pushNotification("success", "Profile updated successfully!");
      } catch (error: unknown) {
        let errorMessage = "Profile update failed.";
      
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (
          typeof error === "object" &&
          error !== null &&
          "response" in error
        ) {
          const err = error as { response?: { data?: string } };
          errorMessage = `Profile update failed: ${err.response?.data || "Unknown error"}`;
        }
      
        pushNotification("error", errorMessage);
      }      
    }, [setUserInfo, pushNotification]);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("userInfo");
      setUserInfo(null);
      pushNotification("info", "Logged out successfully!");
      Router.push("/");
    } catch (error: unknown) {
      let errorMessage = "Logout failed";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { data?: string } };
        errorMessage = `Logout failed: ${err.response?.data || "Unknown error"}`;
      }

      pushNotification("error", errorMessage);
    }
  }, [pushNotification, Router]);

  return (
    <AuthContext.Provider
      value={{ userInfo, setUserInfo, updateAdmin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthContext must be used within a AuthProvider");

  return context
}

export default AuthProvider;