"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInvoiceContext } from "@/contexts/InvoiceProvider";
import { useClientContext } from "@/contexts/ClientProvider";
import {
  Table,
  TableBody,
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
  const { getCustomerName } = useClientContext();
  const [activeFilter, setActiveFilter] = useState<InvoiceFilter>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleCreateInvoice = () => {
    router.push(`/dashboard/create-invoice`);
  };

  // Filtering and search logic
  const filteredInvoices = useMemo(() => {
    if (!invoices) return [];
    
    // First apply status filter
    let statusFiltered = invoices;
    switch (activeFilter) {
      case "paid":
        statusFiltered = invoices.filter(
          (invoice) => invoice.remainingBalance === 0 && invoice.paidAmount > 0
        );
        break;
      case "partial":
        statusFiltered = invoices.filter(
          (invoice) =>
            invoice.remainingBalance > 0 && invoice.paidAmount > 0
        );
        break;
      case "unpaid":
        statusFiltered = invoices.filter(
          (invoice) =>
            invoice.remainingBalance > 0 && invoice.paidAmount === 0
        );
        break;
      default:
        statusFiltered = invoices;
    }
    
    // Then apply search filter
    if (!searchQuery.trim()) {
      return statusFiltered;
    }
    
    const query = searchQuery.toLowerCase().trim();
    return statusFiltered.filter((invoice) => {
      const customerName = getCustomerName(invoice.customerId).toLowerCase();
      const billNo = invoice.billNo.toLowerCase();
      
      return customerName.includes(query) || billNo.includes(query);
    });
  }, [invoices, activeFilter, searchQuery, getCustomerName]);

  return (
    <div>
      {/* Header */}
      <header className="flex justify-between items-center px-5 py-5 gap-4">
        <h1 className="text-2xl font-bold text-main">Invoices</h1>
        <div className="flex items-center gap-3 flex-1 max-w-md ml-auto">
          <Input
            type="text"
            placeholder="Search by customer name or bill no..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleCreateInvoice}>Create Invoice</Button>
        </div>
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
            <span className={`${activeFilter === filter.key ? "text-primary-text" : "text-gray-500" }`}>{filter.label}</span>
          </Button>
        ))}
      </section>

      {/* Table */}
      {filteredInvoices.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="p-0">-</TableHead>
              <TableHead>Bill No</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Grand Total</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Remaining</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice: Invoice) => (
              <InvoiceRow key={invoice.uid} invoice={invoice} />
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="px-5 py-3 text-secondary-text">No invoices found.</p>
      )}
    </div>
  );
};

export default ManageInvoicePage;