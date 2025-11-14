"use client";
import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle } from "lucide-react";
import { deepEqual } from "@/hooks/deepEqual";
import { InvoiceItem, Invoice } from "@/types";
import { useClientContext } from "@/contexts/ClientProvider";
import { useProductContext } from "@/contexts/ProductProvider";
import { useInvoiceContext } from "@/contexts/InvoiceProvider";
import { useNotification } from "@/contexts/NotificationProvider";

const EditInvoicePage = () => {
    const params = useParams();
    const router = useRouter();
    const { pushNotification } = useNotification();
    const invoiceId = Array.isArray(params?.id) ? params.id[0] : params?.id || "";

    const { clients } = useClientContext();
    const { products } = useProductContext();
    const { invoices, updateInvoice, deleteInvoice } = useInvoiceContext();

    const existingInvoice = useMemo(() => {
        return invoices.find((inv) => inv.uid === invoiceId);
    }, [invoices, invoiceId]);

    const [invoice, setInvoice] = useState<Invoice | null>(existingInvoice || null);

    const customerId = invoice?.customerId;

    const selectedClientInfo = useMemo(() => {
        if (!customerId || !clients.length) return null;

        return clients.find((c) => c.uid === customerId) || null;
    }, [clients, customerId]);

    const handleChangeItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
        if (!invoice) return;
        
        const updatedItems = [...invoice.items];
        updatedItems[index] = { ...updatedItems[index], [field]: value };

        if (field === "productId") {
            const product = products.find((p) => p.uid === value);
            if (product) {
                updatedItems[index].price = product.price;
                updatedItems[index].productName = product.name;
                updatedItems[index].designNumber = product.designNumber;
            }
        }

        updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].price;
        setInvoice({ ...invoice, items: updatedItems });
    };

    const handleAddRow = () => {
        if (!invoice) return;

        setInvoice({
            ...invoice,
            items: [
                ...invoice.items,
                {
                    productId: "",
                    productName: "",
                    designNumber: "",
                    size: "S",
                    quantity: 1,
                    price: 0,
                    total: 0,
                },
            ],
        });
    };

    const handleRemoveRow = (index: number) => {
        if (!invoice) return;

        const updatedItems = invoice.items.filter((_, i) => i !== index);
        setInvoice({ ...invoice, items: updatedItems });
    };

    const handleChangeField = <K extends keyof Invoice>(field: K, value: Invoice[K]) => {
        if (!invoice) return;
        setInvoice({ ...invoice, [field]: value });
    };

    const grandTotal = useMemo(() => { 
      return invoice?.items.reduce((sum, item) => sum + item.total, 0) || 0
    }, [invoice]);

    const remainingBalance = grandTotal - (invoice?.paidAmount || 0);
    const isChanged = !deepEqual(invoice, existingInvoice);

    const handleSaveChanges = async () => {
        if (!invoice || !isChanged) return;

        if (invoice.paidAmount > invoice.grandTotal) {
          return pushNotification("warning", "The paid amount cannot be greater than the grand total.");
        }        

        await updateInvoice(invoice.uid!, {
            ...invoice,
            grandTotal,
            remainingBalance,
            updatedAt: new Date(),
        });

        router.push("/dashboard/invoice");
        pushNotification("success", "Invoice updated successfully!");
    };

  const handleDelete = async () => {
    if (!invoice) return;
    
    const confirmDelete = confirm("Are you sure you want to delete this invoice?");
    if (confirmDelete) {
      await deleteInvoice(invoice.uid!);
      pushNotification("success", "Invoice deleted successfully!");
      router.push("/dashboard/invoice");
    }
  };

  const handleDiscard = () => router.push("/dashboard/invoice");

  if (!invoice) {
    return (
      <p className="text-center text-lg text-gray-500 mt-10">
        Invoice not found.
      </p>
    );
  }

  return (
    <>
      <h2 className="py-4 text-3xl text-main text-center font-extrabold sm:py-6">
        Edit Invoice
      </h2>

      {/* =================== CLIENT SECTION =================== */}
      <div className="gap-3 md:gap-15 flex flex-col sm:flex-row px-4 sm:px-6 mb-8 overflow-x-hidden">
        <div className="gap-2 flex flex-col">
          <label className="text-sm text-primary-color">Client</label>
          <Select
            value={invoice.customerId}
            onValueChange={(val) => handleChangeField("customerId", val)}
          >
            <SelectTrigger className="w-fit bg-transparent! text-primary-text! border! border-border!">
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((c) => (
                <SelectItem key={c.uid} value={c.uid!}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="gap-2 flex flex-col">
          <label className="text-sm">Phone</label>
          <Input type="text" value={selectedClientInfo?.phone || ""} disabled />
        </div>
      </div>

      {/* =================== ITEMS SECTION =================== */}
      <div className="flex justify-between items-center px-4 sm:px-6 mb-3">
        <h3 className="text-lg font-semibold text-primary-text">Items</h3>
        <Button
          type="button"
          variant="outline"
          onClick={handleAddRow}
          className="flex items-center gap-2"
        >
          <PlusCircle size={16} /> Add Item
        </Button>
      </div>

      <Table
        className="
          [&_td]:p-0
          [&_th]:p-0 [&_th]:px-3 
          sm:[&_td]:p-0
          sm:[&_th]:p-0
        "
      >
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">-</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead className="text-center w-25">Design No</TableHead>
            <TableHead className="text-center w-18">Size</TableHead>
            <TableHead className="text-center w-18">Qty</TableHead>
            <TableHead className="text-center w-25">Price</TableHead>
            <TableHead className="text-center w-70">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoice.items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <button
                  type="button"
                  onClick={() => handleRemoveRow(index)}
                  className="w-[59px]! bg-transparent!"
                >
                  <span className="material-symbols-outlined text-red-500 text-[21px]! font-bold!">
                    close
                  </span>
                </button>
              </TableCell>
              <TableCell>
                <Select
                  value={item.productId}
                  onValueChange={(val) => handleChangeItem(index, "productId", val)}
                >
                  <SelectTrigger className="bg-transparent! text-primary-text! w-full! focus:ring-0!">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.uid} value={p.uid!}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-center">{item.designNumber}</TableCell>
              <TableCell>
                <Select
                  value={item.size}
                  onValueChange={(val) => handleChangeItem(index, "size", val)}
                >
                  <SelectTrigger className="bg-transparent! text-primary-text! w-full! focus:ring-0!">
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent>
                    {["XS", "S", "M", "L", "XL"].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleChangeItem(index, "quantity", +e.target.value)}
                  className="w-25 text-center border-0 rounded-none! focus:ring-0!"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={item.price}
                  onChange={(e) => handleChangeItem(index, "price", +e.target.value)}
                  className="w-25 text-center border-0 rounded-none! focus:ring-0!"
                />
              </TableCell>
              <TableCell className="text-center min-w-[80px] font-bold text-primary-text">
                {item.total.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* =================== TOTAL & ACTION BUTTONS =================== */}
      <div className="flex justify-between items-center px-4 sm:px-6 mt-6">
        <p className="text-md sm:text-lg font-semibold text-main">
          Grand Total:{" "}
          <span className="text-primary-text font-bold">
            {grandTotal.toFixed(2)}
          </span>
        </p>

        <div className="flex items-center gap-3">
          <span>Amount Paid:</span>
          <Input
            min={0}
            max={grandTotal}
            type="number"
            required
            value={invoice.paidAmount}
            onChange={(e) => handleChangeField("paidAmount", +e.target.value)}
            className="w-20! sm:w-28! shadow-none! border-0 border-b-2 border-border rounded-none
                text-primary-text focus-visible:ring-0 focus:border-main bg-transparent"
          />
        </div>
      </div>

      <div className="flex justify-between items-center mt-10 px-4 sm:px-6">
        <div className="flex gap-3">
          <Button 
            type="button"
            variant="outline" 
            onClick={handleDelete}
          >
            Delete Invoice
          </Button>
          <Button 
            type="button"
            variant="secondary" 
            onClick={handleDiscard}
          >
            Discard Changes
          </Button>
        </div>
        <Button
          type="button"
          onClick={handleSaveChanges}
          disabled={!isChanged}
          className="font-bold px-8 py-6"
        >
          Save Changes
        </Button>
      </div>
    </>
  );
}

export default EditInvoicePage;