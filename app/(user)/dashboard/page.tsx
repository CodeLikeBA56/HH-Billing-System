"use client";

import React, { useState } from "react";
import { useClientContext } from "@/contexts/ClientProvider";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Client } from "@/types";
import { useInvoiceContext } from "@/contexts/InvoiceProvider";
import { useNotification } from "@/contexts/NotificationProvider";
import EditClientDialog from "@/components/clients/EditClientDialog";
import { useRouter } from "next/navigation";

const ManageClientPage: React.FC = () => {
  const router = useRouter();
  const { pushNotification } = useNotification();
  const { getReceivableBalance } = useInvoiceContext();
  const { clients, addClient, deleteClient, loading, error } = useClientContext();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const handleOpenEdit = (client: Client) => {
    setSelectedClient(client);
    setEditOpen(true);
  };

  const handleAddClient = async () => {
    if (!name.trim() || !phone.trim())
      return pushNotification("warning", "The name and phone number are required.");

    try {
      setSubmitting(true);
      await addClient({ name, phone, location });
      setName("");
      setPhone("");
      setLocation("");
      setOpen(false);
    } catch {
      pushNotification("error", "Failed to add client");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (confirm("Are you sure you want to delete this client?")) {
      await deleteClient(id);
      pushNotification("success", "Client deleted successfully.");
    }
  };

  return (
    <div className="">
      {/* Header */}
      <header className="flex justify-between items-center px-5 py-5">
        <h1 className="text-2xl font-bold text-main">Clients</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Client</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
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
              <Input
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button onClick={handleAddClient} disabled={submitting}>
                {submitting ? "Adding..." : "Add Client"}
              </Button>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      {/* Error / Loading */}
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p className="text-secondary-text text-center py-5">Loading clients...</p>}

      {/* Clients Table */}
      {!loading && clients.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="p-0">-</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Receivable</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="p-0">-</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.uid}>
                <TableCell className="p-0 w-[60px]">
                  <button type="button" className="bg-transparent! mx-auto" onClick={() => handleOpenEdit(client)}>
                    <span className="material-symbols-outlined text-green-500">edit</span>
                  </button>
                </TableCell>
                <TableCell className="p-0">
                  <Button
                    type="button"
                    className="w-full rounded-none! bg-transparent! text-primary-text!"
                    onClick={() => router.push(`/dashboard/create-invoice?clientId=${client.uid}`)}
                  >
                    {client?.name}
                  </Button>
                </TableCell>
                <TableCell>{client?.phone}</TableCell>
                <TableCell>{client?.location}</TableCell>
                <TableCell>{getReceivableBalance(client.uid!)}</TableCell>
                <TableCell>
                  {
                    client?.createdAt
                    ?  client?.createdAt.toLocaleDateString()
                    : "-"
                  }
                </TableCell>
                <TableCell className="p-0 w-[80px]">
                  <button type="button" className="bg-transparent! mx-auto" onClick={() => handleDeleteClient(client.uid as string)}>
                    <span className="material-symbols-outlined text-red-500">delete</span>
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        !loading && <p className="px-5 py-3 text-secondary-text">No clients found.</p>
      )}

      <EditClientDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        client={selectedClient}
      />
    </div>
  );
};

export default ManageClientPage;