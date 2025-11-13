"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useInvoiceContext } from "@/contexts/InvoiceProvider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Invoice } from "@/types";
import InvoiceRow from "@/components/invoices/InvoiceInstance/InvoiceInstance";

type InvoiceFilter = "all" | "paid" | "partial" | "unpaid";

// Filters Config (outside the component)
type Filters = {
  key: InvoiceFilter;
  label: string;
  color: string;
}

const filters: Filters[] = [
  { key: "all", label: "All", color: "bg-primary-text" },
  { key: "paid", label: "Paid", color: "bg-green-500" },
  { key: "partial", label: "Partially Paid", color: "bg-[#016BE1]" },
  { key: "unpaid", label: "Unpaid", color: "bg-[#EF9400]" },
];

const ManageInvoicePage: React.FC = () => {
  const router = useRouter();
  const { invoices } = useInvoiceContext();
  const [activeFilter, setActiveFilter] = useState<InvoiceFilter>("all");

  const handleCreateInvoice = () => {
    router.push(`/dashboard/create-invoice`);
  };

  // Filtering logic
  const filteredInvoices = useMemo(() => {
    if (!invoices) return [];
    switch (activeFilter) {
      case "paid":
        return invoices.filter(
          (invoice) => invoice.remainingBalance === 0 && invoice.paidAmount > 0
        );
      case "partial":
        return invoices.filter(
          (invoice) =>
            invoice.remainingBalance > 0 && invoice.paidAmount > 0
        );
      case "unpaid":
        return invoices.filter(
          (invoice) =>
            invoice.remainingBalance > 0 && invoice.paidAmount === 0
        );
      default:
        return invoices;
    }
  }, [invoices, activeFilter]);

  return (
    <div>
      {/* Header */}
      <header className="flex justify-between items-center px-5 py-5">
        <h1 className="text-2xl font-bold text-main">Invoices</h1>
        <Button onClick={handleCreateInvoice}>Create Invoice</Button>
      </header>

      {/* Filter Buttons */}
      <section
        className="gap-6 sm:gap-6 flex px-4 sm:px-6 pb-5
        [&_button]:p-0! [&_button]:bg-transparent! [&_button]:gap-3!
        [&_button]:rounded-none! [&_button]:px-2!
        [&_button]:border-b-2! hover:[&_button]:border-b-2! "
      >
        {filters.map((filter) => (
          <Button
            key={filter.key}
            type="button"
            onClick={() => setActiveFilter(filter.key)}
            className={`${
              activeFilter === filter.key ? "border-main!" : "border-transparent!"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${filter.color}`}></span>
            <span className="text-primary-text">{filter.label}</span>
          </Button>
        ))}
      </section>

      {/* Table */}
      <Table
        className="
        [&_td]:p-0
        [&_th]:p-0 [&_th]:px-3 
        sm:[&_td]:p-0 [&_td]:px-2
        sm:[&_th]:p-0"
      >
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">-</TableHead>
            <TableHead>Bill No</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Grand Total</TableHead>
            <TableHead>Paid</TableHead>
            <TableHead>Remaining</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredInvoices.length > 0 ? (
            filteredInvoices.map((invoice: Invoice) => (
              <InvoiceRow key={invoice.uid} invoice={invoice} />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-5!">
                No invoices found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ManageInvoicePage;