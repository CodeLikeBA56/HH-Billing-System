"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthProvider";
import { useNotification } from "@/contexts/NotificationProvider";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditProfileDialog: React.FC<EditProfileDialogProps> = React.memo(({ open, onOpenChange }) => {
  const { userInfo, updateAdmin } = useAuthContext();
  const { pushNotification } = useNotification();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (userInfo && open) {
      setName(userInfo?.providerData?.[0]?.displayName || userInfo?.displayName || "");
      setEmail(userInfo?.email || "");
      setPassword("");
      setConfirmPassword("");
    }
  }, [userInfo, open]);

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      return pushNotification("warning", "Name is required.");
    }

    if (!email.trim()) {
      return pushNotification("warning", "Email is required.");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return pushNotification("warning", "Please enter a valid email address.");
    }

    // If password is provided, validate it
    if (password) {
      if (password.length < 6) {
        return pushNotification("warning", "Password must be at least 6 characters long.");
      }

      if (password !== confirmPassword) {
        return pushNotification("warning", "Passwords do not match.");
      }
    }

    try {
      setSubmitting(true);
      await updateAdmin({
        name: name.trim(),
        email: email.trim(),
        ...(password && { password }),
      });
      pushNotification("success", "Profile updated successfully!");
      onOpenChange(false);
      setPassword("");
      setConfirmPassword("");
    } catch {
      // Error is already handled in updateAdmin
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-primary-color">Name</label>
            <Input
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-primary-color">Email</label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-primary-color">New Password (optional)</label>
            <Input
              type="password"
              placeholder="Leave empty to keep current password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {password && (
            <div className="space-y-2">
              <label className="text-sm text-primary-color">Confirm Password</label>
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleUpdateProfile} disabled={submitting}>
            {submitting ? "Updating..." : "Update Profile"}
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

EditProfileDialog.displayName = "EditProfileDialog";

export default EditProfileDialog;
