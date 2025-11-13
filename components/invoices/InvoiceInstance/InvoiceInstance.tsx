"use client";
import React from "react";
import { Invoice } from "@/types";
import { TableCell, TableRow } from "@/components/ui/table";
import { useClientContext } from "@/contexts/ClientProvider";
import { useRouter } from "next/navigation";

const InvoiceRow = React.memo(({ invoice }: { invoice: Invoice }) => {
    const router = useRouter();
    const { getCustomerName } = useClientContext();

    const getPaymentStatus = (invoice: Invoice) => {
      const { grandTotal, paidAmount } = invoice;
      if (paidAmount >= grandTotal) return "paid";
      if (paidAmount === 0) return "unpaid";
      return "partial";
    };

    const getStatusStyles = (status: string) => {
      switch (status) {
        case "paid":
          return "bg-[#EBF7EE] border border-[#3FBF62] text-[#3FBF62]";
        case "unpaid":
          return "bg-[#FEF7EA] border border-[#EF9400] text-[#EF9400]";
        case "partial":
          return "bg-[#E5EFFA] border border-[#016BE1] text-[#016BE1]";
        default:
          return "";
      }
    };
  
    const status = getPaymentStatus(invoice);
  
    return (
      <TableRow key={invoice.uid}>
        <TableCell>
          <button
            type="button"
            onClick={() => router.push(`/dashboard/invoice/${invoice.uid}`)}
            className="material-symbols-outlined w-full! rounded-none! bg-transparent!"
          >
            edit
          </button>
        </TableCell>

        <TableCell>
          <span
            className={`px-3 py-1 rounded-md text-sm font-medium ${getStatusStyles(
              status
            )}`}
          >
            {invoice.billNo}
          </span>
        </TableCell>

        <TableCell>{getCustomerName(invoice.customerId)}</TableCell>
        <TableCell>{invoice.grandTotal}</TableCell>
        <TableCell>{invoice.paidAmount}</TableCell>
        <TableCell>{invoice.remainingBalance}</TableCell>

        <TableCell>
            { invoice.createdAt ? invoice.createdAt.toLocaleDateString() : "-" }
        </TableCell>
      </TableRow>
    );

    InvoiceRow.displayName = "InvoiceRow";
});

export default InvoiceRow;