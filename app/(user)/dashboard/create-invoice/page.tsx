"use client";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useCallback, useMemo } from "react";
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
import { InvoiceItem, size } from "@/types";
import { useClientContext } from "@/contexts/ClientProvider";
import { useProductContext } from "@/contexts/ProductProvider";
import { useInvoiceContext } from "@/contexts/InvoiceProvider";

export default function CreateInvoice() {
  const params = useSearchParams();
  const clientId = params.get("client") || "";

  const { clients } = useClientContext();
  const { products } = useProductContext();
  const { addInvoice } = useInvoiceContext();

  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [selectedClientId, setSelectedClientId] = useState<string>(clientId);

  const selectedClientInfo = useMemo(() => {
    if (!selectedClientId || !clients.length) return null;

    return clients.find((c) => c.uid === selectedClientId) || null;
  }, [clients, selectedClientId]);

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      productId: "",
      productName: "",
      designNumber: "",
      size: "S",
      quantity: 1,
      price: 0,
      total: 0,
    },
  ]);

  const handleAddRow = () => {
    setItems((prev) => [
      ...prev,
      {
        productId: "",
        productName: "",
        designNumber: "",
        size: "S",
        quantity: 1,
        price: 0,
        total: 0,
      },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = <K extends keyof InvoiceItem>(index: number, field: K, value: InvoiceItem[K]) => {
    const updated = [...items];
    updated[index][field] = value;

    if (field === "productId") {
      const product = products.find((p) => p.uid === value);
      if (product) {
        updated[index].price = product.price;
        updated[index].productName = product.name;
        updated[index].designNumber = product.designNumber;
      }
    }

    updated[index].total = updated[index].quantity * updated[index].price;
    setItems(updated);
  };

  const grandTotal = useMemo(() => { 
    return items.reduce((sum, item) => sum + item.total, 0) || 0
  }, [items]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const billNo = `INV-${Date.now()}`;

    await addInvoice({
      billNo,
      customerId: selectedClientId,
      items,
      grandTotal,
      paidAmount,
      remainingBalance: grandTotal - paidAmount,
    });

    alert("Invoice added successfully!");
  }, [addInvoice, grandTotal, items, paidAmount, selectedClientId]);

  return (
    <>
      <h2 className="py-4 text-3xl text-main text-center font-extrabold sm:py-6">
        Create Invoice
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* =================== CLIENT SECTION =================== */}
        <h3 className="text-lg font-semibold text-primary-text px-4 sm:px-6">
          Client Details
        </h3>
        <div className="gap-3 md:gap-15 flex flex-col sm:flex-row px-4 sm:px-6 mb-8 overflow-x-hidden">
          <div className="gap-2 flex flex-col">
            <label className="text-sm text-primary-color">Select Client</label>
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger className="w-fit bg-transparent! text-primary-text! border! border-border!">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {clients?.map((c) => (
                  <SelectItem key={c.uid} value={c.uid!}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="gap-2 flex flex-col">
            <label className="text-sm">Phone</label>
            <Input
              type="text"
              className="sm:w-fit!"
              value={selectedClientInfo?.phone || ""}
              disabled
            />
          </div>
        </div>

        {/* =================== ITEMS SECTION =================== */}
        <div className="flex justify-between items-center px-4 sm:px-6 mb-3">
          <h3 className="text-lg font-semibold text-primary-text">
            Items
          </h3>
          <Button
            type="button"
            variant="outline"
            onClick={handleAddRow}
            className="flex items-center gap-2"
          >
            <PlusCircle size={16} /> Add Item
          </Button>
        </div>

        <Table className="
          [&_td]:p-0
          [&_th]:p-0 [&_th]:px-3 
          sm:[&_td]:p-0
          sm:[&_th]:p-0"
        >
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-[60px]">-</TableHead>
              <TableHead className="text-center">Item Name</TableHead>
              <TableHead className="text-center w-25">Design No</TableHead>
              <TableHead className="text-center w-18">Size</TableHead>
              <TableHead className="text-center w-18">Qty</TableHead>
              <TableHead className="text-cente w-25">Price</TableHead>
              <TableHead className="text-center w-70">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveRow(index)}
                    className="w-[59px]! bg-transparent! rounded-none!"
                  >
                    <span className="material-symbols-outlined text-red-500 text-[21px]! font-bold!">close</span>
                  </button>
                </TableCell>
                <TableCell className="text-center">
                  <Select
                    value={item.productId}
                    onValueChange={(val) => handleChange(index, "productId", val)}
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

                <TableCell className="text-center">
                  {item.designNumber || "-"}
                </TableCell>

                <TableCell>
                  <Select
                    value={item.size}
                    onValueChange={(val) => handleChange(index, "size", val as size)}
                  >
                    <SelectTrigger className="bg-transparent! text-primary-text! w-full! focus:ring-0!">
                      <SelectValue placeholder="Select size" />
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
                    min={1}
                    max={999}
                    value={item.quantity}
                    className="w-18 text-center border-0 focus:ring-0!"
                    onChange={(e) => handleChange(index, "quantity", +e.target.value)}
                  />
                </TableCell>

                <TableCell>
                  <Input
                    min={0}
                    type="number"
                    value={item.price}
                    onChange={(e) =>handleChange(index, "price", +e.target.value)}
                    className="w-25 text-center border-0 focus:ring-0!"
                  />
                </TableCell>

                <TableCell className="text-center min-w-[80px] font-medium text-primary-text">
                  {item.total.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* =================== TOTAL & SUBMIT =================== */}
        <div className="flex justify-between items-center px-4 sm:px-6">
          <p className="text-md sm:text-lg font-semibold text-main">
            Grand Total:{" "}
            <span className="text-primary-text font-bold">{grandTotal.toFixed(2)}</span>
          </p>

          <div className="gap-2 w-max flex items-end justify-between text-md sm:text-lg font-semibold text-main">
            <span>Amount Paid: </span>
            <Input
              min={0}
              max={grandTotal}
              type="number"
              value={paidAmount}
              onChange={(e) => setPaidAmount(Number(e.target.value))}
              className="w-20! sm:w-28! shadow-none! border-0 border-b-2 border-border rounded-none
                text-primary-text focus-visible:ring-0 focus:border-main bg-transparent"
              required
            />
          </div>
        </div>

        {
          items.length > 0 ? (
            <Button type="submit" className="mt-8 ml-auto mr-4 sm:mr-6 py-6 px-8 font-bold!">
              Save Invoice
            </Button>
          ) : (
            <p className="text-red-500 px-4 sm:px-6 font-bold mt-[-15px]">Invoice must have one item to proceed!</p>
          )
        }
      </form>
    </>
  );
}