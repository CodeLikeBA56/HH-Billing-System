"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useAuthContext } from "@/contexts/AuthProvider";
import EditProfileDialog from "./EditProfileDialog";

const UserProfileMenu: React.FC = () => {
  const { userInfo, logout } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  const handleEditProfile = () => {
    setEditDialogOpen(true);
    setIsOpen(false);
  };

  const displayName = userInfo?.providerData?.[0]?.displayName || userInfo?.displayName || "Hamza Husnain";
  const email = userInfo?.email || "";
  const emailPrefix = email.split("@")[0] || "hamza";

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 p-3 w-full bg-transparent! hover:bg-accent rounded-md transition-colors"
        >
          <Image
            src={userInfo?.photoURL || "/assets/No-Profile.webp"}
            alt="User profile"
            width={40}
            height={40}
            className="rounded-full object-cover border"
          />
          <div className="flex-1 text-left">
            <h1 className="text-primary-text font-medium">
              {displayName}
            </h1>
            <span className="text-secondary-text text-sm">
              {emailPrefix}
            </span>
          </div>
          <span className={`material-symbols-outlined text-secondary-text transition-transform ${isOpen ? "rotate-180" : ""}`}>
            expand_more
          </span>
        </button>

        {isOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-background border border-border rounded-md shadow-lg z-50">
            <button
              type="button"
              onClick={handleEditProfile}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-none! hover:bg-accent transition-colors text-left text-primary-text"
            >
              <span className="material-symbols-outlined text-[20px]">edit</span>
              <span>Edit Profile</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent rounded-none! transition-colors text-left text-primary-text border-t border-border"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      <EditProfileDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} />
    </>
  );
};

export default UserProfileMenu;
