"use client";
import React from "react";
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

const ManageInvoicePage: React.FC = () => {
  const router = useRouter();
  const { invoices } = useInvoiceContext();

  const handleCreateInvoice = () => {
    router.push(`/dashboard/create-invoice`);
  };

  return (
    <div>
      {/* Header */}
      <header className="flex justify-between items-center px-5 py-5 border-b">
        <h1 className="text-2xl font-bold text-main">Invoices</h1>
        <Button onClick={handleCreateInvoice}>Create Invoice</Button>
      </header>

      {/* Table */}
      <section className="p-5">
      </section>
      <Table className="
        [&_td]:p-0
        [&_th]:p-0 [&_th]:px-3 
        sm:[&_td]:p-0
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
          {
            invoices?.length > 0 ? (
              invoices?.map((invoice: Invoice) => (
                <InvoiceRow
                  key={invoice.uid}
                  invoice={invoice}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-5!">
                  No invoices found
                </TableCell>
              </TableRow>
            )
          }
        </TableBody>
      </Table>
    </div>
  );
};

export default ManageInvoicePage;