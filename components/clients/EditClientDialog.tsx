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
import { useClientContext } from "@/contexts/ClientProvider";
import { useNotification } from "@/contexts/NotificationProvider";
import { Client } from "@/types";

interface EditClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
}

const EditClientDialog: React.FC<EditClientDialogProps> = React.memo(({open, onOpenChange, client}) => {
  const { updateClient } = useClientContext();
  const { pushNotification } = useNotification();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (client) {
      setName(client.name);
      setPhone(client.phone);
    }
  }, [client]);

  const handleUpdateClient = async () => {
    if (!client) return;
    if (!name.trim() || !phone.trim())
      return pushNotification("warning", "The name and phone number are required.");

    try {
      setSubmitting(true);
      await updateClient(client?.uid as string, { name, phone });
      pushNotification("success", "Client updated successfully.");
      onOpenChange(false);
    } catch {
      pushNotification("error", "Failed to update client.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-4">
          <Input
            placeholder="Client name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button onClick={handleUpdateClient} disabled={submitting}>
            {submitting ? "Updating..." : "Update Client"}
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  EditClientDialog.displayName = "EditClientDialog";
});

export default EditClientDialog;