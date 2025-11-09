"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const ManageInvoicePage: React.FC = () => {
  

  return (
    <div>
      {/* Header */}
      <header className="flex justify-between items-center px-5 py-5">
        <h1 className="text-2xl font-bold text-main">Invoices</h1>

        <Button>Create Invoice</Button>
      </header>

      <section className=" border-b">

      </section>
    </div>
  );
};

export default ManageInvoicePage;