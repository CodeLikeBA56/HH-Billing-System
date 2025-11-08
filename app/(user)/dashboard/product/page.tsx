"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/types";
import { useProductContext } from "@/contexts/ProductProvider";
import { useNotification } from "@/contexts/NotificationProvider";
import EditProductDialog from "@/components/products/EditProductDialog";

const ManageProductPage: React.FC = () => {
  const { pushNotification } = useNotification();
  const { products, addProduct, deleteProduct, loading, error } = useProductContext();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [designNumber, setDesignNumber] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleOpenEdit = (product: Product) => {
    setSelectedProduct(product);
    setEditOpen(true);
  };

  const handleAddProduct = async () => {
    if (price < 0) {
      return pushNotification("warning", "Price must be a positive number.");
    }

    if (!name.trim() || !designNumber.trim()) {
      return pushNotification("warning", "Please fill all product fields.");
    }

    try {
      setSubmitting(true);
      await addProduct({
        name,
        designNumber,
        price: Number(price),
      });
      setName("");
      setPrice(0);
      setDesignNumber("");
      pushNotification("success", "Product added successfully.");
      setOpen(false);
    } catch {
      pushNotification("error", "Failed to add product.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      pushNotification("success", "Product deleted successfully.");
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="flex justify-between items-center px-5 py-5">
        <h1 className="text-2xl font-bold text-main">Products</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>+ Add Product</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>

            <div className="p-4 space-y-4">
              <Input
                placeholder="Product name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                placeholder="Design number"
                value={designNumber}
                onChange={(e) => setDesignNumber(e.target.value)}
              />
              <Input
                placeholder="Price"
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>

            <DialogFooter>
              <Button onClick={handleAddProduct} disabled={submitting}>
                {submitting ? "Adding..." : "Add Product"}
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
      {loading && <p className="text-secondary-text text-center py-5">Loading products...</p>}

      {/* Products Table */}
      {!loading && products.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="p-0">-</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Design No.</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="p-0">-</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.uid}>
                <TableCell className="p-0 w-[60px]">
                  <button
                    type="button"
                    className="bg-transparent! mx-auto"
                    onClick={() => handleOpenEdit(product)}
                  >
                    <span className="material-symbols-outlined text-green-500">edit</span>
                  </button>
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.designNumber}</TableCell>
                <TableCell>Rs. {product.price}</TableCell>
                <TableCell>
                  {product.createdAt
                    ? product.createdAt instanceof Date
                      ? product.createdAt.toLocaleDateString()
                      : "-"
                    : "-"}
                </TableCell>
                <TableCell className="p-0 w-[80px]">
                  <button
                    type="button"
                    className="bg-transparent! mx-auto"
                    onClick={() => handleDeleteProduct(product.uid as string)}
                  >
                    <span className="material-symbols-outlined text-red-500">delete</span>
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        !loading && <p className="px-5 py-3 text-secondary-text text-center">No products found.</p>
      )}

      <EditProductDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        product={selectedProduct}
      />
    </div>
  );
};

export default ManageProductPage;