"use client";
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useInvoiceContext } from "@/contexts/InvoiceProvider";
import { useRouter } from "next/navigation";

const ManageInvoicePage: React.FC = () => {
  const router = useRouter();
  const {  } = useInvoiceContext();

  const handleCreateInvoice = useCallback(async () => {
    router.push(`/dashboard/create-invoice`);
  }, [router]);

  return (
    <div>
      {/* Header */}
      <header className="flex justify-between items-center px-5 py-5">
        <h1 className="text-2xl font-bold text-main">Invoices</h1>

        <Button type="button" onClick={handleCreateInvoice}>Create Invoice</Button>
      </header>

      <section className=" border-b">

      </section>
    </div>
  );
};

export default ManageInvoicePage;